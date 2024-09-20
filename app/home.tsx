import { Button, Screen, View } from '@/src/components/atoms';
import { colors, spacing } from '@/src/utlis';
import { router } from 'expo-router';

//TODO Finish design

export default function Home() {
  const registerPressed = () => {
    router.push('/(registration)/mobile');
  };

  const loginPressed = () => {
    router.push('/login');
  };

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={['top', 'bottom']}
      contentContainerStyle={{
        justifyContent: 'center',
        flex: 1,
        padding: spacing.lg,
      }}
    >
      <View preset={'column'}>
        <Button
          preset={'gradient'}
          gradient={[colors.palette.primary100, colors.palette.secondary100]}
          onPress={loginPressed}
        >
          {'Log in'}
        </Button>
        <Button preset={'default'} onPress={registerPressed}>
          {'Create account'}
        </Button>
      </View>
    </Screen>
  );
}
