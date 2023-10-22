import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Icon } from "react-native-elements"; // Import Icon from react-native-elements

const Ethnicities = {
  ALL: "",
  WHITE: "White",
  BLACK: "Black",
  PACIFIC_ISLANDER: "Pacific Islander",
  INDIAN: "Indian",
  ASIAN: "Asian",
  LATIN_HISPANIC: "Latin/Hispanic",
  AMERICAN_INDIAN: "American Indian",
  OTHER: "Other",
};

const EthnicityFilter = ({ selectedEthnicity, onEthnicitySelect }) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [valueGroups, setValueGroups] = useState({ ethnicity: selectedEthnicity || "ALL" });
  const [optionGroups] = useState({ ethnicity: Object.values(Ethnicities) });

  useEffect(() => {
    if (valueGroups.ethnicity !== "ALL") {
      setIsPickerOpen(false);
    }
  }, [valueGroups.ethnicity]);

  const handleChange = (name, value) => {
    setValueGroups({ ...valueGroups, [name]: value });
    onEthnicitySelect(value === "ALL" ? "" : value);
    setIsPickerOpen(false); // Close the list after selection
  };

  const handleBoxClick = () => {
    setIsPickerOpen(!isPickerOpen); // Toggle the list visibility
  };

  const handleClearClick = () => {
    setValueGroups({ ethnicity: "ALL" });
    onEthnicitySelect("");
    setIsPickerOpen(false);
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
        <Text style={{ color: "white", fontSize: 14 }}>Ethnicity</Text>
      </View>
      <TouchableOpacity onPress={handleBoxClick}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#2e84b4",
            padding: 8,
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          <Text>
            They are: {valueGroups.ethnicity !== "ALL" ? valueGroups.ethnicity : ""}
          </Text>
          {valueGroups.ethnicity !== "ALL" && (
            <Icon
              name="clear" // Use the appropriate icon name for clear (it depends on the icon set you're using)
              type="material" // Use the correct icon library and type
              style={{ marginLeft: 5, cursor: "pointer" }}
              onPress={handleClearClick}
            />
          )}
        </View>
      </TouchableOpacity>
      {isPickerOpen && (
        <View
          style={{
            maxHeight: 150,
            marginTop: 10,
            alignItems: "center",
          }}
        >
          <FlatList
            data={optionGroups.ethnicity}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleChange("ethnicity", item)}
                style={{
                  backgroundColor:
                    valueGroups.ethnicity === item ? "#eee" : "transparent",
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
      )}
    </View>
  );
};

export default EthnicityFilter;
