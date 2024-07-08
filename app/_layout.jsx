import { router, SplashScreen, Stack } from 'expo-router'
import { useFonts } from 'expo-font'
import { useEffect } from 'react'
import { Image, TouchableOpacity } from 'react-native'
import { icons } from '../constants'

SplashScreen.preventAutoHideAsync()

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    'Poppins-Black': require('../assets/fonts/Poppins-Black.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('../assets/fonts/Poppins-ExtraBold.ttf'),
    'Poppins-ExtraLight': require('../assets/fonts/Poppins-ExtraLight.ttf'),
    'Poppins-Light': require('../assets/fonts/Poppins-Light.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Thin': require('../assets/fonts/Poppins-Thin.ttf')
  })

  useEffect(() => {
    if (error) throw error

    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, error])

  if (!fontsLoaded) {
    return null
  }

  if (!fontsLoaded && !error) {
    return null
  }

  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen name='(auth)' options={{ headerShown: false }} />
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      <Stack.Screen name='(configure)' options={{ headerShown: false }} />
      <Stack.Screen name='(food)' options={{ headerShown: false }} />
      <Stack.Screen
        name='search/[query]'
        options={{
          title: '',
          headerShadowVisible: false,
          headerTransparent: true,
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className=''>
              <Image source={icons.back} className='w-[35px] h-[35px]' />
            </TouchableOpacity>
          )
        }}
      />
    </Stack>
  )
}

export default RootLayout
