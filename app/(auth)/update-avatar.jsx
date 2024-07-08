import { useState } from 'react'
import { Button, View, Text, Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import AIService from '../../services/AIService'
import { uploadToFirebase } from '../../lib/firebase'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from './../../components/CustomButton'
import authService from '../../services/authService'
import { router } from 'expo-router'
import Loader from '../../components/Loader'

export default function CameraScreen () {
  const [permission, requestPermission] = ImagePicker.useCameraPermissions()
  const [image, setImage] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const handleChangeAvatar = async uri => {
    try {
      const fileName = uri.split('/').pop()
      const uploadResp = await uploadToFirebase(
        uri,
        fileName,
        setUploadProgress
      )
      const img_url = uploadResp.downloadUrl
      const token = await authService.getToken()
      const response = await authService.updateProfile(token, {
        avatar_url: img_url
      })
      router.push('profile')
    } catch (error) {
      console.error('Error changing avatar:', error)
    } finally {
      setIsUploading(false)
    }
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
        handleChangeAvatar(uri)
        router.push('profile')
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
        handleChangeAvatar(uri)
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
        <Loader />
      )}
    </SafeAreaView>
  )
}
