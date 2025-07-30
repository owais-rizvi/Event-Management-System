import express from "express";
import eventRoutes from "./routes/event.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/events", eventRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
