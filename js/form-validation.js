// Shared form validation utilities

/**
 * Validates Israeli phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validatePhone(phone) {
    const phoneRegex = /^0\d{1,2}-?\d{7}$/;
    return phoneRegex.test(phone);
}

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Shows an error message for a form field
 * @param {string} elementId - ID of the error element
 * @param {string} message - Error message to display
 */
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

/**
 * Clears all error messages in a form
 * @param {string} messageElementId - ID of the form message element (optional)
 */
function clearErrors(messageElementId) {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => el.textContent = '');
    
    if (messageElementId) {
        const messageDiv = document.getElementById(messageElementId);
        if (messageDiv) {
            messageDiv.textContent = '';
            messageDiv.className = 'form-message';
        }
    }
}

