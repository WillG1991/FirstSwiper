import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Picker, Button } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Ionicons'; // Replace with your preferred icon package

export default function ClickMenu(props) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [blockAlertVisible, setBlockAlertVisible] = useState(false);
  const [reportAlertVisible, setReportAlertVisible] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const handleLocalBlockUser = () => {
    setBlockAlertVisible(false);
    if (props.onRemoveFriend) {
      props.onRemoveFriend();
    }
    props.handleBlockUser(props.userId, props.username);
  };

  const handleReportUser = () => {
    console.log('reporting user: ', reportReason);
    setReportAlertVisible(false);
    if (props.onReportUser) {
      props.onReportUser(reportReason);
    }
  };

  const handleMenuOpen = () => {
    setMenuVisible(true);
  };

  const handleMenuClose = () => {
    setMenuVisible(false);
  };

  const handleBlockAlertOpen = () => {
    setBlockAlertVisible(true);
    handleMenuClose();
  };

  const handleBlockAlertClose = () => {
    setBlockAlertVisible(false);
  };

  const handleReportAlertOpen = () => {
    setReportAlertVisible(true);
    handleMenuClose();
  };

  const handleReportAlertClose = () => {
    setReportAlertVisible(false);
  };

  const handleReportReasonChange = (value) => {
    setReportReason(value);
  };

  const handleReportSubmit = () => {
    handleReportUser();
  };

  return (
    <View>
      <TouchableOpacity onPress={handleMenuOpen}>
        <MaterialIcons name="more-horiz" size={24} color="white" />
      </TouchableOpacity>
      <Modal isVisible={menuVisible}>
        <View>
          <TouchableOpacity onPress={handleBlockAlertOpen}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="block" size={24} color="black" /> {/* Replace with the actual icon component */}
              <Text>Block User</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleReportAlertOpen}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="alert-circle" size={24} color="black" /> {/* Replace with the actual icon component */}
              <Text>Report User</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal isVisible={blockAlertVisible}>
        <View>
          <Text>Block User</Text>
          <Text>Are you sure you want to block this user?</Text>
          <Button title="Yes" color="red" onPress={handleLocalBlockUser} />
          <Button title="No" onPress={handleBlockAlertClose} />
        </View>
      </Modal>
      <Modal isVisible={reportAlertVisible}>
        <View>
          <Text>Report User</Text>
          <Text>Please select a reason for reporting this user:</Text>
          <Picker
            selectedValue={reportReason}
            onValueChange={handleReportReasonChange}
          >
            <Picker.Item label="Spam" value="spam" />
            <Picker.Item label="Abusive" value="abusive" />
            <Picker.Item label="Inappropriate content" value="inappropriate content" />
          </Picker>
          <Button title="Submit" color="red" onPress={handleReportSubmit} />
          <Button title="Cancel" onPress={handleReportAlertClose} />
        </View>
      </Modal>
    </View>
  );
}
