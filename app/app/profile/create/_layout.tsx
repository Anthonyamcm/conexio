import { Stack } from 'expo-router';
import { ProfileCreationHeader } from '@/src/components/molecules';
import { Screen } from '@/src/components/atoms';
import { ProfileCreationProvider } from '@/src/contexts/ProfileCreationContext';
import { StyleSheet } from 'react-native';
import { spacing } from '@/src/utils';

export default function Layout() {
  return (
    <Screen
      preset="fixed"
      safeAreaEdges={['top']}
      contentContainerStyle={{
        flex: 1,
      }}
    >
      <ProfileCreationProvider>
        <ProfileCreationHeader />
        <Stack
          initialRouteName="profile-picture"
          screenOptions={{
            headerShown: false,
            animation: 'fade', // Custom animation for auth screens
          }}
        >
          <Stack.Screen name="profile-picture" />
          <Stack.Screen name="cover-photo" />
          <Stack.Screen name="bio" />
          <Stack.Screen name="social-links" />
          <Stack.Screen name="location" />
          <Stack.Screen name="settings-privacy" />
        </Stack>
      </ProfileCreationProvider>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stepperContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
});
