import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements'; // Import the Icon component from React Native Elements

const Role = ({ formState, handleChange }) => {
  const [isListOpen, setIsListOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(formState.role || '');
  const listRef = useRef(null);
  const chipRef = useRef(null);

  const handleOpenList = () => {
    setIsListOpen(!isListOpen);
  };

  const handleSelectChange = (value) => {
    setSelectedRole(value);
    handleChange('role', value);
    setIsListOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (listRef.current && !listRef.current.contains(event.target)) {
        // Check if the click target is not the ChipWrapper itself
        if (chipRef.current && !chipRef.current.contains(event.target)) {
          setIsListOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const Roles = ['sissy', 'admirer'];

  return (
    <View style={{ width: '100%' }}>
      <View>
        <TouchableOpacity
          onPress={handleOpenList}
          style={{
            backgroundColor: '#005b80',
            padding: 8,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            flexDirection: 'row',
          }}
          ref={chipRef}
        >
          <Icon name="person" size={24} color="white" style={{ marginRight: 8 }} />
          <Text style={{ color: 'white', fontSize: 16 }}>Role: {selectedRole || ''}</Text>
        </TouchableOpacity>
      </View>
      {isListOpen && (
        <ScrollView
          contentContainerStyle={{
            backgroundColor: 'white',
            borderRadius: 10,
            padding: 8,
          }}
        >
          <Text style={{ textAlign: 'center', color: 'black' }}>Select a Role:</Text>
          {Roles.map((role) => (
            <TouchableOpacity
              key={role}
              onPress={() => handleSelectChange(role)}
              style={{
                padding: 8,
                textAlign: 'center',
                cursor: 'pointer',
                color: 'black',
              }}
            >
              <Text>{role}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default Role;
