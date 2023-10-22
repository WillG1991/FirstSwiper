import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useQuery } from '@apollo/client';
import { EDIT_USER } from '../../utils/mutations';
import { useMutation } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';

const FileUpload = ({ index, provideURL, setPhotoURL }) => {
  const [currentImage, setCurrentImage] = useState(null);

  const [editUser] = useMutation(EDIT_USER);

  const handleImageSelect = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
    };

    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        // User cancelled image selection
        return;
      } else if (response.error) {
        // Error occurred while selecting image
        console.error('ImagePicker Error:', response.error);
        return;
      }

      const { uri } = response;
      console.log('Selected image URI:', uri);

      try {
        // You can add image validation logic here if needed

        // Generate a unique file name using uuid
        const fileName = `${uuidv4()}.jpg`;

        // Perform the image upload logic here, you should implement your own logic based on your storage service

        // Example: Upload the image to Firebase Storage
        // const ref = storage().ref().child(`images/${fileName}`);
        // const task = ref.putFile(uri);

        // Listen for the upload task completion and get the download URL
        // task.on('state_changed', (snapshot) => {
        //   // Upload progress can be tracked here
        // }, (error) => {
        //   // Handle error during upload
        //   console.error('Image Upload Error:', error);
        // }, () => {
        //   // Image upload completed successfully
        //   ref.getDownloadURL().then((downloadURL) => {
        //     setCurrentImage(downloadURL);
        //     setPhotoURL(downloadURL);
        //     provideURL(downloadURL);

        //     // Perform other operations as needed, e.g., updating user data
        //     // ...
        //   });
        // });
      } catch (error) {
        console.error('Error handling selected image:', error);
      }
    });
  };

  // Use useEffect to fetch and display the current user's image
  useEffect(() => {
    // Fetch the user's current image URL and set it to setCurrentImage
    // Replace this logic with your own implementation based on your data source
    // ...
  }, []);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      {currentImage ? (
        <Image source={{ uri: currentImage }} style={{ width: 100, height: 100 }} />
      ) : (
        <Text>No Image Selected</Text>
      )}
      <TouchableOpacity onPress={handleImageSelect}>
        <Text>Select Image</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FileUpload;
