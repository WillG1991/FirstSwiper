import React from 'react';
import { View, Text, CheckBox, Linking } from 'react-native';
import { Avatar, Chip } from 'react-native-elements'; // You may need to install this library

const StepThree = ({ formState, agree1, agree2, setAgree1, setAgree2 }) => {
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ color: 'white' }}>Username: {formState.username}</Text>
        <Avatar source={{ uri: formState.photoURL }} />
      </View>
      <Text style={{ color: 'white' }}>Ethnicity: {formState.ethnicity}</Text>
      <Text style={{ color: 'white' }}>Gender: {formState.gender}</Text>
      <Text style={{ color: 'white' }}>Position: {formState.position}</Text>
      <Text style={{ color: 'white' }}>Kinks:</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {formState.kinks.map((kink, index) => (
          <Chip
            key={index}
            title={`${kinkEmojis[kink]} ${kink.toLowerCase()}`}
            containerStyle={{ marginRight: 10, marginBottom: 10, backgroundColor: '#005b80' }}
            titleStyle={{ color: 'white' }}
          />
        ))}
      </View>
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey="6LfWD7AmAAAAAK7FU0hL3SfSY3NDmctNc50yn0zX"
      />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <CheckBox
          name="agree1"
          value={agree1}
          onValueChange={(value) => setAgree1(value)}
        />
        <Text style={{ color: 'white', fontSize: 15 }}>I'm 18 or older</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <CheckBox
          name="agree2"
          value={agree2}
          onValueChange={(value) => setAgree2(value)}
        />
        <Text style={{ color: 'white', fontSize: 15 }}>
          I agree to the{' '}
          <Text
            onPress={() => Linking.openURL('/privacypolicy')}
            style={{ color: 'white', fontSize: 15, textDecorationLine: 'underline' }}
          >
            Terms of Use & Privacy Policy
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default StepThree;
