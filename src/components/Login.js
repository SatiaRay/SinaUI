import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";
import NetworkBackground3D from "./NetworkBackground3D";

const Login = () => {
  const { login: authLogin, user } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false);
  const navigate = useNavigate();



  const initializeGoogleSignIn = () => {
    if (!window.google?.accounts?.id) {
      console.error("Google Identity Services not available");
      return;
    }

    console.log("Initializing Google Sign-In");
    try {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleGoogleSignIn,
        auto_select: false,
        context: "signin",
      });

      const googleButtonDiv = document.getElementById("googleSignInButton");
      if (googleButtonDiv && !googleButtonDiv.hasChildNodes()) {
        console.log("Rendering Google Sign-In button");
        window.google.accounts.id.renderButton(googleButtonDiv, {
          theme: "filled_blue",
          size: "large",
          width: "380",
          text: "continue_with",
          shape: "rectangular",
        });
      }
    } catch (err) {
      console.error("Error initializing Google Sign-In:", err);
      setError("Failed to initialize Google sign-in");
    }
  };

  const handleGoogleSignIn = async (response) => {
    setLoading(true);
    setError("");

    try {
      const credential = response.credential;
      console.log("Google Credential:", credential);

      const decodedToken = jwtDecode(credential);
      console.log("Decoded User Info:", decodedToken);

      const backendResponse = await fetch(
        `${process.env.REACT_APP_CHAT_API_URL}/auth/google`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: credential }),
        }
      );

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json();
        console.error("Backend Response Error:", errorData);
        throw new Error(errorData.detail || "Google login failed");
      }

      const backendData = await backendResponse.json();
      console.log("Backend Response Data:", backendData);

      if (!backendData.token) {
        throw new Error("No authentication token received");
      }

      localStorage.setItem("token", backendData.token);
      localStorage.setItem("user", JSON.stringify(backendData.user));

      await authLogin({ token: backendData.token, user: backendData.user });

      navigate("/chat", { replace: true });
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      setError(err.message || "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.email || !formData.password) {
      setError('ایمیل و رمز عبور الزامی است');
      return;
    }
  
    setLoading(true);
    setError("");

    try {
      await authLogin(formData.email, formData.password);
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };
  useEffect(() => {
    if (user) {
      console.log("User is authenticated, redirecting to /chat");
      navigate("/chat", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    initializeGoogleSignIn()
    if (googleScriptLoaded || window.google?.accounts?.id) return;

    console.log("Loading Google script...");
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log("Google script loaded");
      setGoogleScriptLoaded(true);
      initializeGoogleSignIn();
    };
    script.onerror = () => {
      console.error("Error loading Google Identity Services script");
      setError("Failed to load Google sign-in script");
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [googleScriptLoaded]);

  return (
    <div className="min-h-screen w-full px-4 flex items-center justify-center relative overflow-hidden">
      <NetworkBackground3D />
      <div className="relative max-w-md z-10 w-full space-y-8 backdrop-blur-lg px-4 py-7 md:p-8 rounded-xl shadow-2xl border border-gray-700/50 animate-fade-in">
        <h2 className="mt-3 text-center text-2xl font-bold tracking-tight text-white">
          ورود به سیستم
        </h2>

        {error && (
          <div className="text-red-400 text-sm text-center animate-pulse">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-6 w-full" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-4 py-2 border border-gray-600/50 bg-gray-800/50 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
                placeholder="ایمیل"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-2 border border-gray-600/50 bg-gray-800/50 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
                placeholder="رمز عبور"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-4 w-full">
            <div className="flex items-center justify-between w-full gap-2">
              <button
                type="submit"
                disabled={loading}
                className={`group relative flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-50"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.272A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "ورود"
                )}
              </button>
              <button
                type="button"
                onClick={handleRegister}
                className="relative flex-1 flex justify-center py-2 px-4 border border-gray-600 rounded-md text-sm font-semibold text-white bg-transparent hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
              >
                ثبت نام
              </button>
            </div>

            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-sm">یا</span>
              <div className="flex-grow border-t border-gray-600"></div>
            </div>

            <div className="flex w-full justify-center">
              <div
                id="googleSignInButton"
                className="w-full flex justify-center"
              />
            </div>
          </div>
        </form>

        <div className="text-center text-sm text-gray-400">
          حساب کاربری ندارید؟{' '}
          <button 
            onClick={handleRegister}
            className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
          >
            همین حالا ثبت نام کنید
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;