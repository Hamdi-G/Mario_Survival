function Player(x, y, width, height, speed) {
        this.dead = false;
        this.coins = 0;
         this.x = 10;
         this.y = 10;
         this.width = 50;
         this.height = 50;
         this.speed = 100; // pixels/s this time !

    this.draw = function (ctx, sprite) {
      ctx.save();
  		ctx.drawImage(sprite,this.x,this.y,this.width,this.height);
  		ctx.restore();
    };

    this.updatePosition = function(delta, inputStates){
      this.speedX = this.speedY = 0;
        // check inputStates
        if (inputStates.left) {
            this.speedX = -this.speed;
            socket.emit('sendpos', username, this.x, this.y);
        }
        if (inputStates.up) {
            this.speedY = -this.speed;
            socket.emit('sendpos', username, this.x, this.y);
        }
        if (inputStates.right) {
            this.speedX = this.speed;
            socket.emit('sendpos', username, this.x, this.y);
        }
        if (inputStates.down) {
            this.speedY = this.speed;
            socket.emit('sendpos', username, this.x, this.y);
        }
        if (inputStates.space) {
        }
        if (inputStates.mousePos) {
        }
        if (inputStates.mousedown) {
            this.speed = 500;
            socket.emit('sendpos', username, this.x, this.y);
        } else {
            // mouse up
            this.speed = 100;
          
        }

        // Compute the incX and inY in pixels depending
        // on the time elasped since last redraw
        this.x += calcDistanceToMove(delta, this.speedX);
        this.y += calcDistanceToMove(delta, this.speedY);

    };
}


if (typeof module !== 'undefined' && module.exports) {
    module.exports.Player = Player;
}
