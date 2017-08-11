<%@page contentType="text/html" import="Friends.*,java.util.*"%>
<%@page pageEncoding="UTF-8"%>


<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
    </head>
    <body>
            <%
                request.setCharacterEncoding("utf-8");
            
            %>
            <jsp:useBean id="friendsVO" scope="page" class="Friends.FriendsVO">
            <jsp:setProperty name="friendsVO" property="*"/>
            </jsp:useBean>
            
            <%
                FriendsControl control = new FriendsControl();
                control.addFriends(friendsVO);
                response.sendRedirect("friendsControl.jsp");
            %>
    
    
    </body>
</html>
