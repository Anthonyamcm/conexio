import React, { useMemo } from 'react';
import { useRegistration } from '@/src/contexts/RegistrationContext';
import { TouchableOpacity, View, StyleSheet, Alert } from 'react-native';
import { spacing } from '@/src/utils';
import { Entypo } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text } from '../../atoms';

export default function ProgressHeader() {
  const { prevStep, state, clearFormData, steps } = useRegistration();

  const showAlert = () => {
    if (state.currentStep === 0) {
      Alert.alert(
        'Do you want to stop creating your account?',
        `If you stop now, you'll lose any progress you've made.`,
        [
          {
            text: `Stop creating account`,
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

  return (
    <View style={styles.stepperContainer}>
      {/* Back Arrow */}
      <TouchableOpacity onPress={showAlert} style={styles.backButton}>
        <Entypo name="chevron-left" size={32} color="black" />
      </TouchableOpacity>
      <View style={{ flexDirection: 'column', alignItems: 'center', flex: 1 }}>
        <Text preset="bold" size="md">
          {steps[state.currentStep]}
        </Text>
        <Text preset="bold" size="md">
          {state.currentStep + 1 + ' of ' + steps.length}
        </Text>
      </View>
      <View style={{ flex: 1 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  stepperContainer: {
    flexDirection: 'row', // Aligns the back arrow and progress bar horizontally
    width: '100%',
    alignItems: 'center', // Vertically aligns the back arrow and progress bar
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  backButton: {
    flex: 1,
  },
  Wrapper: {
    flex: 1, // Makes the progress bar take up the remaining space
  },
});
