import { Redirect, Stack } from 'expo-router'
import { Alert, Image, Text, TouchableOpacity } from 'react-native'
import { icons } from '../../constants'

const FoodLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name='camera'
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='calories'
          options={{
            title: '',
            headerShadowVisible: false,
            headerTransparent: true,
            headerShadowVisible: false,
            headerBackTitleVisible: false
          }}
        />
        <Stack.Screen
          name='prediction-result'
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='details'
          options={{
            title: '',
            headerShadowVisible: false,
            headerTransparent: true,
            headerShadowVisible: false,
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name='add-food'
          options={{
            title: '',
            headerShadowVisible: false,
            headerTransparent: true,
            headerShadowVisible: false,
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name='edit-food'
          options={{
            title: '',
            headerShadowVisible: false,
            headerTransparent: true,
            headerShadowVisible: false,
            headerBackTitleVisible: false,
          }}
        />
      </Stack>
    </>
  )
}

export default FoodLayout
