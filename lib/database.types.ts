// This file contains the TypeScript types for the Supabase database schema
// Generate updated types with: npx supabase gen types typescript --project-id your-project-id > lib/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      blueprints: {
        Row: {
          id: string
          user_id: string
          name: string
          version: string
          platform: string
          explanation: string | null
          code_snippet: string | null
          steps: Json | null
          documentation: Json | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          version?: string
          platform: string
          explanation?: string | null
          code_snippet?: string | null
          steps?: Json | null
          documentation?: Json | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          version?: string
          platform?: string
          explanation?: string | null
          code_snippet?: string | null
          steps?: Json | null
          documentation?: Json | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          user_id: string
          theme: 'light' | 'dark' | 'system'
          default_platform: string
          auto_audit: boolean
          preferences: Json | null
          updated_at: string
        }
        Insert: {
          user_id: string
          theme?: 'light' | 'dark' | 'system'
          default_platform?: string
          auto_audit?: boolean
          preferences?: Json | null
          updated_at?: string
        }
        Update: {
          user_id?: string
          theme?: 'light' | 'dark' | 'system'
          default_platform?: string
          auto_audit?: boolean
          preferences?: Json | null
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          blueprint_id: string
          user_id: string | null
          security_score: number | null
          estimated_monthly_cost: string | null
          vulnerabilities: Json | null
          roi_analysis: string | null
          optimization_tips: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          blueprint_id: string
          user_id?: string | null
          security_score?: number | null
          estimated_monthly_cost?: string | null
          vulnerabilities?: Json | null
          roi_analysis?: string | null
          optimization_tips?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          blueprint_id?: string
          user_id?: string | null
          security_score?: number | null
          estimated_monthly_cost?: string | null
          vulnerabilities?: Json | null
          roi_analysis?: string | null
          optimization_tips?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
