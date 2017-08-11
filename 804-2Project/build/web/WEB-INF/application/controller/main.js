// generated controller

library.common.define(controller, "main", function() {
    this.Main = function() {
        this.onRequest = function() {            
            library.view.render("main.ejs");
        };
    };
});
