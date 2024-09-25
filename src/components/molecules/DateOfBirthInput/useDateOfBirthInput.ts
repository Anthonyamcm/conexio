import { useState, useCallback, useEffect, useRef, RefObject } from 'react';
import {
  Keyboard,
  NativeSyntheticEvent,
  TextInput,
  TextInputKeyPressEventData,
} from 'react-native';

// Type for the date object
type DobDate = {
  day: string;
  month: string;
  year: string;
};

// Interface for the return type of the hook
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
): DateOfBirthInputReturnType => {
  // Refs for the input fields
  const dayInputRef = useRef<TextInput | null>(null);
  const monthInputRef = useRef<TextInput | null>(null);
  const yearInputRef = useRef<TextInput | null>(null);

  // State to manage the date input values
  const [date, setDate] = useState<DobDate>({
    day: value ? String(value.getDate()).padStart(2, '0') : '',
    month: value ? String(value.getMonth() + 1).padStart(2, '0') : '',
    year: value ? String(value.getFullYear()) : '',
  });

  // Derived state to check if all fields are filled
  const isComplete =
    date.day.length === 2 && date.month.length === 2 && date.year.length === 4;

  // Effect to update the parent component's state when the date is complete and valid
  useEffect(() => {
    if (isComplete) {
      const { day, month, year } = date;
      const dateString = `${year}-${month}-${day}`;
      const parsedDate = new Date(dateString);

      // Check if the parsed date is valid
      if (!isNaN(parsedDate.getTime())) {
        setFieldValue('dob', parsedDate);
        Keyboard.dismiss(); // Dismiss the keyboard after a valid date is entered
      } else {
        // Handle invalid date gracefully (e.g., show an error message)
        console.error('Invalid date:', dateString);
      }
    }
  }, [isComplete, date, setFieldValue]);

  // Function to handle input changes and focus on the next field if needed
  const handleInputChange = useCallback(
    (
      text: string,
      nextRef?: RefObject<TextInput>,
      prevRef?: RefObject<TextInput>,
    ) => {
      // If the input is empty and there's a previous field, focus on it
      if (text.length === 0 && prevRef?.current) {
        prevRef.current.focus();
      }
      // If the input has reached its max length and there's a next field, focus on it
      else if (text.length === 2 && nextRef?.current) {
        nextRef.current.focus();
      }
    },
    [],
  );

  // Function to handle key presses, specifically for backspace to move to the previous field
  const handleKeyPress = useCallback(
    (
      e: NativeSyntheticEvent<TextInputKeyPressEventData>,
      text: string,
      prevRef?: RefObject<TextInput>,
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

  // Handlers for each input field's change events
  const handleDayChange = useCallback(
    (text: string) => {
      setDate((prev) => ({ ...prev, day: text }));
      handleInputChange(text, monthInputRef);
    },
    [handleInputChange],
  );

  const handleMonthChange = useCallback(
    (text: string) => {
      setDate((prev) => ({ ...prev, month: text }));
      handleInputChange(text, yearInputRef, dayInputRef);
    },
    [handleInputChange],
  );

  const handleYearChange = useCallback(
    (text: string) => {
      setDate((prev) => ({ ...prev, year: text }));
      handleInputChange(text, undefined, monthInputRef);
    },
    [handleInputChange],
  );

  // Function to reset all input fields
  const resetFields = useCallback(() => {
    setDate({ day: '', month: '', year: '' });
    dayInputRef.current?.clear();
    monthInputRef.current?.clear();
    yearInputRef.current?.clear();
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
