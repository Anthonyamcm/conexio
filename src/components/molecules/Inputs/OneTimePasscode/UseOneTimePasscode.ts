import { useRef, useCallback } from 'react';
import {
  TextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';

export interface OneTimePasscodeHandle {
  reset: () => void;
}

const OTP_LENGTH = 6;

export default function useOneTimePasscode(
  value: string,
  onChange: (value: string) => void,
) {
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const codeDigits = Array.from(
    { length: OTP_LENGTH },
    (_, i) => value[i] || '',
  );

  const handleChange = useCallback(
    (text: string, index: number) => {
      const newValue = value.split('');
      newValue[index] = text;
      const updatedValue = newValue.join('');

      onChange(updatedValue);

      if (text && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [onChange, value],
  );

  const handleKeyPress = useCallback(
    (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
      if (e.nativeEvent.key === 'Backspace') {
        if (value[index]) {
          const newValue = value.split('');
          newValue[index] = '';
          onChange(newValue.join(''));
        } else if (index > 0) {
          inputRefs.current[index - 1]?.focus();
          const newValue = value.split('');
          newValue[index - 1] = '';
          onChange(newValue.join(''));
        }
      }
    },
    [onChange, value],
  );

  const resetFields = useCallback(() => {
    onChange('');
    inputRefs.current[0]?.focus();
  }, [onChange]);

  return {
    inputRefs,
    codeDigits,
    handleChange,
    handleKeyPress,
    resetFields,
  };
}
