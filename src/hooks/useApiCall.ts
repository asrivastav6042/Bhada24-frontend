import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ensureValidToken } from '@/services/authService';

interface UseApiCallOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  redirectOnAuthError?: boolean;
  showErrorToast?: boolean;
}

/**
 * Custom hook for making API calls with automatic token management
 * Handles loading states, errors, and token refresh automatically
 */
export function useApiCall<T = any>(options: UseApiCallOptions = {}) {
  const {
    onSuccess,
    onError,
    redirectOnAuthError = true,
    showErrorToast = true,
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const execute = useCallback(
    async <R = T>(
      apiCall: () => Promise<R>,
      customOptions?: Partial<UseApiCallOptions>
    ): Promise<R | null> => {
      const mergedOptions = { ...options, ...customOptions };
      
      setLoading(true);
      setError(null);

      try {
        // Ensure we have a valid token before making the call
        const token = await ensureValidToken();

        if (!token) {
          throw new Error('Authentication required');
        }

        // Execute the API call
        const result = await apiCall();
        
        setData(result as any);
        
        if (mergedOptions.onSuccess) {
          mergedOptions.onSuccess(result);
        }
        
        return result;
      } catch (err: any) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);

        // Check if it's an authentication error
        const isAuthError = 
          error.message.includes('401') ||
          error.message.includes('token') ||
          error.message.includes('Authentication required') ||
          error.message.includes('Unauthorized');

        if (isAuthError) {
          if (mergedOptions.showErrorToast ?? showErrorToast) {
            toast({
              title: 'Session Expired',
              description: 'Please login again to continue',
              variant: 'destructive',
            });
          }

          if (mergedOptions.redirectOnAuthError ?? redirectOnAuthError) {
            // Store current path for redirect after login
            try {
              localStorage.setItem('redirectAfterLogin', window.location.pathname);
            } catch (e) {
              // ignore
            }
            navigate('/login');
          }
        } else {
          // Generic error handling
          if (mergedOptions.showErrorToast ?? showErrorToast) {
            toast({
              title: 'Error',
              description: error.message || 'An error occurred. Please try again.',
              variant: 'destructive',
            });
          }
        }

        if (mergedOptions.onError || onError) {
          (mergedOptions.onError || onError)?.(error);
        }

        return null;
      } finally {
        setLoading(false);
      }
    },
    [navigate, toast, onSuccess, onError, redirectOnAuthError, showErrorToast]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    execute,
    loading,
    error,
    data,
    reset,
  };
}
