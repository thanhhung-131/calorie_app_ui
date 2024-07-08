import React from 'react'
import { View, Text, Image } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import CustomButton from '../../components/CustomButton'

const PredictionResultScreen = () => {
  const router = useRouter()
  const { image, prediction, retryCount } = useLocalSearchParams()
  const parsedPrediction = JSON.parse(prediction)

  const handleRetry = () => {
    const newRetryCount = Number(retryCount) + 1
    router.push({
      pathname: 'camera',
      params: { retryCount: newRetryCount }
    })
  }

  return (
    <View className={`w-full h-full bg-white items-center justify-center`}>
      <View className={`h-1/2 w-full`}>
        <Image
          source={{ uri: image }}
          className={`w-full h-full`}
          resizeMode='cover'
        />
      </View>
      {parsedPrediction && (
        <View
          className={`h-1/2 w-full items-center justify-center bg-primary rounded-[30px]`}
        >
          <Text className={`text-lg text-gray-800 m-4`}>
            Prediction: {parsedPrediction.message || JSON.stringify(parsedPrediction)}
          </Text>
          {parsedPrediction.message === "Unable to recognize" && Number(retryCount) < 3 && (
            <CustomButton title="Try Again" onPress={handleRetry} containerStyles={'px-4 mb-6'} />
          )}
          {Number(retryCount) >= 3 && (
            <Text className={`text-lg text-red-600 m-4`}>
              Maximum retry limit reached.
            </Text>
          )}
        </View>
      )}
      <CustomButton title="Back to Camera" handlePress={() => router.push('camera')} containerStyles={'px-4'}/>
    </View>
  )
}

export default PredictionResultScreen
