import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import Logo from "../../components/Logo";
import Login from "../../components/Login";
import Signup from "../../components/SignUp";
import ForgotPasswordForm from "../../components/ForgotPasswordForm";
import { useRoute } from "@react-navigation/native";
import { Card, Typography } from "react-native-paper";

const LoginPage = () => {
  const route = useRoute();
  const showSignupParam = route.params && route.params.signup === "true";

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showLogin, setShowLogin] = useState("hero");
  const [showSignup, setShowSignup] = useState(showSignupParam);

  const toggleLogin = (value, showSignup) => {
    setShowLogin(value);
    setShowSignup(showSignup);
  };

  const handleToggle = () => {
    setShowForgotPassword(false);
    toggleLogin("login", !showSignup);
  };

  const handleForgotPasswordToggle = () => {
    setShowForgotPassword(!showForgotPassword);
    toggleLogin("login");
  };

  return (
    <View style={styles.loginBg}>
      <View style={styles.absoluteContainer}>
        <View style={styles.cardContainer}>
          <Card style={styles.loginContent}>
            {!showSignup || showForgotPassword ? <Logo /> : null}
            {!showForgotPassword && (showSignup ? <Signup /> : <Login />)}
            {showForgotPassword && <ForgotPasswordForm />}

            <View style={styles.loginLink}>
              <Text style={styles.linkText}>
                {!showForgotPassword ? (
                  <TouchableOpacity onPress={handleToggle}>
                    <Text>{showSignup ? "Login" : "Sign Up"}</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={handleForgotPasswordToggle}>
                    <Text>Login</Text>
                  </TouchableOpacity>
                )}
                &nbsp; | &nbsp;
                <TouchableOpacity onPress={handleForgotPasswordToggle}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              </Text>
              <Text></Text>
            </View>
          </Card>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loginBg: {
    position: "relative",
    height: "100%",
  },
  absoluteContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardContainer: {
    borderRadius: 8,
    position: "relative",
  },
  loginContent: {
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 8,
  },
  loginLink: {
    marginTop: 8,
    alignItems: "center",
  },
  linkText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  forgotPasswordText: {
    color: "white",
    fontSize: 16,
    cursor: "pointer",
  },
});

export default LoginPage;
