import { Button, Footer, Input, Screen, Text } from '@/src/components/atoms';
import { Header } from '@/src/components/molecules';
import { useRegistration } from '@/src/contexts/RegistrationContext';
import { colors, spacing } from '@/src/utlis';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Formik } from 'formik';
import { useCallback, useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import * as yup from 'yup';

const nameSchema = yup.object().shape({
  name: yup.string().required('Name is required').min(3).max(32),
});

export default function Name() {
  const { state, setFormData, handleSubmitStep } = useRegistration();
  const nameRef = useRef<TextInput>(null);

  const handleSubmit = useCallback(
    async (
      values: { name: string },
      { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
    ) => {
      setFormData(values);
      await handleSubmitStep(nameSchema, ['name']);
      setSubmitting(false);
    },
    [setFormData, handleSubmitStep],
  );

  return (
    <Screen preset="auto" contentContainerStyle={styles.container}>
      <Header
        title="What's your name?"
        subtitle="Enter the name on which you wish to be known as; this will be your display name"
      />
      <Formik
        initialValues={state.formData}
        validationSchema={nameSchema}
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
              placeholder="Name"
              LeftAccessory={() => (
                <Ionicons
                  name="person"
                  size={26}
                  color={
                    errors.name && touched.name
                      ? colors.palette.error100
                      : colors.palette.neutral400
                  }
                  style={styles.icon}
                />
              )}
              value={values.name}
              onChangeText={(text) => {
                handleChange('name')(text);
                setFormData({ ...values, name: text });
              }}
              onBlur={handleBlur('name')}
              ref={nameRef}
              error={!!errors.name && touched.name}
            />
            {errors.name && touched.name && (
              <Text weight="medium" style={styles.errorText}>
                {errors.name}
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
