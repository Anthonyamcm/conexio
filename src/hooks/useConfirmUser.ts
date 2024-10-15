import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import axios from 'axios';
import {
  ConfirmUserRegistrationData,
  ConfrimRegistrationResponse,
} from '../types';
import { confrimUser } from '../services/api/confirm.api';
import { useAuthStore } from '../store/AuthStore';

/**
 * APIError interface represents the structure of error responses from the API.
 */
interface APIError {
  status: number;
  message: string;
}

/**
 * Custom hook to handle user confirmation using React Query's useMutation.
 *
 * @param options - Optional React Query mutation options to customize behavior.
 * @returns The mutation object containing methods and states for the mutation.
 */
export const useConfrimUser = (
  options?: UseMutationOptions<
    ConfrimRegistrationResponse,
    APIError,
    ConfirmUserRegistrationData
  >,
): UseMutationResult<
  ConfrimRegistrationResponse,
  APIError,
  ConfirmUserRegistrationData
> => {
  const login = useAuthStore((state) => state.login);

  return useMutation<
    ConfrimRegistrationResponse,
    APIError,
    ConfirmUserRegistrationData
  >({
    mutationFn: (formData: ConfirmUserRegistrationData) =>
      confrimUser(formData),
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
      console.error('Confirmation failed:', apiError);

      // Call the onError handler from options if provided
      if (options?.onError) {
        options.onError(apiError, variables, context);
      }
    },
    /**
     * Default onSuccess handler.
     * You can customize this based on your application's needs.
     */
    onSuccess: async (data: any, variables: any, context: any) => {
      try {
        await login(data.AccessToken, data.RefreshToken);
      } catch (error) {
        console.error('Login error:', error);
      }
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options,
  });
};
