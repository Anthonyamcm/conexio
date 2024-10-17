import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from 'react';
import { Href, useRouter } from 'expo-router';

// Define the shape of the form data
export interface ProfileFormData {
  profilePicture: string; // URL or base64 string
  coverPhoto: string; // URL or base64 string
  bio: string;
  socialLinks: {
    [platformKey: string]: string; // e.g., { twitter: 'https://twitter.com/username' }
  };

  location: string;
}

// Define the state interface
interface ProfileCreationState {
  currentStep: number;
  formData: ProfileFormData;
  errors: Record<string, string>;
}

// Define the initial state
const initialState: ProfileCreationState = {
  currentStep: 0,
  formData: {
    profilePicture: '',
    coverPhoto: '',
    bio: '',
    socialLinks: {},
    location: '',
  },
  errors: {},
};

// Define action types
type ProfileCreationAction =
  | { type: 'SET_FORM_DATA'; payload: Partial<ProfileFormData> }
  | { type: 'SET_ERRORS'; payload: Record<string, string> }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'CLEAR_FORM_DATA' };

// Reducer function
const profileCreationReducer = (
  state: ProfileCreationState,
  action: ProfileCreationAction,
): ProfileCreationState => {
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
interface ProfileCreationContextProps {
  state: ProfileCreationState;
  steps: string[];
  setFormData: (newData: Partial<ProfileFormData>) => void;
  setErrors: (newErrors: Record<string, string>) => void;
  handleSubmitStep: (
    formData: Partial<ProfileFormData>,
    skip?: boolean,
  ) => void;
  nextStep: () => void;
  prevStep: () => void;
  clearFormData: () => void;
}

// Create context
const ProfileCreationContext = createContext<
  ProfileCreationContextProps | undefined
>(undefined);

// Define provider props
interface ProfileCreationProviderProps {
  children: ReactNode;
}

// ProfileCreationProvider component
export const ProfileCreationProvider: React.FC<
  ProfileCreationProviderProps
> = ({ children }) => {
  const [state, dispatch] = useReducer(profileCreationReducer, initialState);
  const router = useRouter();

  // Define the steps for profile creation
  const steps = [
    'Profile Picture',
    'Cover Photo',
    'Bio',
    'Social Links',
    'Location',
  ];

  // Function to update form data
  const setFormData = useCallback((newData: Partial<ProfileFormData>) => {
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

  // Function to navigate to the appropriate screen
  const goToNextScreen = useCallback(() => {
    const stepRoutes: { [key: number]: Href<string | object> } = {
      0: '/app/profile/create/cover-photo',
      1: '/app/profile/create/bio',
      2: '/app/profile/create/social-links',
      3: '/app/profile/create/location',
    };

    const nextRoute = stepRoutes[state.currentStep];
    if (nextRoute) {
      router.push(nextRoute);
    } else {
    }
  }, [router, state.currentStep]);

  // Function to handle submitting the step
  const handleSubmitStep = useCallback(
    (formData: Partial<ProfileFormData>, skip: boolean = false): void => {
      if (!skip) {
        // Implement your own validation logic here if needed
        // For example, check if required fields are filled
        // This example assumes all fields are optional as steps can be skipped
      }

      setFormData(formData);

      if (state.currentStep === steps.length - 1) {
        clearFormData();
        return;
      }

      nextStep();
      goToNextScreen();
    },
    [
      setFormData,
      nextStep,
      goToNextScreen,
      state.currentStep,
      steps.length,
      router,
      clearFormData,
    ],
  );

  return (
    <ProfileCreationContext.Provider
      value={{
        state,
        steps,
        setFormData,
        setErrors,
        handleSubmitStep,
        nextStep,
        prevStep,
        clearFormData,
      }}
    >
      {children}
    </ProfileCreationContext.Provider>
  );
};

// Hook to use the ProfileCreationContext
export const useProfileCreation = (): ProfileCreationContextProps => {
  const context = useContext(ProfileCreationContext);
  if (!context) {
    throw new Error(
      'useProfileCreation must be used within a ProfileCreationProvider',
    );
  }
  return context;
};
