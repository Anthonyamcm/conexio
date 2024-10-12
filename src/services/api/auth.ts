import * as Keychain from 'react-native-keychain';
import { User } from '@/src/config';

// Define interfaces
interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}

interface LogoutResponse {
  message: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login Function
 * @param credentials - User login credentials
 * @returns Promise containing login response
 */
// export const login = async (
//   credentials: LoginRequest,
// ): Promise<LoginResponse> => {
//   const response: AxiosResponse<LoginResponse> = await axiosInstance.post(
//     '/auth/login',
//     credentials,
//   );
//   const { token, refreshToken } = response.data;

//   // Store tokens securely using Keychain
//   await Keychain.setGenericPassword('authToken', token);
//   await Keychain.setGenericPassword('refreshToken', refreshToken);

//   return response.data;
// };

// /**
//  * Logout Function
//  * @returns Promise containing logout response
//  */
// export const logout = async (): Promise<LogoutResponse> => {
//   const response: AxiosResponse<LogoutResponse> =
//     await axiosInstance.post('/auth/logout');

//   // Remove tokens from storage
//   await Keychain.resetGenericPassword();

//   return response.data;
// };

/**
 * Retrieve Auth Token
 * @returns Promise containing auth token or null
 */
export const getAuthToken = async (): Promise<string | null> => {
  const credentials = await Keychain.getGenericPassword({
    service: 'authToken',
  });
  if (credentials) {
    return credentials.password;
  }
  return null;
};

/**
 * Retrieve Refresh Token
 * @returns Promise containing refresh token or null
 */
export const getRefreshToken = async (): Promise<string | null> => {
  const credentials = await Keychain.getGenericPassword({
    service: 'refreshToken',
  });
  if (credentials) {
    return credentials.password;
  }
  return null;
};

/**
 * Set Auth Token
 * @param token - New authentication token
 */
export const setAuthToken = async (token: string): Promise<void> => {
  await Keychain.setGenericPassword('authToken', token, {
    service: 'authToken',
  });
};

/**
 * Set Refresh Token
 * @param refreshToken - New refresh token
 */
export const setRefreshToken = async (refreshToken: string): Promise<void> => {
  await Keychain.setGenericPassword('refreshToken', refreshToken, {
    service: 'refreshToken',
  });
};
