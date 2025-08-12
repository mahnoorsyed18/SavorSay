const express = require("express");
const bodyParser = require("body-parser");

const { getStoredRecipes, storeRecipes } = require("../data/recipes");
const { getStoredPopular, storePopular } = require("../data/popular");

const app = express();

app.use(bodyParser.json());

// Set CORS headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// 🔹 GET all recipes
app.get("/recipes", async (req, res) => {
  const storedRecipes = await getStoredRecipes();
  res.json({ recipes: storedRecipes });
});

// 🔹 GET recipe by NAME
app.get("/recipes/:name", async (req, res) => {
  const storedRecipes = await getStoredRecipes();
  const recipeName = req.params.name.toLowerCase();

  const foundRecipe = storedRecipes.find(
    (recipe) =>
      recipe.name &&
      recipe.name.toLowerCase().replace(/\s+/g, "-") === recipeName
  );

  if (foundRecipe) {
    res.json({ recipe: foundRecipe });
  } else {
    res.status(404).json({ error: "Recipe not found" });
  }
});

// 🔹 POST a new recipe
app.post("/recipes", async (req, res) => {
  const existingRecipes = await getStoredRecipes();
  const recipesData = req.body;

  const newRecipe = {
    ...recipesData,
    id: Math.random().toString(),
  };

  const updatedRecipes = [newRecipe, ...existingRecipes];
  await storeRecipes(updatedRecipes);

  res.status(201).json({ message: "Stored new Recipe.", recipe: newRecipe });
});

// 🔹 GET all popular recipes
app.get("/popular", async (req, res) => {
  const storedPopular = await getStoredPopular();
  res.json({ popular: storedPopular });
});

// 🔹 GET popular recipe by NAME
app.get("/popular/:name", async (req, res) => {
  const storedPopular = await getStoredPopular();
  const recipeName = req.params.name.toLowerCase();

  const foundPopular = storedPopular.find(
    (pop) =>
      pop.name && pop.name.toLowerCase().replace(/\s+/g, "-") === recipeName
  );

  if (foundPopular) {
    res.json({ recipe: foundPopular });
  } else {
    res.status(404).json({ error: "Popular recipe not found" });
  }
});

// 🔹 POST a popular recipe
app.post("/popular", async (req, res) => {
  const existingPopular = await getStoredPopular();
  const popularData = req.body;

  const newPopular = {
    ...popularData,
    id: Math.random().toString(),
  };

  const updatedPopular = [newPopular, ...existingPopular];
  await storePopular(updatedPopular);

  res
    .status(201)
    .json({ message: "Stored new Popular Recipe.", popular: newPopular });
});

module.exports = app;
