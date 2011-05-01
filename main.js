require("apejs.js");
require("googlestore.js");

require("./usermodel.js")

// this happens before the handler
apejs.before = function(request, response) {
    // set UTF-8
    response.setCharacterEncoding("UTF-8");

    // start the session
    var session = request.getSession(true);

    var userKey = session.getAttribute("userKey");

    // find user with this key and set an attribute
    var user = googlestore.get(userKey);

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
                created: new java.util.Date(),
                name: request.getParameter("name"),
                email: request.getParameter("email"),
                password: request.getParameter("password")
            }, o = {}, error = false;

            for(var i in user)
                if(user[i] == "") error = "Devi completare tutto!";

            if(usermodel.exists(user.email))
                error = "Quest'email esiste!";

            // check email format
            if(!usermodel.validateEmail(user.email))
                error = "Formato dell'email sbagliato";

                
            if(error) {
                var o = { 
                    error: error,
                    user: user
                };
                require("./skins/register.js", o);
                response.getWriter().println(o.out);
            } else {
                // sha1 the password
                user.password = usermodel.sha1(user.password);

                var entity = googlestore.entity("user", user);
                var userKey = googlestore.put(entity);

                // store the actualy key in the session
                var session = request.getSession(true);
                session.setAttribute("userKey", userKey);

                response.sendRedirect(request.getParameter("returnurl"));
            }
                
        }
    },
    "/login": {
        get: function(request, response) {
            var o = { 
            };
            require("./skins/login.js", o);

            response.getWriter().println(o.out);
        },
        post: function(request, response) {
            var email = request.getParameter("email"),
                password = request.getParameter("password");

            var q = googlestore.query("user");
            q.addFilter("email", "=", email);
            q.addFilter("password", "=", usermodel.sha1(password));

            var res = q.fetch(1);
            if(!res.length) { // user not found 
                var o = {error: "Email o password errata!"};
                require("./skins/login.js", o);
                response.getWriter().println(o.out);
            } else {
                var userKey = res[0].getKey();
                var session = request.getSession(true);
                session.setAttribute("userKey", userKey);

                response.sendRedirect(request.getParameter("returnurl"));
            }
        }
    },
    "/logout": {
        get: function(request, response) {
            var returnUrl = request.getParameter("returnurl");
            if(!returnUrl) returnUrl = "/";

            var session = request.getSession(true);
            session.invalidate(); 
            response.sendRedirect(returnUrl);
        }
    },
    "/users/([a-zA-Z0-9_]+)" : {
        get: function(request, response, matches) {
            var userId = matches[1],
                // create key from the user id
                userKey = googlestore.createKey("user", parseInt(userId)),
                thisUser = googlestore.get(userKey),
                // get this users recipes
                recipes = []; // <- FIXME - implement

            var o = { 
                thisUser: thisUser,
                recipes: recipes
            };
            require("./skins/user-page.js", o);
            response.getWriter().println(o.out);
        }
    },
    "/edit" : {
        get: function(request, response) {
            if(!request.getAttribute("user")) // not logged-in
                response.sendRedirect("/");
            else {
                var o = {};
                require("./skins/edit-user.js", o);
                response.getWriter().println(o.out);
            }
        },
        post: function(request, response) {
            require("./fileupload.js");
            var user = request.getAttribute("user");
            if(!user) {
                response.getWriter().println("Devi fare il login per accedere a questa pagina");
                return;
            }

            // get the multipart form data from the request
            var data = fileupload.getData(request);

            // TODO - resize image


            var imageKey = false;
            // upload the files first so we get imageKey
            for(var i=0; i<data.length; i++) {
                if(data[i].file && data[i].fieldName != "") { // it's a file (image)
                    // add this image in the entity 'image'
                    var image = googlestore.entity("image", {
                        name: data[i].fieldName,
                        image: data[i].fieldValue // this is the actual blob
                    });
                    // insert it
                    imageKey = googlestore.put(image);
                }
            }

            // no iterate over it again but only for form fields
            for(i=0; i<data.length; i++) {
                if(!data[i].file && data[i].fieldName == "name") {
                    user.setProperty("name", data[i].fieldValue);
                    if(imageKey)
                        user.setProperty("imageKey", imageKey);
                }
            }

            googlestore.put(user);

            response.getWriter().println("edited");


        }
    }


};
