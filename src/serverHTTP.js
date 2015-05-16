var WIDTH = 900;
var HEIGHT = 460;

var Ball = function (speed, xSpeed, ySpeed, x, y) {
    this.speed = speed;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;

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

        this.x += this.xSpeed * 0.03;
        this.y += this.ySpeed * 0.03;

        this.updateVerticies();
    };

    this.updateVerticies = function () {
        this.verticies = [];
        this.verticies.push({ x: this.x - this.radius, y: this.y, side: "left" });
        this.verticies.push({ x: this.x + this.radius, y: this.y, side: "right" });
        this.verticies.push({ x: this.x, y: this.y - this.radius, side: "top" });
        this.verticies.push({ x: this.x, y: this.y + this.radius, side: "bottom" });
    };

    //lineVectors format = { a: { x:x, y:y }, b: { x:x, y:y } }
    this.updateSlope = function (lineVectors) {

        if (lineVectors.a.x - lineVectors.b.x == 0) { // reflecting surface is flat 
            this.xSpeed = (-1) * this.xSpeed;
        }
        else if (lineVectors.a.y - lineVectors.b.y == 0) {
            this.ySpeed = (-1) * this.ySpeed;
        }
        else {  // reflecting surface is uneven
            var playerSlope = (lineVectors.a.y - lineVectors.b.y) / (lineVectors.a.x - lineVectors.b.x);
            var ballSlope = -this.ySpeed / this.xSpeed;
            var y = ((2 * playerSlope) + (ballSlope * Math.pow(playerSlope, 2)) - ballSlope);
            var x = (2 * playerSlope * ballSlope - Math.pow(playerSlope, 2) + 1);

            var largerNumber = (Math.abs(x)) > (Math.abs(y)) ? x : y;
            var ratio = this.speed / largerNumber;
            this.xSpeed = Math.abs(ratio) * x;
            this.ySpeed = Math.abs(ratio) * y;
        }
    }
};

var http = require('http'); //the http module will be stored as the variable http
var fs = require('fs'); //the file system module for file/folder functions stored as the variable fs
//import the websocket library. There are many, but socket.io is one of the most common and feature rich
var socketio = require('socket.io');

//port for the server to listen on. process.env.port and process.env.NODE_PORT are environment variables
//that can be setup on a server (such as heroku) for non-hard-coded variables.
//If neither are set (usually local development) then use 3000
var port = process.env.PORT || process.env.NODE_PORT || 3000;

//read the client html file into memory
//__dirname in node is the current directory (in this case the same folder as the server js file)
var index = fs.readFileSync(__dirname + '/../client/client.html');
var main = fs.readFileSync(__dirname + '/../client/js/main.js');
var player = fs.readFileSync(__dirname + '/../client/js/player.js');
var ball = fs.readFileSync(__dirname + '/../client/js/ball.js');
var collisions = fs.readFileSync(__dirname + '/../client/js/collisions.js');
var utilities = fs.readFileSync(__dirname + '/../client/js/utilities.js');
var audio = fs.readFileSync(__dirname + '/../client/js/audio.js');

//function to handle requests
//will automatically receive request and response from the http server
function onRequest(request, response) {
    console.log("Received Request: " + request.url);
    if (request.url == "/") {
        
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(index);
        response.end();
    }
    else if (request.url.indexOf('.js') != -1) {
        fs.readFile(__dirname + '/../client' + request.url, function (error, data) {
            if (error) {
                response.writeHead(404, { "COntent-type": "text/plain" });
                response.end("No Javascript Page Found.");
            } else {
                response.writeHead(200, { 'Content-Type': 'text/javascript' });
                response.write(data);
                response.end();
            }

        });
       
    }
    else if (request.url.indexOf('.png') != -1) {
        fs.readFile(__dirname + '/../client' + request.url, function (error, data) {
            if (error) {
                response.writeHead(404, { "COntent-type": "text/plain" });
                response.end("No Image Found.");
            } else {
                response.writeHead(200, { 'Content-Type': 'image/png' });
                response.write(data);
                response.end();
            }

        });
    }
    else if (request.url.indexOf('.wav') != -1) {
        fs.readFile(__dirname + '/../client' + request.url, function (error, data) {
            if (error) {
                response.writeHead(404, { "COntent-type": "text/plain" });
                response.end("No Audio Found.");
            } else {
                response.writeHead(200, { 'Content-Type': 'audio/vnd.wave' });
                response.write(data);
                response.end();
            }

        });
        
    }
    else if (request.url.indexOf('.mp3') != -1) {
        fs.readFile(__dirname + '/../client' + request.url, function (error, data) {
            if (error) {
                response.writeHead(404, { "COntent-type": "text/plain" });
                response.end("No Audio Found.");
            } else {
                response.writeHead(200, { 'Content-Type': 'audio/mp3' });
                response.write(data);
                response.end();
            }

        });

    }
    else {
        console.log("Inside the inside else statement");
        response.writeHead(404, { "COntent-type": "text/plain" });
        response.end("No Page Found");
    }
}

