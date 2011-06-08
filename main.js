require("apejs.js");
require("googlestore.js");

require("./usermodel.js")
require("./fileupload.js");
require("./imageresizer.js");

var MILU_URL = "http://www.ilgrillomangiante.com";

// this happens before the handler
apejs.before = function(request, response) {
    // set UTF-8
    response.setCharacterEncoding("UTF-8");

    // start the session
    var session = request.getSession(true);

    var userKey = session.getAttribute("userKey");

    // find user with this key and set an attribute
    try {
        var user = googlestore.get(userKey);
        request.setAttribute("user", user);
    } catch(e) {}

    // set the request to be global
    _request = request;
};

apejs.urls = {
    "/": {
        get: function(request, response) {
            // get all recipes
            var recipes = googlestore.query("recipe")
                            .sort("created", "DESC")
                            .fetch();

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
                username: request.getParameter("username"),
                email: request.getParameter("email"),
                password: request.getParameter("password")
            }, o = {}, error = false;

            for(var i in user)
                if(!user[i] || user[i] == "") error = "Devi completare tutto!";


            if(usermodel.emailExists(user.email))
                error = "Questo indirizzo di posta elettronica è già associato ad un altro account!";

            // check email format
            if(!usermodel.validateEmail(user.email))
                error = "Il formato dell'indirizzo di posta elettronica non è corretto!";

            if(usermodel.usernameExists(user.username))
                error = "Questo username esiste già, scegline un altro!";
                
            if(!usermodel.validUsername(user.username))
                error = "Assicurati che lo username non contenga nessuno spazio o carattere non ammesso e che sia maggiore di 3 e minore di 21 caratteri!";

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

                // dont login, send email
                var o = {error: "Ti è stata inviata una email con il link per l'attivazione del tuo account!"};
                require("./sendemail.js");
                try {
                    sendemail.send(user.email, user.username, "Completa la registrazione", "Per completare la registrazione clicca qui: "+MILU_URL+"/activate?keyString="+KeyFactory.keyToString(userKey)+"");
                } catch(e) {
                    o.error = e.getMessage();
                }

                require("./skins/login.js", o);
                response.getWriter().println(o.out);
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
            var username = request.getParameter("username"),
                password = request.getParameter("password");

            var res = googlestore.query("user")
                    .filter("username", "=", username)
                    .filter("password", "=", usermodel.sha1(password))
                    .fetch(1);

            if(!res.length) { // user not found 
                var o = {error: "Username e/o password sbagliati"};
                require("./skins/login.js", o);
                response.getWriter().println(o.out);
            } else if(!res[0].getProperty("active")) {
                var o = {error: "Questo account non è ancora attivo. Controlla la tua casella di posta elettronica!"};
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
    "/users" : {
        get: function(request, response) {
            var print = printer(response);

            var users = googlestore.query("user")
                            .sort("created", "DESC")
                            .fetch();

            var o = { 
                users: users
            };
            require("./skins/users.js", o);
            print(o.out);

        }
    },
    "/users/([a-zA-Z0-9_]+)" : {

        get: function(request, response, matches) {
            var userId = matches[1],
                // create key from the user id
                userKey = googlestore.createKey("user", parseInt(userId, 10)),
                thisUser = googlestore.get(userKey),
                // get this users recipes
                recipes = googlestore.query("recipe")
                    .filter("userKey", "=", userKey)
                    .sort("created", "DESC")
                    .fetch();

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
                response.getWriter().println("Esegui il login per accedere a questa pagina!");
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
                        var resized = imageresizer.resizeWithoutCrop(data[i].fieldValue, 128, 128),
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
                var currPassword = "", newPassword = "";
                for(i=0; i<data.length; i++) {
                    if(!data[i].file) {
                        if(data[i].fieldName == "bio")
                            user.setProperty("bio", data[i].fieldValue);
                        if(data[i].fieldName == "city")
                            user.setProperty("city", data[i].fieldValue);

                        if(data[i].fieldName == "curr_password")
                            currPassword = data[i].fieldValue;

                        if(data[i].fieldName == "new_password")
                            newPassword = data[i].fieldValue;
                    }
                }
                if(currPassword != "" && newPassword != "") {
                    // check that currPassword is the actual password (sha1d)
                    if(user.getProperty("password") == usermodel.sha1(currPassword)) {
                        user.setProperty("password", usermodel.sha1(newPassword));
                    } else {
                        error = "Password errata!";
                    }

                }
            } catch(e) {
                error = "L'immagine è troppo grande, prova a ridimensionarla!";
            }

            if(error != "") {
                var o = {error: error};
                require("./skins/edit-user.js", o);
                response.getWriter().println(o.out);
            } else  {
                if(imageKey)
                    user.setProperty("imageKey", imageKey);

                googlestore.put(user);
                response.sendRedirect("/users/"+user.getKey().getId());
            }
        }
    },
    "/serve/([a-zA-Z0-9_]+).png" : {
        get: function(request, response, matches) {
            response.setHeader("Cache-Control", "max-age=315360000");
            response.setContentType("image/png");

            var imageId = matches[1],
                // create key from the user id
                imageKey = googlestore.createKey("image", parseInt(imageId, 10)),
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
                        error = "Devi completare tutto!";
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
                    error = "L'immagine è troppo grande, prova a ridimensionarla!";
                }
            }

            // when editing an image can be empty
            if(!recipeId && error == "") {
                if(!fullImageKey || !thumbKey)
                    error = "Inserisci un'immagine!";
            }

            if(error == "") {
                // set image references only if they exist
                if(fullImageKey && thumbKey) {
                    recipe.fullImageKey = fullImageKey;
                    recipe.thumbKey = thumbKey;
                }
                recipe.userKey = user.getKey();

                // create an entity with keyName the tag itself so it's unique
                for(var i=0; i<recipe.tags.length; i++) {
                    var tagEntity = googlestore.entity("tag", recipe.tags[i], {});
                    googlestore.put(tagEntity);
                }

                if(recipeId) { // edit
                    var recipeKey = googlestore.createKey("recipe", parseInt(recipeId, 10)),
                        entity = googlestore.get(recipeKey);
                    googlestore.set(entity, recipe);
                } else { // add it
                    recipe.created = new java.util.Date();
                    var entity = googlestore.entity("recipe", recipe);
                }
                    
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

            var recipeKey = googlestore.createKey("recipe", parseInt(recipeId, 10)),
                recipe = googlestore.get(recipeKey);

            // recipe.getProperty('tags') is an instance of java.util.Collection.
            // need to convert it to a primitive array for JS to read it
            var tags = recipe.getProperty("tags").toArray();

            var error = "";
            var o = {error: error, recipeId:matches[1], recipe: recipe, tags: tags};
            require("./skins/add-edit.js", o);
            response.getWriter().println(o.out);
        }

    },
    "/delete-recipe/([a-zA-Z0-9_]+)" : {
        get: function(request, response, matches) {
            var user = request.getAttribute("user");
            if(!user) { // not logged-in
                response.sendRedirect("/error");
                return;
            }
            var recipeId = matches[1];

            var recipeKey = googlestore.createKey("recipe", parseInt(recipeId, 10)),
                recipe = googlestore.get(recipeKey);

            // check that this recipe belongs to this user
            if(!recipe.getProperty("userKey").equals(user.getKey())) {
                response.sendRedirect("/error");
                return;
            }

            googlestore.del(recipeKey);
                
            response.sendRedirect("/");
        }

    },
    "/recipes/([a-zA-Z0-9_]+)" : {
        get: function(request, response, matches) {
            var recipeId = matches[1],
                recipeKey = googlestore.createKey("recipe", parseInt(recipeId, 10)),
                recipe = googlestore.get(recipeKey);

            var tags = recipe.getProperty("tags").toArray();
            var recipeAuthor = googlestore.get(recipe.getProperty("userKey"));

            // get comments for this recipe
            var comments = googlestore.query("comment")
                    .sort("created", "ASC")
                    .filter("recipeKey", "=", recipe.getKey())
                    .fetch();

            var o = {
                recipe: recipe, 
                tags: tags,
                recipeAuthor: recipeAuthor,
                comments: comments
            };
            require("./skins/recipe-page.js", o);
            response.getWriter().println(o.out);
        }
    },
    "/add-comment" : {
        post: function(request, response) {
            var user = request.getAttribute("user");
            if(!user) {
                response.sendRedirect("/"); 
                return;
            }
            var recipeKeyString = request.getParameter("recipeKeyString"),
                comment = request.getParameter("comment");

            if(comment == "" || recipeKeyString == "") {
                response.sendRedirect("/"); 
                return;
            }

            var recipeKey = KeyFactory.stringToKey(recipeKeyString);

            var comment = googlestore.entity("comment", {
                recipeKey: recipeKey,
                userKey: user.getKey(),
                created: new java.util.Date(),
                comment: new Text(comment)
            });

            googlestore.put(comment);
            response.sendRedirect("/recipes/"+recipeKey.getId()+"#comments");
        }
    },
    "/delete-comment" : {
        get: function(request, response) {
            var user = request.getAttribute("user");
            if(!user) {
                response.sendRedirect("/"); 
                return;
            }
            var commentKeyString = request.getParameter("commentKeyString");

            if(!commentKeyString || commentKeyString == "") {
                response.sendRedirect("/"); 
                return;
            }

            var commentKey = KeyFactory.stringToKey(commentKeyString);

            // be sure this comment belongs to the logged in user
            var c = googlestore.get(commentKey);
            if(c.getProperty("userKey").equals(user.getKey())) {
                googlestore.del(commentKey);        
            }

            response.sendRedirect("/recipes/"+c.getProperty("recipeKey").getId()+"#comments");
        }
    },
    "/fileupload" : {
        get: function(request, response) {
        },
        post: function(request, response) {
            var data = fileupload.getData(request);
            
            var filename = "";
                filevalue = "",
                error = "";
            for(var i=0; i<data.length; i++) {
                var fieldName = data[i].fieldName,
                    fieldValue = data[i].fieldValue,
                    isFile = data[i].file;

                if(isFile) {
                    //err("Got file with name: "+fieldName+"<br>");
                    filename = fieldName;
                    filevalue = fieldValue;
                } 
            }
            if(filename == "" || filevalue == "")
                error = "Non hai caricato nessuna immagine";

            // resize image to max 400 width
            try {
                filevalue = imageresizer.resizeWithoutCrop(filevalue, 400, 500);
            } catch(e) {
                error = "Problema col ridimensionamento, riprova!";
            }

            var id = ""; // image id
            if(error == "") {
                try {
                    var entity = googlestore.entity("image", {
                        name: filename,
                        image: filevalue
                    });
                    var key = googlestore.put(entity);
                    id = key.getId();
                } catch(e) {
                    error = "L'immagine è troppo grande, prova a ridimensionarla!";
                }
            }
            
            response.getWriter().println("<script>window.top.fileuploadCallback('"+id+"', '"+error+"');</script>"); 
        }
    },
    "/activate": {
        get: function(request, response) {
            function err(m) { return response.getWriter().println(m); }
            // activate based on the user key string
            var keyString = request.getParameter("keyString");
            if(keyString == "" || !keyString)
                return err("Key invalida");
                
            try {
                var user = googlestore.get(KeyFactory.stringToKey(keyString));
                if(user) {
                    user.setProperty("active", true);
                    googlestore.put(user);

                    var o = {error: "Grazie per aver attivato il tuo account. Ora puoi procedere con il login!"};
                    require("./skins/login.js", o);
                    response.getWriter().println(o.out);
                }
            } catch(e) {
                return err("Key non trovata");
            }
        }
    },
    "/search": {
        get: function(request, response) {
            var q = request.getParameter("q");
            var o = { };
            require("./skins/header.js", o);
                
            o.out += render("./skins/googlesearch.html");

            require("./skins/footer.js", o);
            response.getWriter().println(o.out);
                // get all recipes
                /*
                var recipes = googlestore.query("recipe")
                            .sort("created", "DESC")
                            .filter("tags", "=", q)
                            .fetch();

                // pass all this data to the skin
                var o = { 
                    recipes: recipes
                };
                require("./skins/index.js", o);
                response.getWriter().println(o.out);
                */
        }
    }
};

// simple syntax sugar
function printer(response) {
    var writer = response.getWriter();
    return writer.print.bind(writer);
}
