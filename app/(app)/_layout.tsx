import { Screen } from '@/src/components/atoms';
import { spacing } from '@/src/utils';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Screen
        preset="auto"
        safeAreaEdges={['bottom']}
        contentContainerStyle={{
          flex: 1,
        }}
      >
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(ProfileCreation)" />
        </Stack>
      </Screen>
    </GestureHandlerRootView>
  );
}
