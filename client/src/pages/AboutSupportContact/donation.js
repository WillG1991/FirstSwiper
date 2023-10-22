import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';

const Donation = () => {
  const handleGoBack = () => {
    // Handle going back using React Navigation or your navigation library
  };

  const handleStripeButtonPress = async (buyButtonId) => {
    // Handle the Stripe button press, you can implement this functionality as needed
    // You may use a library or navigate to a web page with Stripe integration.
    // Example: Linking.openURL('https://your-stripe-payment-url.com');
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.87)', padding: 20 }}>
      <ScrollView>
        <TouchableOpacity onPress={handleGoBack} style={{ marginBottom: 20 }}>
          <Text style={{ color: 'white', borderColor: 'white', borderWidth: 1, padding: 10 }}>
            Back
          </Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: 'white' }}>
          Contribute to the growth of FemSwipe with a one-time donation that fuels our ongoing operations and fosters development.
        </Text>
        <View style={{ display: 'flex', flexDirection: 'column', marginTop: 20 }}>
          {/* Implement Stripe button functionality as needed */}
          <TouchableOpacity onPress={() => handleStripeButtonPress("buy_btn_1NsYJkD5kg11ZT6kc4YAPwIf")} style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5, alignItems: 'center' }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Stripe Buy Button 1</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleStripeButtonPress("buy_btn_1NsnbwD5kg11ZT6kViK52mrZ")} style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 10 }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Stripe Buy Button 2</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleStripeButtonPress("buy_btn_1NsndAD5kg11ZT6kUXboll9M")} style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 10 }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Stripe Buy Button 3</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleStripeButtonPress("buy_btn_1NsneLD5kg11ZT6kQOOdXSFO")} style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 10 }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Stripe Buy Button 4</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 14, marginTop: 20, textAlign: 'center', color: 'white' }}>
          A one-time charge will appear on your statement from FS.Com DEV
        </Text>
      </ScrollView>
    </View>
  );
};

export default Donation;
