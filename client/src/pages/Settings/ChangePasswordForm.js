import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CHANGE_PASSWORD } from '../../utils/mutations';
import { Alert, Button, Text, TouchableOpacity, View, TextInput } from 'react-native';

const ChangePasswordForm = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [changePasswordMutation] = useMutation(CHANGE_PASSWORD);

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await changePasswordMutation({
        variables: {
          currentPassword,
          newPassword,
        },
      });

      setSuccessMessage('Password changed successfully!');
    } catch (error) {
      setError('Failed to change password. Please check your current password.');
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <View>
      <TouchableOpacity onPress={onClose} style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.2)', paddingBottom: '0.5em' }}>
        <Text>Back</Text>
        <Text style={{ paddingLeft: 10, fontWeight: '400' }}>Change Password</Text>
      </TouchableOpacity>
      {error && (
        <View style={{ paddingBottom: 0, marginBottom: 0 }}>
          <Alert severity="error" style={{ color: 'rgb(204, 232, 205)' }}>
            {error}
          </Alert>
        </View>
      )}
      <View>
        {successMessage && (
          <View style={{ width: '100%' }}>
            <Alert severity="success" style={{ color: 'rgb(204, 232, 205)' }}>
              {successMessage}
            </Alert>
          </View>
        )}
        {!successMessage && (
          <>
            <TextInput
              label="Current Password"
              placeholder="Current Password"
              secureTextEntry
              style={{ marginTop: 0, marginBottom: 10, padding: 8, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }}
              value={currentPassword}
              onChangeText={(text) => setCurrentPassword(text)}
            />
            <TextInput
              label="New Password"
              placeholder="New Password"
              secureTextEntry
              style={{ marginTop: 0, marginBottom: 10, padding: 8, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }}
              value={newPassword}
              onChangeText={(text) => setNewPassword(text)}
            />
            <TextInput
              label="Confirm New Password"
              placeholder="Confirm New Password"
              secureTextEntry
              style={{ marginTop: 0, marginBottom: 10, padding: 8, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }}
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
            />
            <Button title="Change Password" onPress={handleSubmit} color="secondary" />
          </>
        )}
      </View>
    </View>
  );
};

export default ChangePasswordForm;
