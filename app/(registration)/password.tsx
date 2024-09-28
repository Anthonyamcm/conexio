import React, { useCallback, useRef, useState } from 'react';
import { Button, Footer, Input, Screen } from '@/src/components/atoms';
import { Header } from '@/src/components/molecules';
import { useRegistration } from '@/src/contexts/RegistrationContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { colors, spacing } from '@/src/utils';

// Yup validation schema for password
const passwordSchema = yup.object().shape({
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(
      /[@$!%*#?&]/,
      'Password must contain at least one special character',
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm your password'),
});

// Form values type definition
type FormValues = {
  password: string;
  confirmPassword: string;
};

export default function Password() {
  const { state, handleSubmitStep } = useRegistration();
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  // Toggle password visibility hook
  function usePasswordToggle() {
    const [visible, setVisible] = useState(false);
    const toggleVisibility = () => setVisible(!visible);
    return { visible, toggleVisibility };
  }

  const passwordToggle = usePasswordToggle();
  const confirmPasswordToggle = usePasswordToggle();

  // Handle form submission
  const handleSubmit = useCallback(
    async (values: FormValues) => {
      // Proceed to next step after validation
      await handleSubmitStep(passwordSchema, ['password'], {
        ...values,
        password: values.password,
      });
    },
    [handleSubmitStep],
  );

  // Formik usage
  const formik = useFormik<FormValues>({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: passwordSchema,
    onSubmit: handleSubmit,
  });

  // Helper function to determine icon color
  const iconColor = (
    error: string | undefined,
    touched: boolean | undefined,
  ) => {
    return error && touched
      ? colors.palette.error100
      : colors.palette.neutral400;
  };

  return (
    <Screen preset="auto" contentContainerStyle={styles.container}>
      <Header
        title="Set a Password"
        subtitle="Create a strong password for your account and make sure to remember it."
      />
      <View style={styles.formContainer}>
        <Input
          placeholder="Password"
          secureTextEntry={!passwordToggle.visible}
          LeftAccessory={() => (
            <Ionicons
              name="lock-closed"
              size={26}
              color={iconColor(formik.errors.password, formik.touched.password)}
              style={styles.icon}
            />
          )}
          RightAccessory={() => (
            <TouchableOpacity
              onPress={passwordToggle.toggleVisibility}
              style={[styles.icon, { marginEnd: 12 }]}
            >
              <Ionicons
                name={passwordToggle.visible ? 'eye' : 'eye-off'}
                size={26}
                color={colors.palette.neutral400}
              />
            </TouchableOpacity>
          )}
          value={formik.values.password}
          onChangeText={formik.handleChange('password')}
          onBlur={formik.handleBlur('password')}
          ref={passwordRef}
          error={!!formik.errors.password && formik.touched.password}
          errorText={formik.errors.password}
        />

        <Input
          placeholder="Confirm Password"
          secureTextEntry={!confirmPasswordToggle.visible}
          LeftAccessory={() => (
            <Ionicons
              name="lock-closed"
              size={26}
              color={iconColor(
                formik.errors.confirmPassword,
                formik.touched.confirmPassword,
              )}
              style={styles.icon}
            />
          )}
          RightAccessory={() => (
            <TouchableOpacity
              onPress={confirmPasswordToggle.toggleVisibility}
              style={[styles.icon, { marginEnd: 12 }]}
            >
              <Ionicons
                name={confirmPasswordToggle.visible ? 'eye' : 'eye-off'}
                size={26}
                color={colors.palette.neutral400}
              />
            </TouchableOpacity>
          )}
          value={formik.values.confirmPassword}
          onChangeText={formik.handleChange('confirmPassword')}
          onBlur={formik.handleBlur('confirmPassword')}
          ref={confirmPasswordRef}
          error={
            !!formik.errors.confirmPassword && formik.touched.confirmPassword
          }
          errorText={formik.errors.confirmPassword}
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
    overflow: 'hidden',
  },
  formContainer: {
    flex: 1,
    gap: 10,
    flexDirection: 'column',
  },
  icon: {
    alignSelf: 'center',
    marginStart: 6,
  },
});
