import express from "express";
import supabase from "../database/db.js";

const router = express.Router();

// GET random testimonials (3 approved testimonials)
router.get("/", async (req, res) => {
	try {
		const { data, error } = await supabase
			.from("testimonials")
			.select("*")
			.eq("is_approved", true)
			.order("created_at", { ascending: false });

		if (error) {
			console.error("Error fetching testimonials:", error);
			res.status(500).json({ error: error.message });
			return;
		}

		// If we have testimonials, randomly select 3
		if (data && data.length > 0) {
			// Shuffle the array and take first 3
			const shuffled = data.sort(() => 0.5 - Math.random());
			const randomThree = shuffled.slice(0, 3);
			res.json(randomThree);
		} else {
			// Return empty array if no testimonials found
			res.json([]);
		}
	} catch (error) {
		console.error("Error in testimonials route:", error);
		res.status(500).json({ error: error.message });
	}
});

export default router;
