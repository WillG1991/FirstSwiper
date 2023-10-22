import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function getUserStatus(lastActive) {
  if (!lastActive) return 'offline';
  const now = Date.now();
  const lastActiveDate = new Date(Number(lastActive));
  const difference = now - lastActiveDate;
  const differenceInMinutes = Math.floor(difference / 1000 / 60);
  return differenceInMinutes <= 30 ? 'online' : 'offline';
}

function StatusCircle({ lastActive }) {
  const status = getUserStatus(lastActive);
  const color = status === 'online' ? '#11d211' : 'red';

  const styles = StyleSheet.create({
    circle: {
      width: 10,
      height: 10,
      borderRadius: 5, // Half of the width and height to create a circle
      backgroundColor: color,
      color: 'white',
      textAlign: 'center',
      lineHeight: 20,
    },
  });

  return (
    <View style={[styles.circle]}>
      {/* You can add text or additional styling within the View if needed */}
    </View>
  );
}

export default StatusCircle;
