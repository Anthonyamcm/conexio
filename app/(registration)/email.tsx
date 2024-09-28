import { Button, Footer, Input, Screen } from '@/src/components/atoms';
import { Header } from '@/src/components/molecules';
import { useRegistration } from '@/src/contexts/RegistrationContext';
import { colors, spacing } from '@/src/utils';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useFormik } from 'formik';
import { useCallback, useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import * as yup from 'yup';

// Validation schema using Yup
const emailSchema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
});

interface FormValues {
  email: string;
}

export default function Email() {
  const { state, setFormData, handleSubmitStep } = useRegistration();
  const emailRef = useRef<TextInput>(null);

  // Handle form submission
  const handleSubmit = useCallback(
    async (values: FormValues) => {
      await handleSubmitStep(emailSchema, ['email'], {
        ...values,
        email: values.email,
      });
    },
    [setFormData, handleSubmitStep],
  );

  const mobilePressed = useCallback(() => {
    router.back();
  }, []);

  // Formik setup using the useFormik hook
  const formik = useFormik({
    initialValues: { email: state.formData.email || '' },
    validationSchema: emailSchema,
    onSubmit: handleSubmit,
  });

  return (
    <Screen preset="auto" contentContainerStyle={styles.container}>
      <Header
        title="What's your email?"
        subtitle="Enter the email on which you can be contacted. No one will see this on your profile."
      />
      <View style={styles.formContainer}>
        <Input
          placeholder="email"
          LeftAccessory={() => (
            <Ionicons
              name="mail"
              size={26}
              color={
                formik.errors.email && formik.touched.email
                  ? colors.palette.error100
                  : colors.palette.neutral400
              }
              style={styles.icon}
            />
          )}
          value={formik.values.email}
          onChangeText={formik.handleChange('email')}
          onBlur={formik.handleBlur('email')}
          ref={emailRef}
          error={!!formik.errors.email && formik.touched.email}
          errorText={formik.errors.email}
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
        <Button
          preset="default"
          textStyle={{ fontWeight: '300' }}
          onPress={mobilePressed}
        >
          Sign up with mobile
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
    opacity: 1,
  },
});
