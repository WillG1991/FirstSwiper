import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { useQuery, useApolloClient } from '@apollo/client';
import { GET_UNREAD_MESSAGE_COUNT } from '../../utils/queries';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

function SecondaryNav({ avatar, onProfileButtonClick, onSettingsButtonClick, id, username, requests, navigate }) {
  const [newFriendRequest, setNewFriendRequest] = useState(false);
  const [newMessage, setNewMessage] = useState(false);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const apolloClient = useApolloClient();
  const navigation = useNavigation();

  const handleGoBackToHomepage = () => {
    navigation.navigate('Home'); // Replace 'Home' with your desired route
  };

  useEffect(() => {
    // Your friendRequestSubscription code here
  }, [id]);

  useEffect(() => {
    // Your messageSubscription code here
  }, [id]);

  useEffect(() => {
    // Your messageCountQuery code here
  }, [username]);

  const renderIcon = () => {
    // Your renderIcon logic here
  };

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#161625', position: 'absolute', bottom: 0, left: 0, right: 0, padding: 10 }}>
      <TouchableOpacity onPress={() => navigate('Dashboard')}>
        {renderIcon()}
      </TouchableOpacity>
      <TouchableOpacity onPress={onProfileButtonClick}>
        {avatar ? (
          <Image style={{ width: 25, height: 25 }} source={{ uri: avatar[0] }} />
        ) : (
          <Icon name="account-circle" size={24} color="white" />
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={onSettingsButtonClick}>
        <Icon name="settings" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleGoBackToHomepage}>
        <Icon name="recent-actors" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

export default SecondaryNav;
