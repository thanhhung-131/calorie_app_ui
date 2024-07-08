import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { icons } from '../constants'

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  isNumber,
  isSelect,
  options,
  prompt,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className='text-base text-gray-400 font-pmedium'>{title}</Text>

      <View className='w-full h-14 px-4 rounded-2xl border-2 border-gray-300 focus:border-primary flex flex-row items-center'>
        {isSelect ? (
          <Picker
            selectedValue={value}
            style={{ height: 50, width: '100%' }}
            onValueChange={handleChangeText}
          >
            <Picker.Item label={prompt || 'Select...'} value={null} />
            {options.map((option, index) => (
              <Picker.Item key={index} label={option} value={option} />
            ))}
          </Picker>
        ) : (
          <TextInput
            className='flex-1 font-pregular text-base'
            value={value}
            placeholder={placeholder}
            placeholderTextColor='#9D9D9D'
            onChangeText={handleChangeText}
            keyboardType={isNumber ? 'numeric' : 'default'}
            secureTextEntry={
              (title === 'Password' || title === 'Password *' || title === 'Confirmation') && !showPassword
            }
            {...props}
          />
        )}

        {(title === 'Password' || title === 'Password *' || title === 'Confirmation') && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className='w-6 h-6'
              resizeMode='contain'
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default FormField
