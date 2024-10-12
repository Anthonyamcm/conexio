import { QueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Number of retry attempts on failure
      refetchOnWindowFocus: false, // Disable refetching on focus (useful for React Native)
      staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

// Optional: Persist Query Cache
const asyncStoragePersistor = createAsyncStoragePersister({
  storage: AsyncStorage,
});

persistQueryClient({
  queryClient,
  persister: asyncStoragePersistor,
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
});

export default queryClient;
