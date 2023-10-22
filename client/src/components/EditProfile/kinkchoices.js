import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements'; // Import Icon from react-native-elements
import { kinkEmojis } from './kinks';

const KinkChoices = ({ user, selectableKinks, handleAddKink, handleDeleteKink }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleComponentClick = () => {
    setIsEditing(true);
  };

  const handleBackdropClick = () => {
    setIsEditing(false);
  };

  return (
    <View>
      <View>
        <TouchableOpacity
          onPress={handleComponentClick}
          style={{
            backgroundColor: '#005b80',
            padding: 8,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            flexDirection: 'row',
          }}
        >
          <Icon name="whatshot" type="material" size={24} color="white" />
          <Text style={{ color: 'white', fontSize: 16, marginLeft: 8 }}>Kinks</Text>
        </TouchableOpacity>
      </View>
      {isEditing && (
        <ScrollView
          contentContainerStyle={{
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: 999,
          }}
        >
          <View style={{ padding: 16 }}>
            {selectableKinks.map((kink) => {
              return !user.kinks.includes(kink) ? (
                <TouchableOpacity
                  key={kink}
                  onPress={() => handleAddKink(kink)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: 16,
                    padding: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text>{`${kinkEmojis[kink]} ${kink.toLowerCase()}`}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  key={kink}
                  onPress={() => handleDeleteKink(kink)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: 16,
                    padding: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text>{`${kinkEmojis[kink]} ${kink.toLowerCase()}`}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default KinkChoices;
