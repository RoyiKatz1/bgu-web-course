// Booking form functionality

document.addEventListener('DOMContentLoaded', function() {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.setAttribute('min', today);
    }

    // Get workshop from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const workshopParam = urlParams.get('workshop');
    if (workshopParam) {
        const workshopSelect = document.getElementById('workshop');
        if (workshopSelect) {
            workshopSelect.value = workshopParam;
        }
    }

    // Form validation and submission
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear previous errors
            clearErrors('formMessage');
            
            // Get form values
            const fullName = document.getElementById('fullName').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            const participants = parseInt(document.getElementById('participants').value);
            const workshop = document.getElementById('workshop').value;
            const date = document.getElementById('date').value;
            
            let isValid = true;
            
            // Validate full name
            if (fullName.length < 2) {
                showError('fullNameError', 'שם חייב להכיל לפחות 2 תווים');
                isValid = false;
            }
            
            // Validate phone
            if (!validatePhone(phone)) {
                showError('phoneError', 'מספר טלפון לא תקין');
                isValid = false;
            }
            
            // Validate email
            if (!validateEmail(email)) {
                showError('emailError', 'כתובת אימייל לא תקינה');
                isValid = false;
            }
            
            // Validate participants
            if (participants < 1 || participants > 30) {
                showError('participantsError', 'מספר משתתפים חייב להיות בין 1 ל-30');
                isValid = false;
            }
            
            // Validate workshop
            if (!workshop) {
                showError('workshopError', 'אנא בחרו סדנה');
                isValid = false;
            }
            
            // Validate date
            if (!date) {
                showError('dateError', 'אנא בחרו תאריך');
                isValid = false;
            }
            
            if (isValid) {
                // Simulate form submission
                const messageDiv = document.getElementById('formMessage');
                messageDiv.className = 'form-message form-message--success';
                messageDiv.textContent = `ההזמנה התקבלה בהצלחה! מקומכם שמור ל-${date}. נשלח אליכם אימייל אישור בקרוב.`;
                
                // Reset form
                this.reset();
                if (dateInput) {
                    dateInput.setAttribute('min', today);
                }
            }
        });
    }
});

