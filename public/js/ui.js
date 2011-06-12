$(function(){
    var $ = jQuery;

    // add ... to recipe name if it's too long
    function shorten() {
        var len = 23;
        $(".recipe_list li a.title").each(function(){
            var $this = $(this),   
                title = $.trim($this.text());
            if(title.length > len)
                $this.text( title.substring(0, len) + "..." );
        });
    }
    shorten();

    var urlParams = {};
    (function () {
        var e,
            a = /\+/g,  // Regex for replacing addition symbol with a space
            r = /([^&=]+)=?([^&]*)/g,
            d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
            q = window.location.search.substring(1);

        while (e = r.exec(q))
           urlParams[d(e[1])] = d(e[2]);
    })();
    
    // pagination
    var currPage = 1;
    $("#smb").click(function(e) {
        $this = $(this);
        var oldVal = $this.val();
        $this.val("Caricamento in corso...");

        var url = $.extend({}, urlParams);
        url.page = ++currPage;
        url.json = true;
        $.getJSON("/", url, function(data) {
            if(!data.length) {
                $(".lsbb").remove();
                return;
            }

            for(var i=0; i<data.length; i++) {
                var q = $("ul.recipe_list li");
                var tmpl = q.first().clone();
                // count how many recipes there are
                var reccount = q.length;
                // there are 4 per row, so if the reccount is like
                // 3 or 7 or 11 etc etc (multiple of 4 minus 1) this one
                // needs class of last
                var last = false;
                if((reccount+1) % 4 === 0)
                    last = true;

                var d = data[i];
                tmpl.css("background", "url("+d.thumb+") no-repeat");
                if(last)
                    tmpl.addClass("last");
                
                tmpl.attr("alt", d.title);
                tmpl.find("a.image").attr("href", "/recipes/"+d.id);
                tmpl.find(".owner h2 a")
                    .attr("title", d.title)
                    .attr("href", "/recipes/"+d.id)
                    .text(d.title);

                tmpl.find("cite a")
                    .attr("href", "/users/"+d.author_id)
                    .text(d.author_username);
                tmpl.find(".recipe_stats_comment").text(d.numcomments);


                $("ul.recipe_list").append(tmpl);

            }

            shorten();

            $this.val(oldVal);
        });

        
        e.preventDefault();
        e.stopPropagation();
    });


    $("#cat").change(function(){
        var val = $(this).val();

        if(val == "Categorie")
            urlParams.cat = false;
        else
            urlParams.cat = val;

        window.location.href = "?"+$.param(urlParams);
    });

});
