import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements'; // Import Icon from react-native-elements
import StatusCircle from '../StatusCircle';

const getAge = (birthdate) => {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age.toString(); // Convert age to a string for display.
};

const UserInfo = ({ user }) => {
  return (
    <View style={{ alignItems: 'flex-start', position: 'relative', paddingHorizontal: 16, paddingVertical: 8 }}>
      <Text style={{ fontSize: 20, marginTop: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: 'white' }}>
            {user.username} <Text style={{ fontStyle: 'italic' }}>{getAge(user.age)}</Text>
          </Text>
        </View>
      </Text>
      <Text style={{ color: 'grey', marginTop: 0, fontSize: 12, fontFamily: 'Roboto Condensed, sans-serif' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <StatusCircle lastActive={user.lastActive} />
          <View style={{ marginRight: 5 }} /> {/* Add this line for the space */}
          {user.gender}, <Icon name="near-me" type="material" size={16} /> {user.distance} miles away
        </View>
      </Text>
      <Text style={{ color: 'white', marginTop: 0, fontSize: 12, fontFamily: 'Roboto Condensed, sans-serif' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="info" type="material" size={16} iconStyle={{ opacity: 0.7, position: 'relative', top: 3, left: -3 }} />
          <Text style={{ color: 'grey' }}>{user.ethnicity}</Text>
          <Text style={{ color: 'grey' }}> {user.height}</Text>
          <Text style={{ color: 'grey' }}> {user.weight} lbs.</Text>
          <Text style={{ color: 'grey' }}> {user.position}</Text>
        </View>
      </Text>
    </View>
  );
};

export default UserInfo;
