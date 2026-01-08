import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import type { AuditResult } from '../../types';

export const auditService = {
  async create(blueprintId: string, userId: string, audit: AuditResult): Promise<void> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured. Audit results not persisted.');
      return;
    }

    const { error } = await supabase.from('audit_logs').insert({
      blueprint_id: blueprintId,
      user_id: userId,
      security_score: audit.securityScore,
      estimated_monthly_cost: audit.estimatedMonthlyCost,
      vulnerabilities: audit.vulnerabilities as any,
      roi_analysis: audit.roiAnalysis,
      optimization_tips: audit.optimizationTips as any,
    });

    if (error) throw new Error(`Failed to save audit: ${error.message}`);
  },

  async getByBlueprint(blueprintId: string): Promise<AuditResult[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('blueprint_id', blueprintId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to get audits: ${error.message}`);

    return (data || []).map((audit) => ({
      securityScore: audit.security_score || 0,
      estimatedMonthlyCost: audit.estimated_monthly_cost || 'Unknown',
      vulnerabilities: audit.vulnerabilities as any || [],
      roiAnalysis: audit.roi_analysis || '',
      optimizationTips: audit.optimization_tips as any || [],
    }));
  },

  async getLatest(blueprintId: string): Promise<AuditResult | null> {
    if (!isSupabaseConfigured()) {
      return null;
    }

    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('blueprint_id', blueprintId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;

    return {
      securityScore: data.security_score || 0,
      estimatedMonthlyCost: data.estimated_monthly_cost || 'Unknown',
      vulnerabilities: data.vulnerabilities as any || [],
      roiAnalysis: data.roi_analysis || '',
      optimizationTips: data.optimization_tips as any || [],
    };
  },

  async deleteByBlueprint(blueprintId: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      return;
    }

    const { error } = await supabase
      .from('audit_logs')
      .delete()
      .eq('blueprint_id', blueprintId);

    if (error) throw new Error(`Failed to delete audits: ${error.message}`);
  },
};
