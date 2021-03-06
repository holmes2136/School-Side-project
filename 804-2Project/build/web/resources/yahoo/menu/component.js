// define the namespaces
jmaki.namespace("jmaki.widgets.yahoo.menu");

/**
 * Yahoo UI Menu Widget
 * Note: This is takes a standard menu format similar to jmaki.menu
 *
 * @author Ahmad M. Zawawi <ahmad.zawawi@gmail.com>
 * @constructor
 * @see http://developer.yahoo.com/yui/menu/
 */
jmaki.widgets.yahoo.menu.Widget = function(wargs) {
    
    var publish = "/yahoo/menu";
    
    var self = this;
    var menu;
    var uuid = wargs.uuid; 
    var menuId = uuid + "_menu";
    
    
    
    function clone(t) {
       var obj = {};
       for (var i in t) {
            obj[i] = t[i];
       }
       return obj;
    }
    
   
    function processActions(m, pid, _type, value) {
        if (m) {
            var _topic = publish;
            var _m = {widgetId : wargs.uuid, type : _type, targetId : pid};
            var action = m.action;
            if (!action) _topic = _topic + "/" + _type;
	    if (typeof value != "undefined") _m.value= value;

            if (action && action instanceof Array) {
              for (var _a=0; _a < action.length; _a++) {
                  var payload = clone(_m);
                  if (action[_a].topic) payload.topic = action[_a].topic;
                  else payload.topic = publish;
                  if (action[_a].message) payload.message = action[_a].message;
                  jmaki.publish(payload.topic,payload);
              }
            } else {
              if (m.action && m.action.topic) {
                  _topic = _m.topic = m.action.topic;
              }
              if (m.action && m.action.message) _m.message = m.action.message;                

              jmaki.publish(_topic,_m);
            } 
        }
    } 

    /**
     * Default event handler for menu
     */
    this.onMenuItemClick = function(p_sType ,event ,p_oValue) {
        processActions(p_oValue,p_oValue.id);
        if (p_oValue.href) location.href = p_oValue.href;
    }
    
    //Configuration
    var cfg = {
        position: 'static',
        visible: true,
        x: undefined,
        y: undefined,
        fixedcenter: true,
        hidedelay: 750,
        clicktohide: true,
        constraintoviewport: true,
        menu: [ 
        { label:'Must Read',
          menu: [ 
          { label:'Slashdot', url:'http://www.slashdot.org' },
          { label:'dev.java.net', menu: [ 
            {label : 'jMaki',url:'http://ajax.dev.java.net'}, {label : 'Glass',url:'http://glassfish.dev.java.net'} 
            ] }
          ]
        }, 
        { label:'Click me for fun!',style:{strongemphasis:true} },
        { label:'Disabled!',style:{disabled:true} },
        { label:'Yahoo!', url:'http://www.yahoo.com' },
        { label:'Sun Microsystems', url:'http://www.sun.com',style:{checked:true} },
        { label:'Oracle', url:'http://www.oracle.com' }
        ]
    };
    
    
    //read the widget configuration arguments
    if (typeof wargs.args != 'undefined') {
        
        //overide topic name if needed
        if (typeof wargs.args.topic != 'undefined') {
            topic = wargs.args.topic;
            jmaki.log("Yahoo menu: widget uses deprecated topic. Use publish instead.");
        }  
        
        if (typeof wargs.args.position != 'undefined') {
            var positions = { 'static':'static', 'dynamic':'dynamic' };
            var t = positions[wargs.args.position];
            cfg.position = (typeof t != 'undefined') ? t : "static";            
        }  
        if (typeof wargs.args.visible != 'undefined') {
            cfg.visible = wargs.args.visible;
        }  
        if (typeof wargs.args.fixedcenter != 'undefined') {
            cfg.fixedcenter = wargs.args.fixedcenter;
        }
        if (typeof wargs.args.x != 'undefined') {
            cfg.x = wargs.args.x;
        }
        if (typeof wargs.args.y != 'undefined') {
            cfg.y = wargs.args.y;
        }
        if (typeof wargs.args.hidedelay != 'undefined') {
            cfg.hidedelay = wargs.args.hidedelay;
        }  
        if (typeof wargs.args.clicktohide != 'undefined') {
            cfg.clicktohide = wargs.args.clicktohide;
        }  
        if (typeof wargs.args.constraintoviewport != 'undefined') {
            cfg.constraintoviewport = wargs.args.constraintoviewport;
        }        
    }
    if (wargs.publish) publish = wargs.publish;    
    if (typeof wargs.value != 'undefined') {
        
        var v = wargs.value;
        if(typeof v.menu != 'undefined') {
            cfg.menu = v.menu;
        }
    }       
    
    YAHOO.log("x = " + cfg.x);
    YAHOO.log("y = " + cfg.y);
    YAHOO.log("position = " + cfg.position);
    YAHOO.log("visible = " + cfg.visible);
    YAHOO.log("fixedcenter = " + cfg.fixedcenter);
    YAHOO.log("hidedelay = " + cfg.hidedelay);
    YAHOO.log("clicktohide = " + cfg.clicktohide);
    YAHOO.log("constraintoviewport = " + cfg.constraintoviewport);
    
    /**
     * initialize the menu
     */
    this.init = function() {
        
        // Create the menu
        if(cfg.position == 'static') {
            //if it is static then some parameter(s) should not be defined
            cfg.fixedcenter = undefined;
            cfg.x = undefined;
            cfg.y = undefined;
        }
        menu = new YAHOO.widget.Menu(menuId, {
            visible: cfg.visible,
            position: cfg.position,
            x: cfg.x,
            y: cfg.y,
            hidedelay: cfg.hidedelay, 
            lazyload: true, 
            autosubmenudisplay: true,
            clicktohide: cfg.clicktohide,
            fixedcenter: cfg.fixedcenter,
            constraintoviewport: cfg.constraintoviewport
        }
        );
        
        /**
         * convert to Yahoo menu style
         */
        var convertToYahooMenuStyle = function(obj,style) {
            if(style.emphasis) {
                obj.emphasis = true;
            }
            if(style.strongemphasis) {
                obj.strongemphasis = true;
            }
            if(style.checked) {
                obj.checked = true;
            }
            if(style.disabled) {
                obj.disabled = true;
            }
        }
        
        /**
         * Recursive function that goes through the new standard jMaki format
         * and converts it to Yahoo! YUI Menu format.
         * Note: yui menu grouping is not currently supported since we have 
         * to do arrays of arrays
         */
        var convertToYahooMenu = function(jmakiMenu,lvl) {
            var array = new Array();
            if(typeof jmakiMenu != 'undefined') {
                for(var i = 0; i < jmakiMenu.length; i++) {
                    var obj = {};
                    var item = jmakiMenu[i];
                    if(typeof item != 'undefined') {
                        obj.text = item.label;
                        if(item.style) {
                            convertToYahooMenuStyle(obj,item.style);
                        }
                        if(typeof item.menu != 'undefined' ) {
                            var submenu = convertToYahooMenu(item.menu,lvl+1);
                            if(typeof submenu != 'undefined') {
                                obj.submenu = submenu;
                            }
                        }
                        obj.onclick = { fn: self.onMenuItemClick, obj : item }
                        array.push(obj);
                    }
                }
            }
            if(lvl > 0 ) {
                //submenu level
                var obj = {};
                //unique submenu number
                obj.id = "submenu" + (new Date().getTime()) + "_" + lvl;
                obj.itemdata = array;
                return obj;
            } else {
                //top menu level
                return array;
            }
        }
        
        var yahooMenu = convertToYahooMenu(cfg.menu,0);
        menu.clearContent();
        menu.addItems(yahooMenu);
        
        if(cfg.position == 'static') {
            menu.render();
        } else { // position == dynamic or other
            menu.render(document.body);
        } 
        if(cfg.visible) {
            menu.show();        
        }  
        
    }
    
    /**
     * Sets the menu visibility flag
     */
    this.setVisible = function(visible) {
        if(visible) { 
            menu.show();
        } else {
            menu.hide();
        }
    }
    
    //initialize menu when 'menuId' div is available
    YAHOO.util.Event.onContentReady(menuId, this.init);
    
} //end of yahoo.menu widget
