import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  FlatList,
} from 'react-native';
import Modal from 'react-native-modal';
import { colors } from '@/src/utils';
import { SOCIAL_PLATFORMS } from '@/src/constants/SocialPlatforms';
import { FontAwesome6 } from '@expo/vector-icons';
import {
  Button,
  Input,
  Screen,
  SocialChip,
  Text,
} from '@/src/components/atoms';
import { Header } from '@/src/components/molecules';
import { useProfileCreation } from '@/src/contexts/ProfileCreationContext';

interface SocialLinksState {
  [platformKey: string]: string; // e.g., { twitter: 'https://twitter.com/username' }
}

const MAX_LINKS = 5;

const SocialLinksScreen: React.FC = () => {
  const { handleSubmitStep, state } = useProfileCreation();
  const [links, setLinks] = useState<SocialLinksState>(
    state.formData.socialLinks || {},
  );
  const [isPlatformModalVisible, setPlatformModalVisible] =
    useState<boolean>(false);
  const [isUsernameModalVisible, setUsernameModalVisible] =
    useState<boolean>(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');

  // Compute available platforms excluding already added ones
  const availablePlatforms = useMemo(
    () =>
      SOCIAL_PLATFORMS.filter(
        (platform) => !links.hasOwnProperty(platform.key),
      ),
    [links],
  );

  // Handler to open the platform selection modal
  const handleAddLink = useCallback(() => {
    console.log('Opening platform selection modal');
    setPlatformModalVisible(true);
  }, []);

  // Handler when a platform is selected
  const handlePlatformSelect = useCallback((platformKey: string) => {
    console.log({ platformKey });
    setSelectedPlatform(platformKey);
    setPlatformModalVisible(false);
  }, []);

  // Function to add or update a social link
  const addOrUpdateLink = useCallback(
    (platformKey: string, username: string) => {
      const platform = SOCIAL_PLATFORMS.find((p) => p.key === platformKey);
      if (!platform) {
        Alert.alert('Error', 'Selected platform is not supported.');
        return;
      }

      const link = platform.baseUrl
        ? platform.baseUrl.replace('{username}', encodeURIComponent(username))
        : username;

      setLinks((prevLinks) => ({
        ...prevLinks,
        [platform.key]: link,
      }));
      console.log({ links });
    },
    [],
  );

  // Handler to submit the username and add/update the link
  const handleUsernameSubmit = useCallback(() => {
    console.log(
      `Submitting username: ${username} for platform: ${selectedPlatform}`,
    );
    if (!selectedPlatform) {
      Alert.alert('Error', 'No platform selected.');
      return;
    }

    if (!username.trim()) {
      Alert.alert('Validation Error', 'Username cannot be empty.');
      return;
    }

    addOrUpdateLink(selectedPlatform, username.trim());
    setUsernameModalVisible(false);
    setUsername('');
    setSelectedPlatform(null);
    Keyboard.dismiss();
  }, [selectedPlatform, username, addOrUpdateLink]);

  // Handler to remove a social link
  const handleRemoveLink = useCallback((platformKey: string) => {
    const platform = SOCIAL_PLATFORMS.find((p) => p.key === platformKey);
    if (!platform) return;

    setLinks((prevLinks) => {
      const updatedLinks = { ...prevLinks };
      delete updatedLinks[platformKey];
      return updatedLinks;
    });
  }, []);

  // Render each platform item in the selection modal
  const renderPlatformItem = useCallback(
    ({ item }: { item: (typeof SOCIAL_PLATFORMS)[0] }) => (
      <TouchableOpacity
        style={styles.platformItem}
        onPress={() => handlePlatformSelect(item.key)}
      >
        <FontAwesome6
          name={item.icon}
          size={24}
          color={colors.palette.neutral900}
        />
        <Text preset="bold">{item.name}</Text>
      </TouchableOpacity>
    ),
    [handlePlatformSelect],
  );

  // Handle modal hide events
  const handlePlatformModalHide = useCallback(() => {
    if (selectedPlatform) {
      console.log('Platform modal hidden, opening username modal');
      setUsernameModalVisible(true);
    }
  }, [selectedPlatform]);

  const handleUsernameModalHide = useCallback(() => {
    // Any actions when username modal hides
    console.log('Username modal hidden');
  }, []);

  const handleNext = useCallback(() => {
    handleSubmitStep(
      { socialLinks: links },
      false, // Not skipping
    );
  }, [handleSubmitStep, links]);

  const handleSkip = useCallback(() => {
    handleSubmitStep(
      { socialLinks: {} }, // Clear profile picture if skipped
      true, // Skipping
    );
  }, [handleSubmitStep]);

  return (
    <Screen preset="fixed" contentContainerStyle={styles.contentContainer}>
      <Header
        title="Add social links"
        subtitle="Enhance your profile with social links for easy connections."
      />
      <View style={styles.container}>
        {/* Add Social Link Button */}
        {Object.keys(links).length < MAX_LINKS ? (
          <Button
            preset="reversed"
            LeftAccessory={() => (
              <FontAwesome6
                name="plus"
                size={18}
                color={colors.palette.neutral900}
                style={{ marginRight: 5 }}
              />
            )}
            onPress={handleAddLink}
          >
            <Text preset="bold" size="xs">
              Add Social Link
            </Text>
          </Button>
        ) : null}

        {Object.entries(links).map(([platformKey, link]) => {
          const platform = SOCIAL_PLATFORMS.find((p) => p.key === platformKey);
          if (!platform) return null;
          return (
            <SocialChip
              key={platformKey}
              label={platform.name}
              iconName={platform.icon}
              onDelete={() => handleRemoveLink(platformKey)}
            />
          );
        })}
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

      {/* Platform Selection Modal */}
      <Modal
        isVisible={isPlatformModalVisible}
        onBackdropPress={() => setPlatformModalVisible(false)}
        swipeDirection="down"
        onSwipeComplete={() => setPlatformModalVisible(false)}
        onModalHide={handlePlatformModalHide}
        style={styles.modal}
        propagateSwipe={false}
        avoidKeyboard={true}
      >
        <View style={styles.modalContent}>
          <Text preset="subheading">Select a Platform</Text>
          <FlatList
            data={availablePlatforms}
            keyExtractor={(item) => item.key}
            renderItem={renderPlatformItem}
            contentContainerStyle={styles.platformList}
          />
        </View>
      </Modal>

      {/* Username Input Modal */}
      <Modal
        isVisible={isUsernameModalVisible}
        onBackdropPress={() => setUsernameModalVisible(false)}
        swipeDirection="down"
        onSwipeComplete={() => setUsernameModalVisible(false)}
        onModalHide={handleUsernameModalHide}
        style={styles.modal}
        propagateSwipe={false}
        avoidKeyboard={true}
      >
        <View style={styles.modalContent}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 'auto',
            }}
          >
            <Text preset="subheading" style={{ flex: 3 }}>
              {'Add Social Link'}
            </Text>
            <Button
              preset="gradient"
              gradient={[
                colors.palette.primary100,
                colors.palette.secondary100,
              ]}
              onPress={handleUsernameSubmit} // Changed from addOrUpdateLink to handleUsernameSubmit
              disabled={!username.trim()}
            >
              {'Save'}
            </Button>
          </View>

          <View style={[styles.platformItem, { marginRight: 'auto' }]}>
            <FontAwesome6
              name={
                SOCIAL_PLATFORMS.find((p) => p.key === selectedPlatform)?.icon
              }
              size={24}
              color={colors.palette.neutral900}
            />
            <Text preset="bold">
              {SOCIAL_PLATFORMS.find((p) => p.key === selectedPlatform)?.name}
            </Text>
          </View>

          <Input
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            returnKeyType="done"
          />
        </View>
      </Modal>
    </Screen>
  );
};

export default SocialLinksScreen;

// Stylesheet
const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'column',
    gap: 15,
    flex: 1,
    padding: 16,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 10,
    flex: 1,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 10,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    flexDirection: 'column',
    gap: 10,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderTopRightRadius: 21,
    borderTopLeftRadius: 21,
    minHeight: 450,
  },
  platformList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  platformItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.palette.neutral200,
  },
  icon: { alignSelf: 'center', marginLeft: 6 },
  submitButton: {
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
  },
});
