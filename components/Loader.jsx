// Loader.js
import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

const Loader = ({ size = "large", color = "#0000ff" }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size={size} color={color} />
      <Text>Loading...</Text>
    </View>
  );
};

export default Loader;
