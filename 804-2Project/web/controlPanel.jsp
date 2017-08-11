<%@page contentType="text/html"%>
<%@page pageEncoding="UTF-8"%>

<%!
    String css="blog.css";
%>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
        
         <link href="<%=css%>" rel="stylesheet" type="text/css" />
         
          <style type="text/css">
            <!--
body {
	margin-left: 0px;
	margin-top: 0px;
	margin-right: 0px;
	margin-bottom: 0px;
}
            -->
        </style>
    </head>
    <iframe src="http://localhost:8084/731Project/TopFunction.jsp" height="40" width="1024" scrolling="no" marginheight="0" marginwidth="0" frameborder="0"></iframe>
    <body background="image/bg_minidots.gif">
        <center>
            <table class="tableline">
                <tr>
                    <td><a href="register/checkMember.jsp">會員資料</a></td>
                    <td>|</td>
                    <td><a href="friends/friendsControl.jsp">好友</a></td>
                    <td>|</td>
                    <td><a href="Category/CategoryControl.jsp">文章分類列表</a></td>
                    <td>|</td>
                    <td><a href="Style/styleControl.jsp">挑選新樣式</td>
                </tr>
                
            </table>
            
        </center>
    </body>
</html>
