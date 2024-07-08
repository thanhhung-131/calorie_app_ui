import React, { useEffect, useState } from 'react'
import { ScrollView, Text, View, Image } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../constants'
import CustomButton from '../components/CustomButton'
import { isTokenAvailable } from '../utils/auth'

const data = [
  {
    id: 1,
    title: 'Maintain your calories and stay healthy!',
    subtile:
      'Lorem ipsum dolor sit amet, conse ctetur adipi scing elit. Nibh convallis varius iaculis Lorem ipsum dolor sit amet, con ctetur adipi scing elit. Nibh convallis varius iaculis'
  },
  {
    id: 2,
    title: 'Scan your food and know it’s calories',
    subtile:
      'Lorem ipsum dolor sit amet, conse ctetur adipi scing elit. Nibh convallis varius iaculis Lorem ipsum dolor sit amet, con ctetur adipi scing elit. Nibh convallis varius iaculis'
  },
  {
    id: 3,
    title: 'Track your weight gain, loss statics here',
    subtile:
      'Lorem ipsum dolor sit amet, conse ctetur adipi scing elit. Nibh convallis varius iaculis Lorem ipsum dolor sit amet, con ctetur adipi scing elit. Nibh convallis varius iaculis'
  }
]

export default function App () {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkToken = async () => {
      const tokenAvailable = await isTokenAvailable()
      setIsLoggedIn(tokenAvailable)
      setLoading(false)
    }

    checkToken()
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      router.push('(tabs)/home')
    }
  }, [isLoggedIn])

  if (loading) {
    return (
      <SafeAreaView className='bg-primary h-full flex justify-center items-center'>
        <Text>Loading...</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <View className='flex-col h-full justify-between'>
        <View className='w-full justify-center h-[45vh] items-center px-4'>
          <Image source={images.thumbnail} className='w-[354px] h-[329px]' />
        </View>
        <View className='w-full h-full bg-white rounded-t-[30px]'>
          <View className='mx-7 mt-20'>
            <ScrollView
              className='w-full bg-white rounded-t-3xl'
              snapToInterval={360}
              snapToAlignment='center'
              scrollIndicatorInsets={{ bottom: 10, right: 0 }}
              horizontal
              disableIntervalMomentum={true}
              disableScrollViewPanResponder={true}
              persistentScrollbar={true}
            >
              {data.map(item => (
                <View key={item.id} className='rounded-lg max-w-[360px] p-1'>
                  <Text className='text-3xl font-psemibold'>{item.title}</Text>
                  <Text className='text-lg text-gray-500/80 mt-4 mb-4'>
                    {item.subtile}
                  </Text>
                </View>
              ))}
            </ScrollView>
            <CustomButton
              title='Sign Up'
              handlePress={() => router.push('(auth)/sign-up')}
              containerStyles={'w-[147px] h-[53px] rounded-[30px] mt-10'}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
