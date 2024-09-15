import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from '../atoms';
import { colors, spacing } from '@/src/utlis';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <View preset={'column'}>
      <Text preset={'subheading'}>{title}</Text>
      <Text>{subtitle}</Text>
    </View>
  );
}
