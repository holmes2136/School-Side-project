<%@page contentType="text/html" import="Control.*"%>
<%@page pageEncoding="UTF-8"%>



<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
    </head>
    <body>
        <%//功能列pencial(2)
            request.setCharacterEncoding("utf-8");
            Artical artical = new Artical();
            artical.setTitleid(Integer.parseInt(request.getParameter("titleid")));
            artical.setTitle(request.getParameter("title"));
            artical.setContent(request.getParameter("content"));
            artical.setCategory(request.getParameter("category"));
            Control control = new Control();
            control.updateTopic(artical);
            response.sendRedirect("http://localhost:8084/731Project/index.jsp");
        %>
   
    
    </body>
</html>
