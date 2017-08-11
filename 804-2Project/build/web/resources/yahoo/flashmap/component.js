// define the namespaces
jmaki.namespace("jmaki.widgets.yahoo.flashmap");

/*
* Yahoo Flash Map Widget
* This widget wraps the Javascript API flash maps 
*
* @author Ahmad M. Zawawi <ahmad.zawawi@gmail.com>
* @constructor
* @see http://com3.devnet.re3.yahoo.com/maps/flash/V3.04/flashReference.html
*/ 
jmaki.widgets.yahoo.flashmap.Widget = function(wargs) {
    
    var publish = "/yahoo/flashmap";
    var subscribe = ["/yahoo/flashmap", "/map"];
    
    //TODO actions for remove/update markers
    //TODO generic events  for onclick,onzoom
    
    var self = this;
    var uuid = wargs.uuid;
    var containerId = uuid;
    var mapContainer = document.getElementById(containerId);    
    var zoom = 7;
    var autoSizeH = true;
    var autoSizeW = true;
    var map;
    // default location to Yahoo HQ
    var centerLat = 37.4041960114344;
    var centerLon = -122.008194923401;
    var centerPoint;
    if (typeof Map == 'undefined') {
        //sanity check
        jmaki.log("Error with yahoo map with id=" + wargs.uuid + 
            ". Unable to load required map scripts. " +
            "This might be caused by lack of internet contectivity or an atempt " +
            "to load the widget dynamically which is not possible.");
        return;
    }
    var mapType = MapViews.HYBRID;
    var mapOverlays = [];
    
    //for resizing
    var VIEWPORT_HEIGHT = 0;
    var VIEWPORT_WIDTH = 0;
    var oldResize;
    var oldWidth;
    var resizing = false;
    var lastSize = 0;
    
    // we need this for resize events
    var ie = /MSIE/i.test(navigator.userAgent);
    var safari = /Safari/i.test(navigator.userAgent);
    
    // pull in args
    if (typeof wargs.args != 'undefined') {
        
        if (typeof wargs.args.zoom != 'undefined') {
            this.zoom = Number(wargs.args.zoom);
        }
        
        if (typeof wargs.args.centerLat != 'undefined') {
            centerLat = Number(wargs.args.centerLat);
        }
        
        if (typeof wargs.args.centerLon != 'undefined') {
            centerLon = Number(wargs.args.centerLon);
        }
        
        if (typeof wargs.args.mapType != 'undefined') {
            var mapTypes = { 
                'MAP': MapViews.MAP, 
                'HYBRID': MapViews.HYBRID, 
                'SATELLITE': MapViews.SATELLITE };
            var o = mapTypes[wargs.args.mapType];
            mapType = (typeof o != 'undefined') ? o : MapViews.MAP;
        }       
        if (typeof wargs.args.height != 'undefined') {
            VIEWPORT_HEIGHT = Number(wargs.args.height);
            autoSizeH = false;
        }
        
        if (typeof wargs.args.width != 'undefined') {
            VIEWPORT_WIDTH = Number(wargs.args.width);
            autoSizeW = false;
        }
    }
    
    //publish/subscribe functionality
    if (wargs.publish) {
        publish = wargs.publish;
    }
    if (wargs.subscribe) {
        if (typeof wargs.subscribe == "string") {
            subscribe = [];
            subscribe.push(wargs.subscribe);         
        }        
    }
    
    
    
    /**
    * subscribe to a jmaki topic (with tracking enabled)
    * This is needed for this.destroy
    */
    function doSubscribe(topic, handler) {
        var i = jmaki.subscribe(topic, handler);
        self.subs.push(i);     
    }
    
    /**
    * cleanup jmaki glue handler code..
    */
    this.destroy = function() {
        for(var i=0; self.subs && i < self.subs.length; i++) {
            jmaki.unsubscribe(self.subs[i]);
        }
    };
    
    
    
    /**
    */
    function getPosition(_e) {
        var pX = 0;
        var pY = 0;
        
        while (_e.offsetParent) {
            pY += _e.offsetTop;
            pX += _e.offsetLeft;
            _e = _e.offsetParent;
        }
        return {x: pX, y: pY};
    }
    
    /**
    */
    function resize() {
        
        if (oldResize) {
            oldResize();
        }
        if (autoSizeH || autoSizeW){
            var pos = getPosition(mapContainer);
            if (mapContainer.parentNode.nodeName == "BODY") {
                if (window.innerHeight){
                    if (autoSizeH) VIEWPORT_HEIGHT = window.innerHeight - pos.y -16;
                    if (autoSizeW) VIEWPORT_WIDTH = window.innerWidth - 15;
                } else 
                {
                    var _tNode = mapContainer.parentNode;
                    while(_tNode != null &&
                        (_tNode.clientHeight == 0 ||
                            typeof _tNode.clientWidth == 'undefined')) {
                        _tNode = _tNode.parentNode;
                    }
                    if (_tNode == null) {
                        VIEWPORT_WIDTH = 400;
                    } else 
                    {
                        if (autoSizeW) VIEWPORT_WIDTH = _tNode.clientWidth - 20;
                        if (autoSizeH) VIEWPORT_HEIGHT = _tNode.clientHeight - pos.y - 15;
                    }
                }
                if (VIEWPORT_HEIGHT < 0) {
                    VIEWPORT_HEIGHT = 300;
                }
                if (VIEWPORT_WIDTH < 0) {
                    VIEWPORT_WIDTH = 400;
                }
            } else 
            {
                var _tNode = mapContainer.parentNode;
                while(_tNode != null &&
                    (_tNode.clientHeight == 0 ||
                        typeof _tNode.clientWidth == 'undefined')) {
                    _tNode = _tNode.parentNode;
                }
                if (_tNode == null) {
                    if (autoSizeW) VIEWPORT_WIDTH = 400;
                } else 
                {
                    if (autoSizeW)  VIEWPORT_WIDTH = _tNode.clientWidth;
                    if (autoSizeH)  VIEWPORT_HEIGHT = _tNode.clientHeight;
                    if (safari) {
                        VIEWPORT_WIDTH -= 18;
                        VIEWPORT_HEIGHT -= 18;
                    }
                }
            }                  
        }
        
        mapContainer.style.width = VIEWPORT_WIDTH + "px";
        mapContainer.style.height = VIEWPORT_HEIGHT + "px";
        //var mapSize = new YSize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
        //self.map.resizeTo(mapSize);
        oldWidth = document.body.clientWidth;
        // Display the this.map centered on a latitude and longitude
        if (typeof self.map != 'undefined') {
            self.map.drawZoomAndCenter(centerPoint, self.zoom);
        }
    }
    
    
    
    /**
    */
    function layout() {
        if (!ie) {
            resize();
            return;
        }
        // special handling for ie resizing.
        // we wait for no change for a full second before resizing.
        if (oldWidth != document.body.clientWidth && !resizing) {
            if (!resizing) {
                resizing = true;
                setTimeout(layout,1000);
            }
        } else if (resizing && document.body.clientWidth == lastSize) 
        {
            resizing = false;
            resize();
        } else if (resizing) 
        {
            lastSize = document.body.clientWidth;
            setTimeout(layout,1000);
        }
    }
    
    /**
    * resize the map after widget has loaded 
    * (called by jmaki)
    */
    this.postLoad = function() {
        resize();       
    }
    
    
    /**
    * returns a clone of obj t
    */
    function clone(t) {
        var obj = {};
        for (var i in t) {
            obj[i] = t[i];
        }
        return obj;
    }
    
    /**
    * Generic process actions method used to consume action
    */
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
            } else 
            {
                if (m.action && m.action.topic) {
                    _topic = _m.topic = m.action.topic;
                }
                if (m.action && m.action.message) _m.message = m.action.message;                
                jmaki.publish(_topic,_m);
            } 
        }
    } 
    
    
    /**
    * initialize flash map
    */
    var initMap = function() {
        //create map
        
        centerPoint = new LatLon(centerLat,centerLon);
        //TODO generic way to get apikeys from jmaki widget
        //var key = wargs.config.apikeys[0].keys[0].key;
        //alert(key);
        map = new Map(uuid, "jmaki-key",centerPoint,zoom,mapType);
        var onMapInit = function(evt) {
            // Add pan/drag map functionality
            map.addTool( new PanTool(), true );
            // Add map type control
            map.addWidget( new SatelliteControlWidget() );
            // Add map zoomer
            map.addWidget( new NavigatorWidget("closed") );
            
            // track the subscribers so we can later remove them
            self.subs = [];
            for (var _i=0; _i < subscribe.length; _i++) {
                doSubscribe(subscribe[_i]  + "/clearMarkers", self.clearMarkers);
                doSubscribe(subscribe[_i]  + "/clearOverlays", self.clearOverlays);
                doSubscribe(subscribe[_i]  + "/addOverlays", self.addOverlays);
                doSubscribe(subscribe[_i]  + "/addMarkers", self.addMarkers);
                //doSubscribe(subscribe[_i]  + "/updateMarker", self.updateMarker);
                //doSubscribe(subscribe[_i]  + "/removeMarker", self.removeMarker);
                doSubscribe(subscribe[_i]  + "/setZoom", self.setZoom);
                doSubscribe(subscribe[_i]  + "/setCenter", self.setCenter);
            }
            
        }
        map.addEventListener(Map.EVENT_INITIALIZE, onMapInit);
        
        
        
        //on click map default handler
        map.addEventListener(Map.EVENT_ONCLICK, function(evt) {
            jmaki.publish(publish + "/onClick", {id:uuid, value:evt.latlon});
        });
        /**
        * on start zoom event default handler
        
        var onStartZoom = function(evt) {
        jmaki.log("onChangeZoom, " + evt.startZoomLevel + 
        "," + evt.endZoomLevel);
        jmaki.publish(publish + "/onChangeZoom", {
        id:uuid, value:{
        startZoomLevel:evt.startZoomLevel,
        endZoomLevel :evt.endZoomLevel 
        }
        });
        }
        //map.addEventListener(Map.EVENT_ZOOM ,onZoom);
        map.addEventListener(Map.EVENT_START_ZOOM ,onStartZoom);
        //map.addEventListener(Map.EVENT_END_ZOOM ,onZoom);
        */
        
        if (typeof window.onresize != 'undefined') {
            oldResize = window.onresize;
        }
        window.onresize = layout;         
    }
    
    /**
    * clear markers (called from /map/clearMarkers)
    */
    this.clearMarkers =  function(d) {
        if(!map) {
            jmaki.log("map is not initialized");
            return;
        }
        map.removeAllMarkers();
    };
    
    /**
    * clear markers (called from /map/clearOverlays)
    */
    this.clearOverlays =  function(d) {
        if(!map) {
            jmaki.log("map is not initialized");
            return;
        }
        //note: map.removeAllOverlays is not working
        for(var i = 0; i < mapOverlays.length; i++) {
            map.removeOverlay(mapOverlays[i]);
        }
        mapOverlays = [];
    };

    /**
    * add one or more markers (called from /map/addMarkers)
    */
    this.addMarkers = function(d) {
        if(!map) {
            jmaki.log("map is not initialized");
            return;
        }
        if(d && d.message && d.message.value) {
            var markers = d.message.value;
            if(markers instanceof Array) {
                for(var i = 0; i < markers.length; i++) {
                    var m = markers[i];
                    if(m && typeof m.lat == "number" && typeof m.lon == "number") {
                        //lat,lon
                        var pt = new LatLon(m.lat,m.lon);
                        marker = new CustomPOIMarker( m.id, m.label, 
                            m.text, '0xFF0000', '0xFFFFFF'); 
                        map.addMarkerByLatLon( marker, pt);
                    } else if(m && typeof m.address == "string") 
                    {
                        //or "address"...
                        marker = new CustomPOIMarker( m.id, m.label, 
                            m.text, '0xFF0000', '0xFFFFFF'); 
                        map.addMarkerByAddress( marker, m.address);
                    } else 
                    {
                        jmaki.log(".lat,.lon or .address properties must be defined");
                    }
                }
            } else
            {
                jmaki.log("markers must be an array");
            }
        } else 
        {
            jmaki.log("message or value is not defined in action");
        }
    };
    
    /**
    * update a marker (called from /map/updateMarker
    this.updateMarker = function(d) {
    if(!map) {
    jmaki.log("map is not initialized");
    return;
    }
    //TODO implement updateMarker
    if(map) {
    }
    }
    */
    
    /**
    * remove a marker (called from /map/removeMarker
    this.removeMarker = function(d) {
    //TODO implement removeMarker
    if(map) {
    }
    }
    */
    
    /**
    * Sets the zoom level (called from /map/setZoom)
    */
    this.setZoom = function(d) {
        if(!map) {
            jmaki.log("map is not initialized");
            return;
        }
        if(d && d.message && d.message.value) {
            var value = d.message.value;
            if(typeof value == "number") {
                //zoom level (integer)
                var zoomLevel = Math.floor(value);
                map.setZoomLevel(zoomLevel);
            } 
        }else 
        {
            jmaki.log("message or value is not defined in action");
        }
    };
    
    
    /**
    * Sets the map's center point (called from /map/setCenter)
    */
    this.setCenter = function(d) {
        if(!map) {
            jmaki.log("map is not initialized");
            return;
        }
        
        if(d && d.message && d.message.value) {
            var value = d.message.value;
            if(value instanceof Array && value.length >= 2) {
                //[centerLat,centerLon]
                var pt = new LatLon(value[0],value[1]);
                map.setCenterByLatLon(pt,1000);
            } else if(typeof value == "string") 
            {
                //or "address"...
                map.setCenterByAddress(value,1000);
            } else
            {
                jmaki.log("value must be address (string) or [lat,lon] array");
            }
        } else 
        {
            jmaki.log("message or value is not defined in action");
        }
    };
    
    /**
    * adds overlays (currently only 'traffic' is supported)
    */
    this.addOverlays = function(d) {
        if(d && d.message && d.message.value) {
            var value = d.message.value;
            if(value instanceof Array) {
                //add overlays
                var overlays = value;
                for(var i = 0; i < overlays.length; i++) {
                    var ol = overlays[i];
                    if(ol && ol.id) {
                        var o;
                        if(ol.id == "traffic") {
                            o = new TrafficOverlay();
                        } else if(ol.id == "localsearch" && ol.query) 
                        {
                            o = new LocalSearchOverlay();
                            o.search(ol.query, map.getCenter() );
                        }
                        if(o) {
                            mapOverlays.push(o);
                            map.addOverlay(o);
                        }
                    }
                }
            } else
            {
                jmaki.log("value must an array of overlay names");
            }
        } else 
        {
            jmaki.log("message or value is not defined in action");
        }
    };
    
    
    //initialize map
    initMap();
    
}