import { Link, router } from 'expo-router';
import { Alert, TouchableOpacity, View } from 'react-native';
import { Text } from './Text';
import { useRegistration } from '@/src/contexts/RegistrationContext';

export default function Footer() {
  const { clearFormData } = useRegistration();
  const showAlert = () => {
    Alert.alert(
      'Alread have an account?',
      '',
      [
        {
          text: `Log in`,
          onPress: () => {
            clearFormData(), router.replace('/');
          },
        },
        {
          text: 'Continue creating account',
          onPress: () => console.log('Here'),
          style: 'cancel',
        },
      ],
      { cancelable: false }, // Prevents dismissing the alert by tapping outside
    );
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
      }}
    >
      <TouchableOpacity onPress={() => showAlert()}>
        <Text weight="medium" size="xs">
          {'I already have an account'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
