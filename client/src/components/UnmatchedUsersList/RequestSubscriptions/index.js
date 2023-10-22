import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';

const RequestSubscriptions = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Fetch requests data and update the state
    const fetchData = async () => {
      try {
        const response = await fetch('/api/requests');
        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <View>
      <Text>Friend Requests</Text>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default RequestSubscriptions;
