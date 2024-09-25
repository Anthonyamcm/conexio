import { TextInput, View } from 'react-native';
import { Input, Text } from '../../atoms';
import { forwardRef, useImperativeHandle, useCallback, RefObject } from 'react';
import { colors, spacing } from '@/src/utlis';
import useDateOfBirthInput, {
  DateOfBirthInputReturnType,
} from './useDateOfBirthInput';

interface DateOfBirthInputProps {
  setFieldValue: (field: string, value: Date | null) => void;
  setFieldTouched: (field: string, isTouched: boolean) => void;
  touched: { dob?: boolean };
  error?: string;
  value: Date | null;
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
      error,
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
      value,
      dateFormat,
    );

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

    const fieldRenderers: Record<'day' | 'month' | 'year', JSX.Element> = {
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
          onBlur={handleBlur}
          value={date.day}
          error={!!error && touched.dob}
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
          onBlur={handleBlur}
          value={date.month}
          error={!!error && touched.dob}
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
          onBlur={handleBlur}
          value={date.year}
          error={!!error && touched.dob}
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
        {touched.dob && error && isComplete && (
          <Text
            preset="bold"
            style={{ color: colors.palette.error100, marginTop: spacing.xs }}
            text={error}
          />
        )}
      </View>
    );
  },
);

export default DateOfBirthInput;
