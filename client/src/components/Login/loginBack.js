import React from 'react';
import { Text, View, ScrollView, Animated } from 'react-native';
import { Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';

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

const LoginBack = () => {
  const columns = Array(3)
    .fill()
    .map((_, index) => {
      const offset = (index * kinks.length) / 3;
      const slicedKinks = kinks.slice(offset).concat(kinks.slice(0, offset));

      return (
        <ScrollView
          key={index}
          horizontal
          style={{
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            transform: index === 1 ? [{ scaleY: -1 }] : [],
          }}
        >
          {slicedKinks.map((kink, i) => (
            <Chip
              key={kink.label + i}
              icon={({ size }) => (
                <MaterialCommunityIcons
                  name="heart"
                  size={size}
                  color="white"
                />
              )}
              textStyle={{ color: 'white' }}
              style={{
                margin: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                width: 230,
                height: 48,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {kink.label}
            </Chip>
          ))}
        </ScrollView>
      );
    });

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ rotate: '-30deg' }],
        backgroundColor: '#005b80',
        paddingTop: Constants.statusBarHeight,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        {columns}
      </View>
    </View>
  );
};

export default LoginBack;
