import express from "express";
import supabase from "../database/db.js";

const router = express.Router();

// GET all bookings
router.get("/", async (req, res) => {
	try {
		const { data, error } = await supabase
			.from("bookings")
			.select(`
				*,
				workshops (
					id,
					name,
					date,
					time,
					address,
					price
				)
			`)
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

// GET booking by ID
router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { data, error } = await supabase
			.from("bookings")
			.select(`
				*,
				workshops (
					id,
					name,
					date,
					time,
					address,
					price
				)
			`)
			.eq("id", id)
			.single();

		if (error) {
			if (error.code === "PGRST116") {
				res.status(404).json({ error: "Booking not found" });
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

// POST create new booking
router.post("/", async (req, res) => {
	try {
		const {
			workshop_id,
			customer_name,
			customer_email,
			customer_phone,
			number_of_participants,
			special_requests,
			total_price,
			status,
			payment_status,
			booking_reference,
			notes,
		} = req.body;

		const { data, error } = await supabase
			.from("bookings")
			.insert([
				{
					workshop_id,
					customer_name,
					customer_email,
					customer_phone,
					number_of_participants,
					special_requests,
					total_price,
					status,
					payment_status,
					booking_reference,
					notes,
				},
			])
			.select()
			.single();

		if (error) {
			res.status(500).json({ error: error.message });
		} else {
			// Update available spots in workshop (if available_spots column exists)
			if (workshop_id) {
				const { error: updateError } = await supabase.rpc(
					"decrement_workshop_spots",
					{
						workshop_id_param: workshop_id,
						participants: number_of_participants || 1,
					}
				);

				// If RPC doesn't exist, just continue (available_spots might be calculated differently)
				if (updateError && !updateError.message.includes("function")) {
					console.warn("Could not update workshop spots:", updateError.message);
				}
			}

			res.status(201).json(data);
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// PUT update booking
router.put("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const {
			customer_name,
			customer_email,
			customer_phone,
			number_of_participants,
			special_requests,
			total_price,
			status,
			payment_status,
			booking_reference,
			notes,
		} = req.body;

		const { data, error } = await supabase
			.from("bookings")
			.update({
				customer_name,
				customer_email,
				customer_phone,
				number_of_participants,
				special_requests,
				total_price,
				status,
				payment_status,
				booking_reference,
				notes,
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

// DELETE booking
router.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params;

		// First get the booking to check if it exists
		const { data: booking, error: getError } = await supabase
			.from("bookings")
			.select("*")
			.eq("id", id)
			.single();

		if (getError) {
			if (getError.code === "PGRST116") {
				res.status(404).json({ error: "Booking not found" });
			} else {
				res.status(500).json({ error: getError.message });
			}
			return;
		}

		// Delete the booking
		const { error: deleteError } = await supabase
			.from("bookings")
			.delete()
			.eq("id", id);

		if (deleteError) {
			res.status(500).json({ error: deleteError.message });
		} else {
			// Optionally restore available spots (if needed)
			// This would require an RPC function or direct update
			res.json({ id, deleted: true });
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;