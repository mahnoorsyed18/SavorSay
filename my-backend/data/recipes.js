const fs = require("node:fs/promises");

async function getStoredRecipes() {
  const path = require("path");
  const filePath = path.join(__dirname, "..", "recipes.json");
  const rawFileContent = await fs.readFile(filePath, { encoding: "utf-8" });
  const data = JSON.parse(rawFileContent);
  const storedRecipes = data.recipes ?? [];
  return storedRecipes;
}

function storeRecipes(recipes) {
  const path = require("path");
  const filePath = path.join(__dirname, "..", "recipes.json");
  return fs.writeFile(filePath, JSON.stringify({ recipes: recipes || [] }));
}

exports.getStoredRecipes = getStoredRecipes;
exports.storeRecipes = storeRecipes;
