import React, { useEffect, useState } from 'react'
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
  RefreshControl
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import authService from '../../services/authService'
import { icons } from '../../constants'
import { router } from 'expo-router'
import { Picker } from '@react-native-picker/picker'

let role

const Profile = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    height: '',
    age: '',
    gender: '',
    target: '',
    weight: '',
    activity_level: ''
  })

  const [loading, setLoading] = useState(true)
  const [edit, setEdit] = useState(false)
  const [settings, setSettings] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await authService.getToken()
        const userDataFromServer = await authService.getUserDataByToken(token)
        setUserData(userDataFromServer)
      } catch (error) {
        console.error('Failed to fetch user data:', error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSaveChanges = async () => {
    setLoading(true)

    try {
      const token = await authService.getToken()
      const updatedUser = await authService.updateProfile(token, userData)
      role = updatedUser.role
      setUserData(updatedUser)
      setEdit(false)
      Alert.alert('Success', 'Profile updated successfully')
    } catch (error) {
      console.error('Failed to update user data:', error.message)
      Alert.alert('Error', 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          authService.clearUserData()
          router.push('sign-in')
        }
      }
    ])
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#0000ff' />
      </SafeAreaView>
    )
  }

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      const token = await authService.getToken()
      const userDataFromServer = await authService.getUserDataByToken(token)
      setUserData(userDataFromServer)
    } catch (error) {
      console.error('Failed to fetch user data:', error.message)
    } finally {
      setRefreshing(false)
    }
  }

  const handlePress = text => {
    switch (text) {
      case 'Statistics':
        router.push('stats')
        break
      case 'Settings':
        setSettings(true)
        break
      case 'Log out':
        handleLogout()
        break
      default:
        break
    }
  }

  const handleBackPress = () => {
    if (settings) {
      setSettings(false)
    } else if (edit) {
      setEdit(false)
    }
  }

  const handleCameraPress = () => {
    router.push('update-avatar')
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {settings && (
          <View style={styles.header}>
            <Text style={styles.headerText}>Settings</Text>
          </View>
        )}
        {(settings || edit) && (
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Image source={icons.back} style={styles.backIcon} />
          </TouchableOpacity>
        )}
        {edit && (
          <View>
            <TouchableOpacity
              onPress={handleBackPress}
              style={styles.backButton}
            >
              <Image source={icons.back} style={styles.backIcon} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCameraPress}
              style={styles.cameraButton}
            >
              <Image source={icons.camera} style={styles.cameraIcon} />
            </TouchableOpacity>
          </View>
        )}
        {userData && (
          <View style={styles.profileContainer}>
            {!settings && (
              <View style={styles.avatarContainer} className='bg-primary'>
                <Image
                  source={{
                    uri: userData.avatar
                      ? userData.avatar
                      : userData.gender === 'male'
                      ? 'https://img.freepik.com/premium-vector/businessman-avatar-cartoon-character-profile_18591-50581.jpg?w=740'
                      : 'https://img.freepik.com/premium-vector/businesswoman-avatar-cartoon-character-profile_18591-50580.jpg?w=740'
                  }}
                  style={styles.avatar}
                />
              </View>
            )}
            <View style={styles.infoContainer}>
              {settings ? (
                <View style={styles.setting_box}>
                  <ButtonItem
                    icon={icons.notification}
                    text='Notifications'
                    onPress={() => router.push('stats')}
                  />
                  <ButtonItem
                    icon={icons.privacy}
                    text='Privacy'
                    onPress={() => setSettings(true)}
                  />
                  <ButtonItem
                    icon={icons.security}
                    text='Security'
                    onPress={handlePress}
                  />
                  <ButtonItem
                    icon={icons.help}
                    text='Help'
                    onPress={handlePress}
                  />
                  <ButtonItem
                    icon={icons.about}
                    text='About'
                    onPress={handlePress}
                  />
                </View>
              ) : edit ? (
                <View style={styles.edit_box}>
                  <EditItem
                    icon={icons.name}
                    value={userData.username}
                    onChangeText={text =>
                      setUserData({ ...userData, username: text })
                    }
                  />
                  <EditItem
                    icon={icons.mail}
                    value={userData.email}
                    onChangeText={text =>
                      setUserData({ ...userData, email: text })
                    }
                  />
                  <EditItem
                    icon={icons.height}
                    value={userData.height}
                    onChangeText={text =>
                      setUserData({ ...userData, height: text })
                    }
                  />
                  <EditItem
                    icon={icons.age}
                    value={userData.age}
                    onChangeText={text =>
                      setUserData({ ...userData, age: text })
                    }
                  />
                  <EditItem
                    icon={icons.gender}
                    value={userData.gender}
                    onChange={text =>
                      setUserData({ ...userData, gender: text })
                    }
                    options={[
                      { label: 'Male', value: 'male' },
                      { label: 'Female', value: 'female' }
                    ]}
                  />
                  <EditItem
                    icon={icons.target}
                    value={userData.target}
                    onChange={text =>
                      setUserData({ ...userData, target: text })
                    }
                    options={[
                      { label: 'Weight Gain', value: 'weight_gain' },
                      { label: 'Weight Loss', value: 'weight_loss' },
                      { label: 'Maintain', value: 'maintain' }
                    ]}
                  />
                  <EditItem
                    icon={icons.weight}
                    value={userData.weight}
                    onChangeText={text =>
                      setUserData({ ...userData, weight: text })
                    }
                  />
                  <EditItem
                    icon={icons.activity}
                    value={userData.activity_level}
                    onChange={text =>
                      setUserData({ ...userData, activity_level: text })
                    }
                    options={[
                      { label: 'Sedentary', value: 'sedentary' },
                      { label: 'Lightly Active', value: 'lightly_active' },
                      {
                        label: 'Moderately Active',
                        value: 'moderately_active'
                      },
                      { label: 'Very Active', value: 'very_active' },
                      { label: 'Extra Active', value: 'extra_active' }
                    ]}
                  />
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={handleSaveChanges}
                  >
                    <Text style={styles.editButtonText}>Save Changes ></Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <View style={styles.box}>
                    <InfoItem icon={icons.name} text={userData.username} />
                    <InfoItem icon={icons.mail} text={userData.email} />
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => setEdit(true)}
                    >
                      <Text style={styles.editButtonText}>Edit ></Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.box}>
                    <ButtonItem
                      icon={icons.statistics}
                      text='Statistics'
                      onPress={() => router.push('stats')}
                    />
                    {userData.role === 'admin' && (
                      <ButtonItem
                        icon={icons.admin}
                        text='Admin'
                        onPress={() => router.push('admin')}
                      />
                    )}
                    <ButtonItem
                      icon={icons.settings}
                      text='Settings'
                      onPress={() => setSettings(true)}
                    />
                    <ButtonItem
                      icon={icons.logout}
                      text='Log out'
                      onPress={handlePress}
                    />
                  </View>
                </>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const InfoItem = ({ icon, text }) => (
  <View style={styles.infoItem}>
    <Image source={icon} style={styles.icon} />
    <Text style={styles.infoText}>{text}</Text>
  </View>
)

const EditItem = ({ icon, value, onChangeText, onChange, options }) => (
  <View style={styles.infoItem}>
    <Image source={icon} style={styles.icon} />
    {onChangeText ? (
      <TextInput
        style={styles.infoText}
        value={value?.toString()}
        onChangeText={onChangeText}
      />
    ) : (
      <Picker
        selectedValue={value}
        style={styles.picker}
        onValueChange={onChange}
        mode='dropdown'
      >
        {options.map(option => (
          <Picker.Item
            key={option.value}
            label={option.label}
            value={option.value}
          />
        ))}
      </Picker>
    )}
  </View>
)

const ButtonItem = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.infoItem} onPress={() => onPress(text)}>
    <Image source={icon} style={styles.icon} />
    <Text style={styles.infoText}>{text}</Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  content: {
    flexGrow: 1
  },
  profileContainer: {
    flex: 1
  },
  avatarContainer: {
    alignItems: 'center'
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginTop: 24,
    marginBottom: 80
  },
  infoContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    top: role === 'admin' ? -180 : -80
  },
  box: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 40,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 20
  },
  edit_box: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 40,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 80
  },
  setting_box: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 40,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 200
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    width: '100%',
    marginBottom: 8
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 16,
    tintColor: '#31D6D6'
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    flex: 1
  },
  editButton: {
    marginTop: 16
  },
  editButtonText: {
    fontSize: 18,
    color: '#31D6D6',
    fontWeight: '500'
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 14,
    zIndex: 40
  },
  backIcon: {
    width: 35,
    height: 35,
    tintColor: '#000'
  },
  cameraButton: {
    position: 'absolute',
    top: 10,
    right: 14,
    zIndex: 40
  },
  cameraIcon: {
    width: 35,
    height: 35,
    tintColor: '#000'
  },
  header: {
    alignItems: 'center',
    marginBottom: 20
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600'
  },
  picker: {
    flex: 1,
    height: 50
  }
})

export default Profile
