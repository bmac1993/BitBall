var login = {
    authenticated : false,
    authenticate: function(){
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;

        // query DB for username password combo

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
            // add username + password to DB
            // return success message
        }
        else
        {
            // return passwords not matching message
        }
    }



};
