import { useState } from 'react'
import { Link, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, Text, ScrollView, Dimensions, Alert, Image } from 'react-native'

import { images } from '../../constants'
import FormField from '../../components/FormFeild'
import CustomButton from '../../components/CustomButton'
import authService from '../../services/authService'

const SignUp = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmation: '',
  })

  const submit = async () => {
    try {
      const { username, email, password, confirmation } = form;
      if (!username || !email || !password || !confirmation) {
        Alert.alert('Please fill in all fields');
        return;
      }

      if (password !== confirmation) {
        Alert.alert('Passwords do not match');
        return;
      }

      // Gọi phương thức register từ service
      const newUser = await authService.register(username, email, password);

      // Xử lý khi đăng ký thành công, ví dụ hiển thị thông báo hoặc chuyển hướng
      Alert.alert('Registration successful');
      // Nếu cần, bạn có thể chuyển hướng đến màn hình khác ở đây
      router.push('/sign-in')

    } catch (error) {
      // Xử lý khi có lỗi xảy ra
      Alert.alert('Error', error.message);
    }
  };


  return (
    <SafeAreaView className='bg-white h-full'>
      <ScrollView>
        <View
          className='w-full flex justify-center h-full px-4 my-6'
          style={{
            minHeight: Dimensions.get('window').height - 200
          }}
        >
          <View className='flex items-center'>
            <Image
              source={images.logo}
              resizeMode='contain'
              className='w-[71px] h-[65px]'
            />
          </View>

          <Text className='text-2xl mt-10 font-preegular'>Sign Up</Text>

          <Text className='text-gray-400 text-xl'>
            Let’s sign up to your account and start your calorie management
          </Text>

          <FormField
            title='Email'
            value={form.email}
            handleChangeText={e => setForm({ ...form, email: e })}
            otherStyles='mt-8'
            keyboardType='email-address'
          />

          <FormField
            title='Your name'
            value={form.username}
            handleChangeText={e => setForm({ ...form, username: e })}
            otherStyles='mt-5'
          />

          <FormField
            title='Password'
            value={form.password}
            handleChangeText={e => setForm({ ...form, password: e })}
            otherStyles='mt-5'
            isSecure
          />

          <FormField
            title='Confirmation'
            value={form.confirmation}
            handleChangeText={e => setForm({ ...form, confirmation: e })}
            otherStyles='mt-5'
            isSecure
          />

          <CustomButton
            title='Sign Up'
            handlePress={submit}
            containerStyles='mt-5'
          />

          <View className='flex justify-center pt-5 flex-row gap-2'>
            <Text className='text-lg text-gray-400 font-pregular'>
              Have an account already?
            </Text>
            <Link
              href='/sign-in'
              className='text-lg font-psemibold text-primary'
            >
              Login
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp
