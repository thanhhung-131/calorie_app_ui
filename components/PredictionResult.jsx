import React, { useState } from 'react'
import { View, Text, Image, ScrollView, RefreshControl } from 'react-native'
import { router } from 'expo-router'
import CustomButton from './CustomButton'
import PieChartCustom from './PieChart'
import Loader from './Loader'

const PredictionResult = ({ image, prediction, onRetry, retryCount, isLoading }) => {
  const [refreshing, setRefreshing] = useState(false)

  const data = {
    name: prediction?.prediction,
    calories: prediction?.food_info?.calories_per_serving,
    protein: prediction?.food_info?.protein,
    fat: prediction?.food_info?.fat,
    carbohydrate: prediction?.food_info?.carbohydrate,
    description: prediction?.food_info?.description
  }

  const handleRetry = async () => {
    await onRetry()
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await onRetry()
    setRefreshing(false)
  }

  if (!prediction) {
    return (
      <View className='bg-primary h-full flex justify-center items-center'>
        <Loader />
      </View>
    )
  }

  return (
    <View className='w-full h-full bg-primary items-center justify-center'>
      <View className='h-1/2 w-full'>
        <Image
          source={{ uri: image }}
          className='w-full h-full'
          resizeMode='contain'
        />
      </View>

      <View className='h-1/2 w-full items-center justify-between bg-white rounded-t-[30px] px-8'>
        <ScrollView className='mt-4 w-full mb-2'
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {prediction.status === 'success' && (
                <>
                  <View className='mb-4'>
                    <PieChartCustom data={data} />
                  </View>
                  <View className='flex-col items-start justify-between mb-4'>
                    <Text className='text-xl font-pmedium text-gray-800'>
                      Food
                    </Text>
                    <Text className='text-lg text-gray-400'>
                      {data?.name
                        ? data.name.charAt(0).toUpperCase() + data.name.slice(1)
                        : 'Unknown'}
                    </Text>
                  </View>
                  <View className='flex-col items-start justify-between mb-4'>
                    <Text className='text-xl font-pmedium text-gray-800'>
                      Description
                    </Text>
                    <Text className='text-lg text-gray-400'>
                      {data.description || 'No description available'}
                    </Text>
                  </View>
                </>
              )}
              {prediction?.message === 'Unable to recognize' && retryCount < 3 && (
                <View className='mb-4'>
                  <Text className='text-lg text-gray-800 m-4'>
                    Unable to recognize. Please try again. Make sure your photo
                    is a food photo.
                  </Text>
                  <CustomButton
                    title={`Try Again (${3 - retryCount} attempts left)`}
                    handlePress={handleRetry}
                    containerStyles='px-4 mb-6'
                    isLoading={isLoading}
                  />
                </View>
              )}
              {retryCount >= 3 && (
                <Text className='text-lg text-red-600 mb-4'>
                  Maximum retry limit reached. Please use another photo.
                </Text>
              )}
              <View className='w-full shadow-md mb-4'>
                <CustomButton
                  title='Go Back'
                  handlePress={() => router.back()}
                  containerStyles='px-4 w-full'
                />
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </View>
  )
}

export default PredictionResult
