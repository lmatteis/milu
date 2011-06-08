require("./skins/header.js", this);
this.out += '<link rel="stylesheet" href="/stylesheets/MooEditable.css"> \
<script> \
    jQuery.noConflict();\
window.addEvent("domready", function(){\
    var options = {\
        extraCSS: "img{ max-width: 220px;}"\
    };\
    $("content").mooEditable(options);\
    $("ingredients").mooEditable(options);\
});\
</script> \
        <div id="link-form">';
			
            if(this.error)
			    this.out += '<h2 class="cabin error">'+this.error+'</h2>';
            else
			    this.out += '<h2 class="cabin">Inserisci Ricetta:</h2>';
			
            this.out += '<form action="/add" method="post" enctype="multipart/form-data">';
            if(this.recipeId) { // were editing it if
                this.out += '<input type="hidden" name="recipeId" value="'+this.recipeId+'" />';
            } 
            this.out +='<p>\
					<label for="image">Immagine:</label>\
                    <input id="image" type="file" name="image">';

                    if(this.recipe && this.recipe.getProperty("thumbKey"))
                        this.out += '<img src="/serve/'+this.recipe.getProperty("thumbKey").getId()+'.png" />';
                    
				this.out += '</p>\
				<p>\
					<label for="title">Titolo:</label>\
                    <input id="title" type="text" name="title" value="'+(this.recipe ? this.recipe.getProperty("title"):"")+'" />\
				</p>\
				<p>\
					<label for="content">Preparazione: </label>\
                    <textarea id="content" name="content">'+(this.recipe ? (this.recipe.getProperty("content")!="" ? this.recipe.getProperty("content").getValue():""):"")+'</textarea>\
				</p>\
				<p>\
					<label for="ingredients">Ingredienti: </label>\
                    <textarea id="ingredients" name="ingredients">'+(this.recipe ? (this.recipe.getProperty("ingredients")!="" ? this.recipe.getProperty("ingredients").getValue():""):"")+'</textarea>\
				</p>\
				<p>\
					<label for="tags">Tag: </label>';

                    var tagsString = "";
                    if(this.tags) {
                        for(var i=0; i<this.tags.length; i++) {
                            tagsString += this.tags[i] + " ";
                        }
                    }
                    this.out += '<input id="tags" type="text" name="tags" value="'+tagsString+'"/>\
				</p>\
				';
                if(this.recipeId) 
                    this.out += '<p class="last-p"><button type="submit">Modifica!</button></p>';
                else
                    this.out += '<p class="last-p"><button type="submit">Crea!</button></p>';
			this.out +='</form>\
        </div><!-- /link-form -->\
        <iframe style="display: none;" name="upload_iframe"></iframe>';
require("./skins/footer.js", this);
