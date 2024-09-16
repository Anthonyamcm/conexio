import { Screen } from '@/src/components/atoms';
import { Stepper } from '@/src/components/molecules';
import { RegistrationProvider } from '@/src/contexts/RegistrationContext';
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <RegistrationProvider>
      <Screen
        preset="fixed"
        safeAreaEdges={['top', 'bottom']}
        contentContainerStyle={{
          flex: 1,
        }}
      >
        <Stepper />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="name" />
          <Stack.Screen name="username" />
          <Stack.Screen name="dob" />
          <Stack.Screen name="mobile" />
          <Stack.Screen name="otp" />
          <Stack.Screen name="password" />
        </Stack>
      </Screen>
    </RegistrationProvider>
  );
}
