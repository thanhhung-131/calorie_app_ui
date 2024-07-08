import { Redirect, Stack } from "expo-router";

const AuthLayout = () => {

  return (
    <>
      <Stack>
        <Stack.Screen
          name="success"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="update-avatar"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="admin"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name='user-details'
          options={{
            title: '',
            headerShadowVisible: false,
            headerTransparent: true,
            headerShadowVisible: false,
            headerBackTitleVisible: false
          }}
        />
        <Stack.Screen
          name='add-user'
          options={{
            title: '',
            headerShadowVisible: false,
            headerTransparent: true,
            headerShadowVisible: false,
            headerBackTitleVisible: false
          }}
        />
      </Stack>
    </>
  );
};

export default AuthLayout;
