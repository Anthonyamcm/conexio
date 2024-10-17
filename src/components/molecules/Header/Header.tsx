import { View } from 'react-native';
import { Text } from '../../atoms';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <View style={{ paddingBottom: 10, flexDirection: 'column', gap: 10 }}>
      <Text size="xl" weight="medium">
        {title}
      </Text>
      <Text size="md">{subtitle}</Text>
    </View>
  );
}
