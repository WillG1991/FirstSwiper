import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Auth from "../../utils/auth";
import HomeNav from "./HomeNav";
import Hero from "./Hero";
import About from "./About";
import Footer from "./Footer";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const loggedIn = Auth.loggedIn();

  useEffect(() => {
    const visitedBefore = "visited"; // Use async storage or a similar solution for persistent data in React Native
    if (visitedBefore) {
      setLoading(false);
    } else {
      // Simulating a delay with setTimeout
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleUnload = () => {
      // Handle cleanup when the component is unmounted
      // Remove persistent data using AsyncStorage or a similar solution
    };

    // Add an event listener for cleanup when the component is unmounted
    return handleUnload;
  }, []);

  useEffect(() => {
    if (loggedIn) {
      // Navigate to the dashboard screen
      navigation.navigate("Dashboards");
    }
  }, [loggedIn, navigation]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
      ) : (
        <View style={styles.content}>
          <View style={styles.homeAppBar}>
            <HomeNav />
            <Hero />
            <About />
            <Footer />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  homeAppBar: {
    position: "relative",
    zIndex: 1,
  },
});

export default Home;
