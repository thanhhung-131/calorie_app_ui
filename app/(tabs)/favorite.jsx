import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, ScrollView, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import fetchData from '../../services/fetchData'
import FavoriteComponent from '../../components/FavoriteComponent'
import AlertComponent from '../../components/AlertCustom'
import AsyncStorage from '@react-native-async-storage/async-storage'
import authService from '../../services/authService'

const Favorite = () => {
  const [favoriteFoods, setFavoriteFoods] = useState([])
  const [loading, setLoading] = useState(false)
  const [alertVisible, setAlertVisible] = useState(false)
  const [selectedFood, setSelectedFood] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchFavoriteFoods = async () => {
    try {
      setLoading(true)
      const token = await authService.getToken()
      const response = await fetchData.getFavoriteFoods(token)
      const data = response.map((item, index) => item.food)
      setFavoriteFoods(data)
    } catch (error) {
      console.error('Failed to fetch favorite foods:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFavoriteFoods()
  }, [])

  const handleFavoritePress = food => {
    setSelectedFood(food)
    setAlertVisible(true)
  }
  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await fetchFavoriteFoods()
    setRefreshing(false)
  }, [])

  const handleConfirm = async () => {
    setAlertVisible(false)
    if (selectedFood) {
      try {
        // Assume you have a way to get the user's token
        const value = await AsyncStorage.getItem('userData')
        const token = value ? JSON.parse(value).token : null
        await fetchData.removeFoodFromFavorites(selectedFood.id, token)
        // Refresh the favorite foods list
        await fetchFavoriteFoods()
      } catch (error) {
        console.error('Failed to remove food from favorites:', error)
      }
    }
  }

  const handleCancel = () => {
    setAlertVisible(false)
    setSelectedFood(null)
  }

  const vegFood = favoriteFoods.filter(food => (food.type === 'Vegetarian' && food.name.includes('salad') === false))
  const nonVegFood = favoriteFoods.filter(
    food => food.type === 'Non-Vegetarian'
  )
  const mixedFood = favoriteFoods.filter(food => (food.type === 'Mixed' && food.name.includes('salad') === false))
  const salad = favoriteFoods.filter(food => food.name.includes('salad'))

  return (
    <SafeAreaView className='h-full w-full bg-white'>
      <View className='w-full px-6 mt-4 items-center'>
        <Text className='text-2xl font-pregular'>Your favorites</Text>
      </View>
      <ScrollView
        className='w-full px-6'
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className='mb-4'>
          <FavoriteComponent
            data={vegFood}
            title='Vegetarian Foods'
            onFavoritePress={handleFavoritePress}
          />
        </View>
        <View className='mb-4'>
          <FavoriteComponent
            data={nonVegFood}
            title='Non-Vegetarian Foods'
            onFavoritePress={handleFavoritePress}
          />
        </View>
        <View className='mb-4'>
          <FavoriteComponent
            data={mixedFood}
            title='Mixed Foods'
            onFavoritePress={handleFavoritePress}
          />
        </View>
        <View className='mb-4'>
          <FavoriteComponent
            data={salad}
            title='Salads'
            onFavoritePress={handleFavoritePress}
          />
        </View>
      </ScrollView>
      <AlertComponent
        visible={alertVisible}
        title='Remove Favorite'
        message='Do you want to remove this item from your favorites?'
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </SafeAreaView>
  )
}

export default Favorite
