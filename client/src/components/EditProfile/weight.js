import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Chip } from 'react-native-paper';
import { Icon } from 'react-native-elements'; // Import Icon from react-native-elements

const Weight = ({ formState, setFormState }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [sliderValue, setSliderValue] = useState(Number(formState.weight));

  const handleComponentClick = () => {
    setIsEditing(true);
  };

  const handleBackdropClick = () => {
    setIsEditing(false);
    setFormState((prevState) => ({
      ...prevState,
      weight: sliderValue.toString(),
    }));
  };

  const handleSliderChange = (newValue) => {
    setSliderValue(newValue);
  };

  const handleSliderChangeCommitted = (newValue) => {
    setIsEditing(false);
    setFormState((prevState) => ({
      ...prevState,
      weight: newValue.toString(),
    }));
  };

  return (
    <View style={{ alignItems: 'center' }}>
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
          <Icon
            name="scale" // Specify the appropriate icon name
            type="material" // Specify the icon library/type
            color="white"
            style={{ marginRight: 8 }}
          />
          <Text style={{ color: 'white', fontSize: 16 }}>Weight: {sliderValue} lbs.</Text>
        </TouchableOpacity>
      </View>
      {isEditing && (
        <View
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            padding: 8,
            paddingTop: 0,
            zIndex: 2,
            width: '100%',
            maxHeight: 200,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          }}
        >
          {/* The Slider component was removed */}
        </View>
      )}
    </View>
  );
};

export default Weight;
