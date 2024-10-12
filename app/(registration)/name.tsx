import React, { useCallback, useMemo } from 'react';
import { Button, Footer, Input, Screen } from '@/src/components/atoms';
import { Header } from '@/src/components/molecules';
import { useRegistration } from '@/src/contexts/RegistrationContext';
import { colors, spacing } from '@/src/utils'; // Corrected import path
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { StyleSheet, View } from 'react-native';

// Yup validation schema for the name field
const nameSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .min(3, 'Name is too short')
    .max(32, 'Name is too long'),
});

// Define FormValues type
interface FormValues {
  name: string;
}

export default function Name() {
  const { state, handleSubmitStep } = useRegistration();

  // Formik usage
  const formik = useFormik<FormValues>({
    initialValues: { name: state.formData.name || '' },
    validationSchema: nameSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await handleSubmitStep(nameSchema, ['name'], { name: values.name });
      } catch (error) {
        console.error('Error submitting name', error);
      } finally {
        setSubmitting(false);
      }
    },
    validateOnBlur: true,
    validateOnChange: true,
  });

  const iconColor = useMemo(() => {
    if (formik.errors.name && formik.touched.name) {
      return colors.palette.error100;
    }
    return colors.palette.neutral400;
  }, [formik.errors.name, formik.touched.name]);

  // Memoized handlers to prevent unnecessary re-renders
  const handleContinuePress = useCallback(() => {
    formik.handleSubmit();
  }, [formik]);

  return (
    <Screen preset="auto" contentContainerStyle={styles.container}>
      <Header
        title="What's your name?"
        subtitle="Enter the name by which you wish to be known; this will be your display name."
      />
      <View style={styles.formContainer}>
        <Input
          placeholder="Name"
          LeftAccessory={() => (
            <Ionicons
              name="person"
              size={26}
              color={iconColor}
              style={styles.icon}
            />
          )}
          value={formik.values.name}
          onChangeText={formik.handleChange('name')}
          onBlur={formik.handleBlur('name')}
          error={!!formik.errors.name && formik.touched.name}
          errorText={formik.touched.name ? formik.errors.name : undefined}
        />
      </View>
      <Footer
        onPress={handleContinuePress}
        isDisabled={!formik.isValid || formik.isSubmitting}
        isLoading={formik.isSubmitting}
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
    gap: 10,
  },
  icon: {
    alignSelf: 'center',
    marginStart: 6,
  },
});
