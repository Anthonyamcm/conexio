import { Button, Input, Screen, View } from '@/src/components/atoms';
import { colors, spacing } from '@/src/utlis';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Header } from '@/src/components/molecules';

export default function Register() {
  return (
    <Screen
      preset="fixed"
      safeAreaEdges={['top', 'bottom']}
      contentContainerStyle={{ flex: 1, padding: spacing.lg }}
    >
      <Header title={'Create a new account'} />
      <View preset={'column'}>
        <View preset={'row'}>
          <Input
            placeholder={'First name'}
            LeftAccessory={() => (
              <FontAwesome
                name="id-card-o"
                size={26}
                color={colors.palette.neutral800}
                style={{ alignSelf: 'center', marginLeft: 12 }}
              />
            )}
            containerStyle={{ flex: 1 }}
          />
          <Input placeholder={'Last name'} containerStyle={{ flex: 1 }} />
        </View>
        <Input
          placeholder={'Username'}
          LeftAccessory={() => (
            <MaterialIcons
              name="alternate-email"
              size={26}
              color={colors.palette.neutral800}
              style={{ alignSelf: 'center', marginLeft: 12 }}
            />
          )}
        />
        <Input
          placeholder={'Email'}
          LeftAccessory={() => (
            <Feather
              name="mail"
              size={26}
              color={colors.palette.neutral800}
              style={{ alignSelf: 'center', marginLeft: 12 }}
            />
          )}
        />
        <Input
          placeholder={'Password'}
          LeftAccessory={() => (
            <Feather
              name="lock"
              size={26}
              color={colors.palette.neutral800}
              style={{ alignSelf: 'center', marginLeft: 12 }}
            />
          )}
          secureTextEntry={true}
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
