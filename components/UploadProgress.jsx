import React from 'react'
import { View, Text } from 'react-native'
import * as Progress from 'react-native-progress'

const UploadProgress = ({ progress }) => {
  return (
    <View className={`absolute bottom-40 left-0 right-0 p-4 bg-white flex-col justify-center items-center px-6`}>
      <Progress.Circle size={50} indeterminate={true} progress={progress/100}/>
      <Text className={`text-center mb-2`}>
        Progressing: {Math.round(progress)}%
      </Text>
    </View>
  )
}

export default UploadProgress
