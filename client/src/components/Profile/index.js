import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Avatar, Card, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome'; // Example icon from FontAwesome, choose the one you need
import { useRecoilValue } from 'recoil';
import { meState } from '../../../src/recoil/atoms';
import { kinkEmojis } from '../EditProfile/kinks';

const Profile = ({ onClose }) => {
  const [expanded, setExpanded] = useState(false);
  const [backdropOpen, setBackdropOpen] = useState(false);

  const me = useRecoilValue(meState);

  const handleBackdropOpen = () => {
    setBackdropOpen(true);
  };

  const handleBackdropClose = () => {
    setBackdropOpen(false);
  };

  const getAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onClose}>
        <ArrowBack style={styles.backIcon} />
        <Text style={styles.backText}>Profile</Text>
      </TouchableOpacity>
      <Card style={styles.card}>
        <Avatar.Image
          size={300}
          source={{ uri: me.photoURL[0] || '' }}
          style={[styles.avatar, { backgroundColor: me.role === 'admirer' ? '#005b80' : '#9c27b0' }]}
        >
          {me.role === 'admirer' ? <Man style={styles.genderIcon} /> : <Woman style={styles.genderIcon} />}
        </Avatar.Image>
        <Text style={styles.username}>
          {me.username} <Text style={styles.age}>{getAge(me.age)}</Text>
        </Text>
        <View style={styles.infoContainer}>
          <Text style={styles.info}>
            <Info style={styles.infoIcon} />
            {me.gender ? `${me.gender} ` : ''}
            {me.position ? `${me.position} ` : ''}
            {me.ethnicity ? `${me.ethnicity} ` : ''}
            {me.height ? `${me.height} ` : ''}
            {me.weight ? `${me.weight} lbs` : ''}
          </Text>
          <TouchableOpacity onPress={handleBackdropOpen}>
            <Edit style={styles.editIcon} />
          </TouchableOpacity>
        </View>
        <Modal
        isVisible={modalVisible}
        onBackdropPress={handleModalClose} // Close the modal when the backdrop is pressed
        animationIn="slideInUp" // You can choose your desired animation
        animationOut="slideOutDown" // You can choose your desired animation
      >
        <EditProfile handleBackdropClose={handleModalClose} />
      </Modal>
        <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.expandButton}>
          <Text style={styles.expandText}>Show {expanded ? 'Less' : 'More'}</Text>
          <ExpandMore style={styles.expandIcon} />
        </TouchableOpacity>
        {expanded && (
          <View style={styles.expandedContent}>
            <Text style={styles.description}>{me.description}</Text>
            <View style={styles.kinksContainer}>
              {me.kinks.map((kink, index) => (
                <Chip
                  key={index}
                  style={styles.kinkChip}
                  textStyle={styles.kinkText}
                >
                  {`${kinkEmojis[kink]} ${kink.toLowerCase()}`}
                </Chip>
              ))}
            </View>
            <View style={styles.photoContainer}>
              {me.photoURL.slice(1).map((url, index) => (
                <Image
                  key={index}
                  source={{ uri: url }}
                  style={styles.photo}
                />
              ))}
            </View>
          </View>
        )}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  backIcon: {
    color: 'white',
    marginRight: 5,
  },
  backText: {
    color: 'white',
    fontWeight: '400',
    fontSize: 20,
  },
  card: {
    borderRadius: 2,
    margin: 20,
    backgroundColor: 'rgba(0, 0, 0, .5)',
  },
  avatar: {
    width: '100%',
    height: '55vh',
  },
  genderIcon: {
    fontSize: 400,
    color: '#1785b2',
    marginTop: 10,
  },
  username: {
    color: 'white',
    textAlign: 'center',
    marginTop: 5,
    fontSize: 24,
  },
  age: {
    fontStyle: 'italic',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  info: {
    color: 'white',
    marginTop: 0,
    fontSize: 12,
    fontFamily: 'Roboto Condensed, sans-serif',
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 16,
    opacity: 0.7,
    position: 'relative',
    top: 3,
    left: -3,
  },
  editIcon: {
    color: 'white',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  expandText: {
    color: 'white',
  },
  expandIcon: {
    color: 'white',
  },
  expandedContent: {
    padding: 10,
  },
  description: {
    color: 'white',
  },
  kinksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  kinkChip: {
    marginRight: 5,
    marginBottom: 5,
    fontSize: 10,
    backgroundColor: '#005b80',
  },
  kinkText: {
    color: 'white',
  },
  photoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  photo: {
    width: 100,
    height: 100,
    margin: 5,
  },
});

export default Profile;
