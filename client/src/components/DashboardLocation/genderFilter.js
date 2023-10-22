import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Icon } from "react-native-elements"; // Import Icon from react-native-elements

const Genders = {
  ALL: "",
  MALE: "Male",
  FEMALE: "Female",
  SISSY: "Sissy",
  CROSSDRESSER: "Crossdresser",
  TRANS_WOMAN: "Trans Woman",
  NON_BINARY: "Non Binary",
};

const GenderFilter = ({ selectedGender, onGenderSelect }) => {
  const [isMobile, setIsMobile] = useState(false); // Determine if it's a mobile device
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [valueGroups, setValueGroups] = useState({ gender: selectedGender || "ALL" });
  const [optionGroups] = useState({ gender: Object.values(Genders) });
  const scrollableContainerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();

    return () => {
      // Clean up the event listener
    };
  }, []);

  useEffect(() => {
    if (valueGroups.gender !== "ALL") {
      setIsPickerOpen(false);
    }
  }, [valueGroups.gender]);

  const handleChange = (name, value) => {
    setValueGroups({ ...valueGroups, [name]: value });
    onGenderSelect(value === "ALL" ? "" : value);
    setIsPickerOpen(false); // Close the list after selection
  };

  const handleBoxClick = () => {
    setIsPickerOpen(!isPickerOpen); // Toggle the picker visibility
  };

  const handleClearClick = () => {
    setValueGroups({ gender: "ALL" });
    onGenderSelect("");
    setIsPickerOpen(false);
  };

  const handleScroll = () => {
    const scrollableContainer = scrollableContainerRef.current;

    if (scrollableContainer) {
      const { contentOffset, contentSize, layoutMeasurement } = scrollableContainer;

      if (contentOffset.y === 0) {
        // Scroll down by 1px
        scrollableContainer.scrollTo({ x: 0, y: 1, animated: false });
      } else if (contentOffset.y + layoutMeasurement.height >= contentSize.height) {
        // Scroll up by 1px
        scrollableContainer.scrollTo({ x: 0, y: contentOffset.y - 1, animated: false });
      }
    }
  };

  return (
    <View>
      <View
        style={{
          backgroundColor: "#8e0b8a",
          padding: 4,
          borderRadius: 4,
          marginBottom: 10,
        }}
      >
        <Text style={{ color: "white", fontSize: 14 }}>Gender</Text>
      </View>
      <TouchableOpacity onPress={handleBoxClick}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space between",
            alignItems: "center",
            backgroundColor: "#2e84b4",
            padding: 8,
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          <Text>
            They are a: {valueGroups.gender !== "ALL" ? valueGroups.gender : ""}
          </Text>
          {valueGroups.gender !== "ALL" && (
            <Icon
              name="clear" // Use the appropriate icon name for clear (it depends on the icon set you're using)
              type="material" // Use the correct icon library and type
              style={{ marginLeft: 5, cursor: "pointer" }}
              onPress={handleClearClick}
            />
          )}
        </View>
      </TouchableOpacity>
      {isMobile ? (
        <View style={{ display: isPickerOpen ? "flex" : "none", alignItems: "center" }}>
          <FlatList
            data={optionGroups.gender}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleChange("gender", item)}
                style={{
                  backgroundColor:
                    valueGroups.gender === item ? "#eee" : "transparent",
                  fontSize: 12,
                  lineHeight: 1.5,
                  padding: 4,
                  borderRadius: 4,
                  marginBottom: 4,
                }}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      ) : (
        <FlatList
          ref={scrollableContainerRef}
          data={optionGroups.gender}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleChange("gender", item)}
              style={{
                backgroundColor: valueGroups.gender === item ? "#eee" : "transparent",
                fontSize: 15,
                lineHeight: 1.5,
                padding: 4,
                borderRadius: 4,
                marginBottom: 4,
              }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
          style={{ display: isPickerOpen ? "flex" : "none", maxHeight: 200, marginTop: 10 }}
          onScroll={handleScroll}
        />
      )}
    </View>
  );
};

export default GenderFilter;
