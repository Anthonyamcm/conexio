import React, { forwardRef, memo, useMemo } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Input, Text } from '../../atoms';
import { colors, spacing } from '@/src/utils';
import { ICountryCode } from '@/src/config';
import { InputProps } from '../../atoms/Input';

interface MobileNumberInputFieldProps extends Omit<InputProps, 'error'> {
  countryCode: ICountryCode;
  onCountryCodePress: () => void;
  error?: string;
  touched?: boolean;
}

const MobileNumberInputField = memo(
  forwardRef<TextInput, MobileNumberInputFieldProps>(
    (
      {
        countryCode,
        onCountryCodePress,
        error,
        errorText,
        touched,
        style,
        ...inputProps
      },
      ref,
    ) => {
      // Memoize styles based on error state to avoid unnecessary re-renders
      const containerStyle = useMemo(
        () => [
          styles.inputContainer,
          {
            borderColor:
              error && touched
                ? colors.palette.error100
                : colors.palette.neutral200,
            borderWidth: 3,
          },
        ],
        [error, touched],
      );

      const dividerStyle = useMemo(
        () => ({
          width: 3,
          backgroundColor: colors.palette.neutral300,
          borderRadius: 12,
          paddingVertical: 15,
        }),
        [],
      );

      return (
        <View style={styles.wrapper}>
          <View style={containerStyle}>
            <TouchableOpacity
              style={styles.countryCodeContainer}
              onPress={onCountryCodePress}
            >
              <Text preset="bold" style={styles.countryCodeText}>
                {countryCode.flag}
              </Text>
              <Text preset="bold" style={styles.countryCodeText}>
                {countryCode.code}
              </Text>
            </TouchableOpacity>
            <View style={dividerStyle} />
            <Input
              ref={ref}
              placeholder="Mobile number"
              keyboardType="number-pad"
              style={[styles.input, style]}
              {...inputProps}
            />
          </View>
          {error && touched && (
            <Text preset="bold" style={styles.errorText} text={error} />
          )}
        </View>
      );
    },
  ),
);

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    maxHeight: 60,
    backgroundColor: colors.palette.neutral200,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginStart: 12,
  },
  countryCodeText: {
    textAlign: 'center',
    fontSize: 16,
    marginRight: 12,
  },
  input: {
    flex: 1,
  },
  errorText: {
    color: colors.palette.error100,
    marginTop: spacing.xs,
  },
});

export default MobileNumberInputField;
