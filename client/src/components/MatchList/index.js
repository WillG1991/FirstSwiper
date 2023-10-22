import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useQuery, useSubscription, useMutation, useApolloClient } from '@apollo/client';
import { QUERY_USERS_BY_ID, QUERY_ME, LAST_RECEIVED_MESSAGES } from '../../utils/queries';
import { GET_MESSAGES } from '../../utils/subscriptions';
import { createChannelId } from '../../utils/helperFunction';
import Divider from '@mui/material/Divider';
import moment from 'moment';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import StatusCircle from '../StatusCircle';
import { HIDE_FRIEND } from '../../utils/mutations';
import { useRecoilValue } from 'recoil';
import { meState } from '../../recoil/atoms';

const MatchList = (props) => {
  const client = useApolloClient();
  const [matchedProfiles, setMatchedProfiles] = useState(null);
  const [lastMessages, setLastMessages] = useState({});
  const [usernamesById, setUsernamesById] = useState({});
  const [myUsername, setMyUsername] = useState(null);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedConversations, setSelectedConversations] = useState([]);

  const [hideFriend] = useMutation(HIDE_FRIEND);

  const filteredIds = (props.matches || [])
    .filter((match) => match && match.friendId && match.friendId._id && match.friendId._id !== props.myID)
    .map((match) => match && match.friendId && match.friendId._id);

  const { data, refetch } = useQuery(QUERY_USERS_BY_ID, {
    variables: {
      _id: filteredIds,
    },
    fetchPolicy: 'network-only',
  });

  const { loading: meLoading, data: me } = useQuery(QUERY_ME); // old query runs everytime all over
  // let me = useRecoilValue(meState);

  let channelIds = [];
  if (props.matchedWithUsername) {
    try {
      channelIds = props.matchedWithUsername.map((username) => createChannelId(props.passUsername, username));
    } catch (error) {
      console.error('Error while mapping matchedWithUsernames:', error);
    }
  } else {
    console.error('matchedWithUsernames is undefined');
  }

  const { data: subscriptionData } = useSubscription(GET_MESSAGES, {
    variables: {
      channelId: channelIds.join(),
    },
  });

  const { data: messagesData, refetch: refetchMessages } = useQuery(LAST_RECEIVED_MESSAGES, {
    variables: {
      username: myUsername,
      recipient: '',
    },
    skip: !myUsername,
  });

  useEffect(() => {
    if (myUsername) {
      matchedProfiles?.usersById.forEach((user) => {
        if (user.username !== myUsername) {
          refetchMessages({ username: myUsername, recipient: user.username });
        }
      });
    }
  }, [myUsername, matchedProfiles, refetchMessages]);

  useEffect(() => {
    // if (me && !meLoading) { no longer running query so meloading not necessary
    if (me) {
      setMyUsername(me.me.username);
    }
  }, [me]);

  useEffect(() => {
    if (data) {
      const userIdToUsername = data.usersById.reduce((acc, user) => {
        acc[user._id] = user.username;
        return acc;
      }, {});
      setUsernamesById(userIdToUsername);
      setMatchedProfiles(data);

      data.usersById.forEach((user) => {
        if (user.username !== myUsername) {
          refetchMessages({ username: myUsername, recipient: user.username });
        }
      });
    }
  }, [data, refetchMessages, myUsername]);

  useEffect(() => {
    if (subscriptionData) {
      const message = subscriptionData.messagePosted;
      const partner = message.username === myUsername ? message.recipientId : message.username;

      setLastMessages((prevLastMessages) => {
        const updatedLastMessages = {
          ...prevLastMessages,
          [partner]: {
            username: usernamesById[partner],
            text: message.text,
            createdAt: message.createdAt,
          },
        };

        setMatchedProfiles((prevMatchedProfiles) => {
          const updatedUsers = [...prevMatchedProfiles.usersById];
          const index = updatedUsers.findIndex((user) => user._id === partner);
          if (index !== -1) {
            const currentUser = updatedUsers[index];
            updatedUsers.splice(index, 1);
            updatedUsers.unshift(currentUser);
          }
          return {
            ...prevMatchedProfiles,
            usersById: updatedUsers,
          };
        });

        localStorage.setItem('lastMessages', JSON.stringify(updatedLastMessages));

        return updatedLastMessages;
      });
    }
  }, [subscriptionData, myUsername, usernamesById, setLastMessages, setMatchedProfiles]);

  useEffect(() => {
    if (data && messagesData) {
      const userIdToUsername = usernamesById;
      const lastMessagesData = messagesData.lastReceivedMessages.reduce((acc, message) => {
        const partner = message.username === myUsername ? message.recipient : message.username;
        const lastMessage = {
          username: partner,
          text: message.text,
          createdAt: message.createdAt,
          read: message.read,
        };
        return {
          ...acc,
          [partner]: lastMessage,
        };
      }, {});

      data.usersById.forEach((user) => {
        if (!lastMessagesData[user.username]) {
          lastMessagesData[user.username] = {
            username: user.username,
            text: '',
            createdAt: '',
            read: true,
          };
        }
      });

      setLastMessages(lastMessagesData);
    }
  }, [data, messagesData, myUsername, setLastMessages, usernamesById]);

  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedConversations([]);
  };

  const handleCheckboxChange = (conversationId) => {
    if (selectedConversations.includes(conversationId)) {
      setSelectedConversations((prevSelectedConversations) =>
        prevSelectedConversations.filter((id) => id !== conversationId)
      );
    } else {
      setSelectedConversations((prevSelectedConversations) => [
        ...prevSelectedConversations,
        conversationId,
      ]);
    }
  };

  const handleUserClick = (user) => {
    if (isSelectMode) {
      handleCheckboxChange(user._id);
    } else {
      const partner = user.username;
      setLastMessages((prevLastMessages) => {
        return {
          ...prevLastMessages,
          [partner]: {
            ...prevLastMessages[partner],
            read: true,
          },
        };
      });
      props.userNameClick(user.username, user.photoURL);
    }
  };

  const handleDeleteConversations = async () => {
    setSelectedConversations((prevSelectedConversations) => {
      const updatedConversations = [...prevSelectedConversations];

      setLastMessages((prevLastMessages) => {
        const updatedLastMessages = { ...prevLastMessages };
        updatedConversations.forEach((conversationId) => {
          const partner = usernamesById[conversationId];
          delete updatedLastMessages[partner];
          hideFriend({ variables: { friendId: conversationId } });
        });
        return updatedLastMessages;
      });

      setMatchedProfiles((prevMatchedProfiles) => {
        const updatedUsers = [...prevMatchedProfiles.usersById];
        updatedConversations.forEach((conversationId) => {
          const index = updatedUsers.findIndex((user) => user._id === conversationId);
          if (index !== -1) {
            updatedUsers.splice(index, 1);
          }
        });
        return {
          ...prevMatchedProfiles,
          usersById: updatedUsers,
        };
      });

      return [];
    });
    await Promise.all(
      selectedConversations.map(async (conversationId) => {
        await hideFriend({ variables: { friendId: conversationId } });
      })
    );

    selectedConversations.forEach((conversationId) => {
      client.cache.evict({ id: `User:${conversationId}` });
      client.cache.gc();
    });
  };

  const getSortedUsers = () => {
    if (!matchedProfiles || !lastMessages) return [];

    // Filter out users with `isHidden` set to true
    const visibleUsers = (matchedProfiles?.usersById || []).filter((user) => {
      // Find the corresponding match object for the user
      const matchObj = props.matches.find((match) => match?.friendId?._id === user?._id);

      // If match object is not found or isHidden is true, exclude the user
      if (!matchObj || matchObj.isHidden) {
        return false;
      }
      return true;
    });

    // Then sort the remaining users
    return visibleUsers.sort((a, b) => {
      const aLastMessageTime = parseInt(lastMessages?.[a.username]?.createdAt || 0);
      const bLastMessageTime = parseInt(lastMessages?.[b.username]?.createdAt || 0);

      return bLastMessageTime - aLastMessageTime;
    });
  };

  useEffect(() => {
    const storedLastMessages = localStorage.getItem('lastMessages');
    if (storedLastMessages) {
      setLastMessages(JSON.parse(storedLastMessages));
    } else {
      setLastMessages({});
    }
  }, []);

  return (
    <ScrollView>
      <View>
        <TouchableOpacity onPress={toggleSelectMode} style={{ padding: 10 }}>
          <Text>{isSelectMode ? 'Done' : 'Select'}</Text>
        </TouchableOpacity>
        {isSelectMode && (
          <TouchableOpacity onPress={handleDeleteConversations} style={{ padding: 10 }}>
            <Text>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
      {getSortedUsers().map((user, index, arr) => (
        <React.Fragment key={user._id}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              position: 'relative',
              paddingLeft: '5%',
              paddingVertical: 10,
            }}
            onPress={() => handleUserClick(user)}
          >
            {isSelectMode && (
              <input
                type="checkbox"
                checked={selectedConversations.includes(user._id)}
                onChange={() => handleCheckboxChange(user._id)}
              />
            )}
            <View style={{ width: 60, height: 60, position: 'relative' }}>
              <Image
                source={{ uri: user.photoURL[0] }}
                style={{
                  width: '100%',
                  height: '100%',
                  aspectRatio: 1,
                  borderRadius: 30,
                }}
              />
              <View style={{ position: 'absolute', bottom: 0, right: 0, marginBottom: 2, marginRight: 3 }}>
                <StatusCircle lastActive={user.lastActive} />
              </View>
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{user.username}</Text>
              {!lastMessages[user.username] || !lastMessages[user.username].text ? (
                <Text style={{ fontSize: 12 }}>No messages yet..</Text>
              ) : lastMessages[user.username].text.startsWith('https://firebasestorage.googleapis.com') ? (
                <Text style={{ fontSize: 12 }}>Received an image</Text>
              ) : (
                <Text style={{ fontSize: 12 }}>{lastMessages[user.username].text}</Text>
              )}
            </View>
            {lastMessages[user.username]?.text && (
              <Text style={{ fontSize: 10, marginLeft: 'auto', paddingRight: '2%' }}>
                {lastMessages[user.username]?.createdAt &&
                  moment(parseInt(lastMessages[user.username].createdAt)).fromNow()}
                {!lastMessages[user.username]?.read && (
                  <FiberManualRecordIcon
                    style={{ fontSize: 12, color: '#9c27b0', marginLeft: 5 }}
                  />
                )}
              </Text>
            )}
          </TouchableOpacity>
          {index !== arr.length - 1 && (
            <Divider style={{ backgroundColor: 'rgba(255,255,255,0.5)', width: '100%', opacity: 0 }} />
          )}
        </React.Fragment>
      ))}
      {getSortedUsers().length === 0 && (
        <View style={{ justifyContent: 'center', padding: 10 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white' }}>No Messages Yet</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default MatchList;
