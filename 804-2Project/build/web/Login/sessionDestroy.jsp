<%@page contentType="text/html"%>
<%@page pageEncoding="UTF-8"%>


<%
   request.setCharacterEncoding("utf-8");
   String test = request.getParameter("sessionDestroy");
   if(test.equals("登出")){
        session.invalidate();
        response.sendRedirect("LoginOut.jsp");
   }
%>
  



<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
    </head>
    <body>
  
    
    </body>
</html>
