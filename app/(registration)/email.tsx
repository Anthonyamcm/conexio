import { Button, Footer, Input, Screen } from '@/src/components/atoms';
import { Header } from '@/src/components/molecules';
import { useRegistration } from '@/src/contexts/RegistrationContext';
import { colors, spacing } from '@/src/utils';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useFormik } from 'formik';
import { useCallback, useMemo, useRef } from 'react';
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
  const { state, handleSubmitStep, setFormData } = useRegistration();
  const emailRef = useRef<TextInput>(null);

  const mobilePressed = useCallback(() => {
    setFormData({ email: '' });
    router.back();
  }, []);

  // Formik setup using the useFormik hook
  const formik = useFormik({
    initialValues: { email: state.formData.email || '' },
    validationSchema: emailSchema,
    onSubmit: async (values: FormValues, { setSubmitting }) => {
      try {
        await handleSubmitStep(emailSchema, ['email'], {
          ...values,
          email: values.email,
        });
      } catch (error) {
        console.error('Error submitting mobile number:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const iconColor = useMemo(() => {
    if (formik.errors.email && formik.touched.email) {
      return colors.palette.error100;
    }
    return colors.palette.neutral400;
  }, [formik.errors.email, formik.touched.email]);

  // Memoized handlers to prevent unnecessary re-renders
  const handleContinuePress = useCallback(() => {
    formik.handleSubmit();
  }, [formik]);

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
              color={iconColor}
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
          onPress={handleContinuePress}
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
