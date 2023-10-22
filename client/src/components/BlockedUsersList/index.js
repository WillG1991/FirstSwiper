import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal } from 'react-native';
import { useQuery, useMutation } from '@apollo/client'; // Update with the appropriate Apollo Client for React Native
import { UNBLOCK_USER } from '../../utils/mutations';
import { GET_BLOCKED_USERS, QUERY_ME } from '../../utils/queries';
import { Avatar, Button, IconButton } from 'react-native-paper'; // You might need to use a different library or create custom components for certain UI elements
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Replace with appropriate icons library
import { useRecoilState } from 'recoil'; // Replace with an alternative state management library for React Native (e.g., Redux, Mobx)
import { meState } from '../../recoil/atoms';

const BlockedUsersList = ({ myId, onClose }) => {
  const { refetch: refetchMe } = useQuery(QUERY_ME);

  const [setMe] = useRecoilState(meState);

  const { data, loading, error, refetch } = useQuery(GET_BLOCKED_USERS, {
    variables: { myId },
    fetchPolicy: 'network-only',
  });

  const [unblockUser] = useMutation(UNBLOCK_USER);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const handleUnblockUser = async () => {
    if (selectedUser) {
      try {
        const { data } = await unblockUser({ variables: { userId: selectedUser._id } });
        if (data.unblockUser.success) {
          console.log('User unblocked successfully.');
          await refetch(); // Refetch the data after unblocking the user
          await refetchMe();
          const { data } = await refetchMe();
          console.log('what is data before state update: ', data);
          setMe(data);
        } else {
          console.log('Error unblocking user.');
        }
      } catch (error) {
        console.error('Error unblocking user:', error);
      }
    }
    setSelectedUser(null);
    setIsConfirmationOpen(false);
  };

  const openConfirmationDialog = (user) => {
    setSelectedUser(user);
    setIsConfirmationOpen(true);
  };

  const closeConfirmationDialog = () => {
    setSelectedUser(null);
    setIsConfirmationOpen(false);
  };

  // Replace Material-UI List with FlatList for better performance in React Native
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <IconButton color="white" onPress={onClose}>
          {/* Use an appropriate icon component for React Native */}
        </IconButton>
        <Text style={{ paddingLeft: 10, fontWeight: '400' }}>Unblock Users</Text>
      </View>
      <FlatList
        data={data?.getBlockedUsers?.blockedUsers}
        keyExtractor={(user) => user._id.toString()}
        renderItem={({ item: user }) => (
          <TouchableOpacity
            onPress={() => openConfirmationDialog(user)}
            style={{
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: 'rgba(255,255,255,0.2)',
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
            }}
          >
            <Avatar.Image
              source={{ uri: user.photoURL || '/placeholder.jpg' }}
              size={48}
            />
            <Text style={{ marginLeft: 10 }}>{user.username}</Text>
          </TouchableOpacity>
        )}
      />
      <Modal visible={isConfirmationOpen} onRequestClose={closeConfirmationDialog}>
        <View>
          <Text>Unblock User</Text>
          <Text>Are you sure you want to unblock {selectedUser?.username}?</Text>
          <Button onPress={closeConfirmationDialog}>Cancel</Button>
          <Button onPress={handleUnblockUser}>Unblock</Button>
        </View>
      </Modal>
    </View>
  );
};

export default BlockedUsersList;
