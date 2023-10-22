import React, { useRef, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Chip } from 'react-native-paper'; // You can use react-native-paper for Chips
import { kinkEmojis } from './kinks';
import ExpandMoreIcon from 'react-native-vector-icons/Feather';
import ExpandLessIcon from 'react-native-vector-icons/Feather';

const UserKinks = ({ user }) => {
  const scrollContainerRef = useRef(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleToggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  useEffect(() => {
    // Scroll to the end of the ScrollView
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollToEnd({ animated: true });
    }
  }, []);

  return (
    <View style={{ textAlign: 'left', paddingHorizontal: 16, paddingBottom: 16, paddingTop: 8 }}>
      <View style={{ flexDirection: 'column' }}>
        <Text>
          <Text style={{ fontFamily: 'Roboto Condensed, sans-serif', fontSize: 16 }}>Kinks </Text>
        </Text>
        <ScrollView
          ref={scrollContainerRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}
          style={{ maxHeight: showFullDescription ? null : 30 }}
        >
          {user?.kinks?.map((kink) => (
            <Chip
              key={kink}
              mode="outlined"
              labelStyle={{ color: 'white', fontSize: 10 }}
              style={{ backgroundColor: '#04567a', margin: 2 }}
            >
              {kinkEmojis[kink]} {kink}
            </Chip>
          ))}
        </ScrollView>
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
            <ExpandMoreIcon name="chevron-down" size={24} color="white" />
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
            <ExpandLessIcon name="chevron-up" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default UserKinks;
