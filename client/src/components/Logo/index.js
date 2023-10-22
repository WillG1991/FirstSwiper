import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

// Import your SVG image (you may need to convert it to an SVG component)
import FemSwipeLogo from '../../images/femswipelogo.svg';

const Logo = () => {
  return (
    <View style={styles.container}>
      <Svg
        width={100}
        height={100}
        viewBox="0 0 100 100"
      >
        <Path
          d="M50 0C22.385 0 0 22.385 0 50s22.385 50 50 50 50-22.385 50-50S77.615 0 50 0zm0 92.595c-23.737 0-42.595-18.858-42.595-42.595S26.263 7.405 50 7.405c23.738 0 42.595 18.857 42.595 42.595S73.738 92.595 50 92.595zm-10.775-45.674l13.738 7.696v-15.39z"
          fill="#8e0b8a"
        />
      </Svg>
      <Text style={styles.text}>
        FEMSWIPE
        <Text style={{ fontSize: 12 }}> BETA</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
});

export default Logo;
