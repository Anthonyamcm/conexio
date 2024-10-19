import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, Screen, Text } from '@/src/components/atoms';
import { Header } from '@/src/components/molecules';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { colors } from '@/src/utils';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import SettingRow from '@/src/components/atoms/SettingsRows';
import PrivacyPickerModal from '@/src/components/molecules/Modals/PrivacyPickerModal';

const SettingsPrivacyScreen: React.FC = () => {
  const [isNotificationsEnabled, setIsNotificationsEnabled] =
    useState<boolean>(false);
  const [notificationPreferences, setNotificationPreferences] = useState<{
    messages: boolean;
    comments: boolean;
    likes: boolean;
    mentions: boolean;
  }>({
    messages: false,
    comments: false,
    likes: false,
    mentions: false,
  });
  const [contactPreference, setContactPreference] =
    useState<string>('Everyone');
  const [profileVisibility, setProfileVisibility] = useState<string>('Public');
  const [locationVisibility, setLocationVisibility] =
    useState<string>('Public');

  // Picker Modal State
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentSetting, setCurrentSetting] = useState<
    'contact' | 'visibility' | null
  >(null);
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true); // To handle async permission check

  useEffect(() => {
    checkNotificationPermission();
  }, []);

  /**
   * Checks the current notification permissions and updates the switch state accordingly.
   */
  const checkNotificationPermission = async () => {
    try {
      if (!Device.isDevice) {
        Alert.alert('Error', 'Must use physical device for notifications.');
        setIsLoading(false);
        return;
      }

      const { status } = await Notifications.getPermissionsAsync();
      if (status === 'granted') {
        setIsNotificationsEnabled(true);
      } else {
        setIsNotificationsEnabled(false);
      }
    } catch (error) {
      console.error('Error checking notification permissions:', error);
      Alert.alert('Error', 'Failed to check notification permissions.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Requests notification permissions from the user.
   */
  const requestNotificationPermission = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        setIsNotificationsEnabled(true);
      } else if (status === 'denied') {
        setIsNotificationsEnabled(false);
        Alert.alert(
          'Permission Denied',
          'Notifications permission was denied. You can enable it from settings.',
        );
      }
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      Alert.alert('Error', 'Failed to request notification permissions.');
    }
  };

  /**
   * Handles the toggle action for individual notification preferences.
   * @param key - The key of the notification preference to toggle.
   */
  const toggleNotificationPreference = (
    key: keyof typeof notificationPreferences,
  ) => {
    setNotificationPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  /**
   * Handles the toggle action for the global notification switch.
   */
  const toggleGlobalNotificationSwitch = async () => {
    if (!isNotificationsEnabled) {
      // If the switch is being turned on, request permission
      await requestNotificationPermission();
    } else {
      // If the switch is being turned off, handle accordingly
      setIsNotificationsEnabled(!isNotificationsEnabled);
      setNotificationPreferences({
        messages: !isNotificationsEnabled,
        comments: !isNotificationsEnabled,
        likes: !isNotificationsEnabled,
        mentions: !isNotificationsEnabled,
      });

      // Optionally, implement logic to unregister from notifications
      // Note: Expo does not provide a direct way to unregister notifications,
      // but you can manage your notification logic to respect this setting.
    }
  };

  /**
   * Handles the toggle action for the notification switch.
   */
  const toggleNotificationSwitch = async () => {
    if (!isNotificationsEnabled) {
      // If the switch is being turned on, request permission
      await requestNotificationPermission();
    } else {
      // If the switch is being turned off, handle accordingly
      setIsNotificationsEnabled(false);
      Alert.alert(
        'Notifications Disabled',
        'You will no longer receive notifications.',
      );
      // Optionally, implement logic to unregister from notifications
      // Note: Expo does not provide a direct way to unregister notifications,
      // but you can manage your notification logic to respect this setting.
    }
  };

  /**
   * Handles the press action on privacy settings options to open the Picker modal.
   * @param setting - The name of the setting being edited.
   */
  const handlePrivacySettingPress = useCallback(
    (setting: 'contact' | 'visibility') => {
      setCurrentSetting(setting);
      setSelectedValue(
        setting === 'contact' ? contactPreference : profileVisibility,
      );
      setIsModalVisible(true);
    },
    [contactPreference, profileVisibility],
  );

  /**
   * Handles the selection from the Picker and updates the corresponding state.
   */
  const handlePickerValueChange = useCallback((value: string) => {
    setSelectedValue(value);
  }, []);

  /**
   * Confirms the Picker selection and updates the state accordingly.
   */
  const confirmPickerSelection = useCallback(() => {
    if (currentSetting === 'contact') {
      setContactPreference(selectedValue);
      // Optionally, persist the change to backend
    } else if (currentSetting === 'visibility') {
      setProfileVisibility(selectedValue);
      // Optionally, persist the change to backend
    }
    setIsModalVisible(false);
    Alert.alert('Settings Updated', 'Your privacy settings have been updated.');
  }, [currentSetting, selectedValue]);

  /**
   * Cancels the Picker selection and closes the modal.
   */
  const cancelPickerSelection = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const renderPrivacySettings = () => {
    const settings = [
      {
        id: 'visibility',
        label: 'Profile Visibility',
        value: profileVisibility,
        icon: 'eye',
      },
      {
        id: 'contact',
        label: 'Who Can Contact You',
        value: contactPreference,
        icon: 'envelope',
      },
      {
        id: 'search',
        label: 'Who Can Find You',
        value: contactPreference,
        icon: 'search',
      },
      {
        id: 'tag',
        label: 'Who Can Mention You',
        value: contactPreference,
        icon: 'at',
      },

      // Add more privacy settings here as needed
    ];
    return settings.map((setting) => (
      <View key={setting.id}>
        <TouchableOpacity
          style={styles.pickerOption}
          onPress={() =>
            handlePrivacySettingPress(setting.id as 'contact' | 'visibility')
          }
          activeOpacity={0.7}
          accessibilityLabel={`Edit ${setting.label}`}
        >
          <View style={styles.pickerOptionRow}>
            <FontAwesome5
              name={setting.icon as any} // Ensure correct icon type
              size={20}
              color={colors.palette.neutral900}
              style={{ marginRight: 10 }}
            />
            <Text preset="bold" style={styles.pickerOptionText}>
              {setting.label}
            </Text>
          </View>
          <Text preset="bold" style={styles.pickerOptionValue}>
            {setting.value}
          </Text>
        </TouchableOpacity>
      </View>
    ));
  };

  return (
    <Screen preset="auto" contentContainerStyle={styles.container}>
      <Header
        title="Settings & Privacy"
        subtitle="Customize your profile visibility and manage your preferences."
      />

      <View style={{ flex: 1, flexDirection: 'column', gap: 15 }}>
        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <FontAwesome5
              name="bell"
              size={22}
              color={colors.palette.neutral900}
              style={{ marginRight: 10 }}
            />
            <Text preset="bold" size="md" style={styles.settingText}>
              {'Notification settings'}
            </Text>
            <Switch
              trackColor={{
                false: colors.palette.neutral200,
                true: colors.palette.success100,
              }}
              thumbColor={colors.palette.neutral100}
              ios_backgroundColor={colors.palette.neutral200}
              onValueChange={() => toggleGlobalNotificationSwitch()}
              value={isNotificationsEnabled}
              accessibilityLabel={`Toggle Notifications`}
            />
          </View>
          <View style={styles.divider} />
          <SettingRow
            title="Messages"
            value={notificationPreferences.messages}
            onToggle={() => toggleNotificationPreference('messages')}
            disabled={!isNotificationsEnabled}
            icon="message"
          />
          <SettingRow
            title="Comments"
            value={notificationPreferences.comments}
            onToggle={() => toggleNotificationPreference('comments')}
            disabled={!isNotificationsEnabled}
            icon="comments"
          />
          <SettingRow
            title="Likes"
            value={notificationPreferences.likes}
            onToggle={() => toggleNotificationPreference('likes')}
            disabled={!isNotificationsEnabled}
            icon="heart"
          />
          <SettingRow
            title="Mentions"
            value={notificationPreferences.mentions}
            onToggle={() => toggleNotificationPreference('mentions')}
            disabled={!isNotificationsEnabled}
            icon="at"
          />
        </View>

        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <FontAwesome5
              name="lock"
              size={22}
              color={colors.palette.neutral900}
              style={{ marginRight: 10 }}
            />
            <Text preset="bold" size="md" style={styles.settingText}>
              {'Privacy settings'}
            </Text>
          </View>
          <View style={styles.divider} />

          {renderPrivacySettings()}
        </View>
      </View>

      <View style={{ flexDirection: 'row' }}>
        <Button
          preset={'gradient'}
          gradient={[colors.palette.primary100, colors.palette.secondary100]}
        >
          {'Confirm'}
        </Button>
      </View>

      {currentSetting && (
        <PrivacyPickerModal
          isVisible={isModalVisible}
          title={
            currentSetting === 'contact'
              ? 'Who Can Contact You'
              : 'Profile Visibility'
          }
          options={
            currentSetting === 'visibility'
              ? [
                  { label: 'Public', value: 'Public' },
                  { label: 'Private', value: 'Private' },
                ]
              : [
                  { label: 'Everyone', value: 'Everyone' },
                  { label: 'Connections Only', value: 'Connections' },
                  { label: 'Followers', value: 'Followers' },
                  { label: 'No One', value: 'No One' },
                ]
          }
          selectedValue={selectedValue}
          onValueChange={handlePickerValueChange}
          onConfirm={confirmPickerSelection}
          onCancel={cancelPickerSelection}
        />
      )}
      {/* Add more settings here */}
    </Screen>
  );
};

export default SettingsPrivacyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 15,
  },
  settingCard: {
    flexDirection: 'column',
    padding: 12,
    borderRadius: 16,
    backgroundColor: colors.palette.neutral200,
  },
  divider: {
    height: 1,
    backgroundColor: colors.palette.neutral300,
    marginVertical: 5,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  pickerOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerOptionText: {
    fontSize: 16,
    color: colors.palette.neutral800,
  },
  pickerOptionValue: {
    fontSize: 16,
    color: colors.palette.neutral600,
  },
  settingText: {
    flex: 1,
    marginRight: 10,
    color: colors.palette.neutral900,
  },
});
