import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import axios from 'axios';
import { registerUser } from '../services/api/registration.api';
import { RegisterResponse } from '../types/Response/RegisterResponse';
import { RegistrationData } from '../types';

/**
 * APIError interface represents the structure of error responses from the API.
 */
interface APIError {
  status: number;
  message: string;
}

/**
 * Custom hook to handle user registration using React Query's useMutation.
 *
 * @param options - Optional React Query mutation options to customize behavior.
 * @returns The mutation object containing methods and states for the mutation.
 */
export const useRegisterUser = (
  options?: UseMutationOptions<RegisterResponse, APIError, RegistrationData>,
): UseMutationResult<RegisterResponse, APIError, RegistrationData> => {
  return useMutation<RegisterResponse, APIError, RegistrationData>({
    mutationFn: (formData: RegistrationData) => registerUser(formData),
    /**
     * Default onError handler to transform Axios errors to APIError.
     * This ensures consistent error handling across the application.
     */
    onError: (error: any, variables: any, context: any) => {
      let apiError: APIError;

      if (axios.isAxiosError(error)) {
        apiError = {
          status: error.response?.status || 500,
          message:
            error.response?.data?.message || 'An unexpected error occurred.',
        };
      } else {
        apiError = {
          status: 500,
          message: 'An unexpected error occurred.',
        };
      }

      // Optionally, log the error or perform side effects here
      console.error('Registration failed:', apiError);

      // Call the onError handler from options if provided
      if (options?.onError) {
        options.onError(apiError, variables, context);
      }
    },
    /**
     * Default onSuccess handler.
     * You can customize this based on your application's needs.
     */
    onSuccess: (data: any, variables: any, context: any) => {
      // Handle successful registration, e.g., navigate to a welcome page
      console.log('Registration successful:', data);

      // Call the onSuccess handler from options if provided
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    /**
     * Spread the options to allow overriding defaults.
     * This provides flexibility for consumers to customize the mutation behavior.
     */
    ...options,
  });
};
