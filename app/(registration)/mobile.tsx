import { Button, Footer, Input, Screen, Text } from '@/src/components/atoms';
import { Header } from '@/src/components/molecules';
import { useRegistration } from '@/src/contexts/RegistrationContext';
import { colors, spacing, typography } from '@/src/utlis';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Formik } from 'formik';
import { useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { CountryPicker } from 'react-native-country-codes-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Yup from 'yup';

// Define the validation schema using Yup
const mobileSchema = Yup.object().shape({
  mobile: Yup.string()
    .matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits')
    .required('Mobile number is required'),
});

export default function Mobile() {
  const { state, setFormData, handleSubmitStep } = useRegistration();
  const mobileRef = useRef<TextInput>(null);
  const [show, setShow] = useState<boolean>(false);
  const [countryCode, setCountryCode] = useState('+44');
  const [flag, setFlag] = useState('🇬🇧');

  const handleSubmit = async (
    values: { mobile: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    setFormData(values);
    await handleSubmitStep(mobileSchema, ['mobile']);
    setSubmitting(false);
  };

  const handleCountryCodePress = () => {
    setShow(true);
  };

  return (
    <Screen preset="auto" contentContainerStyle={styles.container}>
      <Header
        title="What's your mobile number?"
        subtitle="Enter the mobile number on which you can be contacted. No one will see this on your profile."
      />
      <Formik
        initialValues={{ mobile: state.formData.mobile || '' }}
        validationSchema={mobileSchema}
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
              placeholder="Mobile number"
              LeftAccessory={() => (
                <TouchableOpacity
                  style={styles.countryCodeContainer}
                  onPress={handleCountryCodePress}
                >
                  <Text preset="bold" style={styles.countryCodeText}>
                    {flag}
                  </Text>
                  <Text preset="bold" style={styles.countryCodeText}>
                    {countryCode}
                  </Text>
                </TouchableOpacity>
              )}
              value={values.mobile}
              onChangeText={(text) => {
                handleChange('mobile')(text);
                setFormData({ ...values, mobile: text });
              }}
              onBlur={handleBlur('mobile')}
              ref={mobileRef}
              keyboardType="number-pad"
              error={!!errors.mobile && touched.mobile}
              accessibilityLabel="Mobile number input"
            />
            {errors.mobile && touched.mobile && (
              <Text weight="medium" style={styles.errorText}>
                {errors.mobile}
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
      <CountryPicker
        lang={'en'}
        show={show}
        onBackdropPress={() => setShow(false)}
        style={{
          modal: {
            height: 800,
          },
          line: {
            opacity: 0,
          },
          textInput: {
            padding: spacing.md,
            height: 52,
            backgroundColor: colors.palette.neutral200,
            fontFamily: typography.primary.medium,
          },
          countryButtonStyles: {
            height: 52,
            backgroundColor: colors.palette.neutral200,
            marginBottom: spacing.xs,
          },
          dialCode: {
            fontFamily: typography.primary.medium,
          },
          // Country name styles [Text]
          countryName: { fontFamily: typography.primary.medium },
        }}
        // when picker button press you will get the country object with dial code
        pickerButtonOnPress={(item) => {
          setCountryCode(item.dial_code);
          setFlag(item.flag);
          console.log({ item });
          setShow(false);
        }}
      />
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
    gap: 15, // Use a space unit consistent with your design system if necessary
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
  countryCodeContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 10,
    marginStart: 6,
  },
  countryCodeText: {
    textAlign: 'center',
    fontSize: 16,
    marginRight: 5,
  },
});
