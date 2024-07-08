import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { icons } from '../constants'
import { router } from 'expo-router'

const FoodCard = ({ item, index, type, isList, favorite, onFavoritePress, containerStyle, itemStyle }) => {
  index = index + 1

  const colors = ['bg-primary-light', 'bg-secondary-light']
  const iconColor = ['#31D6D6', '#FFA0A0']
  let bgColor
  let icon

  if (isList) {
    if ((index - 1) % 4 === 0 || (index - 1) % 4 === 3) {
      bgColor = colors[0]
      icon = iconColor[0]
    } else {
      bgColor = colors[1]
      icon = iconColor[1]
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
          pathname: '/details',
          params: {
            id: item.id,
            bg: bgColor,
            favorite
          }
        })
      }
    >
      <View
        className={`max-h-[241px] max-w-[203px] flex justify-center items-center rounded-3xl overflow-hidden shadow-lg p-1 ${bgColor} ${containerStyle}`}
      >
        {favorite && (
          <TouchableOpacity
            className='absolute right-4 top-3'
            onPress={onFavoritePress}
          >
            <Image
              source={icons.favorite}
              tintColor={`${icon}`}
              className={`w-6 h-6`}
            />
          </TouchableOpacity>
        )}
        <Image
          source={{
            uri: item.images[0]?.image_url ? item.images[0]?.image_url : 'https://as2.ftcdn.net/v2/jpg/02/73/82/69/1000_F_273826938_g3zTc4k5UtVsYDgZnPyVkzR6WEmyeuhB.jpg'
          }}
          className={'rounded-full w-28 h-28 mb-3 mt-4'}
          resizeMode='cover'
        />
        <View className={`px-4 ${itemStyle}`}>
          <Text
            numberOfLines={1}
            className={'text-xl font-pregular text-gray-600 text-center'}
          >
            {item.name}
          </Text>
          <Text
            numberOfLines={1}
            className={'text-sm text-gray-500 text-center mt-1 mb-1'}
          >
            {item.description}
          </Text>
          {(type === 'high-calories' || type === 'search' || type === 'all-foods') && (
            <Text
              className={'text-lg text-gray-600 text-center mt-1 mb-1 pb-1'}
            >
              {item.calories_per_serving} Kcal
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default FoodCard
