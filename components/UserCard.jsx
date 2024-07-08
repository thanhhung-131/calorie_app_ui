import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { icons } from '../constants'
import { router } from 'expo-router'

const UserCard = ({ item, index, isList, containerStyle, itemStyle }) => {
  index = index + 1

  const colors = ['bg-primary-light', 'bg-secondary-light']
  let bgColor

  if (isList) {
    if ((index - 1) % 4 === 0 || (index - 1) % 4 === 3) {
      bgColor = colors[0]
    } else {
      bgColor = colors[1]
    }
  } else {
    if (index % 2 === 0) {
      bgColor = colors[1]
    } else {
      bgColor = colors[0]
    }
  }

  return (
    <TouchableOpacity
      activeOpacity={0.4}
      onPress={() =>
        router.push({
          pathname: '/user-details',
          params: {
            id: item.id,
            bg: bgColor
          }
        })
      }
    >
      <View
        className={`max-h-[241px] max-w-[203px] flex justify-center items-center rounded-3xl overflow-hidden shadow-lg p-1 ${bgColor} ${containerStyle}`}
      >
        <Image
          source={{
            uri: item.avatar_url
              ? item.avatar_url
              : item.gender === 'male'
              ? 'https://img.freepik.com/premium-vector/businessman-avatar-cartoon-character-profile_18591-50581.jpg?w=740'
              : 'https://img.freepik.com/premium-vector/businesswoman-avatar-cartoon-character-profile_18591-50580.jpg?w=740'
          }}
          className={'rounded-full w-28 h-28 mb-3 mt-4'}
          resizeMode='cover'
        />
        <View className={`px-4 ${itemStyle}`}>
          <Text
            numberOfLines={1}
            className={'text-xl font-pregular text-gray-600 text-center'}
          >
            {item.username}
          </Text>
          <Text
            numberOfLines={1}
            className={'text-sm text-gray-500 text-center mt-1 mb-1'}
          >
            {item.role}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default UserCard
