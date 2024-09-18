import { useState, useCallback, useEffect, useRef, RefObject } from 'react';
import {
  Keyboard,
  NativeSyntheticEvent,
  TextInput,
  TextInputKeyPressEventData,
} from 'react-native';

interface DateInputParams {
  setFieldValue: (field: string, value: Date) => void;
}

export interface DateOfBirthInputReturnType {
  day: string;
  month: string;
  year: string;
  isComplete: boolean;
  handleDayChange: (text: string) => void;
  handleMonthChange: (text: string) => void;
  handleYearChange: (text: string) => void;
  handleKeyPress: (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    text: string,
    prevRef?: RefObject<TextInput>,
  ) => void;
  resetFields: () => void;
}

const useDateOfBirthInput = (
  setFieldValue: (field: string, value: Date) => void,
) => {
  const dayInputRef = useRef<TextInput | null>(null);
  const monthInputRef = useRef<TextInput | null>(null);
  const yearInputRef = useRef<TextInput | null>(null);
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const isComplete =
    day.length === 2 && month.length === 2 && year.length === 4;

  // Consolidate changes into one useEffect
  useEffect(() => {
    if (isComplete) {
      const dateString = `${year}-${month}-${day}`;
      const date = new Date(dateString);
      setFieldValue('dob', date);
      Keyboard.dismiss();
    }
  }, [day, month, year, isComplete, setFieldValue]);

  const InputChangeHandler = useCallback(
    (
      text: string,
      nextRef?: React.RefObject<TextInput>,
      prevRef?: React.RefObject<TextInput>,
    ) => {
      if (text.length === 0 && prevRef && prevRef.current) {
        prevRef.current.focus();
      } else if (text.length === 2 && nextRef && nextRef?.current) {
        nextRef.current.focus();
      }
    },
    [],
  );

  const handleKeyPress = useCallback(
    (
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
    },
    [],
  );

  const handleDayChange = useCallback(
    (text: string) => {
      setDay(text);
      InputChangeHandler(text, monthInputRef, undefined); // Adjust based on which fields you focus on
    },
    [InputChangeHandler],
  );

  const handleMonthChange = useCallback(
    (text: string) => {
      setMonth(text);
      InputChangeHandler(text, yearInputRef, dayInputRef); // Adjust as needed
    },
    [InputChangeHandler],
  );

  const handleYearChange = useCallback(
    (text: string) => {
      setYear(text);
      InputChangeHandler(text, undefined, monthInputRef); // Adjust as needed
    },
    [InputChangeHandler],
  );

  const resetFields = useCallback(() => {
    setDay('');
    setMonth('');
    setYear('');
  }, []);

  return {
    day,
    month,
    year,
    handleDayChange,
    handleMonthChange,
    handleYearChange,
    handleKeyPress,
    resetFields,
    isComplete,
  };
};

export default useDateOfBirthInput;
