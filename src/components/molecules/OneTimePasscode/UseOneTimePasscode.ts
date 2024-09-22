import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  NativeSyntheticEvent,
  TextInput,
  TextInputKeyPressEventData,
} from 'react-native';

// Define TypeScript types for the hook's parameters and return values
type SetFieldFunction = (field: string, value: string) => void;
type SetTouchedFunction = (field: string, isTouched: boolean) => void;

interface UseOneTimePasscodeProps {
  inputRefs: React.MutableRefObject<(TextInput | null)[]>;
  inputs: string[];
  handleInputChange: (index: number, text: string) => void;
  handleKeyPress: (
    index: number,
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => void;
}

// Custom hook for handling OTP input
const useOneTimePasscode = (
  initialValue: string,
  setFieldValue: SetFieldFunction,
  setFieldTouched: SetTouchedFunction,
): UseOneTimePasscodeProps => {
  const inputRefs = useRef<(TextInput | null)[]>(Array(6).fill(null));
  const [inputs, setInputs] = useState<string[]>(Array(6).fill(''));

  useEffect(() => {
    if (inputs.every((input) => input.length === 1)) {
      const code = inputs.join('');
      setFieldTouched('otp', true);
      setFieldValue('otp', code);
      Keyboard.dismiss();
    }
  }, [inputs, setFieldTouched, setFieldValue]);

  const handleInputChange = useCallback((index: number, text: string) => {
    setInputs((prevInputs) => {
      const newInputs = [...prevInputs];
      newInputs[index] = text;

      if (text.length === 1 && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      return newInputs;
    });
  }, []);

  const handleKeyPress = useCallback(
    (index: number, e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      if (
        e.nativeEvent.key === 'Backspace' &&
        inputs[index].length === 0 &&
        index > 0
      ) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [inputs],
  );

  return {
    inputRefs,
    inputs,
    handleInputChange,
    handleKeyPress,
  };
};

export default useOneTimePasscode;
