import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {  Eye, EyeOff, Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';
import { ToastNotification } from '../components/toast-notification';
import axios from 'axios';


const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [passwordError, setPasswordError] = useState('');

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!hasUpperCase && !hasSpecialChar) {
      return 'Password must contain at least one uppercase letter and one special character';
    } else if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter';
    } else if (!hasSpecialChar) {
      return 'Password must contain at least one special character';
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      setPasswordError(validatePassword(value));
    }
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate password before submitting
    const passwordValidationError = validatePassword(formData.password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      setToastMessage(passwordValidationError);
      setShowToast(true);
      return;
    }

    setIsLoading(true);
    setToastMessage('Creating your account...');
    setShowToast(true);

    try {
      const requestData = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };
      
      console.log('Sending signup request with data:', {
        ...requestData,
        password: '***' // Hide password in logs
      });

      const response = await axios.post('https://re-mind-eosin.vercel.app/api/v1/signup', 
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true
        }
      );

      if (response.status === 201) {
        setToastMessage('Account created successfully! Redirecting to sign in...');
        setShowToast(true);
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      console.error('Request data:', {
        name: formData.name,
        email: formData.email,
        password: '***' // Hide password in logs
      });
      
      if (error.response?.status === 409) {
        setToastMessage('Email already exists. Please sign in instead.');
        setShowToast(true);
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      } else if (error.response?.status === 500) {
        console.error('Server error details:', error.response?.data);
        setToastMessage('Validation error. Please check your input and try again.');
        setShowToast(true);
      } else {
        setToastMessage(error.response?.data?.message || 'Something went wrong. Please try again.');
        setShowToast(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-1000 ${
      isDarkMode ? 'bg-black' : 'bg-white'
    }`}>
      <ToastNotification
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        darkMode={isDarkMode}
      />
      
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className={`fixed top-6 right-6 z-20 p-3 rounded-full transition-all duration-300 ${
          isDarkMode
            ? 'bg-white/10 hover:bg-white/20 text-white'
            : 'bg-black/10 hover:bg-black/20 text-black'
        } backdrop-blur-sm border ${
          isDarkMode ? 'border-white/20' : 'border-black/20'
        }`}
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className={`w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-sm border transition-all duration-300 ${
        isDarkMode
          ? 'bg-white/5 border-white/10 hover:border-white/20'
          : 'bg-black/5 border-black/10 hover:border-black/20'
      }`}>
        <h2 className={`text-3xl font-bold mb-8 text-center transition-colors duration-300 ${
          isDarkMode ? 'text-white' : 'text-black'
        }`}>
          Create Account
        </h2>

        {/* Auth Toggle */}
        <div className={`flex rounded-xl p-1 mb-8 transition-colors duration-500 ${
          isDarkMode ? 'bg-white/10' : 'bg-black/10'
        }`}>
          <Link
            to="/signin"
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              isDarkMode
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              isDarkMode
                ? 'bg-white text-black shadow-lg'
                : 'bg-black text-white shadow-lg'
            }`}
          >
            Sign Up
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              minLength={2}
              maxLength={30}
              pattern="[A-Za-z ]+"
              title="Please enter a valid name (letters and spaces only)"
              className={`w-full px-4 py-3 rounded-xl transition-all duration-300 ${
                isDarkMode
                  ? 'bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-white/40'
                  : 'bg-black/5 border-black/20 text-black placeholder-gray-500 focus:border-black/40'
              } border focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                isDarkMode ? 'focus:ring-white' : 'focus:ring-black'
              }`}
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label htmlFor="email" className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              minLength={3}
              maxLength={30}
              pattern="[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}"
              title="Please enter a valid email address"
              className={`w-full px-4 py-3 rounded-xl transition-all duration-300 ${
                isDarkMode
                  ? 'bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-white/40'
                  : 'bg-black/5 border-black/20 text-black placeholder-gray-500 focus:border-black/40'
              } border focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                isDarkMode ? 'focus:ring-white' : 'focus:ring-black'
              }`}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                maxLength={20}
                className={`w-full px-4 py-3 rounded-xl transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-white/40'
                    : 'bg-black/5 border-black/20 text-black placeholder-gray-500 focus:border-black/40'
                } border focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                  isDarkMode ? 'focus:ring-white' : 'focus:ring-black'
                } ${passwordError ? 'border-red-500' : ''}`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors duration-300 ${
                  isDarkMode
                    ? 'text-gray-400 hover:text-white hover:bg-white/10'
                    : 'text-gray-500 hover:text-black hover:bg-black/10'
                }`}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {passwordError && (
              <p className="mt-2 text-sm text-red-500">
                {passwordError}
              </p>
            )}
            <p className="mt-2 text-sm text-gray-500">
              Password must be 6-20 characters long, contain at least one uppercase letter and one special character
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
              isDarkMode
                ? 'bg-white text-black hover:bg-gray-100'
                : 'bg-black text-white hover:bg-gray-900'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp; 