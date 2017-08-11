<%@page contentType="text/html" import="Control.Control,Control.Category"%>
<%@page pageEncoding="UTF-8"%>

   

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
    </head>
    <body>
            <%
                request.setCharacterEncoding("utf-8");
                Category category = new Category();
                category.setCatid(request.getParameter("name"));
                category.setDescn(request.getParameter("descn"));
                Control control = new Control();
                control.addCategory(category);
                response.sendRedirect("addCategory.jsp");
            
            %>
   
    
    </body>
</html>
