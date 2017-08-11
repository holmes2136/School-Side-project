

<%@page contentType="text/html" import="jmaki.runtime.*,jmaki.controller.*"%>
<%@page pageEncoding="UTF-8"%>

<%!
    String css ="blog.css";


%>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
        
        <style type="text/css">
            <!--
body {
	margin-left: 0px;
	margin-top: 0px;
	margin-right: 20px;
	margin-bottom: 0px;
}
            -->
        </style>
          <link href="<%=css%>" rel="stylesheet" type="text/css"/>
        
    </head>
    <body  background="image/bg.gif">
        
        <%if(session.getAttribute("username")!=null){
        
        %>
        <%@ include  file="Login/loginPanel1.jsp"%>
        <%} else{%>   
        
        <%@ include  file="Login/loginPanel.jsp" %>  
        <%
        }
        %>
        
        
        
        
    </body>
</html>
