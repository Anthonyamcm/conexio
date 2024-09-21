import {
  Keyboard,
  NativeSyntheticEvent,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from 'react-native';
import { Input } from '../../atoms';
import { useEffect, useRef, useState } from 'react';

export default function OneTimePasscode() {
  // Refs for each input field
  const inputRefs = Array.from({ length: 6 }, () =>
    useRef<TextInput | null>(null),
  );

  // State for each input field
  const [inputs, setInputs] = useState<string[]>(Array(6).fill(''));

  // Effect to handle completed code
  useEffect(() => {
    const isComplete = inputs.every((input) => input.length === 1);
    if (isComplete) {
      const code = inputs.join('');
      Keyboard.dismiss();
      console.log('Code', code);
    }
  }, [inputs]);

  // Change handler for each input field
  const handleInputChange = (index: number, text: string) => {
    const newInputs = [...inputs];
    newInputs[index] = text;
    setInputs(newInputs);

    const nextRef = inputRefs[index + 1];
    const prevRef = inputRefs[index - 1];

    if (text.length === 0 && prevRef && prevRef.current) {
      prevRef.current.focus();
    } else if (text.length === 1 && nextRef && nextRef.current) {
      nextRef.current.focus();
    }
  };

  // Key press handler for backspace
  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key === 'Backspace' && inputs[index].length === 0) {
      const prevRef = inputRefs[index - 1];
      if (prevRef.current) {
        prevRef.current.focus();
      }
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 15,
        alignItems: 'flex-start',
        overflow: 'hidden',
      }}
    >
      {inputs.map((value, index) => (
        <Input
          key={index}
          placeholder="0"
          containerStyle={{ flex: 1 }}
          style={{ textAlign: 'center' }}
          keyboardType="number-pad"
          maxLength={1}
          ref={inputRefs[index]}
          onChangeText={(text) => handleInputChange(index, text)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          value={value}
        />
      ))}
    </View>
  );
}
