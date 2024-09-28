import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AsYouType, parsePhoneNumber } from 'libphonenumber-js';
import 'yup-phone-lite';
import { Button, Footer, Screen } from '@/src/components/atoms';
import { Header, MobileNumberInputField } from '@/src/components/molecules';
import { ICountryCode } from '@/src/config';
import { useRegistration } from '@/src/contexts/RegistrationContext';
import { colors, spacing, typography } from '@/src/utils';
import { useRouter } from 'expo-router';
import { CountryPicker } from 'react-native-country-codes-picker';
import { CountryCode } from 'libphonenumber-js/types';

interface FormValues {
  mobile: string;
}

// Define the validation schema factory using Yup
const createMobileSchema = (countryCode: string) =>
  Yup.object().shape({
    mobile: Yup.string()
      .phone(countryCode as any, 'Please enter a valid phone number')
      .required('Mobile number is required'),
  });

export default function Mobile() {
  const { state, handleSubmitStep } = useRegistration();
  const mobileRef = useRef<TextInput>(null);
  const [showCountryPicker, setShowCountryPicker] = useState<boolean>(false);
  const [countryCode, setCountryCode] = useState<ICountryCode>({
    code: '+44',
    flag: '🇬🇧',
    country: 'GB',
  });
  const router = useRouter();

  // Formik usage
  const formik = useFormik<FormValues>({
    initialValues: { mobile: state.formData.mobile || '' },
    validationSchema: createMobileSchema(countryCode.country),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const phoneNumber = parsePhoneNumber(countryCode.code + values.mobile);
        await handleSubmitStep(
          createMobileSchema(countryCode.country),
          ['mobile'],
          {
            ...values,
            mobile: phoneNumber.number,
          },
        );
      } catch (error) {
        console.error('Error submitting mobile number:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Handle country code picker visibility
  const handleCountryCodePress = useCallback(() => {
    mobileRef.current?.blur();
    setShowCountryPicker(true);
  }, []);

  const handleCountrySelect = useCallback(
    (country: ICountryCode) => {
      setCountryCode(country);
      setShowCountryPicker(false);
      // Re-validate the mobile number with the new country code
      formik.validateField('mobile');
    },
    [formik],
  );

  // Format phone number as user types
  const formatPhoneNumber = useCallback(
    (value: string) => {
      if (value.includes('(') && !value.includes(')')) {
        return value.replace('(', '');
      }
      return new AsYouType(countryCode.country as CountryCode).input(value);
    },
    [countryCode.country],
  );

  const handleMobileChange = useCallback(
    (text: string) => {
      const formattedNumber = formatPhoneNumber(text);
      formik.setFieldValue('mobile', formattedNumber);
    },
    [formatPhoneNumber, formik],
  );

  const emailPressed = useCallback(() => {
    router.push('/(registration)/email');
  }, [router]);

  const handleContinuePress = useCallback(() => {
    formik.handleSubmit();
  }, [formik]);

  return (
    <Screen preset="auto" contentContainerStyle={styles.container}>
      <Header
        title="What's your mobile number?"
        subtitle="Enter the mobile number on which you can be contacted. No one will see this on your profile."
      />
      <View style={styles.formContainer}>
        <MobileNumberInputField
          ref={mobileRef}
          countryCode={countryCode}
          onCountryCodePress={handleCountryCodePress}
          value={formik.values.mobile}
          onChangeText={(text) => handleMobileChange(text)}
          onBlur={formik.handleBlur('mobile')}
          error={formik.errors.mobile}
          touched={formik.touched.mobile}
          placeholder="Mobile number"
          accessibilityLabel="Mobile number input"
        />
        <Button
          preset="gradient"
          gradient={[colors.palette.primary100, colors.palette.secondary100]}
          onPress={handleContinuePress}
          disabled={!formik.isValid || formik.isSubmitting}
          isLoading={formik.isSubmitting}
        >
          Continue
        </Button>
        <Button
          preset="default"
          textStyle={{ fontWeight: '300' }}
          onPress={emailPressed}
        >
          Sign up with email
        </Button>
      </View>
      <Footer />
      <CountryPicker
        lang="en"
        show={showCountryPicker}
        onBackdropPress={() => setShowCountryPicker(false)}
        style={countryPickerStyles}
        pickerButtonOnPress={(item) => {
          handleCountrySelect({
            code: item.dial_code,
            flag: item.flag,
            country: item.code as CountryCode,
          });
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  formContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 15,
    marginTop: spacing.md,
  },
});

const countryPickerStyles = StyleSheet.create({
  modal: {
    height: 700,
  },
  line: {
    opacity: 0,
  },
  textInput: {
    padding: spacing.md,
    height: 52,
    backgroundColor: colors.palette.neutral200,
    fontFamily: typography.primary.medium,
  },
  countryButtonStyles: {
    height: 52,
    backgroundColor: colors.palette.neutral200,
    marginBottom: spacing.xs,
  },
  dialCode: {
    fontFamily: typography.primary.medium,
  },
  countryName: { fontFamily: typography.primary.medium },
});
