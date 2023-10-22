import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from 'graphql-tag';
import { View, Text, Button, Modal } from 'react-native'; // Import React Native components
import { useNavigation } from '@react-navigation/native'; // Import navigation hook as needed

const DELETE_USER = gql`
  mutation DeleteUser($myId: ID!) {
    deleteUser(myId: $myId) {
      success
      message
    }
  }
`;

const DeleteAccount = ({ myId }) => {
  const navigation = useNavigation(); // Use navigation hook for navigating in React Navigation
  const [deleteAccount] = useMutation(DELETE_USER);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteAccount = async () => {
    try {
      const { data } = await deleteAccount({ variables: { myId } });
      if (data.deleteUser.success) {
        console.log('Account deleted successfully.');

        // Remove token from AsyncStorage (you should use AsyncStorage instead of localStorage)
        // AsyncStorage.removeItem('id_token'); // Implement AsyncStorage logic

        // Redirect the user to the login page using React Navigation
        navigation.navigate('Login'); // Replace 'Login' with the name of your login screen
      } else {
        console.log('Error deleting account.');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <View style={{ paddingLeft: 20 }}>
      <Text style={{ fontWeight: '400', fontSize: 18 }}>Delete Account</Text>
      <Button title="Delete Account" color="red" onPress={handleClickOpen} />
      <Modal visible={open} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
            Confirm Account Deletion
          </Text>
          <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 20 }}>
            Are you sure you want to delete your account? This action cannot be undone.
          </Text>
          <Button title="Cancel" onPress={handleClose} />
          <Button
            title="Delete"
            color="red"
            onPress={() => {
              handleDeleteAccount();
              handleClose();
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

export default DeleteAccount;
