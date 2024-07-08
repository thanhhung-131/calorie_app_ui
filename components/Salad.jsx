import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, FlatList, RefreshControl } from 'react-native'
import fetchData from '../services/fetchData'
import FoodCard from './FoodCard'
import EmptyState from './EmptyState'
import Loader from './Loader' // Import the Loader component

const Salad = () => {
  const [foodData, setFoodData] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(false)

  // Fetch data from API
  const fetchFoodData = async () => {
    try {
      setLoading(true)
      const data = await fetchData.getSalads()
      setFoodData(data)
    } catch (error) {
      console.error('Failed to fetch food data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Refresh data
  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await fetchFoodData()
    setRefreshing(false)
  }, [])

  // Fetch data on component mount
  useEffect(() => {
    fetchFoodData()
  }, [])

  const renderItem = useCallback(
    ({ item, index }) => (
      <View className='w-1/2 p-2'>
        <FoodCard item={item} index={index} isList={true} />
      </View>
    ),
    []
  )

  const keyExtractor = useCallback(item => item.id.toString(), [])

  return (
    <View>
      {loading ? (
        <Loader /> // Use the Loader component
      ) : (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            padding: 4
          }}
        >
          {foodData.map((item, index) => (
            <View key={index} style={{ width: '48%', marginVertical: 4 }}>
              <FoodCard
                item={item}
                isList={false}
                index={index}
                onFavoritePress={() => onFavoritePress(item)}
              />
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

export default Salad
