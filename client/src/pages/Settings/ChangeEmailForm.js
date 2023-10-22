import React, { useState } from 'react';
import { Alert, Button, TextInput, View, Text, TouchableOpacity } from 'react-native';
import { useMutation } from '@apollo/client';
import { CHANGE_EMAIL } from '../../utils/mutations';

const ChangeEmailForm = ({ onClose }) => {
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [changeEmailMutation] = useMutation(CHANGE_EMAIL);

  const handleSubmit = async () => {
    if (!newEmail || !password) {
      setError('All fields are required');
      return;
    }

    try {
      const { data } = await changeEmailMutation({
        variables: { newEmail, password },
      });

      setSuccessMessage(`Email changed to ${data.changeEmail.email}`);
    } catch (error) {
      setError('Failed to change email. Please check your password.');
      console.error('Error changing email:', error);
    }

    setNewEmail('');
    setPassword('');
  };

  return (
    <View>
      <TouchableOpacity onPress={onClose}>
        <Text>Back</Text>
      </TouchableOpacity>
      <Text>Change Email</Text>
      {error && (
        <Alert>
          {error}
        </Alert>
      )}
      {successMessage && (
        <Alert>
          {successMessage}
        </Alert>
      )}
      {!successMessage && (
        <View>
          <TextInput
            label="New Email"
            placeholder="New Email"
            value={newEmail}
            onChangeText={(text) => setNewEmail(text)}
          />
          <TextInput
            label="Confirm Current Password"
            placeholder="Confirm Current Password"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <Button title="Change Email" onPress={handleSubmit} />
        </View>
      )}
    </View>
  );
};

export default ChangeEmailForm;
