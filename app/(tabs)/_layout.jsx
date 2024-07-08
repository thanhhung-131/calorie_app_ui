import { Redirect, router, Tabs } from 'expo-router'
import { Image, Text, TouchableOpacity, View } from 'react-native'

import { icons } from '../../constants'

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className='flex items-center justify-center mt-3'>
      <Image
        source={icon}
        resizeMode='contain'
        tintColor={color}
        className='w-7 h-7'
      />
      <Text
        className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  )
}

const TabLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#000',
          tabBarInactiveTintColor: '#9d9d9d',
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: '#fff',
            height: 65,
          }
        }}
      >
        <Tabs.Screen
          name='home'
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.home} color={color} focused={focused} />
            )
          }}
        />
        <Tabs.Screen
          name='favorite'
          options={{
            title: '',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.favorite} color={color} focused={focused} />
            ),
            headerShadowVisible: false,
            headerTransparent: true,
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} className='pl-6'>
                <Image source={icons.back} className='w-[35px] h-[35px]'/>
              </TouchableOpacity>
            ),
          }}
        />

        <Tabs.Screen
          name='stats'
          options={{
            title: '',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.details} color={color} focused={focused} />
            ),
            headerShadowVisible: false,
            headerTransparent: true,
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} className='pl-6'>
                <Image source={icons.back} className='w-[35px] h-[35px]'/>
              </TouchableOpacity>
            ),
          }}
        />

        <Tabs.Screen
          name='profile'
          options={{
            title:'',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.profile} color={color} focused={focused} />
            ),
          }}
        />
      </Tabs>
    </>
  )
}

export default TabLayout
