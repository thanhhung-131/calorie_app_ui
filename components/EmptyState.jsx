import { router } from "expo-router";
import { View, Text, Image, SafeAreaView } from "react-native";

import { images } from "../constants";

const EmptyState = ({ title }) => {
  return (
    <SafeAreaView className="flex justify-center items-center px-10">
      <Image
        source={images.empty}
        resizeMode="contain"
        className="w-[270px] h-[216px]"
      />
      <Text className="text-lg font-pmedium text-gray-400">{title}</Text>
    </SafeAreaView>
  );
};

export default EmptyState;
