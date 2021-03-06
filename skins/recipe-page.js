require("./skins/header.js", this);

this.out+='\
<script type="text/javascript" src="/js/clean-recipe.js?'+this.VERSION+'"></script>\
<div class="recipe">\
    <div class="recipe-left">\
        <div class="recipe-pic">\
            <a target="_blank" href="/serve/'+this.recipe.getProperty("fullImageKey").getId()+'.png"><img style="width:451px;" id="recipe_pic" src="/serve/'+this.recipe.getProperty("fullImageKey").getId()+'.png" /></a>\
        </div>\
        <div class="recipe-license">\
        <div id="fb-root"></div><script src="http://connect.facebook.net/it_IT/all.js#xfbml=1"></script><fb:like href="" send="false" width="450" show_faces="true" font=""></fb:like>\
        </div>\
        <div class="recipe-content default_text">\
            '+this.recipe.getProperty("content").getValue()+'\
        </div>\
        <div class="recipe-tags">\
        Tag: ';
        var count = 0;
        for(var i=0; i<this.tags.length; i++) {
            var tag = this.tags[i];
            if(count != 0)
                this.out += ",";
            count++;
            this.out += ' <a href="/search?q='+tag+'">'+tag+'</a>';
        }
        this.out += '</div>\
\
    </div><!--/recipe-left-->\
\
    <div class="recipe-right">';
        var user = _request.getAttribute("user");
        if(user && this.recipe.getProperty("userKey").equals(user.getKey())) {
            this.out += '<div class="recipe-edit"><a href="/edit-recipe/'+recipe.getKey().getId()+'">Modifica</a><br><a id="delete_recipe" href="/delete-recipe/'+recipe.getKey().getId()+'">Elimina</a></div>';
        }
        this.out += '<h1>'+this.recipe.getProperty("title")+'</h1>\
        <span class="recipe-author">by <a href="/users/'+recipeAuthor.getKey().getId()+'">'+recipeAuthor.getProperty("username")+'</a></span>\
        <div class="recipe-ingredients">\
            <h3>Ingredienti:</h3>\
            <div class="ingredients-content default_text">'+this.recipe.getProperty("ingredients").getValue()+'</div>\
        </div>\
        <div class="recipe-comments">\
            <h2><a name="comments"></a>Commenti</h2>';
    if(user) {
    this.out += '<form method="post" action="/add-comment">\
        <input type="hidden" name="recipeKeyString" value="'+KeyFactory.keyToString(this.recipe.getKey())+'"/>\
        <textarea name="comment"></textarea>\
        <input type="submit" value="Aggiungi commento" />\
    </form>';
    }
    
    if(!user)
        this.out += '<p>Fai <a href="/login?returnurl='+_request.getRequestURI()+'">login</a> o <a href="/register?returnurl='+_request.getRequestURI()+'">registrati</a> per aggiungere un commento.</p>'
    if(!this.comments.length)
        this.out += '<p>Nessun commento.</p>';
    for(var i=0; i<this.comments.length; i++) {
        var comment = this.comments[i];
        var author = googlestore.get(comment.getProperty("userKey"));

        this.out += '<div class="comment-box">\
                <div class="comment-author-pic">';
                    if(author.getProperty("imageKey")) {
                        this.out += '<a href="/users/'+author.getKey().getId()+'"><img src="/serve/'+author.getProperty("imageKey").getId()+'.png" /></a>';
                    } else { 
                        this.out += '<a href="/users/'+author.getKey().getId()+'">\
                            <img src="/images/default-avatar.png" />\
                        \
                        </a>';
                    }

                var past = comment.getProperty("created");        
                var now = new Date();
                var ago = java.util.concurrent.TimeUnit.MILLISECONDS.toDays(now.getTime() - past.getTime());
                var unit = "giorni";
                if(ago == 1)
                    unit = "giorno"

                if(ago == 0) {
                    ago = java.util.concurrent.TimeUnit.MILLISECONDS.toHours(now.getTime() - past.getTime());
                    unit = "ore";
                }
                if(ago == 0) {
                    ago = java.util.concurrent.TimeUnit.MILLISECONDS.toMinutes(now.getTime() - past.getTime());
                    unit = "minuti";
                }
                if(ago == 0) {
                    ago = java.util.concurrent.TimeUnit.MILLISECONDS.toSeconds(now.getTime() - past.getTime());
                    unit = "secondi";
                }
                this.out +=' </div>\
                <div class="comment-author">\
                    <a href="/users/'+author.getKey().getId()+'">'+author.getProperty("username")+'</a>\
                </div>\
                <div class="comment-date">\
                    <a href="#">'+ago+' '+unit+' fa</a>';

                // if logged in and this comment is of user logged in
                if(user && author.getKey().equals(user.getKey())) {
                    this.out += ' - <a href="/delete-comment?commentKeyString='+KeyFactory.keyToString(comment.getKey())+'">Elimina</a>';
                }

                this.out += '</div>\
                <div class="comment-itself">\
                <p>\
                '+comment.getProperty("comment").getValue().replaceAll("(\r\n)\\1+", "</p><p>").replaceAll("\r\n","<br />")+'\
                </p>\
                </div>\
\
            </div><!--/comment-box-->';
    }
        this.out +=' </div><!--/recipe-comments-->\
    </div><!--/recipe-right-->\
\
</div><!--/recipe-->';

require("./skins/footer.js", this);
