import * as SecureStore from 'expo-secure-store';

const AUTH_TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

/**
 * Retrieve Auth Token
 * @returns Promise containing auth token or null
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
    return token;
  } catch (error) {
    console.error('Error retrieving auth token from SecureStore', error);
    return null;
  }
};

/**
 * Retrieve Refresh Token
 * @returns Promise containing refresh token or null
 */
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    const token = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    return token;
  } catch (error) {
    console.error('Error retrieving refresh token from SecureStore', error);
    return null;
  }
};

/**
 * Set Auth Token
 * @param token - New authentication token
 */
export const setAuthToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
  } catch (error) {
    console.error('Error setting auth token in SecureStore', error);
    throw error;
  }
};

/**
 * Set Refresh Token
 * @param refreshToken - New refresh token
 */
export const setRefreshToken = async (refreshToken: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
  } catch (error) {
    console.error('Error setting refresh token in SecureStore', error);
    throw error;
  }
};

/**
 * Clear All Tokens
 */
export const clearAllTokens = async (): Promise<void> => {
  try {
    await Promise.all([
      SecureStore.deleteItemAsync(AUTH_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);
  } catch (error) {
    console.error('Error clearing tokens from SecureStore', error);
  }
};
