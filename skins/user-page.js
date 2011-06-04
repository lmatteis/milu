require("./skins/header.js", this);
this.out += '\
<table class="user-detail" style="width: 950px;">\
            <tbody><tr>\
                <!--cell-->\
                <td style="vertical-align: top; width: 170px; text-align: center;">';
if(this.thisUser.getProperty("imageKey")) {
    this.out += '<img src="/serve/'+this.thisUser.getProperty("imageKey").getId()+'.png" />';
} else {
    this.out += '<img src="/images/default-avatar.png" />';
}
        this.out += '</td>\
                <!--cell-->\
                <td style="vertical-align: top; width: 650px;">';
var u;
if(u = _request.getAttribute("user") && u.getKey().equals(this.thisUser.getKey())) {

    this.out += '<div style="float: right;text-align: right;" id="user-menu">\
                    <div id="account-recovery-form">\
                        <a href="/edit">Modifica</a>\
                    </div>\
                    <div id="account-recovery-form">\
                        <a href="/add">Inserisci Ricetta</a>\
                    </div>\
                </div>';
}
    this.out += '<table class="user-details">\
                        <tbody><tr>\
                            <td style="width: 120px;">\
                                Username\
                            </td>\
                            <td style="width: 230px;">\
                                <b>'+this.thisUser.getProperty("username")+'</b>\
                            </td>\
                        </tr>\
                        <tr>\
                            <td style="width: 120px;">\
                                Città\
                            </td>\
                            <td style="width: 230px;">\
                                <b>'+(this.thisUser.getProperty("city")||"")+'</b>\
                            </td>\
                        </tr>\
                        \
                    </tbody></table>\
                </td>\
            </tr>\
        </tbody></table>\
\
\
<div style="margin-top: 10px;"></div>\
\
<div id="subheader">\
    <div id="tabs">\
        <a title="Top statistics for this user" href="/users/1396?tab=stats#sort-top" class="youarehere">Ricette</a>\
        <!--<a title="Recent activity by this user" href="/users/1396?tab=recent#sort-top">Profilo</a>-->\
\
    </div>\
</div>\
<div style="margin-top: 10px;"></div>';

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

this.out += '<div class="page_break"></div>';
require("./skins/footer.js", this);
