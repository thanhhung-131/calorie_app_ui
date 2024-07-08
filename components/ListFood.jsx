import React, { useCallback, useState } from 'react';
import { View, FlatList, Text, RefreshControl } from 'react-native';
import FoodCard from './FoodCard';
import EmptyState from './EmptyState';

const ListFood = ({ data, favorite }) => {
  const [refreshing, setRefreshing] = useState(false)

  const renderItem = ({ item, index }) => (
    <View className='w-1/2 p-2'>
      <FoodCard item={item} index={index} type={'high-calories'} isList={true} favorite={favorite}/>
    </View>
  );
  // Refresh data
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await data;
    setRefreshing(false);
  }, []);

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      numColumns={2}
      nestedScrollEnabled
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      ListEmptyComponent={() => (
        <View className='w-full items-center justify-center'>
          <EmptyState title="No Food Found" />
        </View>
      )}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

export default React.memo(ListFood);
