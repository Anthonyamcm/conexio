import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useProfileCreation } from '@/src/contexts/ProfileCreationContext';
import { Button, Input, Screen, Text } from '@/src/components/atoms';
import { Header } from '@/src/components/molecules';
import { colors, spacing } from '@/src/utils';

const MAX_BIO_LENGTH = 150;

const BioScreen: React.FC = () => {
  const { handleSubmitStep, state } = useProfileCreation();
  const [bio, setBio] = useState<string>(state.formData.bio || '');

  const handleChangeText = useCallback(
    (text: string) => {
      if (text.length <= MAX_BIO_LENGTH) {
        setBio(text);
      }
    },
    [setBio],
  );

  const handleNext = useCallback(() => {
    if (!bio) {
      Alert.alert(
        'No Image Selected',
        'Please select a profile picture or skip if you prefer not to.',
      );
      return;
    }

    handleSubmitStep(
      { bio: bio },
      false, // Not skipping
    );
  }, [handleSubmitStep, bio]);

  const handleSkip = useCallback(() => {
    handleSubmitStep(
      { profilePicture: '' }, // Clear profile picture if skipped
      true, // Skipping
    );
  }, [handleSubmitStep]);

  return (
    <Screen preset="auto" contentContainerStyle={styles.container}>
      <Header
        title="Describe yourself"
        subtitle="What makes you special? Dont think too hard, just have fun with it."
      />
      <View style={{ flex: 1 }}>
        <View style={styles.bioContainer}>
          <Input
            placeholder="Bio"
            multiline
            containerStyle={styles.bioInputContainer}
            value={bio}
            onChangeText={handleChangeText}
          />
          <Text preset="bold" style={styles.bioCounter}>
            {bio.length}/{MAX_BIO_LENGTH}
          </Text>
        </View>
      </View>

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

export default BioScreen;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 15,
    flex: 1,
    padding: 16,
  },
  bioContainer: {
    backgroundColor: colors.palette.neutral200,
    borderRadius: 12,
  },
  bioInputContainer: {
    marginBottom: 0,
  },
  bioCounter: {
    alignSelf: 'flex-end',
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xs,
    color: colors.palette.neutral900,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
  },
});
