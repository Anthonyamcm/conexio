import { Button, Footer, Input, Screen, View } from '@/src/components/atoms';
import { Header } from '@/src/components/molecules';
import { useRegistration } from '@/src/contexts/RegistrationContext';
import { colors, spacing } from '@/src/utlis';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Username() {
  const { nextStep } = useRegistration();
  const continuePressed = () => {
    nextStep();
    router.push('/(registration)/dob');
  };
  return (
    <Screen
      preset="auto"
      contentContainerStyle={{ flex: 1, padding: spacing.lg }}
    >
      <Header
        title={'What will your username be?'}
        subtitle={
          'Choose a unique username to be associated with your account '
        }
      />
      <View preset={'column'} style={{ flex: 1 }}>
        <Input
          placeholder={'Username'}
          LeftAccessory={() => (
            <MaterialIcons
              name="alternate-email"
              size={26}
              color={colors.palette.neutral400}
              style={{ alignSelf: 'center', marginLeft: 6 }}
            />
          )}
        />
        <Button
          preset={'gradient'}
          gradient={[colors.palette.primary100, colors.palette.secondary100]}
          onPress={continuePressed}
        >
          {'Continue'}
        </Button>
      </View>
      <Footer />
    </Screen>
  );
}
