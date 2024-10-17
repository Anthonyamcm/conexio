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
import { Button, Input, SocialChip, Text } from '../../atoms';
import { colors } from '@/src/utils';
import { SOCIAL_PLATFORMS } from '@/src/constants/SocialPlatforms';
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';

interface SocialLinksState {
  [platformKey: string]: string; // e.g., { twitter: 'https://twitter.com/username' }
}

const MAX_LINKS = 5;

const SocialLinks: React.FC = () => {
  // State variables
  const [links, setLinks] = useState<SocialLinksState>({});
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
    console.log(`Platform selected: ${platformKey}`);
    setSelectedPlatform(platformKey);
    setPlatformModalVisible(false);
    // Removed immediate opening of username modal
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
      Keyboard.dismiss();
      console.log(`Link added: ${platform.name} -> ${link}`);
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
  }, [selectedPlatform, username, addOrUpdateLink]);

  // Handler to remove a social link
  const handleRemoveLink = useCallback((platformKey: string) => {
    const platform = SOCIAL_PLATFORMS.find((p) => p.key === platformKey);
    if (!platform) return;

    Alert.alert(
      'Remove Link',
      `Are you sure you want to remove your ${platform.name} link?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setLinks((prevLinks) => {
              const updatedLinks = { ...prevLinks };
              delete updatedLinks[platformKey];
              return updatedLinks;
            });
            console.log(`Link removed: ${platform.name}`);
          },
        },
      ],
      { cancelable: true },
    );
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

  return (
    <View style={styles.container}>
      {/* Add Social Link Button */}
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
        disabled={Object.keys(links).length >= MAX_LINKS}
      >
        <Text preset="bold" size="xs">
          Add Social Link
        </Text>
      </Button>

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
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text preset="subheading" style={{ flex: 3 }}>
              {'Add Social Link'}
            </Text>
            <Button
              preset="gradient"
              gradient={[
                colors.palette.primary100,
                colors.palette.secondary100,
              ]}
              onPress={() => addOrUpdateLink(selectedPlatform!, username)}
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
            LeftAccessory={() => (
              <MaterialIcons
                name="alternate-email"
                size={26}
                color={colors.palette.neutral400}
                style={styles.icon}
              />
            )}
            onSubmitEditing={handleUsernameSubmit}
            returnKeyType="done"
          />
        </View>
      </Modal>
    </View>
  );
};

export default SocialLinks;

// Stylesheet
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 10,
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
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
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
});
