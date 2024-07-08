import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl
} from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { icons } from '../../constants'
import SearchInput from '../../components/SearchInput'
import WeightGain from '../../components/WeightGain'
import { router } from 'expo-router'
import Salad from '../../components/Salad'
import authService from '../../services/authService'

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(1)
  const [refreshing, setRefreshing] = useState(false)
  const [user, setUser] = useState([])
  const categories = [
    { id: 1, name: 'All Foods' },
    { id: 4, name: 'Salads' }
  ]

  useEffect(() => {
    setSelectedCategory(1)

    const fetchUser = async () => {
      try {
        const token = await authService.getToken()
        const data = await authService.getUserDataByToken(token)
        setUser(data)
      } catch (error) {
        console.log('Failed to fetch data:', error)
      }
    }
    fetchUser()
  }, [])

  const renderCategoryItem = (item) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => setSelectedCategory(item.id)}
      className={`mx-2 mb-2`}
    >
      <Text
        className={`text-lg font-pregular ${
          item.id === selectedCategory ? 'text-black' : 'text-gray-400'
        }`}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  )

  const goToCameraScreen = () => {
    router.push('/camera')
  }

  const renderContent = () => {
    switch (selectedCategory) {
      case 1:
        return <WeightGain />
      case 4:
        return <Salad />
      // Add more cases here for other categories
      default:
        return null
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    // You can add more refreshing logic here
    setTimeout(() => setRefreshing(false), 2000) // Simulate a refresh process
  }, [])

  return (
    <SafeAreaView>
      <StatusBar barStyle='dark-content' />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className='px-6'>
          <View className='my-6 space-y-6'>
            <View className='mt-6 flex flex-row justify-between items-center'>
              <Text className='text-base font-pregular'>Hii, {user.username}</Text>
              <Image source={icons.notification} className='w-6 h-6' />
            </View>
            <View className='mt-4'>
              <Text className='text-2xl font-pmedium'>
                Find out The best meal for diet.
              </Text>
            </View>
            <View className='flex flex-row items-center w-full mt-4 space-x-2'>
              <View className='flex-1'>
                <SearchInput />
              </View>
              <View className='w-12 h-12'>
                <TouchableOpacity
                  onPress={goToCameraScreen}
                  style={{
                    width: 48,
                    height: 48,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Image
                    source={icons.scan}
                    className='h-full w-full'
                    tintColor={'#9d9d9d'}
                    resizeMode='contain'
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className='mt-4'>
            {categories.map(renderCategoryItem)}
          </ScrollView>
          {renderContent()}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home
