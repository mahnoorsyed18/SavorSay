const fs = require("node:fs/promises");

async function getStoredPopular() {
  const path = require("path");
  const filePath = path.join(__dirname, "..", "popular.json");
  const rawFileContent = await fs.readFile(filePath, { encoding: "utf-8" });
  const data = JSON.parse(rawFileContent);
  const storedPopular = data.popular ?? [];
  return storedPopular;
}

function storePopular(popular) {
  const path = require("path");
  const filePath = path.join(__dirname, "..", "popular.json");
  return fs.writeFile(filePath, JSON.stringify({ popular: popular || [] }));
}

exports.getStoredPopular = getStoredPopular;
exports.storePopular = storePopular;
