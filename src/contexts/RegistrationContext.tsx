import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from 'react';
import * as yup from 'yup';
import { validateSchemaPartially } from '../lib/helpers';
import { router } from 'expo-router';

// Define the shape of the form data
export interface FormData {
  name: string;
  dob: Date | null;
  email?: string;
  mobile?: string;
  OTP: string;
  password: string;
  username: string;
}

// Define the initial state and shape of the state
interface RegistrationState {
  currentStep: number;
  formData: FormData;
  errors: { [key: string]: string };
}

const initialState: RegistrationState = {
  currentStep: 0,
  formData: {
    name: '',
    dob: null,
    email: '',
    mobile: '',
    OTP: '',
    password: '',
    username: '',
  },
  errors: {},
};

// Define action types
type RegistrationAction =
  | { type: 'SET_FORM_DATA'; payload: Partial<FormData> }
  | { type: 'SET_ERRORS'; payload: { [key: string]: string } }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'CLEAR_FORM_DATA' }; // New action

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
    case 'CLEAR_FORM_DATA': // Handle clearing form data
      return {
        ...state,
        formData: initialState.formData,
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
  setErrors: (newErrors: { [key: string]: string }) => void;
  validateStep: (
    validationSchema: yup.ObjectSchema<any>,
    fieldsToValidate: string[],
    dataToValidate: Partial<FormData>,
  ) => Promise<boolean>;
  handleSubmitStep: (
    validationSchema: yup.ObjectSchema<any>,
    fieldsToValidate: string[],
    formData: Partial<FormData>,
  ) => Promise<void>;
  nextStep: () => void;
  prevStep: () => void;
  clearFormData: () => void;
}

interface RegistrationProviderProps {
  children: ReactNode;
}

// Create context
const RegistrationContext = createContext<RegistrationContextProps | undefined>(
  undefined,
);

// RegistrationProvider component
export const RegistrationProvider: React.FC<RegistrationProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(registrationReducer, initialState);
  const steps: string[] = [
    'name',
    'username',
    'dob',
    'mobile',
    'otp',
    'password',
  ];

  const clearFormData = () => {
    dispatch({ type: 'CLEAR_FORM_DATA' });
  };

  // Function to update form data
  const setFormData = (newData: Partial<FormData>) => {
    console.log({ newData });
    dispatch({ type: 'SET_FORM_DATA', payload: newData });
  };

  // Function to update errors
  const setErrors = (newErrors: { [key: string]: string }) => {
    dispatch({ type: 'SET_ERRORS', payload: newErrors });
  };

  // Function to validate a step
  const validateStep = useCallback(
    async (
      validationSchema: yup.ObjectSchema<any>,
      fieldsToValidate: string[],
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
        console.log({ errors });
        setErrors(errors);
        return false;
      }
    },
    [state.formData],
  );

  // Function to handle submitting the step
  const handleSubmitStep = async (
    validationSchema: yup.ObjectSchema<any>,
    fieldsToValidate: string[],
    formData: Partial<FormData>,
  ): Promise<void> => {
    const isValid = await validateStep(
      validationSchema,
      fieldsToValidate,
      formData,
    );
    console.log({ isValid });
    if (isValid) {
      console.log({ formData });
      setFormData(formData);
      goToNextScreen();
      nextStep();
    }
  };

  // Function to navigate to the next step
  const nextStep = () => {
    dispatch({ type: 'NEXT_STEP' });
  };

  // Function to navigate to the previous step
  const prevStep = () => {
    dispatch({ type: 'PREV_STEP' });
    router.back();
  };

  const goToNextScreen = (): void => {
    switch (state.currentStep) {
      case 0:
        router.push('/(registration)/otp');
        break;
      case 1:
        router.push('/(registration)/name');
        break;
      case 2:
        router.push('/(registration)/username');
        break;
      case 3:
        router.push('/(registration)/dob');
        break;
      case 4:
        router.push('/(registration)/password');
        break;
      default:
        router.push('/(registration)/mobile');
        break;
    }
  };

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
