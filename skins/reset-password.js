require("./skins/header.js", this);
    this.out += '<div id="link-form">';
    if(this.error)
	    this.out += '<h2 class="cabin error">'+this.error+'</h2>';
    else
		this.out += '<h2 class="cabin">Resetta la tua password:</h2>';
			
    this.out +='<form action="/reset-password" method="post">\
                <input type="hidden" name="curr_password" value="'+this.user.getProperty("password")+'" />\
				<p>\
					<label for="username">Username:</label>\
                    <input id="username" type="text" name="username" value="'+this.user.getProperty("username")+'">\
				</p>\
				<p>\
					<label for="password">Password:</label>\
                    <input id="password" type="password" name="new_password" />\
				</p>\
				\
				<p class="last-p"><button type="submit">Resetta Password</button></p>\
			</form>\
        </div><!-- /link-form -->\
        ';

require("./skins/footer.js", this);
