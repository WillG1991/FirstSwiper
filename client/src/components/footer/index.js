import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'; // Import Dimensions
import { IconButton } from 'react-native-paper'; // Assuming you're using the Paper library for icons
import logo from '../../assets/femswipelogo.svg'; // Update the image path

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <View style={styles.container}>
      <View style={styles.footer}>
        <View>
          <Image
            source={logo}
            style={{ height: 40, width: 'auto' }}
            resizeMode="contain"
          />
        </View>
        <View>
          <Text style={styles.text}>
            &copy; {currentYear} FemSwipe Beta
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <IconButton
            icon="twitter"
            onPress={() => {}}
            color="white"
          />
          <IconButton
            icon="reddit"
            onPress={() => {}}
            color="white"
          />
          <IconButton
            icon="instagram"
            onPress={() => {}}
            color="white"
          />
        </View>
      </View>
    </View>
  );
}

const windowHeight = Dimensions.get('window').height; // Get the height of the window

const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up the entire screen height
    justifyContent: 'flex-end', // Align the footer at the bottom
  },
  footer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%', // 100% width of the screen
  },
  text: {
    color: 'white',
  },
  iconContainer: {
    flexDirection: 'row',
  },
});
