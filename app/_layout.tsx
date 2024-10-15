import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, Stack, usePathname, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { customFontsToLoad, queryClient } from '@/src/utils';
import { QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/src/store/AuthStore';
import Toast from 'react-native-toast-message';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts(customFontsToLoad);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const needsProfileCreation = useAuthStore(
    (state) => state.needsProfileCreation,
  );
  const loading = useAuthStore((state) => state.loading);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const router = useRouter();
  const pathname = usePathname();

  // Initialize authentication on component mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Hide splash screen when fonts are loaded and authentication is not loading
  useEffect(() => {
    if (loaded && !loading) {
      SplashScreen.hideAsync().catch((error) => {
        console.warn('Error hiding splash screen:', error);
      });
    }
  }, [loaded, loading]);

  console.log(pathname);

  // Redirect based on authentication state
  useEffect(() => {
    if (!loading && loaded) {
      if (isAuthenticated) {
        if (needsProfileCreation) {
          // If user needs to create profile and not already on profile creation route
          if (!pathname.startsWith('/app/ProfileCreation')) {
            router.replace({ pathname: '/app/ProfileCreation' });
          }
        } else {
          // If authenticated and not needing profile creation, redirect to main tabs
          if (!pathname.startsWith('/app/tabs')) {
            router.replace({ pathname: '/app/tabs' });
          }
        }
      } else {
        // If not authenticated and not already in (auth) routes, redirect to /auth
        if (!pathname.startsWith('/auth')) {
          router.replace({ pathname: '/auth' });
        }
      }
    }
  }, [
    isAuthenticated,
    needsProfileCreation,
    loading,
    loaded,
    pathname,
    router,
  ]);

  // Prevent rendering until fonts are loaded and authentication is initialized
  if (!loaded || loading) {
    return null; // The splash screen remains visible
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <Slot />
        <Toast />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
