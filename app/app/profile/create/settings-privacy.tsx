import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Switch, View } from 'react-native';
import { Button, Screen, Text } from '@/src/components/atoms';
import { Header } from '@/src/components/molecules';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { colors } from '@/src/utils';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import SettingRow from '@/src/components/atoms/SettingsRows';
import { Picker } from '@react-native-picker/picker';

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
   * Opens the app settings for the user to manually enable permissions.
   */
  const openAppSettings = () => {
    Alert.alert(
      'Permission Blocked',
      'Notifications permission is blocked. Please enable it from settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => console.log('here') },
      ],
    );
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
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Who Can Contact You</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={contactPreference}
                onValueChange={(itemValue) => setContactPreference(itemValue)}
                style={styles.picker}
                dropdownIconColor={colors.palette.neutral600}
              >
                <Picker.Item label="Everyone" value="Everyone" />
                <Picker.Item label="Friends Only" value="Friends" />
                <Picker.Item label="No One" value="No One" />
              </Picker>
            </View>
          </View>
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
  pickerContainer: {
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 16,
    color: colors.palette.neutral800,
    marginBottom: 5,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: colors.palette.neutral400,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.palette.neutral100,
  },
  picker: {
    height: 540,
  },
  settingText: {
    flex: 1,
    marginRight: 10,
    color: colors.palette.neutral900,
  },
});
