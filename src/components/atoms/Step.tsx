import { useRegistration } from '@/src/contexts/RegistrationContext';
import { colors, spacing } from '@/src/utlis';
import { LinearGradient } from 'expo-linear-gradient';
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
    <View
      style={{
        shadowColor: colors.palette.neutral500,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,

        elevation: 9,
      }}
    >
      <LinearGradient
        colors={[colors.palette.primary100, colors.palette.secondary100]}
        start={{ x: 0.3, y: 0 }}
        end={{ x: 1, y: 0.25 }}
        style={stepStyle}
      />
    </View>
  ) : (
    <View
      style={{
        ...stepStyle,
        backgroundColor: colors.palette.neutral200,
      }}
    />
  );
}
