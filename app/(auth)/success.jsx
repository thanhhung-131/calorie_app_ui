import { View, Text, SafeAreaView, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { images } from '../../constants';
import CustomButton from './../../components/CustomButton';
import { router } from 'expo-router';
import authService from '../../services/authService';

const Success = () => {
  const [select, setSelect] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
    try {
      const token = await authService.getToken()
      const data = await authService.getUserDataByToken(token)
      if (data) {
        (data.activity_level && data.age && data.gender && data.height && data.target && data.weight) !== null ? setSelect(false) : setSelect(true)
      }
    } catch (error) {
      console.log('Failed to fetch data:', error)
    }}
    fetchData()
  }, [])
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='px-4 flex-1 justify-center items-center'>
        <Image
          source={images.success}
          className='w-[120px] h-[120px] mb-4'
          containerStyles='contain'
        />
        <Text className='text-center text-2xl font-pregular'>
          Login successfully
        </Text>
      </View>
      <View className='px-4 flex-1'>
        <CustomButton
          title='Continue'
          handlePress={() => {
            select ? router.push('/select') : router.push('/home')
          }}
          containerStyles='mt-10'
        />
      </View>
    </SafeAreaView>
  );
}

export default Success;
