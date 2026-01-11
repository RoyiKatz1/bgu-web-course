# Mixology Hub - Database Schema

## Overview

This document outlines the database tables needed for the Mixology Hub cocktail workshop booking website.

## Tables

### 1. `testimonials`

Stores customer testimonials for display on the website.

| Column        | Type         | Constraints                 | Description                                  |
| ------------- | ------------ | --------------------------- | -------------------------------------------- |
| `id`          | INT          | PRIMARY KEY, AUTO_INCREMENT | Unique testimonial identifier                |
| `person_name` | VARCHAR(255) | NOT NULL                    | Name of the person giving the testimonial    |
| `quote`       | TEXT         | NOT NULL                    | The testimonial quote/text                   |
| `is_approved` | BOOLEAN      | DEFAULT FALSE               | Whether to display publicly (for moderation) |
| `created_at`  | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP   | Record creation time                         |

### 2. `workshops`

Stores information about available cocktail workshops.

| Column             | Type          | Constraints                                           | Description                                      |
| ------------------ | ------------- | ----------------------------------------------------- | ------------------------------------------------ |
| `id`               | INT           | PRIMARY KEY, AUTO_INCREMENT                           | Unique workshop identifier                       |
| `name`             | VARCHAR(255)  | NOT NULL                                              | Workshop name (e.g., "סדנת קוקטיילים קלאסיים")   |
| `image`            | VARCHAR(500)  |                                                       | Path to workshop image                           |
| `description`      | TEXT          | NOT NULL                                              | Detailed workshop description                    |
| `date`             | DATE          | NOT NULL                                              | Workshop date                                    |
| `time`             | TIME          | NOT NULL                                              | Workshop start time                              |
| `instructor`       | VARCHAR(255)  | NOT NULL                                              | Instructor name                                  |
| `address`          | VARCHAR(500)  | NOT NULL                                              | Workshop location address                        |
| `price`            | DECIMAL(10,2) | NOT NULL                                              | Price per participant                            |
| `capacity`         | INT           | NOT NULL, DEFAULT 30                                  | Maximum number of participants                   |
| `duration_minutes` | INT           |                                                       | Workshop duration in minutes                     |
| `is_active`        | BOOLEAN       | DEFAULT TRUE                                          | Whether workshop is currently available          |
| `slug`             | VARCHAR(100)  | UNIQUE                                                | URL-friendly identifier for SEO                  |
| `available_spots`  | INT           |                                                       | Remaining available spots (calculated or stored) |
| `created_at`       | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP                             | Record creation time                             |
| `updated_at`       | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time                                 |

### 3. `bookings`

Stores customer workshop bookings.

| Column                   | Type                                                   | Constraints                                           | Description                                                |
| ------------------------ | ------------------------------------------------------ | ----------------------------------------------------- | ---------------------------------------------------------- |
| `id`                     | INT                                                    | PRIMARY KEY, AUTO_INCREMENT                           | Unique booking identifier                                  |
| `workshop_id`            | INT                                                    | FOREIGN KEY (workshops.id), NOT NULL                  | Reference to workshop                                      |
| `customer_name`          | VARCHAR(255)                                           | NOT NULL                                              | Customer full name                                         |
| `customer_email`         | VARCHAR(255)                                           | NOT NULL                                              | Customer email                                             |
| `customer_phone`         | VARCHAR(50)                                            | NOT NULL                                              | Customer phone number                                      |
| `number_of_participants` | INT                                                    | NOT NULL, DEFAULT 1                                   | Number of people in booking                                |
| `special_requests`       | TEXT                                                   |                                                       | Special requests or notes                                  |
| `total_price`            | DECIMAL(10,2)                                          | NOT NULL                                              | Total booking price                                        |
| `status`                 | ENUM('pending', 'confirmed', 'cancelled', 'completed') | DEFAULT 'pending'                                     | Booking status                                             |
| `booking_reference`      | VARCHAR(50)                                            | UNIQUE                                                | Unique booking reference number for customer communication |
| `payment_status`         | ENUM('pending', 'paid', 'refunded', 'failed')          | DEFAULT 'pending'                                     | Track payment separately from booking status               |
| `notes`                  | TEXT                                                   |                                                       | Internal admin notes                                       |
| `created_at`             | TIMESTAMP                                              | DEFAULT CURRENT_TIMESTAMP                             | Booking creation time                                      |
| `updated_at`             | TIMESTAMP                                              | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time                                           |

### 4. `contact_messages`

Stores contact form submissions.

| Column          | Type                                    | Constraints                 | Description                       |
| --------------- | --------------------------------------- | --------------------------- | --------------------------------- |
| `id`            | INT                                     | PRIMARY KEY, AUTO_INCREMENT | Unique message identifier         |
| `name`          | VARCHAR(255)                            | NOT NULL                    | Sender name                       |
| `phone`         | VARCHAR(50)                             | NOT NULL                    | Sender phone number               |
| `email`         | VARCHAR(255)                            | NOT NULL                    | Sender email                      |
| `subject`       | VARCHAR(255)                            |                             | Message subject (optional)        |
| `message`       | TEXT                                    | NOT NULL                    | Message content                   |
| `is_read`       | BOOLEAN                                 | DEFAULT FALSE               | Whether message has been read     |
| `priority`      | ENUM('low', 'normal', 'high', 'urgent') | DEFAULT 'normal'            | For categorizing urgent messages  |
| `replied_at`    | TIMESTAMP                               |                             | Track when message was replied to |
| `reply_message` | TEXT                                    |                             | Store reply if needed             |
| `created_at`    | TIMESTAMP                               | DEFAULT CURRENT_TIMESTAMP   | Message creation time             |

## Relationships

1. **bookings** → **workshops**: Many bookings belong to one workshop

## Indexes

Recommended indexes for performance:

-   `workshops.slug` (already UNIQUE)
-   `workshops.date`
-   `workshops.is_active`
-   `workshops.instructor`
-   `bookings.workshop_id`
-   `bookings.customer_email`
-   `bookings.status`
-   `bookings.booking_reference` (already UNIQUE)
-   `bookings.payment_status`
-   `bookings.created_at`
-   `contact_messages.is_read`
-   `contact_messages.priority`
-   `contact_messages.created_at`
-   `testimonials.is_approved`
-   `testimonials.rating`

## Notes

-   All timestamps use MySQL TIMESTAMP type with automatic defaults
-   Price fields use DECIMAL(10,2) for accurate currency storage
-   Phone numbers stored as VARCHAR to accommodate various formats
-   Email addresses should be validated at the application level
-   Consider adding soft delete functionality (deleted_at column) if needed
-   For production, consider adding audit trails and user authentication tables if admin functionality is needed
-   The `workshops` table combines workshop information with session details (date, time, instructor, address) for simplicity
-   If you need to support multiple sessions of the same workshop type, consider adding a separate `workshop_sessions` table
