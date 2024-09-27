import React, { useCallback, useRef } from 'react';
import { Button, Footer, Input, Screen } from '@/src/components/atoms';
import { Header } from '@/src/components/molecules';
import { useRegistration } from '@/src/contexts/RegistrationContext';
import { colors, spacing } from '@/src/utlis';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { StyleSheet, TextInput, View } from 'react-native';

// Yup validation schema for the name field
const nameSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .min(3, 'Name is too short')
    .max(32, 'Name is too long'),
});

// Define FormData type
type FormValues = {
  name: string;
};

export default function Name() {
  const { state, handleSubmitStep } = useRegistration();
  const nameRef = useRef<TextInput>(null);

  // Handle form submission
  const handleSubmit = useCallback(
    async (values: FormValues) => {
      await handleSubmitStep(nameSchema, ['name'], {
        ...values,
        name: values.name,
      }); // Proceed to next step after validation
    },
    [handleSubmitStep],
  );

  // Formik usage
  const formik = useFormik<FormValues>({
    initialValues: { name: state.formData.name },
    validationSchema: nameSchema,
    onSubmit: handleSubmit,
  });

  return (
    <Screen preset="auto" contentContainerStyle={styles.container}>
      <Header
        title="What's your name?"
        subtitle="Enter the name on which you wish to be known as; this will be your display name"
      />
      <View style={styles.formContainer}>
        <Input
          placeholder="Name"
          LeftAccessory={() => (
            <Ionicons
              name="person"
              size={26}
              color={
                formik.errors.name
                  ? colors.palette.error100
                  : colors.palette.neutral400
              }
              style={styles.icon}
            />
          )}
          value={formik.values.name}
          onChangeText={formik.handleChange('name')}
          onBlur={formik.handleBlur('name')}
          ref={nameRef}
          error={!!formik.errors.name}
          errorText={formik.errors.name}
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
  icon: {
    alignSelf: 'center',
    marginStart: 6,
  },
});
