const pdf = require("pdf-lib");
const canvas = require("canvas");
const fs = require("fs");

const Dictionary = require("./lib/Dictionary");
const Placement = require("./lib/Placement");
const Random = require("./lib/Random");

const config = require("./config.json");

/**
 * @param {string[]} words
 */
function drawWordSearch(words) {
  let grid = [];
  for (let i = 0; i < config.gridSize; i++) {
    grid.push(" ".repeat(config.gridSize).split(""));
  }

  while (words.length > 0) {
    let word = words.pop().replace(/-/g, "");

    let validPlacements = [];
    for (let x = 0; x < config.gridSize; x++) {
      for (let y = 0; y < config.gridSize; y++) {
        let placementCandidates = Placement.inAllRotations(x, y, word);

        for (let placementCandidate of placementCandidates) {
          if (placementCandidate.fits(grid)) {
            validPlacements.push(placementCandidate);
          }
        }
      }
    }

    if (validPlacements.length == 0) {
      words.push(Dictionary.getRandomWords(1)[0]);
      Dictionary.putBack(word);
      continue;
    }

    Random.choice(validPlacements).place(grid);
  }

  for (let row of grid) {
    console.log(row.join(" "));
  }
}

function main() {
  for (let i = 0; i < config.wordSearchCount; i++) {
    let words = Dictionary.getRandomWords(config.wordsPerGrid);
    console.log("Chosen words: " + words);

    let wordSearchImage = drawWordSearch(words);
  }
}

main();
