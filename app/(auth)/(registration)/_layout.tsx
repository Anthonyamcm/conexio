import { RegistrationProvider } from '@/src/contexts/RegistrationContext';
import { Stack } from 'expo-router';
import { ProgressHeader } from '@/src/components/molecules';
import { Screen } from '@/src/components/atoms';

export default function Layout() {
  return (
    <Screen
      preset="fixed"
      contentContainerStyle={{
        flex: 1,
      }}
    >
      <RegistrationProvider>
        <ProgressHeader />
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
          <Stack.Screen name="password" />
          <Stack.Screen name="mobile" />
          <Stack.Screen name="email" />
          <Stack.Screen name="otp" />
        </Stack>
      </RegistrationProvider>
    </Screen>
  );
}
