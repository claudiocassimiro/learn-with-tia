// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://numslivtwteagmmnvwma.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51bXNsaXZ0d3RlYWdtbW52d21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwOTQ1MTksImV4cCI6MjA2MzY3MDUxOX0.gyH40j493Xl1hTAhqbJ9TQ2t3BsnlyZORFsy9XiF_Ls";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);