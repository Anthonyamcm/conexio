import { useMemo } from 'react';
import { useRegistration } from '@/src/contexts/RegistrationContext';
import { TouchableOpacity, View, StyleSheet, Alert } from 'react-native';
import { Step } from '../../atoms';
import { spacing } from '@/src/utils';
import { Entypo } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Stepper() {
  const { steps, prevStep, state, clearFormData } = useRegistration();

  const showAlert = () => {
    if (state.currentStep === 0) {
      Alert.alert(
        'Do you want to stop creating your account?',
        `if you stop now you'll loose any progress you've made.`,
        [
          {
            text: `Stop creating account `,
            onPress: () => {
              clearFormData();
              router.back();
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
    } else {
      prevStep();
    }
  };

  // Memoize container style for steps
  const stepContainerStyle = useMemo(
    () => ({
      flexDirection: 'row' as const,
    }),
    [],
  );

  return (
    <View style={styles.stepperContainer}>
      <TouchableOpacity onPress={showAlert}>
        <Entypo name="chevron-left" size={32} color="black" />
      </TouchableOpacity>
      <View style={stepContainerStyle}>
        {steps.map((step, index) => (
          <View
            key={step}
            style={{ marginRight: index < steps.length - 1 ? 15 : 0 }}
          >
            <Step index={index} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stepperContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
});
