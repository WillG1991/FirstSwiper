import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import { useMutation } from '@apollo/client';
import { RESET_PASSWORD } from '../../utils/mutations';
import { useNavigation } from '@react-navigation/native';

const ResetPasswordForm = () => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigation = useNavigation();

  const { resetToken } = useParams();

  const getEmailFromURL = () => {
    // You may need to parse the URL parameters differently in a React Native environment
    // For simplicity, we assume you already have the 'email' value
    return 'user@example.com'; // Replace with your logic to get the email
  };

  const email = getEmailFromURL();

  const [resetPassword] = useMutation(RESET_PASSWORD);

  const handleSubmit = async () => {
    try {
      // eslint-disable-next-line no-unused-vars
      const { data } = await resetPassword({ variables: { resetToken, newPassword, email } });
      setMessage('Password reset successful');
      setTimeout(() => {
        navigation.navigate('Login'); // Use navigation to navigate to the login screen
      }, 2000);
    } catch (error) {
      console.error(error);
      setMessage('An error occurred');
    }
  };

  return (
    <ScrollView>
      <View style={{ alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 20, marginBottom: 20 }}>Reset Password</Text>
        <TextInput
          secureTextEntry
          style={{ borderWidth: 1, borderColor: 'gray', width: 300, padding: 10, marginBottom: 10 }}
          placeholder="New Password"
          value={newPassword}
          onChangeText={(text) => setNewPassword(text)}
        />
        <Button title="Reset Password" onPress={handleSubmit} />
        {message && <Text>{message}</Text>}
      </View>
    </ScrollView>
  );
};

export default ResetPasswordForm;
