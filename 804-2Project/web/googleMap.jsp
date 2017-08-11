<%@page contentType="text/html" import="MapBean.*,java.util.*"%>
<%@page pageEncoding="UTF-8"%>




<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>地圖日記</title>
        <script src="prototype.js" type="text/javascript"></script>
        <script src="scriptaculous.js" type="text/javascript"></script>
        <script src="unittest.js" type="text/javascript"></script>
        <script src="http://maps.google.com/maps?file=api&amp;v=2&amp;key=ABQIAAAAQ6jnIFRl7xVahR25heKAqhRuoDWqNw2SaEQ3s6k_JjRa-mj9QBTWWvHGO9t2-a-Nrj-NJQRLvClSyA"
                type="text/javascript"></script>
        <script src="googleMap.js" type="text/javascript"></script>
        <script type="text/javascript">
        
    //<![CDATA[
       
    var map;
    var geocoder = null;
    function load() {
      if (GBrowserIsCompatible()) {
        map = new GMap2(document.getElementById("map"));
        geocoder = new GClientGeocoder();
        
        map.addControl(new GLargeMapControl());
        map.addControl(new GMapTypeControl());
        map.setCenter(new GLatLng(23.074678,120.189743),12);
        GEvent.addListener(map,"move",getXYAxis);
        getFile('label.xml');//一次載入所有駐點,function:getFile();
        }
    }
    
    function getXYAxis(){
        var latLng = map.getCenter();
        document.getElementById("mapX").value = latLng.lat();
        document.getElementById("mapY").value = latLng.lng();
    }
   
    function sendValue(x,y,name,msg){
        document.getElementById("mapX").value = x;
        document.getElementById("mapY").value = y;
        map.setCenter(new GLatLng(x,y),12);
        addSite(map,12,name,x,y);
        showInfo(msg);
    }
    
    function addNewLabel(){
        var label = document.getElementById("siteName").value;
        var x = document.getElementById("mapX").value;
        var y = document.getElementById("mapY").value;
        addSite(map,12,label,x,y);
       
    }
     
    function addSite(map, siteCode, siteDesc, lat, lng) {
        var mark = new GMarker(
        new GLatLng(lat,lng),
        {title:siteDesc}
        );  
        map.addOverlay(mark);  
        }
    
        
     function showInfo(msg){
         var loc = map.getCenter();
         map.openInfoWindowHtml(loc,msg,new GSize(10,20));
         }
      
   
      function showLocation() { //search address(1)
        
        var address = document.getElementById('address').value; 
        geocoder.getLocations(address, cb_showLocation);
      }
      
      function setDefaultLocation(){
        var address = document.getElementById('defalutLocation').value;
        geocoder.getLocations(address, cb_showLocation);
        
        var loc = map.getCenter();
        var x = loc.lat();
        var y = loc.lng();
        var parm = "x="+x+"&"+"y="+y;
        var url = "setDefaultLocation.jsp?"+parm;
        var myAjax = new Ajax.Request(
                url,
                {   method:'post',
                    onComplete:setDefaultLocation_do}
                );
        
      }
      
      function setDefaultLocation_do(xmlhttp){
            var out="";
            var result = xmlhttp.responseXML.getElementsByTagName("result");
            for(var i = 0; i < result.length;i++){
                out += result[i].firstChild.nodeValue;
            }
            document.getElementById('result').innerHTML = out;
      }
      
      function cb_showLocation(result){//search address(2)
        var result1 = document.getElementById("result");
        if (result.Status.code == G_GEO_SUCCESS)  { 
        for (var i=0; i<result.Placemark.length; i++) { 
        var lat = result.Placemark[i].Point.coordinates[1]; // lat 
        var lng = result.Placemark[i].Point.coordinates[0]; // lng 
        var address = result.Placemark[i].address; // address 
        var point = new GLatLng(lat,lng);
        var marker=new GMarker(point, {title:i+1});;
        map.addOverlay(marker); 
        document.getElementById("mapX").value = lat;
        document.getElementById("mapY").value = lng;
        map.setCenter(new GLatLng(lat,lng),12);
        }
        }
      }
      
        function  getFile(filename){//一次載入所有駐點
            var myAjax = new Ajax.Request(
                filename,
                {method:"get",onComplete: getFile2}
            );
        }
        
        function getFile2(xmlhttp){//一次載入所有駐點do
            var out="";
            var i;
           
            var xmlDoc = xmlhttp.responseXML;
            var label = xmlDoc.getElementsByTagName('label');
            for(i=0;i < label.length;i++){
               var lat = label[i].getAttribute("lat");
               var lng = label[i].getAttribute("lng");
               var name = label[i].getAttribute("name");
               addSite(map, 12, name, lat, lng);
              
            }
         
       
        }
       
        //]]>           
    

       

       
	   

          

 
    
    
   
                                               </script>
        
        <style type="text/css">
            <!--
body {
	margin-left: 0px;
	margin-top: 0px;
	margin-right: 0px;
	margin-bottom: 0px;
}


            -->
        </style>
        
    </head>
    <body onload="load()" onunload="GUnload()">
        <table>
            <tr>
                <td><div id="map" style="width: 500px; height: 300px;border:solid 1px #6699FF;"></div></td>
                <td>
                    <div id="label"  style="width:130;height:200;overflow:scroll;position:relative;">
                        <ul id="list" style="padding: 2px;list-style-type:none;border:solid 1px #6699FF;">
                            <%
                            mapBean control = new mapBean();
                            Collection ret = control.getAllLabel();
                            Iterator it = ret.iterator();
                            while(it.hasNext()){
                                mapVO map = (mapVO)it.next();
                            %>    
                            
                            <li  ondblclick="sendValue(<%=map.getX()%>,<%=map.getY()%>,<%=map.getId()%>,'<%=map.getInfo()%>')"><div  onmousemove="style.background='#FFCC66';style.cursor='pointer'" onmouseout="style.background='#CCCCFF'" style="background='#CCCCFF'"  id="<%=map.getId()%>"><%=map.getName()%></div></li>
                            
                            <%}%>     
                        </ul>
                        
                        
                        
                        
                    </div>
                </td>
                <td><iframe name ="addLabel" src="googleFunction.jsp" scrolling="no" frameborder="0" width="200" height="300"></iframe></td>
            </tr>
            
            
            
        </table>
        
        <table>
            <tr>
                <form name="value">
                    <td>X座標:<input type="text" id="mapX" style="background:yellow" size="15"></td>
                    <td> Y座標:<input type="text" id="mapY" style="background:yellow" size="15"></td>
                    
                    
                    
                </form>
                
            </tr>
            <tr>
                <a href="" onclick="Print()">列印</a>
                <td>定位:<input type=text name="address"></td>
                <td><input type=button id="address" onclick="showLocation()" value="送出"></td>
                
                
            </tr>
            <tr>
                <td>設定預設位置<input type=text id="defalutLocation" name="location"></td>
                <td><input type=submit value="儲存" onclick="setDefaultLocation()"></td>
                <td><div id="result" name="result">here is result:</div></td>
            </tr>
                <input type="button" value="測試" onclick="getFile('label.xml')">
            
            
            
            
        </table>
        
        
        
        <script type="text/javascript" language="javascript" charset="utf-8">
// <![CDATA[
                                      
Position.includeScrollOffsets = true; 
Sortable.create('list',{scroll:'label'});

  

// ]]>
        </script>
        
    </body>
</html>
