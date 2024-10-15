import { Screen } from '@/src/components/atoms';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Screen
        preset="fixed"
        safeAreaEdges={['bottom']}
        contentContainerStyle={{
          flex: 1,
        }}
      >
        <Stack
          initialRouteName="index"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="privacy" />
        </Stack>
      </Screen>
    </GestureHandlerRootView>
  );
}
