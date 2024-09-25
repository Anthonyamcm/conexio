import { View } from 'react-native';
import { Input, Text } from '../../atoms';
import { forwardRef, useImperativeHandle, useCallback, RefObject } from 'react';
import { colors, spacing } from '@/src/utlis';
import useDateOfBirthInput, {
  DateOfBirthInputReturnType,
} from './useDateOfBirthInput';
import { DateField } from '@/src/config';

interface DateOfBirthInputProps {
  setFieldValue: (field: string, value: string | Date) => void; // Change value type to string
  setFieldTouched: (field: string, isTouched: boolean) => void;
  setFieldError: (field: string, message: string | undefined) => void;
  touched: { day: boolean; month: boolean; year: boolean }; // Touch states for each field
  errors: { day?: string; month?: string; year?: string }; // Error messages for each field
  value: { day: string; month: string; year: string }; // Update value to an object with day, month, year
  dateFormat?: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY/MM/DD'; // Define valid date formats
}

export interface DateOfBirthInputHandle {
  reset: () => void;
}

const DateOfBirthInput = forwardRef<
  DateOfBirthInputHandle,
  DateOfBirthInputProps
>(
  (
    {
      setFieldValue,
      setFieldTouched,
      touched,
      errors,
      value,
      dateFormat = 'DD/MM/YYYY',
    },
    ref,
  ) => {
    const {
      date,
      handleChange,
      handleKeyPress,
      resetFields,
      isComplete,
      dayInputRef,
      monthInputRef,
      yearInputRef,
      formatMap,
    }: DateOfBirthInputReturnType = useDateOfBirthInput(
      setFieldValue,
      dateFormat,
    );

    // Memoized blur handler
    const handleBlur = useCallback(
      (field: DateField) => {
        setFieldTouched(`dob.${field}`, true);
      },
      [setFieldTouched],
    );

    const fieldRenderers: Record<DateField, JSX.Element> = {
      day: (
        <Input
          key={'Day'}
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
          error={touched.day && !!errors.day}
        />
      ),
      month: (
        <Input
          key={'Month'}
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
          error={touched.month && !!errors.month}
        />
      ),
      year: (
        <Input
          key={'Year'}
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
          error={touched.year && !!errors.year}
        />
      ),
    };

    // Render inputs in the correct order based on the format
    const inputs = formatMap[dateFormat].map((key) => fieldRenderers[key]);

    return (
      <View style={{ flexDirection: 'column' }}>
        <View
          style={{ flexDirection: 'row', gap: 15, alignItems: 'flex-start' }}
        >
          {inputs}
        </View>
        {(['day', 'month', 'year'] as DateField[]).map(
          (field) =>
            touched[field] &&
            errors?.[field] && (
              <Text
                key={field}
                preset="bold"
                style={{
                  color: colors.palette.error100,
                  marginTop: spacing.xs,
                }}
                text={errors[field]} // Use dynamic key for error message
              />
            ),
        )}
      </View>
    );
  },
);

export default DateOfBirthInput;
