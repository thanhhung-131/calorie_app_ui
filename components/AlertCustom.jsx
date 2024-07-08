import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import { icons } from '../constants';

const { width, height } = Dimensions.get('window');

const AlertComponent = ({ visible, title, message, onConfirm, onCancel }) => {
  if (!visible) return null;

  return (
    <View className='absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/30'>
      <View className='bg-white rounded-3xl p-4 items-center' style={{ width: width * 0.52 }}>
        <Image source={icons.sad} className='w-[110px] h-[110px]'/>
        {message && <Text className='text-base mt-2 mb-2 text-center font-pregular text-gray-400'>{message}</Text>}
        <View className='flex-col justify-around w-full'>
          <TouchableOpacity onPress={onConfirm} className='mb-2'>
            <Text className='text-primary text-center text-lg'>Yes, remove</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onCancel}>
            <Text className='text-lg text-center text-gray-500'>No, leave</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AlertComponent;
