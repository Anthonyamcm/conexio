import { Text, View } from 'react-native';
import { Input } from '../atoms';
import { forwardRef, useImperativeHandle, useRef, useCallback } from 'react';
import useDateOfBirthInput, {
  DateOfBirthInputReturnType,
} from '@/src/hooks/componentHooks/useDateOfBirthInput';

interface DateOfBirthInputProps {
  setFieldValue: (field: string, value: Date | null) => void;
  setFieldTouched: (field: string, isTouched: boolean) => void;
  touched: { dob?: boolean };
  error?: string;
  value: Date | null;
}

export interface DateOfBirthInputHandle {
  reset: () => void;
}

const DateOfBirthInput = forwardRef<
  DateOfBirthInputHandle,
  DateOfBirthInputProps
>(({ setFieldValue, setFieldTouched, touched, error, value }, ref) => {
  const {
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
  }: DateOfBirthInputReturnType = useDateOfBirthInput(setFieldValue, value);

  // Imperative handle for external components to reset input
  useImperativeHandle(ref, () => ({
    reset() {
      resetFields();
      setFieldValue('dob', null);
      dayInputRef.current?.focus();
    },
  }));

  // Memoized blur handler
  const handleBlur = useCallback(() => {
    setFieldTouched('dob', true);
  }, [setFieldTouched]);

  return (
    <>
      <View style={{ flexDirection: 'row', gap: 15, alignItems: 'flex-start' }}>
        <Input
          placeholder="DD"
          containerStyle={{ flex: 1 }}
          style={{ textAlign: 'center' }}
          keyboardType="number-pad"
          maxLength={2}
          ref={dayInputRef}
          onChangeText={handleDayChange}
          onKeyPress={(e) => handleKeyPress(e, date.day, undefined)}
          onBlur={handleBlur}
          value={date.day}
          error={!!error && touched.dob && isComplete}
        />
        <Input
          placeholder="MM"
          containerStyle={{ flex: 1 }}
          style={{ textAlign: 'center' }}
          keyboardType="number-pad"
          maxLength={2}
          ref={monthInputRef}
          onChangeText={handleMonthChange}
          onKeyPress={(e) => handleKeyPress(e, date.month, dayInputRef)}
          onBlur={handleBlur}
          value={date.month}
          error={!!error && touched.dob && isComplete}
        />
        <Input
          placeholder="YYYY"
          containerStyle={{ flex: 1 }}
          style={{ textAlign: 'center' }}
          keyboardType="number-pad"
          maxLength={4}
          ref={yearInputRef}
          onChangeText={handleYearChange}
          onKeyPress={(e) => handleKeyPress(e, date.year, monthInputRef)}
          onBlur={handleBlur}
          value={date.year}
          error={!!error && touched.dob && isComplete}
        />
      </View>
      {touched.dob && error && isComplete && (
        <Text style={{ color: 'red', marginTop: 5 }}>{error}</Text>
      )}
    </>
  );
});

export default DateOfBirthInput;
