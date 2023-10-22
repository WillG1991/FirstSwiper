import React from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import { Link } from 'react-router-native'; // Assuming you have a package for routing like react-router-native
import Logo from '../../../components/Logo';
import badPhone from '../../../images/bad-phone.png';

const Hero = () => {
  return (
    <View style={styles.backgroundIdea}>
      <View style={styles.container}>
        {/* Left Grid */}
        <View style={styles.leftGrid}>
          <Logo />
          <View style={styles.loginContent}>
            <Text style={styles.headerText}>
              Connect With Crossdressers, Femboys, Sissies, Trans Women & Their Admirers For Free
            </Text>
            <Text style={styles.bodyText}>
              Meet and chat with crossdressers, femboys, sissies, trans women, and their admirers in your area. Free sign-up and chat, find sissies/crossdressers,
              trans women, and admirers in your area and filter by specific kinks.
            </Text>
            {/* Replace the onClick handlers with Link components */}
            <Button style={styles.button} title="Login" color="primary" component={Link} to="/login" />
            <Button style={styles.button} title="Sign Up" color="secondary" component={Link} to="/login?signup=true" />
          </View>
        </View>
        {/* Right Grid */}
        <View style={styles.rightGrid}>
          <Image source={badPhone} alt="Placeholder" style={styles.homePhone} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundIdea: {
    flex: 1,
    backgroundColor: '#000', // Adjust background color
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '100%', // Adjust to '100%' for full height
  },
  leftGrid: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  loginContent: {
    backgroundColor: '#000',
    padding: 10,
    maxWidth: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  headerText: {
    color: '#FFFFFF',
    fontFamily: 'Roboto, Sans Serif',
    fontWeight: 'bold',
    fontSize: 23, // Adjust font size
    lineHeight: 28, // Adjust line height
    marginBottom: 10,
  },
  bodyText: {
    color: '#FFFFFF',
    lineHeight: 24, // Adjust line height
    marginBottom: 20,
  },
  button: {
    marginRight: 10,
  },
  rightGrid: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  homePhone: {
    alignSelf: 'center',
  },
});

export default Hero;
