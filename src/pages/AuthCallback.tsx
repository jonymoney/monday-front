import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const PARENT_ORIGIN = 'http://localhost:5173';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const userId = searchParams.get('userId');
    const error = searchParams.get('error');

    if (error) {
      console.log('Auth error:', error);
      // Try to send error to parent window
      try {
        window.opener?.postMessage(
          {
            type: 'GOOGLE_AUTH_ERROR',
            error: error
          },
          PARENT_ORIGIN
        );
      } catch (e) {
        console.error('Failed to send message to parent:', e);
      }

      setTimeout(() => {
        window.close();
      }, 2000);
      return;
    }

    if (token && email && userId) {
      console.log('Auth successful, token:', token?.substring(0, 20) + '...');

      // Try to send success message to parent window
      try {
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(
            {
              type: 'GOOGLE_AUTH_SUCCESS',
              token,
              user: { id: userId, email }
            },
            PARENT_ORIGIN
          );
          console.log('Message sent to parent');
        } else {
          console.log('No opener available, using localStorage fallback');
          // Fallback: Store in localStorage and close
          localStorage.setItem('auth_token', token);
          localStorage.setItem('pending_auth', JSON.stringify({ token, userId, email }));
        }
      } catch (e) {
        console.error('Failed to send message to parent:', e);
        // Fallback: Store in localStorage
        localStorage.setItem('auth_token', token);
        localStorage.setItem('pending_auth', JSON.stringify({ token, userId, email }));
      }

      // Close window after a short delay
      setTimeout(() => {
        window.close();
      }, 2000);
    } else {
      // No token received
      console.log('No auth data received');
      try {
        window.opener?.postMessage(
          {
            type: 'GOOGLE_AUTH_ERROR',
            error: 'No authentication data received'
          },
          PARENT_ORIGIN
        );
      } catch (e) {
        console.error('Failed to send message to parent:', e);
      }

      setTimeout(() => {
        window.close();
      }, 2000);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Authentication successful!</p>
        <p className="text-sm text-gray-500">This window will close automatically...</p>
      </div>
    </div>
  );
}
