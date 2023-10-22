import React from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Easing } from 'react-native';
import { Chip } from 'react-native-paper';

const kinks = [
  { label: "🕯️ BDSM" },
  { label: "🪢 BONDAGE" },
  { label: "🤰 BREEDING" },
  { label: "🔒 CHASTITY" },
  { label: "👑 DOMINATION" },
  { label: "👗 FEMINIZATION" },
  { label: "🦶 FEET" },
  { label: "💞 GFE" },
  { label: "👥 GROUP" },
  { label: "🤡 HUMILIATION" },
  { label: "🌀 HYPNO" },
  { label: "👩‍✈️ LATEX" },
  { label: "🎀 LINGERIE" },
  { label: "👩‍🍳 MAID" },
  { label: "🥩 RAW" },
  { label: "📷 RECORDING" },
  { label: "💅 SISSIFICATION" },
  { label: "👰 SISSYBRIDE" },
  { label: "🔎 SHOWOFF" },
  { label: "🗣️ VERBAL" },
];

export default function HomeBack() {
  const animatedValue = new Animated.Value(0);

  // Configure the animation
  const animateScroll = () => {
    animatedValue.setValue(0);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 40000, // Adjust the duration as needed
      easing: Easing.linear,
      useNativeDriver: false, // You may set this to true depending on your use case
    }).start(animateScroll);
  };

  React.useEffect(() => {
    animateScroll();
  }, []);

  // Divide kinks into 3 columns
  const columns = Array(3)
    .fill()
    .map((_, index) => {
      const offset = (index * kinks.length) / 3;
      const slicedKinks = kinks.slice(offset).concat(kinks.slice(0, offset));

      return (
        <ScrollView
          key={index}
          horizontal
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={styles.column}
        >
          {slicedKinks.map((kink, i) => (
            <Chip key={kink.label + i} style={styles.chip}>
              {kink.label}
            </Chip>
          ))}
        </ScrollView>
      );
    });

  return (
    <View style={styles.backgroundIdea}>
      <View style={styles.container}>
        <View style={styles.chipBox}>
          {columns.map((column, index) => (
            <Animated.View
              key={index}
              style={[
                styles.columnContainer,
                {
                  transform: [
                    {
                      translateY: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -50],
                      }),
                    },
                  ],
                },
              ]}
            >
              {column}
            </Animated.View>
          ))}
        </View>
      </View>
    </View>
  );
}

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
  },
  chipBox: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  column: {
    flex: 1,
    flexDirection: 'column',
  },
  columnContainer: {
    width: '100%',
  },
  chip: {
    margin: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
});
