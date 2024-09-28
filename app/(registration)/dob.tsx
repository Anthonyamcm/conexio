import React, { useCallback, useMemo } from 'react';
import { Button, Footer, Screen } from '@/src/components/atoms';
import { DateOfBirthInput, Header } from '@/src/components/molecules';
import { useRegistration } from '@/src/contexts/RegistrationContext';
import { colors, spacing } from '@/src/utlis';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { StyleSheet, View } from 'react-native';

const today = new Date();
const minDate = new Date(1900, 0, 1);
const maxDate = new Date(
  today.getFullYear() - 16,
  today.getMonth(),
  today.getDate(),
);

const dobSchema = yup.object().shape({
  dob: yup
    .date()
    .required('Date of birth is required')
    .min(minDate, 'Year is too early')
    .max(maxDate, 'You must be at least 16 years old'),
});

interface FormValues {
  dob: Date | null;
}

export default function Dob() {
  const { state, handleSubmitStep } = useRegistration();

  const formik = useFormik<FormValues>({
    initialValues: {
      dob: state.formData.dob || null,
    },
    validationSchema: dobSchema,
    onSubmit: async (values) => {
      await handleSubmitStep(dobSchema, ['dob'], { dob: values.dob });
    },
  });

  // Memoized handlers to prevent unnecessary re-renders
  const handleContinuePress = useCallback(() => {
    formik.handleSubmit();
  }, [formik]);

  return (
    <Screen preset="auto" contentContainerStyle={styles.container}>
      <Header
        title="What's your date of birth?"
        subtitle="Enter your date of birth (you must be 16+). This won't appear on your profile."
      />
      <View style={styles.formContainer}>
        <DateOfBirthInput
          value={formik.values.dob}
          onChange={(date) => formik.setFieldValue('dob', date)}
          error={formik.errors.dob}
          touched={formik.touched.dob}
          onBlur={() => formik.setFieldTouched('dob', true)}
        />

        <Button
          preset="gradient"
          gradient={[colors.palette.primary100, colors.palette.secondary100]}
          onPress={handleContinuePress}
          disabled={formik.isSubmitting || !formik.isValid}
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
    gap: 10,
  },
});
