import dotenv from "dotenv";

// Load .env from project root (dotenv looks in process.cwd() by default)
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

export default {
	SUPABASE_URL,
	SUPABASE_SERVICE_KEY,
};
