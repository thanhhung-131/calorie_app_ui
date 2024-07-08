import React, { useEffect, useState, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity
} from 'react-native'
import FoodCard from './FoodCard'
import { Link, router } from 'expo-router'
import fetchData from '../services/fetchData'
import EmptyState from './EmptyState'
import Loader from './Loader'

const WeightGain = ({ refresh }) => {
  const [foodData, setFoodData] = useState([])
  const [lowCaloriesData, setLowCaloriesData] = useState([])
  const [allFoodsData, setAllFoodsData] = useState([])
  const [displayedFoods, setDisplayedFoods] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [allFoodsLoading, setAllFoodsLoading] = useState(false)
  const [page, setPage] = useState(1)

  const ITEMS_PER_PAGE = 10

  // Fetch high-calorie foods from API
  const fetchHighCalorieFoods = async () => {
    try {
      setLoading(true)
      const data = await fetchData.getHighCalorieFoods()
      const food = data.filter(food => food.name.includes('salad') === false)
      food.sort((a, b) => b.id - a.id) // Sắp xếp theo ID mới nhất
      setFoodData(food)
    } catch (error) {
      console.error('Failed to fetch high-calorie foods:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch low-calorie foods from API
  const fetchLowCalorieFoods = async () => {
    try {
      setLoading(true)
      const data = await fetchData.getLowCalorieFoods()
      const food = data.filter(food => food.name.includes('salad') === false)
      food.sort((a, b) => b.id - a.id) // Sắp xếp theo ID mới nhất
      setLowCaloriesData(food)
    } catch (error) {
      console.error('Failed to fetch low-calorie foods:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch all foods from API
  const fetchAllFoods = async () => {
    try {
      setAllFoodsLoading(true)
      const data = await fetchData.getAllFoods()
      const food = data.filter(food => food.name.includes('salad') === false)
      food.sort((a, b) => b.id - a.id) // Sắp xếp theo ID mới nhất
      setAllFoodsData(food)
      setDisplayedFoods(food.slice(0, ITEMS_PER_PAGE))
    } catch (error) {
      console.error('Failed to fetch all foods:', error)
    } finally {
      setAllFoodsLoading(false)
    }
  }

  // Load more foods
  const loadMoreFoods = () => {
    const nextPage = page + 1
    const startIndex = (nextPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const newFoods = allFoodsData.slice(startIndex, endIndex)
    setDisplayedFoods([...displayedFoods, ...newFoods])
    setPage(nextPage)
  }

  // Refresh data
  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    setPage(1)
    await fetchHighCalorieFoods()
    await fetchLowCalorieFoods()
    await fetchAllFoods()
    setRefreshing(false)
  }, [])

  // Fetch data on component mount
  useEffect(() => {
    fetchHighCalorieFoods()
    fetchLowCalorieFoods()
    fetchAllFoods()
  }, [])

  const renderItem = useCallback(
    ({ item, index }) => (
      <View className='flex-1 w-[180px] mr-4'>
        <FoodCard item={item} index={index} type={'high-calories'} />
      </View>
    ),
    []
  )

  const keyExtractor = useCallback(item => item.id.toString(), [])

  return (
    <View>
      <View>
        <View className='flex-row justify-between items-center'>
          <Text className='text-xl font-pmedium my-2'>High calories foods</Text>
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: 'calories',
                params: {
                  type: 'low'
                }
              })
            }}
          >
            <Text className='text-sm text-gray-400'>View more ></Text>
          </TouchableOpacity>
        </View>
        {loading || refreshing ? (
          <View className='mt-24'>
            <Loader />
          </View>
        ) : (
          <FlatList
            data={foodData.slice(0, 5)}
            horizontal
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={() => <EmptyState title='No Food Found' />}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
          />
        )}
      </View>
      <View>
        <View className='flex-row justify-between items-center'>
          <Text className='text-xl font-pmedium my-2'>Low calories foods</Text>
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: 'calories',
                params: {
                  type: 'low'
                }
              })
            }}
          >
            <Text className='text-sm text-gray-400'>View more ></Text>
          </TouchableOpacity>
        </View>
        {loading || refreshing ? (
          <View className='mt-24'>
            <Loader />
          </View>
        ) : (
          <FlatList
            data={lowCaloriesData.slice(0, 5)}
            horizontal
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={() => <EmptyState title='No Food Found' />}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
          />
        )}
      </View>
      <View>
        <Text className='text-xl font-pmedium my-2'>All Foods</Text>
        {allFoodsLoading || refreshing ? (
          <View className='mt-24'>
            <Loader />
          </View>
        ) : (
          <>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                padding: 4
              }}
            >
              {displayedFoods.map((item, index) => (
                <View key={index} style={{ width: '48%', marginVertical: 4 }}>
                  <FoodCard
                    item={item}
                    isList={true}
                    index={index}
                    type={'all-foods'}
                  />
                </View>
              ))}
            </View>
            {displayedFoods.length < allFoodsData.length && (
              <TouchableOpacity
                onPress={loadMoreFoods}
                style={{ alignItems: 'center', padding: 10 }}
              >
                <Text className='text-lg font-psemibold text-primary/100'>
                  Load More
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  )
}

export default WeightGain
