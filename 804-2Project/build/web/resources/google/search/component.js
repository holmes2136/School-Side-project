/* Copyright 2007 You may not modify, use, reproduce, or distribute this software except in compliance with the terms of the License at:
 http://developer.sun.com/berkeley_license.html
 $Id: component.js,v 1.0 2007/04/15 19:39:59 gmurray71 Exp $
*/
// define the namespaces
jmaki.namespace("jmaki.widgets.google.search");

/**
 * @constructor
*/
jmaki.widgets.google.search.Widget = function(wargs) {
    // Create a search control
    var containerDiv = document.getElementById(wargs.uuid);
    
     // Create a search control
    var searchControl = new GSearchControl();
    if (typeof searchControl.resultSetSize == 'undefined') {
        var mdiv = document.createElement("div");
        mdiv.innerHTML = "<div style='color:red'>Google AJAX Search Key did not load or is not configured properly. " +
        "Please visit <a hef='http://www.google.com/apis/maps/signup.html'>Google Search </a> and configure " +
        " the key as you would setup the map key described at <a href='https://ajax.dev.java.net/widget-developer.html#config'>jMaki Configuration.</a></div>";
        containerDiv.appendChild(mdiv);        
        return;
    }
    
    var centerPoint =  'Santa Clara, CA';
    var defaultSearch = 'jmaki';
    var websearch = true;
    
    if (wargs.args) {
        if (wargs.args.defaultSearch) {
            defaultSearch = wargs.args.defaultSearch;
        }
        
        if (wargs.args.centerPoint) {
            centerPoint = wargs.args.centerPoint;
        }
        if (wargs.args.localSearch) {
            // Add in a full set of searchers
            var localSearch = new GlocalSearch();
            searchControl.addSearcher(localSearch);
            // Set the Local Search center point
            localSearch.setCenterPoint(centerPoint);                
        }
        if (wargs.args.websearch == false) {
            websearch = false;
        }
        if (wargs.args.videosearch) {
            searchControl.addSearcher(new GvideoSearch());
        }
        if (wargs.args.blogsearch) {
            searchControl.addSearcher(new GblogSearch());
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
    
    if (websearch) {
        var options = new GsearcherOptions();
        options.setExpandMode(GSearchControl.EXPAND_MODE_OPEN);
        searchControl.addSearcher(new GwebSearch(), options);            
    }
    
    
    // Tell the searcher to draw itself and tell it where to attach
    searchControl.draw(document.getElementById(wargs.uuid));
    
    // Execute an inital search
    searchControl.execute(defaultSearch);
}
