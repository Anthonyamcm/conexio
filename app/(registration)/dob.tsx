import { Button, Footer, Screen, View } from '@/src/components/atoms';
import { DateOfBirthInput, Header } from '@/src/components/molecules';
import { useRegistration } from '@/src/contexts/RegistrationContext';
import { colors, spacing } from '@/src/utlis';
import { router } from 'expo-router';

export default function Dob() {
  const { nextStep } = useRegistration();
  const continuePressed = () => {
    nextStep();
    router.push('/(registration)/password');
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
        title={`What's your date of birth?`}
        subtitle={`Enter your date of birth (you must be 16+). This won't appear on your profile.`}
      />
      <View preset={'column'} style={{ flex: 1 }}>
        <DateOfBirthInput />
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
