import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import badPhone from '../../assets/icon.png'; // Update the image path

const Hero = () => {
  return (
    <View>
          <Text style={styles.title}>
            Connect With Crossdressers, Femboys, Sissies, Trans Women & Their Admirers For Free
          </Text>
          <Text style={styles.description}>
            Meet and chat with crossdressers, femboys, sissies, trans women, and their admirers in your area. Free sign-up and chat, find sissies/crossdressers,
            trans women, and admirers in your area and filter by specific kinks.
          </Text>
          </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#000', // Background color
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: '#FFFFFF',
    fontFamily: 'Roboto, Sans Serif',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    color: '#FFFFFF',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  homePhone: {
    alignSelf: 'center',
    width: '100%', // Make the image take full width
    height: 'auto', // Allow the height to adjust accordingly
  },
});

export default Hero;
