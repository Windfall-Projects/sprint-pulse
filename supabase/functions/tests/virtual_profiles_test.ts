import { assertEquals, assertExists } from "std/assert";
import "std/dotenv/load";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../../../packages/shared/src/database.types.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? Deno.env.get("API_URL") ?? "http://127.0.0.1:54321";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SERVICE_ROLE_KEY") ?? "testkey";

Deno.test({
    name: "Virtual Profiles Lifecycle",
    sanitizeOps: false,
    sanitizeResources: false,
    fn: async () => {
    }
});
