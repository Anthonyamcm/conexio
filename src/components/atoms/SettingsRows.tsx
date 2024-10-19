import { colors } from '@/src/utils';
import { StyleSheet, Switch, View } from 'react-native';
import { Text } from './Text/Text';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

interface SettingRowProps {
  title: string;
  value: boolean;
  onToggle: () => void;
  disabled?: boolean;
  icon: string;
}

const SettingRow: React.FC<SettingRowProps> = ({
  title,
  value,
  onToggle,
  disabled = false,
  icon,
}) => (
  <View style={styles.settingRow}>
    <FontAwesome6
      name={icon}
      size={18}
      color={colors.palette.neutral800}
      style={{ marginRight: 10 }}
    />
    <Text preset="bold" style={styles.settingText}>
      {title}
    </Text>
    <Switch
      trackColor={{
        false: colors.palette.neutral200,
        true: colors.palette.success100,
      }}
      thumbColor={colors.palette.neutral100}
      ios_backgroundColor={colors.palette.neutral200}
      onValueChange={onToggle}
      value={value}
      accessibilityLabel={`Toggle ${title} Notifications`}
      disabled={disabled}
    />
  </View>
);

const styles = StyleSheet.create({
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  settingText: {
    flex: 1,
    marginRight: 10,
    color: colors.palette.neutral800,
    fontSize: 16,
  },
});

export default SettingRow;
