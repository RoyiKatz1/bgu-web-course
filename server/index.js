import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import workshopsRouter from "./routes/workshops.js";
import bookingsRouter from "./routes/bookings.js";
import recipesRouter from "./routes/recipes.js";
import contactRouter from "./routes/contact.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from client folder (CSS, JS, images)
app.use(express.static(path.join(__dirname, "../client")));

// Routes for pages
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "../client/pages/home.html"));
});

app.get("/home", (req, res) => {
	res.sendFile(path.join(__dirname, "../client/pages/home.html"));
});

app.get("/workshops", (req, res) => {
	res.sendFile(path.join(__dirname, "../client/pages/workshops.html"));
});

app.get("/recipes", (req, res) => {
	res.sendFile(path.join(__dirname, "../client/pages/recipes.html"));
});

app.get("/book", (req, res) => {
	res.sendFile(path.join(__dirname, "../client/pages/book.html"));
});

app.get("/contact", (req, res) => {
	res.sendFile(path.join(__dirname, "../client/pages/contact.html"));
});

// API Routes
app.use("/api/workshops", workshopsRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/recipes", recipesRouter);
app.use("/api/contact", contactRouter);

// Health check endpoint
app.get("/health", (req, res) => {
	res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
