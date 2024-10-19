import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useProfileCreation } from '@/src/contexts/ProfileCreationContext';
import { Button, Screen } from '@/src/components/atoms';
import { Header } from '@/src/components/molecules';
import { colors } from '@/src/utils';
import { LocationSearch } from '@/src/components/molecules/Inputs';

const LocationScreen: React.FC = () => {
  const { handleSubmitStep, setFormData, state } = useProfileCreation();
  const [location, setLocation] = useState<string>(
    state.formData.location || '',
  );

  const handleLocationSelect = (location: any) => {
    console.log('Selected Location:', location);
    // Handle the selected location (e.g., save to state, navigate, etc.)
  };

  const handleNext = useCallback(() => {
    if (!location) {
      Alert.alert(
        'No Image Selected',
        'Please select a profile picture or skip if you prefer not to.',
      );
      return;
    }

    handleSubmitStep(
      { location: location },
      false, // Not skipping
    );
  }, [handleSubmitStep, location]);

  const handleSkip = useCallback(() => {
    handleSubmitStep(
      { location: '' }, // Clear profile picture if skipped
      true, // Skipping
    );
  }, [handleSubmitStep]);

  return (
    <Screen preset="fixed" contentContainerStyle={styles.container}>
      <Header
        title="Where do you live?"
        subtitle="Find accounts and connect with people in the same location as you."
      />

      <LocationSearch onSelect={handleLocationSelect} />

      <View style={styles.buttonContainer}>
        <Button preset={'default'} style={{ flex: 1 }} onPress={handleSkip}>
          {'Skip'}
        </Button>
        <Button
          preset={'gradient'}
          gradient={[colors.palette.primary100, colors.palette.secondary100]}
          onPress={handleNext}
        >
          {'Continue'}
        </Button>
      </View>
    </Screen>
  );
};

export default LocationScreen;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 15,
    flex: 1,
    padding: 16,
    backgroundColor: '#fff', // Ensure background color for better visibility
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
  },
});
