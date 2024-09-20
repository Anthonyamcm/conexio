import { Button, Footer, Screen, View } from '@/src/components/atoms';
import { Header, OneTimePasscode } from '@/src/components/molecules';
import { useRegistration } from '@/src/contexts/RegistrationContext';
import { colors, spacing } from '@/src/utlis';
import { router } from 'expo-router';

export default function Otp() {
  const { nextStep } = useRegistration();
  const continuePressed = () => {
    nextStep();
    router.push('/(registration)/name');
  };

  return (
    <Screen
      preset="auto"
      contentContainerStyle={{
        flex: 1,
        padding: spacing.lg,
      }}
    >
      <Header
        title={`Enter the confirmation code`}
        subtitle={`To confirm your account, enter the 6-digit code that we sent to +447763567011`}
      />
      <View preset={'column'} style={{ flex: 1 }}>
        <OneTimePasscode />
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
