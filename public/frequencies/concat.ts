/// <reference types='node' />

import fs from "fs/promises";

console.log(import.meta.dirname);

const files = await fs.readdir(import.meta.dirname);

let allStations = {};

for (const file of files) {
  if (file.endsWith('.json')) {
    const { $schema, ...rest } = JSON.parse(await fs.readFile(file, "utf-8"));
  
    allStations = { ...allStations, ...rest };
  }
}

await fs.writeFile("all.json", JSON.stringify(allStations, null, 2));