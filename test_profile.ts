import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "http://127.0.0.1:54321";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

async function main() {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data, error } = await supabase.from('profiles').select('*').limit(1);
    console.log("Data:", data, "Error:", error);
}

main();
