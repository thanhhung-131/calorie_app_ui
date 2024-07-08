import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image, Button } from 'react-native';
import { images } from '../../constants';
import { Link, router } from 'expo-router';
import AuthService from '../../services/authService'; // Import the AuthService
import CustomButton from './../../components/CustomButton';
import { getToken } from '../../utils/auth';
import authService from '../../services/authService';

const options = [
  { label: 'Weight gain', icon: images.muscle, target: 'weight_gain' },
  { label: 'Weight loss', icon: images.fat, target: 'weight_loss' },
  // Other options can be added here
];

const SelectScreen = () => {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      const userToken = await authService.getToken()
      setToken(userToken);
    };

    fetchToken();
  }, []);

  const handlePress = (index) => {
    setSelectedOptionIndex(index);
  };

  const handleContinue = async () => {
    if (selectedOptionIndex === null) return;

    const target = options[selectedOptionIndex].target;

    // Update the user profile
    try {
      await AuthService.updateProfile(token, { target });
      router.push('/weight'); // Navigate to the weight screen
    } catch (error) {
      console.error('Failed to update user profile:', error);
    }
  };

  const handleSkip = async () => {
    // Update the user profile with 'maintain' target
    try {
      await AuthService.updateProfile(token, { target: 'maintain' });
      router.push('/weight'); // Navigate to the weight screen
    } catch (error) {
      console.error('Failed to update user profile:', error);
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-neutral-50 px-4'>
      <View className='flex-row justify-end mt-14'>
        <Text onPress={handleSkip} className='text-gray-800 text-lg font-pregular'>skip ></Text>
      </View>
      <Text className='text-2xl font-medium text-gray-800 mt-6'>
        Please Select what you want here
      </Text>
      <Text className='text-base text-gray-500 mt-2'>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac sollicitudin amet, in
        enas et. Sodales feugiat non elit.
      </Text>
      <View className='flex-row flex-wrap justify-between mt-8'>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handlePress(index)}
            className={`w-[48%] px-4 py-7 mb-4 rounded-lg items-center shadow ${
              selectedOptionIndex === index ? 'bg-primary-light' : 'bg-white'
            }`}
          >
            <Image
              source={option.icon}
              className='w-20 h-20'
              resizeMode='contain'
            />
            <Text className='mt-2 font-pmedium text-base text-gray-800 text-center'>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {selectedOptionIndex !== null && (
        <View className='mt-8'>
          <CustomButton title={'Continue'} handlePress={handleContinue}/>
        </View>
      )}
    </SafeAreaView>
  );
};

export default SelectScreen;
