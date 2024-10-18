import { Screen } from '@/src/components/atoms';
import { Slot, Stack } from 'expo-router';
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
        <Slot />
      </Screen>
    </GestureHandlerRootView>
  );
}
