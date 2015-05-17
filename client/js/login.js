var login = {
    authenticated : false,
    authenticate: function(){
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;

        socket.emit('login', data);

        // if returns an object -> set user to returned object

        // else

        // throw error message
    },
    createAccount: function(){
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
            // return passwords not matching message
        }
    },
    setupSockets: function(){
        socket.on('createAccountResult', function (data) {
            alert(data);
        });
        socket.on('loginResult', function (data) {
            alert(data);
        });
    }
};
