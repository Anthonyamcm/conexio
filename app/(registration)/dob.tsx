import { Button, Footer, Screen, Text, View } from '@/src/components/atoms';
import { DateOfBirthInput, Header } from '@/src/components/molecules';
import { useRegistration } from '@/src/contexts/RegistrationContext';
import { colors, spacing } from '@/src/utlis';
import { Formik } from 'formik';
import { useCallback } from 'react';
import * as yup from 'yup';

const dobSchema = yup.object().shape({
  dob: yup.object().shape({
    day: yup
      .number()
      .required('Day is required')
      .min(1, 'Invalid day')
      .max(31, 'Invalid day'),
    month: yup
      .number()
      .required('Month is required')
      .min(1, 'Invalid month')
      .max(12, 'Invalid month'),
    year: yup
      .number()
      .required('Year is required')
      .min(1900, 'Year is too early')
      .max(new Date().getFullYear(), 'Year is too far in the future'),
  }),
});

export default function Dob() {
  const { state, setFormData, handleSubmitStep } = useRegistration();

  const handleSubmit = useCallback(
    async (
      values: { dob: { day: string; month: string; year: string } },
      { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
    ) => {
      const dateString = `${values.dob.year}-${values.dob.month}-${values.dob.day}`;
      const parsedDate = new Date(dateString);
      setFormData({ dob: parsedDate });
      await handleSubmitStep(dobSchema, ['dob']);
      setSubmitting(false);
    },
    [setFormData, handleSubmitStep],
  );

  return (
    <Screen
      preset="auto"
      contentContainerStyle={{
        flex: 1,
        padding: spacing.lg,
      }}
    >
      <Header
        title={`What's your date of birth?`}
        subtitle={`Enter your date of birth (you must be 16+). This won't appear on your profile.`}
      />
      <Formik
        initialValues={{
          dob: { day: '', month: '', year: '' },
        }}
        validationSchema={dobSchema}
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
          setFieldError,
        }) => (
          <View preset={'column'} style={{ flex: 1 }}>
            <DateOfBirthInput
              value={values.dob}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              setFieldError={setFieldError}
              touched={{
                day: touched.dob?.day || false,
                month: touched.dob?.month || false,
                year: touched.dob?.year || false,
              }}
              errors={{
                day: errors.dob?.day,
                month: errors.dob?.month,
                year: errors.dob?.year,
              }}
            />
            <Button
              preset={'gradient'}
              gradient={[
                colors.palette.primary100,
                colors.palette.secondary100,
              ]}
              onPress={() => handleSubmit()}
              disabled={!isValid}
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
