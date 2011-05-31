require("./skins/header.js", this);

this.out += '<ul class="recipe_list large">';
var counter = 0;
for(var i=0; i<this.recipes.length; i++) {
    var recipe = this.recipes[i];
    if(counter == 4) counter = 0;
    counter++;

    var recipeUser = googlestore.get(recipe.getProperty("userKey"));

    var comments = googlestore.query("comment")
            .filter("recipeKey", "=", recipe.getKey())
            .fetch();

    this.out += '<li class="'+(counter == 4 ? "last":"")+'" style="background: url(/serve/'+recipe.getProperty("thumbKey").getId()+'.png) no-repeat;" alt="'+recipe.getProperty("title")+'">\
        <a class="image" href="/recipes/'+recipe.getKey().getId()+'">\
        </a>\
        <div class="owner">\
            <h2><a class="title" href="/recipes/'+recipe.getKey().getId()+'">\
                '+recipe.getProperty("title")+'\
            </a></h2>\
            <cite>\
                by <a href="/users/'+recipeUser.getKey().getId()+'">'+recipeUser.getProperty("username")+'</a>\
                <em class="recipe_stats"><span class="recipe_stats_comment">'+comments.length+'</span> </em>\
            </cite>\
        </div>\
    </li>\
';
}
this.out +='</ul>\
<div class="page_break"></div>';

require("./skins/footer.js", this);
