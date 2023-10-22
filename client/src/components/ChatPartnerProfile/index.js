import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Modal,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Button, Chip, Divider } from 'react-native-paper'; // Import Paper components or use other UI libraries

const { width, height } = Dimensions.get('window');
const drawerBleeding = 106;
const NavbarHeight = 64; // or whatever height you choose

const ChatPartnersProfile = ({ chatPartnerData }) => {
  const [open, setOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(Dimensions.get('window').width < 1024);

  // Function to open the drawer on mobile
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  // Function to open the drawer on desktop
  const handleOpenDrawer = () => {
    setOpen(true);
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedImageIndex(null);
  };

  const handlePreviousImage = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (selectedImageIndex < chatPartnerData.photoURL.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  useEffect(() => {
    // Update the isMobile state when the window is resized
    const handleResize = () => {
      setIsMobile(Dimensions.get('window').width < 1024);
    };

    Dimensions.addEventListener('change', handleResize);
    return () => {
      Dimensions.removeEventListener('change', handleResize);
    };
  }, []);

  const birthDate = new Date(chatPartnerData.age);
  const ageDiffMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDiffMs); // milliseconds from epoch
  const age = Math.abs(ageDate.getUTCFullYear() - 1970);

  if (!chatPartnerData) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.root}>
      {/* Your background image */}
      <Image
        source={{ uri: chatPartnerData.photoURL }}
        style={styles.backgroundImage}
      />
      <View style={styles.content}>
        {/* Your content */}
        <ScrollView style={styles.scrollView}>
          <Text style={styles.header}>Age:</Text>
          <Text style={styles.text}>{age}</Text>
          <Divider style={styles.divider} />
          {/* Add other information here */}
        </ScrollView>
        <Button
          style={styles.desktopStatsBtn}
          mode="contained"
          onPress={handleOpenDrawer}
        >
          See Stats
        </Button>

        {/* Your modal */}
        {/* ... */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    backgroundColor: 'transparent', // Adjust as needed
  },
  scrollView: {
    padding: 16,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  text: {
    fontSize: 16,
  },
  divider: {
    marginVertical: 8,
  },
  desktopStatsBtn: {
    marginVertical: 16,
  },
  // Add more styles as needed
});

export default ChatPartnersProfile;
