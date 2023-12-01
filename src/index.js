const pdf = require("pdf-lib");
const canvas = require("canvas");
const fs = require("fs");

const Dictionary = require("./lib/Dictionary");
const Placement = require("./lib/Placement");
const Random = require("./lib/Random");

const config = require("./config.json");

/**
 * @param {string[]} grid 
 */
function printGrid(grid) {

	console.log("_".repeat(grid[0].length * 2 + 1));
    for (let row of grid) {	
        console.log(`|${row.join("|")}|`);
    }
	console.log("_".repeat(grid[0].length * 2 + 1));

}

/**
 * @param {string[]} words
 */
function drawWordSearch(words) {

	// Create grid and populate with empty squares
    let grid = [];
    for (let i = 0; i < config.gridSize; i++) {
        grid.push(" ".repeat(config.gridSize).split(""));
    }

	// While there are still words to put in grid
    while (words.length > 0) {
        let word = words.pop();

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

	// Fill remaining space with random letters
	let alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
	for (let x = 0; x < config.gridSize; x++) {
		for (let y = 0; y < config.gridSize; y++) {
			if (grid[y][x] == " ") {
				grid[y][x] = Random.choice(alphabet);
			}
		}
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