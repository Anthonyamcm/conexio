import { colors } from '@/src/utils';
import { FontAwesome6, FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from './Text';

interface SocailChipProps {
  label: string;
  iconName: keyof typeof FontAwesome6.glyphMap;
  onDelete: () => void;
}

const SocailChip: React.FC<SocailChipProps> = ({
  label,
  iconName,
  onDelete,
}) => {
  return (
    <View style={styles.chipContainer}>
      <FontAwesome6
        name={iconName}
        size={18}
        color={colors.palette.neutral900}
      />
      <Text preset="bold">{label}</Text>
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <FontAwesome name="close" size={18} color={colors.palette.neutral900} />
      </TouchableOpacity>
    </View>
  );
};

export default SocailChip;

const styles = StyleSheet.create({
  chipContainer: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: colors.palette.neutral200,
  },

  deleteButton: {
    borderRadius: 8,
    padding: 2,
  },
});
