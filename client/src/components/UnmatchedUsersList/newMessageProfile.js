import React, { useState } from 'react';
import { View, Text, Modal, Image, ScrollView, TouchableOpacity } from 'react-native';

const NewMessageProfile = ({ open, onClose, selectedUser }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={open}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <Text style={{ marginBottom: 10, color: '#fff', fontSize: 20 }}>
            {selectedUser?.username}
          </Text>
          <Text style={{ marginBottom: 5, color: '#fff' }}>
            Age: {selectedUser?.age}
          </Text>
          <Text style={{ marginBottom: 5, color: '#fff' }}>
            Height: {selectedUser?.height}
          </Text>
          <Text style={{ marginBottom: 5, color: '#fff' }}>
            Weight: {selectedUser?.weight} lbs.
          </Text>
          <Text style={{ marginBottom: 5, color: '#fff' }}>
            Ethnicity: {selectedUser?.ethnicity}
          </Text>
          <Text style={{ marginBottom: 5, color: '#fff' }}>
            Role: {selectedUser?.role}
          </Text>
          <Text style={{ marginBottom: 5, color: '#fff' }}>
            Gender: {selectedUser?.gender}
          </Text>
          <Text style={{ marginBottom: 5, color: '#fff' }}>
            Position: {selectedUser?.position}
          </Text>
          <Text style={{ marginBottom: 20, color: '#fff' }}>
            Description: {selectedUser?.description}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {selectedUser?.photoURL.map((photoURL, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleImageClick(photoURL)}
              >
                <Image
                  source={{ uri: photoURL || 'https://via.placeholder.com/50' }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    margin: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.9)',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.4,
                    shadowRadius: 2,
                  }}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalOpen}
            onRequestClose={handleCloseModal}
          >
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                source={{ uri: selectedImage }}
                style={{
                  maxWidth: '90%',
                  maxHeight: '90%',
                  aspectRatio: 1,
                }}
                resizeMode="contain"
              />
            </View>
          </Modal>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default NewMessageProfile;
