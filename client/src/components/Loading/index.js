import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LoadingScreen = () => {
  const [gradient, setGradient] = useState('#005b80');

  useEffect(() => {
    const interval = setInterval(() => {
      const color1 = getRandomColor();
      const color2 = getRandomColor();
      const newGradient = `linear-gradient(45deg, ${color1}, ${color2})`;
      setGradient(newGradient);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * letters.length);
      const randomLetter = letters[randomIndex];
      color += randomLetter;
    }
    return color;
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: gradient, position: 'relative', zIndex: 5 },
      ]}
    >
      <Text style={styles.text}>FemSwipe</Text>
      <Text style={styles.text}>Beta</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 48,
    textAlign: 'center',
  },
});

export default LoadingScreen;
