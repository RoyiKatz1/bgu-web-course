import { createClient } from "@supabase/supabase-js";
import dbConfig from "./db.config.js";

// Validate environment variables
if (!dbConfig.SUPABASE_URL || !dbConfig.SUPABASE_SERVICE_KEY) {
	console.error("❌ ERROR: Supabase credentials are not set in environment variables");
	console.error("");
	console.error("Please create a .env file in your project root with:");
	console.error("SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co");
	console.error("SUPABASE_SERVICE_KEY=your_service_role_key");
	console.error("");
	console.error("Get these from: Supabase Dashboard > Settings > API");
	console.error("  - Project URL: Use for SUPABASE_URL");
	console.error("  - service_role key (secret): Use for SUPABASE_SERVICE_KEY");
	process.exit(1);
}

// Create Supabase client
export const supabase = createClient(
	dbConfig.SUPABASE_URL,
	dbConfig.SUPABASE_SERVICE_KEY
);

console.log("✅ Supabase client initialized.");

export default supabase;
