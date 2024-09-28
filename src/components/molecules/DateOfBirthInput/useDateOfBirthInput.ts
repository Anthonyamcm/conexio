import { DateField } from '@/src/config';
import { useState, useCallback, useRef, RefObject, useMemo } from 'react';
import {
  TextInput,
  Keyboard,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';

interface DobDate {
  day: string;
  month: string;
  year: string;
}

export interface DateOfBirthInputReturnType {
  dateParts: DobDate;
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
  value: Date | null,
  onChange: (date: Date | null) => void,
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY/MM/DD' = 'DD/MM/YYYY',
): DateOfBirthInputReturnType => {
  // Refs for managing input fields
  const dayInputRef = useRef<TextInput>(null);
  const monthInputRef = useRef<TextInput>(null);
  const yearInputRef = useRef<TextInput>(null);

  // Map to define input field order based on date format
  const formatMap = useMemo(
    () => ({
      'MM/DD/YYYY': ['month', 'day', 'year'] as DateField[],
      'DD/MM/YYYY': ['day', 'month', 'year'] as DateField[],
      'YYYY/MM/DD': ['year', 'month', 'day'] as DateField[],
    }),
    [],
  );

  // Store refs for easier navigation
  const fieldRefs = useMemo(
    () => ({
      day: dayInputRef,
      month: monthInputRef,
      year: yearInputRef,
    }),
    [],
  );

  // Map to define maxLength for each field
  const maxLengthMap = useMemo(
    () => ({
      day: 2,
      month: 2,
      year: 4,
    }),
    [],
  );

  // Initialize date parts from the provided value
  const [dateParts, setDateParts] = useState<DobDate>(() => {
    if (value) {
      const day = value.getDate().toString().padStart(2, '0');
      const month = (value.getMonth() + 1).toString().padStart(2, '0');
      const year = value.getFullYear().toString();
      return { day, month, year };
    }
    return { day: '', month: '', year: '' };
  });

  // Helper to get next field ref in the format order
  const getNextFieldRef = useCallback(
    (field: DateField): RefObject<TextInput> | undefined => {
      const currentIndex = formatMap[dateFormat].indexOf(field);
      const nextField =
        currentIndex < 2 ? formatMap[dateFormat][currentIndex + 1] : null;
      return nextField ? fieldRefs[nextField] : undefined;
    },
    [dateFormat, formatMap, fieldRefs],
  );

  // Handle changes in input fields and update dateParts
  const handleChange = useCallback(
    (field: DateField, value: string) => {
      const fieldMaxLength = maxLengthMap[field];
      if (value.length > fieldMaxLength) {
        value = value.slice(0, fieldMaxLength);
      }

      setDateParts((prev) => {
        const newDateParts = { ...prev, [field]: value };

        // When all fields have the required length, attempt to parse the date
        if (
          newDateParts.day.length === maxLengthMap['day'] &&
          newDateParts.month.length === maxLengthMap['month'] &&
          newDateParts.year.length === maxLengthMap['year']
        ) {
          const { day, month, year } = newDateParts;
          const parsedDate = new Date(
            Number(year),
            Number(month) - 1,
            Number(day),
          );

          if (
            parsedDate.getFullYear() === Number(year) &&
            parsedDate.getMonth() === Number(month) - 1 &&
            parsedDate.getDate() === Number(day)
          ) {
            onChange(parsedDate);
          } else {
            onChange(null);
          }
        } else {
          onChange(null);
        }

        // Move focus to the next field if necessary
        if (value.length === fieldMaxLength) {
          const nextField = getNextFieldRef(field);
          if (nextField) {
            nextField.current?.focus();
          } else {
            Keyboard.dismiss();
          }
        }

        return newDateParts;
      });
    },
    [onChange, getNextFieldRef, maxLengthMap],
  );

  // Handle key presses like backspace to clear fields and move focus
  const handleKeyPress = useCallback(
    (e: NativeSyntheticEvent<TextInputKeyPressEventData>, field: DateField) => {
      if (e.nativeEvent.key === 'Backspace' && dateParts[field].length === 0) {
        const prevFieldIndex = formatMap[dateFormat].indexOf(field) - 1;
        if (prevFieldIndex >= 0) {
          const prevField = formatMap[dateFormat][prevFieldIndex];
          fieldRefs[prevField]?.current?.focus();
        }
      }
    },
    [dateParts, dateFormat, formatMap, fieldRefs],
  );

  // Reset fields
  const resetFields = useCallback(() => {
    setDateParts({ day: '', month: '', year: '' });
    onChange(null);
    dayInputRef.current?.clear();
    monthInputRef.current?.clear();
    yearInputRef.current?.clear();
  }, [onChange]);

  return {
    dateParts,
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
