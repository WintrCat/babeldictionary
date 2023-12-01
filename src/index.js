const pdf = require("pdf-lib");
const canvas = require("canvas");
const fs = require("fs");

const config = require("./config.json");

const dictionary = fs.readFileSync("src/resources/filteredDictionary.txt", "utf-8").split("\n");

/**
 * @param {string[]} words 
 */
function drawWordSearch(words) {

    let grid = [];
    for (let i = 0; i < config.gridSize; i++) {
        grid.push([]);
    }

    let wordSearchCanvas = new canvas.Canvas(780, 680).getContext("2d");

    wordSearchCanvas.strokeStyle = "#000000";
    wordSearchCanvas.lineWidth = 2;

    

}

function main() {

    let usedWords = [];

    for (let i = 0; i < config.wordSearchCount; i++) {

        

    }

}

main();