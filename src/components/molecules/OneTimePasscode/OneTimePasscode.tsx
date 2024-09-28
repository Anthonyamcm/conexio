import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
} from 'react';
import { View, TextInput } from 'react-native';
import { Input, Text } from '../../atoms';
import { colors, spacing } from '@/src/utils';
import useOneTimePasscode, {
  OneTimePasscodeHandle,
} from './UseOneTimePasscode';

interface OneTimePasscodeProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  touched?: boolean;
  onBlur?: () => void;
}

const OneTimePasscode = memo(
  forwardRef<OneTimePasscodeHandle, OneTimePasscodeProps>(
    ({ value, onChange, error, touched, onBlur }, ref) => {
      const {
        inputRefs,
        codeDigits,
        handleChange,
        handleKeyPress,
        resetFields,
      } = useOneTimePasscode(value, onChange);

      useImperativeHandle(
        ref,
        () => ({
          reset: resetFields,
        }),
        [resetFields],
      );

      return (
        <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <View
            style={{ flexDirection: 'row', gap: 15, alignItems: 'flex-start' }}
          >
            {codeDigits.map((digit, index) => (
              <Input
                key={index}
                placeholder="0"
                containerStyle={{ flex: 1 }}
                style={{ textAlign: 'center' }}
                keyboardType="number-pad"
                maxLength={1}
                ref={(el) => (inputRefs.current[index] = el)}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                value={digit}
                error={!!error && touched}
                onBlur={index === codeDigits.length - 1 ? onBlur : undefined}
              />
            ))}
          </View>
          {error && touched && (
            <Text
              preset="bold"
              style={{ color: colors.palette.error100, marginTop: spacing.xs }}
              text={error}
            />
          )}
        </View>
      );
    },
  ),
);

export default OneTimePasscode;
