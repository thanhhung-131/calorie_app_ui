import React, { useEffect, useState, useCallback } from 'react'
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Image,
  TouchableOpacity
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import fetchData from '../../services/fetchData'
import authService from '../../services/authService'
import AdminList from '../../components/AdminList'
import { icons } from '../../constants'
import { router } from 'expo-router'

const Admin = () => {
  const [food, setFood] = useState([])
  const [user, setUser] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const fetchFoods = async () => {
    try {
      setLoading(true)
      const response = await fetchData.getAllFoods()
      response.sort((a, b) => b.id - a.id) // Sắp xếp theo ID mới nhất
      setFood(response)
    } catch (error) {
      console.error('Failed to fetch foods:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = await authService.getToken()
      const response = await authService.getAllUsers(token)
      response.sort((a, b) => b.id - a.id)
      setUser(response)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFoods()
    fetchUsers()
  }, [])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await fetchFoods()
    await fetchUsers()
    setRefreshing(false)
  }, [])

  return (
    <SafeAreaView className='h-full w-full bg-white'>
      <ScrollView
        className='w-full px-6'
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className='mb-4'>
          <TouchableOpacity className='absolute top-7 right-3 z-50' onPress={() => {router.push('/add-food')}}>
            <Image
              source={icons.add}
              className='w-8 h-8'
              tintColor={'#31D6D6'}
            />
          </TouchableOpacity>
          <AdminList data={food} title='Food' type={'food'} />
        </View>
        <View className='mb-4'>
          <TouchableOpacity className='absolute top-7 right-3 z-50' onPress={() => {router.push('/add-user')}}>
            <Image
              source={icons.add}
              className='w-8 h-8'
              tintColor={'#31D6D6'}
            />
          </TouchableOpacity>
          <AdminList data={user} title='User' type={'user'} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Admin
