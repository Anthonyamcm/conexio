import React, { useCallback, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Footer, Screen } from '@/src/components/atoms';
import { Header, OneTimePasscode } from '@/src/components/molecules';
import { useRegistration } from '@/src/contexts/RegistrationContext';
import { colors, spacing } from '@/src/utils';
import { OneTimePasscodeHandle } from '@/src/components/molecules/OneTimePasscode/UseOneTimePasscode';
import { useConfrimUser } from '@/src/hooks/useConfirmUser';

interface FormValues {
  OTP: string;
}

const otpSchema = Yup.object().shape({
  OTP: Yup.string()
    .required('OTP is required')
    .length(6, 'OTP must be exactly 6 digits')
    .matches(/^\d+$/, 'OTP must be a number'),
});

export default function Otp() {
  const { state, handleSubmitStep } = useRegistration();
  const otpRef = useRef<OneTimePasscodeHandle>(null);

  const formik = useFormik<FormValues>({
    initialValues: { OTP: state.formData.code || '' },
    validationSchema: otpSchema,
    onSubmit: async (values: FormValues, { setSubmitting }) => {
      try {
        await handleSubmitStep(otpSchema, ['code'], { code: values.OTP });
        const identifier = state.formData.email
          ? state.formData.email
          : state.formData.mobile;

        const registrationData = {
          identifier: identifier!,
          code: values.OTP,
          password: state.formData.password,
          displayName: state.formData.name,
          username: state.formData.username,
          dob: state.formData.dob!,
        };
        mutation.mutate(registrationData);
      } catch (error) {
        formik.setStatus({
          formError: 'An unexpected error occurred. Please try again.',
        });
      } finally {
        setSubmitting(false);
      }
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  const mutation = useConfrimUser({
    onSuccess: (data) => {
      console.log('Confirmation successful:', data);
    },
    onError: (error) => {
      console.error('Registration error:', error);
      if (error.message) {
        formik.setErrors({ OTP: error.message });
      }
    },
  });

  // Memoized handlers to prevent unnecessary re-renders
  const handleContinuePress = useCallback(() => {
    formik.handleSubmit();
  }, [formik]);

  return (
    <Screen preset="auto" contentContainerStyle={styles.container}>
      <Header
        title="Enter the confirmation code"
        subtitle={`To confirm your account, enter the 6-digit code that we sent to ${
          state.formData.mobile || state.formData.email
        }`}
      />
      <View style={styles.formContainer}>
        <OneTimePasscode
          ref={otpRef}
          value={formik.values.OTP}
          onChange={(value) => formik.setFieldValue('OTP', value)}
          onBlur={() => formik.setFieldTouched('OTP', true)}
          error={formik.errors.OTP}
          touched={formik.touched.OTP}
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
        <Button preset="default" textStyle={{ fontWeight: '300' }}>
          Didn't receive code?
        </Button>
      </View>
      <Footer />
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
    gap: 15,
    flexDirection: 'column',
  },
});
