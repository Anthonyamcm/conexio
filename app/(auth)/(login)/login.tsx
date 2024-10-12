import React, { useCallback, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Input, Screen, Text } from '@/src/components/atoms';
import { colors, spacing } from '@/src/utils';
import { Header } from '@/src/components/molecules';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLoginUser } from '@/src/hooks/useLoginUser';

interface FormValues {
  email: string;
  password: string;
}

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const formik = useFormik<FormValues>({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values: FormValues) => {
      try {
        const loginData = {
          email: values.email,
          password: values.password,
        };
        await mutateAsync(loginData);
      } catch (error) {
        console.error('Error during login:', error);
      }
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  const { mutateAsync, isPending } = useLoginUser({
    onError: (error) => {
      if (error?.status === 401) {
        setError('Incorrect email or password ');
      } else {
        formik.setStatus({
          formError: 'Registration failed. Please try again.',
        });
      }
    },
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
        title="Sign in"
        subtitle="Enter your email and password to access your account."
      />

      <View style={styles.formContainer}>
        {error && (
          <View
            style={{
              padding: spacing.sm,
              backgroundColor: colors.palette.error100,
              borderRadius: 12,
            }}
          >
            <View style={{ flexDirection: 'row', gap: 15 }}>
              <Ionicons
                name="information-circle-outline"
                size={24}
                color={colors.palette.neutral100}
              />
              <Text preset="bold" style={{ color: colors.palette.neutral100 }}>
                {error}
              </Text>
            </View>
          </View>
        )}
        <Input
          placeholder="Email"
          value={formik.values.email}
          onChangeText={formik.handleChange('email')}
          onBlur={formik.handleBlur('email')}
          LeftAccessory={() => (
            <Ionicons
              name="mail"
              size={26}
              color={getIconColor('email')}
              style={styles.icon}
            />
          )}
          error={!!formik.errors.email && formik.touched.email}
          errorText={formik.touched.email ? formik.errors.email : undefined}
        />
        <Input
          placeholder="Password"
          value={formik.values.password}
          onChangeText={formik.handleChange('password')}
          onBlur={formik.handleBlur('password')}
          secureTextEntry={!showPassword}
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
                name={showPassword ? 'eye' : 'eye-off'}
                size={26}
                color={colors.palette.neutral400}
              />
            </TouchableOpacity>
          )}
          error={!!formik.errors.password && formik.touched.password}
          errorText={
            formik.touched.password ? formik.errors.password : undefined
          }
        />
        <Button
          preset="gradient"
          gradient={[colors.palette.primary100, colors.palette.secondary100]}
          onPress={handleContinuePress}
          disabled={!formik.isValid || formik.isSubmitting || isPending}
          isLoading={formik.isSubmitting || isPending}
        >
          Sign in
        </Button>
        <TouchableOpacity
          style={styles.forgotPasswordButton}
          onPress={() => {
            // Handle forgot password navigation
            // router.push('/forgot-password');
          }}
        >
          <Text preset="bold">Forgotten Password?</Text>
        </TouchableOpacity>
      </View>
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
    gap: 15,
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
  forgotPasswordButton: {
    alignSelf: 'center',
    marginTop: spacing.sm,
  },
  errorText: {
    color: colors.palette.error100,
    marginTop: spacing.xs,
  },
});
