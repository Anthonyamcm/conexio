import { useMemo } from 'react';
import { useRegistration } from '@/src/contexts/RegistrationContext';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Step } from '../atoms';
import { spacing } from '@/src/utlis';
import { Entypo } from '@expo/vector-icons';

export default function Stepper() {
  const { steps, prevStep } = useRegistration();

  // Memoize container style for steps
  const stepContainerStyle = useMemo(
    () => ({
      flexDirection: 'row' as const,
    }),
    [],
  );

  return (
    <View style={styles.stepperContainer}>
      <TouchableOpacity onPress={prevStep}>
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
