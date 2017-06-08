function Ball(x, y, angle, v, diameter) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.v = v;
    this.radius = diameter / 2;

    this.draw = function (ctx, sprite) {
      ctx.save();
  		ctx.drawImage(sprite,this.x-this.radius,this.y-this.radius,this.radius*2,this.radius*2);
  		ctx.restore();
    };

    this.move = function () {
        // add horizontal increment to the x pos
        // add vertical increment to the y pos

        var incX = this.v * Math.cos(this.angle);
        var incY = this.v * Math.sin(this.angle);

        this.x += calcDistanceToMove(delta, incX);
        this.y += calcDistanceToMove(delta, incY);
    };

    this.disappear = function(){
      this.x = undefined;
      this.y = undefined;
    };
}
