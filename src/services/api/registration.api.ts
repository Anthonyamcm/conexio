import axiosInstance from './axiosInstance';
import { RegisterResponse, RegistrationData } from '@/src/types';

/**
 * Sends registration data to the backend API.
 * @param formData - The form data collected during registration.
 * @returns The API response.
 */
export const registerUser = async (
  formData: RegistrationData,
): Promise<RegisterResponse> => {
  const response = await axiosInstance.post<RegisterResponse>(
    '/auth/register',
    formData,
    {
      headers: {
        skipAuthInterceptor: true,
      },
    },
  );
  return response.data;
};
