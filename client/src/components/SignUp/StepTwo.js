import React, { useState } from 'react';
import { View, Text } from 'react-native';
import AgeProfile from '../EditProfile/ageProfile';
import Height from '../EditProfile/height';
import Weight from '../EditProfile/weight';
import KinkChoices from '../EditProfile/kinkchoices';
import Role from '../EditProfile/role';
import Ethnicity from '../EditProfile/ethnicity';
import Gender from '../EditProfile/gender';
import Position from '../EditProfile/position';
import Description from '../EditProfile/description';
import EditPhotos from '../EditProfile/editPhotos';

const StepTwo = ({ formState, onStepTwoChange }) => {
  const [photoURL, setPhotoURL] = useState([null, null, null, null]);

  const handleChange = (name, value) => {
    console.log(name, ': ', value);
    onStepTwoChange({ ...formState, [name]: value });
  };

  const handleAddKink = (kink) => () => {
    onStepTwoChange({
      ...formState,
      kinks: [...formState.kinks, kink], // Add the selected kink to the array
    });
  };

  const handleDeleteKink = (kink) => () => {
    const updatedKinks = formState.kinks.filter((k) => k !== kink); // Remove the kink from the array
    onStepTwoChange({
      ...formState,
      kinks: updatedKinks,
    });
  };

  return (
    <View>
      <View style={{ alignItems: 'center', marginTop: 2 }}>
        <EditPhotos formState={formState} signUp={true} handleChange={handleChange} photoURL={photoURL} setPhotoURL={setPhotoURL} />
      </View>
      <View style={{ alignItems: 'center', marginTop: 2 }}>
        <AgeProfile
          formState={formState}
          handleChange={handleChange}
        />
      </View>
      <View style={{ alignItems: 'center', marginTop: 2 }}>
        <Role formState={formState} handleChange={handleChange} />
      </View>
      <View style={{ alignItems: 'center', marginTop: 2 }}>
        <Position formState={formState} handleChange={handleChange} />
      </View>
      <View style={{ alignItems: 'center', marginTop: 2 }}>
        <Ethnicity formState={formState} handleChange={handleChange} />
      </View>
      <View style={{ alignItems: 'center', marginTop: 2 }}>
        <Gender formState={formState} handleChange={handleChange} />
      </View>
      <View style={{ alignItems: 'center', marginTop: 2 }}>
        <KinkChoices
          user={formState}
          selectableKinks={selectableKinks}
          handleAddKink={handleAddKink}
          handleDeleteKink={handleDeleteKink}
        />
      </View>
      <View style={{ alignItems: 'center', marginTop: 2 }}>
        <Description formState={formState} handleChange={handleChange} />
      </View>
    </View>
  );
};

export default StepTwo;
