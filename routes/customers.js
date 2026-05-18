const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();

const getDb = (req) => req.db;

// LIST with search
router.get("/", async (req, res) => {
  const db = getDb(req);
  const { q, segment } = req.query;
  let filter = {};
  if (q) {
    filter.$or = [
      { first_name: { $regex: q, $options: "i" } },
      { last_name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
    ];
  }
  if (segment) filter["segment.short_name"] = segment;

  const customers = await db.collection("customers").find(filter).sort({ last_name: 1 }).toArray();
  const segments = await db.collection("customers").distinct("segment.short_name");
  res.render("customers/index", { customers, segments, q: q || "", selectedSegment: segment || "" });
});

// NEW form
router.get("/new", async (req, res) => {
  res.render("customers/form", { customer: null, action: "/customers", method: "POST" });
});

// CREATE
router.post("/", async (req, res) => {
  const db = getDb(req);
  const customer = {
    cust_id: Date.now(),
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    city: req.body.city,
    country: req.body.country || "Mexico",
    age: parseInt(req.body.age) || null,
    gender: req.body.gender || null,
    income_level: req.body.income_level || "Middle",
    segment: {
      segment_id: parseInt(req.body.segment_id) || 2,
      name: req.body.segment_name || "Young Professionals",
      short_name: req.body.segment_short || "YP",
    },
    subscription: {
      plan_id: parseInt(req.body.plan_id) || 2,
      plan_name: req.body.plan_name || "Básico",
      fecha_inicio: req.body.fecha_inicio ? new Date(req.body.fecha_inicio) : new Date(),
      fecha_fin: req.body.fecha_fin ? new Date(req.body.fecha_fin) : null,
    },
  };
  await db.collection("customers").insertOne(customer);
  res.redirect("/customers");
});

// SHOW single with interaction history
router.get("/:id", async (req, res) => {
  const db = getDb(req);
  const customer = await db.collection("customers").findOne({ _id: new ObjectId(req.params.id) });
  if (!customer) return res.status(404).send("Customer not found");

  const interactions = await db.collection("interactions")
    .find({ cust_id: customer.cust_id })
    .sort({ day_id: -1 }).limit(10).toArray();

  const movieIds = interactions.map(i => i.movie_id);
  const movies = await db.collection("movies")
    .find({ movie_id: { $in: movieIds } })
    .project({ movie_id: 1, title: 1, image_url: 1 }).toArray();
  const movieMap = Object.fromEntries(movies.map(m => [m.movie_id, m]));

  res.render("customers/show", { customer, interactions, movieMap });
});

// EDIT form
router.get("/:id/edit", async (req, res) => {
  const db = getDb(req);
  const customer = await db.collection("customers").findOne({ _id: new ObjectId(req.params.id) });
  if (!customer) return res.status(404).send("Customer not found");
  res.render("customers/form", { customer, action: `/customers/${req.params.id}?_method=PUT`, method: "POST" });
});

// UPDATE
router.post("/:id", async (req, res) => {
  const db = getDb(req);
  if (req.query._method !== "PUT") return res.status(400).send("Bad request");

  const update = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    city: req.body.city,
    country: req.body.country || "Mexico",
    age: parseInt(req.body.age) || null,
    gender: req.body.gender || null,
    income_level: req.body.income_level || "Middle",
    segment: {
      segment_id: parseInt(req.body.segment_id) || 2,
      name: req.body.segment_name || "Young Professionals",
      short_name: req.body.segment_short || "YP",
    },
    subscription: {
      plan_id: parseInt(req.body.plan_id) || 2,
      plan_name: req.body.plan_name || "Básico",
      fecha_inicio: req.body.fecha_inicio ? new Date(req.body.fecha_inicio) : new Date(),
      fecha_fin: req.body.fecha_fin ? new Date(req.body.fecha_fin) : null,
    },
  };

  await db.collection("customers").updateOne({ _id: new ObjectId(req.params.id) }, { $set: update });
  res.redirect(`/customers/${req.params.id}`);
});

// DELETE
router.post("/:id/delete", async (req, res) => {
  const db = getDb(req);
  const customer = await db.collection("customers").findOne({ _id: new ObjectId(req.params.id) });
  if (customer) {
    await db.collection("interactions").deleteMany({ cust_id: customer.cust_id });
  }
  await db.collection("customers").deleteOne({ _id: new ObjectId(req.params.id) });
  res.redirect("/customers");
});

module.exports = router;
