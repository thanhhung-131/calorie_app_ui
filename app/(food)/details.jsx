import React, { useEffect, useState, useCallback } from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert // Ensure Alert is imported if you need it for debug messages
} from 'react-native'
import fetchData from '../../services/fetchData'
import { router, useLocalSearchParams } from 'expo-router'
import { icons } from '../../constants'
import CustomButton from '../../components/CustomButton'
import AlertComponent from '../../components/AlertCustom'
import authService from '../../services/authService'
import AsyncStorage from '@react-native-async-storage/async-storage'

const FoodDetail = () => {
  const { id, bg } = useLocalSearchParams()
  const [isFavorite, setIsFavorite] = useState(false)
  const [foodDetail, setFoodDetail] = useState(null)
  const [alertVisible, setAlertVisible] = useState(false)
  const [removeAlertVisible, setRemoveAlertVisible] = useState(false) // State for remove alert
  const [token, setToken] = useState(null)
  const [admin, setAdmin] = useState(false)
  const [refreshing, setRefreshing] = useState(false) // State for refresh control

  const fetchDataAsync = async () => {
    try {
      const userToken = await authService.getToken()
      setToken(userToken)

      const foodDataPromise = fetchData.getFoodById(id)
      const favoritesPromise = fetchData.getFavoriteFoods(userToken)

      const [foodData, favorites] = await Promise.all([
        foodDataPromise,
        favoritesPromise
      ])

      setFoodDetail(foodData)

      if (favorites && foodData) {
        const isFav = favorites.some(fav => fav.food_id === foodData.id)
        setIsFavorite(isFav)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const getRole = async () => {
    const response = await AsyncStorage.getItem('userData')
    if (response) {
      const user = JSON.parse(response)
      user.role === 'admin' && setAdmin(true)
    }
  }

  useEffect(() => {
    fetchDataAsync()
    getRole()
  }, [])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchDataAsync().then(() => setRefreshing(false))
  }, [id])

  const handleFavoritePress = () => {
    if (isFavorite) {
      setAlertVisible(true)
    } else {
      addToFavorites()
    }
  }

  const addToFavorites = async () => {
    try {
      if (token) {
        await fetchData.addFoodToFavorites(foodDetail.id, token)
        setIsFavorite(true)
      } else {
        console.error('Token not found')
      }
    } catch (error) {
      console.error('Failed to add food to favorites:', error)
    }
  }

  const handleConfirm = async () => {
    setAlertVisible(false)

    try {
      if (token) {
        await fetchData.removeFoodFromFavorites(foodDetail.id, token)
        setIsFavorite(false)
      } else {
        console.error('Token not found')
      }
    } catch (error) {
      console.error('Failed to remove food from favorites:', error)
    }
  }

  const handleDaily = async () => {
    try {
      if (token) {
        const response = await fetchData.getCalories(
          token,
          foodDetail.calories_per_serving
        )
        Alert.alert('Food added to daily diet')
        router.back()
      } else {
        console.error('Token not found')
      }
    } catch (error) {
      console.error('Failed to add food to daily diet:', error)
    }
  }

  const handleCancel = () => {
    setAlertVisible(false)
  }

  const handleRemovePress = () => {
    setRemoveAlertVisible(true)
  }

  const handleRemoveConfirm = async () => {
    setRemoveAlertVisible(false)

    try {
      if (token) {
        const response = await fetchData.removeFood(token, foodDetail.id)
        if (response.message === 'Food deleted successfully') {
          Alert.alert('Food deleted successfully')
          router.back()
        }
      } else {
        console.error('Token not found')
      }
    } catch (error) {
      console.error('Failed to remove food:', error)
    }
  }

  const handleRemoveCancel = () => {
    setRemoveAlertVisible(false)
  }

  if (!foodDetail) {
    return (
      <View className='flex-1 justify-center items-center'>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <View className={`w-full h-full ${bg} items-center justify-center`}>
      <View className={`h-[45%] w-full justify-between items-center`}>
        <Text className='text-2xl font-pregular mt-14'>
          {foodDetail.name.charAt(0).toUpperCase() + foodDetail.name.slice(1)}
        </Text>
        <Image
          source={{
            uri: foodDetail.images[0]?.image_url
              ? foodDetail.images[0]?.image_url
              : 'https://as2.ftcdn.net/v2/jpg/02/73/82/69/1000_F_273826938_g3zTc4k5UtVsYDgZnPyVkzR6WEmyeuhB.jpg'
          }}
          className={`w-[280px] h-[280px] rounded-full mb-4`}
          resizeMode='cover'
        />
      </View>

      <View
        className={`h-[55%] w-full items-center justify-between bg-white rounded-tl-[60px] px-8`}
      >
        <TouchableOpacity
          onPress={handleFavoritePress}
          className='absolute bg-primary rounded-full p-[6px] top-[-16px] right-16'
          activeOpacity={0.8}
        >
          <Image
            source={icons.favorite}
            className='w-[26px] h-[26px]'
            tintColor={isFavorite ? '#e31b23' : '#fff'}
          />
        </TouchableOpacity>
        {admin && (
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: '/edit-food',
                params: {
                  food_id: foodDetail.id
                }
              })
            }}
            className='absolute bg-primary rounded-full p-[6px] top-[-16px] left-16'
            activeOpacity={0.8}
          >
            <Image
              source={icons.edit}
              className='w-[26px] h-[26px]'
              tintColor={'#fff'}
            />
          </TouchableOpacity>
        )}
        <ScrollView
          className='mt-10 w-full mb-2'
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View className='flex-row items-start justify-between'>
            <View className='flex w-1/4 justify-center items-center'>
              <View
                className='p-1 rounded-full border-2'
                style={{ borderColor: '#FF0000' }}
              >
                <Image
                  source={icons.calorie}
                  className='w-6 h-6'
                  tintColor={'#FF0000'}
                />
              </View>
              <Text className={`text-xs font-pmedium text-gray-400`}>
                Calorie
              </Text>
              <Text className={`text-sm font-pregular text-gray-800`}>
                {foodDetail.calories_per_serving} Kcal
              </Text>
            </View>
            <View className='flex w-1/4 justify-center items-center'>
              <View
                className='p-1 rounded-full border-2'
                style={{ borderColor: '#6F4E37' }}
              >
                <Image
                  source={icons.protein}
                  className='w-6 h-6'
                  tintColor={'#6F4E37'}
                />
              </View>
              <Text className={`text-xs font-pmedium text-gray-400`}>
                Protein
              </Text>
              <Text className={`text-sm font-pregular text-gray-800`}>
                {foodDetail.protein} g
              </Text>
            </View>
            <View className='flex w-1/4 justify-center items-center'>
              <View
                className='p-1 rounded-full border-2'
                style={{ borderColor: '#FEB941' }}
              >
                <Image
                  source={icons.fat}
                  className='w-6 h-6'
                  tintColor={'#FEB941'}
                />
              </View>
              <Text className={`text-xs font-pmedium text-gray-400`}>Fat</Text>
              <Text className={`text-sm font-pregular text-gray-800`}>
                {foodDetail.fat} g
              </Text>
            </View>
            <View className='flex w-1/4 justify-center items-center'>
              <View
                className='p-1 rounded-full border-2'
                style={{ borderColor: '#31D6D6' }}
              >
                <Image
                  source={icons.carbohydrate}
                  className='w-6 h-6'
                  tintColor={'#31D6D6'}
                />
              </View>
              <Text className={`text-xs font-pmedium text-gray-400`}>
                Carbohydrate
              </Text>
              <Text className={`text-sm font-pregular text-gray-800`}>
                {foodDetail.carbohydrate} g
              </Text>
            </View>
          </View>
          <View className='flex-col items-start justify-between mt-6'>
            <Text className={`text-xl font-pmedium text-gray-800`}>
              Description
            </Text>
            <Text className={`text-lg text-gray-400`}>
              {foodDetail.description}
            </Text>
          </View>
        </ScrollView>
        <View className='w-full shadow-md px-4'>
          <CustomButton
            title='Add to your daily Diet'
            handlePress={handleDaily}
            containerStyles={'px-4 mb-4 w-full rounded-[30px]'}
            textStyles={'text-base font-pmedium'}
          />
          {admin && (
            <CustomButton
              title='Remove'
              handlePress={handleRemovePress}
              containerStyles={'px-4 mb-4 w-full rounded-[30px] bg-red-500'}
              textStyles={'text-base font-pmedium'}
            />
          )}
        </View>
      </View>
      <AlertComponent
        visible={alertVisible}
        title='Remove Favorite'
        message={`Do you want to remove ${
          foodDetail.name.charAt(0).toUpperCase() + foodDetail.name.slice(1)
        } from favorites?`}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
      <AlertComponent
        visible={removeAlertVisible}
        title='Remove Food'
        message={`Do you want to remove ${
          foodDetail.name.charAt(0).toUpperCase() + foodDetail.name.slice(1)
        } from database?`}
        onConfirm={handleRemoveConfirm}
        onCancel={handleRemoveCancel}
      />
    </View>
  )
}

export default FoodDetail
