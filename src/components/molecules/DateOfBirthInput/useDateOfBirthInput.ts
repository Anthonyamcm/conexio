import { DateField } from '@/src/config'; // Assuming DateField is 'day' | 'month' | 'year'
import { isValidDay, isValidMonth, isValidYear } from '@/src/lib'; // Added isValidYear for completeness
import { useState, useCallback, useRef, RefObject, useEffect } from 'react';
import {
  TextInput,
  Keyboard,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';

// Type for the date object
type DobDate = {
  day: string;
  month: string;
  year: string;
};

// Custom return type for the hook
export interface DateOfBirthInputReturnType {
  date: DobDate;
  isComplete: boolean;
  handleChange: (field: DateField, value: string) => void;
  handleKeyPress: (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    field: DateField,
  ) => void;
  resetFields: () => void;
  dayInputRef: RefObject<TextInput>;
  monthInputRef: RefObject<TextInput>;
  yearInputRef: RefObject<TextInput>;
  formatMap: Record<'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY/MM/DD', DateField[]>;
}

const useDateOfBirthInput = (
  setFieldValue: (field: string, value: string | Date) => void,
  setFieldError: (field: string, errorMsg: string) => void, // Added for inline error setting
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY/MM/DD' = 'DD/MM/YYYY',
): DateOfBirthInputReturnType => {
  // Refs for managing input fields
  const dayInputRef = useRef<TextInput>(null);
  const monthInputRef = useRef<TextInput>(null);
  const yearInputRef = useRef<TextInput>(null);

  // Store refs for easier navigation
  const fieldRefs = {
    day: dayInputRef,
    month: monthInputRef,
    year: yearInputRef,
  };

  // Map to define input field order based on date format
  const formatMap: Record<
    'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY/MM/DD',
    Array<DateField>
  > = {
    'MM/DD/YYYY': ['month', 'day', 'year'],
    'DD/MM/YYYY': ['day', 'month', 'year'],
    'YYYY/MM/DD': ['year', 'month', 'day'],
  };

  // State to manage date values
  const [date, setDate] = useState<DobDate>({ day: '', month: '', year: '' });

  // Determine if all fields are valid and filled
  const isComplete =
    date.day.length === 2 && date.month.length === 2 && date.year.length === 4;

  // Update Formik state when date input is complete and valid
  useEffect(() => {
    if (isComplete) {
      const { day, month, year } = date;
      const dateString = `${year}-${month}-${day}`;
      const parsedDate = new Date(dateString);

      if (!isNaN(parsedDate.getTime())) {
        setFieldValue('dob', parsedDate); // Update with Date object
        Keyboard.dismiss();
      } else {
        setFieldError('dob', 'Invalid date'); // Set form error if date is invalid
      }
    }
  }, [isComplete, date, setFieldValue, setFieldError]);

  // Helper to get next field ref in the format order
  const getNextFieldRef = (
    field: DateField,
  ): RefObject<TextInput> | undefined => {
    const currentIndex = formatMap[dateFormat].indexOf(field);
    const nextField =
      currentIndex < 2 ? formatMap[dateFormat][currentIndex + 1] : null;
    return nextField ? fieldRefs[nextField] : undefined;
  };

  // Helper to get previous field ref in the format order
  const getPrevFieldRef = (
    field: DateField,
  ): RefObject<TextInput> | undefined => {
    const currentIndex = formatMap[dateFormat].indexOf(field);
    const prevField =
      currentIndex > 0 ? formatMap[dateFormat][currentIndex - 1] : null;
    return prevField ? fieldRefs[prevField] : undefined;
  };

  // Handle changes in input fields and validate them
  const handleChange = useCallback(
    (field: DateField, value: string) => {
      setDate((prev) => {
        const newDate = { ...prev, [field]: value };

        // Field-specific validation and error messaging
        if (
          field === 'day' &&
          value.length === 2 &&
          !isValidDay(value, newDate.month, newDate.year)
        ) {
          setFieldError('dob.day', 'Invalid day');
        }
        if (field === 'month' && value.length === 2 && !isValidMonth(value)) {
          setFieldError('dob.month', 'Invalid month');
        }
        if (field === 'year' && value.length === 4 && !isValidYear(value)) {
          setFieldError('dob.year', 'Invalid year');
        }

        return newDate;
      });

      // Focus management based on input length
      if (value.length === 2 && field !== 'year') {
        const nextField = getNextFieldRef(field);
        nextField?.current?.focus();
      } else if (value.length === 0 && field !== 'day') {
        const prevField = getPrevFieldRef(field);
        prevField?.current?.focus();
      }
    },
    [setFieldError, getNextFieldRef, getPrevFieldRef],
  );

  // Handle key presses like backspace to clear fields and move focus
  const handleKeyPress = useCallback(
    (e: NativeSyntheticEvent<TextInputKeyPressEventData>, field: DateField) => {
      if (e.nativeEvent.key === 'Backspace' && date[field].length === 0) {
        const prevField = getPrevFieldRef(field);
        prevField?.current?.focus();
      }
    },
    [date],
  );

  // Reset fields and clear formik values
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
