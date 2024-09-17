import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from 'react';
import * as yup from 'yup';
import { validateSchemaPartially } from '../lib/helpers';
import { Href, router } from 'expo-router';

// Define the shape of the form data
interface FormData {
  name: string;
  dob: Date;
  email: string;
  password: string;
  confirmPassword: string;
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
    dob: new Date(),
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
  },
  errors: {},
};

// Define action types
type RegistrationAction =
  | { type: 'SET_FORM_DATA'; payload: Partial<FormData> }
  | { type: 'SET_ERRORS'; payload: { [key: string]: string } }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' };

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
  ) => Promise<boolean>;
  handleSubmitStep: (
    validationSchema: yup.ObjectSchema<any>,
    fieldsToValidate: string[],
  ) => Promise<void>;
  nextStep: () => void;
  prevStep: () => void;
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

  // Function to update form data
  const setFormData = (newData: Partial<FormData>) => {
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
    ): Promise<boolean> => {
      const errors = await validateSchemaPartially(
        validationSchema,
        state.formData,
        fieldsToValidate,
      );
      console.log(state.formData);
      if (Object.keys(errors).length === 0) {
        setErrors({});
        return true;
      } else {
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
  ): Promise<void> => {
    const isValid = await validateStep(validationSchema, fieldsToValidate);
    if (isValid) {
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
    console.log(state.currentStep);
    switch (state.currentStep) {
      case 0:
        router.push('/(registration)/username');
        break;
      case 1:
        router.push('/(registration)/dob');
        break;
      case 2:
        router.push('/(registration)/mobile');
        break;
      case 3:
        router.push('/(registration)/otp');
        break;
      case 4:
        router.push('/(registration)/password');
        break;
      default:
        router.push('/(registration)/name');
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
