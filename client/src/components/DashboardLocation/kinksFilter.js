import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Icon } from "react-native-elements"; // Import Icon from react-native-elements

const Kinks = {
  ALL: "",
  BIMBOFICATION: "BIMBOFICATION",
  BDSM: "BDSM",
  BONDAGE: "BONDAGE",
  BREEDING: "BREEDING",
  CHASTITY: "CHASTITY",
  DOMINATION: "DOMINATION",
  FEET: "FEET",
  FEMINIZATION: "FEMINIZATION",
  GROUP: "GROUP",
  GIRLFRIENDEXPERIENCE: "GIRLFRIENDEXPERIENCE",
  HUMILIATION: "HUMILIATION",
  HYPNO: "HYPNO",
  LATEX: "LATEX",
  LINGERIE: "LINGERIE",
  MAID: "MAID",
  RAW: "RAW",
  RECORDING: "RECORDING",
  SISSIFICATION: "SISSIFICATION",
  SISSYBRIDE: "SISSYBRIDE",
  SHOWOFF: "SHOWOFF",
  VERBAL: "VERBAL",
};

const KinksSelection = ({ selectedKink, onKinkSelect }) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [valueGroups, setValueGroups] = useState({ kink: selectedKink || "ALL" });
  const [optionGroups] = useState({ kink: Object.values(Kinks) });

  useEffect(() => {
    if (valueGroups.kink !== "ALL") {
      setIsPickerOpen(false);
    }
  }, [valueGroups.kink]);

  const handleChange = (name, value) => {
    setValueGroups({ ...valueGroups, [name]: value });
    onKinkSelect(value === "ALL" ? "" : value);
    setIsPickerOpen(false); // Close the list after selection
  };

  const handleBoxClick = () => {
    setIsPickerOpen(!isPickerOpen); // Toggle the list visibility
  };

  const handleClearClick = () => {
    setValueGroups({ kink: "ALL" });
    onKinkSelect(null);
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
        <Text style={{ color: "white", fontSize: 14 }}>Kink</Text>
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
            They are into: {valueGroups.kink !== "ALL" ? valueGroups.kink : ""}
          </Text>
          {valueGroups.kink !== "ALL" && (
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
        <ScrollView
          style={{
            maxHeight: 200,
            marginTop: 10,
          }}
        >
          {optionGroups.kink.map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => handleChange("kink", option)}
              style={{
                backgroundColor:
                  valueGroups.kink === option ? "#eee" : "transparent",
                fontSize: 12,
                lineHeight: 1.5,
                padding: 4,
                borderRadius: 4,
                marginBottom: 4,
              }}
            >
              <Text>{option}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default KinksSelection;
