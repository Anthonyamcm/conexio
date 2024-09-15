import { Button, Input, Screen, View } from '@/src/components/atoms';
import { colors, spacing } from '@/src/utlis';
import { Header } from '@/src/components/molecules';
import { router } from 'expo-router';
import { useRegistration } from '@/src/contexts/RegistrationContext';

//TODO: Fix inline styles and convert to styleSheet

export default function Name() {
  const { nextStep } = useRegistration();
  const continuePressed = () => {
    nextStep();
    router.push('/(registration)/handle');
  };

  return (
    <Screen
      preset="auto"
      contentContainerStyle={{ flex: 1, padding: spacing.lg }}
    >
      <Header
        title={'What is your name?'}
        subtitle={'Please provide your first and last name'}
      />
      <View preset={'column'}>
        <View preset={'row'}>
          <Input placeholder={'First name'} containerStyle={{ flex: 1 }} />
          <Input placeholder={'Last name'} containerStyle={{ flex: 1 }} />
        </View>
      </View>
      <Button
        preset={'gradient'}
        gradient={[colors.palette.primary100, colors.palette.secondary100]}
        onPress={continuePressed}
      >
        {'Continue'}
      </Button>
    </Screen>
  );
}
