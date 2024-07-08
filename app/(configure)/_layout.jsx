import { Redirect, Stack } from 'expo-router'

const ConfigureLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name='select'
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='weight'
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='congratulation'
          options={{
            headerShown: false
          }}
        />
      </Stack>
    </>
  )
}

export default ConfigureLayout
