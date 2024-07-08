import { useState } from 'react'
import { Link, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Alert,
  Image
} from 'react-native'

import { icons, images } from '../../constants'
import FormField from '../../components/FormFeild'
import CustomButton from '../../components/CustomButton'
import authService from '../../services/authService'

const SignIn = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [loading, setLoading] = useState(false)

  const submit = async () => {
    try {
      const { email, password } = form
      if (!email || !password) {
        Alert.alert('Please fill in all fields')
        return
      }

      setLoading(true)

      // Call the login method from authService
      const response = await authService.login(email, password)

      // Handle successful login, e.g., show a message or redirect
      router.push('/success')
    } catch (error) {
      // Handle any errors that occure
      Alert.alert('Error', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView className='bg-white h-full'>
      <ScrollView className='h-full'>
        <View
          className='w-full flex justify-center h-full px-4 my-6'
          style={{
            minHeight: Dimensions.get('window').height - 100
          }}
        >
          <View className='flex items-center'>
            <Image
              source={images.logo}
              resizeMode='contain'
              className='w-[71px] h-[65px]'
            />
          </View>

          <Text className='text-2xl mt-10 font-preegular'>Sign In</Text>

          <Text className='text-gray-400 text-xl'>
            Let’s sign in to your account and start your calorie management
          </Text>

          <FormField
            title='Email'
            value={form.email}
            handleChangeText={e => setForm({ ...form, email: e })}
            otherStyles='mt-8'
            keyboardType='email-address'
          />

          <FormField
            title='Password'
            value={form.password}
            handleChangeText={e => setForm({ ...form, password: e })}
            otherStyles='mt-5'
            isSecure
          />

          <View className='flex items-end'>
            <Text className='text-primary mt-2 text-base underline'>
              Forgot password?
            </Text>
          </View>

          <CustomButton
            title='Sign In'
            handlePress={submit}
            containerStyles='mt-5'
            loading={loading}
          />

          <View className='flex justify-center pt-1 flex-row gap-2 mt-1'>
            <Text className='text-lg text-gray-400 font-pregular'>
              Don’t have an account?
            </Text>
            <Link
              href='/sign-up'
              className='text-lg font-psemibold text-primary'
            >
              Sign Up
            </Link>
          </View>

          {/* <View className='flex-row items-center mt-10'>
            <View className='flex-1 h-0.5 bg-gray-300' />
            <Text className='mx-2 text-lg text-gray-400'>or</Text>
            <View className='flex-1 h-0.5 bg-gray-300' />
          </View> */}

          {/* <View className='flex items-center mt-4'>
            <Text className='mx-1 text-lg text-gray-400 mb-2'>
              Sign in with
            </Text>
            <TouchableOpacity onPress={handleLogin}>
              <Image source={icons.google} className='w-10 h-10' />
            </TouchableOpacity>
          </View> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn
