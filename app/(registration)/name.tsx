import {
  Button,
  Footer,
  Input,
  Screen,
  Text,
  View,
} from '@/src/components/atoms';
import { colors, spacing } from '@/src/utlis';
import { Header } from '@/src/components/molecules';
import { useRegistration } from '@/src/contexts/RegistrationContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useRef } from 'react';
import { TextInput } from 'react-native';
//TODO: Fix inline styles and convert to styleSheet

const nameSchema = yup.object().shape({
  name: yup.string().required('Name is required').min(3).max(32),
});

export default function Name() {
  const { state, setFormData, handleSubmitStep } = useRegistration();
  const nameRef = useRef<TextInput>(null);

  const handleSubmit = async (
    values: { name: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    setFormData(values);

    await handleSubmitStep(nameSchema, ['name']);

    setSubmitting(false);
  };

  return (
    <Screen
      preset="auto"
      contentContainerStyle={{
        flex: 1,
        padding: spacing.lg,
      }}
    >
      <Header
        title={`What's your name?`}
        subtitle={
          'Enter the name on which you wish to be known as, this will be your display name'
        }
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
          <View preset={'column'} style={{ flex: 1 }}>
            <Input
              placeholder={'Name'}
              LeftAccessory={() => (
                <Ionicons
                  name="person"
                  size={26}
                  color={
                    errors.name && touched.name
                      ? colors.palette.error100
                      : colors.palette.neutral400
                  }
                  style={{
                    alignSelf: 'center',
                    marginStart: 6,
                    opacity: errors.name && touched.name ? 0.8 : 1,
                  }}
                />
              )}
              value={values.name}
              onChangeText={(text) => {
                handleChange('name')(text);
                // Update context on change
                setFormData({ ...values, name: text });
              }}
              onBlur={handleBlur('name')}
              ref={nameRef}
              error={!!errors.name && touched.name}
            />
            {(errors.name && touched.name) || (errors.name && touched.name) ? (
              <Text
                weight="medium"
                style={{
                  color: colors.palette.error100,
                }}
              >
                {errors.name}
              </Text>
            ) : null}
            <Button
              preset={'gradient'}
              gradient={[
                colors.palette.primary100,
                colors.palette.secondary100,
              ]}
              onPress={() => handleSubmit()}
              disabled={!isValid}
              isLoading={isSubmitting}
            >
              {'Continue'}
            </Button>
          </View>
        )}
      </Formik>
      <Footer />
    </Screen>
  );
}
