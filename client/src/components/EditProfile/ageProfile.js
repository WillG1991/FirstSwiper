import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

const AgeProfile = ({ formState, handleChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempDate, setTempDate] = useState(formState.age);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const textFieldRef = useRef(null);

  const handleComponentClick = () => {
    setIsEditing(true);
    setTempDate(formState.age);
    setShowDatePicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setTempDate(selectedDate.toISOString().split('T')[0]);
      handleChange({ target: { name: 'age', value: selectedDate.toISOString().split('T')[0] } });
    }
    setIsEditing(false);
  };

  return (
    <View>
      <TouchableOpacity onPress={handleComponentClick}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#005b80' }}>
          <MaterialIcons name="cake" size={20} color="white" />
          <Text style={{ color: 'white', marginLeft: 5 }}>
            Birthdate: {tempDate}
          </Text>
        </View>
      </TouchableOpacity>

      {isEditing && (
        <Modal transparent animationType="slide" visible={showDatePicker}>
          <TouchableWithoutFeedback onPress={() => handleDateChange(null, null)}>
            <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
              <View style={{ backgroundColor: 'white', paddingBottom: 20 }}>
                <DateTimePicker
                  value={new Date(tempDate)}
                  mode="date"
                  maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
                  onChange={handleDateChange}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
};

export default AgeProfile;
