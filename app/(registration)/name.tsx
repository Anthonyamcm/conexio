import { Button, Footer, Input, Screen, View } from '@/src/components/atoms';
import { colors, spacing } from '@/src/utlis';
import { Header } from '@/src/components/molecules';
import { router } from 'expo-router';
import { useRegistration } from '@/src/contexts/RegistrationContext';
import Ionicons from '@expo/vector-icons/Ionicons';

//TODO: Fix inline styles and convert to styleSheet

export default function Name() {
  const { nextStep } = useRegistration();
  const continuePressed = () => {
    nextStep();
    router.push('/(registration)/username');
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
        title={`What's your name?`}
        subtitle={
          'Enter the name on which you wish to be known as, this will be your display name'
        }
      />
      <View preset={'column'} style={{ flex: 1 }}>
        <Input
          placeholder={'Name'}
          LeftAccessory={() => (
            <Ionicons
              name="person"
              size={26}
              color={colors.palette.neutral400}
              style={{ alignSelf: 'center', marginStart: 6 }}
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
