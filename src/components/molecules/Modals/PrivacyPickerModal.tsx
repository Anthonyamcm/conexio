import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import { Button, Text } from '@/src/components/atoms';
import { colors } from '@/src/utils';

interface PrivacyPickerModalProps {
  isVisible: boolean;
  title: string;
  options: { label: string; value: string }[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const PrivacyPickerModal: React.FC<PrivacyPickerModalProps> = ({
  isVisible,
  title,
  options,
  selectedValue,
  onValueChange,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={() => onCancel}
      style={styles.modal}
      propagateSwipe={false}
      avoidKeyboard={true}
    >
      <View style={styles.modalContent}>
        <Text preset="bold" style={styles.modalTitle}>
          {title}
        </Text>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={styles.modalPicker}
          dropdownIconColor={colors.palette.neutral600}
          accessibilityLabel={`${title} Picker`}
        >
          {options.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
        <View style={styles.modalButtons}>
          <Button
            preset="reversed"
            onPress={onCancel}
            style={styles.modalButton}
            accessibilityLabel="Cancel Picker"
          >
            Cancel
          </Button>
          <Button
            preset="gradient"
            gradient={[colors.palette.primary100, colors.palette.secondary100]}
            onPress={onConfirm}
            style={styles.modalButton}
            accessibilityLabel="Confirm Picker Selection"
          >
            Confirm
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export default PrivacyPickerModal;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderTopRightRadius: 21,
    borderTopLeftRadius: 21,
    minHeight: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.palette.neutral800,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalPicker: {
    flex: 1,
    width: '100%',
    color: colors.palette.neutral900,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});
