import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function AuthCallback() {
  const navigate = useNavigate();
  const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  useEffect(() => {
    console.log('AuthCallback mounted');
    console.log('Development mode:', isDevelopment);
    console.log('Current URL:', window.location.href);
    
    // Get the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    // Get the URL hash
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');

    console.log('Processing authentication callback...');
    console.log('Code present:', !!code);
    console.log('Access token present:', !!accessToken);

    // Handle the auth callback
    const handleCallback = async () => {
      try {
        // If we have a code in the URL, exchange it for a session
        if (code) {
          console.log('Exchanging code for session...');
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            console.error('Error exchanging code for session:', error);
            throw error;
          }
          
          console.log('Code exchanged successfully, session:', !!data.session);
          navigate('/');
          return;
        }
        
        // If we have tokens in the URL, set the session
        if (accessToken && refreshToken) {
          console.log('Setting session with tokens from URL');
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error) {
            console.error('Error setting session:', error);
            throw error;
          }

          console.log('Session set successfully:', !!data.session);
          navigate('/');
          return;
        }

        console.log('No tokens in URL, checking current session');
        
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('User is authenticated');
          navigate('/');
        } else {
          console.log('No session found');
          // In development mode, try to sign in with stored credentials
          if (isDevelopment) {
            console.log('Development mode: Attempting to sign in with stored credentials');
            // This is just a fallback, in a real app you would store these securely
            const storedEmail = localStorage.getItem('dev_email');
            const storedPassword = localStorage.getItem('dev_password');
            
            if (storedEmail && storedPassword) {
              const { error: signInError } = await supabase.auth.signInWithPassword({
                email: storedEmail,
                password: storedPassword
              });
              
              if (signInError) {
                console.error('Auto sign-in error:', signInError);
              } else {
                console.log('Auto sign-in successful');
                navigate('/');
                return;
              }
            }
          }
          navigate('/');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        navigate('/');
      }
    };

    handleCallback();
  }, [navigate, isDevelopment]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Processando autenticação...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
      </div>
    </div>
  );
} 