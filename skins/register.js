require("./skins/header.js", this);
if(_request.getAttribute("user")) {
    this.out += "Sei gia' registrato";
} else {
    this.out += '<div id="link-form">';
    if(this.error)
	    this.out += '<h2 class="cabin error">'+this.error+'</h2>';
    else
		this.out += '<h2 class="cabin">Registrati:</h2>';
    
    this.out += '<form action="/register" method="post">\
                <input type="hidden" name="returnurl" value="'+_request.getParameter("returnurl")+'" />\
				<p>\
					<label for="username">Username:</label>\
                    <input id="username" type="text" name="username" value="'+(this.user ? this.user.username : "")+'">\
				</p>\
				<p>\
					<label for="email">Email:</label>\
                    <input id="email" type="text" name="email" value="'+(this.user ? this.user.email : "")+'">\
				</p>\
				<p>\
					<label for="password">Password:</label>\
                    <input id="password" type="password" name="password"/>\
				</p>\
				\
				<p class="last-p"><button type="submit">Registrati!</button></p>\
			</form>\
        </div><!-- /link-form -->\
    ';
}

require("./skins/footer.js", this);
