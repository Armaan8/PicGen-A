import { toDateTime } from '@/lib/helpers';
import { createClient } from '@supabase/supabase-js';
import type { Json, Tables, TablesInsert } from '@datatypes.types';

type Product = Tables<'products'>;

export const supabaseAdmin = createClient(
    process.env.SUPABASE_URL || "", 
    process.env.SUPABASE_SERVICE_ROLE_KEY|| ""
)

