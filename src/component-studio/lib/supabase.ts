import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Component = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id: string;
  file_path: string;
  thumbnail_url: string | null;
  props_schema: Record<string, any>;
  dependencies: string[];
  complexity_score: number;
  usage_count: number;
  is_published: boolean;
  version: string;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string | null;
  sort_order: number;
  created_at: string;
};

export type ComponentVariant = {
  id: string;
  component_id: string;
  name: string;
  description: string | null;
  props_override: Record<string, any>;
  preview_code: string | null;
  thumbnail_url: string | null;
  created_at: string;
};

export type RoadmapFeature = {
  id: string;
  title: string;
  description: string;
  status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  assignee_id: string | null;
  estimated_hours: number;
  sort_order: number;
  labels: string[];
  created_at: string;
  updated_at: string;
};
