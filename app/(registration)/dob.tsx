import { Button, Footer, Screen, Text, View } from '@/src/components/atoms';
import { DateOfBirthInput, Header } from '@/src/components/molecules';
import { useRegistration } from '@/src/contexts/RegistrationContext';
import { colors, spacing } from '@/src/utlis';
import { router } from 'expo-router';
import { Formik } from 'formik';
import * as yup from 'yup';

const dobSchema = yup.object().shape({
  dob: yup
    .date()
    .required('Date of birth is required')
    .test('is-valid-date', 'Invalid date', (value) => {
      if (!value) return false;

      const today = new Date();
      const minDate = new Date(
        today.getFullYear() - 100,
        today.getMonth(),
        today.getDate(),
      );
      const maxDate = new Date(
        today.getFullYear() - 16,
        today.getMonth(),
        today.getDate(),
      );

      // Ensure the date is within the realistic range
      return value <= maxDate && value >= minDate;
    })
    .test('is-at-least-16', 'You must be at least 16 years old', (value) => {
      if (!value) return false;

      const today = new Date();
      const minAgeDate = new Date(
        today.getFullYear() - 16,
        today.getMonth(),
        today.getDate(),
      );

      // Check if the date makes the user at least 16 years old
      return value <= minAgeDate;
    }),
});

export default function Dob() {
  const { state, setFormData, handleSubmitStep } = useRegistration();

  const handleSubmit = async (
    values: { dob: Date },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    setFormData(values);

    await handleSubmitStep(dobSchema, ['name']);

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
        title={`What's your date of birth?`}
        subtitle={`Enter your date of birth (you must be 16+). This won't appear on your profile.`}
      />
      <Formik
        initialValues={state.formData}
        validationSchema={dobSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleSubmit,
          errors,
          touched,
          isValid,
          setFieldValue,
          setFieldTouched,
        }) => (
          <View preset={'column'} style={{ flex: 1 }}>
            <DateOfBirthInput
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              touched={touched as { dob: boolean }}
              error={errors.dob as string}
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
