import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../../utils/mutations';
import auth from '../../utils/auth';
import { Text, TextInput, Button, View } from 'react-native';

const Login = (props) => {
  const [formState, setFormState] = useState({ identifier: '', password: '' });
  const [login, { error }] = useMutation(LOGIN_USER);

  const handleChange = (name, value) => {
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async () => {
    try {
      // You can integrate a CAPTCHA library for React Native here
      // Get the recaptchaToken from the CAPTCHA library
      const recaptchaToken = 'your-recaptcha-token'; // Replace with the actual recaptcha token

      const variables = {
        ...formState,
        recaptchaToken: recaptchaToken,
      };

      const { data } = await login({
        variables: variables,
      });

      auth.login(data.login.token);
    } catch (e) {
      console.error('Error details:', e);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Your email or username"
        name="identifier"
        value={formState.identifier}
        onChangeText={(value) => handleChange('identifier', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="******"
        name="password"
        secureTextEntry={true}
        value={formState.password}
        onChangeText={(value) => handleChange('password', value)}
      />
      {error && <Text style={styles.errorText}>Login failed</Text>}
   
      <Button
        title="Login"
        onPress={handleFormSubmit}
        style={styles.button}
      />
    </View>
  );
};

export default Login;
