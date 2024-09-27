import React, { forwardRef } from 'react';
import { View } from 'react-native';
import { Input, Text } from '../../atoms';
import { colors, spacing } from '@/src/utlis';
import useOneTimePasscode from './UseOneTimePasscode';

interface OneTimePasscodeHandle {
  reset: () => void;
}

interface OneTimePasscodeProps {
  setFieldValue: (field: string, value: string) => void;
  setFieldTouched: (field: string, isTouched: boolean) => void;
  touched: { OTP?: boolean };
  error?: string;
  value: string;
}

const OneTimePasscode = forwardRef<OneTimePasscodeHandle, OneTimePasscodeProps>(
  ({ setFieldValue, setFieldTouched, touched, error }) => {
    const { inputRefs, inputs, handleInputChange, handleKeyPress } =
      useOneTimePasscode(setFieldValue, setFieldTouched);

    return (
      <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <View
          style={{ flexDirection: 'row', gap: 15, alignItems: 'flex-start' }}
        >
          {inputs.map((char, index) => (
            <Input
              key={index}
              placeholder="0"
              containerStyle={{ flex: 1 }}
              style={{ textAlign: 'center' }}
              keyboardType="number-pad"
              maxLength={1}
              ref={(el) => (inputRefs.current[index] = el)}
              onChangeText={(text) => handleInputChange(index, text)}
              onKeyPress={(e) => handleKeyPress(index, e)}
              value={char} // Ensure this uses the correct character
              error={!!error && touched.OTP}
            />
          ))}
        </View>
        {error && touched.OTP && (
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

export default OneTimePasscode;
