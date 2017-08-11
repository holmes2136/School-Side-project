<%@page contentType="text/html" language="java" import="Control.Artical,Control.Control" %>
<%@page pageEncoding="UTF-8"%>




<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
    </head>
    <body>
        
       
        <%//功能列回應(2)
            request.setCharacterEncoding("utf-8");
            Artical artical = new Artical();
            artical.setTitle(request.getParameter("title"));
            artical.setTime(request.getParameter("time"));
            artical.setContent(request.getParameter("content"));
            artical.setAuthor(request.getParameter("author"));
            artical.setReplyid(Integer.parseInt(request.getParameter("replyid")));
            Control control = new Control();
            control.addNewTopic(artical);
            
        %>
    
    </body>
</html>
