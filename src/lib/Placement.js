const Rotation = {
  HORIZONTAL: [0, 1],
  HORIZONTAL_BACKWARDS: [-1, 0],
  VERTICAL: [0, 1],
  VERTICAL_BACKWARDS: [0, -1],
  DIAGONAL_LEFT: [-1, 1],
  DIAGONAL_LEFT_BACKWARDS: [-1, -1],
  DIAGONAL_RIGHT: [1, 1],
  DIAGONAL_RIGHT_BACKWARDS: [1, -1],
};

class Placement {
  static inAllRotations(x, y, word) {
    let placements = [];
    for (let rotation in Rotation) {
      placements.push(new Placement(x, y, word, Rotation[rotation]));
    }
    return placements;
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {string} word,
   * @param {number} rotation
   */
  constructor(x, y, word, rotation) {
    this.x = x;
    this.y = y;
    this.word = word;
    this.rotation = rotation;
  }

  /**
   * @param {string[][]} grid
   */
  fits(grid) {
    let currX = this.x;
    let currY = this.y;
    let index = 0;
    for (let letter of this.word.split("")) {
      try {
        if (grid[currY][currX] != " " && grid[currY][currX] != word[index]) {
          return false;
        }
      } catch (err) {
        return false;
      }
      currX += this.rotation[0];
      currY += this.rotation[1];
      index++;
    }
    return true;
  }

  place(grid) {
    let currX = this.x;
    let currY = this.y;
    for (let letter of this.word.split("")) {
      grid[currY][currX] = letter;
      currX += this.rotation[0];
      currY += this.rotation[1];
    }
  }
}

module.exports = Placement;
