/* Copyright 2007 You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at:
 http://developer.sun.com/berkeley_license.html
 $Id: component.js,v 1.0 2007/04/15 19:39:59 gmurray71 Exp $
*/
// define the namespaces
jmaki.namespace("jmaki.widgets.google.mappopup");

/**
 * @constructor
*/
jmaki.widgets.google.mappopup.Widget = function(wargs) {

    var self = this;
    var uuid = wargs.uuid;
    var service = jmaki.xhp;
    var location;
    var loaded = false;
    var map;
    var mapH = 150;
    var mapW = 150;
    var zoom = 13;
    var padding = 10;
    var showOverlay = false;
    var mapContainer;
    var containerDiv = document.getElementById(wargs.uuid);
    var arrowDiv;
    var resizeDiv;
    var closeDiv;
    var dragStart;
    var top = 0;
    var left = 0;
    
    if (typeof G_SATELLITE_TYPE == 'undefined') {
        var mdiv = document.createElement("div");
        mdiv.innerHTML = "<div style='color:red'>Google Map did not load properly or the API Key is not configured properly. " +
        "To get an API key please visit <a hef='http://www.google.com/apis/maps/signup.html'>Google Maps API</a> and configure " +
        " the map as described at <a href='https://ajax.dev.java.net/widget-developer.html#config'>jMaki Configuration.</a></div>";

        containerDiv.appendChild(mdiv);        
        return;
    }

    if (typeof wargs.args != 'undefined') {
        if (typeof wargs.args.zoom != 'undefined') {
            zoom = Number(wargs.args.zoom);
        }

        if (typeof wargs.args.height != 'undefined') {
            mapH = Number(wargs.args.height);
        }

        if (typeof wargs.args.width != 'undefined') {
            mapW = Number(wargs.args.width);
        }

        if (typeof wargs.args.showOverlay != 'undefined') {
            showOverLay = (wargs.args.showOverlay = "true");
        }  
    }
    
    this.showMap = function(location) {
        if (containerDiv && containerDiv.style.visibility == "visible") {
            setVisible("hidden");
        } else if (!loaded) {
            if (typeof location == 'undefined') {
                location = encodeURIComponent(wargs.value);
            }

            var encodedLocation = encodeURIComponent("location=" + location);
            var url = service + "?id=yahoogeocoder&urlparams=" + encodedLocation;
            jmaki.doAjax({url: url, callback: function(req) { var _req=req; postProcess(_req);}});
        } else {
            setVisible("visible");
        }
    }
    
    function setVisible(visibility) {
        containerDiv.style.visibility = visibility;
        mapContainer.style.visibility = visibility;
        arrowDiv.style.visibility = visibility;
        closeDiv.style.visibility = visibility;
    }
	
    function postProcess(req) {
        if (req.readyState == 4) {
            if (req.status == 200) {
                loaded = true;
                if (req.responseText != '') {
                    var response = eval("(" + req.responseText + ")");
                    var coordinates = response.coordinates;
                    containerDiv = document.getElementById(wargs.uuid);
                    var button = document.getElementById(wargs.uuid + "_button");
                    arrowDiv = document.getElementById(wargs.uuid + "_arrow");
                    resizeDiv = document.getElementById(wargs.uuid + "_resize");
                    mapContainer = document.getElementById(wargs.uuid + "_map");
                    closeDiv = document.getElementById(wargs.uuid + "_close");
                    closeDiv.onmousedown = function (e) {
                        setVisible("hidden");
                        return false;
                    }
                    var pos = getPosition(button);
                    top = (pos.y - 25)
                    containerDiv.style.top = top + "px";
                    closeDiv.style.left = (mapW - closeDiv.clientWidth -1)  + "px";
                    closeDiv.style.top =  1 + "px";
                    // resizing div  location
                    resizeDiv.style.left = (mapW - resizeDiv.clientWidth) + "px";
                    resizeDiv.style.top = (mapH - resizeDiv.clientHeight) + "px";
                    // attach listeners
                    resizeDiv.onmousedown = function (e) {
                        var pos = getMousePos(e);
                        dragStart = pos;
                        return false;
                    }
                    function mouseMove(e) {
                        if (dragStart) {
                            var pos = getMousePos(e);
                            
                            mapW =  (pos.x - left);
                            mapH =  (pos.y - top);
                           
                            // move all the things to thier respective places 
                            containerDiv.style.width = mapW + "px";
                            containerDiv.style.height = mapH + "px";
                            mapContainer.style.width = mapW  - (padding * 2) + "px";
                            mapContainer.style.height = mapH - (padding * 2) + "px";
                            resizeDiv.style.left = (mapW - resizeDiv.clientWidth) + "px";
                            resizeDiv.style.top = (mapH - resizeDiv.clientHeight) + "px";
                            closeDiv.style.left = (mapW - closeDiv.clientWidth -1) + "px";
                        }
                        return true;
                    }
                    
                    // drag done
                    function onmouseup(e) {
                        dragStart = null;
                    }
                    
                    if (typeof document.attachEvent != 'undefined') {
                        document.attachEvent("onmousemove",function(e){var event = e;mouseMove(event);});
                    } else {
                        document.addEventListener("mousemove",function(e){var event= e;mouseMove(e);}, true);
                    }
                    
                    if (typeof document.attachEvent != 'undefined') {
                        document.attachEvent("onmouseup",function(e){var event = e;onmouseup(event);});
                    } else {
                        document.addEventListener("mouseup",function(e){var event= e;onmouseup(e);}, true);
                    }

                    left = (pos.x + button.clientWidth +  arrowDiv.clientWidth - 1) ;

                    containerDiv.style.left = left + "px";
                    mapContainer.style.top = padding + "px";
                    mapContainer.style.left = padding + "px";

                    arrowDiv.style.top = pos.y  + "px";
                    arrowDiv.style.left = (pos.x + button.clientWidth) + "px";                     
                    containerDiv.style.width = mapW + "px";
                    containerDiv.style.height = mapH + "px";
                    mapContainer.style.width = mapW  - (padding * 2) + "px";
                    mapContainer.style.height = mapH - (padding * 2) + "px";
                    var centerPoint = new GLatLng(coordinates[0].latitude,coordinates[0].longitude);
                    map = new GMap2(mapContainer);
                    map.setCenter(centerPoint, zoom);
                    map.setMapType(G_SATELLITE_TYPE);
                    var marker = new GMarker(centerPoint);
                    map.addOverlay(marker);
                    if (showOverlay) {
                        var txt = '<div><b>' + coordinates[0].address + ' ' + coordinates[0].city + ' ' +  coordinates[0].state + '</b></div>';
                        GEvent.addListener(marker, "click", function() {
                            marker.openInfoWindowHtml(txt); });
                    }
                    setVisible("visible");
                } else {
                    alert("no map available for " + wargs.value);
                }
			}
		}
    }
    
    function getMousePos(e){
        var lx = 0;
        var ly = 0;
        if (!e) e = window.event;
        if (e.pageX || e.pageY) {
            lx = e.pageX;
            ly = e.pageY;
        } else if (e.clientX || e.clientY) {
            lx = e.clientX;
            ly = e.clientY;
        }
        return {x:lx,y:ly};
    }
        function getPosition(_e) {
            var pX = 0;
            var pY = 0;
            try {
             while (_e.offsetParent) {               
                pY += _e.offsetTop;               
                pX += _e.offsetLeft;
                _e = _e.offsetParent;
            }
            } catch(e){};
            return {x: pX, y: pY};
        }
}
