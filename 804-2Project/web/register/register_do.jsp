<%@page contentType="text/html"%>
<%@page pageEncoding="UTF-8"%>


<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
    </head>
    <body>
<jsp:useBean id="user" scope="page" class="Control.User">
<jsp:setProperty name="user" property="*"/>
</jsp:useBean>
<jsp:useBean id="register" scope="page" class="Control.Register"/>

    <%
        
        register.addMember(user);
        response.sendRedirect("registerComplete.html");
        
        %>
        <h1>增加成功</h1>
    </body>
</html>
