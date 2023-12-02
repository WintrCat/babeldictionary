const { PDFDocument } = require("pdf-lib");
const canvas = require("canvas");
const fs = require("fs");

const Dictionary = require("./lib/Dictionary");
const Placement = require("./lib/Placement");
const Random = require("./lib/Random");

const config = require("./config.json");

let usedWords = [];

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
 * @param {string} filename
 */
function drawWordSearch(words) {

	// Create copy of words for list on image sidebar
	let wordsCopy = words.slice();

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

	// Draw grid
	let wordSearchCanvas = new canvas.Canvas(800, 675).getContext("2d");
	canvas.registerFont("src/resources/opensans.ttf", {"family": "Open Sans"});

	wordSearchCanvas.strokeStyle = "#000000";
	wordSearchCanvas.lineWidth = 2;

	wordSearchCanvas.fillStyle = "#ffffff";
	wordSearchCanvas.fillRect(0, 0, 800, 680);

	wordSearchCanvas.fillStyle = "#000000";
	wordSearchCanvas.font = "30px Open Sans";
	for (let x = 0; x < config.gridSize; x++) {
		for (let y = 0; y < config.gridSize; y++) {
			wordSearchCanvas.strokeRect(x * 45, y * 45, 45, 45);

			let letter = grid[y][x].toUpperCase();

			let textLength = wordSearchCanvas.measureText(letter).width;
			let xOffset = 22 - textLength / 2;

			wordSearchCanvas.fillText(grid[y][x].toUpperCase(), x * 45 + xOffset, y * 45 + 30);
		}
	}

	wordSearchCanvas.font = "20px Open Sans";
	for (let word of wordsCopy) {
		wordSearchCanvas.fillText(word, 680, 18 + 24 * wordsCopy.indexOf(word));
		usedWords.push(word);
	}

	return wordSearchCanvas.canvas.toBuffer();

}

async function main() {

	let wordSearchImages = [];

    for (let i = 0; i < config.wordSearchCount; i++) {
        let words = Dictionary.getRandomWords(config.wordsPerGrid);

		wordSearchImages.push(drawWordSearch(words));
		console.log(`Generated ${i + 1} / ${config.wordSearchCount} word search images...`);
    }

	let pdf = await PDFDocument.create();

	for (let wordSearchImage of wordSearchImages) {
		let page = pdf.addPage();
		page.setSize(960, 960);

		let pdfImage = await pdf.embedPng(wordSearchImage);

		page.drawImage(pdfImage, {
			x: 80,
			y: 140,
			width: 800,
			height: 680
		});
	}

	fs.createWriteStream("media/book.pdf").write(await pdf.save());

	console.log("Created media/book.pdf!");

	fs.writeFileSync("media/used.txt", usedWords.join("\n"));

	console.log("Created media/used.txt and dumped all used words to it.");

}

main();