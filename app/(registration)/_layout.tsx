import { Screen } from '@/src/components/atoms';
import { Stepper } from '@/src/components/molecules';
import { RegistrationProvider } from '@/src/contexts/RegistrationContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RegistrationProvider>
        <Screen
          preset="fixed"
          safeAreaEdges={['top', 'bottom']}
          contentContainerStyle={{
            flex: 1,
          }}
        >
          <Stepper />
          <Stack
            screenOptions={{
              headerShown: false,

              animation: 'fade',
              animationDuration: 300,
            }}
          >
            <Stack.Screen name="name" />
            <Stack.Screen name="username" />
            <Stack.Screen name="dob" />
            <Stack.Screen name="mobile" />
            <Stack.Screen name="email" />
            <Stack.Screen name="otp" />
            <Stack.Screen name="password" />
          </Stack>
        </Screen>
      </RegistrationProvider>
    </GestureHandlerRootView>
  );
}
