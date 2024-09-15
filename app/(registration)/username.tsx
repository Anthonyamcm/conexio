import { Button, Input, Screen, View } from '@/src/components/atoms';
import { Header } from '@/src/components/molecules';
import { colors, spacing } from '@/src/utlis';
import { MaterialIcons } from '@expo/vector-icons';

export default function Username() {
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
      <View preset={'column'}>
        <Input
          placeholder={'Username'}
          LeftAccessory={() => (
            <MaterialIcons
              name="alternate-email"
              size={26}
              color={colors.palette.neutral800}
              style={{ alignSelf: 'center', marginLeft: 6 }}
            />
          )}
        />
      </View>
      <Button
        preset={'gradient'}
        gradient={[colors.palette.primary100, colors.palette.secondary100]}
      >
        {'Continue'}
      </Button>
    </Screen>
  );
}
