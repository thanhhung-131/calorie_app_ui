import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Alert,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import CustomButton from '../../components/CustomButton';
import { router } from 'expo-router';
import fetchData from '../../services/authService';
import authService from '../../services/authService';

const Weight = () => {
  const [currentWeight, setCurrentWeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [selectedActivityLevel, setSelectedActivityLevel] = useState('');
  const [showActivityLevelModal, setShowActivityLevelModal] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      const userToken = await authService.getToken()
      setToken(userToken);
    };

    fetchToken();
  }, []);

  const activityLevels = [
    { label: 'Sedentary', value: 'sedentary' },
    { label: 'Lightly Active', value: 'lightly_active' },
    { label: 'Moderately Active', value: 'moderately_active' },
    { label: 'Very Active', value: 'very_active' },
    { label: 'Extra Active', value: 'extra_active' },
  ];

  const handleContinue = async () => {
    if (!isFormValid()) {
      Alert.alert('Validation Error', 'Please fill all fields correctly.');
      return;
    }

    try {
      // Assuming you have the token from user authentication

      const updatedData = {
        weight: parseFloat(currentWeight),
        age: parseInt(age),
        gender,
        height: parseFloat(height),
        activity_level: selectedActivityLevel, // Update with the selected activity level
      };

      await fetchData.updateProfile(token, updatedData);
      router.push('/congratulation');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };


  const isFormValid = () => {
    const currentWeightValue = parseFloat(currentWeight);
    const ageValue = parseInt(age);
    const heightValue = parseFloat(height);

    return (
      !isNaN(currentWeightValue) &&
      !isNaN(ageValue) &&
      ageValue > 0 &&
      !isNaN(heightValue) &&
      heightValue > 0 &&
      gender !== ''
    );
  };

  const toggleActivityLevelModal = () => {
    setShowActivityLevelModal(!showActivityLevelModal);
  };

  const handleSelectActivityLevel = (level) => {
    setSelectedActivityLevel(level);
    toggleActivityLevelModal(); // Close the modal after selection
  };

  return (
    <SafeAreaView className='flex-1 bg-neutral-100 px-4'>
      <ScrollView>
        <View className='flex flex-col items-center mt-4'>
          <InputField
            label='What is your current weight?'
            value={currentWeight}
            onChangeText={setCurrentWeight}
            unit='Kg'
          />

          <InputField
            label='What is your age?'
            value={age}
            onChangeText={setAge}
            unit='years old'
          />

          <View className='flex justify-center items-center w-full'>
            <Text className='mt-10 text-lg font-pregular'>
              What is your gender?
            </Text>
            <View className='flex-row justify-center items-center mt-4'>
              <GenderButton
                title='Male'
                selected={gender === 'male'}
                onPress={() => setGender('male')}
              />
              <GenderButton
                title='Female'
                selected={gender === 'female'}
                onPress={() => setGender('female')}
              />
            </View>
          </View>

          <InputField
            label='What is your height?'
            value={height}
            onChangeText={setHeight}
            unit='cm'
          />

          <Text className='mt-6 text-lg font-pregular'>What's your activity level?</Text>
          <TouchableOpacity
            onPress={toggleActivityLevelModal}
            className='bg-white w-[120px]'
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 10,
              width: '100%',
              marginTop: 10,
              borderRadius: 5,
            }}>
            <Text style={{ fontSize: 16 }} className='text-center'>
              {selectedActivityLevel
                ? selectedActivityLevel
                : 'Select Activity Level'}
            </Text>
          </TouchableOpacity>

          <CustomButton
            title='Continue'
            handlePress={handleContinue}
            containerStyles='mt-6 mb-8 w-full'
          />

          <Modal
            visible={showActivityLevelModal}
            animationType='slide'
            transparent={true}
            onRequestClose={toggleActivityLevelModal}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>
              <View
                style={{
                  backgroundColor: '#fff',
                  padding: 20,
                  borderRadius: 10,
                  width: '80%',
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    marginBottom: 10,
                  }}>
                  Select Activity Level
                </Text>
                {activityLevels.map((level) => (
                  <TouchableOpacity
                    key={level.value}
                    onPress={() => handleSelectActivityLevel(level.value)}
                    style={{
                      paddingVertical: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: '#ccc',
                    }}>
                    <Text style={{ fontSize: 16 }} className='text-center'>{level.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const InputField = ({ label, value, onChangeText, unit }) => (
  <View className='flex justify-center items-center w-full'>
    <Text className='mt-10 text-lg font-pregular'>{label}</Text>
    <View className='flex-row justify-center items-center'>
      <TextInput
        className='w-[77px] h-[72px] px-4 rounded-lg bg-white shadow-lg text-xl text-center mt-4'
        keyboardType='numeric'
        value={value}
        onChangeText={onChangeText}
      />
      <Text className='font-pregular text-xl mt-2 ml-4'>{unit}</Text>
    </View>
  </View>
);

const GenderButton = ({ title, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`px-6 py-3 rounded-full mx-2 ${
      selected ? 'bg-primary' : 'bg-gray-300'
    }`}>
    <Text
      className={`font-pregular text-lg ${
        selected ? 'text-white' : 'text-black'
      }`}>
      {title}
    </Text>
  </TouchableOpacity>
);

export default Weight;
