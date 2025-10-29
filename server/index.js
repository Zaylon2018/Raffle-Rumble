import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import raffleRoutes from "./routes/raffles.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware for JSON (important for API)
app.use(express.json());

// Raffle API routes
app.use("/api/raffles", raffleRoutes);

// Serve built frontend
app.use(express.static(path.join(__dirname, "../client/dist")));

// Fallback route for React Router
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
