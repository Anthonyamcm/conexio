import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { Text } from '../Text/Text';
import { colors } from '@/src/utils';

interface UsernameCheckProps {
  isChecking: boolean;
  isAvailable: boolean | null;
  error?: string;
}

const UsernameCheck: React.FC<UsernameCheckProps> = ({
  isChecking,
  isAvailable,
  error,
}) => {
  const renderContent = () => {
    if (error) {
      return (
        <View style={styles.container}>
          <AntDesign
            name="exclamation"
            size={24}
            color={colors.palette.error100}
            style={styles.icon}
          />
          <Text>{error}</Text>
        </View>
      );
    }

    if (isChecking) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="small" style={styles.icon} />
          <Text>Checking...</Text>
        </View>
      );
    }

    if (isAvailable) {
      return (
        <View style={styles.container}>
          <Ionicons
            name="checkmark-circle-outline"
            size={24}
            color={colors.palette.success100}
            style={styles.icon}
          />
          <Text>Username available</Text>
        </View>
      );
    }

    if (isAvailable === null && !isChecking) {
      return (
        <View style={styles.container}>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color={colors.palette.neutral400}
            style={styles.icon}
          />
          <Text>Users can find you with your username</Text>
        </View>
      );
    }
  };

  return <>{renderContent()}</>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  icon: {
    marginRight: 10,
  },
});

export default UsernameCheck;
