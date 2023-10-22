import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useMutation } from '@apollo/client';
import { REQUEST_RESET_PASSWORD } from '../../utils/mutations';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [requestResetPassword] = useMutation(REQUEST_RESET_PASSWORD);

  const handleSubmit = async () => {
    try {
      const { data } = await requestResetPassword({ variables: { email } });
      setMessage(data.requestResetPassword);
    } catch (error) {
      console.error(error);
      setMessage('We couldn\'t find that account');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Your Email"
        placeholderTextColor="rgba(255,255,255,0.8)"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Request Password Reset</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#8e0b8a',
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingLeft: 15,
    marginBottom: 10,
    color: 'white',
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: '#8e0b8a',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  message: {
    color: 'white',
    marginBottom: 10,
  },
});

export default ForgotPasswordForm;
