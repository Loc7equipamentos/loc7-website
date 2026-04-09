import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hmmxxvurfvrdvlkfbbah.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtbXh4dnVyZnZyZHZsa2ZiYmFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MjEyOTksImV4cCI6MjA5MTI5NzI5OX0.nt4jBcvySZNS72Ca9BArwpthYh_kQ6a4vAjEKpUYu68';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image_url?: string;
  badge?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  created_at?: string;
}
