import { Button, Input, Screen, Text, View } from '@/src/components/atoms';
import { colors, spacing } from '@/src/utlis';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Header } from '@/src/components/molecules';
import { Link } from 'expo-router';

export default function Login() {
  return (
    <Screen
      preset="fixed"
      safeAreaEdges={['top', 'bottom']}
      contentContainerStyle={{ flex: 1, padding: spacing.lg }}
    >
      <Header title={'Log in'} />
      <View preset={'column'}>
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
        <Link href={'/home'}>
          <Text
            size={'md'}
            style={{ color: colors.palette.neutral800 }}
            weight={'medium'}
          >
            {'Forgotten password ?'}
          </Text>
        </Link>
      </View>
      <Button
        preset={'gradient'}
        gradient={[colors.palette.primary100, colors.palette.secondary100]}
      >
        {'Log in'}
      </Button>
    </Screen>
  );
}
