import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { db } from '../storageService';
import type { SavedBlueprint, AutomationResult } from '../../types';

export interface BlueprintCreateInput {
  name: string;
  platform: string;
  explanation?: string;
  codeSnippet?: string;
  steps: any[];
  documentation?: any;
  version?: string;
  isPublic?: boolean;
}

export const blueprintService = {
  async create(userId: string, blueprint: BlueprintCreateInput): Promise<SavedBlueprint> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('blueprints')
        .insert({
          user_id: userId,
          name: blueprint.name,
          platform: blueprint.platform,
          explanation: blueprint.explanation || null,
          code_snippet: blueprint.codeSnippet || null,
          steps: blueprint.steps as any,
          documentation: blueprint.documentation || null,
          version: blueprint.version || '1.0.0',
          is_public: blueprint.isPublic || false,
        })
        .select()
        .single();

      if (error) throw new Error(`Failed to create blueprint: ${error.message}`);
      
      return this.mapToSavedBlueprint(data);
    } else {
      // Fallback to IndexedDB for offline mode
      const id = crypto.randomUUID();
      const savedBlueprint: SavedBlueprint = {
        id,
        name: blueprint.name,
        platform: blueprint.platform as any,
        explanation: blueprint.explanation || '',
        codeSnippet: blueprint.codeSnippet,
        steps: blueprint.steps,
        documentation: blueprint.documentation,
        version: blueprint.version || '1.0.0',
        timestamp: Date.now(),
      };
      await db.blueprints.add(savedBlueprint);
      return savedBlueprint;
    }
  },

  async list(userId: string): Promise<SavedBlueprint[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('blueprints')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw new Error(`Failed to list blueprints: ${error.message}`);
      
      return (data || []).map(this.mapToSavedBlueprint);
    } else {
      // Fallback to IndexedDB
      const blueprints = await db.blueprints.toArray();
      return blueprints.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    }
  },

  async get(id: string, userId?: string): Promise<SavedBlueprint> {
    if (isSupabaseConfigured()) {
      let query = supabase.from('blueprints').select('*').eq('id', id);
      
      // If userId is provided, filter by it, or allow public blueprints
      if (userId) {
        query = query.or(`user_id.eq.${userId},is_public.eq.true`);
      }

      const { data, error } = await query.single();

      if (error) throw new Error(`Failed to get blueprint: ${error.message}`);
      
      return this.mapToSavedBlueprint(data);
    } else {
      const blueprint = await db.blueprints.get(id);
      if (!blueprint) throw new Error('Blueprint not found');
      return blueprint;
    }
  },

  async update(id: string, userId: string, updates: Partial<BlueprintCreateInput>): Promise<SavedBlueprint> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('blueprints')
        .update({
          name: updates.name,
          platform: updates.platform,
          explanation: updates.explanation,
          code_snippet: updates.codeSnippet,
          steps: updates.steps as any,
          documentation: updates.documentation as any,
          version: updates.version,
          is_public: updates.isPublic,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw new Error(`Failed to update blueprint: ${error.message}`);
      
      return this.mapToSavedBlueprint(data);
    } else {
      const existing = await db.blueprints.get(id);
      if (!existing) throw new Error('Blueprint not found');
      
      const updated = { ...existing, ...updates };
      await db.blueprints.put(updated);
      return updated;
    }
  },

  async delete(id: string, userId: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('blueprints')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw new Error(`Failed to delete blueprint: ${error.message}`);
    } else {
      await db.blueprints.delete(id);
    }
  },

  async share(id: string, userId: string, isPublic: boolean): Promise<void> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('blueprints')
        .update({ is_public: isPublic })
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw new Error(`Failed to update blueprint visibility: ${error.message}`);
    }
    // IndexedDB blueprints are always private (local only)
  },

  async listPublic(limit: number = 50): Promise<SavedBlueprint[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('blueprints')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw new Error(`Failed to list public blueprints: ${error.message}`);
      
      return (data || []).map(this.mapToSavedBlueprint);
    } else {
      return []; // No public blueprints in offline mode
    }
  },

  mapToSavedBlueprint(data: any): SavedBlueprint {
    return {
      id: data.id,
      name: data.name,
      version: data.version,
      platform: data.platform,
      explanation: data.explanation || '',
      codeSnippet: data.code_snippet,
      steps: data.steps || [],
      documentation: data.documentation,
      timestamp: new Date(data.created_at).getTime(),
    };
  },
};
