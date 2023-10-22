import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
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
    const offset = (index * kinks.length) / 3;
    const slicedKinks = kinks.slice(offset).concat(kinks.slice(0, offset));

    const rotateValue = index === 1 ? '-30deg' : '0deg';

    return (
      <View key={index} style={[styles.column, { transform: [{ rotate: rotateValue }] }]}>
        {slicedKinks.map((kink, i) => (
          <Chip key={kink.label + i} style={styles.chip}>
            {kink.label}
          </Chip>
        ))}
      </View>
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.columns}>{columns}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  columns: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chip: {
    margin: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    width: 230,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 22,
    padding: 0,
    backgroundColor: '#005b80',
    color: 'whitesmoke',
  },
});
