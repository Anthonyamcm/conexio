import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { AsYouType } from 'libphonenumber-js';
import 'yup-phone-lite';
import { Button, Footer, Screen } from '@/src/components/atoms';
import { Header, MobileNumberInputField } from '@/src/components/molecules';
import { ICountryCode } from '@/src/config';
import { useRegistration } from '@/src/contexts/RegistrationContext';
import { colors, spacing, typography } from '@/src/utlis';
import { router } from 'expo-router';
import { CountryPicker } from 'react-native-country-codes-picker';

// Define the validation schema using Yup
const mobileSchema = (countryCode: string) =>
  Yup.object().shape({
    mobile: Yup.string()
      .phone(countryCode as any, 'Please enter a valid phone number')
      .required('Mobile number is required'),
  });

// Define types for Formik values and submit function
interface FormValues {
  mobile: string;
}

export default function Mobile() {
  const { state, setFormData, handleSubmitStep } = useRegistration();
  const mobileRef = useRef<TextInput>(null);
  const [show, setShow] = useState<boolean>(false);
  const [countryCode, setCountryCode] = useState<ICountryCode>({
    code: '+44',
    flag: '🇬🇧',
    country: 'GB',
  });

  const handleSubmit = useCallback(
    async (
      values: FormValues,
      { setSubmitting }: FormikHelpers<FormValues>,
    ) => {
      console.log({ values });
      setFormData(values);
      await handleSubmitStep(mobileSchema(countryCode.country), ['mobile']);
      setSubmitting(false);
    },
    [countryCode, setFormData, handleSubmitStep],
  );

  const handleCountryCodePress = useCallback(() => {
    mobileRef.current?.blur();
    setShow(true);
  }, []);

  const handleCountrySelect = useCallback((country: ICountryCode) => {
    setCountryCode(country);
    setShow(false);
  }, []);

  const formatPhoneNumber = useCallback(
    (value: string) => {
      if (value.includes('(') && !value.includes(')')) {
        return value.replace('(', '');
      }
      return new AsYouType(countryCode.country).input(value);
    },
    [countryCode],
  );

  const emailPressed = useCallback(() => {
    router.push('/(registration)/email');
  }, []);

  return (
    <Screen preset="auto" contentContainerStyle={styles.container}>
      <Header
        title="What's your mobile number?"
        subtitle="Enter the mobile number on which you can be contacted. No one will see this on your profile."
      />
      <Formik
        initialValues={{ mobile: state.formData.mobile || '' }}
        validationSchema={mobileSchema(countryCode.country)}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleSubmit,
          handleBlur,
          values,
          errors,
          touched,
          isValid,
          isSubmitting,
        }) => (
          <View style={styles.formContainer}>
            <MobileNumberInputField
              countryCode={countryCode}
              onCountryCodePress={handleCountryCodePress}
              value={values.mobile}
              onChangeText={(text) => {
                const formattedNumber = formatPhoneNumber(text);
                handleChange('mobile')(formattedNumber);
                setFormData({
                  ...values,
                  mobile: formattedNumber,
                });
              }}
              containerStyle={{ flex: 1 }}
              onBlur={handleBlur('mobile')}
              ref={mobileRef}
              showError={!!errors.mobile && touched.mobile}
              accessibilityLabel="Mobile number input"
              errorText={errors.mobile}
              touched={touched as { mobile: boolean }}
            />
            <Button
              preset="gradient"
              gradient={[
                colors.palette.primary100,
                colors.palette.secondary100,
              ]}
              onPress={() => handleSubmit()}
              disabled={!isValid || isSubmitting}
              isLoading={isSubmitting}
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
        )}
      </Formik>
      <Footer />
      <CountryPicker
        lang="en"
        show={show}
        onBackdropPress={() => setShow(false)}
        style={countryPickerStyles}
        pickerButtonOnPress={(item) => {
          handleCountrySelect({
            code: item.dial_code,
            flag: item.flag,
            country: item.code,
          });
          setShow(false);
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
