import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Height = ({ formState, setFormState }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleComponentClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Handle saving the height value here
  };

  return (
    <View style={{ width: '100%' }}>
      <TouchableOpacity onPress={handleComponentClick}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#005b80',
          }}>
          <MaterialIcons name="height" size={20} color="white" />
          <Text style={{ color: 'white', marginLeft: 5 }}>
            Height: {formState.height || ''}
          </Text>
        </View>
      </TouchableOpacity>

      {isEditing && (
        <View
          style={{
            zIndex: 2,
            backgroundColor: 'rgba(0,0,0,0.75)',
            width: '100%',
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {/* Add your custom height input component here */}
          {/* For example, you can use TextInput */}
          {/* <TextInput
            value={formState.height}
            onChangeText={(text) => setFormState({ ...formState, height: text })}
            placeholder="Enter height"
            style={{
              backgroundColor: 'white',
              width: '80%',
              padding: 10,
              borderRadius: 5,
            }}
          /> */}
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <TouchableOpacity onPress={handleCancel} style={{ margin: 10 }}>
              <Text style={{ color: 'white' }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={{ margin: 10 }}>
              <Text style={{ color: 'white' }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default Height;
