require("dotenv").config();
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "moviestream";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let db;

async function connectDB() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  db = client.db(DB_NAME);
  console.log(`✅ Connected to MongoDB: ${DB_NAME}`);
  return db;
}

// Make db available in routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Routes
app.use("/movies", require("./routes/movies"));
app.use("/customers", require("./routes/customers"));
app.use("/genres", require("./routes/genres"));

// Home
app.get("/", async (req, res) => {
  const [movieCount, customerCount, genreCount, interactionCount] = await Promise.all([
    db.collection("movies").countDocuments(),
    db.collection("customers").countDocuments(),
    db.collection("genres").countDocuments(),
    db.collection("interactions").countDocuments(),
  ]);
  res.render("index", { movieCount, customerCount, genreCount, interactionCount });
});

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🎬 MovieStream running at http://localhost:${PORT}`));
}).catch(err => {
  console.error("❌ DB connection failed:", err);
  process.exit(1);
});
