import React, { useCallback } from 'react';
import { Button, Footer, Screen } from '@/src/components/atoms';
import { DateOfBirthInput, Header } from '@/src/components/molecules';
import { useRegistration } from '@/src/contexts/RegistrationContext';
import { colors, spacing } from '@/src/utlis';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { StyleSheet, View } from 'react-native';

// Yup validation schema for Date of Birth
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

// Define form values type
type FormValues = {
  dob: {
    day: string;
    month: string;
    year: string;
  };
};

export default function Dob() {
  const { state, handleSubmitStep } = useRegistration();

  // Handle form submission
  const handleSubmit = useCallback(
    async (values: FormValues) => {
      const dateString = `${values.dob.year}-${values.dob.month}-${values.dob.day}`;
      const parsedDate = new Date(dateString);

      // Call the handleSubmitStep with form data and proceed
      await handleSubmitStep(dobSchema, ['dob'], { dob: parsedDate });
    },
    [handleSubmitStep],
  );

  // Formik usage
  const formik = useFormik<FormValues>({
    initialValues: {
      dob: {
        day: state.formData.dob?.getDate().toString() || '',
        month: (state.formData.dob?.getMonth() + 1).toString() || '',
        year: state.formData.dob?.getFullYear().toString() || '',
      },
    },
    validationSchema: dobSchema,
    onSubmit: handleSubmit,
  });

  return (
    <Screen preset="auto" contentContainerStyle={styles.container}>
      <Header
        title="What's your date of birth?"
        subtitle="Enter your date of birth (you must be 16+). This won't appear on your profile."
      />
      <View style={styles.formContainer}>
        <DateOfBirthInput
          value={formik.values.dob}
          setFieldValue={formik.setFieldValue}
          setFieldTouched={formik.setFieldTouched}
          setFieldError={formik.setFieldError}
          touched={{
            day: formik.touched.dob?.day || false,
            month: formik.touched.dob?.month || false,
            year: formik.touched.dob?.year || false,
          }}
          errors={{
            day: formik.errors.dob?.day,
            month: formik.errors.dob?.month,
            year: formik.errors.dob?.year,
          }}
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
    flexDirection: 'column',
    gap: 15,
  },
});
