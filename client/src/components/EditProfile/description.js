import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Modal, TouchableWithoutFeedback } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Description = ({ formState, handleChange }) => {
  const [open, setOpen] = useState(false);
  const descriptionRef = useRef(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleBackdropClick = (event) => {
    // check if the click is inside the descriptionRef element
    if (!descriptionRef.current.contains(event.target)) {
      handleClose();
    }
  };

  const handleInputChange = (text, field) => {
    handleChange({ target: { name: field, value: text } });
  };

  return (
    <>
      <View>
        <TouchableWithoutFeedback onPress={handleOpen}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#005b80' }}>
            <MaterialIcons name="book" size={20} color="white" />
            <Text style={{ color: 'white', marginLeft: 5 }}>
              Username/Description
            </Text>
          </View>
        </TouchableWithoutFeedback>

        {open && (
          <Modal transparent animationType="slide" visible={open}>
            <TouchableWithoutFeedback onPress={handleBackdropClick}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.75)' }}>
                <View ref={descriptionRef} style={{ padding: 20, borderRadius: 4, width: '80%', backgroundColor: 'white' }}>
                  <TextInput
                    style={{ width: '100%', borderColor: 'gray', borderWidth: 1 }}
                    name="username" // Use the correct name from formState
                    onChangeText={(text) => handleInputChange(text, 'username')}
                    value={formState.username} // Use the correct value from formState
                    autoFocus
                  />
                  <TextInput
                    style={{ width: '100%', marginTop: 16, borderColor: 'gray', borderWidth: 1 }}
                    multiline
                    numberOfLines={4}
                    name="description"
                    onChangeText={(text) => handleInputChange(text, 'description')}
                    value={formState.description}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
      </View>
    </>
  );
};

export default Description;
