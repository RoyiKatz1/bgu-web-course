// Shared form validation utilities

function validatePhone(phone) {
	// Remove any spaces and dashes for validation
	const cleanPhone = phone.replace(/[\s-]/g, "");
	// Must be exactly 10 digits starting with 0
	const phoneRegex = /^0\d{9}$/;
	return phoneRegex.test(cleanPhone);
}

function validateEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

function showError(elementId, message) {
	const errorElement = document.getElementById(elementId);
	if (errorElement) {
		errorElement.textContent = message;
	}
}

function clearErrors(messageElementId) {
	const errorElements = document.querySelectorAll(".error-message");
	errorElements.forEach((el) => (el.textContent = ""));

	if (messageElementId) {
		const messageDiv = document.getElementById(messageElementId);
		if (messageDiv) {
			messageDiv.textContent = "";
			messageDiv.className = "form-message";
		}
	}
}

/**
 * Format date from YYYY-MM-DD to DD/MM/YYYY
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {string} Formatted date string in DD/MM/YYYY format
 */
function formatDate(dateString) {
	if (!dateString) return "";

	try {
		const date = new Date(dateString + "T00:00:00"); // Add time to avoid timezone issues
		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const year = date.getFullYear();
		return `${day}/${month}/${year}`;
	} catch (error) {
		console.error("Error formatting date:", error);
		return dateString;
	}
}
