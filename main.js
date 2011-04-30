require("apejs.js");
require("googlestore.js");

// this happens before the handler
apejs.before = function(request, response) {
    // start the session
    var session = request.getSession(true);

    var userKey = session.getAttribute("userKey");

    // find user with this key and set an attribute
    var user = googlestore.getObjectByKey(userKey);

    request.setAttribute("user", user);

    // set the request to be global
    _request = request;
};

apejs.urls = {
    "/": {
        get: function(request, response) {
            // pass all this data to the skin
            var o = { 
            };
            require("./skins/index.js", o);

            response.getWriter().println(o.out);
        }
    },
    "/register": {
        get: function(request, response) {
            // pass all this data to the skin
            var o = { 
            };
            require("./skins/register.js", o);

            response.getWriter().println(o.out);
        },
        post: function(request, response) {
            var user = {
                date: new java.util.Date(),
                name: request.getParameter("name"),
                email: request.getParameter("email"),
                password: request.getParameter("password")
            }, o = {}, error = false;

            for(var i in user)
                if(user[i] == "") error = "Devi completare tutto!";
            /*
            if(user.exists(email))
                error = "Quest'email esiste!";
            */

            // check email format
                
            if(error) {
                var o = { 
                    error: error,
                    user: user
                };
                require("./skins/register.js", o);
                response.getWriter().println(o.out);
            } else {
                var entity = googlestore.entity("user", user);
                googlestore.put(entity);
                response.sendRedirect(request.getParameter("returnurl"));
            }
                
        }
    }

};
