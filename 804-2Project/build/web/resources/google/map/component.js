/* Copyright 2007 You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at:
 http://developer.sun.com/berkeley_license.html
 $Id: component.js,v 1.0 2007/04/15 19:39:59 gmurray71 Exp $
*/
 // define the namespaces
jmaki.namespace("jmaki.widgets.google.map");

/**
 * @constructor
*/
jmaki.widgets.google.map.Widget = function(wargs) {

    var containerDiv = document.getElementById(wargs.uuid);
    var zoom = 13;
    var centerLat = 37.4419;
    var centerLon = -122.1419;
    
    if (typeof G_SATELLITE_TYPE == 'undefined') {
        var mdiv = document.createElement("div");
        mdiv.innerHTML = "<div style='color:red'>Google Map did not load properly or the API Key is not configured properly. " +
        "To get an API key please visit <a hef='http://www.google.com/apis/maps/signup.html'>Google Maps API</a> and configure " +
        " the map as described at <a href='https://ajax.dev.java.net/widget-developer.html#config'>jMaki Configuration.</a></div>";

        containerDiv.appendChild(mdiv);        
        return;
    }
    
    var mapType = G_SATELLITE_TYPE;
    var mapH = 0;
    var mapW = 0;
    
    
    if (typeof wargs.args != 'undefined') {
        if (typeof wargs.args.zoom != 'undefined') {
            zoom = Number(wargs.args.zoom);
        }
        
        if (typeof wargs.args.zoom != 'undefined') {
            zoom = Number(wargs.args.zoom);
        }
        
        if (wargs.args.centerLat != 'undefined') {
            centerLat = Number(wargs.args.centerLat);
        }
        if (typeof wargs.args.centerLon != 'undefined') {
            centerLon = Number(wargs.args.centerLon);
        }
        
        if (typeof wargs.args.height != 'undefined') {
            mapH = Number(wargs.args.height);
            containerDiv.style.height = mapH + "px";
        }
        
        if (typeof wargs.args.width != 'undefined') {
            mapW = Number(wargs.args.width);
            containerDiv.style.width = mapW + "px";
        }
        
        if (typeof wargs.args.mapType != 'undefined') { 
            if (wargs.args.mapType == 'REGULAR') {
                mapType = G_NORMAL_MAP;
            } else if (wargs.args.mapType == 'SATELLITE') {
                mapType = G_SATELLITE_TYPE;
            } else if (wargs.args.mapType == 'HYBRID') {
                mapType = G_HYBRID_MAP;
            }
        }
    }
    if (mapH == 0) {
        mapH = containerDiv.offsetHeight;
        // if all else fails give it a height of 300
        if (mapH ==0) mapH = 300;
        containerDiv.style.height = mapH + "px";
    }
    
    this.map = new GMap2(containerDiv);
    this.map.setCenter(new GLatLng(centerLat, centerLon), zoom);
    this.map.addControl(new GSmallMapControl());
    this.map.addControl(new GMapTypeControl());
    this.map.setMapType(mapType);
}
