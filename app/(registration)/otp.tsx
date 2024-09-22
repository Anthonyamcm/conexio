import { Button, Footer, Screen, View } from '@/src/components/atoms';
import { Header, OneTimePasscode } from '@/src/components/molecules';
import { useRegistration } from '@/src/contexts/RegistrationContext';
import { colors, spacing } from '@/src/utlis';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';

const otpSchema = Yup.object().shape({
  otp: Yup.string()
    .required('OTP is required')
    .length(6, 'OTP must be exactly 6 digits')
    .matches(/^\d+$/, 'OTP must be a number'),
});

interface OtpValues {
  otp: string;
}

export default function Otp() {
  const { state, setFormData, handleSubmitStep } = useRegistration();

  const handleSubmit = async (
    values: OtpValues,
    { setSubmitting, setErrors }: FormikHelpers<OtpValues>,
  ) => {
    const otp = values.otp;

    // Check if OTP is valid
    if (!otp || otp.length < 6) {
      setErrors({ otp: 'Please enter a valid OTP.' });
      setSubmitting(false);
      return;
    }

    setFormData(values);
    await handleSubmitStep(otpSchema, ['otp']);
    setSubmitting(false);
  };

  return (
    <Screen
      preset="auto"
      contentContainerStyle={{
        flex: 1,
        padding: spacing.lg,
      }}
    >
      <Header
        title={`Enter the confirmation code`}
        subtitle={`To confirm your account, enter the 6-digit code that we sent to ${state.formData.mobile}`}
      />
      <Formik
        initialValues={{ otp: state.formData.otp || '' }}
        validationSchema={otpSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleSubmit,
          errors,
          values,
          touched,
          isValid,
          setFieldValue,
          setFieldTouched,
        }) => (
          <View preset={'column'} style={{ flex: 1 }}>
            <OneTimePasscode
              value={values.otp}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              touched={touched as { otp: boolean }}
              error={errors.otp as string}
            />
            <Button
              preset={'gradient'}
              gradient={[
                colors.palette.primary100,
                colors.palette.secondary100,
              ]}
              onPress={() => handleSubmit()}
              disabled={!isValid} // Disable if form is not valid
              isLoading={false}
            >
              {'Continue'}
            </Button>
          </View>
        )}
      </Formik>
      <Footer />
    </Screen>
  );
}
