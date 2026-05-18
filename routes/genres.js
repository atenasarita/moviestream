const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();

const getDb = (req) => req.db;

// LIST
router.get("/", async (req, res) => {
  const db = getDb(req);
  const genres = await db.collection("genres").find().sort({ name: 1 }).toArray();

  // Count movies per genre
  const counts = await db.collection("movies").aggregate([
    { $unwind: "$genres" },
    { $group: { _id: "$genres.genre_id", count: { $sum: 1 } } }
  ]).toArray();
  const countMap = Object.fromEntries(counts.map(c => [c._id, c.count]));

  res.render("genres/index", { genres, countMap });
});

// CREATE
router.post("/", async (req, res) => {
  const db = getDb(req);
  const last = await db.collection("genres").find().sort({ genre_id: -1 }).limit(1).toArray();
  const newId = last.length ? last[0].genre_id + 1 : 1;
  await db.collection("genres").insertOne({ genre_id: newId, name: req.body.name });
  res.redirect("/genres");
});

// UPDATE — also propagates name change into embedded movies
router.post("/:id", async (req, res) => {
  const db = getDb(req);
  if (req.query._method !== "PUT") return res.status(400).send("Bad request");

  const genre = await db.collection("genres").findOne({ _id: new ObjectId(req.params.id) });
  if (!genre) return res.status(404).send("Genre not found");

  const newName = req.body.name;
  await db.collection("genres").updateOne({ _id: new ObjectId(req.params.id) }, { $set: { name: newName } });

  // Propagate name change to embedded genres in movies
  await db.collection("movies").updateMany(
    { "genres.genre_id": genre.genre_id },
    { $set: { "genres.$[elem].name": newName } },
    { arrayFilters: [{ "elem.genre_id": genre.genre_id }] }
  );

  res.redirect("/genres");
});

// DELETE — prevents deletion if genre is in use
router.post("/:id/delete", async (req, res) => {
  const db = getDb(req);
  const genre = await db.collection("genres").findOne({ _id: new ObjectId(req.params.id) });
  if (!genre) return res.status(404).send("Genre not found");

  const usageCount = await db.collection("movies").countDocuments({ "genres.genre_id": genre.genre_id });
  if (usageCount > 0) {
    const genres = await db.collection("genres").find().sort({ name: 1 }).toArray();
    const counts = await db.collection("movies").aggregate([
      { $unwind: "$genres" },
      { $group: { _id: "$genres.genre_id", count: { $sum: 1 } } }
    ]).toArray();
    const countMap = Object.fromEntries(counts.map(c => [c._id, c.count]));
    return res.render("genres/index", { genres, countMap, error: `Cannot delete "${genre.name}" — it is used by ${usageCount} movie(s).` });
  }

  await db.collection("genres").deleteOne({ _id: new ObjectId(req.params.id) });
  res.redirect("/genres");
});

module.exports = router;
