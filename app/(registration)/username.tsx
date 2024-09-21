import React, { useRef, useCallback } from 'react';
import { Button, Footer, Input, Screen, Text } from '@/src/components/atoms';
import { Header } from '@/src/components/molecules';
import { useRegistration } from '@/src/contexts/RegistrationContext';
import { colors, spacing } from '@/src/utlis';
import { MaterialIcons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, View } from 'react-native';
import _ from 'lodash';

// Simulate async username availability check (replace with actual API call)
const checkUsernameAvailability = async (username: string) => {
  // Simulated API delay for username check
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return username !== 'test'; // Mock: username 'test' is taken
};

// Yup schema with async validation for username
const usernameSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(32, 'Username must be less than 32 characters')
    .required('Username is required')
    .test(
      'checkUsernameAvailable',
      'Username is already taken',
      async (value) => {
        if (value) {
          return await checkUsernameAvailability(value);
        }
        return true;
      },
    ),
});

export default function Username() {
  const { state, setFormData, handleSubmitStep } = useRegistration();
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const usernameRef = useRef<TextInput>(null);

  // Handle form submission
  const handleSubmit = useCallback(
    async (
      value: { username: string },
      { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
    ) => {
      if (!(await checkUsernameAvailability(value.username))) {
        setSubmitting(false);
        return;
      }
      setFormData(value);
      await handleSubmitStep(usernameSchema, ['username']);
      setSubmitting(false);
    },
    [setFormData, handleSubmitStep],
  );

  // Debounced username availability check
  const handleCheckUsernameAvailability = useRef(
    _.debounce(async (username: string) => {
      if (!username) return;
      setIsChecking(true);
      try {
        const isAvailable = await checkUsernameAvailability(username);
        if (isAvailable) {
          setFormData({ username });
        }
      } catch (error) {
        console.error('Error checking username availability:', error);
      } finally {
        setIsChecking(false);
      }
    }, 1000),
  ).current;

  // Icon color based on validation error
  const iconColor = useCallback(
    (error: string | undefined, isChecking: boolean) =>
      error && !isChecking
        ? colors.palette.error100
        : colors.palette.neutral400,
    [],
  );

  return (
    <Screen preset="auto" contentContainerStyle={styles.container}>
      <Header
        title="What will your username be?"
        subtitle="Choose a unique username to be associated with your account."
      />
      <Formik
        initialValues={state.formData}
        validationSchema={usernameSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleSubmit,
          handleBlur,
          values,
          errors,
          isValid,
          isSubmitting,
        }) => (
          <View style={styles.formContainer}>
            <Input
              placeholder="Username"
              LeftAccessory={() => (
                <MaterialIcons
                  name="alternate-email"
                  size={26}
                  color={iconColor(errors.username, isChecking)}
                  style={styles.icon}
                />
              )}
              RightAccessory={() =>
                isChecking ? (
                  <ActivityIndicator
                    size="small"
                    color={colors.palette.neutral500}
                    style={[styles.icon, { marginEnd: 12 }]}
                  />
                ) : null
              }
              value={values.username}
              onChangeText={(text) => {
                handleChange('username')(text);
                handleCheckUsernameAvailability(text);
              }}
              onBlur={handleBlur('username')}
              ref={usernameRef}
              error={!!errors.username && !isChecking}
            />
            {errors.username && !isChecking && (
              <Text weight="medium" style={styles.errorText}>
                {errors.username}
              </Text>
            )}

            <Button
              preset="gradient"
              gradient={[
                colors.palette.primary100,
                colors.palette.secondary100,
              ]}
              onPress={() => handleSubmit()}
              disabled={!isValid || isSubmitting}
              isLoading={isSubmitting}
            >
              Continue
            </Button>
          </View>
        )}
      </Formik>
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
    marginLeft: 6,
  },
  errorText: {
    color: colors.palette.error100,
  },
});
