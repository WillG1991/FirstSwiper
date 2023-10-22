import React, { useState } from 'react';
import moment from 'moment';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { Divider, IconButton } from 'react-native-paper';
import NewMessageProfile from '../newMessageProfile';
import StatusCircle from '../../StatusCircle';
import CheckIcon from 'react-native-vector-icons/MaterialIcons';
import ClearIcon from 'react-native-vector-icons/MaterialIcons';

const UnmatchedUsers = ({
  users,
  handleAccept,
  openUserInformation,
  openBackdrop,
  closeUserInformation,
  selectedUser,
  setFriendRequests,
  setUsers,
  setUnmatchedUsers,
  handleDecline,
}) => {
  const [loading, setLoading] = useState(false);

  const handleAcceptWithLoading = async (user) => {
    setLoading(true);
    await handleAccept(user);
    setLoading(false);
  };

  const handleDeclineWithLoading = async (user) => {
    setLoading(true);
    await handleDecline(user);
    setLoading(false);
  };

  return (
    <>
      <FlatList
        data={users}
        keyExtractor={(user) => user._id}
        renderItem={({ item, index }) => (
          <View key={item._id}>
            {loading && (
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <ActivityIndicator size="large" color="white" />
              </View>
            )}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => openUserInformation(item)}>
                <Image
                  source={{ uri: item.photoURL[0] || 'https://via.placeholder.com/50' }}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    marginRight: 10,
                  }}
                />
                <View style={{ position: 'absolute', bottom: 0, right: 0, marginBottom: 2, marginRight: 3 }}>
                  <StatusCircle lastActive={item.lastActive} />
                </View>
              </TouchableOpacity>
              <NewMessageProfile open={openBackdrop} onClose={closeUserInformation} selectedUser={selectedUser} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                  {item?.username}
                </Text>
                <Text style={{ fontSize: 12 }}>
                  {item.lastMessage?.text?.startsWith('https://firebasestorage.googleapis.com') ? 'Sent an Image' : item.lastMessage?.text}
                </Text>
              </View>
              <Text style={{ fontSize: 10, marginLeft: 'auto', paddingRight: '2%' }}>
                {item.lastMessage?.createdAt && moment(parseInt(item.lastMessage.createdAt)).fromNow()}
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => handleAcceptWithLoading(item)} style={{ marginRight: 5 }}>
                  <CheckIcon name="check" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeclineWithLoading(item)} disabled={loading}>
                  <ClearIcon name="clear" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
            {index !== users.length - 1 && (
              <View style={{ marginVertical: 10 }}>
                <Divider />
              </View>
            )}
          </View>
        )}
      />
    </>
  );
};

export default UnmatchedUsers;
