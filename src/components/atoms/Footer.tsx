import { Link, router } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { Text } from './Text';

export default function Footer() {
  const onPress = () => {
    router.navigate('/home');
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
      }}
    >
      <TouchableOpacity onPress={onPress}>
        <Text weight="medium" size="xs">
          {'I already have an account'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
