import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loader from './Loader';
import FoodCard from './FoodCard';
import EmptyState from './EmptyState';

const FavoriteComponent = ({ data, title, onFavoritePress }) => {
  const [loading, setLoading] = useState(false);

  return (
    <SafeAreaView className='w-full bg-white'>
      <View className='w-full px-2 items-start mb-4'>
        <Text className='text-2xl font-pregular'>Favorite {title}</Text>
      </View>
      <View className='w-full'>
        {loading ? (
          <Loader />
        ) : data && data.length === 0 ? (
          <EmptyState title='No Food Found' />
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', padding: 4 }}>
            {data && data.map((item, index) => (
              <View key={index} style={{ width: '48%', marginVertical: 4 }}>
                <FoodCard
                  item={item} // Truyền item vào props của FoodCard
                  isList={true}
                  index={index}
                  favorite={true}
                  onFavoritePress={() => onFavoritePress(item)}
                />
              </View>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default FavoriteComponent;
