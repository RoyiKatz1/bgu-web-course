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
