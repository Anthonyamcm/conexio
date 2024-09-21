import { colors, spacing } from '@/src/utlis';
import { forwardRef, memo } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Input, Text } from '../../atoms';
import { InputProps } from '../../atoms/Input';
import { ICountryCode } from '@/src/config';

interface CustomInputWithCountryCodeProps extends InputProps {
  countryCode: ICountryCode; // Change to an object if needed
  onCountryCodePress: () => void;
  showError: boolean | undefined;
  errorText: string | undefined;
  touched: { mobile?: boolean };
}

const MobileNumberInputField = memo(
  forwardRef<TextInput, CustomInputWithCountryCodeProps>(
    (
      {
        countryCode,
        onCountryCodePress,
        showError,
        errorText,
        touched,
        ...inputProps
      },
      ref,
    ) => (
      <View style={{ flexDirection: 'column' }}>
        <View
          style={[
            styles.inputContainer,
            {
              borderColor: showError
                ? colors.palette.error100
                : colors.palette.neutral200,
              borderWidth: 3,
            },
          ]}
        >
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
          <View
            style={{
              width: 3,
              backgroundColor: colors.palette.neutral300,
              borderRadius: 12,
              paddingVertical: 15,
            }}
          />
          <Input
            ref={ref} // Pass ref to the Input component
            placeholder="Mobile number"
            keyboardType="number-pad"
            {...inputProps} // Spread remaining props
          />
        </View>
        {errorText && touched.mobile && (
          <Text
            preset="bold"
            style={{ color: colors.palette.error100, marginTop: spacing.xs }}
            text={errorText}
          />
        )}
      </View>
    ),
  ),
);

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    maxHeight: 54,
    backgroundColor: colors.palette.neutral200,
  },
  errorText: {
    color: colors.palette.error100,
    marginTop: 5,
    fontWeight: '500',
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginStart: 12,
  },
  countryCodeText: {
    textAlign: 'center',
    fontSize: 16,
    marginRight: 12,
  },
});

export default MobileNumberInputField;
