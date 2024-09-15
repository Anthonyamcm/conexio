import { useRegistration } from '@/src/contexts/RegistrationContext';
import { colors, spacing } from '@/src/utlis';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { View, ViewStyle } from 'react-native';

interface StepProps {
  index: number;
}

export default function Step({ index }: StepProps) {
  const { currentStep } = useRegistration(); // Get currentStep from context

  let isCompleted = index <= currentStep;

  const stepStyle: ViewStyle = {
    maxHeight: 25,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
  };

  return isCompleted ? (
    <LinearGradient
      colors={[colors.palette.primary100, colors.palette.secondary100]}
      start={{ x: 0.3, y: 0 }}
      end={{ x: 1, y: 0.25 }}
      style={stepStyle}
    />
  ) : (
    <View
      style={{
        ...stepStyle,
        backgroundColor: colors.palette.neutral200,
      }}
    />
  );
}
