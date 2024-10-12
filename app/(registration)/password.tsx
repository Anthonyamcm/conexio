import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Footer, Input, Screen } from '@/src/components/atoms';
import { Header } from '@/src/components/molecules';
import { useRegistration } from '@/src/contexts/RegistrationContext';
import { colors, spacing } from '@/src/utils';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface FormValues {
  password: string;
  confirmPassword: string;
}

const passwordSchema = Yup.object().shape({
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(
      /[@$!%*#?&]/,
      'Password must contain at least one special character',
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm your password'),
});

export default function Password() {
  const { handleSubmitStep } = useRegistration();

  // Toggle password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisible((prev) => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setConfirmPasswordVisible((prev) => !prev);
  }, []);

  const formik = useFormik<FormValues>({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: passwordSchema,
    onSubmit: async (values: FormValues, { setSubmitting }) => {
      try {
        await handleSubmitStep(passwordSchema, ['password'], {
          password: values.password,
        });
      } catch (error) {
        console.error('Error submitting password:', error);
      } finally {
        setSubmitting(false);
      }
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  const getIconColor = useCallback(
    (fieldName: keyof FormValues) => {
      return formik.errors[fieldName] && formik.touched[fieldName]
        ? colors.palette.error100
        : colors.palette.neutral400;
    },
    [formik.errors, formik.touched],
  );

  // Memoized handlers to prevent unnecessary re-renders
  const handleContinuePress = useCallback(() => {
    formik.handleSubmit();
  }, [formik]);

  return (
    <Screen preset="auto" contentContainerStyle={styles.container}>
      <Header
        title="Set a Password"
        subtitle="Create a strong password for your account and make sure to remember it."
      />
      <View style={styles.formContainer}>
        <Input
          placeholder="Password"
          secureTextEntry={!passwordVisible}
          LeftAccessory={() => (
            <Ionicons
              name="lock-closed"
              size={26}
              color={getIconColor('password')}
              style={styles.icon}
            />
          )}
          RightAccessory={() => (
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={styles.iconButton}
            >
              <Ionicons
                name={passwordVisible ? 'eye' : 'eye-off'}
                size={26}
                color={colors.palette.neutral400}
              />
            </TouchableOpacity>
          )}
          value={formik.values.password}
          onChangeText={formik.handleChange('password')}
          onBlur={formik.handleBlur('password')}
          error={!!formik.errors.password && formik.touched.password}
          errorText={
            formik.touched.password ? formik.errors.password : undefined
          }
        />

        <Input
          placeholder="Confirm Password"
          secureTextEntry={!confirmPasswordVisible}
          LeftAccessory={() => (
            <Ionicons
              name="lock-closed"
              size={26}
              color={getIconColor('confirmPassword')}
              style={styles.icon}
            />
          )}
          RightAccessory={() => (
            <TouchableOpacity
              onPress={toggleConfirmPasswordVisibility}
              style={styles.iconButton}
            >
              <Ionicons
                name={confirmPasswordVisible ? 'eye' : 'eye-off'}
                size={26}
                color={colors.palette.neutral400}
              />
            </TouchableOpacity>
          )}
          value={formik.values.confirmPassword}
          onChangeText={formik.handleChange('confirmPassword')}
          onBlur={formik.handleBlur('confirmPassword')}
          error={
            !!formik.errors.confirmPassword && formik.touched.confirmPassword
          }
          errorText={
            formik.touched.confirmPassword
              ? formik.errors.confirmPassword
              : undefined
          }
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
  iconButton: {
    alignSelf: 'center',
    marginEnd: 12,
  },
});
