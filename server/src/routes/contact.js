import express from "express";
import connection from "../database/db.js";

const router = express.Router();

// GET all messages
router.get("/", (req, res) => {
	const query = "SELECT * FROM contact_messages ORDER BY created_at DESC";
	connection.query(query, (error, results) => {
		if (error) {
			res.status(500).json({ error: error.message });
		} else {
			res.json(results);
		}
	});
});

// GET message by ID
router.get("/:id", (req, res) => {
	const { id } = req.params;
	const query = "SELECT * FROM contact_messages WHERE id = ?";
	connection.query(query, [id], (error, results) => {
		if (error) {
			res.status(500).json({ error: error.message });
		} else if (results.length === 0) {
			res.status(404).json({ error: "Message not found" });
		} else {
			res.json(results[0]);
		}
	});
});

// POST create new message
router.post("/", (req, res) => {
	const { name, phone, email, subject, message } = req.body;
	const query = `
		INSERT INTO contact_messages (name, phone, email, subject, message)
		VALUES (?, ?, ?, ?, ?)
	`;
	connection.query(
		query,
		[name, phone, email, subject, message],
		(error, results) => {
			if (error) {
				res.status(500).json({ error: error.message });
			} else {
				res.status(201).json({ id: results.insertId, ...req.body });
			}
		}
	);
});

// PUT mark message as read
router.put("/:id/read", (req, res) => {
	const { id } = req.params;
	const query = "UPDATE contact_messages SET is_read = TRUE WHERE id = ?";
	connection.query(query, [id], (error, results) => {
		if (error) {
			res.status(500).json({ error: error.message });
		} else {
			res.json({ id, is_read: true });
		}
	});
});

// DELETE message
router.delete("/:id", (req, res) => {
	const { id } = req.params;
	const query = "DELETE FROM contact_messages WHERE id = ?";
	connection.query(query, [id], (error, results) => {
		if (error) {
			res.status(500).json({ error: error.message });
		} else {
			res.json({ id, deleted: true });
		}
	});
});

export default router;
