import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';

const Support = () => {
  const handleGoBack = () => {
    // Handle going back using React Navigation or your navigation library
  };

  const handleEmailPress = async () => {
    const email = 'Admin@Femswipe.com';
    await Linking.openURL(`mailto:${email}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.87)', padding: 20 }}>
      <ScrollView>
        <TouchableOpacity onPress={handleGoBack} style={{ marginBottom: 20 }}>
          <Text style={{ color: 'white', borderColor: 'white', borderWidth: 1, padding: 10 }}>
            Back
          </Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>
          Support
        </Text>
        <Text style={{ fontSize: 24, marginTop: 20, color: 'white' }}>
          Why Reach Out for Support?
        </Text>
        <Text style={{ fontSize: 16, marginTop: 10, color: 'white' }}>
          You can reach out to our support team for various reasons, including:
        </Text>
        <Text style={{ fontSize: 16, marginTop: 10, color: 'white' }}>
          - Questions or issues with your account
        </Text>
        <Text style={{ fontSize: 16, marginTop: 10, color: 'white' }}>
          - Reporting inappropriate content or behavior
        </Text>
        <Text style={{ fontSize: 16, marginTop: 10, color: 'white' }}>
          - Technical problems with the website or app
        </Text>
        <Text style={{ fontSize: 16, marginTop: 10, color: 'white' }}>
          - Assistance with using our features
        </Text>
        <Text style={{ fontSize: 16, marginTop: 10, color: 'white' }}>
          - Any other concerns or feedback
        </Text>
        <Text style={{ fontSize: 24, marginTop: 20, color: 'white' }}>
          Contact Us
        </Text>
        <Text style={{ fontSize: 16, marginTop: 10, color: 'white' }}>
          If you need assistance or have any questions, please don't hesitate to contact us at{' '}
          <TouchableOpacity onPress={handleEmailPress}>
            <Text style={{ color: 'white', textDecorationLine: 'underline' }}>
              Admin@Femswipe.com
            </Text>
          </TouchableOpacity>
          . Our dedicated support team is here to help you with any inquiries or issues you may have.
        </Text>
        <Text style={{ fontSize: 24, marginTop: 20, color: 'white' }}>
          Donate
        </Text>
        <Text style={{ fontSize: 16, marginTop: 10, color: 'white' }}>
          If you'd like to support our mission, you can donate using the following methods:
        </Text>
        {/* Handle navigation to the donate screen using your navigation library */}
      </ScrollView>
    </View>
  );
};

export default Support;
