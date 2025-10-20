import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import tabRoutes from "./routes/tabRoutes.js";

dotenv.config();

const app = express();
// app.use(cors());
app.use(cors({
  origin: ["chrome-extension://bjkppolfhjkdbjllkaegegkpmbpnjgip"], 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("TabTrack backend running");
});

app.use("/api/tabs", tabRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
