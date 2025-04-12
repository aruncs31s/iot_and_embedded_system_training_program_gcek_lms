import { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthError, PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  phone?: string;
  website?: string;
  updated_at?: string;
  is_admin?: boolean;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: AuthError | PostgrestError | null }>;
  signOut: () => Promise<{ error: any | null }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: PostgrestError | null }>;
  uploadAvatar: (file: File) => Promise<{ error: Error | null, url: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    console.log('Fetching profile for user:', userId);
    try {
      // First try to get the existing profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!error && data) {
        console.log('Profile found:', data);
        setUserProfile(data);
        return data;
      }

      // If there's an error or no data, try to create a profile
      console.log('No profile found or error occurred, attempting to create one');

      // Get user data from auth
      const { data: userData } = await supabase.auth.getUser();
      console.log('User data from auth:', userData);

      if (!userData?.user) {
        console.error('No user data available to create profile');
        return null;
      }

      // Create a new profile
      const newProfile = {
        user_id: userId,
        full_name: userData.user.user_metadata?.full_name || 'User',
        email: userData.user.email || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Creating new profile with data:', newProfile);

      const { data: createdProfile, error: createError } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .single();

      if (!createError && createdProfile) {
        console.log('New profile created successfully:', createdProfile);
        setUserProfile(createdProfile);
        return createdProfile;
      } else {
        console.error('Error creating profile:', createError);

        // As a fallback, create a temporary profile in memory
        // This won't be saved to the database but will allow the UI to work
        const tempProfile = {
          id: 'temp-' + userId,
          user_id: userId,
          full_name: userData.user.user_metadata?.full_name || 'User',
          email: userData.user.email || ''
        };
        console.log('Using temporary profile:', tempProfile);
        setUserProfile(tempProfile as UserProfile);
        return tempProfile as UserProfile;
      }
    } catch (error) {
      console.error('Unexpected error in fetchProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Function to handle session state
    const handleSession = async (session: any) => {
      console.log('Handling auth session:', session);

      if (session && session.user) {
        console.log('Valid session found, setting user:', session.user.email);
        setUser(session.user);

        // Fetch or create profile
        try {
          const profile = await fetchProfile(session.user.id);
          console.log('Profile after fetch/create:', profile);

          if (!profile) {
            console.warn('No profile found or created, creating temporary profile');
            // Create a minimal profile in memory to allow UI to proceed
            const minimalProfile = {
              id: 'temp-' + session.user.id,
              user_id: session.user.id,
              full_name: session.user.user_metadata?.full_name || 'User',
              email: session.user.email || ''
            };
            setUserProfile(minimalProfile as UserProfile);
          }
        } catch (error) {
          console.error('Error handling profile during session restore:', error);
        }
      } else {
        console.log('No valid session found, clearing user state');
        setUser(null);
        setUserProfile(null);
      }

      setLoading(false);
    };

    // Check active sessions and set the user
    const initializeAuth = async () => {
      try {
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();
        await handleSession(session);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed event:', event, 'Session:', session);
      await handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Signing in with:', email);
    try {
      // Clear any previous state
      setLoading(true);

      // Attempt to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Sign in error:', error);
        setLoading(false);
        return { error };
      }

      if (data.user) {
        console.log('Sign in successful, user:', data.user);
        // Update user state immediately
        setUser(data.user);

        // Create a minimal profile in memory immediately to ensure UI can proceed
        const minimalProfile = {
          id: 'temp-' + data.user.id,
          user_id: data.user.id,
          full_name: data.user.user_metadata?.full_name || 'User',
          email: data.user.email || ''
        };
        console.log('Setting temporary profile immediately:', minimalProfile);
        setUserProfile(minimalProfile as UserProfile);

        // Try to fetch or create the real profile in the background
        console.log('Attempting to fetch/create real profile in background');
        fetchProfile(data.user.id).then(profile => {
          if (profile) {
            console.log('Real profile loaded, updating state');
            setUserProfile(profile);
          }
        }).catch(err => {
          console.error('Background profile fetch failed:', err);
          // We already have the minimal profile, so UI can continue
        }).finally(() => {
          setLoading(false);
        });
      } else {
        setLoading(false);
      }

      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error during sign in');
      console.error('Unexpected error during sign in:', error);
      setLoading(false);
      return { error: error as AuthError };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (!signUpError) {
      // Create a profile entry in the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            user_id: (await supabase.auth.getUser()).data.user?.id,
            full_name: name,
            email: email
          }
        ]);

      if (profileError) return { error: profileError };
    }

    return { error: signUpError };
  };

  const signOut = async () => {
    console.log('Signing out');
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Error signing out:', error);
      }

      // Update state immediately regardless of error
      setUser(null);
      setUserProfile(null);
      console.log('Signed out, user state cleared');

      // Clear any local storage items related to auth
      localStorage.removeItem('lms-auth-token');

      return { error: null };
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
      // Still clear the state even if there was an error
      setUser(null);
      setUserProfile(null);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      console.error('No user logged in');
      return { error: { message: 'No user logged in', details: '', hint: '', code: '' } as PostgrestError };
    }

    // Add updated_at timestamp
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('profiles')
      .update(updatedData)
      .eq('user_id', user.id);

    if (!error) {
      // Update the local userProfile state
      setUserProfile(prev => prev ? { ...prev, ...updatedData } : null);
    }

    return { error };
  };

  const uploadAvatar = async (file: File) => {
    if (!user) {
      console.error('No user logged in');
      return { error: new Error('No user logged in'), url: null };
    }

    try {
      // Check if the bucket exists, if not create it
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'avatars');

      if (!bucketExists) {
        console.log('Creating avatars bucket...');
        const { error: createBucketError } = await supabase.storage.createBucket('avatars', {
          public: true,
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
          fileSizeLimit: 5242880 // 5MB
        });

        if (createBucketError) {
          console.error('Error creating bucket:', createBucketError);
          return { error: createBucketError, url: null };
        }
      }

      // Create a unique file path for the avatar
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      console.log('Uploading file to path:', filePath);

      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        return { error: uploadError, url: null };
      }

      console.log('Upload successful, getting public URL');

      // Get the public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const avatarUrl = data.publicUrl;

      console.log('Avatar URL:', avatarUrl);

      // Update the user's profile with the new avatar URL
      const { error: updateError } = await updateProfile({ avatar_url: avatarUrl });

      if (updateError) {
        console.error('Error updating profile with avatar URL:', updateError);
        return { error: updateError, url: avatarUrl };
      }

      return { error: null, url: avatarUrl };
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return { error: error instanceof Error ? error : new Error('Unknown error'), url: null };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      signIn,
      signUp,
      signOut,
      updateProfile,
      uploadAvatar
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
