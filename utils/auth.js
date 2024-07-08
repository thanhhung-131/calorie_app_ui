// utils/auth.js

import AsyncStorage from '@react-native-async-storage/async-storage'

export const saveToken = async token => {
  try {
    await AsyncStorage.setItem('userToken', token)
  } catch (error) {
    console.error('Error saving token:', error)
  }
}

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken')
    return token
  } catch (error) {
    console.error('Error retrieving token:', error)
  }
}

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('userToken')
  } catch (error) {
    console.error('Error removing token:', error)
  }
}

export const isTokenAvailable = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken')
    return token !== null
  } catch (error) {
    console.error('Error checking token:', error.message)
    return false
  }
}
