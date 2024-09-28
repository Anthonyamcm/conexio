import { View } from 'react-native';
import { Text } from '../../atoms';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <View style={{ paddingBottom: 10, flexDirection: 'column' }}>
      <Text preset={'subheading'} weight="medium">
        {title}
      </Text>
      <Text>{subtitle}</Text>
    </View>
  );
}
