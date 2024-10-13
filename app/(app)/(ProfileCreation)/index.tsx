import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Linking,
  GestureResponderEvent,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import Toast from 'react-native-toast-message';
import {
  CoverPhoto,
  Input,
  ProfilePhoto,
  Screen,
  Text,
} from '@/src/components/atoms';
import { colors, spacing, typography } from '@/src/utils';
import Ionicons from '@expo/vector-icons/Ionicons';

/** Constants */
const MAX_BIO_LENGTH = 150;
const TOAST_TOP_OFFSET = 50;

/** Helper function to show toast messages */
const showToast = (
  type: 'success' | 'error' | 'info',
  text1: string,
  text2: string,
  onPress?: () => void,
) => {
  Toast.show({
    type,
    position: 'top',
    text1,
    text2,
    visibilityTime: 4000,
    autoHide: true,
    topOffset: TOAST_TOP_OFFSET,
    onPress: onPress || undefined,
  });
};

/** Function to process images: resize and compress */
const processImage = async (
  uri: string,
  format: ImageManipulator.SaveFormat = ImageManipulator.SaveFormat.JPEG,
  aspect?: [number, number],
): Promise<string> => {
  try {
    const resizeOptions = aspect
      ? {
          width: aspect[0] * 100, // Example calculation; adjust as needed
          height: aspect[1] * 100,
        }
      : { width: 800 };

    const actions = [
      {
        resize: resizeOptions,
      },
    ];

    const saveOptions = {
      compress: format === ImageManipulator.SaveFormat.JPEG ? 0.7 : 1,
      format,
      base64: false,
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

/** Custom hook for handling image selection and processing */
const useImageHandler = (
  setImage: React.Dispatch<React.SetStateAction<string | null>>,
  aspect: [number, number] = [1, 1],
) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleEditPhoto = useCallback(
    async (event: GestureResponderEvent) => {
      try {
        // Request permissions if not already granted
        const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          showToast(
            'error',
            'Permission Required',
            'We need access to your photo library to select images.',
            () => Linking.openSettings(),
          );
          return;
        }

        setIsLoading(true);

        // Launch image picker
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect,
          quality: 0.7,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          const selectedAsset = result.assets[0];
          if (selectedAsset.uri && typeof selectedAsset.uri === 'string') {
            // Process image
            const processedUri = await processImage(
              selectedAsset.uri,
              ImageManipulator.SaveFormat.JPEG,
              aspect,
            );
            setImage(processedUri);
            showToast(
              'success',
              'Photo Selected',
              'Your photo has been updated successfully!',
            );
          } else {
            throw new Error('Selected asset does not contain a valid URI.');
          }
        } else if (result.canceled) {
          showToast('info', 'Cancelled', 'Photo selection was cancelled.');
        } else {
          showToast(
            'error',
            'No Image Selected',
            'No photo was selected. Please try again.',
          );
        }
      } catch (error) {
        console.error('Photo Selection Error:', error);
        showToast(
          'error',
          'Error',
          'An error occurred while selecting the photo. Please try again.',
        );
      } finally {
        setIsLoading(false);
      }
    },
    [setImage, aspect],
  );

  return { handleEditPhoto, isLoading };
};

/** Memoized UserInfo Component */
const UserInfo: React.FC = React.memo(() => {
  return (
    <View style={styles.userInfoContainer}>
      <Text preset="bold" size="xl">
        Anthony McMillan
      </Text>
      <Text preset="bold" style={styles.username}>
        @Anthonyamcm
      </Text>
    </View>
  );
});

