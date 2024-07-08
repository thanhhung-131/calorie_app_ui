import { useState, useEffect } from 'react'
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, Modal, ActivityIndicator } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormFeild'
import CustomButton from '../../components/CustomButton'
import { uploadToFirebase } from '../../lib/firebase' // Import your Firebase upload function
import authService from '../../services/authService'
import fetchData from '../../services/fetchData'
import { router } from 'expo-router'

const AddFood = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [fat, setFat] = useState('')
  const [carbohydrate, setCarbohydrate] = useState('')
  const [type, setType] = useState('')
  const [image, setImage] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageURL, setImageURL] = useState(null)

  const [nameError, setNameError] = useState('')
  const [descriptionError, setDescriptionError] = useState('')
  const [caloriesError, setCaloriesError] = useState('')
  const [proteinError, setProteinError] = useState('')
  const [fatError, setFatError] = useState('')
  const [carbohydrateError, setCarbohydrateError] = useState('')
  const [typeError, setTypeError] = useState('')
  const [imageError, setImageError] = useState('')

  const validateFields = () => {
    let isValid = true
    if (!name) {
      setNameError('Name is required')
      isValid = false
    } else {
      setNameError('')
    }

    if (!protein) {
      setProteinError('Protein is required')
      isValid = false
    } else {
      setProteinError('')
    }

    if (!fat) {
      setFatError('Fat is required')
      isValid = false
    } else {
      setFatError('')
    }

    if (!carbohydrate) {
      setCarbohydrateError('Carbohydrate is required')
      isValid = false
    } else {
      setCarbohydrateError('')
    }

    if (!type) {
      setTypeError('Type is required')
      isValid = false
    } else {
      setTypeError('')
    }

    if (!imageURL) {
      setImageError('Image is required')
      isValid = false
    } else {
      setImageError('')
    }

    return isValid
  }

  const createFood = async () => {
    try {
      const token = await authService.getToken()
      const response = await fetchData.createFood(token, {
        name,
        description,
        calories_per_serving: calories,
        protein,
        fat,
        carbohydrate,
        type,
        image_url: imageURL
      })
      if (response) {
        Alert.alert('Success', 'Food created successfully')
        router.back()
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create food')
    }
  }

  const handleCreateFood = async () => {
    if (uploading) {
      Alert.alert('Please wait', 'Image is still uploading.')
      return
    }

    if (!validateFields()) {
      return
    }
    await createFood()
  }

  const handleImageUpload = async (uri) => {
    setUploading(true)
    try {
      const fileName = uri.split('/').pop()
      const uploadResp = await uploadToFirebase(uri, fileName)
      setImageURL(uploadResp.downloadUrl)
      console.log('Firebase Image URL:', uploadResp.downloadUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
      Alert.alert('Error', 'There was an error uploading the image.')
    } finally {
      setUploading(false)
    }
  }

  const handleSelectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    })

    if (!result.canceled) {
      const { uri } = result.assets[0]
      setImage(uri)
      handleImageUpload(uri)
      setModalVisible(false)
    }
  }

  const handleTakePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    })

    if (!result.canceled) {
      const { uri } = result.assets[0]
      setImage(uri)
      handleImageUpload(uri)
      setModalVisible(false)
    }
  }

  const foodTypes = ['Non-Vegetarian', 'Vegetarian', 'Mixed']

  const calculateCalories = (fat, carbohydrate, protein) => {
    return (fat * 9 + carbohydrate * 4 + protein * 4).toFixed(2)
  }

  useEffect(() => {
    setCalories(calculateCalories(parseFloat(fat) || 0, parseFloat(carbohydrate) || 0, parseFloat(protein) || 0))
  }, [fat, carbohydrate, protein])

  return (
    <SafeAreaView className='w-full h-full flex justify-center items-center'>
      <Text className='text-3xl font-pregular mt-4 mb-4'>Add Food</Text>
      <ScrollView className='w-full px-4'>
        <FormField
          title='Name *'
          placeholder='name'
          value={name}
          handleChangeText={setName}
          otherStyles='w-full mt-2'
        />
        {nameError ? <Text className='text-red-500'>{nameError}</Text> : null}

        <FormField
          title='Description'
          placeholder='description'
          value={description}
          handleChangeText={setDescription}
          otherStyles='w-full mt-2'
        />
        {descriptionError ? <Text className='text-red-500'>{descriptionError}</Text> : null}

        <View className='flex-row justify-between mt-2'>
          <View className='w-[48%]'>
            <FormField
              title='Calories *'
              placeholder='0'
              value={calories}
              handleChangeText={setCalories}
              isNumber
              editable={false}
              otherStyles='w-full mt-2'
            />
            {caloriesError ? <Text className='text-red-500'>{caloriesError}</Text> : null}
          </View>
          <View className='w-[48%]'>
            <FormField
              title='Protein *'
              placeholder='0'
              value={protein}
              handleChangeText={setProtein}
              isNumber
              otherStyles='w-full mt-2'
            />
            {proteinError ? <Text className='text-red-500'>{proteinError}</Text> : null}
          </View>
        </View>
        <View className='flex-row justify-between mt-2'>
          <View className='w-[48%]'>
            <FormField
              title='Fat *'
              placeholder='0'
              value={fat}
              handleChangeText={setFat}
              isNumber
              otherStyles='w-full mt-2'
            />
            {fatError ? <Text className='text-red-500'>{fatError}</Text> : null}
          </View>
          <View className='w-[48%]'>
            <FormField
              title='Carbohydrate *'
              placeholder='0'
              value={carbohydrate}
              handleChangeText={setCarbohydrate}
              isNumber
              otherStyles='w-full mt-2'
            />
            {carbohydrateError ? <Text className='text-red-500'>{carbohydrateError}</Text> : null}
          </View>
        </View>
        <FormField
          title='Type *'
          value={type}
          handleChangeText={setType}
          isSelect
          options={foodTypes}
          prompt={'Select Food Type'}
          otherStyles='w-full mt-2'
        />
        {typeError ? <Text className='text-red-500'>{typeError}</Text> : null}

        <View className='mt-6 mb-4'>
          <Text className='text-base text-gray-400 font-pmedium'>Image *</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <View className='w-full h-[200px] border-2 border-gray-300 rounded-2xl flex justify-center items-center mt-2'>
              {image ? (
                <Image source={{ uri: image }} className='w-full h-full rounded-2xl' resizeMode={'contain'}/>
              ) : (
                <Text className='text-gray-500'>Add Image</Text>
              )}
            </View>
          </TouchableOpacity>
          {imageError ? <Text className='text-red-500'>{imageError}</Text> : null}
        </View>
        {uploading && <ActivityIndicator size="large" color="#0000ff" />}
        <View className='mt-10'>
          <CustomButton
            title='Create a new food'
            handlePress={handleCreateFood}
            containerStyles='px-4 mb-4 w-full rounded-[30px]'
            textStyles='text-base font-pmedium'
          />
        </View>
      </ScrollView>

      {/* Modal for Image Selection */}
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}
      >
        <View className='flex-1 justify-center items-center'>
          <View className='w-80 h-[200px] bg-white rounded-2xl shadow-lg p-6'>
            <Text className='text-lg font-bold mb-4'>Add Image</Text>
            <TouchableOpacity onPress={handleSelectImage} className='mb-4'>
              <Text className='text-base text-blue-500'>Select from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleTakePhoto} className='mb-4'>
              <Text className='text-base text-blue-500'>Take a Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} className='mb-4'>
              <Text className='text-base text-red-500'>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default AddFood
