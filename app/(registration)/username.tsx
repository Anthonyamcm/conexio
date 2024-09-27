import React, {
  useRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Button, Footer, Input, Screen } from '@/src/components/atoms';
import { Header } from '@/src/components/molecules';
import { useRegistration } from '@/src/contexts/RegistrationContext';
import { colors, spacing } from '@/src/utlis';
import { MaterialIcons } from '@expo/vector-icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ActivityIndicator, StyleSheet, TextInput, View } from 'react-native';
import _ from 'lodash';

// Define FormData type
type FormValues = {
  username: string;
};

// Simulated API check with improved typing
const checkUsernameAvailability = async (
  username: string,
): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Reduced delay for better UX
  return username !== 'test'; // Mocked API check, 'test' is taken
};

// Yup schema with async validation
const usernameSchema = Yup.object().shape({
  username: Yup.string()
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
  const { state, handleSubmitStep } = useRegistration();
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const usernameRef = useRef<TextInput>(null);

  // Throttled username check for better UX than debouncing
  const handleCheckUsernameAvailability = useCallback(
    _.debounce(async (username: string) => {
      if (!username) {
        setIsAvailable(false);
        return;
      }
      setIsChecking(true);
      try {
        const available = await checkUsernameAvailability(username);
        setIsAvailable(available);
      } catch (error) {
        console.error('Error checking username availability:', error);
      } finally {
        setIsChecking(false);
      }
    }, 500),
    [],
  );

  useEffect(() => {
    return () => handleCheckUsernameAvailability.cancel();
  }, [handleCheckUsernameAvailability]);

  // Memoized submit handler
  const handleSubmit = useCallback(
    async (values: FormValues) => {
      if (!(await checkUsernameAvailability(values.username))) {
        setIsAvailable(false);
        return;
      }
      setIsAvailable(true);
      await handleSubmitStep(usernameSchema, ['username'], {
        ...values,
        username: values.username,
      });
    },
    [handleSubmitStep],
  );

  // Memoized icon color function
  const iconColor = useCallback(
    (error: string | undefined) =>
      error && !isChecking
        ? colors.palette.error100
        : colors.palette.neutral400,
    [isChecking],
  );

  // Formik usage optimized with useFormik hook
  const formik = useFormik<FormValues>({
    initialValues: { username: state.formData.username },
    validationSchema: usernameSchema,
    onSubmit: handleSubmit,
  });

  const RightAccessory = useMemo(() => {
    if (isChecking) {
      return (
        <ActivityIndicator
          size="small"
          color={colors.palette.neutral500}
          style={styles.status}
        />
      );
    }
    if (isAvailable === true && !formik.errors.username) {
      return (
        <MaterialIcons
          name="check-circle"
          size={26}
          color={colors.palette.success100}
          style={styles.status}
        />
      );
    }
    if (isAvailable === false || formik.errors.username) {
      return (
        <MaterialIcons
          name="cancel"
          size={26}
          color={colors.palette.error100}
          style={styles.status}
        />
      );
    }
    if (isAvailable === null && !formik.errors.username) return null;
  }, [isChecking, isAvailable, formik.errors.username]);

  return (
    <Screen preset="auto" contentContainerStyle={styles.container}>
      <Header
        title="What will your username be?"
        subtitle="Choose a unique username to be associated with your account."
      />
      <View style={styles.formContainer}>
        <Input
          placeholder="Username"
          LeftAccessory={() => (
            <MaterialIcons
              name="alternate-email"
              size={26}
              color={iconColor(formik.errors.username)}
              style={styles.icon}
            />
          )}
          RightAccessory={() => RightAccessory}
          value={formik.values.username}
          onChangeText={(text) => {
            formik.handleChange('username')(text);
            handleCheckUsernameAvailability(text);
          }}
          onBlur={formik.handleBlur('username')}
          ref={usernameRef}
          error={!!formik.errors.username && !isChecking}
          errorText={formik.errors.username}
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
      </View>
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
  status: {
    alignSelf: 'center',
    marginRight: 6,
  },
});
