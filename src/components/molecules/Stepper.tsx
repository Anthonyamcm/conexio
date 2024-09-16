import { useRegistration } from '@/src/contexts/RegistrationContext';
import { TouchableOpacity, View } from 'react-native';
import { Step } from '../atoms';
import { spacing } from '@/src/utlis';
import { Entypo } from '@expo/vector-icons';

export default function Stepper() {
  const { steps, prevStep } = useRegistration();

  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
      }}
    >
      <TouchableOpacity onPress={prevStep}>
        <Entypo name="chevron-left" size={32} color="black" />
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', gap: 15 }}>
        {steps.map((step, index) => (
          <Step key={step} index={index} />
        ))}
      </View>
    </View>
  );
}
