import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api'; // فرض می‌کنیم api.js در پوشه utils است
import { jwtDecode } from 'jwt-decode'; // Assuming jwt-decode is installed
import { useAuth } from '../contexts/AuthContext'; // Import useAuth hook

const Login = () => {
  const { login: authLogin } = useAuth(); // Use the login function from AuthContext
  const [formData, setFormData] = useState({
    email: 'admin@example.com',
    password: '123456789',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // useEffect for Google Sign-In
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.initialize({
          // Replace with your actual Google Client ID
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID, // Assuming you have this in your .env
          callback: handleGoogleSignIn,
        });

        window.google.accounts.id.renderButton(
          document.getElementById('googleSignInButton'),
          {
            theme: 'outline', // You can make this dynamic based on theme if you have theme context
            size: 'large',
            width: '350', // Adjust width as needed
            text: 'signin_with', // or 'signup_with'
          }
        );
      } else {
        console.error('Google Identity Services script failed to load.');
      }
    };

    return () => {
      // Clean up the script when the component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  const handleGoogleSignIn = async (response) => {
    const credential = response.credential;
    console.log('Google Credential:', credential);

    try {
      // Decode the token (optional, but useful for getting user info on frontend)
      const decodedToken = jwtDecode(credential);
      console.log('Decoded User Info:', decodedToken);

      // --- Integration with your backend and AuthContext ---
      // This part depends on how your backend handles Google login.
      // You might need to send the `credential` to your backend
      // which then verifies it and returns your application's JWT.
      // For now, let's assume your `login` function can handle this.
      // You might need to adjust your backend and useAuth hook accordingly.

      // Example: Sending credential to backend and then using the response to log in
      const backendResponse = await fetch(`${process.env.REACT_APP_PYTHON_APP_API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credential }), // Send the Google credential
      });

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json();
        throw new Error(errorData.detail || 'Backend Google login failed');
      }

      const backendData = await backendResponse.json();

      // Assuming your backend returns your application's token and maybe user info
      if (backendData.token) {
        // Use your existing login function from AuthContext or similar logic
        // This might involve setting the received token in localStorage and context
        localStorage.setItem('token', backendData.token); // Store your app's token
        // Assuming backendData might contain user info needed for context
        // localStorage.setItem('user', JSON.stringify(backendData.user));

        // Call the login function from AuthContext if it supports setting token/user directly
        // Or you might need a separate function in AuthContext for Google login
        // Example: context.googleLogin(backendData.token, backendData.user);

        // For simplicity, let's just navigate after successful backend auth
        // You might need to trigger context update here based on your AuthContext implementation
        navigate('/chat'); // Redirect to chat page after successful login
      } else {
        throw new Error('Backend did not return an authentication token');
      }
    } catch (err) {
      console.error('Google Sign-In Error:', err);
      setError(err.message || 'خطا در ورود با گوگل');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Call your existing login function for email/password
      const response = await authLogin(formData);
      // Assuming login function handles token storage and context update internally
      navigate('/chat');
    } catch (error) {
      console.error('Login error:', error.message);
      setError(error.message || 'خطا در ورود به سیستم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            ورود به سیستم
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                ایمیل
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                placeholder="ایمیل"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                رمز عبور
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                placeholder="رمز عبور"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'در حال ورود...' : 'ورود'}
            </button>
          </div>
        </div>

        {/* Google Sign-In Button Container */}
        <div className="mt-6 flex justify-center">
          <div id="googleSignInButton"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;