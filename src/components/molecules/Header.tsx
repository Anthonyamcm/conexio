import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from '../atoms';
import { colors } from '@/src/utlis';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <View preset={'column'}>
      <Text preset={'heading'}>{title}</Text>
      <LinearGradient
        colors={[colors.palette.primary100, colors.palette.secondary100]}
        start={{ x: 0.3, y: 0 }}
        end={{ x: 1, y: 0.25 }}
        style={{ width: 100, height: 10, borderRadius: 16 }}
      />
    </View>
  );
}
