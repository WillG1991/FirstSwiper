import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useSubscription } from '@apollo/client';
import { FRIEND_REQUEST_SENT_SUBSCRIPTION } from '../../../utils/subscriptions';
import StatusCircle from '../../StatusCircle';
import CheckIcon from 'react-native-vector-icons/MaterialIcons';
import ClearIcon from 'react-native-vector-icons/MaterialIcons';

const RequestsList = ({ friendRequests, handleAccept, setFriendRequests, userId, handleDecline }) => {
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [subscriptionFriendRequest, setSubscriptionFriendRequest] = useState(null);
  const { data: subscriptionData } = useSubscription(FRIEND_REQUEST_SENT_SUBSCRIPTION, { variables: { userId: userId } });

  useEffect(() => {
    if (subscriptionData && subscriptionData.friendRequestSent) {
      setSubscriptionFriendRequest(subscriptionData.friendRequestSent);
    }
  }, [subscriptionData]);

  useEffect(() => {
    if (subscriptionFriendRequest) {
      setFriendRequests(prevFriendRequests => {
        const updatedFriendRequests = [...prevFriendRequests];
        updatedFriendRequests.push(subscriptionFriendRequest);
        return updatedFriendRequests;
      });
    }
  }, [subscriptionFriendRequest, setFriendRequests]);

  useEffect(() => {
    // Additional logic based on the updated friendRequests
  }, [friendRequests]);

  const handleAcceptWithLoading = async (friend) => {
    setLoading(true);
    await handleAccept(friend);
    setLoading(false);
  };

  const handleDeclineWithLoading = async (friend) => {
    setLoading(true);
    await handleDecline(friend);
    setLoading(false);
  };

  const openUserInformation = (user) => {
    setSelectedUser(user);
  };

  const closeUserInformation = () => {
    setSelectedUser(null);
  };

  return (
    <>
      {friendRequests && (
        <FlatList
          data={friendRequests.filter(request => request.friendId)}
          keyExtractor={(request) => request._id}
          renderItem={({ item, index }) => (
            <View key={item._id}>
              {loading && (
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                  <ActivityIndicator size="large" color="white" />
                </View>
              )}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => openUserInformation(item.friendId)}>
                  <Image
                    source={{ uri: item.friendId.photoURL[0] || 'https://via.placeholder.com/50' }}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                      marginRight: 10,
                    }}
                  />
                  <View style={{ position: 'absolute', bottom: 10, right: 5 }}>
                    <StatusCircle lastActive={item.friendId.lastActive} />
                  </View>
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                    {item.friendId.username}
                  </Text>
                  <Text style={{ fontSize: 12 }}>
                    Sent you a match request.
                  </Text>
                </View>
                <Text style={{ fontSize: 10, marginLeft: 'auto', paddingRight: '2%' }}>
                  {moment(parseInt(item.createdAt)).fromNow()}
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity onPress={() => handleAcceptWithLoading(item.friendId)} style={{ marginRight: 5 }}>
                    <CheckIcon name="check" size={24} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeclineWithLoading(item.friendId)} disabled={loading}>
                    <ClearIcon name="clear" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
              {index !== friendRequests.length - 1 && (
                <View style={{ marginVertical: 10, borderBottomWidth: 1, borderColor: 'gray' }} />
              )}
            </View>
          )}
        />
      )}
      {selectedUser && (
        <NewMessageProfile open={true} onClose={closeUserInformation} selectedUser={selectedUser} />
      )}
    </>
  );
};

export default RequestsList;
