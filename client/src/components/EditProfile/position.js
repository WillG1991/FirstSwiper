import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements'; // Import the Icon component from React Native Elements

const Position = ({ formState, handleChange }) => {
  const [isListOpen, setIsListOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(formState.position || '');
  const listRef = useRef(null);
  const chipRef = useRef(null);

  const handleOpenList = () => {
    setIsListOpen(!isListOpen);
  };

  const handleCloseList = () => {
    setIsListOpen(false);
  };

  const handleSelectChange = (value) => {
    setSelectedPosition(value);
    handleChange('position', value);
    handleCloseList();
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

    if (isListOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isListOpen]);

  const Positions = [
    'Top',
    'Vers Top',
    'Vers',
    'Vers Bottom',
    'Bottom',
    'Oral Only',
  ];

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
          <Icon name="import-export" size={24} color="white" style={{ marginRight: 8 }} />
          <Text style={{ color: 'white', fontSize: 16 }}>Position: {selectedPosition || ''}</Text>
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
          <Text style={{ textAlign: 'center', color: 'black' }}>Select a Position:</Text>
          {Positions.map((position) => (
            <TouchableOpacity
              key={position}
              onPress={() => handleSelectChange(position)}
              style={{
                padding: 8,
                textAlign: 'center',
                cursor: 'pointer',
                color: 'black',
              }}
            >
              <Text>{position}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default Position;
