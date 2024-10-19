import { Button } from '../Button/Button';
import { colors } from '@/src/utils';

interface FooterProps {
  onPress: () => void;
  isDisabled: boolean;
  isLoading: boolean;
}

export default function Footer({
  onPress,
  isDisabled,
  isLoading,
}: FooterProps) {
  return (
    <Button
      preset="gradient"
      gradient={[colors.palette.primary100, colors.palette.secondary100]}
      onPress={onPress}
      disabled={isDisabled}
      isLoading={isLoading}
    >
      Continue
    </Button>
  );
}
