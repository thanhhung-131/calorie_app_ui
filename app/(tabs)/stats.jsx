import React, { useEffect, useState, useCallback } from 'react'
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Image,
  ActivityIndicator
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import fetchData from '../../services/fetchData'
import { icons, images } from '../../constants'
import authService from '../../services/authService'

const Stats = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const getData = async () => {
    try {
      setLoading(true) // Bắt đầu hiển thị loading khi bắt đầu tải dữ liệu
      const token = await authService.getToken()

      if (token) {
        const response = await fetchData.getCalories(token)
        setData(response)
      } else {
        console.error('Token not found')
        // Xử lý trường hợp không tìm thấy token trong AsyncStorage
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
      // Xử lý trạng thái lỗi hoặc hiển thị thông báo lỗi cho người dùng
    } finally {
      setLoading(false) // Ẩn loading khi kết thúc việc tải dữ liệu
    }
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await getData()
    setRefreshing(false)
  }, [])

  useEffect(() => {
    getData()
  }, [])

  return (
    <SafeAreaView className='h-full w-full bg-white'>
      <View className='w-full px-6 mt-4 items-center'>
        <Text className='text-2xl font-pregular'>Your Daily stats</Text>
      </View>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size='large' color='#0000ff' />
        </View>
      ) : (
        <ScrollView
          className='w-full px-6'
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View className='absolute top-6 z-50 left-4'>
            <Text className='text-base text-gray-400'>Daily calories</Text>
            <Text className='text-sm font-psemibold text-primary'>
              {data.daily_calorie?.toFixed(2)}
            </Text>
          </View>
          <View className='absolute top-6 z-50 right-4'>
            <Text className='text-base text-gray-400'>Calorie to eat</Text>
            <Text className='text-sm font-psemibold text-primary text-right'>
              {data.calorie_to_eat?.toFixed(2)}
            </Text>
          </View>
          <View className='mt-4'>
            <Image source={images.stats} className='w-full' />
          </View>
          <View className='w-full mt-8 flex-row justify-between'>
            <View className='border-[1px] rounded-2xl w-[48%] p-4 flex justify-center items-center'>
              <View className='w-[40px] h-[40px] rounded-full bg-primary-light flex justify-center items-center'>
                <Image source={icons.food} className='w-[25px] h-[25px]' />
              </View>
              <View>
                <Text className='text-base font-pregular text-center mt-4'>
                  Daily Calories Intake
                </Text>
                <Text className='text-[12px] text-gray-400 font-pregular text-center mt-4'>
                  Eat upto {data.daily_calorie?.toFixed(2)} calories
                </Text>
              </View>
            </View>
            <View className='border-[1px] rounded-2xl w-[48%] p-4 flex justify-center items-center'>
              <View className='w-[40px] h-[40px] rounded-full bg-secondary-light flex justify-center items-center'>
                <Image source={icons.calorie} className='w-[25px] h-[25px]' />
              </View>
              <View>
                <Text className='text-base font-pregular text-center mt-4'>
                  Today’s calorie Intake
                </Text>
                <Text className='text-[12px] text-gray-400 font-pregular text-center mt-4'>
                  Today’s eaten calories {data.today_intake?.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

export default Stats
