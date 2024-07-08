import { useState } from 'react'
import { Button, View, Text, Alert, ScrollView } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import AIService from '../../services/AIService'
import { uploadToFirebase } from '../../lib/firebase'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from './../../components/CustomButton'
import PredictionResult from '../../components/PredictionResult'

export default function CameraScreen () {
  const [permission, requestPermission] = ImagePicker.useCameraPermissions()
  const [image, setImage] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [prediction, setPrediction] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const [refresh, setRefresh] = useState(false)

  const handlePrediction = async uri => {
    try {
      const fileName = uri.split('/').pop()
      const uploadResp = await uploadToFirebase(uri, fileName)
      const img_url = uploadResp.downloadUrl
      const prediction = await AIService.predictImage(img_url)
      setPrediction(prediction)
    } catch (error) {
      console.error('Error handling prediction:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const onRefresh = () => {
    setRefresh(true)
    handlePrediction(image)
    setRefresh(false)
  }

  const handleRetry = () => {
    setRetryCount(retryCount + 1)
    setIsUploading(true)
    handlePrediction(image)
  }

  const takePicture = async () => {
    try {
      const cameraResp = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1
      })
      if (!cameraResp.canceled) {
        const { uri } = cameraResp.assets[0]
        setImage(uri)
        setIsUploading(true)
        handlePrediction(uri)
      }
    } catch (e) {
      Alert.alert('Error Taking Photo', e.message)
    }
  }

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1
      })

      if (!result.canceled) {
        const { uri } = result.assets[0]
        setImage(uri)
        setIsUploading(true)
        handlePrediction(uri)
      }
    } catch (error) {
      console.log('Error picking image:', error)
    }
  }

  if (!permission) {
    // Camera permissions are still loading.
    return <View />
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className={`flex-1 justify-center items-center`}>
        <Text className={`text-center`}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title='Grant Permission' />
      </View>
    )
  }

  return (
    <SafeAreaView className={`flex w-full h-full justify-center items-center`}>
      {!image ? (
        <View>
          <CustomButton
            title={'Take Picture'}
            handlePress={takePicture}
            containerStyles={`mb-2 px-4`}
            isDisabled={isUploading}
          />
          <CustomButton
            title={'Pick Image from Library'}
            handlePress={pickImage}
            containerStyles={`mb-2 px-4`}
            isDisabled={isUploading}
          />
        </View>
      ) : (
        <View className={`w-full h-full bg-primary`}>
          <PredictionResult
            image={image}
            prediction={prediction}
            onRetry={handleRetry}
            retryCount={retryCount}
            isLoading={isUploading}
          />
        </View>
      )}
    </SafeAreaView>
  )
}