/** Memoized BioSection Component */
const BioSection: React.FC<{
  bio: string;
  setBio: React.Dispatch<React.SetStateAction<string>>;
}> = React.memo(({ bio, setBio }) => {
  const handleChangeText = useCallback(
    (text: string) => {
      if (text.length <= MAX_BIO_LENGTH) {
        setBio(text);
      }
    },
    [setBio],
  );

  return (
    <View style={styles.bioContainer}>
      <Input
        placeholder="Bio"
        multiline
        containerStyle={styles.bioInputContainer}
        style={styles.bioInput}
        inputWrapperStyle={styles.bioInputWrapper}
        value={bio}
        onChangeText={handleChangeText}
      />
      <Text style={styles.bioCounter}>
        {bio.length}/{MAX_BIO_LENGTH}
      </Text>
    </View>
  );
});

/** Memoized JoinedDateSection Component */
const JoinedDateSection: React.FC = React.memo(() => {
  return (
    <View style={styles.joinedSection}>
      <Ionicons
        name="calendar-outline"
        size={24}
        color={colors.palette.neutral500}
      />
      <Text preset="bold" style={styles.joinedText}>
        Joined December 2024
      </Text>
    </View>
  );
});

/** Main Home Component */
const Home: React.FC = () => {
  // State variables
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [bio, setBio] = useState<string>('');

  // Use custom hooks for handling cover and profile photo editing
  const {
    handleEditPhoto: handleEditCoverPhoto,
    isLoading: isLoadingCoverPhoto,
  } = useImageHandler(setCoverPhoto, [16, 9]);

  const {
    handleEditPhoto: handleEditProfilePhoto,
    isLoading: isLoadingProfilePhoto,
  } = useImageHandler(setProfilePhoto, [1, 1]);

  // Combined loading state
  const isLoading = useMemo(
    () => isLoadingCoverPhoto || isLoadingProfilePhoto,
    [isLoadingCoverPhoto, isLoadingProfilePhoto],
  );

  /**
   * Function to handle using the selected profile photo.
   * Placeholder for further actions like uploading to a server.
   */
  const handleUseProfilePhoto = useCallback(() => {
    if (profilePhoto) {
      // TODO: Implement your profile photo upload logic here
      showToast(
        'success',
        'Profile Photo Used',
        'Your profile photo is now active.',
      );
    } else {
      showToast(
        'error',
        'No Profile Photo',
        'Please select a profile photo first.',
      );
    }
  }, [profilePhoto]);

  return (
    <Screen preset="fixed" contentContainerStyle={styles.screenContainer}>
      <View style={styles.container}>
        {/* Cover Photo Section */}
        <CoverPhoto uri={coverPhoto} onEdit={handleEditCoverPhoto} />

        {/* Profile Photo and User Info Section */}
        <View style={styles.profileSection}>
          <ProfilePhoto uri={profilePhoto} onEdit={handleEditProfilePhoto} />
          <UserInfo />
        </View>

        {/* Bio Section */}
        <BioSection bio={bio} setBio={setBio} />

        {/* Joined Date Section */}
        <JoinedDateSection />

        {/* Loading Indicator */}
        {isLoading && (
          <ActivityIndicator
            size="large"
            color={colors.palette.neutral300}
            style={styles.loader}
          />
        )}
      </View>
      {/* Toast Configuration */}
      <Toast />
    </Screen>
  );
};

/** Styles */
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? spacing.lg : 0, // Handle status bar for Android
    flexDirection: 'column',
    gap: 15,
  },
  profileSection: {
    flexDirection: 'column',
  },
  userInfoContainer: {
    marginLeft: spacing.md,
  },
  username: {
    color: colors.palette.neutral500,
  },
  bioContainer: {
    backgroundColor: colors.palette.neutral200,
    borderRadius: 12,
    marginHorizontal: spacing.md,
  },
  bioInputContainer: {
    marginVertical: 0,
  },
  bioInput: {
    color: colors.text,
  },
  bioInputWrapper: {
    marginVertical: 0,
  },
  bioCounter: {
    alignSelf: 'flex-end',
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xs,
    color: colors.palette.neutral500,
    fontFamily: typography.primary.medium,
  },
  joinedSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  joinedText: {
    color: colors.palette.neutral500,
  },
  loader: {
    marginTop: spacing.lg,
  },
});

export default React.memo(Home);
