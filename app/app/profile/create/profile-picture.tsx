import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useProfileCreation } from '@/src/contexts/ProfileCreationContext';
import { Button, ProfilePhoto, Screen } from '@/src/components/atoms';
import { Header } from '@/src/components/molecules';
import { colors } from '@/src/utils';

const ProfilePictureScreen: React.FC = () => {
  const { handleSubmitStep, setFormData, state } = useProfileCreation();
  const [image, setImage] = useState<string>(
    state.formData.profilePicture || '',
  );
  const [isPicking, setIsPicking] = useState<boolean>(false);

  const requestPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'We need access to your photo library to select a profile picture.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open Settings',
            onPress: () => ImagePicker.getCameraPermissionsAsync(),
          },
        ],
      );
      return false;
    }
    return true;
  };

  const pickImage = useCallback(async () => {
    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) return;

      setIsPicking(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0].uri;
        setImage(selectedImage);
        setFormData({ ...state.formData, profilePicture: selectedImage });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(
        'Error',
        'An unexpected error occurred while selecting the image.',
      );
    } finally {
      setIsPicking(false);
    }
  }, [state.formData, setFormData]);

  const handleNext = useCallback(() => {
    if (!image) {
      Alert.alert(
        'No Image Selected',
        'Please select a profile picture or skip if you prefer not to.',
      );
      return;
    }

    handleSubmitStep(
      { profilePicture: image },
      false, // Not skipping
    );
  }, [handleSubmitStep, image]);

  const handleSkip = useCallback(() => {
    handleSubmitStep(
      { profilePicture: '' }, // Clear profile picture if skipped
      true, // Skipping
    );
  }, [handleSubmitStep]);

  return (
    <Screen preset="auto" contentContainerStyle={styles.container}>
      <Header
        title="Pick a profile picture"
        subtitle="Have a favorite selfie? Upload it now."
      />
      <View style={{ alignSelf: 'center', flex: 1 }}>
        <ProfilePhoto uri={image} onEdit={pickImage} />
      </View>

      {isPicking && <ActivityIndicator size="small" color="#0000ff" />}
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

export default ProfilePictureScreen;

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
