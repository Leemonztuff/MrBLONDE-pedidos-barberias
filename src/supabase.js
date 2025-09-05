import { createClient } from "@supabase/supabase-js";

// ⬇️ IMPORTANTE: Cambia estos valores por los de tu proyecto Supabase
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
