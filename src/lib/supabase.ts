import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          role: 'donor' | 'site_admin' | 'main_admin' | 'rotary_member';
          is_rotary_member: boolean;
          rotary_member_id: string | null;
          address: string | null;
          city: string;
          country: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: 'donor' | 'site_admin' | 'main_admin' | 'rotary_member';
          is_rotary_member?: boolean;
          rotary_member_id?: string | null;
          address?: string | null;
          city?: string;
          country?: string;
        };
        Update: {
          email?: string;
          full_name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: 'donor' | 'site_admin' | 'main_admin' | 'rotary_member';
          is_rotary_member?: boolean;
          rotary_member_id?: string | null;
          address?: string | null;
          city?: string;
          country?: string;
        };
      };
      planting_sites: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          latitude: number;
          longitude: number;
          address: string | null;
          target_trees: number;
          planted_trees: number;
          site_area: number | null;
          status: 'planning' | 'active' | 'completed' | 'maintenance';
          site_admin_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          description?: string | null;
          latitude: number;
          longitude: number;
          address?: string | null;
          target_trees?: number;
          planted_trees?: number;
          site_area?: number | null;
          status?: 'planning' | 'active' | 'completed' | 'maintenance';
          site_admin_id?: string | null;
        };
        Update: {
          name?: string;
          description?: string | null;
          latitude?: number;
          longitude?: number;
          address?: string | null;
          target_trees?: number;
          planted_trees?: number;
          site_area?: number | null;
          status?: 'planning' | 'active' | 'completed' | 'maintenance';
          site_admin_id?: string | null;
        };
      };
      donations: {
        Row: {
          id: string;
          user_id: string;
          site_id: string | null;
          amount: number;
          trees_count: number;
          tree_species: string;
          payment_method: string;
          payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
          esewa_transaction_id: string | null;
          esewa_ref_id: string | null;
          donation_message: string | null;
          is_anonymous: boolean;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          user_id: string;
          site_id?: string | null;
          amount: number;
          trees_count: number;
          tree_species: string;
          payment_method?: string;
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded';
          esewa_transaction_id?: string | null;
          esewa_ref_id?: string | null;
          donation_message?: string | null;
          is_anonymous?: boolean;
          completed_at?: string | null;
        };
        Update: {
          site_id?: string | null;
          amount?: number;
          trees_count?: number;
          tree_species?: string;
          payment_method?: string;
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded';
          esewa_transaction_id?: string | null;
          esewa_ref_id?: string | null;
          donation_message?: string | null;
          is_anonymous?: boolean;
          completed_at?: string | null;
        };
      };
      trees: {
        Row: {
          id: string;
          donation_id: string | null;
          site_id: string;
          species: string;
          planted_date: string | null;
          latitude: number | null;
          longitude: number | null;
          status: 'planted' | 'growing' | 'mature' | 'deceased';
          height_cm: number | null;
          diameter_cm: number | null;
          health_score: number | null;
          notes: string | null;
          planted_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          donation_id?: string | null;
          site_id: string;
          species: string;
          planted_date?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          status?: 'planted' | 'growing' | 'mature' | 'deceased';
          height_cm?: number | null;
          diameter_cm?: number | null;
          health_score?: number | null;
          notes?: string | null;
          planted_by?: string | null;
        };
        Update: {
          donation_id?: string | null;
          site_id?: string;
          species?: string;
          planted_date?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          status?: 'planted' | 'growing' | 'mature' | 'deceased';
          height_cm?: number | null;
          diameter_cm?: number | null;
          health_score?: number | null;
          notes?: string | null;
          planted_by?: string | null;
        };
      };
      impact_metrics: {
        Row: {
          id: string;
          site_id: string | null;
          metric_date: string;
          co2_absorbed_kg: number;
          oxygen_produced_kg: number;
          water_filtered_liters: number;
          soil_improved_sqm: number;
          wildlife_species_count: number;
          calculated_at: string;
        };
      };
      site_updates: {
        Row: {
          id: string;
          site_id: string;
          admin_id: string;
          title: string;
          description: string;
          update_type: string;
          images: string[] | null;
          trees_planted_count: number;
          created_at: string;
        };
        Insert: {
          site_id: string;
          admin_id: string;
          title: string;
          description: string;
          update_type?: string;
          images?: string[] | null;
          trees_planted_count?: number;
        };
      };
    };
  };
};