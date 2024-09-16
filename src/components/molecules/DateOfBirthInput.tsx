import {
  Keyboard,
  NativeSyntheticEvent,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from 'react-native';
import { Input } from '../atoms';
import { useEffect, useRef, useState } from 'react';

type InputChangeHandler = (
  text: string,
  nextRef: React.RefObject<TextInput> | undefined,
  prevRef: React.RefObject<TextInput> | undefined,
) => void;

export default function DateOfBirthInput() {
  const dayInputRef = useRef<TextInput | null>(null);
  const monthInputRef = useRef<TextInput | null>(null);
  const yearInputRef = useRef<TextInput | null>(null);

  const [day, setDay] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');

  useEffect(() => {
    if (day.length === 2 && month.length === 2 && year.length === 4) {
      const dateString = `${year}-${month}-${day}`;
      const date = new Date(dateString);
      Keyboard.dismiss();
      console.log('Selected Date:', date);
    }
  }, [day, month, year]);

  const InputChangeHandler: InputChangeHandler = (
    text: string,
    nextRef: React.RefObject<TextInput> | undefined,
    prevRef: React.RefObject<TextInput> | undefined,
  ) => {
    if (text.length === 0 && prevRef && prevRef.current) {
      prevRef.current.focus();
    } else if (text.length === 2 && nextRef && nextRef?.current) {
      nextRef.current.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    text: string,
    prevRef?: React.RefObject<TextInput>,
  ) => {
    if (
      e.nativeEvent.key === 'Backspace' &&
      text.length === 0 &&
      prevRef?.current
    ) {
      prevRef.current.focus();
    }
  };

  const handleDayChange = (text: string) => {
    setDay(text);
    InputChangeHandler(text, monthInputRef, undefined);
  };

  const handleMonthChange = (text: string) => {
    setMonth(text);
    InputChangeHandler(text, yearInputRef, dayInputRef);
  };

  const handleYearChange = (text: string) => {
    setYear(text);
    InputChangeHandler(text, undefined, monthInputRef);
    if (text.length === 4) {
      Keyboard.dismiss();
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
      <Input
        placeholder="DD"
        containerStyle={{ flex: 1 }}
        style={{ textAlign: 'center' }}
        keyboardType="number-pad"
        maxLength={2}
        ref={dayInputRef}
        onChangeText={(value) => handleDayChange(value)}
        onKeyPress={(e) => handleKeyPress(e, day, undefined)}
        value={day}
      />
      <Input
        placeholder="MM"
        containerStyle={{ flex: 1 }}
        style={{ textAlign: 'center' }}
        keyboardType="number-pad"
        maxLength={2}
        ref={monthInputRef}
        onChangeText={(value) => handleMonthChange(value)}
        onKeyPress={(e) => handleKeyPress(e, month, dayInputRef)}
        value={month}
      />
      <Input
        placeholder="YYYY"
        containerStyle={{ flex: 1 }}
        style={{ textAlign: 'center' }}
        keyboardType="number-pad"
        maxLength={4}
        ref={yearInputRef}
        onChangeText={(value) => handleYearChange(value)}
        onKeyPress={(e) => handleKeyPress(e, year, monthInputRef)}
        value={year}
      />
    </View>
  );
}
