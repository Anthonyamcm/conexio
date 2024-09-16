import { Button, Footer, Input, Screen, View } from '@/src/components/atoms';
import { Header } from '@/src/components/molecules';
import { colors, spacing } from '@/src/utlis';
import { MaterialIcons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function Otp() {
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
              color={colors.palette.neutral800}
              style={{ alignSelf: 'center', marginLeft: 6 }}
            />
          )}
          keyboardType="number-pad"
        />
        <View preset="column">
          <Button
            preset={'gradient'}
            gradient={[colors.palette.primary100, colors.palette.secondary100]}
          >
            {'Continue'}
          </Button>
          <Button preset="reversed">{'Sign up with email adress'}</Button>
        </View>
      </View>
      <Footer />
    </Screen>
  );
}
