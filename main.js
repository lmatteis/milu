require("apejs.js");
require("googlestore.js");

require("./usermodel.js")
require("./fileupload.js");
require("./imageresizer.js");

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
            // get all recipes
            var q = googlestore.query("recipe");
            var recipes = q.fetch(10);

            // pass all this data to the skin
            var o = { 
                recipes: recipes
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
            var user = request.getAttribute("user");
            if(!user) {
                response.getWriter().println("Devi fare il login per accedere a questa pagina");
                return;
            }

            var error = "";

            // get the multipart form data from the request
            var data = fileupload.getData(request);

            try {
                var imageKey = false;
                // upload the image first so we get imageKey
                for(var i=0; i<data.length; i++) {
                    if(data[i].file && data[i].fieldName != "") { 
                        var resized = imageresizer.resize(data[i].fieldValue, 128, 128),
                            o = {
                                name: data[i].fieldName,
                                image: resized // this is the actual blob
                            };

                        var image = null;
                        if(user.getProperty("imageKey")) { 
                            try {
                                image = googlestore.get(user.getProperty("imageKey"));
                                googlestore.set(image, o); // edit it
                            } catch(e) {
                                image = googlestore.entity("image", o);
                            }
                        } else
                            // if we don't provide an existing keyName, the image will be added
                            image = googlestore.entity("image", o);
                            

                        imageKey = googlestore.put(image);
                        break; // we're only expecting 1 image
                    }
                }

                // now iterate over it again but only for form fields
                for(i=0; i<data.length; i++) {
                    if(!data[i].file && data[i].fieldName == "name") {
                        user.setProperty("name", data[i].fieldValue);
                        if(imageKey)
                            user.setProperty("imageKey", imageKey);
                    }
                }

                googlestore.put(user);
            } catch(e) {
                error = "L'immagine e' troppo grande. Prova a ridimensionarla";
            }

            if(error != "") {
                var o = {error: error};
                require("./skins/edit-user.js", o);
                response.getWriter().println(o.out);
            } else 
                response.sendRedirect("/edit");
        }
    },
    "/serve/([a-zA-Z0-9_]+).png" : {
        get: function(request, response, matches) {
            response.setHeader("Cache-Control", "max-age=315360000");
            response.setContentType("image/png");

            var imageId = matches[1],
                // create key from the user id
                imageKey = googlestore.createKey("image", parseInt(imageId)),
                image = googlestore.get(imageKey);

            var imageBlob = image.getProperty("image"),
                imageBytes = imageBlob.getBytes();

            response.getOutputStream().write(imageBytes);
        }
    },
    "/add": {
        get: function(request, response) {
            if(!request.getAttribute("user")) { // not logged-in
                response.sendRedirect("/");
                return;
            }

            var error = "";
            var o = {error: error};
            require("./skins/add-edit.js", o);
            response.getWriter().println(o.out);
        },
        post: function(request, response) {
            var user = request.getAttribute("user");
            if(!user) { // not logged-in
                response.sendRedirect("/");
                return;
            }

            // these fields are mandatory
            var recipe = {
                title: "",
                content: "",
                ingredients: "",
                tags: ""
            }, error = "";

            var data = fileupload.getData(request);

            var recipeId = null;

            // loop through the form fields and get values
            for(i=0; i<data.length; i++) {
                var fieldName = data[i].fieldName,
                    fieldValue = data[i].fieldValue;
                if(recipe[fieldName] === "") {
                    if(fieldValue == "") {
                        error = "Devi completare tutto";
                    }
                    if(fieldName == "content" || fieldName == "ingredients")
                        fieldValue = new Text(fieldValue);
                    if(fieldName == "tags")
                        fieldValue = fieldValue.trim().split(" ");

                    recipe[fieldName] = fieldValue;
                }
                if(fieldName == "recipeId")
                    recipeId = fieldValue;
            }

            if(error == "") {
                // upload image only after all parameters are valid
                var fullImageKey = null;
                    thumbKey = null;
                try {
                    for(var i=0; i<data.length; i++)
                        if(data[i].file && data[i].fieldName != "") { 
                            var resized = imageresizer.resize(data[i].fieldValue, 224, 230),
                                full = {
                                    name: data[i].fieldName,
                                    image: data[i].fieldValue
                                },
                                thumb = {
                                    name: data[i].fieldName,
                                    image: resized
                                },
                                fullImage = googlestore.entity("image", full),
                                thumbImage = googlestore.entity("image", thumb);

                            fullImageKey = googlestore.put(fullImage);
                            thumbKey = googlestore.put(thumbImage);

                            break;
                        }
                } catch(e) {
                    error = "Immagine troppo grande";
                }
            }

            // when editing an image can be empty
            if(!recipeId && error == "") {
                if(!fullImageKey || !thumbKey)
                    error = "Devi inserire un'immagine";
            }

            if(error == "") {
                // set image references only if they exist
                if(fullImageKey && thumbKey) {
                    recipe.fullImageKey = fullImageKey;
                    recipe.thumbKey = thumbKey;
                }
                recipe.userKey = user.getKey();

                if(recipeId) { // edit
                    var recipeKey = googlestore.createKey("recipe", parseInt(recipeId)),
                        entity = googlestore.get(recipeKey);
                    googlestore.set(entity, recipe);
                } else
                    var entity = googlestore.entity("recipe", recipe);
                    
                var recipeKey = googlestore.put(entity);

                response.sendRedirect("/");
                return;
            }

            recipe["getProperty"] = function(name) { // lol fake googlestore
                return this[name];
            }

            var o = {error: error, recipeId: recipeId, recipe: recipe, tags: recipe.tags};
            require("./skins/add-edit.js", o);
            response.getWriter().println(o.out);
        }
    },
    "/edit-recipe/([a-zA-Z0-9_]+)" : {
        get: function(request, response, matches) {
            var user = request.getAttribute("user");
            if(!user) { // not logged-in
                response.sendRedirect("/");
                return;
            }
            var recipeId = matches[1];

            var recipeKey = googlestore.createKey("recipe", parseInt(recipeId)),
                recipe = googlestore.get(recipeKey);

            // recipe.getProperty('tags') is an instance of java.util.Collection.
            // need to convert it to a primitive array for JS to read it
            var tags = recipe.getProperty("tags").toArray();

            var error = "";
            var o = {error: error, recipeId:matches[1], recipe: recipe, tags: tags};
            require("./skins/add-edit.js", o);
            response.getWriter().println(o.out);
        }

    }
};
