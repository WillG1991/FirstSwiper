import React, { useState, useEffect } from 'react';
import { useSubscription } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import { FRIEND_REQUEST_SENT_SUBSCRIPTION, GET_MESSAGES } from '../../utils/subscriptions';
import { Snackbar, View, Text, TouchableOpacity } from 'react-native';
import { IconButton, Avatar, Badge } from 'react-native-paper';
import { useRecoilValue } from 'recoil';
import { meState } from '../../recoil/atoms';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

// ...

function Nav() {
  const navigation = useNavigation(); // Use useNavigation to access navigation functionality

  // ...

  return (
    <>
      <Snackbar
        visible={openSnackbar}
        onDismiss={handleCloseSnackbar}
        action={action}
        style={{ backgroundColor: 'black', position: 'absolute', top: 0, right: 0 }}
      >
        {message}
      </Snackbar>

      <View
        style={{
          display: 'none',
          width: '100%',
          height: 64,
          position: 'absolute',
          bottom: 0,
          zIndex: 10,
          backgroundColor: 'black',
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {auth.loggedIn() ? (
            <>
              <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <IconButton>
                  <HomeIcon style={{ color: '#fff' }} />
                </IconButton>
                <Text style={{ color: '#fff' }}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setNewFriendRequest(false);
                  setNewMessage(false);
                  navigation.navigate('Inbox'); // Navigate to the Inbox screen
                }}
              >
                <IconButton>
                  <Badge
                    visible={newFriendRequest || newMessage}
                    size={24}
                    style={{ backgroundColor: 'red', color: 'white' }}
                  >
                    <ChatIcon style={{ color: '#fff' }} />
                  </Badge>
                </IconButton>
                <Text style={{ color: '#fff' }}>Chats</Text>
              </TouchableOpacity>
              {/* ... Other navigation links */}
            </>
          ) : (
            <>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <IconButton>
                  <PersonAddIcon style={{ color: '#fff' }} />
                </IconButton>
                <Text style={{ color: '#fff' }}>Sign Up</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <IconButton>
                  <LockOpenIcon style={{ color: '#fff' }} />
                </IconButton>
                <Text style={{ color: '#fff' }}>Log in</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </>
  );
}

export default Nav;
