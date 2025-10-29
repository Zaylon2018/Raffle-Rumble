import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Example JSON endpoint
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the server!" });
});

// Serve static files from the client build
app.use(express.static(path.join(__dirname, "../client/dist")));

// All other routes → React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
