import React, { useState } from 'react';
import { View, Text, Image, Modal, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

const UserIdentity = ({ user, setIsPhotoModalOpen }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setModalOpen(true);
    setIsPhotoModalOpen(true);
  };

  const findNextNonEmptyIndex = (startIndex) => {
    for (let i = startIndex + 1; i < user.photoURL.length; i++) {
      if (user.photoURL[i] !== "") {
        return i;
      }
    }
    return startIndex;
  };

  const findPrevNonEmptyIndex = (startIndex) => {
    for (let i = startIndex - 1; i >= 0; i--) {
      if (user.photoURL[i] !== "") {
        return i;
      }
    }
    return startIndex;
  };

  const handleImageNext = () => {
    setSelectedImageIndex((prevIndex) => findNextNonEmptyIndex(prevIndex));
  };

  const handleImagePrev = () => {
    setSelectedImageIndex((prevIndex) => findPrevNonEmptyIndex(prevIndex));
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.nativeEvent.touches[0].pageX);
  };

  const handleTouchMove = (e) => {
    const touchEndX = e.nativeEvent.touches[0].pageX;
    const touchDiff = touchEndX - touchStartX;

    if (touchDiff > 50 && !isFirstImage) {
      handleImagePrev();
    } else if (touchDiff < -50 && !isLastImage) {
      handleImageNext();
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setIsPhotoModalOpen(false);
  };

  const showArrows = user.photoURL.length > 1;
  const isFirstImage = selectedImageIndex === 0;
  const isLastImage = selectedImageIndex === user.photoURL.length - 1;

  const handleToggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <View style={{ paddingHorizontal: 16 }}>
      <View style={{ textAlign: "left", marginBottom: 8 }}>
        <View style={{ display: "flex", flexDirection: "column" }}>
          <Text style={{ fontFamily: 'Roboto Condensed, sans-serif', fontSize: 16, marginBottom: 4 }}>About Me:</Text>
          <View style={{ position: 'relative' }}>
            <View style={{
              overflow: 'hidden',
              maxHeight: showFullDescription ? 'none' : 60,
            }}>
              <Text style={{ fontSize: 14, fontWeight: '300', color: "white", padding: "8px 16px", border: "1px solid #2c2c2c", borderRadius: "10px 10px 10px 0px", backgroundColor: "#151515" }}>
                {user.description}
              </Text>
            </View>
            {!showFullDescription && (
              <TouchableOpacity
                onPress={handleToggleDescription}
                style={{
                  padding: 0,
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                }}
              >
                <Icon name="expand-more" size={24} color="white" />
              </TouchableOpacity>
            )}
            {showFullDescription && (
              <TouchableOpacity
                onPress={handleToggleDescription}
                style={{
                  padding: 0,
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                }}
              >
                <Icon name="expand-less" size={24} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {user.photoURL.map((url, index) => (
          url !== "" && (
            <TouchableOpacity key={index} onPress={() => handleImageClick(index)} style={{ padding: 4 }}>
              <Image
                source={{ uri: url }}
                style={{ width: 100, height: 100 }}
              />
            </TouchableOpacity>
          )
        ))}
      </View>
      <Modal
        visible={modalOpen}
        onRequestClose={handleCloseModal}
        transparent={true}
      >
        <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
          <View onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
            <Image
              source={{ uri: user.photoURL[selectedImageIndex] }}
              style={{ maxWidth: "80vw", maxHeight: "80vh", objectFit: 'contain' }}
            />
            {showArrows && (
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', width: '100%', top: '50%', transform: [{ translateY: -50 }] }}>
                <TouchableOpacity onPress={handleImagePrev} style={{ opacity: isFirstImage ? 0 : 1 }}>
                  <Icon name="keyboard-arrow-left" size={32} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleImageNext} style={{ opacity: isLastImage ? 0 : 1 }}>
                  <Icon name="keyboard-arrow-right" size={32} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default UserIdentity;
