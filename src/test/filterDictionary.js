const fs = require("fs");

let dictionary = fs
    .readFileSync("src/resources/dictionary.txt", "utf-8")
    .toLowerCase()
    .split("\n");

let filter = fs
    .readFileSync("src/resources/filter.txt", "utf-8")
    .split("\r\n");

function wordFilter(word) {
    return (
        word.length >= 4 
        && word.length <= 9 
        && !/[\W-]/g.test(word) 
        && !filter.some(bannedPattern => {
            return bannedPattern.split(" ").some(bannedWord => word.includes(bannedWord) && bannedWord.length >= 2);
        })  
    );
}

let filteredDictionary = dictionary.filter(wordFilter);

fs.writeFileSync(
    "src/resources/filteredDictionary.txt",
    filteredDictionary.join("\n")
);

console.log(
    "Filtered dictionary; output at src/resources/filteredDictionary.txt"
);
