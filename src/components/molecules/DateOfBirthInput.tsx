import { View } from 'react-native';
import { Input } from '../atoms';

interface DateOfBirthProps {
  day: number;
  month: number;
  year: number;
}

export default function DateOfBirthInput() {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        overflow: 'hidden',
      }}
    >
      <Input placeholder="DD" />
      <Input placeholder="MM" />
      <Input placeholder="YYYY" />
    </View>
  );
}
