import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRecoilValue } from 'recoil';
import { meState } from '../../recoil/atoms';
// Import your EmailDrawer, PasswordDrawer, and EditProfile components here

const Settings = ({ onClose }) => {
  const [isEmailDrawerOpen, setIsEmailDrawerOpen] = useState(false);
  const [isPasswordDrawerOpen, setIsPasswordDrawerOpen] = useState(false);
  const [backdropOpen, setBackdropOpen] = useState(false);

  const me = useRecoilValue(meState);
  const myId = me?._id;

  const handleEmailDrawerOpen = () => {
    setIsEmailDrawerOpen(true);
  };

  const handleEmailDrawerClose = () => {
    setIsEmailDrawerOpen(false);
  };

  const handlePasswordDrawerOpen = () => {
    setIsPasswordDrawerOpen(true);
  };

  const handlePasswordDrawerClose = () => {
    setIsPasswordDrawerOpen(false);
  };

  const handleBackdropOpen = () => {
    setBackdropOpen(true);
  };

  const handleBackdropClose = () => {
    setBackdropOpen(false);
  };

  const handleChangePassword = (newPassword) => {
    console.log("Changing password to:", newPassword);
  };

  const handleChangeEmail = (newEmail, password) => {
    console.log("Changing email to:", newEmail);
    console.log("Password:", password);
  };

  const logout = () => {
    authLogout(); // Replace with your actual logout function
  };

  const renderListItem = (title, onPress) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        borderBottomWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        padding: 16,
      }}
    >
      <Text style={{ color: 'white' }}>{title}</Text>
    </TouchableOpacity>
  );

  const renderSecurityListItem = (title, onPress) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        padding: 16,
      }}
    >
      <Text style={{ color: 'white' }}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity onPress={onClose} style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.2)', paddingBottom: '0.5em' }}>
        <Text style={{ marginLeft: 10, fontWeight: '400' }}>Settings</Text>
      </TouchableOpacity>

      {renderListItem("Email", handleEmailDrawerOpen)}
      {renderListItem("Password", handlePasswordDrawerOpen)}
      {renderListItem("Edit Profile", handleBackdropOpen)}

      <Text style={{ fontWeight: '400', paddingLeft: 15 }}>Security and Privacy</Text>

      {renderSecurityListItem("Blocked Users", () => {
        // Handle Blocked Users click here
      })}

      { /* Add more security and privacy options as needed */}

      <TouchableOpacity
        onPress={logout}
        style={{
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: 'rgba(255,255,255,0.2)',
          marginTop: 16,
        }}
      >
        <Text style={{ color: 'white', padding: 16 }}>Log Out</Text>
      </TouchableOpacity>

      {isEmailDrawerOpen && <EmailDrawer onClose={handleEmailDrawerClose} />}
      {isPasswordDrawerOpen && <PasswordDrawer onClose={handlePasswordDrawerClose} />}
      {backdropOpen && <EditProfile onClose={handleBackdropClose} />}
    </View>
  );
};

export default Settings;
