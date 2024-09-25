import { DateField } from '@/src/config';
import { isValidDay, isValidMonth } from '@/src/lib';
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
  handleChange: (field: DateField, text: string) => void;
  handleKeyPress: (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    field: DateField,
  ) => void;
  resetFields: () => void;
  dayInputRef: RefObject<TextInput>;
  monthInputRef: RefObject<TextInput>;
  yearInputRef: RefObject<TextInput>;
  formatMap: Record<
    'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY/MM/DD',
    Array<DateField>
  >;
}

const useDateOfBirthInput = (
  setFieldValue: (field: string, value: Date | string) => void,
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY/MM/DD',
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
    Array<DateField>
  > = {
    'MM/DD/YYYY': ['month', 'day', 'year'],
    'DD/MM/YYYY': ['day', 'month', 'year'],
    'YYYY/MM/DD': ['year', 'month', 'day'],
  };

  // State to manage the date input values
  const [date, setDate] = useState<DobDate>({
    day: '',
    month: '',
    year: '',
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
        setFieldValue('dob', parsedDate); // Update the date in Formik
        Keyboard.dismiss();
      } else {
        console.error('Invalid date:', dateString);
      }
    }
  }, [isComplete, date, setFieldValue]);

  // Helper function to get next and previous field refs based on date format
  const getFieldIndex = (field: DateField) => {
    return formatMap[dateFormat].indexOf(field);
  };

  const getNextFieldRef = (
    currentField: DateField,
  ): RefObject<TextInput> | undefined => {
    const currentIndex = getFieldIndex(currentField);
    const nextField =
      currentIndex < 2 ? formatMap[dateFormat][currentIndex + 1] : undefined;
    return nextField ? fieldRefs[nextField] : undefined;
  };

  const getPrevFieldRef = (
    currentField: DateField,
  ): RefObject<TextInput> | undefined => {
    const currentIndex = getFieldIndex(currentField);
    const prevField =
      currentIndex > 0 ? formatMap[dateFormat][currentIndex - 1] : undefined;
    return prevField ? fieldRefs[prevField] : undefined;
  };

  // Function to handle input changes and focus on the next or previous field if needed
  const handleChange = useCallback(
    (field: DateField, text: string) => {
      setDate((prev) => {
        const newDate = { ...prev, [field]: text };
        console.log({ field });
        setFieldValue(field, text); // Update the Formik field with the new date object
        return newDate;
      });

      // Validation logic for month and day
      const monthNum =
        field === 'month' ? parseInt(text, 10) : parseInt(date.month, 10);
      const yearNum =
        field === 'year' ? parseInt(text, 10) : parseInt(date.year, 10);

      // If the user is in the day field, check if the day is valid but still allow input
      if (field === 'day') {
        if (text.length > 0 && !isValidDay(text, monthNum, yearNum)) {
          // Optionally: Set an error state to indicate invalid day input
          console.warn('Invalid day input');
        }
      } else if (field === 'month') {
        if (text.length > 0 && !isValidMonth(text)) {
          // Optionally: Set an error state to indicate invalid month input
          console.warn('Invalid month input');
        }
      }

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
    [date, setFieldValue, getNextFieldRef, getPrevFieldRef],
  );

  // Function to handle key presses, specifically for backspace
  const handleKeyPress = useCallback(
    (e: NativeSyntheticEvent<TextInputKeyPressEventData>, field: DateField) => {
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
