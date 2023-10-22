import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper'; // Assuming you have a package for icons like react-native-paper
import { Icon } from 'react-native-elements'; // Import the Icon component from React Native Elements

import logo from '../../../images/femswipelogo.svg';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const openLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View>
        <Image
          source={logo}
          alt="FemSwipe"
          style={{ height: 40, width: 'auto' }}
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
          onPress={() => openLink('https://twitter.com')}
          color="white"
          size={24}
        />
        <IconButton
          icon="reddit"
          onPress={() => openLink('https://reddit.com')}
          color="white"
          size={24}
        />
        <IconButton
          icon="instagram"
          onPress={() => openLink('https://instagram.com')}
          color="white"
          size={24}
        />
      </View>
      {/* Replace MUI icons with React Native Elements icons */}
      <Icon
        name="twitter"
        type="material"
        onPress={() => openLink('https://twitter.com')}
        color="white"
        size={24}
      />
      <Icon
        name="reddit"
        type="material"
        onPress={() => openLink('https://reddit.com')}
        color="white"
        size={24}
      />
      <Icon
        name="instagram"
        type="material"
        onPress={() => openLink('https://instagram.com')}
        color="white"
        size={24}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#ffffff',
  },
  text: {
    color: 'inherit',
  },
  iconContainer: {
    flexDirection: 'row',
  },
});
