import axiosInstance from './axiosInstance';
import {
  ConfrimRegistrationResponse,
  ConfirmUserRegistrationData,
} from '@/src/types';

/**
 * Sends registration data to the backend API.
 * @param formData - The form data collected during registration.
 * @returns The API response.
 */
export const confrimUser = async (
  formData: ConfirmUserRegistrationData,
): Promise<ConfrimRegistrationResponse> => {
  const response = await axiosInstance.post<ConfrimRegistrationResponse>(
    '/auth/confirm',
    formData,
    {
      headers: {
        skipAuthInterceptor: true,
      },
    },
  );
  return response.data;
};
