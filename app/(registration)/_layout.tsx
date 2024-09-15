import { Screen, Step } from '@/src/components/atoms';
import { Header, Stepper } from '@/src/components/molecules';
import { RegistrationProvider } from '@/src/contexts/RegistrationContext';
import { spacing } from '@/src/utlis';
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
        </Stack>
      </Screen>
    </RegistrationProvider>
  );
}
