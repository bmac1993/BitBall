"use strict"

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

    function inArray(array, id) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].id === id) {
                return i;
            }
        }
        return false;
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

	function pointInsideCircle(x, y, I)
	{
		var dx = x - I.x;
		var dy = y - I.y;
		return dx * dx + dy * dy <= I.radius * I.radius;
	}

	function circlesIntersect(c1, c2)
	{
		var dx = c2.x - c1.x;
		var dy = c2.y - c1.y;
		var distance = Math.sqrt(dx * dx + dy * dy);
		return distance < c1.radius + c2.radius;
	}
    
	function collides(a, b) {
	    var ax = a.x - a.width/2;
	    var ay = a.y - a.height/2;
	    var bx = b.x - b.width/2;
	    var by = b.y - b.height/2;
		
	    return ax < bx + b.width && ax + a.width > bx && ay < by +b.height && ay + a.height > by;
	}

	function getRandomUnitVector()
	{
		var x = getRandom(-1, 1);
		var y = getRandom(-1, 1);
		var length = Math.sqrt(x * x + y * y);
		if (length == 0)
		{
			x = 1;
			y = 0;
			length = 1;
		}
		else
		{
			x /= length;
			y /= length;
		}

		return {
			x: x,
			y: y
		};
	}

	function getRandom(min, max)
	{
		return Math.random() * (max - min) + min;
	}

	function getRandomColor()
	{
		var red = Math.round(Math.random() * 200 + 55);
		var green = Math.round(Math.random() * 200 + 55);
		var blue = Math.round(Math.random() * 200 + 55);
		var color = 'rgb(' + red + ',' + green + ',' + blue + ')';
		return color;
	}

	function clamp(val, min, max)
	{
		return Math.max(min, Math.min(max, val));
	}

	function getMouse(e) {
	    var mouse = {}
	    var x = e.clientX;
	    var y = e.clientY;
	    var rect = canvas.getBoundingClientRect();

	    x -= rect.left;
	    y -= rect.top;

	    mouse.x = x;
	    mouse.y = y;
	    return mouse;
	}

	function runListeners()
	{
		// Account creating and login listeners
		document.getElementById("login").addEventListener("click", login.authenticate);
		document.getElementById("createAcc").addEventListener("click", login.createAccount);

		document.getElementById("displayLogin").addEventListener("click", function(){
			$('#password2').hide();
			$('#login').show();
			$('#createAcc').hide();
			$('#createAccountTxt').hide();
			$('#loginTxt').show();
			$('#password2txt').hide();
		});
		document.getElementById("displayCreateAcc").addEventListener("click", function() {
			$('#password2').show();
			$('#login').hide();
			$('#createAcc').show();
			$('#loginTxt').hide();
			$('#createAccountTxt').show();
			$('#password2txt').show();
		});

		// Shape and Team select listeners
	    document.getElementById("square").addEventListener("click", function () {
	        shape = "Square";
			document.getElementById("shapeValue").innerHTML = "Square";
	    });
	    document.getElementById("triangle").addEventListener("click", function () {
	        shape = "Triangle";
			document.getElementById("shapeValue").innerHTML = "Triangle";
	    });
	    document.getElementById("decagon").addEventListener("click", function () {
	        shape = "Decagon";
			document.getElementById("shapeValue").innerHTML = "Decagon";
	    });
	    document.getElementById("blue").addEventListener("click", function () {
	        team = "Blue";
			document.getElementById("teamValue").innerHTML = "Blue";
	    });
	    document.getElementById("red").addEventListener("click", function () {
	        team = "Red";
			document.getElementById("teamValue").innerHTML = "Red";
	    });
	    document.getElementById("start").addEventListener("click", function () {
	        if (shape != "" && team != "") {
	            $('.teamSelect').hide();
	            gameState = GAME_STATE_PLAYING;
	            reset();
	        }
	        else {
	            document.getElementById("err").innerHTML = "Select a Team and Shape!";
	        }
	        
	    });

		// PLAYING listeners
	    canvas.addEventListener("mousemove", function (e)
		{
			var x = e.clientX;
			var y = e.clientY;
			var rect = canvas.getBoundingClientRect();

			x -= rect.left;
			y -= rect.top;

			mouseX = x;
			mouseY = y;
		},false);
		
		window.addEventListener('keydown',function(e)
		{
			var code = e.keyCode;
			console.log(code);
			switch(code)
			{
				case 37:
				case 65: player.left = true; break;
				case 38:
        		case 87: player.up = true; break;
        		case 39:
				case 68: player.right = true; break;
        		case 40:
				case 83: player.down = true; break;
			}
//			
//			if(code == 65){player.left = true;}
//			else{player.left = false;}
//			
//			if(code == 87){player.up = true;}
//			else{player.up = false;}
//			
//			if(code == 68){player.right = true;}
//			else{player.right = false;}
//			
//			if(code == 83){player.down = true;}
//			else{player.down = false;};


		},false);
		
		window.addEventListener('keyup',function(e)
		{
			var code = e.keyCode;
			
			switch(code)
			{
				case 37:
				case 65: player.left = false; break;
        		case 38:
				case 87: player.up = false; break;
        		case 39:
				case 68: player.right = false; break;
        		case 40:
				case 83: player.down = false; break;
			}
		},false);

	}
	
var clone = (function(){ 
  return function (obj) { Clone.prototype=obj; return new Clone() };
  function Clone(){}
}());