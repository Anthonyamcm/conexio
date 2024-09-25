import { View } from 'react-native';
import { Input, Text } from '../../atoms';
import {
  forwardRef,
  useImperativeHandle,
  useCallback,
  RefObject,
  useMemo,
} from 'react';
import { colors, spacing } from '@/src/utlis';
import useDateOfBirthInput, {
  DateOfBirthInputReturnType,
} from './useDateOfBirthInput';
import { DateField } from '@/src/config';

// Props interface for DateOfBirthInput
interface DateOfBirthInputProps {
  setFieldValue: (field: string, value: string | Date) => void;
  setFieldTouched: (field: string, isTouched: boolean) => void;
  setFieldError: (field: string, message: string | undefined) => void;
  touched: { day: boolean; month: boolean; year: boolean };
  errors: { day?: string; month?: string; year?: string };
  value: { day: string; month: string; year: string };
  dateFormat?: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY/MM/DD';
}

// Handle interface to expose reset method
export interface DateOfBirthInputHandle {
  reset: () => void;
}

// Main component definition
const DateOfBirthInput = forwardRef<
  DateOfBirthInputHandle,
  DateOfBirthInputProps
>(
  (
    {
      setFieldValue,
      setFieldTouched,
      setFieldError,
      touched,
      errors,
      value,
      dateFormat = 'MM/DD/YYYY',
    },
    ref,
  ) => {
    // Use the custom hook to manage date inputs
    const {
      date,
      handleChange,
      handleKeyPress,
      dayInputRef,
      monthInputRef,
      yearInputRef,
      formatMap,
    }: DateOfBirthInputReturnType = useDateOfBirthInput(
      setFieldValue,
      setFieldError,
      dateFormat,
    );

    // Expose a reset method via the ref using useImperativeHandle
    useImperativeHandle(ref, () => ({
      reset: () => {
        setFieldValue('dob', new Date());
        setFieldTouched('dob.day', false);
        setFieldTouched('dob.month', false);
        setFieldTouched('dob.year', false);
      },
    }));

    // Memoized blur handler to update the touched state
    const handleBlur = useCallback(
      (field: DateField) => setFieldTouched(`dob.${field}`, true),
      [setFieldTouched],
    );

    // Field renderer for day, month, and year inputs
    const dayInput = useMemo(
      () => (
        <Input
          key="Day"
          placeholder="DD"
          containerStyle={{ flex: 1 }}
          style={{ textAlign: 'center' }}
          keyboardType="number-pad"
          maxLength={2}
          ref={dayInputRef}
          onChangeText={(text) => handleChange('day', text)}
          onKeyPress={(e) => handleKeyPress(e, 'day')}
          onBlur={() => handleBlur('day')}
          value={date.day}
          error={!!(touched.day && errors.day)}
        />
      ),
      [
        date.day,
        errors.day,
        touched.day,
        handleChange,
        handleBlur,
        handleKeyPress,
      ],
    );

    const monthInput = useMemo(
      () => (
        <Input
          key="Month"
          placeholder="MM"
          containerStyle={{ flex: 1 }}
          style={{ textAlign: 'center' }}
          keyboardType="number-pad"
          maxLength={2}
          ref={monthInputRef}
          onChangeText={(text) => handleChange('month', text)}
          onKeyPress={(e) => handleKeyPress(e, 'month')}
          onBlur={() => handleBlur('month')}
          value={date.month}
          error={!!(touched.month && errors.month)}
        />
      ),
      [
        date.month,
        errors.month,
        touched.month,
        handleChange,
        handleBlur,
        handleKeyPress,
      ],
    );

    const yearInput = useMemo(
      () => (
        <Input
          key="Year"
          placeholder="YYYY"
          containerStyle={{ flex: 1 }}
          style={{ textAlign: 'center' }}
          keyboardType="number-pad"
          maxLength={4}
          ref={yearInputRef}
          onChangeText={(text) => handleChange('year', text)}
          onKeyPress={(e) => handleKeyPress(e, 'year')}
          onBlur={() => handleBlur('year')}
          value={date.year}
          error={!!(touched.year && errors.year)}
        />
      ),
      [
        date.year,
        errors.year,
        touched.year,
        handleChange,
        handleBlur,
        handleKeyPress,
      ],
    );

    // Render inputs based on the date format order
    const inputs = useMemo(
      () =>
        formatMap[dateFormat].map((key) => {
          switch (key) {
            case 'day':
              return dayInput;
            case 'month':
              return monthInput;
            case 'year':
              return yearInput;
            default:
              return null;
          }
        }),
      [formatMap, dateFormat, dayInput, monthInput, yearInput],
    );

    const errorMessages = useMemo(
      () =>
        ['day', 'month', 'year'].map(
          (field) =>
            touched[field as DateField] &&
            errors[field as DateField] && (
              <Text
                key={field}
                preset="bold"
                style={{
                  color: colors.palette.error100,
                  marginTop: spacing.xs,
                }}
                text={errors[field as DateField]} // Use dynamic key for error message
              />
            ),
        ),
      [touched, errors],
    );

    return (
      <View style={{ flexDirection: 'column' }}>
        <View
          style={{ flexDirection: 'row', gap: 15, alignItems: 'flex-start' }}
        >
          {inputs}
        </View>
        {errorMessages}
      </View>
    );
  },
);

export default DateOfBirthInput;
