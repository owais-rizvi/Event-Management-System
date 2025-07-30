import pool from "../config/db.js";

export const createEvent = async (req, res) => {
  const { title, datetime, location, capacity } = req.body;
  if (!title || !datetime || !location || !capacity) {
    return res.status(400).json({ error: "All fields are required." });
  }
  if (capacity <= 0 || capacity > 1000) {
    return res.json({ message: "Capacity must be between 1 and 1000." });
  }
  try {
    const result = await pool.query(
      "INSERT INTO events (title, datetime, location, capacity) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, datetime, location, capacity]
    );
    res.json({ "Event ID": result.rows[0].id });
  } catch (error) {
    console.log("Error while creating event.", error);
  }
};

export const getEvents = async (req, res) => {
  const eventId = parseInt(req.params.eventId);
  if (eventId < 0) {
    return res.status(400).json({ message: "Invalid Event ID" });
  }
  try {
    const result = await pool.query(`SELECT * FROM events WHERE id = ($1)`, [
      eventId,
    ]);
    if (result.rows.length == 0) {
      return res.status(404).json({ message: "Event ID not found." });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.log("Error while getting event details.", error);
  }
};

export const registerForEvent = async (req, res) => {
  const eventId = parseInt(req.params.eventId);
  const { userId } = req.body;
  try {
    const eventResult = await pool.query(
      `SELECT * FROM events WHERE id = ($1)`,
      [eventId]
    );
    if (eventResult.rows.length == 0) {
      return res
        .status(404)
        .json({ message: "Event for that Event ID does not exist." });
    }
    const event = eventResult.rows[0];
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM registrations WHERE event_id = ($1)`,
      [eventId]
    );
    const currentCount = parseInt(countResult.rows[0].count);
    if (currentCount >= event.capacity) {
      return res.status(400).json({ error: "Event is at full capacity." });
    }
    const existingUser = await pool.query(
      `SELECT * FROM registrations WHERE user_id = ($1) AND event_id = ($2)`,
      [userId, eventId]
    );
    if (existingUser.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "User is already registered for this event." });
    }
    await pool.query(
      `INSERT INTO registrations (user_id, event_id) VALUES ($1, $2)`,
      [userId, eventId]
    );
    res.status(201).json({
      message: `User with User ID ${userId} has been registered successfully for Event with Event ID ${eventId}.`,
    });
  } catch (error) {
    console.log("Error while registering for event", error);
    return res.status(400).json({ error: "Error while registering for event" });
  }
};

export const cancelRegistration = async (req, res) => {
  const { userId } = req.body;
  const eventId = parseInt(req.params.eventId);
  try {
    const existingUser = await pool.query(
      `SELECT * FROM registrations WHERE user_id = ($1) AND event_id = ($2)`,
      [userId, eventId]
    );
    if (existingUser.rows.length == 0) {
      return res
        .status(404)
        .json({ error: "User id not registered for this event" });
    }
    await pool.query(
      `DELETE FROM registrations WHERE user_id = ($1) AND event_id = ($2)`,
      [userId, eventId]
    );
    return res.status(200).json({
      message: `User ${userId} cancelled the registration from event ${eventId}`,
    });
  } catch (error) {
    console.log("Error while cancelling registration", error);
    return res
      .status(400)
      .json({ error: "Error while cancelling registration" });
  }
};

export const getEventStats = async (req, res) => {
  const eventId = parseInt(req.params.eventId);
  try {
    const eventExists = await pool.query(
      "SELECT * FROM events WHERE id = ($1)",
      [eventId]
    );
    if (eventExists.rows.length == 0) {
      return res
        .status(400)
        .json({ error: "An event by this Event ID does not exist" });
    }
  } catch (error) {
    console.log("Error in verifying event id");
    return res.status(400).json({ error: "Error in verifying event id" });
  }
  try {
    const eventResult = await pool.query(
      "SELECT capacity FROM events WHERE id = ($1)",
      [eventId]
    );
    const totalCapacity = parseInt(eventResult.rows[0].capacity);
    const registrationResult = await pool.query(
      "SELECT COUNT(*) FROM registrations WHERE event_id = ($1)",
      [eventId]
    );
    const currentRegistrations = parseInt(registrationResult.rows[0].count);
    const remainingCapacity = totalCapacity - currentRegistrations;
    const percentCapacity = (currentRegistrations / totalCapacity) * 100;
    return res
      .status(200)
      .json({
        message: `Total registrations: ${currentRegistrations}. Remaining capacity: ${remainingCapacity}. Percentage of capacity used: ${percentCapacity}%`,
      });
  } catch (error) {
    console.log("Error while getting stats for event", error);
    return res
      .status(400)
      .json({ error: "Error while getting stats for event" });
  }
};
