import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
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

export default function LoginBack() {
  const columns = Array(3).fill().map((_, index) => {
    const offset = index * kinks.length / 3;
    const slicedKinks = kinks.slice(offset).concat(kinks.slice(0, offset));

    return (
      <View key={index} style={index === 1 ? styles.columnReverse : styles.column}>
        {slicedKinks.map((kink, i) => (
          <Chip
            key={kink.label + i}
            style={styles.chip}
          >
            {kink.label}
          </Chip>
        ))}
      </View>
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.chipContainer}>
        {columns}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-30deg' }],
  },
  chipContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flexDirection: 'column',
    alignItems: 'center',
    height: '200%',
    overflow: 'hidden',
    animationDuration: '40s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    transform: [{ translateY: 0 }],
  },
  columnReverse: {
    flexDirection: 'column',
    alignItems: 'center',
    height: '200%',
    overflow: 'hidden',
    animationDuration: '30s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    transform: [{ translateY: '-50%' }],
  },
  chip: {
    margin: 8,
    backgroundColor: "#005b80",
    color: "whitesmoke",
    fontSize: 22,
    width: 230,
    height: 48,
    lineHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
