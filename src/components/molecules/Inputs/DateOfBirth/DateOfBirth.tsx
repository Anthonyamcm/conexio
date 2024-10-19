import React, {
  forwardRef,
  useImperativeHandle,
  memo,
  useCallback,
} from 'react';
import { View } from 'react-native';
import { Input, Text } from '../../../atoms';
import { colors, spacing } from '@/src/utils';
import useDateOfBirthInput, {
  DateOfBirthInputReturnType,
} from './useDateOfBirthInput';

interface DateOfBirthInputProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  error?: string;
  touched?: boolean;
  dateFormat?: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY/MM/DD';
  onBlur?: () => void; // Add onBlur prop
}

export interface DateOfBirthInputHandle {
  reset: () => void;
}

const DateOfBirth = memo(
  forwardRef<DateOfBirthInputHandle, DateOfBirthInputProps>(
    (
      { value, onChange, error, touched, dateFormat = 'DD/MM/YYYY', onBlur },
      ref,
    ) => {
      const {
        dateParts,
        handleChange,
        handleKeyPress,
        dayInputRef,
        monthInputRef,
        yearInputRef,
        formatMap,
        resetFields,
      }: DateOfBirthInputReturnType = useDateOfBirthInput(
        value,
        onChange,
        dateFormat,
      );
      const lastField = formatMap[dateFormat][formatMap[dateFormat].length - 1];

      // Expose a reset method via the ref using useImperativeHandle
      useImperativeHandle(
        ref,
        () => ({
          reset: resetFields,
        }),
        [resetFields],
      );

      // Handle onBlur event
      const handleInputBlur = useCallback(() => {
        if (onBlur) {
          onBlur();
        }
      }, [onBlur]);

      // Map to render date input fields based on the date format
      const inputs = formatMap[dateFormat].map((field) => {
        const props = {
          day: {
            placeholder: 'DD',
            maxLength: 2,
            inputRef: dayInputRef,
            value: dateParts.day,
          },
          month: {
            placeholder: 'MM',
            maxLength: 2,
            inputRef: monthInputRef,
            value: dateParts.month,
          },
          year: {
            placeholder: 'YYYY',
            maxLength: 4,
            inputRef: yearInputRef,
            value: dateParts.year,
          },
        }[field];

        return (
          <Input
            key={field}
            placeholder={props.placeholder}
            containerStyle={{ flex: 1 }}
            style={{ textAlign: 'center' }}
            keyboardType="number-pad"
            maxLength={props.maxLength}
            ref={props.inputRef}
            onChangeText={(text) => handleChange(field, text)}
            onKeyPress={(e) => handleKeyPress(e, field)}
            value={props.value}
            error={touched && !!error}
            onBlur={field === lastField ? handleInputBlur : undefined}
          />
        );
      });

      return (
        <View style={{ flexDirection: 'column' }}>
          <View style={{ flexDirection: 'row', gap: 15 }}>{inputs}</View>
          {touched && error ? (
            <Text
              preset="bold"
              style={{
                color: colors.palette.error100,
                marginTop: spacing.xs,
              }}
              text={error}
            />
          ) : null}
        </View>
      );
    },
  ),
);

export default DateOfBirth;
