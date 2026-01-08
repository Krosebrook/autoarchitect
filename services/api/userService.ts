import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import type { UserProfile } from '../../types';
import { storage } from '../storageService';

export const userService = {
  async getPreferences(userId: string): Promise<UserProfile['preferences'] | null> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new Error(`Failed to get preferences: ${error.message}`);
      }

      if (!data) return null;

      return {
        theme: data.theme as 'light' | 'dark' | 'system',
        defaultPlatform: data.default_platform as any,
        autoAudit: data.auto_audit,
      };
    } else {
      const profile = await storage.getProfile();
      return profile?.preferences || null;
    }
  },

  async updatePreferences(userId: string, preferences: Partial<UserProfile['preferences']>): Promise<void> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          theme: preferences.theme,
          default_platform: preferences.defaultPlatform,
          auto_audit: preferences.autoAudit,
          preferences: preferences as any,
          updated_at: new Date().toISOString(),
        });

      if (error) throw new Error(`Failed to update preferences: ${error.message}`);
    } else {
      const profile = await storage.getProfile();
      if (profile) {
        profile.preferences = { ...profile.preferences, ...preferences };
        await storage.saveProfile(profile);
      }
    }
  },

  async getProfile(userId: string): Promise<any | null> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new Error(`Failed to get profile: ${error.message}`);
      }

      return data;
    } else {
      return await storage.getProfile();
    }
  },

  async updateProfile(userId: string, updates: { full_name?: string; avatar_url?: string }): Promise<void> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: updates.full_name,
          avatar_url: updates.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw new Error(`Failed to update profile: ${error.message}`);
    }
  },
};
