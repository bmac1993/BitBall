var login = {
    authenticated : false,
    username: "",
    authenticate: function(){
        $('.loginMsg').hide();
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        var data = {'username':username, 'password':password };
        socket.emit('login', data);

        // if returns an object -> set user to returned object

        // else

        // throw error message
    },
    createAccount: function(){
        $('.loginMsg').hide();
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        var password2 = document.getElementById("password2").value;

        if(password === password2)
        {
            var data = {'username':username, 'password':password};
            socket.emit('createAccount', data);
            // return success message
        }
        else
        {
            $('#loginError')[0].innerHTML = "Your passwords did not match!";
            $('#loginError').show();
        }
    },
    setupSockets: function(){
        socket.on('createAccountSuccess', function (data) {
            $('#loginSuccess')[0].innerHTML = "Account created!";
            $('#loginSuccess').show();
        });
        socket.on('createAccountError', function (data) {
            $('#loginError')[0].innerHTML = "Error: " + data.message;
            $('#loginError').show();
        });
        socket.on('loginSuccess', function (data) {
            gameState = GAME_STATE_TEAM_SELECT;
            user = data.username;
        });
        socket.on('loginError', function (data) {
            $('#loginError')[0].innerHTML = "Error: " + data.message;
            $('#loginError').show();
        });
    }
};
