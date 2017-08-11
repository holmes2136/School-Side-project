// define the namespaces
jmaki.namespace("jmaki.widgets.yahoo.grid");

/**
 * Yahoo UI Grid Widget
 *
 * @author Greg Murray
 *      original author
 * @author Ahmad M. Zawawi <ahmad.zawawi@gmail.com>
 *      Updated the widget to use glue publish/subscribe and added proper events
 * @constructor
 * @see http://developer.yahoo.com/yui/datatable/
 */
jmaki.widgets.yahoo.grid.Widget = function(wargs) {

    var uuid = wargs.uuid;
    var container = document.getElementById(uuid);
    container.innerHtml = "yahoo.grid is deprecated. Please use yahoo.dataTable instead.";
}