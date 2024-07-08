import { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormFeild'
import CustomButton from '../../components/CustomButton'
import { uploadToFirebase } from '../../lib/firebase' // Import your Firebase upload function
import authService from '../../services/authService'
import { router } from 'expo-router'

const AddUser = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: null, // Change to null to ensure prompt is displayed
    gender: null, // Change to null to ensure prompt is displayed
    weight: '',
    height: '',
    age: '',
    activity_level: null, // Change to null to ensure prompt is displayed
    target: null // Change to null to ensure prompt is displayed
  })

  const [avatarUrl, setAvatarUrl] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageURL, setImageURL] = useState(null)

  const [errors, setErrors] = useState({})

  const validateFields = () => {
    const newErrors = {}
    let isValid = true

    if (!form.username) {
      newErrors.username = 'Username is required'
      isValid = false
    }

    if (!form.email) {
      newErrors.email = 'Email is required'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email is invalid'
      isValid = false
    }

    if (!form.password) {
      newErrors.password = 'Password is required'
      isValid = false
    }

    if (!form.role) {
      newErrors.role = 'Role is required'
      isValid = false
    }

    if (!form.gender) {
      newErrors.gender = 'Gender is required'
      isValid = false
    }

    if (!form.weight) {
      newErrors.weight = 'Weight is required'
      isValid = false
    } else if (parseFloat(form.weight) <= 0) {
      newErrors.weight = 'Weight must be greater than 0'
      isValid = false
    }

    if (!form.height) {
      newErrors.height = 'Height is required'
      isValid = false
    } else if (parseFloat(form.height) <= 0) {
      newErrors.height = 'Height must be greater than 0'
      isValid = false
    }

    if (!form.age) {
      newErrors.age = 'Age is required'
      isValid = false
    } else if (parseInt(form.age) <= 0) {
      newErrors.age = 'Age must be greater than 0'
      isValid = false
    }

    if (!form.activity_level) {
      newErrors.activity_level = 'Activity Level is required'
      isValid = false
    }

    if (!form.target) {
      newErrors.target = 'Target is required'
      isValid = false
    }

    if (!imageURL) {
      newErrors.image = 'Image is required'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const createUser = async () => {
    try {
      const token = await authService.getToken()
      const response = await authService.createUser(token, {
        ...form,
        role: formatInput(form.role),
        gender: formatInput(form.gender),
        activity_level: formatInput(form.activity_level),
        avatar_url: imageURL
      })
      if (response) {
        Alert.alert('Success', 'User created successfully')
        console.log(response)
        router.back()
      }
    } catch (error) {
      console.log(error)
      Alert.alert('Error', 'Failed to create user')
    }
  }

  const handleCreateUser = async () => {
    if (uploading) {
      Alert.alert('Please wait', 'Image is still uploading.')
      return
    }

    if (!validateFields()) {
      return
    }
    await createUser()
  }

  const handleImageUpload = async uri => {
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
      setAvatarUrl(uri)
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
      setAvatarUrl(uri)
      handleImageUpload(uri)
      setModalVisible(false)
    }
  }

  const roles = ['User', 'Admin']
  const genders = ['Male', 'Female']
  const targets = ['Weight Gain', 'Weight Loss', 'Maintain']
  const activity_levels = [
    'Sedentary',
    'Lightly active',
    'Moderately active',
    'Very active',
    'Extra active'
  ]

  return (
    <SafeAreaView className='w-full h-full flex justify-center items-center'>
      <Text className='text-3xl font-pregular mt-4 mb-4'>Add User</Text>
      <ScrollView className='w-full px-4'>
        <FormField
          title='Username *'
          placeholder='username'
          value={form.username}
          handleChangeText={username => setForm({ ...form, username })}
          otherStyles='w-full mt-2'
        />
        {errors.username && (
          <Text className='text-red-500'>{errors.username}</Text>
        )}

        <FormField
          title='Email *'
          placeholder='email'
          value={form.email}
          handleChangeText={email => setForm({ ...form, email })}
          otherStyles='w-full mt-2'
        />
        {errors.email && <Text className='text-red-500'>{errors.email}</Text>}

        <FormField
          title='Password *'
          placeholder={'password'}
          value={form.password}
          handleChangeText={e => setForm({ ...form, password: e })}
          otherStyles='mt-5'
          isSecure
        />
        {errors.password && (
          <Text className='text-red-500'>{errors.password}</Text>
        )}

        <FormField
          title='Role *'
          value={form.role}
          handleChangeText={role => setForm({ ...form, role })}
          isSelect
          options={roles}
          prompt={'Select Role'}
          otherStyles='w-full mt-2'
        />
        {errors.role && <Text className='text-red-500'>{errors.role}</Text>}

        <View className='flex-row justify-between items-center'>
          <View className='w-[48%] mt-2'>
            <FormField
              title='Gender *'
              value={form.gender}
              handleChangeText={gender => setForm({ ...form, gender })}
              isSelect
              options={genders}
              prompt={'Select Gender'}
            />
            {errors.gender && (
              <Text className='text-red-500'>{errors.gender}</Text>
            )}
          </View>

          <View className='w-[48%] mt-2'>
            <FormField
              title='Weight (kg) *'
              placeholder='weight'
              value={form.weight}
              handleChangeText={weight => setForm({ ...form, weight })}
              isNumber
            />
            {errors.weight && (
              <Text className='text-red-500'>{errors.weight}</Text>
            )}
          </View>
        </View>

        <View className='flex-row justify-between items-center'>
          <View className='w-[48%] mt-2'>
            <FormField
              title='Height (cm) *'
              placeholder='height'
              value={form.height}
              handleChangeText={height => setForm({ ...form, height })}
              isNumber
            />
            {errors.height && (
              <Text className='text-red-500'>{errors.height}</Text>
            )}
          </View>
          <View className='w-[48%] mt-2'>
            <FormField
              title='Age *'
              placeholder='age'
              value={form.age}
              handleChangeText={age => setForm({ ...form, age })}
              isNumber
            />
            {errors.age && <Text className='text-red-500'>{errors.age}</Text>}
          </View>
        </View>

        <FormField
          title='Activity Level *'
          value={form.activity_level}
          handleChangeText={activity_level =>
            setForm({ ...form, activity_level })
          }
          isSelect
          options={activity_levels}
          prompt={'Select Activity Level'}
          otherStyles='w-full mt-2'
        />
        {errors.activity_level && (
          <Text className='text-red-500'>{errors.activity_level}</Text>
        )}

        <FormField
          title='Target *'
          value={form.target}
          handleChangeText={target => setForm({ ...form, target })}
          isSelect
          options={targets}
          prompt={'Select Target'}
          otherStyles='w-full mt-2'
        />
        {errors.target && <Text className='text-red-500'>{errors.target}</Text>}

        <View className='mt-6 mb-4'>
          <Text className='text-base text-gray-400 font-pmedium'>Image *</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <View className='w-full h-[200px] border-2 border-gray-300 rounded-2xl flex justify-center items-center mt-2'>
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  className='w-full h-full rounded-2xl'
                  resizeMode={'contain'}
                />
              ) : (
                <Text className='text-gray-500'>Add Image</Text>
              )}
            </View>
          </TouchableOpacity>
          {errors.avatarUrl ? (
            <Text className='text-red-500'>{errors.avatarUrl}</Text>
          ) : null}
        </View>
        {uploading && <ActivityIndicator size='large' color='#0000ff' />}

        <View className='mt-10'>
          <CustomButton
            title='Create a new user'
            handlePress={handleCreateUser}
            containerStyles='px-4 mb-4 w-full rounded-[30px]'
            textStyles='text-base font-pmedium'
          />
        </View>
      </ScrollView>

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
              <Text className='text-base text-blue-500'>
                Select from Gallery
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleTakePhoto} className='mb-4'>
              <Text className='text-base text-blue-500'>Take a Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className='mb-4'
            >
              <Text className='text-base text-red-500'>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const formatInput = input => input.trim().toLowerCase().replace(' ','_')

export default AddUser
