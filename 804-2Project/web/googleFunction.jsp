<%@page contentType="text/html" import="MapBean.*,XML.myRead"%>
<%@page pageEncoding="UTF-8" import="org.jdom.*" %>


<%
        request.setCharacterEncoding("utf-8");
%> 
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
        
        <script language="JavaScript">
        function sendValueToIframe(){
        
        x = parent.document.value.mapX.value;
        y = parent.document.value.mapY.value;
        document.getElementById("mapX").value = x;
        document.getElementById("mapY").value = y;
        }
        </script>
    </head>
    <body>
        
        <%
        String x = request.getParameter("mapX");
        String y = request.getParameter("mapY");
        String siteName = request.getParameter("siteName");
        String info = request.getParameter("info");
        if(x!=null){
            myRead xml = new myRead(x,y,siteName);
            
            mapBean control = new mapBean();
            mapVO map = new mapVO();
            
            map.setX(x);
            map.setY(y);
            map.setName(siteName);
            map.setInfo(info);
            control.addLabel(map);
            
           
            
            response.sendRedirect("http://localhost:8086/731Project/googleMap.jsp");
        }
        
        %>
        <form action="googleFunction.jsp" method="post" name="addSite" target="_parent">
            <table>
                <tr>
                    <td>站點:<input type="text" name="siteName" id="siteName"  size="15"></td>
                </tr>
                <tr> 
                    <td>說明:<input type="text" name="info" id="info"  size="20"></td>
                </tr>
                <tr>
                    <td><input type="submit"  value="送出" onclick="sendValueToIframe()"></td>
                </tr>
                <input type=hidden name="mapX" id="mapX">
                <input type=hidden  name="mapY" id="mapY">
            </table>
            
        </form>
        
      
           
        
    </body>
</html>
