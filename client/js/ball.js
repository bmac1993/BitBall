var Ball = function(speed, xSpeed, ySpeed, x, y){
    this.speed = speed;
    this.xSpeed = xSpeed;
    this.ySpeed = xSpeed;

    this.x = x;
    this.y = y;
    this.verticies = [];
    this.radius = 5;

    this.update = function () {
        if (this.x + this.radius > WIDTH) {
            if (this.xSpeed > 0) {
                this.xSpeed = -this.xSpeed;
            }
                
        }
        if (this.x - this.radius < 0) {
            if (this.xSpeed < 0) {
                this.xSpeed = -this.xSpeed;
            }
        }
        if (this.y + this.radius > HEIGHT) {
            if (this.ySpeed > 0) {
                this.ySpeed = -this.ySpeed;
            }
        }
        if (this.y - this.radius < 0) {
            if (this.ySpeed < 0) {
                this.ySpeed = -this.ySpeed;
            }
        }

        this.x += this.xSpeed * dt;
        this.y += this.ySpeed * dt;

        this.updateVerticies();
    };

    this.updateVerticies = function () {
        this.verticies = [];
        this.verticies.push({ x: this.x - this.radius, y: this.y, side: "left" });
        this.verticies.push({ x: this.x + this.radius, y: this.y, side: "right" });
        this.verticies.push({ x: this.x, y: this.y - this.radius, side: "top" });
        this.verticies.push({ x: this.x, y: this.y + this.radius, side: "bottom" });
    }

    this.draw = function () {

        ctx.globalAlpha = 1.0;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = "green";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fill();
    
    };

    // lineVectors = { a: { x:x, y:y }, b: { x:x, y:y } }
    //this.updateSlope = function (lineVectors) {

    //    if (lineVectors.a.x - lineVectors.b.x == 0) { // reflecting surface is flat 
    //        this.xSpeed = (-1) * this.xSpeed;
    //    }
    //    else if (lineVectors.a.y - lineVectors.b.y == 0) {
    //        this.ySpeed = (-1) * this.ySpeed;
    //    }
    //    else {  // reflecting surface is uneven
    //        var playerSlope = (lineVectors.a.y - lineVectors.b.y) / (lineVectors.a.x - lineVectors.b.x);
    //        var ballSlope = -this.ySpeed / this.xSpeed;
    //        var y = ((2 * playerSlope) + (ballSlope * Math.pow(playerSlope, 2)) - ballSlope);
    //        var x = (2 * playerSlope * ballSlope - Math.pow(playerSlope, 2) + 1);

    //        var largerNumber = (Math.abs(x)) > (Math.abs(y)) ? x : y;
    //        var ratio = this.speed / largerNumber;
    //        this.xSpeed = Math.abs(ratio) * x;
    //        this.ySpeed = Math.abs(ratio) * y;
    //    }
    //}
};