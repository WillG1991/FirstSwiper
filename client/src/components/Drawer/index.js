import React from 'react';
import { View, Modal, FlatList } from 'react-native';
import { IconButton } from 'react-native-paper'; // You can use a library like react-native-paper for IconButton
import { List } from 'react-native-paper'; // You can use a library like react-native-paper for List

function CustomDrawer({ open, onClose, children, maxWidth }) {
  const handleDrawerClose = () => {
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={open}
      onRequestClose={handleDrawerClose}
    >
      <View style={{ flex: 1, backgroundColor: '#222222' }}>
        <FlatList
          data={children}
          keyExtractor={(item) => item.key.toString()}
          renderItem={({ item }) => (
            <List.Item
              title={item.props.children}
              style={{
                backgroundColor: '#222222',
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(255, 255, 255, 0.2)',
              }}
              titleStyle={{ color: 'white' }}
            />
          )}
        />
        <IconButton
          icon="close"
          color="white"
          size={30}
          onPress={handleDrawerClose}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            margin: 10,
          }}
        />
      </View>
    </Modal>
  );
}

export default CustomDrawer;
