# Event Management System

A simple RESTful API for managing events, user registrations and statistics.

---
## Installation
1. Clone the repository: `git clone https://github.com/owais-rizvi/Event-Management-System.git`
2. Change directory: `cd Event-Management-System`
3. Install dependencies: `npm install`
4. Create a `.env` file and set up your PostgreSQL details:
```DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database
```
5. Start the server: `npm run dev`
---
## API Endpoints
### a. Create Event
Send a post request to `events/create-event` with the title, datetime, location and capacity of the event to create it.
### b. Get Event Details
Send a get request to `events/get-events/:eventId` to get all the details about an event.
### c. Register for Event
Send a post request to `events/register/:eventId` with the user id to register for an event.
### d. Cancel Registration
Send a delete request to `events/cancel/:eventId` with the user id to cancel a user's registration for an event.
### e. List Upcoming Events
Send a get request to `events/upcoming` to get the future events.
### f. Event Stats
Send a get request to `events/stats/:eventId` to get the statistics of an event such as capacity and number of registrations.