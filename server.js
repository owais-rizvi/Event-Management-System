import express from "express";
import eventRoutes from "./routes/event.route.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/events", eventRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the event management system! ");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
