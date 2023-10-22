import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

class PrivacyPolicy extends React.Component {
  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Privacy Policy</Text>
        <Text style={styles.paragraph}>
          We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you how we collect, use, and protect your personal data when you visit our website.
        </Text>
        <Text style={styles.subHeading}>Information Collection and Use</Text>
        <Text style={styles.paragraph}>
          We may collect personal data that you voluntarily provide to us when you use our website, including your name, email address, and any other information you choose to share with us. We may use your personal data to communicate with you, provide services to you, or improve our website.
        </Text>
        <Text style={styles.subHeading}>Information Sharing and Disclosure</Text>
        <Text style={styles.paragraph}>
          We will not share or disclose your personal data to any third-party, except as required by law or to provide services to you.
        </Text>
        <Text style={styles.subHeading}>Data Security</Text>
        <Text style={styles.paragraph}>
          We take appropriate measures to protect your personal data from unauthorized access or disclosure.
        </Text>
        <Text style={styles.subHeading}>Terms of Use</Text>
        <Text style={styles.paragraph}>
          By using our website, you agree to the following terms:
        </Text>
        <View style={styles.listItem}>
          <Text>- We are not liable for any damages or losses that may result from your use of our website.</Text>
        </View>
        <View style={styles.listItem}>
          <Text>- We reserve the right to modify or discontinue our website at any time, without notice.</Text>
        </View>
        <View style={styles.listItem}>
          <Text>- You are solely responsible for any content that you post on our website.</Text>
        </View>
        <View style={styles.listItem}>
          <Text>- You agree to use our website in compliance with all applicable laws and regulations.</Text>
        </View>
        <Text style={styles.subHeading}>Disclaimer of Liability</Text>
        <Text style={styles.paragraph}>
          Our website is provided on an "as is" and "as available" basis. We do not warrant that our website will be uninterrupted or error-free. We are not liable for any damages or losses that may result from your use of our website, including but not limited to direct, indirect, incidental, punitive, and consequential damages. You acknowledge and agree that you use our website at your own risk.
        </Text>
        <Text style={styles.contact}>
          If you have any questions or concerns about our Privacy Policy and Terms of Use, please contact us at [contact email].
        </Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    padding: 16,
    borderRadius: 8,
    flexGrow: 1,
  },
  heading: {
    fontSize: 24,
    marginBottom: 16,
    color: 'white',
  },
  subHeading: {
    fontSize: 20,
    marginBottom: 8,
    marginTop: 16,
    color: 'white',
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 16,
    color: 'white',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  contact: {
    fontSize: 16,
    marginTop: 16,
    color: 'white',
  },
});

export default PrivacyPolicy;
