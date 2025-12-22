// Contact form functionality

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear previous errors
            clearErrors('contactFormMessage');
            
            // Get form values
            const name = document.getElementById('contactName').value.trim();
            const phone = document.getElementById('contactPhone').value.trim();
            const message = document.getElementById('message').value.trim();
            
            let isValid = true;
            
            // Validate name
            if (name.length < 2) {
                showError('contactNameError', 'שם חייב להכיל לפחות 2 תווים');
                isValid = false;
            }
            
            // Validate phone
            if (!validatePhone(phone)) {
                showError('contactPhoneError', 'מספר טלפון לא תקין');
                isValid = false;
            }
            
            if (isValid) {
                // Simulate form submission
                const messageDiv = document.getElementById('contactFormMessage');
                messageDiv.className = 'form-message form-message--success';
                messageDiv.textContent = 'תודה! הודעתכם התקבלה בהצלחה. נחזור אליכם בהקדם האפשרי.';
                
                // Reset form
                this.reset();
            }
        });
    }
});

