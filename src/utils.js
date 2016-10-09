
function intersect(x, y) {
  console.log('intersecting')
  return $.map(x, function (xi) {
    return $.inArray(xi, y) < 0 ? null : xi;
  })
}
function Point(x, y) {
  this.x = x;
  this.y = y;
}
function randomPoint() {
  var randomx = randomNumber(WIDTH);
  var randomy = randomNumber(HEIGHT);
  var randomPoint = new Point(randomx, randomy);
  return randomPoint; 
}
function randomNumber(boundary) {
  return parseInt(Math.random() * boundary);
  //return Math.floor(Math.random() * boundary);
}
function distance(p1, p2) {
  return euclidean(p1.x-p2.x, p1.y-p2.y);
}
function euclidean(dx, dy) {
  return Math.sqrt(dx*dx + dy*dy);
}

module.exports = { distance: distance, randomNumber: randomNumber, euclidean: euclidean, randomPoint: randomPoint, Point: Point, intersect: intersect }
