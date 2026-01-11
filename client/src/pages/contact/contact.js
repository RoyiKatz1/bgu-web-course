// Contact form functionality

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Clear previous errors
            clearErrors('contactFormMessage');
            
            // Get form values
            const name = document.getElementById('contactName').value.trim();
            const phone = document.getElementById('contactPhone').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const subject = document.getElementById('subject').value.trim();
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
            
            // Validate email
            if (!validateEmail(email)) {
                showError('contactEmailError', 'כתובת אימייל לא תקינה');
                isValid = false;
            }
            
            // Validate message
            if (!message || message.length < 5) {
                showError('messageError', 'הודעה חייבת להכיל לפחות 5 תווים');
                isValid = false;
            }
            
            if (isValid) {
                await submitContactMessage({
                    name,
                    phone,
                    email,
                    subject: subject || null,
                    message
                });
            }
        });
    }
});

/**
 * Submit contact message to API
 */
async function submitContactMessage(formData) {
    const messageDiv = document.getElementById('contactFormMessage');
    const submitButton = document.querySelector('button[type="submit"]');
    
    // Disable submit button
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'שולח...';
    }
    
    try {
        // Prepare request body
        const requestBody = {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            subject: formData.subject,
            message: formData.message
        };
        
        // Submit to API
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'שגיאה בשליחת ההודעה');
        }
        
        // Success!
        messageDiv.className = 'form-message form-message--success';
        messageDiv.textContent = 'תודה! הודעתכם התקבלה בהצלחה. נחזור אליכם בהקדם האפשרי.';
        
        // Reset form
        document.getElementById('contactForm').reset();
    } catch (error) {
        console.error('Error submitting contact message:', error);
        messageDiv.className = 'form-message form-message--error';
        messageDiv.textContent = error.message || 'שגיאה בשליחת ההודעה. אנא נסו שוב מאוחר יותר.';
    } finally {
        // Re-enable submit button
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'שלח הודעה';
        }
    }
}

