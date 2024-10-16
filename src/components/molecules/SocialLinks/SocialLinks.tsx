import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
} from 'react-native';
import Modal from 'react-native-modal';
import { Button, SocialChip, Text } from '../../atoms';
import { colors } from '@/src/utils';
import { SOCIAL_PLATFORMS } from '@/src/constants/SocialPlatforms';
import { FontAwesome6 } from '@expo/vector-icons';

interface SocialLinksState {
  [platform: string]: string; // e.g., { twitter: 'https://twitter.com/username' }
}

const SocialLinks: React.FC = () => {
  const [links, setLinks] = useState<SocialLinksState>({});
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  // Function to add a new link
  const addOrUpdateLink = (platformKey: string): void => {
    const platform = SOCIAL_PLATFORMS.find((p) => p.key === platformKey);
    if (!platform) {
      Alert.alert('Error', 'Selected platform is not supported.');
      return;
    }

    // Construct the full URL by appending the predefined username

    const name = platform.name;

    setLinks((prevLinks) => ({
      ...prevLinks,
      [platform.key]: name,
    }));
    setModalVisible(false);
    Keyboard.dismiss(); // Dismiss the keyboard if open
  };

  // Function to remove a link
  const removeLink = (platform: string): void => {
    const platformObj = SOCIAL_PLATFORMS.find((p) => p.key === platform);
    if (!platformObj) return;

    Alert.alert(
      'Remove Link',
      `Are you sure you want to remove your ${platformObj.name} link?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setLinks((prevLinks) => {
              const updatedLinks = { ...prevLinks };
              delete updatedLinks[platform];
              return updatedLinks;
            });
          },
        },
      ],
      { cancelable: true },
    );
  };

  const renderPlatformChoices = () => {
    return (
      <View style={styles.platformList}>
        {SOCIAL_PLATFORMS.map((platform) => (
          <TouchableOpacity
            key={platform.key}
            style={styles.platformItem}
            onPress={() => addOrUpdateLink(platform.key)}
          >
            <FontAwesome6
              name={platform.icon}
              size={24}
              color={colors.palette.neutral900}
            />
            <Text
              preset="bold" // Ensure your 'Text' component supports 'preset'
            >
              {platform.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Button
        preset="reversed"
        LeftAccessory={() => (
          <FontAwesome6
            name="plus"
            size={18}
            color={colors.palette.neutral900}
            style={styles.icon}
          />
        )}
        onPress={() => setModalVisible(true)}
      >
        <Text preset="bold" size="xs">
          {'Add Social Link'}
        </Text>
      </Button>

      {Object.keys(links).length > 0
        ? Object.keys(links).map((platformKey) => (
            <SocialChip
              key={platformKey}
              label={links[platformKey]}
              iconName={
                SOCIAL_PLATFORMS.find((p) => p.key === platformKey)?.icon ||
                'link'
              }
              onDelete={() => removeLink(platformKey)}
            />
          ))
        : null}

      {/* Bottom Sheet Modal */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        swipeDirection="down"
        onSwipeComplete={() => setModalVisible(false)}
        style={styles.modal}
        propagateSwipe={false}
        avoidKeyboard={true} // Ensure keyboard doesn't overlap the modal
      >
        <View style={styles.modalContent}>
          <Text preset="subheading">Add Social Link</Text>
          {renderPlatformChoices()}
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
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 5,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  title: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  list: {
    flexGrow: 0,
  },
  linkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
  },
  linkText: {
    flex: 1,
    marginRight: 10,
    color: '#333',
    textDecorationLine: 'underline',
  },
  removeText: {
    color: 'red',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    flexDirection: 'column',
    gap: 25,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    minHeight: 500,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  platformList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  platformItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 16,
    backgroundColor: colors.palette.neutral200,
  },
  platformItemSelected: {
    backgroundColor: '#6200ee',
  },
  platformTextSelected: {
    color: '#fff',
  },
  input: {
    borderColor: '#888',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    alignSelf: 'center',
    marginEnd: 6,
    opacity: 1,
  },
});
