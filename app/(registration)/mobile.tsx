import { Button, Footer, Input, Screen, Text } from '@/src/components/atoms';
import { InputProps } from '@/src/components/atoms/Input';
import { Header } from '@/src/components/molecules';
import { useRegistration } from '@/src/contexts/RegistrationContext';
import { colors, spacing, typography } from '@/src/utlis';
import { Formik } from 'formik';
import { forwardRef, memo, useCallback, useRef, useState } from 'react';
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

interface CountryCode {
  code: string;
  flag: string;
}

interface CustomInputWithCountryCodeProps extends InputProps {
  countryCode: CountryCode; // Change to an object if needed
  onCountryCodePress: () => void;
  showError: boolean | undefined;
  errorText: string | undefined;
}

const CustomInputWithCountryCode = memo(
  forwardRef<TextInput, CustomInputWithCountryCodeProps>(
    (
      { countryCode, onCountryCodePress, showError, errorText, ...inputProps },
      ref,
    ) => (
      <View style={{ flexDirection: 'column' }}>
        <View
          style={[
            styles.inputContainer,
            {
              borderColor: showError
                ? colors.palette.error100
                : colors.palette.neutral200,
              borderWidth: 3,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.countryCodeContainer}
            onPress={onCountryCodePress}
          >
            <Text preset="bold" style={styles.countryCodeText}>
              {countryCode.flag}
            </Text>
            <Text preset="bold" style={styles.countryCodeText}>
              {countryCode.code}
            </Text>
          </TouchableOpacity>
          <View
            style={{
              width: 3,
              backgroundColor: colors.palette.neutral300,
              borderRadius: 12,
              paddingVertical: 15,
            }}
          />
          <Input
            ref={ref} // Pass ref to the Input component
            placeholder="Mobile number"
            keyboardType="number-pad"
            {...inputProps} // Spread remaining props
          />
        </View>
        {errorText && (
          <Text
            preset="bold"
            style={{ color: colors.palette.error100, marginTop: spacing.xs }}
            text={errorText}
          />
        )}
      </View>
    ),
  ),
);

export default function Mobile() {
  const { state, setFormData, handleSubmitStep } = useRegistration();
  const mobileRef = useRef<TextInput>(null);
  const [show, setShow] = useState<boolean>(false);
  const [countryCode, setCountryCode] = useState({ code: '+44', flag: '🇬🇧' });

  const handleSubmit = async (
    values: { mobile: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    setFormData(values);
    await handleSubmitStep(mobileSchema, ['mobile']);
    setSubmitting(false);
  };

  const handleCountryCodePress = useCallback(() => {
    mobileRef.current?.blur();
    setShow(true);
  }, []);

  const handleCountrySelect = useCallback((country: CountryCode) => {
    setCountryCode(country);
    setShow(false);
  }, []);

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
            <CustomInputWithCountryCode
              countryCode={countryCode}
              onCountryCodePress={handleCountryCodePress}
              value={values.mobile}
              onChangeText={(text) => {
                handleChange('mobile')(text);
                setFormData({ ...values, mobile: text });
              }}
              containerStyle={{ flex: 1 }}
              inputWrapperStyle={{ borderWidth: 0 }}
              onBlur={handleBlur('mobile')}
              ref={mobileRef}
              showError={!!errors.mobile && touched.mobile}
              accessibilityLabel="Mobile number input"
              errorText={errors.mobile}
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
            <Button preset="reversed" textStyle={{ fontWeight: '300' }}>
              {'Sign up with email'}
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
            height: 700,
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
          handleCountrySelect({ code: item.dial_code, flag: item.flag });
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
  // TODO: Fix dimension so that its responsive
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    maxHeight: 54,
    backgroundColor: colors.palette.neutral200,
  },
  errorText: {
    color: colors.palette.error100,
    marginTop: 5,
    fontWeight: '500',
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginStart: 12,
  },
  countryCodeText: {
    textAlign: 'center',
    fontSize: 16,
    marginRight: 12,
  },
});
