const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();

const getDb = (req) => req.db;

// LIST with search
router.get("/", async (req, res) => {
  const db = getDb(req);
  const { q, genre } = req.query;
  let filter = {};
  if (q) filter.title = { $regex: q, $options: "i" };
  if (genre) filter["genres.genre_id"] = parseInt(genre);

  const [movies, genres] = await Promise.all([
    db.collection("movies").find(filter).sort({ year: -1 }).toArray(),
    db.collection("genres").find().sort({ name: 1 }).toArray(),
  ]);
  res.render("movies/index", { movies, genres, q: q || "", selectedGenre: genre || "" });
});

// NEW form
router.get("/new", async (req, res) => {
  const db = getDb(req);
  const genres = await db.collection("genres").find().sort({ name: 1 }).toArray();
  res.render("movies/form", { movie: null, genres, action: "/movies", method: "POST" });
});

// CREATE
router.post("/", async (req, res) => {
  const db = getDb(req);
  const genreIds = [].concat(req.body.genre_ids || []).map(Number);
  const allGenres = await db.collection("genres").find({ genre_id: { $in: genreIds } }).toArray();

  const movie = {
    movie_id: Date.now(),
    title: req.body.title,
    year: parseInt(req.body.year),
    runtime: req.body.runtime,
    studio: req.body.studio,
    summary: req.body.summary,
    image_url: req.body.image_url || "",
    list_price: parseFloat(req.body.list_price) || 2.99,
    views: parseInt(req.body.views) || 0,
    genres: allGenres.map(g => ({ genre_id: g.genre_id, name: g.name })),
    cast: req.body.cast ? req.body.cast.split(",").map(s => s.trim()) : [],
    crew: { director: req.body.director || "", writer: req.body.writer || "" },
    awards: { wins: parseInt(req.body.award_wins) || 0, nominations: parseInt(req.body.award_noms) || 0 },
    main_subject: req.body.main_subject || "",
    opening_date: req.body.opening_date ? new Date(req.body.opening_date) : null,
  };

  await db.collection("movies").insertOne(movie);
  res.redirect("/movies");
});

// SHOW single
router.get("/:id", async (req, res) => {
  const db = getDb(req);
  const movie = await db.collection("movies").findOne({ _id: new ObjectId(req.params.id) });
  if (!movie) return res.status(404).send("Movie not found");

  const interactions = await db.collection("interactions")
    .find({ movie_id: movie.movie_id })
    .sort({ day_id: -1 }).limit(10).toArray();

  const custIds = interactions.map(i => i.cust_id);
  const customers = await db.collection("customers")
    .find({ cust_id: { $in: custIds } })
    .project({ cust_id: 1, first_name: 1, last_name: 1 }).toArray();
  const custMap = Object.fromEntries(customers.map(c => [c.cust_id, c]));

  res.render("movies/show", { movie, interactions, custMap });
});

// EDIT form
router.get("/:id/edit", async (req, res) => {
  const db = getDb(req);
  const [movie, genres] = await Promise.all([
    db.collection("movies").findOne({ _id: new ObjectId(req.params.id) }),
    db.collection("genres").find().sort({ name: 1 }).toArray(),
  ]);
  if (!movie) return res.status(404).send("Movie not found");
  res.render("movies/form", { movie, genres, action: `/movies/${req.params.id}?_method=PUT`, method: "POST" });
});

// UPDATE
router.post("/:id", async (req, res) => {
  const db = getDb(req);
  if (req.query._method !== "PUT") return res.status(400).send("Bad request");

  const genreIds = [].concat(req.body.genre_ids || []).map(Number);
  const allGenres = await db.collection("genres").find({ genre_id: { $in: genreIds } }).toArray();

  const update = {
    title: req.body.title,
    year: parseInt(req.body.year),
    runtime: req.body.runtime,
    studio: req.body.studio,
    summary: req.body.summary,
    image_url: req.body.image_url || "",
    list_price: parseFloat(req.body.list_price) || 2.99,
    views: parseInt(req.body.views) || 0,
    genres: allGenres.map(g => ({ genre_id: g.genre_id, name: g.name })),
    cast: req.body.cast ? req.body.cast.split(",").map(s => s.trim()) : [],
    crew: { director: req.body.director || "", writer: req.body.writer || "" },
    awards: { wins: parseInt(req.body.award_wins) || 0, nominations: parseInt(req.body.award_noms) || 0 },
    main_subject: req.body.main_subject || "",
    opening_date: req.body.opening_date ? new Date(req.body.opening_date) : null,
  };

  await db.collection("movies").updateOne({ _id: new ObjectId(req.params.id) }, { $set: update });
  res.redirect(`/movies/${req.params.id}`);
});

// DELETE
router.post("/:id/delete", async (req, res) => {
  const db = getDb(req);
  const movie = await db.collection("movies").findOne({ _id: new ObjectId(req.params.id) });
  if (movie) {
    await db.collection("interactions").deleteMany({ movie_id: movie.movie_id });
  }
  await db.collection("movies").deleteOne({ _id: new ObjectId(req.params.id) });
  res.redirect("/movies");
});

module.exports = router;
