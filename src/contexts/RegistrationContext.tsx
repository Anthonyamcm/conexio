import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from 'react';
import * as Yup from 'yup';
import { validateSchemaPartially } from '../lib/helpers';
import { Href, useRouter } from 'expo-router';

// Define the shape of the form data
export interface FormData {
  name: string;
  dob: Date | null;
  email?: string;
  mobile?: string;
  code: string;
  password: string;
  username: string;
}

// Define the initial state and shape of the state
interface RegistrationState {
  currentStep: number;
  formData: FormData;
  errors: Record<string, string>;
}

const initialState: RegistrationState = {
  currentStep: 0,
  formData: {
    name: '',
    dob: null,
    email: '',
    mobile: '',
    code: '',
    password: '',
    username: '',
  },
  errors: {},
};

// Define action types
type RegistrationAction =
  | { type: 'SET_FORM_DATA'; payload: Partial<FormData> }
  | { type: 'SET_ERRORS'; payload: Record<string, string> }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'CLEAR_FORM_DATA' };

// Reducer function
const registrationReducer = (
  state: RegistrationState,
  action: RegistrationAction,
): RegistrationState => {
  switch (action.type) {
    case 'SET_FORM_DATA':
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload,
        },
      };
    case 'SET_ERRORS':
      return {
        ...state,
        errors: {
          ...state.errors,
          ...action.payload,
        },
      };
    case 'NEXT_STEP':
      return { ...state, currentStep: state.currentStep + 1 };
    case 'PREV_STEP':
      return { ...state, currentStep: state.currentStep - 1 };
    case 'CLEAR_FORM_DATA':
      return {
        ...state,
        formData: initialState.formData,
        errors: {},
        currentStep: 0,
      };
    default:
      return state;
  }
};

// Define the context value type
interface RegistrationContextProps {
  state: RegistrationState;
  steps: string[];
  setFormData: (newData: Partial<FormData>) => void;
  setErrors: (newErrors: Record<string, string>) => void;
  validateStep: (
    validationSchema: Yup.ObjectSchema<any>,
    fieldsToValidate: Array<keyof FormData>,
    dataToValidate: Partial<FormData>,
  ) => Promise<boolean>;
  handleSubmitStep: (
    validationSchema: Yup.ObjectSchema<any>,
    fieldsToValidate: Array<keyof FormData>,
    formData: Partial<FormData>,
  ) => Promise<void>;
  nextStep: () => void;
  prevStep: () => void;
  clearFormData: () => void;
}

// Create context
const RegistrationContext = createContext<RegistrationContextProps | undefined>(
  undefined,
);

interface RegistrationProviderProps {
  children: ReactNode;
}

// RegistrationProvider component
export const RegistrationProvider: React.FC<RegistrationProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(registrationReducer, initialState);
  const router = useRouter();
  const steps = [
    'Name',
    'Username',
    'Date of birth',
    'Password',
    'Mobile',
    'Confirm',
  ];

  // Function to update form data
  const setFormData = useCallback((newData: Partial<FormData>) => {
    dispatch({ type: 'SET_FORM_DATA', payload: newData });
  }, []);

  // Function to update errors
  const setErrors = useCallback((newErrors: Record<string, string>) => {
    dispatch({ type: 'SET_ERRORS', payload: newErrors });
  }, []);

  // Function to navigate to the next step
  const nextStep = useCallback(() => {
    dispatch({ type: 'NEXT_STEP' });
  }, []);

  // Function to navigate to the previous step
  const prevStep = useCallback(() => {
    dispatch({ type: 'PREV_STEP' });
    router.back();
  }, [router]);

  // Function to clear form data
  const clearFormData = useCallback(() => {
    dispatch({ type: 'CLEAR_FORM_DATA' });
  }, []);

  // Function to validate a step
  const validateStep = useCallback(
    async (
      validationSchema: Yup.ObjectSchema<any>,
      fieldsToValidate: Array<keyof FormData>,
      dataToValidate: Partial<FormData>,
    ): Promise<boolean> => {
      const errors = await validateSchemaPartially(
        validationSchema,
        dataToValidate,
        fieldsToValidate,
      );
      if (Object.keys(errors).length === 0) {
        setErrors({});
        return true;
      } else {
        setErrors(errors);
        return false;
      }
    },
    [setErrors],
  );

  // Function to navigate to the appropriate screen
  const goToNextScreen = useCallback(() => {
    const stepRoutes: { [key: number]: Href<string | object> } = {
      0: '/(registration)/username',
      1: '/(registration)/dob',
      2: '/(registration)/password',
      3: '/(registration)/mobile',
      4: '/(registration)/otp',
    };

    const nextRoute = stepRoutes[state.currentStep];
    if (nextRoute) {
      router.push(nextRoute);
    } else {
      // If all steps are completed, navigate to the final screen or home
      router.push('/');
    }
  }, [router, state.currentStep]);

  // Function to handle submitting the step
  const handleSubmitStep = useCallback(
    async (
      validationSchema: Yup.ObjectSchema<any>,
      fieldsToValidate: Array<keyof FormData>,
      formData: Partial<FormData>,
    ): Promise<void> => {
      const isValid = await validateStep(
        validationSchema,
        fieldsToValidate,
        formData,
      );
      if (isValid) {
        setFormData(formData);
        nextStep();
        goToNextScreen();
      }
    },
    [validateStep, setFormData, nextStep, goToNextScreen, state.currentStep],
  );

  return (
    <RegistrationContext.Provider
      value={{
        state,
        steps,
        setFormData,
        setErrors,
        validateStep,
        handleSubmitStep,
        nextStep,
        prevStep,
        clearFormData,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

// Hook to use the RegistrationContext
export const useRegistration = (): RegistrationContextProps => {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error(
      'useRegistration must be used within a RegistrationProvider',
    );
  }
  return context;
};
