const fs = require("fs");

let dictionary = fs
  .readFileSync("src/resources/dictionary.txt", "utf-8")
  .split("\n");

let filteredDictionary = dictionary.filter(
  (word) => word.length >= 4 && word.length <= 9 && !/\W/g.test(word),
);

fs.writeFileSync(
  "src/resources/filteredDictionary.txt",
  filteredDictionary.join("\n"),
);

console.log(
  "Filtered dictionary; output at src/resources/filteredDictionary.txt",
);
