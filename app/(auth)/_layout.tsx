import { Screen } from '@/src/components/atoms';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Screen
        preset="fixed"
        safeAreaEdges={['top', 'bottom']}
        contentContainerStyle={{
          flex: 1,
        }}
      >
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(registration)" />
          <Stack.Screen name="(login)" />
        </Stack>
      </Screen>
    </GestureHandlerRootView>
  );
}
