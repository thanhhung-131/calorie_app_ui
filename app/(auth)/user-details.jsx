import React, { useEffect, useState, useCallback } from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl
} from 'react-native'
import fetchData from '../../services/fetchData'
import { router, useLocalSearchParams } from 'expo-router'
import { icons } from '../../constants'
import CustomButton from '../../components/CustomButton'
import AlertComponent from '../../components/AlertCustom'
import authService from '../../services/authService'

const UserDetail = () => {
  const { id, bg } = useLocalSearchParams()
  const [data, setData] = useState(null)
  const [alertVisible, setAlertVisible] = useState(false)
  const [refreshing, setRefreshing] = useState(false) // State for refresh control

  const fetchDataAsync = async () => {
    try {
      const token = await authService.getToken()
      const data = await authService.getUserById(token, id)
      setData(data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchDataAsync()
  }, [id])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchDataAsync().then(() => setRefreshing(false))
  }, [id])

  const handleRemovePress = () => {
    setAlertVisible(true)
  }

  const handleConfirm = async () => {
    setAlertVisible(false)
    try {
      const token = await authService.getToken()
      const response = await authService.deleteUser(token, data.id)
      if (response) {
        Alert.alert('User deleted successfully')
        router.back()
      }
    } catch (error) {
      console.error('Failed to remove user:', error)
    }
  }

  const handleCancel = () => {
    setAlertVisible(false)
  }

  if (!data) {
    return (
      <View className='flex-1 justify-center items-center'>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <View className={`w-full h-full ${bg} items-center justify-center`}>
      <View className={`h-[45%] w-full justify-between items-center`}>
        <Text className='text-2xl font-pregular mt-14'>{data.username}</Text>
        <Image
          source={{
            uri: data.avatar_url
            ? data.avatar_url
            : data.gender === 'male'
            ? 'https://img.freepik.com/premium-vector/businessman-avatar-cartoon-character-profile_18591-50581.jpg?w=740'
            : 'https://img.freepik.com/premium-vector/businesswoman-avatar-cartoon-character-profile_18591-50580.jpg?w=740'
          }}
          className={`w-[280px] h-[280px] rounded-full mb-4`}
          resizeMode='cover'
        />
      </View>

      <View
        className={`h-[55%] w-full items-center justify-between bg-white rounded-tl-[60px] px-8`}
      >
        <ScrollView
          className='mt-10 w-full mb-2'
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View className='flex-row items-start justify-between'>
            <View className='flex w-1/3 justify-center items-center'>
              <View
                className='p-2 rounded-full border-2'
                style={{ borderColor: '#FF0000' }}
              >
                <Image
                  source={icons.height}
                  className='w-6 h-6'
                  tintColor={'#FF0000'}
                />
              </View>
              <Text className={`text-sm font-pmedium text-gray-400 mt-1`}>
                Height
              </Text>
              <Text className={`text-base font-pregular text-gray-800`}>
                {data.height} cm
              </Text>
            </View>
            <View className='flex w-1/3 justify-center items-center'>
              <View
                className='p-2 rounded-full border-2'
                style={{ borderColor: '#6F4E37' }}
              >
                <Image
                  source={icons.weight}
                  className='w-6 h-6'
                  tintColor={'#6F4E37'}
                />
              </View>
              <Text className={`text-sm font-pmedium text-gray-400 mt-1`}>
                Weight
              </Text>
              <Text className={`text-base font-pregular text-gray-800`}>
                {data.weight} Kg
              </Text>
            </View>
            <View className='flex w-1/3 justify-center items-center'>
              <View
                className='p-2 rounded-full border-2'
                style={{ borderColor: '#31D6D6' }}
              >
                <Image
                  source={icons.age}
                  className='w-6 h-6'
                  tintColor={'#31D6D6'}
                />
              </View>
              <Text className={`text-sm font-pmedium text-gray-400 mt-1`}>
                Age
              </Text>
              <Text className={`text-base font-pregular text-gray-800`}>
                {data.age}
              </Text>
            </View>
          </View>
          <View className='flex-col justify-between mt-6 w-full'>
            <Text className={`text-xl font-pmedium text-gray-800`}>
              Information
            </Text>
            <View className='flex-row items-center mb-2'>
              <Image
                source={icons.mail}
                className='w-6 h-6 mr-2'
                tintColor={'#C8CFA0'}
              />
              <Text className={`text-lg text-gray-500`}>{data.email}</Text>
            </View>
            <View className='flex-row justify-between mb-2'>
              <View className='flex-row items-center'>
                <Image
                  source={icons.target}
                  className='w-6 h-6 mr-2'
                  tintColor={'#FCDC94'}
                />
                <Text className={`text-lg text-gray-500`}>{data.target}</Text>
              </View>
              <View className='flex-row items-center'>
                <Image
                  source={icons.activity}
                  className='w-6 h-6 mr-2'
                  tintColor={'#EF9C66'}
                />
                <Text className={`text-lg text-gray-500`}>
                  {data.activity_level}
                </Text>
              </View>
            </View>
            <View className='flex-row justify-between mb-2'>
              <View className='flex-row items-center'>
                <Image
                  source={icons.gender}
                  className='w-6 h-6 mr-2'
                  tintColor={'#78ABA8'}
                />
                <Text className={`text-lg text-gray-500`}>{data.gender}</Text>
              </View>
              <View className='flex-row items-center'>
                <Image
                  source={icons.role}
                  className='w-6 h-6 mr-2'
                  tintColor={'#D20062'}
                />
                <Text className={`text-lg text-gray-500`}>{data.role}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <View className='w-full shadow-md px-4'>
          <CustomButton
            title='Remove'
            handlePress={handleRemovePress}
            containerStyles={'px-4 mb-4 w-full rounded-[30px] bg-red-500'}
            textStyles={'text-base font-pmedium'}
          />
        </View>
      </View>
      <AlertComponent
        visible={alertVisible}
        title='Remove User'
        message='Do you want to remove this user'
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </View>
  )
}

export default UserDetail
