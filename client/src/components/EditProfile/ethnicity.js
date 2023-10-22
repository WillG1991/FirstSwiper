import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Ethnicities = [
  "White",
  "Black",
  "Pacific Islander",
  "Indian",
  "Asian",
  "Latin/Hispanic",
  "American Indian",
  "Other",
];

const Ethnicity = ({ formState, handleChange }) => {
  const [isListOpen, setIsListOpen] = useState(false);
  const [selectedEthnicity, setSelectedEthnicity] = useState(formState.ethnicity || '');
  const listRef = useRef(null);
  const chipRef = useRef(null);

  const handleOpenList = () => {
    setIsListOpen(!isListOpen);
  };

  const handleCloseList = () => {
    setIsListOpen(false);
  };

  const handleSelectChange = (value) => {
    setSelectedEthnicity(value);
    handleChange('ethnicity', value);
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
      // In React Native, you don't need to add and remove event listeners on document.
      // You can use the ScrollView component's `onPress` prop to handle outside clicks.
      // However, you'll need to wrap your entire component in a ScrollView to use this approach.
    }

    return () => {
      // Cleanup (not needed in React Native)
    };
  }, [isListOpen]);

  return (
    <View style={{ width: '100%' }}>
      <TouchableOpacity onPress={handleOpenList} ref={chipRef}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#005b80' }}>
          <MaterialIcons name="extension" size={20} color="white" />
          <Text style={{ color: 'white', marginLeft: 5 }}>
            Ethnicity: {selectedEthnicity || ''}
          </Text>
        </View>
      </TouchableOpacity>

      {isListOpen && (
        <ScrollView style={{ maxHeight: 200, zIndex: 2, width: '100%' }}>
          <View style={{ backgroundColor: 'white', borderRadius: 10 }}>
            <Text style={{ textAlign: 'center', color: 'black' }}>Select an ethnicity:</Text>
            {Ethnicities.map((ethnicity) => (
              <TouchableOpacity
                key={ethnicity}
                onPress={() => handleSelectChange(ethnicity)}
                style={{ padding: 8, backgroundColor: 'white' }}
              >
                <Text>{ethnicity}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default Ethnicity;
