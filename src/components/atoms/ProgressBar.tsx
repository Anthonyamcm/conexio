import { useMemo } from 'react';
import { useRegistration } from '@/src/contexts/RegistrationContext';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '@/src/utils';

interface StepsProps {
  numberOfSteps: number;
}

export default function ProgressBar({ numberOfSteps }: StepsProps) {
  const { state } = useRegistration();

  // Calculate completed steps (add 1 since currentStep is zero-indexed)
  const completedSteps = state.currentStep + 1;

  // Calculate the progress as a percentage based on the number of steps
  const progressPercentage = useMemo(() => {
    return Math.round((completedSteps / numberOfSteps) * 100); // Progress percentage
  }, [completedSteps, numberOfSteps]);

  return (
    <View style={styles.progressBarContainer}>
      {/* Gradient Progress Bar */}
      <LinearGradient
        colors={[colors.palette.primary100, colors.palette.secondary100]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.progressBar, { width: `${progressPercentage}%` }]} // Use percentage width
      />
    </View>
  );
}

// Styles for the ProgressBar
const styles = StyleSheet.create({
  progressBarContainer: {
    width: '100%', // Full width of the parent container
    height: 15,
    backgroundColor: colors.palette.neutral200, // Background color for incomplete progress
    borderRadius: 8,
    marginBottom: spacing.md, // Spacing below the progress bar
    overflow: 'hidden', // Make sure progress bar has rounded corners
  },
  progressBar: {
    height: '100%', // Full height of the progress container
    borderRadius: 8, // Rounded corners for progress bar
  },
});
