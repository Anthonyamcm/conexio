import React, { useState } from 'react';
import { Button, Input, Screen, Text } from '@/src/components/atoms';
import { colors, spacing } from '@/src/utlis';
import Feather from '@expo/vector-icons/Feather';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Header } from '@/src/components/molecules';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';

// Validation schema using Yup
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = () => {
    console.log('submit');
  };

  const showAlert = () => {
    Alert.alert(
      `Don't have an account?`,
      '',
      [
        {
          text: `Sign in`,
          onPress: () => {
            console.log('here');
          },
        },
        {
          text: 'Create account',
          onPress: () => {
            router.back();
          },
          style: 'cancel',
        },
      ],
      { cancelable: false }, // Prevents dismissing the alert by tapping outside
    );
  };
  return (
    <Screen preset="auto" contentContainerStyle={styles.container}>
      <Header
        title="Sign in"
        subtitle="Enter your email and password to access your account."
      />
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isValid,
        }) => (
          <View style={styles.formContainer}>
            <Input
              placeholder="Email"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              LeftAccessory={() => (
                <Ionicons
                  name="mail"
                  size={26}
                  color={
                    errors.email && touched.email
                      ? colors.palette.error100
                      : colors.palette.neutral400
                  }
                  style={styles.icon}
                />
              )}
              error={touched.email && !!errors.email}
            />
            {touched.email && errors.email && (
              <Text preset="bold" style={styles.errorText}>
                {errors.email}
              </Text>
            )}

            <Input
              placeholder="Password"
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              secureTextEntry={!showPassword}
              LeftAccessory={() => (
                <Ionicons
                  name="lock-closed"
                  size={26}
                  color={
                    errors.password && touched.password
                      ? colors.palette.error100
                      : colors.palette.neutral400
                  }
                  style={styles.icon}
                />
              )}
              RightAccessory={() => (
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={[styles.icon, { marginEnd: 12 }]}
                >
                  <Ionicons
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={26}
                    color={colors.palette.neutral400}
                  />
                </TouchableOpacity>
              )}
              error={touched.password && !!errors.password}
            />
            {touched.password && errors.password && (
              <Text preset="bold" style={styles.errorText}>
                {errors.password}
              </Text>
            )}
            <Button
              preset="gradient"
              gradient={[
                colors.palette.primary100,
                colors.palette.secondary100,
              ]}
              onPress={() => handleSubmit()}
              disabled={!isValid}
            >
              Log in
            </Button>
            <TouchableOpacity style={{ alignSelf: 'center' }}>
              <Text preset="bold">{'Forgotten Password?'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        <TouchableOpacity onPress={() => showAlert()}>
          <Text weight="medium" size="xs">
            {`Don't have an account?`}
          </Text>
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
  backContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorText: {
    color: colors.palette.error100,
    marginTop: spacing.xs,
  },
});
