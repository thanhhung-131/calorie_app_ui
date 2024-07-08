import { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import fetchData from '../../services/fetchData' // Adjust the import path as necessary
import SearchInput from '../../components/SearchInput'
import EmptyState from './../../components/EmptyState'
import { icons } from '../../constants'

const Search = () => {
  const { query } = useLocalSearchParams()
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const colors = ['bg-primary-light', 'bg-secondary-light']

  const searchFoods = async query => {
    setLoading(true)
    try {
      const data = await fetchData.searchFood(query)
      setFoods(data)
    } catch (error) {
      console.error('Failed to fetch foods:', error)
      setFoods([])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (query) {
      searchFoods(query)
    }
  }, [query])

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={foods}
        keyExtractor={item => item.id.toString()} // Adjust keyExtractor to match your data structure
        renderItem={({ item, index }) => (
          <View className='px-4'>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                router.push({
                  pathname: '/details',
                  params: {
                    id: item.id,
                    bg:
                      index % 2 === 0
                        ? (colors[1])
                        : (colors[0])
                  }
                })
              }}
              style={styles.cardContainer}
              className={`${
                index % 2 === 0 ? 'bg-primary-light' : 'bg-secondary-light'
              } mb-2`}
            >
              <Image
                source={{
                  uri: item.images[0].image_url
                }}
                style={styles.image}
                resizeMode='cover'
              />
              <View style={styles.textContainer}>
                <Text numberOfLines={1} style={styles.nameText}>
                  {item.name}
                </Text>
                <Text numberOfLines={1} style={styles.descriptionText}>
                  {item.description}
                </Text>
                <Text style={styles.caloriesText}>
                  {item.calories_per_serving} Kcal
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        ListHeaderComponent={() => (
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Search Results</Text>
            <Text style={styles.queryText}>{query}</Text>
            <SearchInput
              initialQuery={query}
              refetch={() => searchFoods(query)}
              style={styles.searchInput}
            />
          </View>
        )}
        ListEmptyComponent={() => <EmptyState title='No Foods Found' />}
        refreshing={loading}
        onRefresh={() => searchFoods(query)}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center'
  },
  nameText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333333'
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    marginTop: 4
  },
  caloriesText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#1E3A8A',
    marginTop: 4
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  headerText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#6B7280',
    marginTop: 40,
  },
  queryText: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E3A8A',
    marginTop: 8
  },
  searchInput: {
    marginTop: 12
  }
})

export default Search
