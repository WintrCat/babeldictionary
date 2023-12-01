const fs = require("fs");

const Random = require("./Random");

/**
 * @type {string[]}
 */
let dictionary = fs
    .readFileSync("src/resources/filteredDictionary.txt", "utf-8")
    .split("\n");

function getRandomWords(amount) {

    let words = [];
    for (let i = 0; i < amount; i++) {
        let word = Random.choice(dictionary);
        words.push(word);
        dictionary.splice(dictionary.indexOf(word), 1);
    }

    return words;

}

function putBack(word) {

    dictionary.push(word);

}

module.exports = {
    getRandomWords,
    putBack
};
