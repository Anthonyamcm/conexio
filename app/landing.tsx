import { Button, Screen, ViewContainer } from '@/src/components/atoms';
import { colors } from '@/src/utlis';

export default function Landing() {
  return (
    <Screen
      preset="fixed"
      safeAreaEdges={['top', 'bottom']}
      contentContainerStyle={{ justifyContent: 'center', flex: 1 }}
    >
      <ViewContainer preset={'column'} style={{ gap: 15 }}>
        <Button preset={'default'}>{'Sign In'}</Button>
        <Button
          preset={'gradient'}
          gradient={[colors.palette.primary100, colors.palette.secondary100]}
        >
          {'Register'}
        </Button>
      </ViewContainer>
    </Screen>
  );
}
