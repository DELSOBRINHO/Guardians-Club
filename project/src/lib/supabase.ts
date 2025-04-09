import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Get environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if we're in development mode
const IS_DEVELOPMENT = import.meta.env.MODE === 'development' || import.meta.env.DEV === true;
console.log('Current environment mode:', import.meta.env.MODE);
console.log('IS_DEVELOPMENT value:', IS_DEVELOPMENT);
console.log('All env variables:', import.meta.env);

// Log environment variables and development mode
console.log('Supabase URL:', SUPABASE_URL);
console.log('Supabase Anon Key (first 10 chars):', SUPABASE_ANON_KEY?.substring(0, 10));
console.log('Development mode:', IS_DEVELOPMENT);
console.log('Hostname:', window.location.hostname);

// Check if environment variables are set
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Supabase URL or Anonymous Key is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
  throw new Error('Supabase configuration is missing. Please check your .env file.');
}

// Create Supabase client
console.log('Creating Supabase client with URL:', SUPABASE_URL);
console.log('Anon Key length:', SUPABASE_ANON_KEY?.length || 0);
console.log('Anon Key format check:', SUPABASE_ANON_KEY?.startsWith('eyJ') ? 'Valid JWT format' : 'Invalid format');

export const supabase: SupabaseClient<Database> = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

// Check if Supabase client was created successfully
if (!supabase) {
  console.error('Failed to create Supabase client');
  throw new Error('Failed to initialize Supabase client');
}

export type Tables = Database['public']['Tables'];
export type Profile = Tables['profiles']['Row'];
export type Content = Tables['content']['Row'];
export type Favorite = Tables['favorites']['Row'];
export type Notification = Tables['notifications']['Row'];

export interface AuthError {
  message: string;
  status?: number;
}

export async function signUp(email: string, password: string): Promise<{ data: any; error: any }> {
  console.log('Starting signup process...');
  console.log('Development mode:', IS_DEVELOPMENT);

  try {
    console.log('Signing up with email:', email);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      console.error('Signup error:', error);
      return { data: null, error };
    }

    console.log('Signup successful:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error during signup:', error);
    return { data: null, error };
  }
}

export async function signIn(email: string, password: string): Promise<void> {
  console.log('Signing in with email:', email);

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Sign in error:', error);
      throw error;
    }

    console.log('Sign in successful:', data);
  } catch (error) {
    console.error('Sign in error:', error);
    if (error instanceof Error) {
      throw { message: error.message } as AuthError;
    }
    throw { message: 'An unexpected error occurred during sign in' } as AuthError;
  }
}

export async function signOut(): Promise<void> {
  console.log('Signing out');

  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      throw error;
    }
    console.log('Sign out successful');
  } catch (error) {
    console.error('Sign out error:', error);
    if (error instanceof Error) {
      throw { message: error.message } as AuthError;
    }
    throw { message: 'An unexpected error occurred during sign out' } as AuthError;
  }
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
}

export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (error) throw error;
}

export async function getProfile(userId: string) {
  try {
    console.log('Fetching profile for user:', userId);
    
    // Try to get the profile
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (fetchError) {
      console.error('Error fetching profile:', fetchError);
      
      // If the error is not a "not found" error, throw it
      if (fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
      
      // If the profile doesn't exist, create it
      console.log('Profile not found, creating new profile');
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            email: null,
            user_type: 'user',
            avatar_url: null,
            bio: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (createError) {
        console.error('Error creating profile:', createError);
        throw createError;
      }

      console.log('New profile created:', newProfile);
      return newProfile;
    }

    console.log('Profile found:', profile);
    return profile;
  } catch (error) {
    console.error('Error in getProfile:', error);
    throw error;
  }
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateAvatar(userId: string, file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Math.random()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', userId);

  if (updateError) throw updateError;

  return publicUrl;
}

export async function getNotifications(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function markNotificationAsRead(notificationId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);

  if (error) throw error;
}