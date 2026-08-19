import { SupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabasePKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabasePKey)
  throw new Error("Supabase URL/Key Undefined");
// the above worked because a lack of any will give undefined and undefined is falsy by nature also && didnt work because if one is given and the other isnt it will still pass and thats not what we want.
//

const supabase = new SupabaseClient(supabaseUrl, supabasePKey);

export default supabase;
