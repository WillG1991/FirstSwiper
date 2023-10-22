import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';

const Contact = () => {
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
          Contact Us
        </Text>
        <Text style={{ fontSize: 24, marginTop: 20, color: 'white' }}>
          Reasons to Contact Us
        </Text>
        <Text style={{ fontSize: 16, marginTop: 10, color: 'white' }}>
          You can contact us for various reasons, including:
        </Text>
        <Text style={{ fontSize: 16, marginTop: 10, color: 'white' }}>
          - General inquiries or feedback
        </Text>
        <Text style={{ fontSize: 16, marginTop: 10, color: 'white' }}>
          - Reporting issues or problems
        </Text>
        <Text style={{ fontSize: 16, marginTop: 10, color: 'white' }}>
          - Suggestions for improvements
        </Text>
        <Text style={{ fontSize: 16, marginTop: 10, color: 'white' }}>
          - Partnership opportunities
        </Text>
        <Text style={{ fontSize: 24, marginTop: 20, color: 'white' }}>
          Contact for Advertisements
        </Text>
        <Text style={{ fontSize: 16, marginTop: 10, color: 'white' }}>
          If you are interested in advertising with FemSwipe, here are some reasons why you should consider it:
        </Text>
        <Text style={{ fontSize: 16, marginTop: 10, color: 'white' }}>
          - Reach a diverse and engaged audience
        </Text>
        <Text style={{ fontSize: 16, marginTop: 10, color: 'white' }}>
          - Promote your products or services effectively
        </Text>
        <Text style={{ fontSize: 16, marginTop: 10, color: 'white' }}>
          - Increase brand visibility and awareness
        </Text>
        <Text style={{ fontSize: 16, marginTop: 10, color: 'white' }}>
          - Targeted advertising options
        </Text>
        <TouchableOpacity onPress={handleEmailPress} style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 16, color: 'white', textDecorationLine: 'underline' }}>
            Admin@Femswipe.com
          </Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 24, marginTop: 20, color: 'white' }}>
          Donate
        </Text>
        {/* Handle navigation to the donate screen using your navigation library */}
      </ScrollView>
    </View>
  );
};

export default Contact;
