import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  GestureResponderEvent,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import Toast from 'react-native-toast-message';
import { CoverPhoto, ProfilePhoto, Screen, Text } from '@/src/components/atoms';
import { spacing } from '@/src/utils';

const Home: React.FC = () => {
  // State variables
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState<
    boolean | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Function to request media library permissions.
   */
  const requestGalleryPermission = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(status === 'granted');

      if (status !== 'granted') {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Permission Required',
          text2: 'We need access to your photo library to select images.',
          visibilityTime: 4000,
          autoHide: true,
          topOffset: 50,
          onPress: () => Linking.openSettings(),
        });
      }
    } catch (error) {
      console.error('Permission Error:', error);
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: 'An unexpected error occurred while requesting permissions.',
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 50,
      });
    }
  };

  /**
   * Helper function to process images: resize and compress.
   * @param uri - The URI of the selected image.
   * @param format - The desired image format ('JPEG' or 'PNG').
   * @returns The URI of the processed image.
   */
  const processImage = async (
    uri: string,
    format: ImageManipulator.SaveFormat = ImageManipulator.SaveFormat.JPEG,
  ): Promise<string> => {
    try {
      const actions = [
        {
          resize: {
            width: format === ImageManipulator.SaveFormat.JPEG ? 1200 : 800,
          },
        },
      ];
      const saveOptions = {
        compress: format === ImageManipulator.SaveFormat.JPEG ? 0.7 : 1, // Compress JPEG, no compression for PNG
        format,
      };
      const processedImage = await ImageManipulator.manipulateAsync(
        uri,
        actions,
        saveOptions,
      );
      return processedImage.uri;
    } catch (error) {
      console.error('Image Processing Error:', error);
      throw error;
    }
  };

  /**
   * Function to handle cover photo selection.
   */
  const handleEditCoverPhoto = async (event: GestureResponderEvent) => {
    if (hasGalleryPermission === false) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Permission Denied',
        text2:
          'Gallery permissions are not granted. Please enable them in settings.',
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 50,
        onPress: () => Linking.openSettings(),
      });
      return;
    }

    try {
      setIsLoading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        if (selectedAsset.uri && typeof selectedAsset.uri === 'string') {
          const processedUri = await processImage(
            selectedAsset.uri,
            ImageManipulator.SaveFormat.JPEG,
          );
          setCoverPhoto(processedUri);
          Toast.show({
            type: 'success',
            position: 'top',
            text1: 'Cover Photo Selected',
            text2: 'Your cover photo has been updated successfully!',
            visibilityTime: 3000,
            autoHide: true,
            topOffset: 50,
          });
        } else {
          throw new Error('Selected asset does not contain a valid URI.');
        }
      } else if (result.canceled) {
        Toast.show({
          type: 'info',
          position: 'top',
          text1: 'Cancelled',
          text2: 'Cover photo selection was cancelled.',
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 50,
        });
      } else {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'No Image Selected',
          text2: 'No cover photo was selected. Please try again.',
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 50,
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Cover Photo Error:', error);
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2:
          'An error occurred while selecting the cover photo. Please try again.',
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 50,
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Function to handle profile photo selection.
   */
  const handleEditProfilePhoto = async (event: GestureResponderEvent) => {
    if (hasGalleryPermission === false) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Permission Denied',
        text2:
          'Gallery permissions are not granted. Please enable them in settings.',
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 50,
        onPress: () => Linking.openSettings(),
      });
      return;
    }

    try {
      setIsLoading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        if (selectedAsset.uri && typeof selectedAsset.uri === 'string') {
          const processedUri = await processImage(
            selectedAsset.uri,
            ImageManipulator.SaveFormat.JPEG,
          );
          setProfilePhoto(processedUri);
          Toast.show({
            type: 'success',
            position: 'top',
            text1: 'Profile Photo Selected',
            text2: 'Your profile photo has been updated successfully!',
            visibilityTime: 3000,
            autoHide: true,
            topOffset: 50,
          });
        } else {
          throw new Error('Selected asset does not contain a valid URI.');
        }
      } else if (result.canceled) {
        Toast.show({
          type: 'info',
          position: 'top',
          text1: 'Cancelled',
          text2: 'Profile photo selection was cancelled.',
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 50,
        });
      } else {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'No Image Selected',
          text2: 'No profile photo was selected. Please try again.',
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 50,
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Profile Photo Error:', error);
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2:
          'An error occurred while selecting the profile photo. Please try again.',
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 50,
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Function to handle using the selected profile photo.
   * Placeholder for further actions like uploading to a server.
   */
  const handleUseProfilePhoto = () => {
    if (profilePhoto) {
      // TODO: Implement your profile photo upload logic here
      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Profile Photo Used',
        text2: 'Your profile photo is now active.',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 50,
      });
    } else {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'No Profile Photo',
        text2: 'Please select a profile photo first.',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 50,
      });
    }
  };

  return (
    <Screen
      preset="fixed"
      contentContainerStyle={{
        flex: 1,
        padding: spacing.xs,
      }}
    >
      <View style={styles.container}>
        {/* Cover Photo Section */}
        <CoverPhoto uri={coverPhoto} onEdit={handleEditCoverPhoto} />

        {/* Profile Photo Section */}
        <View style={{ flexDirection: 'row', gap: 15, alignItems: 'center' }}>
          <ProfilePhoto uri={profilePhoto} onEdit={handleEditProfilePhoto} />
          <View style={{ flexDirection: 'column' }}>
            <Text preset="subheading">Anthony McMillan</Text>
            <Text preset="bold">@Anthonyamcm</Text>
          </View>
        </View>

        {/* Loading Indicator */}
        {isLoading && (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.loader}
          />
        )}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 50 : 0, // Handle status bar for Android
  },
  loader: {
    marginTop: 20,
  },
});

export default Home;
