import express from "express";
import supabase from "../database/db.js";

const router = express.Router();

// GET all workshops
router.get("/", async (req, res) => {
	try {
		const { data, error } = await supabase
			.from("workshops")
			.select("*")
			.eq("is_active", true)
			.order("created_at", { ascending: false });

		if (error) {
			res.status(500).json({ error: error.message });
		} else {
			res.json(data);
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// GET workshop by ID
router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { data, error } = await supabase
			.from("workshops")
			.select("*")
			.eq("id", id)
			.single();

		if (error) {
			if (error.code === "PGRST116") {
				res.status(404).json({ error: "Workshop not found" });
			} else {
				res.status(500).json({ error: error.message });
			}
		} else {
			res.json(data);
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// POST create new workshop
router.post("/", async (req, res) => {
	try {
		const {
			name,
			slug,
			description,
			image,
			price,
			capacity,
			duration_minutes,
			date,
			time,
			instructor,
			address,
		} = req.body;

		const { data, error } = await supabase
			.from("workshops")
			.insert([
				{
					name,
					slug,
					description,
					image,
					price,
					capacity,
					duration_minutes,
					date,
					time,
					instructor,
					address,
				},
			])
			.select()
			.single();

		if (error) {
			res.status(500).json({ error: error.message });
		} else {
			res.status(201).json(data);
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// PUT update workshop
router.put("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const {
			name,
			slug,
			description,
			image,
			price,
			capacity,
			duration_minutes,
			is_active,
			date,
			time,
			instructor,
			address,
		} = req.body;

		const { data, error } = await supabase
			.from("workshops")
			.update({
				name,
				slug,
				description,
				image,
				price,
				capacity,
				duration_minutes,
				is_active,
				date,
				time,
				instructor,
				address,
			})
			.eq("id", id)
			.select()
			.single();

		if (error) {
			res.status(500).json({ error: error.message });
		} else {
			res.json(data);
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// DELETE workshop (soft delete)
router.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { data, error } = await supabase
			.from("workshops")
			.update({ is_active: false })
			.eq("id", id)
			.select()
			.single();

		if (error) {
			res.status(500).json({ error: error.message });
		} else {
			res.json({ id, deleted: true });
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;
