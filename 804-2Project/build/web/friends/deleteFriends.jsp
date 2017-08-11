<%@page contentType="text/html"import="Friends.*"%>
<%@page pageEncoding="UTF-8"%>


<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
    </head>
    <body>
            <%
               FriendsControl control = new FriendsControl();
               String[] friends = request.getParameterValues("friends");
               control.deleteFriends(friends);
               response.sendRedirect("friendsControl.jsp");
            %>
    
    </body>
</html>
