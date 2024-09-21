import { Text, View } from '../../atoms';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <View preset={'column'} style={{ paddingBottom: 10 }}>
      <Text preset={'subheading'} weight="medium">
        {title}
      </Text>
      <Text>{subtitle}</Text>
    </View>
  );
}
