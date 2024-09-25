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
  handleChange: (field: 'day' | 'month' | 'year', text: string) => void;
  handleKeyPress: (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    field: 'day' | 'month' | 'year',
  ) => void;
  resetFields: () => void;
  dayInputRef: RefObject<TextInput>;
  monthInputRef: RefObject<TextInput>;
  yearInputRef: RefObject<TextInput>;
  formatMap: Record<
    'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY/MM/DD',
    Array<'day' | 'month' | 'year'>
  >;
}

const useDateOfBirthInput = (
  setFieldValue: (field: string, value: Date | null) => void,
  initialDate: Date | null,
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY/MM/DD', // Default to a specific format
): DateOfBirthInputReturnType => {
  const dayInputRef = useRef<TextInput>(null);
  const monthInputRef = useRef<TextInput>(null);
  const yearInputRef = useRef<TextInput>(null);

  const fieldRefs = {
    day: dayInputRef,
    month: monthInputRef,
    year: yearInputRef,
  };

  // Define order of inputs based on date format
  const formatMap: Record<
    'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY/MM/DD',
    Array<'day' | 'month' | 'year'>
  > = {
    'MM/DD/YYYY': ['month', 'day', 'year'],
    'DD/MM/YYYY': ['day', 'month', 'year'],
    'YYYY/MM/DD': ['year', 'month', 'day'],
  };

  // State to manage the date input values
  const [date, setDate] = useState<DobDate>({
    day: initialDate ? String(initialDate.getDate()).padStart(2, '0') : '',
    month: initialDate
      ? String(initialDate.getMonth() + 1).padStart(2, '0')
      : '',
    year: initialDate ? String(initialDate.getFullYear()) : '',
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

      if (!isNaN(parsedDate.getTime())) {
        setFieldValue('dob', parsedDate);
        Keyboard.dismiss();
      } else {
        console.error('Invalid date:', dateString);
      }
    }
  }, [isComplete, date, setFieldValue]);

  // Helper function to get next and previous field refs based on date format
  const getFieldIndex = (field: 'day' | 'month' | 'year') => {
    return formatMap[dateFormat].indexOf(field);
  };

  const getNextFieldRef = (
    currentField: 'day' | 'month' | 'year',
  ): RefObject<TextInput> | undefined => {
    const currentIndex = getFieldIndex(currentField);
    const nextField =
      currentIndex < 2 ? Object.keys(fieldRefs)[currentIndex + 1] : undefined;
    return nextField
      ? fieldRefs[nextField as keyof typeof fieldRefs]
      : undefined;
  };

  const getPrevFieldRef = (
    currentField: 'day' | 'month' | 'year',
  ): RefObject<TextInput> | undefined => {
    const currentIndex = getFieldIndex(currentField);
    const prevField =
      currentIndex > 0 ? Object.keys(fieldRefs)[currentIndex - 1] : undefined;
    return prevField
      ? fieldRefs[prevField as keyof typeof fieldRefs]
      : undefined;
  };

  // Function to handle input changes and focus on the next or previous field if needed
  const handleChange = useCallback(
    (field: 'day' | 'month' | 'year', text: string) => {
      setDate((prev) => ({ ...prev, [field]: text }));

      // Determine the next and previous field references based on the current field
      const nextFieldRef = getNextFieldRef(field);
      const prevFieldRef = getPrevFieldRef(field);

      // Focus logic
      if (text.length === 2 && nextFieldRef?.current) {
        nextFieldRef.current.focus();
      } else if (text.length === 0 && prevFieldRef?.current) {
        prevFieldRef.current.focus();
      }
    },
    [getNextFieldRef, getPrevFieldRef],
  );

  // Function to handle key presses, specifically for backspace
  const handleKeyPress = useCallback(
    (
      e: NativeSyntheticEvent<TextInputKeyPressEventData>,
      field: 'day' | 'month' | 'year',
    ) => {
      if (e.nativeEvent.key === 'Backspace') {
        handleChange(field, ''); // Clear the current field and focus on the previous
      }
    },
    [handleChange],
  );

  const resetFields = useCallback(() => {
    setDate({ day: '', month: '', year: '' });
    dayInputRef.current?.clear();
    monthInputRef.current?.clear();
    yearInputRef.current?.clear();
  }, []);

  return {
    date,
    isComplete,
    handleChange,
    handleKeyPress,
    resetFields,
    dayInputRef,
    monthInputRef,
    yearInputRef,
    formatMap,
  };
};

export default useDateOfBirthInput;
