import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, Profile, getProfile } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider mounted, getting initial session...');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session ? 'Present' : 'None');
      setUser(session?.user ?? null);
      if (session?.user) {
        console.log('User found in session, fetching profile...');
        getProfile(session.user.id)
          .then(profile => {
            console.log('Profile fetched successfully:', profile ? 'Present' : 'None');
            setProfile(profile);
          })
          .catch(err => {
            console.error('Error fetching profile:', err);
          });
      }
    });

    // Listen for auth changes
    console.log('Setting up auth state change listener...');
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session ? 'Session present' : 'No session');
      setUser(session?.user ?? null);
      if (session?.user) {
        try {
          console.log('User found in session, fetching profile...');
          const profile = await getProfile(session.user.id);
          console.log('Profile fetched successfully:', profile ? 'Present' : 'None');
          setProfile(profile);
        } catch (err) {
          console.error('Error fetching profile:', err);
          setProfile(null);
        }
      } else {
        console.log('No user in session, clearing profile');
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up auth state change listener...');
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}