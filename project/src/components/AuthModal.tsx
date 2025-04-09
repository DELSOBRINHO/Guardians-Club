import React, { useState } from 'react';
import { signIn, signUp, AuthError } from '../lib/supabase';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        console.log('Starting signup process...');
        console.log('Development mode:', isDevelopment);
        console.log('Email:', email);
        
        try {
          const { data, error } = await signUp(email, password);
          if (error) {
            console.error('Sign up error details:', error);
            
            // Mensagens de erro mais específicas
            if (error.message?.includes('email')) {
              setError('Erro com o email. Por favor, verifique e tente novamente.');
            } else if (error.message?.includes('password')) {
              setError('Erro com a senha. Por favor, verifique e tente novamente.');
            } else if (error.message?.includes('rate limit')) {
              setError('Muitas tentativas. Por favor, aguarde um momento e tente novamente.');
            } else {
              setError(error.message || 'Erro ao criar conta. Por favor, tente novamente.');
            }
            setLoading(false);
            return;
          }
          
          console.log('Signup successful');
          
          // In development mode, store credentials for auto-login
          if (isDevelopment) {
            console.log('Development mode: Storing credentials for auto-login');
            localStorage.setItem('dev_email', email);
            localStorage.setItem('dev_password', password);
          }
          
          onClose();
        } catch (signUpError) {
          console.error('Sign up error details:', signUpError);
          if (signUpError instanceof Error) {
            setError(signUpError.message);
          } else {
            setError('Erro inesperado ao criar conta. Por favor, tente novamente.');
          }
          setLoading(false);
          return;
        }
      } else {
        console.log('Signing in with email:', email);
        try {
          await signIn(email, password);
          console.log('Signin successful');
          
          // In development mode, store credentials for auto-login
          if (isDevelopment) {
            console.log('Development mode: Storing credentials for auto-login');
            localStorage.setItem('dev_email', email);
            localStorage.setItem('dev_password', password);
          }
        } catch (signInError) {
          console.error('Sign in error details:', signInError);
          // Check if it's an AuthError
          if (signInError && typeof signInError === 'object' && 'message' in signInError) {
            const authError = signInError as AuthError;
            setError(authError.message);
          } else {
            // If it's not an AuthError, show a generic error
            setError('An unexpected error occurred during sign in. Please try again.');
          }
          setLoading(false);
          return; // Exit early to prevent closing the modal
        }
      }
      
      // If we get here, authentication was successful
      onClose();
    } catch (error) {
      console.error('Authentication error:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold mb-4">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
              autoComplete="username"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-indigo-600 hover:text-indigo-500"
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}