require("./skins/header.js", this);
    this.out += '<div id="link-form">';
    if(this.error)
	    this.out += '<h2 class="cabin error">'+this.error+'</h2>';
    else
		this.out += '<h2 class="cabin">Inserisci la tua email:</h2>';
			
    this.out +='<form action="/forgot-password" method="post">\
				<p>\
					<label for="email">Indirizzo email:</label>\
                    <input id="email" type="text" name="email" value="'+(this.email || "")+'">\
				</p>\
				\
				<p class="last-p"><button type="submit">Manda Email</button></p>\
			</form>\
        </div><!-- /link-form -->\
        ';

require("./skins/footer.js", this);
