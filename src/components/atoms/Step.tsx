import { useMemo } from 'react';
import { useRegistration } from '@/src/contexts/RegistrationContext';
import { colors, spacing } from '@/src/utils';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface StepProps {
  index: number;
}

export default function Step({ index }: StepProps) {
  const { state } = useRegistration(); // Get currentStep from context
  const isCompleted = index <= state.currentStep;

  // Memoize step style to avoid recalculations on every render
  const stepStyle = useMemo<ViewStyle>(
    () => ({
      maxHeight: 25,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: 6,
    }),
    [],
  );

  return isCompleted ? (
    <View style={styles.shadowContainer}>
      <LinearGradient
        colors={[colors.palette.primary100, colors.palette.secondary100]}
        start={{ x: 0.3, y: 0 }}
        end={{ x: 1, y: 0.25 }}
        style={stepStyle}
      />
    </View>
  ) : (
    <View style={[stepStyle, styles.incompleteStep]} />
  );
}

// Extracted styles for reusability and performance optimization
const styles = StyleSheet.create({
  shadowContainer: {
    shadowColor: colors.palette.neutral500,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
  },
  incompleteStep: {
    backgroundColor: colors.palette.neutral200,
  },
});
