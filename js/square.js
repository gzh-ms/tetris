const Square = function() {
  // 方块矩阵
  this.data = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];

  // 原点
  this.origin = {
    x: 0,
    y: 0
  };

  // 旋转方向
  this.dir = 0;
};

Square.prototype.canDown = function(isValid) {
  const test = {
    x: this.origin.x + 1,
    y: this.origin.y
  };

  return isValid(test, this.data);
};

Square.prototype.down = function() {
  this.origin.x = this.origin.x + 1;
};

Square.prototype.canLeft = function(isValid) {
  const test = {
    x: this.origin.x,
    y: this.origin.y - 1
  };

  return isValid(test, this.data);
};

Square.prototype.left = function() {
  this.origin.y = this.origin.y - 1;
};

Square.prototype.canRight = function(isValid) {
  const test = {
    x: this.origin.x,
    y: this.origin.y + 1
  };

  return isValid(test, this.data);
};

Square.prototype.right = function() {
  this.origin.y = this.origin.y + 1;
};

Square.prototype.canRotate = function(isValid) {
  const d = (this.dir + 1) % 4;

  return isValid(this.origin, this.rotates[d]);
};

Square.prototype.rotate = function(num) {
  if (!num) num = 1;
  this.dir = (this.dir + num) % 4;

  this.data = this.rotates[this.dir];
};

export default Square;
