dojo.require("dijit.Editor");
dojo.require("dijit._editor._Plugin");
dojo.require("dijit._Widget");
dojo.require("dijit._Container");

jmaki.namespace("jmaki.widgets.dojo.dijit.editor");

jmaki.widgets.dojo.dijit.editor.Widget = function(wargs) {
    
    var _widget = this;
    var topic = "/dojo/dijit/editor/";
    _widget.container = document.getElementById(wargs.uuid + "_container");

    var fullToolbar = ["dijit._editor.plugins.AlwaysShowToolbar",
                            "undo","redo","|",
                            "cut","copy","paste","|",
                            "bold","italic","underline","strikethrough","|",
                            "insertOrderedList","insertUnorderedList",
                            "indent","outdent","|","justifyLeft",
                            "justifyRight","justifyCenter",
                            "justifyFull", "savePlugin"
                         ];
    var mediumToolbar = ["dijit._editor.plugins.AlwaysShowToolbar",
                         "cut","copy","paste","|",
                         "bold","italic","underline","strikethrough",
                         "savePlugin"
                         ];
                        
    var smallToolbar = ["dijit._editor.plugins.AlwaysShowToolbar",
                        "cut","copy","paste","|", "savePlugin"
                       ];

    var toolbar = smallToolbar;

    if (wargs.args) {

        if (wargs.args.toolbar) {
            if (wargs.args.toolbar == "full") {
                toolbar = fullToolbar;
            }
        }
        if (wargs.args.toolbar) {
            if (wargs.args.toolbar == "medium") {
               toolbar = mediumToolbar;
            }
        }
        if (wargs.args.toolbar) {
            if (wargs.args.toolbar == "small") {
                toolbar = mediumToolbar;
            }
        }
    }

    this.postLoad = function() {
        if (wargs.publish) {
            topic = wargs.publish;
        }     

        if (wargs.value) {  
            _widget.container.innerHTML = wargs.value;
        }
        
        var dim = jmaki.getDimensions(_widget.container, 50);
        var _height = dim.h - 30;
        var eargs = {
            plugins : toolbar, 
            shareToolbar: false,
            height : _height + "px"
        };        

        // create an instance of the widget
        _widget.wrapper = new dijit.Editor( eargs, _widget.container); 
        dojo.connect(_widget.wrapper, "_saveContent", _widget, 'saveState');
    
        if (wargs.service) {
            var url = wargs.service;
            dojo.io.bind({
                url: url,
                load: function (type,data,evt) {
                    _widget.wrapper.replace(data);
                }
            });
        }           

    };

    this.setValue = function(_v) {
        _widget.wrapper.replace(_v);
    };

    this.getValue = function() {
        return this.wrapper.getValue();
    };
    
    this.saveState = function() {
        jmaki.publish(topic + "onSave", {id: wargs.uuid, wargs: wargs, value: _widget.getValue()});
    };
};


dojo.declare("savePlugin",
    dijit._editor._Plugin,
    {
        buttonClass: dijit.form.ToggleButton,
        iconClassPrefix: "dijitEditorIcon",
        useDefaultCommand: true,
		
        constructor: function(){
            var _this = this;
            this.button = new this.buttonClass({
                showLabel: true,
                iconClass: "dijitEditorIcon dijitEditorIconSave",
                tabIndex: "-1"
            });
            dojo.connect(this.button, "onClick",  function() {
                
                _this.editor._saveContent();
                
            });

        }
		
    }
);
