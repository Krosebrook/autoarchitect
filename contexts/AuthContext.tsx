import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ user: User | null; error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: AuthError | null }>;
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isSupabaseEnabled: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const isSupabaseEnabled = isSupabaseConfigured();

  useEffect(() => {
    if (!isSupabaseEnabled) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isSupabaseEnabled]);

  const signUp = async (email: string, password: string, fullName?: string) => {
    if (!isSupabaseEnabled) {
      toast.error('Authentication not configured');
      return { user: null, error: { message: 'Supabase not configured' } as AuthError };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      return { user: null, error };
    }

    // Create profile in profiles table
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        email: data.user.email!,
        full_name: fullName || null,
        role: 'user',
      });
      
      toast.success('Account created! Please check your email to verify.');
    }

    return { user: data.user, error: null };
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseEnabled) {
      toast.error('Authentication not configured');
      return { user: null, error: { message: 'Supabase not configured' } as AuthError };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      return { user: null, error };
    }

    toast.success('Signed in successfully!');
    return { user: data.user, error: null };
  };

  const signInWithGithub = async () => {
    if (!isSupabaseEnabled) {
      toast.error('Authentication not configured');
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error(error.message);
    }
  };

  const signOut = async () => {
    if (!isSupabaseEnabled) {
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Signed out successfully');
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGithub,
    signOut,
    isAuthenticated: !!user,
    isSupabaseEnabled,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
