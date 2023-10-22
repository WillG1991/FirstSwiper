import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useMutation, useQuery } from '@apollo/client';
import { Container, Chip } from '@mui/material'; // Assuming you have a Material UI compatible library for React Native
import auth from '../../utils/auth';
import CloseIcon from '@mui/icons-material/Close';
import EditPhotos from './editPhotos';
import AgeProfile from './ageProfile';
import Height from './height';
import Weight from './weight';
import Role from './role';
import Ethnicity from './ethnicity';
import KinkChoices from './kinkchoices';
import Gender from './gender';
import Position from './position';
import Description from './description';

const EditProfile = ({ handleBackdropClose }) => {
  // State variables
  const [profileHeightUpdated, setProfileHeightUpdated] = useState(false);
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [showStats, setShowStats] = useState(false);

  const [photoURL, setPhotoURL] = useState([null, null, null, null]);

  // Mutations
  const [addUserKinks, { error: addUserKinksError }] = useMutation(ADD_USER_KINKS);
  const [deleteUserKinks, { error: deleteUserKinksError }] = useMutation(DELETE_USER_KINKS);

  // Event handlers
  const handleAddKink = (kink) => async () => {
    try {
      await addUserKinks({
        variables: { kinks: [kink] },
      });
      auth.loggedIn();
      setProfileUpdated(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteKink = (kink) => async () => {
    try {
      await deleteUserKinks({
        variables: { kinks: [kink] },
      });
      auth.loggedIn();
      setProfileUpdated(true);
    } catch (e) {
      console.error(e);
    }
  };

  // Form state
  const [formState, setFormState] = useState({
    age: user.age,
    height: user.height,
    weight: user.weight,
    role: user.role,
    kinks: user.kinks,
    ethnicity: user.ethnicity,
    gender: user.gender,
    position: user.position,
    username: user.username,
    description: user.description,
    location: user.location,
  });

  // Mutation for editing user
  const [editUser, { error }] = useMutation(EDIT_USER);

  // Handle form input changes
  const handleChange = (name, value) => {
    setProfileHeightUpdated(false);

    if (name === 'height') {
      value = toFeetandInch(value);

      function toFeetandInch(inches) {
        return `${Math.floor(inches / 12)}' ${Math.round(inches % 12, 1)}"`;
      }
    }

    if (name === 'age') {
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      value = age.toString();
    }

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleSlider = (name, value) => {
    setProfileUpdated(false);
    setFormState({
      ...formState,
      [name]: value.toString(),
    });
  };

  // Retrieve username from URL params
  const { username: userParam } = useParams();

  // Query data
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });

  const user = data?.me || data?.user || {};

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView>
      <Container style={{ flexDirection: 'row', width: '100%' }}>
        <View style={{ flex: 1 }}></View>
        <View>
          <View>
            {['EDIT PROFILE'].map((anchor) => (
              <React.Fragment key={anchor}>
                <View
                  style={{
                    width: anchor === 'left' || anchor === 'right' ? 'auto' : '100%',
                  }}
                >
                  <View
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      paddingBottom: 10,
                    }}
                  >
                    <Chip
                      icon={
                        <CloseIcon
                          style={{ color: '#fff' }}
                        />
                      }
                      label="Save"
                      onPress={() => {
                        toggleDrawer(anchor, false);
                        handleFormSubmit();
                        handleBackdropClose();
                      }}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: '#005b80',
                        color: '#fff',
                      }}
                    />
                  </View>
                  <View style={{ flexDirection: 'column', alignItems: 'start', gap: '1vh' }}>
                    <EditPhotos formState={formState} photoURL={photoURL} setPhotoURL={setPhotoURL} />
                    <AgeProfile
                      formState={formState}
                      handleChange={handleChange}
                    />
                    <Height formState={formState} setFormState={setFormState} handleChange={handleChange} />
                    <Weight formState={formState} setFormState={setFormState} handleSlider={handleSlider} />
                    <Role formState={formState} handleChange={handleChange} />
                    <Gender formState={formState} handleChange={handleChange} />
                    <Position formState={formState} handleChange={handleChange} />
                    <Ethnicity formState={formState} handleChange={handleChange} />
                    <KinkChoices
                      user={user}
                      selectableKinks={selectableKinks}
                      handleAddKink={handleAddKink}
                      handleDeleteKink={handleDeleteKink}
                    />
                    <Description formState={formState} handleChange={handleChange} />
                  </View>
                </View>
              </React.Fragment>
            ))}
          </View>
        </View>
      </Container>
    </ScrollView>
  );
};

export default EditProfile;
