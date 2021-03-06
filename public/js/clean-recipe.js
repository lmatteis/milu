$(function(){

    // remove all empty p's
    $(".recipe-content p, .ingredients-content p").each(function() {
        var $this = $(this);
        // try and remove only if it doesn't contain an image
        if(!$this.find("img").length) {
            var text = $this.text();
            if (/^\s+$/.test(text) || !text || text == "") //string contains only whitespace
                $this.remove();
        }
    });

    // wrap images in links
    $(".recipe-content img, .ingredients-content img").each(function() {
        var $this = $(this),
            link = $this.attr("src"),
            a = $("<a target='_blank'></a>");

        a.attr("href", link);
        a.append($this.clone());

        $this.replaceWith(a);
    });

    // confirm before deleting recipe
    $("#delete_recipe").click(function(e) {
        
        if(!confirm("Vuoi veramente cancellare questa ricetta?")) {
            e.preventDefault();
            e.stopPropagation();
        }
    });


});
