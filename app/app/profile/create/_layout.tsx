import { RegistrationProvider } from '@/src/contexts/RegistrationContext';
import { Stack, router } from 'expo-router';
import { RegistrationHeader } from '@/src/components/molecules';
import { Screen } from '@/src/components/atoms';
import { ProfileCreationProvider } from '@/src/contexts/ProfileCreationContext';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { spacing } from '@/src/utils';

export default function Layout() {
  const backPressed = () => {
    router.back();
  };
  return (
    <Screen
      preset="fixed"
      safeAreaEdges={['top']}
      contentContainerStyle={{
        flex: 1,
      }}
    >
      <ProfileCreationProvider>
        <View style={styles.stepperContainer}>
          <TouchableOpacity onPress={backPressed}>
            <Entypo name="chevron-left" size={32} color="black" />
          </TouchableOpacity>
        </View>
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
