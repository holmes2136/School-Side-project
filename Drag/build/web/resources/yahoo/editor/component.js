// define the namespaces
jmaki.namespace("jmaki.widgets.yahoo.editor");

/**
 * Yahoo UI Rich Text Editor Widget
 * @author Ahmad M. Zawawi <ahmad.zawawi@gmail.com>
 * @constructor
 * @see http://developer.yahoo.com/yui/editor/
 */
jmaki.widgets.yahoo.editor.Widget = function(wargs) {
    var publish = "/yahoo/editor";
    var _widget = this;
    var uuid = wargs.uuid;
    
    var _container = document.getElementById(wargs.uuid);
    var ie = /MSIE/i.test(navigator.userAgent);
    var safari = /WebKit/i.test(navigator.userAgent);
 

    //read arguments
    if (wargs.publish) publish = wargs.publish;

    // calculate the size within a div or in the body.
    function getSize() {
        var pos = jmaki.getPosition(_container);
        if (_container.parentNode.nodeName == "BODY") {
            if (window.innerHeight){
                    h = window.innerHeight - pos.y -16;
                    w = window.innerWidth - 15;
                    if (safari) {
                        w -= 2;
                        h -= 2;
                    }                    
            } else {
                    var _tNode = _container.parentNode;
                    while(_tNode != null &&
                        (_tNode.clientHeight == 0 ||
                        typeof _tNode.clientWidth == 'undefined')) {
                        _tNode = _tNode.parentNode;
                    }
                    if (_tNode == null) {
                        w = 400;
                    } else {
                       w = _tNode.clientWidth - 20;
                       h = _tNode.clientHeight - pos.y - 15;
                    }
                }
                if (h < 0) {
                    h = 300;
                }
                if (w < 0) {
                    w = 400;
                }
        } else {
            var _tNode = _container.parentNode;
            while(_tNode != null &&
                (_tNode.clientHeight == 0 ||
                typeof _tNode.clientWidth == 'undefined')) {
                    _tNode = _tNode.parentNode;
            }
            if (_tNode == null) {
                    w = 400;
            } else {
                w = _tNode.clientWidth;
                h = _tNode.clientHeight;
                if (safari) {
                    w -= 18;
                    h -= 18;
                }
            }
        }
        return {height : h, width : w};                 
    }
    
    var dim = getSize();

    var eh = dim.height - 145;
    var editorCfg = {
        height: eh  - 2 + "px",
        width:  dim.width + "px",
        dompath: true, //Turns on the bar at the bottom
        animate: true //Animates the opening, closing and moving of Editor windows
    }
    //create the rich text editor
    this.wrapper = new YAHOO.widget.Editor(uuid + "_container", editorCfg);

    //only initialize after editor contents has loaded
    this.wrapper.on('editorContentLoaded', function(ev) {
        YAHOO.log('editorContentLoaded');
        //read value first into editor
        if (typeof wargs.value != 'undefined') {  
            _widget.setValue(wargs.value);
        } 
        var e = jmaki.getElementsByStyle("yui-toolbar-subcont", document.getElementById(uuid));
        if (e[0]) {
             e[0].style.height = "96px";
        }        
        //read service url contents into editor
        if(typeof wargs.service != 'undefined') {
            jmaki.doAjax({url: wargs.service, callback: function(req) {
                var response = req.responseText;
                YAHOO.log('response = ' + response);
                if(response.length > 0) {
                    _widget.setValue(response);
                }
            }});
        }    
    });


    //Subscribe to the toolbarLoaded Custom event fired in render
    this.wrapper.on('toolbarLoaded', function() { 
                YAHOO.log('Editor Toolbar Loaded..', 'info', 'example');
                
        //Setup the config for the new "Insert Icon" button
        var saveCfg = {
            type: 'push', //Using a standard push button
            label: 'Save', //The name/title of the button
            value: 'save' //The "Command" for the button            
        };
        //Add the new button to the Toolbar Group called insertitem.        
        _widget.wrapper.toolbar.addButtonToGroup(saveCfg, 'insertitem');
        //subscribe to click event
        _widget.wrapper.toolbar.on('saveClick', function(ev) {
            /*var icon = '';
            this._focusWindow();
            if (ev.icon) {
                icon = ev.icon;
            }
            this.execCommand('insertimage', icon);
            */
            //TODO save icons must be provided
            YAHOO.log('saveClick calling saveState!');
            _widget.saveState();
        }, _widget.wrapper, true);
    });

    //render editor
    this.wrapper.render();
        
        
    /**
     * Sets editor html contents
     */
    this.setValue = function(html) {
        this.wrapper.setEditorHTML(html);
    }

    /**
     * Returns editor html contents (unfiltered)
     */
    this.getValue = function() {
        return this.wrapper.getEditorHTML();
    }

    /**
     * Save state when asked ;-)
     */    
    this.saveState = function() {
	jmaki.publish(publish + "/onSave", {widgetId: wargs.uuid, value: _widget.getValue()});
    }
}