function isPointInPoly(poly, pt) {
    for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
        ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
        && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
        && (c = !c);
    return c;
}

function lineDistance(point1, point2) {
    var xs = 0;
    var ys = 0;

    xs = point2.x - point1.x;
    xs = xs * xs;

    ys = point2.y - point1.y;
    ys = ys * ys;

    return Math.sqrt(xs + ys);
}

function getSideCollided(playerVertices, ballCord) {
    var a = undefined;
    var b = undefined;

    for (var i = 0; i < playerVertices.length; i++) {
        var playerCoord = playerVertices[i];
        playerCoord.distance = lineDistance(playerCoord, ballCord);

        if (a == undefined || a.distance > playerCoord.distance) {
            if (a != undefined) {
                b = a;
            }
            a = playerCoord;
        }
        else if (b == undefined || b.distance > playerCoord.distance) {
            b = playerCoord;
        }
    }

    return { a: a, b: b };
}

//call the http module's create server function with a request callback and tell it to listen on port 3000. 
//Normally this would be port 80, 443 or 8080, but in this example we use 3000 to prevent conflicting with local machine traffic
var app = http.createServer(onRequest).listen(port);

//pass in the http server into socketio and grab the websocket server as io
var io = socketio(app);

//object to hold all of our connected users
var users = {};

var players = [];

var ball = new Ball(150, 150, 150, 0, 0);

var team1score = 0;
var team2score = 0;
var gameState = 1;

//function to attach a handler for when people join
var onJoined = function(socket) {


    socket.on("join", function (data) {
		socket.join('room1');
	});
};

function updateGame() {
    
    if (players.length > 0) {

        for (var j = 0; j < players.length; j++) {
            var player = players[j];

            if (player.hitTimer <= 0) {
                for (var i = 0; i < ball.verticies.length; i++) {
                    var coords = ball.verticies[i];
                    console.log(players[j].hitTimer);
                    if (isPointInPoly(player.verticies, coords)) {  // ball collided with a polygon

                        players[j].hitTimer = 3;
                        var lineVectors = getSideCollided(player.verticies, coords); // gets the verticies of the line the ball collided with

                        ball.updateSlope(lineVectors);

                        if (player.team == "Blue") {
                            team1score++;
                        }
                        if (player.team == "Red") {
                            team2score++;
                        }

                        break;
                    }
                }
            }
            else {
                players[j].hitTimer -= 0.02;
            }
        }
        var data = {};
        data.winner = "";
        if (team1score >= 20 || team2score >= 20) { // handle end of game
            data.winner = (team1score >= 20) ? "Blue" : "Red";
            gameState = 0;
            team1score = 0;
            team2score = 0;
            players = [];
        }
        else {
            gameState = 1;
        }
        ball.update();

        data.players = players;
        data.ball = ball;
        data.team1score = team1score;
        data.team2score = team2score;
        data.gameState = gameState;
        console.log("emitting");
        io.sockets.in('room1').emit('updateGameData', data);
    }
}

setInterval(updateGame, 17);

//function to attach a handler for when people send a message
var onMsg = function(socket) {

	socket.on('updatePlayers', function(data) {

	    var player;
	    var hitTimer;
	    for (var i = 0; i < players.length; i++) {
	        if (players[i].id === data.id) {
	            data.hitTimer = players[i].hitTimer; // We want the servers value of hitTimer
	            players.splice(i, 1);
	        }
	    }
	    players.push(data);
	});
};


var onDisconnect = function(socket) {

	socket.on("disconnect", function(data) {
	    players = [];
		socket.broadcast.to('room1').emit('msg', {name: 'server', msg: socket.name + " has left the room."});
        
		socket.leave('room1');
        
        //we will also remove the user from users object we made since they are no longer connected
		delete users[socket.name];
	});
};

console.log('starting up');

//tell the server what to do when new sockets connect
//'connection' is a built-in event from socketio that fires any time a new connection occurs
//The 'connection' event automatically sends the newly connected socket to the function 
io.sockets.on("connection", function(socket) {

    console.log('started');
    
    //call the functions to attach handlers and send in the new socket connect
    onJoined(socket); //pass socket to onJoined to attach joined event
    onMsg(socket); //pass socket to onMsg to attach message event
    onDisconnect(socket); //pass socket to onDisconnect to attach disconnect event
	
});

