import { Button, Footer, Input, Screen, Text } from '@/src/components/atoms';
import { Header } from '@/src/components/molecules';
import { useRegistration } from '@/src/contexts/RegistrationContext';
import { colors, spacing } from '@/src/utlis';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Formik } from 'formik';
import { useCallback, useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import * as yup from 'yup';

const emailSchema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
});

export default function Email() {
  const { state, setFormData, handleSubmitStep } = useRegistration();
  const emailRef = useRef<TextInput>(null);

  const handleSubmit = useCallback(
    async (
      values: { email: string },
      { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
    ) => {
      setFormData(values);
      await handleSubmitStep(emailSchema, ['email']);
      setSubmitting(false);
    },
    [setFormData, handleSubmitStep],
  );

  const mobilePressed = () => {
    router.back();
  };

  return (
    <Screen preset="auto" contentContainerStyle={styles.container}>
      <Header
        title="What's your email?"
        subtitle="Enter the email on which you can be contacted. No one will see this on your profile."
      />
      <Formik
        initialValues={{ email: state.formData.email || '' }}
        validationSchema={emailSchema}
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
              placeholder="email"
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
              value={values.email}
              onChangeText={(text) => {
                handleChange('email')(text);
              }}
              onBlur={handleBlur('email')}
              ref={emailRef}
              error={!!errors.email && touched.email}
              errorText={errors.email}
            />

            <Button
              preset="gradient"
              gradient={[
                colors.palette.primary100,
                colors.palette.secondary100,
              ]}
              onPress={() => handleSubmit()}
              disabled={!isValid}
              isLoading={isSubmitting}
            >
              Continue
            </Button>
            <Button
              preset="default"
              textStyle={{ fontWeight: '300' }}
              onPress={mobilePressed}
            >
              {'Sign up with mobile'}
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
  },
  formContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 15, // Note: Use a space unit consistent with your design system if necessary
  },
  icon: {
    alignSelf: 'center',
    marginStart: 6,
    opacity: 1,
  },
  errorText: {
    color: colors.palette.error100,
    marginTop: 5,
    fontWeight: '500',
  },
});
