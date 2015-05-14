"use strict"

function Player(shape, team, x, y)
{
    this.id = Math.round(Math.random() * 10000);
    this.x = x;
    this.y = y;
    this.verticies = [];
	this.radius = 20;
	this.speed = 150;
	
	this.up = false;
	this.down = false;
	this.left = false;
	this.right = false;

	this.team = team;   // Red or Blue
	this.shape = shape;     // Square, Decagon, or Triangle

	this.hitTimer = 0;

	this.update = function()
	{	
	    /*if(checkCollisions(circle,rect))	//Check for collisions with obstacle
		{
			gameOverSound();
			this.dead = true;
			obstacles[i].dead = true;
				
		}*/

	    this.move();
	    this.updateVerticies();
	}
	
	this.updateVerticies = function () {
	    this.verticies = [];

	    if (this.shape == "Square") {
	        this.verticies.push({ x: this.x, y: this.y });
	        this.verticies.push({ x: this.x + this.radius * 2, y: this.y });
	        this.verticies.push({ x: this.x + this.radius * 2, y: this.y + this.radius * 2 });
	        this.verticies.push({ x: this.x, y: this.y + this.radius * 2 });
	    }
	    if (this.shape == "Triangle") {
	        this.verticies.push({ x: this.x, y: this.y });
	        this.verticies.push({ x: this.x + this.radius * 2, y: this.y + this.radius});
	        this.verticies.push({ x: this.x + this.radius * 2, y: this.y - this.radius});
	    }
	    if (this.shape == "Decagon") {
	        this.verticies.push({ x: this.x + this.radius / 5, y: this.y });
	        this.verticies.push({ x: this.x + this.radius, y: this.y });
	        this.verticies.push({ x: this.x + this.radius * 1.6, y: this.y - this.radius / 2 });
	        this.verticies.push({ x: this.x + this.radius * 1.8, y: this.y - this.radius * 1.2 });
	        this.verticies.push({ x: this.x + this.radius * 1.6, y: this.y - this.radius * 2 });
	        this.verticies.push({ x: this.x + this.radius, y: this.y - this.radius * 2.5 });
	        this.verticies.push({ x: this.x + this.radius / 5, y: this.y - this.radius * 2.5 });
	        this.verticies.push({ x: this.x - this.radius * 0.4, y: this.y - this.radius * 2 });
	        this.verticies.push({ x: this.x - this.radius * 0.6, y: this.y - this.radius * 1.2 });
	        this.verticies.push({ x: this.x - this.radius * 0.4, y: this.y - this.radius / 2 });
	    }
	}

	this.draw = function()
	{
	    if (this.shape == "Square") {
	        ctx.globalAlpha = 1.0;
	        ctx.beginPath();
	        ctx.fillStyle = this.team;
	        ctx.fillRect(this.x, this.y, this.radius * 2, this.radius * 2);

	        if (this.hitTimer > 0) {
	            ctx.globalAlpha = this.hitTimer / 3;
	            ctx.strokeStyle = "red";
	            ctx.lineWidth = 3;
	            ctx.strokeRect(this.x, this.y, this.radius * 2, this.radius * 2);
	            ctx.restore();
	        }
	        else {
	            //ctx.globalAlpha = this.hitTimer / 3;
	            ctx.strokeStyle = "green";
	            ctx.lineWidth = 3;
	            ctx.strokeRect(this.x, this.y, this.radius * 2, this.radius * 2);
	            ctx.restore();
	        }
	    }
	    if (this.shape == "Triangle") {
	        ctx.globalAlpha = 1.0;
	        ctx.beginPath();
	        ctx.moveTo(this.x, this.y);
	        ctx.lineTo(this.x + this.radius*2, this.y + this.radius);
	        ctx.lineTo(this.x + this.radius * 2, this.y - this.radius);
	        ctx.lineTo(this.x, this.y);
	        ctx.fillStyle = this.team;
	        ctx.fill();

	        if (this.hitTimer > 0) {
	            ctx.globalAlpha = this.hitTimer / 3;
	            ctx.strokeStyle = "red";
	            ctx.lineWidth = 3;
	            ctx.stroke();
	            ctx.restore();
	        }
	        else {
	            //ctx.globalAlpha = this.hitTimer / 3;
	            ctx.strokeStyle = "green";
	            ctx.lineWidth = 3;
	            ctx.stroke();
	            ctx.restore();
	        }
	    }

	    if (this.shape == "Decagon") {
	        ctx.globalAlpha = 1.0;
	        ctx.beginPath();
	        ctx.moveTo(this.x + this.radius/5, this.y);
	        ctx.lineTo(this.x + this.radius, this.y);
	        ctx.lineTo(this.x + this.radius*1.6, this.y - this.radius/2);
	        ctx.lineTo(this.x + this.radius*1.8, this.y - this.radius*1.2);
	        ctx.lineTo(this.x + this.radius*1.6, this.y - this.radius*2);
	        ctx.lineTo(this.x + this.radius, this.y - this.radius * 2.5);
	        ctx.lineTo(this.x + this.radius / 5, this.y - this.radius * 2.5);
	        //left side
	        ctx.lineTo(this.x - this.radius * 0.4, this.y - this.radius * 2);
	        ctx.lineTo(this.x - this.radius * 0.6, this.y - this.radius * 1.2);
	        ctx.lineTo(this.x - this.radius * 0.4, this.y - this.radius / 2);
	        //ctx.moveTo(this.x, this.y - this.radius * 2.5);
	        //ctx.lineTo(this.x - this.radius / 2, this.y - this.radius / 2);
	        //ctx.lineTo(this.x - this.radius / 1.7, this.y - this.radius / 1.5);
	        //ctx.lineTo(this.x - this.radius / 2, this.y - this.radius/2);
	        ctx.lineTo(this.x + this.radius/5, this.y);
	        ctx.closePath();
	        ctx.fillStyle = this.team;
	        ctx.fill();

	        if (this.hitTimer > 0) {
	            ctx.globalAlpha = this.hitTimer / 3;
	            ctx.strokeStyle = "red";
	            ctx.lineWidth = 3;
	            ctx.stroke();
	            ctx.restore();
	        }
	        else {
	            //ctx.globalAlpha = this.hitTimer / 3;
	            ctx.strokeStyle = "green";
	            ctx.lineWidth = 3;
	            ctx.stroke();
	            ctx.restore();
	        }
	    }
	}

	this.move = function () {
	    if (this.up) {
	        if ((this.y) > 0) {
	            this.y -= this.speed * dt;
	        }
	    }
	    else if (this.down) {
	        if ((this.y + this.radius*2) < HEIGHT) {
	            this.y += this.speed * dt;
	        }
	    }

	    if (this.left) {
	        if (this.team == "Blue") {
	            if (this.x > 0) {
	                this.x -= this.speed * dt;
	            }
	        }
	        if (this.team == "Red") {
	            if (this.x > WIDTH / 2) {
	                this.x -= this.speed * dt;
	            }
	        }
	    }
	    else if (this.right) {
	        if (this.team == "Blue") {
	            if (this.x + this.radius*2 < WIDTH / 2) {
	                this.x += this.speed * dt;
	            }
	        }
	        if (this.team == "Red") {
	            if (this.x + this.radius*2 < WIDTH) {
	                this.x += this.speed * dt;
	            }
	        }
	    }
	}
}