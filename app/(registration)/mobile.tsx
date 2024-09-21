import { Button, Footer, Input, Screen, Text } from '@/src/components/atoms';
import { Header, MobileNumberInputField } from '@/src/components/molecules';
import { ICountryCode } from '@/src/config';
import { useRegistration } from '@/src/contexts/RegistrationContext';
import { colors, spacing, typography } from '@/src/utlis';
import { router } from 'expo-router';
import { Formik } from 'formik';
import { useCallback, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { CountryPicker } from 'react-native-country-codes-picker';
import * as Yup from 'yup';
import { AsYouType } from 'libphonenumber-js';
import 'yup-phone-lite';

// Define the validation schema using Yup
const mobileSchema = (countryCode: string) =>
  Yup.object().shape({
    mobile: Yup.string()
      .phone(countryCode as any, 'Please enter a valid phone number')
      .required('Mobile number is required'),
  });

export default function Mobile() {
  const { state, setFormData, handleSubmitStep } = useRegistration();
  const mobileRef = useRef<TextInput>(null);
  const [show, setShow] = useState<boolean>(false);
  const [countryCode, setCountryCode] = useState<ICountryCode>({
    code: '+44',
    flag: '🇬🇧',
    country: 'GB',
  });

  const handleSubmit = async (
    values: { mobile: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    setFormData(values);
    await handleSubmitStep(mobileSchema(countryCode.country), ['mobile']);
    setSubmitting(false);
  };

  const handleCountryCodePress = useCallback(() => {
    mobileRef.current?.blur();
    setShow(true);
  }, []);

  const handleCountrySelect = useCallback((country: ICountryCode) => {
    setCountryCode(country);
    setShow(false);
  }, []);

  const emailPressed = () => {
    router.push('/(registration)/email');
  };

  return (
    <Screen preset="auto" contentContainerStyle={styles.container}>
      <Header
        title="What's your mobile number?"
        subtitle="Enter the mobile number on which you can be contacted. No one will see this on your profile."
      />
      <Formik
        initialValues={{
          mobile: state.formData.mobile || '',
        }}
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
                const formattedNumber = new AsYouType(
                  countryCode.country,
                ).input(text);
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
              disabled={!isValid}
              isLoading={isSubmitting}
            >
              Continue
            </Button>
            <Button
              preset="default"
              textStyle={{ fontWeight: '300' }}
              onPress={emailPressed}
            >
              {'Sign up with email'}
            </Button>
          </View>
        )}
      </Formik>
      <Footer />
      <CountryPicker
        lang={'en'}
        show={show}
        onBackdropPress={() => setShow(false)}
        style={{
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
        }}
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
    gap: 15, // Use a space unit consistent with your design system if necessary
  },
});
