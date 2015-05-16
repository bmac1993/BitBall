"use strict";

	var GAME_STATE_TEAM_SELECT = 0;
    var GAME_STATE_SIGN_IN = 3;
	var GAME_STATE_PLAYING = 1;
	var GAME_STATE_END = 2;
    var gameState = GAME_STATE_TEAM_SELECT;
	var level = 0;
    var team1score = 0;
    var team2score = 0;
    var winner = "";    //Red or Blue

    var mouseX,mouseY = 0;

    var animationID;
    var paused = false;
    var canvas, ctx;
    var ios, android, ua;
    var socket;

    // set up some initial values
    var WIDTH = 1000;
    var HEIGHT = 500;
    var scale;
    	
    // we'll set the rest of these in the init function
    var RATIO = undefined;
    var currentWidth = undefined;
    var currentHeight = undefined;
    var offset = { top: 0, left: 0 };

	var lastTime;
	
	var dt = 0;
	var elapsedTime = 0;

	var ball;
	var player;
	var players = [];

	var highscore = 0;

	var team = "";
	var shape = "";
	var btnRed;
	var btnBlue;
	var btnTriangle;
	var btnSquare;
	var btnDecagon;
	var checkmark;
	var btnGo;

    window.onload = init;

    function setupSocket() {

        socket.on('updateGameData', function (data) {
            team1score = data.team1score;
            team2score = data.team2score;
            winner = data.winner;
            if (data.gameState == 0) {
                gameState = GAME_STATE_TEAM_SELECT;
                bgAudio.pause();
                bgAudio.currentTime = 0;
            }
            ball = new Ball(data.ball.speed, data.ball.xSpeed, data.ball.ySpeed, data.ball.x, data.ball.y);

            players = [];
            if (player != undefined) {
                for (var i = 0; i < data.players.length; i++) {
                    if (data.players[i].id != player.id) {  //player is not current player
                        players.push(new Player(data.players[i].shape, data.players[i].team, data.players[i].x, data.players[i].y));
                    }
                    else {
                        player.hitTimer = data.players[i].hitTimer;
                        if (data.players[i].hitTimer == 3) {
                            effectAudio.play();
                        }
                    }
                }
            }
        });
    }

    function updatePlayers() {
       
        socket.emit('updatePlayers', player);
    }

    function drawComrads() {
        for (var i = 0; i < players.length; i++) {
            players[i].draw();
        }
    }

    function init() {
        console.log("init called");
        lastTime = 0;
        gameState = GAME_STATE_TEAM_SELECT;
        canvas = document.querySelector("canvas");
        ctx = canvas.getContext("2d");

        //when the user clicks the connect button, fire the connectSocket function
        socket = io.connect();
        setupSocket();

        socket.on('connect', function () {
            socket.emit('join');
        });

        //ctx.translate(0, HEIGHT);
        //ctx.save();
        // the proportion of width to height
        RATIO = WIDTH / HEIGHT;

        // these will change when the screen is resized
        currentWidth = WIDTH;
        currentHeight = HEIGHT;

        // this is our canvas element
        canvas = document.querySelector('canvas');
        canvas.width = WIDTH;
        canvas.height = HEIGHT;

		localStorage.highscore = highscore;
		
        runListeners();
        
		bgAudio = document.querySelector("#bgAudio"); 
		bgAudio.volume=0.5; 
		effectAudio = document.querySelector("#effectAudio"); 
		effectAudio.volume = 0.2;

        update();
    }

    function reset() {
        bgAudio.play();

        team1score = 0;
        team2score = 0;
        player = new Player(shape, team, (team == "Red") ? (WIDTH / 2) + (WIDTH / 4) : (WIDTH / 2) - (WIDTH / 4), HEIGHT/2);
		ball = new Ball(200,200,200, WIDTH/2, HEIGHT/2);
		
		elapsedTime = 0;
		level = 0;
    }

    function update() {
		dt = calculateDeltaTime(lastTime);
		elapsedTime += dt;
        if (paused) {
            drawPauseScreen();
            return;
        }
		
		if(gameState == GAME_STATE_PLAYING)
		{
		    //updateGameData();
		    //checkForCollisions();
			player.update();
			//ball.update();
			updatePlayers();
			
		}
		
		animationID = requestAnimationFrame(update);
        
        draw();
    }
	 function draw()
	 {
        ctx.fillStyle = "#d0d0d0";
        ctx.clearRect(0,0, WIDTH, HEIGHT);
		
		if(gameState == GAME_STATE_PLAYING)
		{	
		    player.draw();
		    ball.draw();
		    drawComrads();
		}
		
        drawHUD();
	 }


    function drawHUD() 
	{
		if(gameState == GAME_STATE_TEAM_SELECT)
		{
		    document.getElementById("red").style.display = "";
		    document.getElementById("blue").style.display = "";
		    document.getElementById("decagon").style.display = "";
		    document.getElementById("triangle").style.display = "";
		    document.getElementById("square").style.display = "";
		    document.getElementById("start").style.display = "";

		    ctx.font = "24px Arial";
		    ctx.fillStyle = "#214356";
		    ctx.textAlign = "left"
		    
		    ctx.fillText("Select your shape:   " + shape, WIDTH / 4 -100, HEIGHT / 5);

		    //ctx.drawImage(btnSquare, WIDTH / 4 - 100, HEIGHT / 2 - HEIGHT / 4);
		    //ctx.drawImage(btnTriangle, WIDTH / 2 - 100, HEIGHT / 2 - HEIGHT / 4);
		    //ctx.drawImage(btnDecagon, WIDTH / 2 + WIDTH / 4 - 100, HEIGHT / 2 - HEIGHT / 4);

		    ctx.fillText("Choose a team:   " + team, WIDTH / 4 - 100, HEIGHT / 2 + 50);
		    //ctx.drawImage(btnRed, WIDTH / 4 - 100, HEIGHT / 2 +80);
		    //ctx.drawImage(btnBlue, WIDTH / 2 - 100, HEIGHT / 2 + 80);
		    //ctx.drawImage(btnGo, WIDTH / 2 + WIDTH / 4 - 100, HEIGHT / 2 + 80);

            
		    if (winner != "") {
		        ctx.font = "30px Arial";
		        ctx.fillStyle = winner;
		        ctx.fillText(winner + " team wins!", WIDTH / 2, HEIGHT / 2);
		    }

			
		}
		if(gameState == GAME_STATE_PLAYING)
		{
			ctx.fillStyle = "#214356";
			ctx.textAlign = "center"
			ctx.textBaseline = 'middle';
			ctx.fillStyle = "#214356;";
			ctx.font = "20px Arial";
			ctx.fillText(Math.floor(team1score), WIDTH / 2 - 20, 30);
			ctx.fillText(Math.floor(team2score), WIDTH / 2 + 20, 30);
			ctx.fillStyle = "#214356;"
			ctx.font="20px Arial";
			
			ctx.restore();
			ctx.beginPath();
			ctx.moveTo(WIDTH/2, 0);
			ctx.lineTo(WIDTH/2, HEIGHT);
			ctx.stroke();
		}
		if(gameState == GAME_STATE_END)
		{
			ctx.fillStyle = "#214356";
			ctx.textAlign = "center"
			ctx.fillText("Someone Screwed Up",WIDTH/2, HEIGHT/2 - 40);
			ctx.fillText("Final Score: " + Math.floor(score),WIDTH/2, HEIGHT/2);	
			ctx.fillText("Highscore: " + Math.floor(localStorage.highscore),WIDTH/2, HEIGHT/2 + 20);	
			ctx.fillText("Click to restart...",WIDTH/2, HEIGHT/2 + 60);	
		}
    }

    function drawPauseScreen() {
        ctx.save();
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        //ctx.drawText("... PAUSED ...", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 60, "white");
        ctx.restore();
    }
    
    function calculateDeltaTime()
	{
		var now, fps;
		now = (+new Date);
		fps = 1000 / (now - lastTime);
		fps = clamp(fps, 12, 60);
		lastTime = now;
		return 1 / fps;
	}