import { Button, Footer, Input, Screen, View } from '@/src/components/atoms';
import { Header } from '@/src/components/molecules';
import { useRegistration } from '@/src/contexts/RegistrationContext';
import { colors, spacing } from '@/src/utlis';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

export default function Mobile() {
  const { nextStep } = useRegistration();
  const continuePressed = () => {
    nextStep();
    router.push('/(registration)/otp');
  };
  return (
    <Screen
      preset="auto"
      contentContainerStyle={{ flex: 1, padding: spacing.lg }}
    >
      <Header
        title={`What's your mobile number?`}
        subtitle={
          'Enter the mobile number on which you can be contacted. No one will see this on your profile'
        }
      />
      <View preset={'column'} style={{ flex: 1 }}>
        <Input
          placeholder={'Mobile number'}
          LeftAccessory={() => (
            <FontAwesome
              name="phone"
              size={26}
              color={colors.palette.neutral400}
              style={{ alignSelf: 'center', marginLeft: 6 }}
            />
          )}
          keyboardType="number-pad"
        />
        <View preset="column">
          <Button preset="reversed">{'Sign up with email adress'}</Button>
          <Button
            preset={'gradient'}
            gradient={[colors.palette.primary100, colors.palette.secondary100]}
            onPress={continuePressed}
          >
            {'Continue'}
          </Button>
        </View>
      </View>
      <Footer />
    </Screen>
  );
}
