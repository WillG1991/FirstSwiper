import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler"; // Use TouchableOpacity for touchable elements
import { useNavigation } from "@react-navigation/native"; // Import the useNavigation hook


const HomeNav = () => {
  const navigation = useNavigation(); // Get the navigation object

  const navigateToAbout = () => {
    navigation.navigate("About"); // Replace "About" with the name of your About screen
  };

  const navigateToSupport = () => {
    navigation.navigate("Support"); // Replace "Support" with the name of your Support screen
  };

  const navigateToContact = () => {
    navigation.navigate("Contact"); // Replace "Contact" with the name of your Contact screen
  };

  return (
    <View
      style={{
        backgroundColor: "transparent",
        shadowColor: "transparent",
        borderBottomColor: "transparent",
        borderBottomWidth: 0,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        {/* Use TouchableOpacity for navigation */}
        <TouchableOpacity
          onPress={navigateToAbout}
          style={{ marginRight: 20, display: "flex", color: "white" }}
        >
          <Text>About</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={navigateToSupport}
          style={{ marginRight: 20, display: "flex", color: "white" }}
        >
          <Text>Support</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={navigateToContact}
          style={{ marginRight: 10, display: "flex", color: "white" }}
        >
          <Text>Contact</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeNav;
