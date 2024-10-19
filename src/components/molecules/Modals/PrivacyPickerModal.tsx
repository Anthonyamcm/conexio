import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
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
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
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
              preset="filled"
              onPress={onCancel}
              style={styles.modalButton}
              accessibilityLabel="Cancel Picker"
            >
              Cancel
            </Button>
            <Button
              preset="gradient"
              gradient={[
                colors.palette.primary100,
                colors.palette.secondary100,
              ]}
              onPress={onConfirm}
              style={styles.modalButton}
              accessibilityLabel="Confirm Picker Selection"
            >
              Confirm
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PrivacyPickerModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  modalContent: {
    backgroundColor: colors.palette.neutral100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.palette.neutral800,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalPicker: {
    width: '100%',
    height: 150,
    color: colors.palette.neutral800,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});
