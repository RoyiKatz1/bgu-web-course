import express from "express";
import connection from "../database/db.js";

const router = express.Router();

// GET all workshops
router.get("/", (req, res) => {
	const query =
		"SELECT * FROM workshops WHERE is_active = TRUE ORDER BY created_at DESC";
	connection.query(query, (error, results) => {
		if (error) {
			res.status(500).json({ error: error.message });
		} else {
			res.json(results);
		}
	});
});

// GET workshop by ID
router.get("/:id", (req, res) => {
	const { id } = req.params;
	const query = "SELECT * FROM workshops WHERE id = ?";
	connection.query(query, [id], (error, results) => {
		if (error) {
			res.status(500).json({ error: error.message });
		} else if (results.length === 0) {
			res.status(404).json({ error: "Workshop not found" });
		} else {
			res.json(results[0]);
		}
	});
});

// POST create new workshop
router.post("/", (req, res) => {
	const {
		title,
		slug,
		description,
		image_path,
		price_per_person,
		capacity,
		duration_minutes,
	} = req.body;
	const query = `
		INSERT INTO workshops (title, slug, description, image_path, price_per_person, capacity, duration_minutes)
		VALUES (?, ?, ?, ?, ?, ?, ?)
	`;
	connection.query(
		query,
		[
			title,
			slug,
			description,
			image_path,
			price_per_person,
			capacity,
			duration_minutes,
		],
		(error, results) => {
			if (error) {
				res.status(500).json({ error: error.message });
			} else {
				res.status(201).json({ id: results.insertId, ...req.body });
			}
		}
	);
});

// PUT update workshop
router.put("/:id", (req, res) => {
	const { id } = req.params;
	const {
		title,
		slug,
		description,
		image_path,
		price_per_person,
		capacity,
		duration_minutes,
		is_active,
	} = req.body;
	const query = `
		UPDATE workshops 
		SET title = ?, slug = ?, description = ?, image_path = ?, 
		    price_per_person = ?, capacity = ?, duration_minutes = ?, is_active = ?
		WHERE id = ?
	`;
	connection.query(
		query,
		[
			title,
			slug,
			description,
			image_path,
			price_per_person,
			capacity,
			duration_minutes,
			is_active,
			id,
		],
		(error, results) => {
			if (error) {
				res.status(500).json({ error: error.message });
			} else {
				res.json({ id, ...req.body });
			}
		}
	);
});

// DELETE workshop (soft delete)
router.delete("/:id", (req, res) => {
	const { id } = req.params;
	const query = "UPDATE workshops SET is_active = FALSE WHERE id = ?";
	connection.query(query, [id], (error, results) => {
		if (error) {
			res.status(500).json({ error: error.message });
		} else {
			res.json({ id, deleted: true });
		}
	});
});

export default router;
