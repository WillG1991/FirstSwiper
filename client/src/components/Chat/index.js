import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Image } from 'react-native';
import { useSubscription, useLazyQuery, useQuery, useMutation } from '@apollo/client'; // Update with the appropriate Apollo Client for React Native
import { GET_MESSAGES, USER_BLOCKED_SUBSCRIPTION } from '../../utils/subscriptions';
import { QUERY_MESSAGES, QUERY_MESSAGES_TO_RECIPIENT } from '../../utils/queries';
import { POST_MESSAGE, UPDATE_MESSAGE } from '../../utils/mutations';
import dateFormat from '../../utils/dateFormat';
import ChatFileUpload from './chatFileUpload';

const Chat = (props) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [setNewMessages] = useState(0);
  const [showTimestamps, setShowTimestamps] = useState(false);
  const [username, setUsername] = useState(null);
  const [recipient, setRecipient] = useState(null);
  const [channelId, setChannelId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isMarkedAsRead, setIsMarkedAsRead] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const { data: subscriptionData } = useSubscription(USER_BLOCKED_SUBSCRIPTION, {
    variables: { userId: props.myData.me._id }
  });

  useEffect(() => {
    if (subscriptionData) {
      console.log(subscriptionData);
    }
  }, [subscriptionData]);

  useEffect(() => {
    messages.forEach((message) => {
      if (message.username === props.currentChatPartner && !message.read && !isMarkedAsRead) {
        markMessageAsRead(message._id);
        setIsMarkedAsRead(true);
      }
    });
  }, [props.currentChatPartner, messages, markMessageAsRead, isMarkedAsRead]);

  useEffect(() => {
    setUsername(props.username);
    setRecipient(props.currentChatPartner);
    setChannelId(props.channelId);
  }, [props.username, props.currentChatPartner, props.channelId]);

  const markMessageAsRead = async (messageId) => {
    try {
      await updateMessage({
        variables: {
          id: messageId,
          input: {
            read: true,
          },
        },
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const [updateMessage] = useMutation(UPDATE_MESSAGE);

  const { data, error } = useSubscription(GET_MESSAGES, {
    variables: { channelId: props.channelId },
    onSubscriptionData: ({ subscriptionData }) => {
      const newMessage = subscriptionData.data.messagePosted;
      setMessages((prevMessages) => {
        const updatedMessages = prevMessages.concat(newMessage);
        organizeMessages(updatedMessages);
        return updatedMessages;
      });
      setNewMessages((prev) => prev + 1);
      setChannelId(newMessage.channelId);
      if (newMessage.username === props.currentChatPartner) {
        markMessageAsRead(newMessage._id);
      }
    },
    onError: (error) => {
      // Handle the error here.
    },
  });

  const [getMessagesTo, { data: messagesTo, loading: loadingMessagesTo }] = useLazyQuery(
    QUERY_MESSAGES_TO_RECIPIENT,
    {
      variables: { username: props.myData.me.username, recipient: props.currentChatPartner },
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        setMessages((prevMessages) => {
          const updatedMessages = prevMessages.concat(data.messagesToRecipient);
          organizeMessages(updatedMessages);
          return updatedMessages;
        });
      },
    }
  );

  const [getMessagesFrom, { data: messagesFrom, loading: loadingMessagesFrom }] = useLazyQuery(
    QUERY_MESSAGES_TO_RECIPIENT,
    {
      variables: { username: props.currentChatPartner, recipient: props.myData.me.username },
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        setMessages((prevMessages) => {
          const updatedMessages = prevMessages.concat(data.messagesToRecipient);
          organizeMessages(updatedMessages);
          return updatedMessages;
        });
      },
    }
  );

  const { subscribeToMore, data: result, loading: loadingMessages } = useQuery(QUERY_MESSAGES);

  const organizeMessages = (mergedMessages) => {
    mergedMessages.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
    setMessages(mergedMessages.slice(-50));
  };

  const handleChange = (text) => {
    setMessage(text);
  };

  const handleClose = () => {
    setOpen(false);
    props.onCloseBackdrop();
  };

  const textRef = useRef(null);

  const postIt = async () => {
    if (message !== '') {
      try {
        await postMessage({
          variables: {
            username: props?.myData.me.username,
            text: message,
            recipient: props?.currentChatPartner,
          },
        });
        setMessage('');
        textRef.current.focus();
      } catch (error) {
        console.error("Error while sending the message:", error);
        setErrorMessage("You've been blocked");
        setOpen(true);
      }
    }
  };

  const postImageMessage = async (fileURL, message) => {
    try {
      const isImage = message.startsWith('https://firebasestorage.googleapis.com');
      if (isImage) {
        await postMessage({
          variables: {
            username: props?.myData.me.username,
            text: fileURL,
            recipient: props?.currentChatPartner,
          },
        });
      } else {
        await postMessage({
          variables: {
            username: props?.myData.me.username,
            text: fileURL,
            recipient: props?.currentChatPartner,
          },
        });
      }
    } catch (e) {
      console.error('Error while sending the image message:', e);
    }
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (props.currentChatPartner) {
      getMessagesTo();
    }
  }, [props.currentChatPartner, getMessagesTo]);

  useEffect(() => {
    if (props.currentChatPartner) {
      getMessagesFrom();
    }
  }, [props.currentChatPartner, getMessagesFrom]);

  useEffect(() => {
    setUsername(props.username);
    setRecipient(props.currentChatPartner);
  }, [props.username, props.currentChatPartner, setRecipient, setUsername]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <View key={messages.length} style={{ flex: 1, width: '100%' }}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {messages.map((message, index) => {
            const isImage = message.text.startsWith('https://firebasestorage.googleapis.com');
            const isSender = message.username === username;
            return (
              <View
                key={index}
                style={{
                  flexDirection: 'column',
                  margin: 5,
                  alignItems: isSender ? 'flex-end' : 'flex-start',
                }}
                ref={index === messages.length - 1 ? messagesEndRef : null}
              >
                {isImage ? (
                  <TouchableOpacity onPress={() => setSelectedImage(message.text)}>
                    <Image
                      source={{ uri: message.text }}
                      style={{ maxWidth: 200, height: 200 }}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'column',
                      backgroundColor: isSender ? 'blue' : 'red',
                      padding: 8,
                      borderRadius: 8,
                      maxWidth: '80%',
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 16 }}>{message.text}</Text>
                    {showTimestamps && (
                      <Text style={{ color: 'white', fontSize: 12 }}>
                        {dateFormat(parseInt(message.createdAt))}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </ScrollView>
        {errorMessage && (
          <Modal
            visible={open}
            onRequestClose={handleClose}
            animationType="slide"
          >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text>{errorMessage}</Text>
              <TouchableOpacity onPress={handleClose}>
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        )}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}>
        <ChatFileUpload
          postImageMessage={postImageMessage}
          username={props?.myData.me.username}
          recipient={props?.currentChatPartner}
        />
        <TextInput
          ref={textRef}
          style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.6)', color: 'rgba(255, 255, 255, 0.6)' }}
          onChangeText={handleChange}
          value={message}
          placeholder="Type here"
          onSubmitEditing={postIt}
        />
        <TouchableOpacity onPress={postIt}>
          <Text>Send</Text>
        </TouchableOpacity>
      </View>
      {selectedImage && (
        <Modal
          visible={true}
          onRequestClose={() => setSelectedImage(null)}
          animationType="slide"
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={{ uri: selectedImage }}
              style={{ maxWidth: '90%', maxHeight: '90%' }}
            />
            <TouchableOpacity onPress={() => setSelectedImage(null)}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default Chat;
