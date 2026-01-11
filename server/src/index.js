import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import workshopsRouter from "./routes/workshops.js";
import bookingsRouter from "./routes/bookings.js";
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
const clientSrcPath = path.join(__dirname, "../../client/src");

// Serve assets directly (images, etc.)
app.use("/assets", express.static(path.join(clientSrcPath, "assets")));

// Serve CSS files - map /css/* to appropriate locations
app.use("/css", (req, res, next) => {
	const cssFile = req.path.substring(1); // Remove leading /

	// Try pages subdirectories first (e.g., /css/home.css -> pages/home/home.css)
	const pageDirs = ["home", "contact", "workshops", "recipes", "book"];
	for (const dir of pageDirs) {
		if (cssFile === `${dir}.css`) {
			const filePath = path.join(
				clientSrcPath,
				"pages",
				dir,
				`${dir}.css`
			);
			return res.sendFile(path.resolve(filePath), (err) => {
				if (err) next();
			});
		}
	}

	// Fallback to root src directory (e.g., /css/style.css -> style.css)
	const rootPath = path.resolve(path.join(clientSrcPath, cssFile));
	res.sendFile(rootPath, (err) => {
		if (err) {
			res.status(404).send("File not found");
		}
	});
});

// Serve JS files - map /js/* to appropriate locations
app.use("/js", (req, res, next) => {
	const jsFile = req.path.substring(1); // Remove leading /

	// Try pages subdirectories first (e.g., /js/contact.js -> pages/contact/contact.js)
	const pageDirs = ["home", "contact", "workshops", "recipes", "book"];
	for (const dir of pageDirs) {
		if (jsFile === `${dir}.js`) {
			const filePath = path.join(
				clientSrcPath,
				"pages",
				dir,
				`${dir}.js`
			);
			return res.sendFile(path.resolve(filePath), (err) => {
				if (err) next();
			});
		}
	}

	// Try utils directory (e.g., /js/form-validation.js -> utils/form-validation.js)
	const utilsPath = path.resolve(path.join(clientSrcPath, "utils", jsFile));
	res.sendFile(utilsPath, (err) => {
		if (err) {
			res.status(404).send("File not found");
		}
	});
});

// Serve other static files from root
app.use(express.static(clientSrcPath));

// Routes for pages
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "../../client/src/pages/home/home.html"));
});

app.get("/home", (req, res) => {
	res.sendFile(path.join(__dirname, "../../client/src/pages/home/home.html"));
});

app.get("/workshops", (req, res) => {
	res.sendFile(
		path.join(__dirname, "../../client/src/pages/workshops/workshops.html")
	);
});

app.get("/recipes", (req, res) => {
	res.sendFile(
		path.join(__dirname, "../../client/src/pages/recipes/recipes.html")
	);
});

app.get("/book", (req, res) => {
	res.sendFile(path.join(__dirname, "../../client/src/pages/book/book.html"));
});

app.get("/contact", (req, res) => {
	res.sendFile(
		path.join(__dirname, "../../client/src/pages/contact/contact.html")
	);
});

app.get("/api-test", (req, res) => {
	res.sendFile(
		path.join(__dirname, "../../client/src/pages/utils/api-test.html")
	);
});

// API Routes
app.use("/api/workshops", workshopsRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/contact", contactRouter);

// Health check endpoint
app.get("/health", (req, res) => {
	res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
