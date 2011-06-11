$(function(){
    var $ = jQuery;

    // add ... to recipe name if it's too long
    var len = 23;
    $(".recipe_list li a.title").each(function(){
        var $this = $(this),   
            title = $this.text().trim();
        if(title.length > len)
            $this.text( title.substring(0, len) + "..." );
    });


    // pagination
    $("#smb").click(function(e) {
        
        e.preventDefault();
        e.stopPropagation();
    });
});
