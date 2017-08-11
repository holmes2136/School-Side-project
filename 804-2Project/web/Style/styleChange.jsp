<%@page contentType="text/html" import="Control.*"%>
<%@page pageEncoding="UTF-8"%>


<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
    </head>
    <body>
            <%
                String username = (String)session.getAttribute("username");
                String style = request.getParameter("style");
                User user = new User();
                Register updateStyle = new Register();
                user.setStyle(style);
                user.setUsername(username);
                updateStyle.updateStyle(user);
                response.sendRedirect("http://localhost:8084/731Project/index.jsp");
                
            %>
    
    
    </body>
</html>
