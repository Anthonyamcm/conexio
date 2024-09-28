import { Button, Footer, Screen, View } from '@/src/components/atoms';
import { Header, OneTimePasscode } from '@/src/components/molecules';
import { useRegistration, FormData } from '@/src/contexts/RegistrationContext';
import { colors, spacing } from '@/src/utils';
import { useFormik } from 'formik';
import { useCallback, useRef } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import * as Yup from 'yup';

// Define validation schema using Yup
const otpSchema = Yup.object().shape({
  OTP: Yup.string()
    .required('OTP is required')
    .length(6, 'OTP must be exactly 6 digits')
    .matches(/^\d+$/, 'OTP must be a number'),
});

interface FormValues {
  OTP: string;
}

export default function Otp() {
  const { state, handleSubmitStep } = useRegistration();
  const otpRef = useRef<TextInput>(null);
  // Handle OTP submission
  const handleSubmit = useCallback(
    async (values: FormValues) => {
      await handleSubmitStep(otpSchema, ['OTP'], {
        ...values,
        OTP: values.OTP,
      }); // Proceed to next step after validation
    },
    [handleSubmitStep],
  );

  // Formik hook for managing form state
  const formik = useFormik<FormValues>({
    initialValues: { OTP: state.formData.OTP },
    validationSchema: otpSchema,
    onSubmit: handleSubmit,
  });

  return (
    <Screen
      preset="auto"
      contentContainerStyle={{
        flex: 1,
        padding: spacing.lg,
      }}
    >
      <Header
        title="Enter the confirmation code"
        subtitle={`To confirm your account, enter the 6-digit code that we sent to ${
          state.formData.mobile || state.formData.email
        }`}
      />
      <View preset={'column'} style={{ flex: 1, gap: 15 }}>
        <OneTimePasscode
          value={formik.values.OTP}
          setFieldValue={formik.setFieldValue}
          setFieldTouched={formik.setFieldTouched}
          touched={formik.touched as { OTP: boolean }}
          error={formik.errors.OTP as string}
        />
        <Button
          preset="gradient"
          gradient={[colors.palette.primary100, colors.palette.secondary100]}
          onPress={() => formik.handleSubmit()}
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
