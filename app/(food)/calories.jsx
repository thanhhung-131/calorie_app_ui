import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import fetchData from '../../services/fetchData'
import ListFood from '../../components/ListFood'
import EmptyState from '../../components/EmptyState' // Import EmptyState component
import Loader from '../../components/Loader'
import { useLocalSearchParams } from 'expo-router'

const Calories = () => {
  const [foodData, setFoodData] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(1)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('') // Add search query state
  const { type } = useLocalSearchParams()

  const categories = [
    { id: 1, name: 'Veg Food' },
    { id: 2, name: 'Non-Veg Food' },
    { id: 3, name: 'Mixed' }
  ]

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
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

  const fetchFoodData = async () => {
    let data = []
    try {
      setLoading(true)
      if (type === 'high') {
        data = await fetchData.getHighCalorieFoods()
      } else {
        data = await fetchData.getLowCalorieFoods()
      }
      setFoodData(data)
    } catch (error) {
      console.error('Failed to fetch food data:', error)
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchFoodData()
    setRefreshing(false)
  }

  useEffect(() => {
    fetchFoodData()
  }, [])

  const vegFood = foodData.filter(food => food.type === 'Vegetarian')
  const nonVegFood = foodData.filter(food => food.type === 'Non-Vegetarian')
  const mixedFood = foodData.filter(food => food.type === 'Mixed')

  const getCurrentFoodData = useCallback(() => {
    switch (selectedCategory) {
      case 1:
        return vegFood
      case 2:
        return nonVegFood
      case 3:
        return mixedFood
      default:
        return []
    }
  }, [selectedCategory, vegFood, nonVegFood, mixedFood])

  const filterFoodData = data => {
    return data.filter(food =>
      food.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  return (
    <SafeAreaView className='h-full w-full bg-white'>
      <View className='w-full px-6 mb-8 mt-20'>
        <Text className='text-2xl font-pregular'>{type === 'high' ? 'High' : 'Low'} Calories Foods</Text>
        <Text className='text-sm font-pregular text-gray-300'>
          Choose the best food for your diet
        </Text>
        <TextInput
          className='mt-4 p-2 border border-gray-300 rounded'
          placeholder='Search foods...'
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <View className='flex-1 h-full w-full px-6'>
        <View className='w-full justify-between items-center'>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => `${item.id}`}
            renderItem={renderCategoryItem}
          />
        </View>
        {loading ? (
          <Loader />
        ) : foodData.length === 0 ? (
          <EmptyState title='No Food Found' />
        ) : (
          <ListFood data={filterFoodData(getCurrentFoodData())} />
        )}
      </View>
    </SafeAreaView>
  )
}

export default Calories
