import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements'; // Import Icon from React Native Elements

export default function About() {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View style={styles.iconContainer}>
          {/* Replace FavoriteIcon with the Icon component */}
          <Icon
            name="favorite" // Set the name of the icon (you can adjust this)
            type="material" // Set the icon type (e.g., 'material', 'font-awesome')
            size={60} // Set the size of the icon
            style={styles.icon}
          />
        </View>
        <Text style={styles.title}>Dating</Text>
        <Text style={styles.description}>
          Find your perfect match and connect with like-minded individuals.
        </Text>
      </View>
      {/* Repeat the above View component for other sections */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  box: {
    padding: 20,
    backgroundColor: '#444444',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  icon: {
    // Adjust icon styles here (e.g., color, size)
    color: 'red', // Example: Set the color to red
  },
  title: {
    color: '#FFFFFF',
    fontFamily: 'Roboto, Sans Serif',
    fontWeight: 'bold',
    fontSize: 23,
  },
  description: {
    color: 'white',
    marginTop: 10,
    textAlign: 'center',
  },
});
