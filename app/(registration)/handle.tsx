import { Button, Input, Screen, View } from '@/src/components/atoms';
import { Header } from '@/src/components/molecules';
import { colors, spacing } from '@/src/utlis';
import { MaterialIcons } from '@expo/vector-icons';

export default function Handle() {
  return (
    <Screen
      preset="auto"
      contentContainerStyle={{ flex: 1, padding: spacing.lg }}
    >
      <Header
        title={'What will your username be?'}
        subtitle={'Choose a username so people can find you easier!'}
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
