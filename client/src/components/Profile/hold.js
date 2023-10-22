import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Chip } from 'react-native-paper';

const CustomCardContent = ({ user, getAge, city, kinkEmojis }) => {
  return (
    <ScrollView>
      <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
        <View style={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 30 }}>
            {user.username}, <Text style={{ fontSize: 18 }}>{getAge(user.age)}</Text>
          </Text>
          {user.location && <Text style={{ fontSize: 20 }}>{city}</Text>}
        </View>
        <Text style={{ textAlign: 'center', marginBottom: 20, fontSize: 15 }}>{user.description}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 10 }}>
          {user.kinks.map((kink) => (
            <Chip
              key={kink}
              textStyle={{ fontSize: 12 }}
              style={{ margin: 5 }}
            >
              <Text>{kinkEmojis[kink]} {kink}</Text>
            </Chip>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default CustomCardContent;
