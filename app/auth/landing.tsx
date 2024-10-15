import { Button, Screen } from '@/src/components/atoms';
import { colors, spacing } from '@/src/utils';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function AuthLandingPage() {
  const registerPressed = () => {
    router.push('/auth/registration');
  };

  const loginPressed = () => {
    router.push('/auth/login');
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
      <View style={style.column}>
        <Button
          preset={'gradient'}
          gradient={[colors.palette.primary100, colors.palette.secondary100]}
          onPress={() => loginPressed()}
        >
          {'Sign in'}
        </Button>
        <Button preset={'default'} onPress={() => registerPressed()}>
          {'Create account'}
        </Button>
      </View>
    </Screen>
  );
}

const style = StyleSheet.create({
  column: {
    flexDirection: 'column',
    gap: 15,
  },
});
