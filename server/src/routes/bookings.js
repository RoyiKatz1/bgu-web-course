import express from "express";
import connection from "../database/db.js";

const router = express.Router();

// GET all bookings
router.get("/", (req, res) => {
	const query = `
		SELECT b.*, ws.session_date, ws.session_time, ws.location, w.title as workshop_title
		FROM bookings b
		JOIN workshop_sessions ws ON b.workshop_session_id = ws.id
		JOIN workshops w ON ws.workshop_id = w.id
		ORDER BY b.created_at DESC
	`;
	connection.query(query, (error, results) => {
		if (error) {
			res.status(500).json({ error: error.message });
		} else {
			res.json(results);
		}
	});
});

// GET booking by ID
router.get("/:id", (req, res) => {
	const { id } = req.params;
	const query = `
		SELECT b.*, ws.session_date, ws.session_time, ws.location, w.title as workshop_title
		FROM bookings b
		JOIN workshop_sessions ws ON b.workshop_session_id = ws.id
		JOIN workshops w ON ws.workshop_id = w.id
		WHERE b.id = ?
	`;
	connection.query(query, [id], (error, results) => {
		if (error) {
			res.status(500).json({ error: error.message });
		} else if (results.length === 0) {
			res.status(404).json({ error: "Booking not found" });
		} else {
			res.json(results[0]);
		}
	});
});

// POST create new booking
router.post("/", (req, res) => {
	const {
		workshop_session_id,
		customer_name,
		customer_email,
		customer_phone,
		number_of_participants,
		special_requests,
		total_price,
		booking_date,
	} = req.body;

	const insertQuery = `
		INSERT INTO bookings 
		(workshop_session_id, customer_name, customer_email, customer_phone, 
		 number_of_participants, special_requests, total_price, booking_date)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	`;

	connection.query(
		insertQuery,
		[
			workshop_session_id,
			customer_name,
			customer_email,
			customer_phone,
			number_of_participants,
			special_requests,
			total_price,
			booking_date,
		],
		(error, results) => {
			if (error) {
				res.status(500).json({ error: error.message });
			} else {
				// Update available spots
				const updateQuery =
					"UPDATE workshop_sessions SET available_spots = available_spots - ? WHERE id = ?";
				connection.query(
					updateQuery,
					[number_of_participants, workshop_session_id],
					(updateError) => {
						if (updateError) {
							res.status(500).json({
								error: updateError.message,
							});
						} else {
							res.status(201).json({
								id: results.insertId,
								...req.body,
							});
						}
					}
				);
			}
		}
	);
});

// PUT update booking
router.put("/:id", (req, res) => {
	const { id } = req.params;
	const {
		customer_name,
		customer_email,
		customer_phone,
		number_of_participants,
		special_requests,
		total_price,
		status,
		booking_date,
	} = req.body;
	const query = `
		UPDATE bookings 
		SET customer_name = ?, customer_email = ?, customer_phone = ?,
		    number_of_participants = ?, special_requests = ?, total_price = ?,
		    status = ?, booking_date = ?
		WHERE id = ?
	`;
	connection.query(
		query,
		[
			customer_name,
			customer_email,
			customer_phone,
			number_of_participants,
			special_requests,
			total_price,
			status,
			booking_date,
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

// DELETE booking
router.delete("/:id", (req, res) => {
	const { id } = req.params;
	// First get the booking to restore spots
	const getQuery = "SELECT * FROM bookings WHERE id = ?";
	connection.query(getQuery, [id], (getError, bookingResults) => {
		if (getError) {
			res.status(500).json({ error: getError.message });
		} else if (bookingResults.length === 0) {
			res.status(404).json({ error: "Booking not found" });
		} else {
			const booking = bookingResults[0];
			const deleteQuery = "DELETE FROM bookings WHERE id = ?";
			connection.query(deleteQuery, [id], (deleteError) => {
				if (deleteError) {
					res.status(500).json({ error: deleteError.message });
				} else {
					// Restore available spots
					const updateQuery =
						"UPDATE workshop_sessions SET available_spots = available_spots + ? WHERE id = ?";
					connection.query(
						updateQuery,
						[
							booking.number_of_participants,
							booking.workshop_session_id,
						],
						(updateError) => {
							if (updateError) {
								res.status(500).json({
									error: updateError.message,
								});
							} else {
								res.json({ id, deleted: true });
							}
						}
					);
				}
			});
		}
	});
});

export default router;
