function randint(l, u) {
  return Math.floor(Math.random() * (u - l) + l);
}

function choice(arr) {
  return arr[randint(0, arr.length)];
}

module.exports = {
  randint,
  choice,
};
