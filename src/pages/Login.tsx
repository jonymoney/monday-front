import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '@/config/constants';
import { useAuth } from '@/hooks/useAuth';

const FRONTEND_ORIGIN = 'http://localhost:5173';
const POPUP_WIDTH = 500;
const POPUP_HEIGHT = 600;

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const popupRef = useRef<Window | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check for pending auth from localStorage (fallback for COOP issues)
    const checkPendingAuth = () => {
      const pendingAuth = localStorage.getItem('pending_auth');
      if (pendingAuth) {
        try {
          const { token, userId, email } = JSON.parse(pendingAuth);
          console.log('Found pending auth in localStorage');
          localStorage.removeItem('pending_auth');
          login(token, { id: userId, email });
          navigate('/');
        } catch (e) {
          console.error('Failed to parse pending auth:', e);
          localStorage.removeItem('pending_auth');
        }
      }
    };

    // Check immediately and on focus (when popup closes)
    checkPendingAuth();
    window.addEventListener('focus', checkPendingAuth);

    // Set up message listener for OAuth callback
    const handleMessage = (event: MessageEvent) => {
      // Security: Verify origin (accept messages from our own frontend)
      if (event.origin !== FRONTEND_ORIGIN) {
        console.warn('Received message from untrusted origin:', event.origin);
        return;
      }

      const { type, token, user, error: authError } = event.data;

      if (type === 'GOOGLE_AUTH_SUCCESS' && token && user) {
        console.log('Authentication successful via postMessage');

        // Store token and user
        login(token, user);

        // Close popup
        if (popupRef.current) {
          popupRef.current.close();
          popupRef.current = null;
        }

        // Clear timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        // Reset loading state
        setLoading(false);

        // Navigate to dashboard
        navigate('/');
      } else if (type === 'GOOGLE_AUTH_ERROR') {
        console.error('Authentication error:', authError);
        setError(authError || 'Authentication failed');
        setLoading(false);

        // Close popup
        if (popupRef.current) {
          popupRef.current.close();
          popupRef.current = null;
        }
      }
    };

    window.addEventListener('message', handleMessage);

    // Cleanup
    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('focus', checkPendingAuth);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (popupRef.current) {
        popupRef.current.close();
      }
    };
  }, [login, navigate]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Fetch auth URL from backend
      const response = await fetch(`${API_URL}/api/auth/google`);
      const data = await response.json();

      if (!data.authUrl) {
        throw new Error('No auth URL received from server');
      }

      // Step 2: Calculate popup position (centered)
      const left = window.screenX + (window.outerWidth - POPUP_WIDTH) / 2;
      const top = window.screenY + (window.outerHeight - POPUP_HEIGHT) / 2;

      // Step 3: Open popup window
      const popup = window.open(
        data.authUrl,
        'google-auth',
        `width=${POPUP_WIDTH},height=${POPUP_HEIGHT},left=${left},top=${top},popup=yes`
      );

      if (!popup) {
        throw new Error('Popup blocked by browser. Please allow popups for this site.');
      }

      popupRef.current = popup;

      // Step 4: Set up timeout (5 minutes)
      timeoutRef.current = setTimeout(() => {
        if (popupRef.current) {
          popupRef.current.close();
          popupRef.current = null;
        }
        setError('Authentication timeout. Please try again.');
        setLoading(false);
      }, 5 * 60 * 1000);

      // Monitor if popup is closed manually
      const checkClosed = setInterval(() => {
        if (popupRef.current?.closed) {
          clearInterval(checkClosed);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          setLoading(false);
        }
      }, 1000);

    } catch (error) {
      console.error('Failed to initiate authentication:', error);
      setError((error as Error).message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">AI Agent</h2>
          <p className="mt-2 text-gray-600">Sign in to access your personalized feed</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Waiting for authentication...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </>
          )}
        </button>

        {loading && (
          <p className="text-center text-sm text-gray-500">
            A popup window has opened. Please complete the authentication there.
          </p>
        )}
      </div>
    </div>
  );
}
