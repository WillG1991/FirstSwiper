import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';


export default function About() {
  const navigation = useNavigation(); // Use useNavigation instead of useNavigate

  const handleGoBack = () => {
    navigation.goBack(); // Navigate back to the previous page
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.87)', padding: 20 }}>
      <ScrollView>
        <TouchableOpacity onPress={handleGoBack} style={{ marginBottom: 20 }}>
          <Text style={{ color: 'white', borderColor: 'white', borderWidth: 1, padding: 10 }}>
            Back
          </Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 24, marginTop: 20, color: 'white' }}>
          Welcome to FemSwipe
        </Text>
        <Text style={{ fontSize: 16, marginTop: 10, color: 'white' }}>
          The ultimate online platform for individuals who appreciate and embrace diversity in their dating and connection experiences. At FemSwipe, we've crafted a unique and inclusive space that celebrates the beauty of sissies, crossdressers, and their admirers.
        </Text>
        <Text style={{ fontSize: 24, marginTop: 20, color: 'white' }}>
          Our Mission
        </Text>
        <Text style={{ fontSize: 16, marginTop: 10, color: 'white' }}>
          FemSwipe is more than just a dating site; it's a vibrant community where like-minded individuals come together to explore connections that go beyond societal norms. Our mission is to provide a safe, welcoming, and respectful environment for everyone, regardless of their gender identity or interests.
        </Text>
        {/* ... Other sections */}
        <Text style={{ fontSize: 24, marginTop: 20, color: 'white' }}>
          Sites we suggest:
        </Text>
        <TouchableOpacity onPress={() => {}} style={{ marginTop: 10 }}>
      
        </TouchableOpacity>
        <Text></Text>
        <Text style={{ fontSize: 24, marginTop: 20, color: 'white' }}>
          Donate
        </Text>
        <Text style={{ fontSize: 16, marginTop: 10, color: 'white' }}>
          If you'd like to support our mission, you can donate using the following methods:
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Donate')} style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 16, backgroundColor: 'blue', color: 'white', padding: 10 }}>
            Donate Now
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
