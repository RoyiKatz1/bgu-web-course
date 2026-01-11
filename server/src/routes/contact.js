import express from "express";
import supabase from "../database/db.js";

const router = express.Router();

// GET all messages
router.get("/", async (req, res) => {
	try {
		const { data, error } = await supabase
			.from("contact_messages")
			.select("*")
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

// GET message by ID
router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { data, error } = await supabase
			.from("contact_messages")
			.select("*")
			.eq("id", id)
			.single();

		if (error) {
			if (error.code === "PGRST116") {
				res.status(404).json({ error: "Message not found" });
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

// POST create new message
router.post("/", async (req, res) => {
	try {
		const { name, phone, email, subject, message } = req.body;

		const { data, error } = await supabase
			.from("contact_messages")
			.insert([
				{
					name,
					phone,
					email,
					subject,
					message,
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

// PUT mark message as read
router.put("/:id/read", async (req, res) => {
	try {
		const { id } = req.params;
		const { data, error } = await supabase
			.from("contact_messages")
			.update({ is_read: true })
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

// DELETE message
router.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { error } = await supabase
			.from("contact_messages")
			.delete()
			.eq("id", id);

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