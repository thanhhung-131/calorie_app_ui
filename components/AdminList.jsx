import React, { useState } from 'react'
import { View, Text, TextInput, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Loader from './Loader'
import FoodCard from './FoodCard'
import EmptyState from './EmptyState'
import UserCard from './UserCard'

const AdminList = ({ data, title, onFavoritePress, type }) => {
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const itemsPerPage = 6

  const loadMoreItems = () => {
    setCurrentPage(currentPage + 1)
  }

  const handleSearchChange = (text) => {
    setSearchQuery(text)
    setCurrentPage(1) // Reset pagination when search query changes
  }

  const filteredData = data.filter((item) => {
    if (type === 'food') {
      return item.name.toLowerCase().includes(searchQuery.toLowerCase())
    } else {
      return (
        item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
  })

  const displayedItems = filteredData.slice(0, currentPage * itemsPerPage)

  return (
    <SafeAreaView className='w-full bg-white'>
      <View className='w-full px-2 items-start mb-4'>
        <Text className='text-2xl font-pregular'>{title} List</Text>
      </View>
      <View className='w-full px-2'>
        <TextInput
          placeholder={`Search ${type === 'food' ? 'Food' : 'User'}`}
          value={searchQuery}
          onChangeText={handleSearchChange}
          className='w-full p-2 border border-gray-300 rounded-md mb-4'
        />
      </View>
      <ScrollView className='w-full'>
        {loading ? (
          <Loader />
        ) : displayedItems.length === 0 ? (
          type === 'food' ? (
            <EmptyState title='No Food Found' />
          ) : (
            <EmptyState title='No User Found' />
          )
        ) : (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              padding: 4
            }}
          >
            {displayedItems.map((item, index) => (
              <View key={index} style={{ width: '48%', marginVertical: 4 }}>
                {type === 'food' ? (
                  <FoodCard
                    item={item}
                    isList={true}
                    index={index}
                    onFavoritePress={() => onFavoritePress(item)}
                  />
                ) : (
                  <UserCard item={item} index={index} isList={true} />
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      {filteredData.length > displayedItems.length && (
        <View style={{ alignItems: 'center', marginVertical: 10 }}>
          <Text className='text-lg text-primary font-psemibold' onPress={loadMoreItems}>Load more</Text>
        </View>
      )}
    </SafeAreaView>
  )
}

export default AdminList
