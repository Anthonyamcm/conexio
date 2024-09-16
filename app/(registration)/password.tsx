import { Button, Footer, Input, Screen, View } from '@/src/components/atoms';
import { colors, spacing } from '@/src/utlis';
import { Header } from '@/src/components/molecules';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

//TODO: Fix inline styles and convert to styleSheet

export default function Password() {
  return (
    <Screen
      preset="auto"
      contentContainerStyle={{
        flex: 1,
        padding: spacing.lg,
      }}
    >
      <Header
        title={`What's your password?`}
        subtitle={`Enter a strong and secure password to keep your account safe and protected.`}
      />
      <View preset={'column'} style={{ flex: 1 }}>
        <Input
          placeholder={'Password'}
          LeftAccessory={() => (
            <FontAwesome6
              name="lock"
              size={22}
              color={colors.palette.neutral400}
              style={{ alignSelf: 'center', marginStart: 6 }}
            />
          )}
        />
        <Input
          placeholder={'Confirm password'}
          LeftAccessory={() => (
            <FontAwesome6
              name="lock"
              size={22}
              color={colors.palette.neutral400}
              style={{ alignSelf: 'center', marginStart: 6 }}
            />
          )}
        />
        <Button
          preset={'gradient'}
          gradient={[colors.palette.primary100, colors.palette.secondary100]}
        >
          {'Create account'}
        </Button>
      </View>
      <Footer />
    </Screen>
  );
}
