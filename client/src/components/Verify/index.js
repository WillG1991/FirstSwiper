import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { useMutation } from '@apollo/client';
import { VERIFY_USER } from '../../utils/mutations';

const Verify = ({ route, navigation }) => {
  const [userIsVerified, setUserIsVerified] = useState(null);
  const { verificationToken, email } = route.params; // Get params from route

  const [verifyUser] = useMutation(VERIFY_USER);

  const handleVerification = async () => {
    try {
      const { data } = await verifyUser({ variables: { verificationToken, email } });
      setUserIsVerified('Thank you for verifying your account.');
      setTimeout(() => {
        navigation.navigate('Login'); // Navigate to the Login screen
      }, 2000);
    } catch (error) {
      console.error(error);
      setUserIsVerified('An error occurred');
    }
  };

  useEffect(() => {
    if (userIsVerified === null) {
      handleVerification();
    }
  }, [userIsVerified]);

  return (
    <View>
      {userIsVerified && <Text>{userIsVerified}</Text>}
    </View>
  );
};

export default Verify;
