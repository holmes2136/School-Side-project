<%@page contentType="text/html" import="Control.*"%>
<%@page pageEncoding="UTF-8"%>


<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
    </head>
    <body>
            <%
               Control control = new Control();
               String[] category = request.getParameterValues("category");
               control.deleteCategory(category);
               response.sendRedirect("CategoryControl.jsp");
            %>
    
    </body>
</html>
