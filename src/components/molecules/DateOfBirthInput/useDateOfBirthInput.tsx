import { useState, useCallback, useEffect, useRef, RefObject } from 'react';
import {
  Keyboard,
  NativeSyntheticEvent,
  TextInput,
  TextInputKeyPressEventData,
} from 'react-native';

type DobDate = {
  day: string;
  month: string;
  year: string;
};

export interface DateOfBirthInputReturnType {
  date: DobDate;
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
  dayInputRef: React.RefObject<TextInput>;
  monthInputRef: React.RefObject<TextInput>;
  yearInputRef: React.RefObject<TextInput>;
}

const useDateOfBirthInput = (
  setFieldValue: (field: string, value: Date) => void,
  value: Date | null,
) => {
  const dayInputRef = useRef<TextInput | null>(null);
  const monthInputRef = useRef<TextInput | null>(null);
  const yearInputRef = useRef<TextInput | null>(null);
  const prevValueRef = useRef(value);
  const [date, setDate] = useState<DobDate>({ day: '', month: '', year: '' });

  const isComplete =
    date.day.length === 2 && date.month.length === 2 && date.year.length === 4;

  // Populate fields if value changes
  useEffect(() => {
    if (value instanceof Date && prevValueRef.current === value) {
      setDate({
        day: String(value.getDate()).padStart(2, '0'),
        month: String(value.getMonth() + 1).padStart(2, '0'),
        year: String(value.getFullYear()),
      });
    }
    prevValueRef.current = value; // Update the ref to the latest value
  }, [value]);

  // Consolidate the main logic into one useEffect
  useEffect(() => {
    if (isComplete) {
      const { day, month, year } = date;
      const dateString = `${year}-${month}-${day}`;
      const dateObject = new Date(dateString);

      if (!isNaN(dateObject.getTime())) {
        setFieldValue('dob', dateObject);
        Keyboard.dismiss();
      } else {
        console.error('Invalid date:', dateString);
      }
    }
  }, [isComplete, date, setFieldValue]);

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
      setDate((prev) => ({ ...prev, day: text }));
      InputChangeHandler(text, monthInputRef, undefined); // Adjust based on which fields you focus on
    },
    [InputChangeHandler],
  );

  const handleMonthChange = useCallback(
    (text: string) => {
      setDate((prev) => ({ ...prev, month: text }));
      InputChangeHandler(text, yearInputRef, dayInputRef); // Adjust as needed
    },
    [InputChangeHandler],
  );

  const handleYearChange = useCallback(
    (text: string) => {
      setDate((prev) => ({ ...prev, year: text }));
      InputChangeHandler(text, undefined, monthInputRef); // Adjust as needed
    },
    [InputChangeHandler],
  );

  const resetFields = useCallback(() => {
    setDate((prev) => ({ ...prev, name: '', month: '', year: '' }));
    if (dayInputRef.current) dayInputRef.current.clear();
    if (monthInputRef.current) monthInputRef.current.clear();
    if (yearInputRef.current) yearInputRef.current.clear();
  }, []);

  return {
    date,
    handleDayChange,
    handleMonthChange,
    handleYearChange,
    handleKeyPress,
    resetFields,
    isComplete,
    dayInputRef,
    monthInputRef,
    yearInputRef,
  };
};

export default useDateOfBirthInput;
