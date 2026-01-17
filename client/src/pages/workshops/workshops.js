// Workshops page functionality - fetch and display workshops from database

document.addEventListener("DOMContentLoaded", async function () {
	const workshopsGrid = document.querySelector(".workshops__grid");

	if (!workshopsGrid) {
		console.error("Workshops grid not found");
		return;
	}

	// Show loading state
	workshopsGrid.innerHTML =
		'<div class="loading-message">טוען סדנאות...</div>';

	try {
		// Fetch workshops from API
		const response = await fetch("/api/workshops");

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const workshops = await response.json();

		// Clear loading message
		workshopsGrid.innerHTML = "";

		if (!workshops || workshops.length === 0) {
			workshopsGrid.innerHTML =
				'<div class="no-workshops-message">אין סדנאות זמינות כרגע</div>';
			return;
		}

		// Render each workshop
		workshops.forEach((workshop) => {
			const workshopCard = createWorkshopCard(workshop);
			workshopsGrid.appendChild(workshopCard);
		});
	} catch (error) {
		console.error("Error fetching workshops:", error);
		workshopsGrid.innerHTML =
			'<div class="error-message">שגיאה בטעינת הסדנאות. אנא נסו שוב מאוחר יותר.</div>';
	}
});

/**
 * Create a workshop card element from workshop data
 * @param {Object} workshop - Workshop data from API
 * @returns {HTMLElement} Workshop card element
 */
function createWorkshopCard(workshop) {
	const card = document.createElement("div");
	card.className = "workshop-card";

	// Format date from YYYY-MM-DD to DD/MM/YYYY
	const formattedDate = formatDate(workshop.date);

	// Format time from HH:MM:SS to HH:MM (if needed)
	const formattedTime = formatTime(workshop.time);

	// Get image path - use workshop.image if available, otherwise use a default
	const imagePath =
		workshop.image || "/assets/images/workshops/default_workshop.jpg";
	const imageAlt = workshop.name || "סדנת קוקטיילים";

	// Use slug for booking link, fallback to workshop id
	const bookingSlug = workshop.slug || workshop.id;

	card.innerHTML = `
        <div class="workshop-card__image">
            <img src="${imagePath}" alt="${imageAlt}">
        </div>
        <div class="workshop-card__content">
            <h3 class="workshop-card__title">${escapeHtml(workshop.name || "סדנת קוקטיילים")}</h3>
            <p class="workshop-card__description">${formatDescription(workshop.description || "")}</p>
            <div class="workshop-card__details">
                ${workshop.date ? `<p class="workshop-card__date"><strong>תאריך:</strong> ${formattedDate}</p>` : ""}
                ${workshop.time ? `<p class="workshop-card__time"><strong>שעה:</strong> ${formattedTime}</p>` : ""}
                ${workshop.instructor ? `<p class="workshop-card__instructor"><strong>מדריך:</strong> ${escapeHtml(workshop.instructor)}</p>` : ""}
                ${workshop.address ? `<p class="workshop-card__location"><strong>מיקום:</strong> ${escapeHtml(workshop.address)}</p>` : ""}
                ${workshop.price ? `<p class="workshop-card__price"><strong>מחיר:</strong> ₪${parseFloat(workshop.price).toFixed(0)} לאדם</p>` : ""}
            </div>
            <a href="/book?workshop=${encodeURIComponent(bookingSlug)}" class="btn btn--primary">הזמן עכשיו</a>
        </div>
    `;

	return card;
}

/**
 * Format time from HH:MM:SS to HH:MM
 * @param {string} timeString - Time string (HH:MM:SS or HH:MM)
 * @returns {string} Formatted time string in HH:MM format
 */
function formatTime(timeString) {
	if (!timeString) return "";

	// If time is already in HH:MM format, return as is
	if (timeString.length === 5) {
		return timeString;
	}

	// If time is in HH:MM:SS format, extract HH:MM
	if (timeString.length >= 5) {
		return timeString.substring(0, 5);
	}

	return timeString;
}

/**
 * Format description text - preserve line breaks from database
 * @param {string} description - Description text
 * @returns {string} HTML formatted description
 */
function formatDescription(description) {
	if (!description) return "";

	// Escape HTML and replace newlines with <br /> tags
	const escaped = escapeHtml(description);
	return escaped.replace(/\n/g, "<br />");
}

/**
 * Escape HTML to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped HTML
 */
function escapeHtml(text) {
	const div = document.createElement("div");
	div.textContent = text;
	return div.innerHTML;
}
