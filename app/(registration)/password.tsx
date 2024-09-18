import { Button, Footer, Input, Screen, Text } from '@/src/components/atoms';
import { Header } from '@/src/components/molecules';
import { useRegistration } from '@/src/contexts/RegistrationContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useRef, useState, useMemo } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { StyleSheet } from 'react-native';
import { colors, spacing } from '@/src/utlis';

// TODO: Fix inline styles and convert to styleSheet

// Validation schema for password
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
    .oneOf([yup.ref('password'), undefined], 'Passwords must match')
    .required('Confirm your password'),
});

export default function Password() {
  const { state, setFormData, handleSubmitStep } = useRegistration();
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (
    values: { password: string; confirmPassword: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    setFormData(values);
    await handleSubmitStep(passwordSchema, ['password', 'confirmPassword']);
    setSubmitting(false);
  };

  // Function to toggle password visibility
  const toggleShowPassword = () => setShowPassword(!showPassword);

  // Memoized function to generate the appropriate icon color for form fields
  const iconColor = (
    error: string | undefined,
    touched: boolean | undefined,
  ) => {
    return error && touched
      ? colors.palette.error100
      : colors.palette.neutral400;
  };

  // Memoized password strength feedback for enhanced UX
  const passwordStrength = useMemo(() => {
    if (state.formData.password?.length >= 8) {
      return 'Strong';
    } else if (state.formData.password?.length >= 4) {
      return 'Weak';
    }
    return 'Very Weak';
  }, [state.formData.password]);

  return (
    <Screen preset="auto" contentContainerStyle={styles.container}>
      <Header
        title="Set a Password"
        subtitle="Create a strong password for your account and make sure to remember it."
      />
      <Formik
        initialValues={state.formData}
        validationSchema={passwordSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleSubmit,
          handleBlur,
          values,
          errors,
          touched,
          isValid,
          isSubmitting,
        }) => (
          <View style={styles.formContainer}>
            <Input
              placeholder="Password"
              secureTextEntry={!showPassword}
              LeftAccessory={() => (
                <Ionicons
                  name="lock-closed"
                  size={26}
                  color={iconColor(errors.password, touched.password)}
                  style={styles.icon}
                />
              )}
              RightAccessory={() => (
                <TouchableOpacity
                  onPress={toggleShowPassword}
                  style={[styles.icon, { marginEnd: 12 }]}
                >
                  <Ionicons
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={26}
                    color={colors.palette.neutral400}
                  />
                </TouchableOpacity>
              )}
              value={values.password}
              onChangeText={(text) => {
                handleChange('password')(text);
                // Update context on change
                setFormData({ ...values, password: text });
              }}
              onBlur={handleBlur('password')}
              ref={passwordRef}
              error={!!errors.password && touched.password}
            />
            {errors.password && touched.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <Input
              placeholder="Confirm Password"
              secureTextEntry={!showPassword}
              LeftAccessory={() => (
                <Ionicons
                  name="lock-closed"
                  size={26}
                  color={iconColor(
                    errors.confirmPassword,
                    touched.confirmPassword,
                  )}
                  style={styles.icon}
                />
              )}
              value={values.confirmPassword}
              onChangeText={(text) => {
                handleChange('confirmPassword')(text);
                // Update context on change
                setFormData({ ...values, confirmPassword: text });
              }}
              onBlur={handleBlur('confirmPassword')}
              ref={confirmPasswordRef}
              error={!!errors.confirmPassword && touched.confirmPassword}
            />
            {errors.confirmPassword && touched.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}

            {/* Submit Button */}
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
  inputContainer: {
    marginBottom: spacing.md,
  },
  icon: {
    alignSelf: 'center',
    marginStart: 6,
  },
  errorText: {
    color: colors.palette.error100,
    marginTop: spacing.xs,
  },
  passwordStrength: {
    marginTop: spacing.xs,
    color: colors.palette.neutral600,
    fontWeight: 'bold',
  },
});
