const fs = require("node:fs/promises");

async function getStoredPopular() {
  const rawFileContent = await fs.readFile("popular.json", {
    encoding: "utf-8",
  });
  const data = JSON.parse(rawFileContent);
  const storedPopular = data.popular ?? [];
  return storedPopular;
}

function storePopular(popular) {
  return fs.writeFile(
    "popular.json",
    JSON.stringify({ popular: popular || [] })
  );
}

exports.getStoredPopular = getStoredPopular;
exports.storePopular = storePopular;
