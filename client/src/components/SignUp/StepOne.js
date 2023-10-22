import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';

const StepOne = ({ formState, onStepOneChange, stepOneError }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleChange = (name, value) => {
    onStepOneChange({
      ...formState,
      [name]: value,
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
    onStepOneChange(file);
  };

  return (
    <View>
      {stepOneError && (
        <Text style={{ color: 'red', marginBottom: 5 }}>{stepOneError}</Text>
      )}
      <TextInput
        style={{ marginTop: 5, marginBottom: 5 }}
        placeholder="Your username"
        name="username"
        value={formState.username}
        onChangeText={(value) => handleChange('username', value)}
      />
      <TextInput
        style={{ marginTop: 5, marginBottom: 5 }}
        placeholder="Your email"
        name="email"
        value={formState.email}
        onChangeText={(value) => handleChange('email', value)}
      />
      <TextInput
        style={{ marginTop: 5, marginBottom: 5 }}
        placeholder="******"
        name="password"
        secureTextEntry={true}
        value={formState.password}
        onChangeText={(value) => handleChange('password', value)}
      />
      <Button
        title="Choose Image"
        onPress={() => fileInputRef.current.click()}
      />
    </View>
  );
};

export default StepOne;
