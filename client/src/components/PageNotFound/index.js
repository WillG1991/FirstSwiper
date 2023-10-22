import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PageNotFound = () => {
  return (
    <View style={styles.container}>
      <Text>Oops, we couldn't find that page.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PageNotFound;
