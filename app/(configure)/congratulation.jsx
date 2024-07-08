import { View, Text, SafeAreaView, Image } from 'react-native'
import React from 'react'
import { images } from '../../constants'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'

const Congratulation = () => {
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='w-full'>
        <Image
          source={images.congratulation}
          className='mt-40'
          containerStyles='contain'
        />
      </View>
      <View className='px-4 flex-1 justify-center items-center'>
        <Text className='text-center text-3xl font-pmedium text-primary'>
          Congratulations
        </Text>
        <Text className='text-center text-xl font-pregular text-neutral-600'>
          You are enrolled with our weight gain process, gain weigh and enjoy
          your every meal
        </Text>
      </View>
      <View className='px-4 flex-1'>
        <CustomButton
          title='Continue'
          handlePress={() => {
            router.push('/home')
          }}
          containerStyles='mt-10'
        />
      </View>
    </SafeAreaView>
  )
}

export default Congratulation
