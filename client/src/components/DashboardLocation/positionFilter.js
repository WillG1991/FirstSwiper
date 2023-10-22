import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Icon } from 'react-native-elements';

const Positions = {
  ALL: '',
  TOP: 'Top',
  VERSTOP: 'Vers Top',
  VERS: 'Vers',
  VERSBOTTOM: 'Vers Bottom',
  BOTTOM: 'Bottom',
  ORAL_ONLY: 'Oral Only',
};

const PositionSelection = ({ selectedPosition, onPositionSelect }) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [valueGroups, setValueGroups] = useState({
    position: selectedPosition || 'ALL',
  });
  const optionGroups = Object.values(Positions);

  useEffect(() => {
    if (valueGroups.position !== 'ALL') {
      setIsPickerOpen(false);
    }
  }, [valueGroups.position]);

  const handleChange = (value) => {
    setValueGroups({ position: value });
    onPositionSelect(value === 'ALL' ? '' : value);
    setIsPickerOpen(false); // Close the list after selection
  };

  const handleBoxClick = () => {
    setIsPickerOpen(!isPickerOpen); // Toggle the list visibility
  };

  const handleClearClick = () => {
    setValueGroups({ position: 'ALL' });
    onPositionSelect('');
    setIsPickerOpen(false);
  };

  return (
    <View>
      <TouchableOpacity onPress={handleBoxClick}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#2e84b4',
            padding: 8,
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          <Text style={{ color: 'white' }}>
            They are: {valueGroups.position !== 'ALL' ? valueGroups.position : ''}
          </Text>
          {valueGroups.position !== 'ALL' && (
            <TouchableOpacity onPress={handleClearClick}>
              <Icon
                name="close" // Use the appropriate icon name for clear (it depends on the icon set you're using)
                type="material" // Use the correct icon library and type
                style={{ marginLeft: 5, cursor: 'pointer' }}
              />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
      {isPickerOpen && (
        <View
          style={{
            overflow: 'auto',
            maxHeight: 200,
            marginTop: 10,
          }}
        >
          <FlatList
            data={optionGroups}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleChange(item)}
                style={{
                  backgroundColor: valueGroups.position === item ? '#eee' : 'transparent',
                  fontSize: 15,
                  lineHeight: 1.5,
                  padding: 4,
                  borderRadius: 4,
                  marginBottom: 4,
                  alignItems: 'center',
                }}
              >
                <Text style={{ cursor: 'pointer' }}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default PositionSelection;
