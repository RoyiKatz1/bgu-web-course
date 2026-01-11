// Booking form functionality

let workshops = []; // Store workshops for reference

document.addEventListener("DOMContentLoaded", async function () {
	// Load workshops from API
	await loadWorkshops();

	// Get workshop from URL parameter (could be slug or id)
	const urlParams = new URLSearchParams(window.location.search);
	const workshopParam = urlParams.get("workshop");
	if (workshopParam) {
		const workshopSelect = document.getElementById("workshop");
		if (workshopSelect) {
			// Try to find workshop by slug or id
			const workshop = workshops.find(
				(w) =>
					w.slug === workshopParam ||
					w.id.toString() === workshopParam
			);
			if (workshop) {
				workshopSelect.value = workshop.id.toString();
			}
		}
	}

	// Form validation and submission
	const bookingForm = document.getElementById("bookingForm");
	if (bookingForm) {
		bookingForm.addEventListener("submit", async function (e) {
			e.preventDefault();

			// Clear previous errors
			clearErrors("formMessage");

			// Get form values
			const fullName = document.getElementById("fullName").value.trim();
			const phone = document.getElementById("phone").value.trim();
			const email = document.getElementById("email").value.trim();
			const participants = parseInt(
				document.getElementById("participants").value
			);
			const workshopId = parseInt(
				document.getElementById("workshop").value
			);
			const specialRequests = document
				.getElementById("specialRequests")
				.value.trim();

			let isValid = true;

			// Validate full name
			if (fullName.length < 2) {
				showError("fullNameError", "שם חייב להכיל לפחות 2 תווים");
				isValid = false;
			}

			// Validate phone
			if (!validatePhone(phone)) {
				showError("phoneError", "מספר טלפון לא תקין");
				isValid = false;
			}

			// Validate email
			if (!validateEmail(email)) {
				showError("emailError", "כתובת אימייל לא תקינה");
				isValid = false;
			}

			// Validate participants
			if (participants < 1 || participants > 30) {
				showError(
					"participantsError",
					"מספר משתתפים חייב להיות בין 1 ל-30"
				);
				isValid = false;
			}

			// Validate workshop
			if (!workshopId || isNaN(workshopId)) {
				showError("workshopError", "אנא בחרו סדנה");
				isValid = false;
			}

			if (isValid) {
				await submitBooking({
					fullName,
					phone,
					email,
					participants,
					workshopId,
					specialRequests,
				});
			}
		});
	}
});

/**
 * Load workshops from API and populate the dropdown
 */
async function loadWorkshops() {
	try {
		const workshopSelect = document.getElementById("workshop");
		if (!workshopSelect) return;

		// Show loading state
		workshopSelect.innerHTML = '<option value="">טוען סדנאות...</option>';

		const response = await fetch("/api/workshops");
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		workshops = await response.json();

		// Clear and populate dropdown
		workshopSelect.innerHTML = '<option value="">בחרו סדנה</option>';

		if (!workshops || workshops.length === 0) {
			workshopSelect.innerHTML =
				'<option value="">אין סדנאות זמינות</option>';
			return;
		}

		workshops.forEach((workshop) => {
			const option = document.createElement("option");
			option.value = workshop.id.toString();
			// Format date for display
			const formattedDate = workshop.date
				? formatDate(workshop.date)
				: "";
			const displayText = formattedDate
				? `${workshop.name} - ${formattedDate}`
				: workshop.name;
			option.textContent = displayText;
			workshopSelect.appendChild(option);
		});
	} catch (error) {
		console.error("Error loading workshops:", error);
		const workshopSelect = document.getElementById("workshop");
		if (workshopSelect) {
			workshopSelect.innerHTML =
				'<option value="">שגיאה בטעינת הסדנאות</option>';
		}
	}
}

/**
 * Submit booking to API
 */
async function submitBooking(formData) {
	const messageDiv = document.getElementById("formMessage");
	const submitButton = document.querySelector('button[type="submit"]');

	// Disable submit button
	if (submitButton) {
		submitButton.disabled = true;
		submitButton.textContent = "שולח...";
	}

	try {
		// Find selected workshop to get price
		const selectedWorkshop = workshops.find(
			(w) => w.id === formData.workshopId
		);
		if (!selectedWorkshop) {
			throw new Error("סדנה לא נמצאה");
		}

		// Calculate total price
		const totalPrice =
			(selectedWorkshop.price || 0) * formData.participants;

		// Generate booking reference (simple format: BK-YYYYMMDD-HHMMSS)
		const now = new Date();
		const bookingReference = `BK-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;

		// Prepare request body
		const requestBody = {
			workshop_id: formData.workshopId,
			customer_name: formData.fullName,
			customer_email: formData.email,
			customer_phone: formData.phone,
			number_of_participants: formData.participants,
			total_price: totalPrice,
			status: "pending",
			payment_status: "pending",
			booking_reference: bookingReference,
			special_requests: formData.specialRequests || null,
			notes: null,
		};

		// Submit to API
		const response = await fetch("/api/bookings", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestBody),
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.error || "שגיאה בשליחת ההזמנה");
		}

		// Success!
		messageDiv.className = "form-message form-message--success";
		const workshopDate = selectedWorkshop.date
			? formatDate(selectedWorkshop.date)
			: "";
		messageDiv.textContent = `ההזמנה התקבלה בהצלחה! מספר הזמנה: ${bookingReference}. ${workshopDate ? `מקומכם שמור ל-${workshopDate}` : ""} נשלח אליכם אימייל אישור בקרוב.`;

		// Reset form
		document.getElementById("bookingForm").reset();
	} catch (error) {
		console.error("Error submitting booking:", error);
		messageDiv.className = "form-message form-message--error";
		messageDiv.textContent =
			error.message || "שגיאה בשליחת ההזמנה. אנא נסו שוב מאוחר יותר.";
	} finally {
		// Re-enable submit button
		if (submitButton) {
			submitButton.disabled = false;
			submitButton.textContent = "אשר הזמנה";
		}
	}
}

/**
 * Format date from YYYY-MM-DD to DD/MM/YYYY
 */
function formatDate(dateString) {
	if (!dateString) return "";
	const date = new Date(dateString + "T00:00:00"); // Add time to avoid timezone issues
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();
	return `${day}/${month}/${year}`;
}
