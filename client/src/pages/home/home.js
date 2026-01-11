// Fetch and display testimonials from the API
async function loadTestimonials() {
    const testimonialsGrid = document.querySelector(".testimonials__grid");

    // Show loading state
    testimonialsGrid.innerHTML = `
        <div class="testimonial">
            <p class="testimonial__text">טוען המלצות...</p>
        </div>
    `;

    try {
        const response = await fetch("/api/testimonials");

        if (!response.ok) {
            throw new Error("Failed to fetch testimonials");
        }

        const testimonials = await response.json();

        // Clear loading state
        testimonialsGrid.innerHTML = "";

        // If we have testimonials, display them
        if (testimonials && testimonials.length > 0) {
            testimonials.forEach((testimonial) => {
                const testimonialElement = document.createElement("div");
                testimonialElement.className = "testimonial";

                testimonialElement.innerHTML = `
                    <p class="testimonial__text">"${testimonial.quote}"</p>
                    <p class="testimonial__author">- ${testimonial.person_name}</p>
                `;

                testimonialsGrid.appendChild(testimonialElement);
            });
        } else {
            // If no testimonials, show a message
            testimonialsGrid.innerHTML = `
                <div class="testimonial">
                    <p class="testimonial__text">אין המלצות להצגה כרגע.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error("Error loading testimonials:", error);

        // Show error message
        testimonialsGrid.innerHTML = `
            <div class="testimonial">
                <p class="testimonial__text">אירעה שגיאה בטעינת ההמלצות. אנא נסה שוב מאוחר יותר.</p>
            </div>
        `;
    }
}

// Load testimonials when page loads
document.addEventListener("DOMContentLoaded", loadTestimonials);
