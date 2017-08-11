<%@page contentType="text/html"%>
<%@page pageEncoding="UTF-8"%>

<%
    String url = "http://holmes2136.no-ip.org:8084/731Project/";
%>

<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>JSP Page</title>
    
    
</head>
<body>
    <form action="Login/sessionDestroy.jsp" method="post" target="_parent">
        <table align="right" class="tableline">
            <tr>
                <td><a href="<%=url%>index.jsp" target="_parent">Index</a></td>
                <td>|</td>
                <td><a href="<%=url%>Style/styleControl.jsp" target="_parent">挑選新樣式</a></td>
                <td>|</td>
                <td><a href="<%=url%>friends/friends.jsp" target="_parent">好友</a></td>
                <td>|</td>
                <td><a href="<%=url%>Board/BoardPanel.jsp" target="_parent">消息看板</a></td>
                <td>|</td>
                <td colspan="4"><a href="<%=url%>googleMap.jsp/"  target="_parent">地圖日記</a></td>
                <td>|</td>
                <td><a href="<%=url%>controlPanel.jsp" target="_parent">控制台</a></td>
                <td>|</td>
                <td><input type="submit" name="sessionDestroy" value="登出"></td>
            </tr> 
            
        </table>
    </form>
    
    
    
    
    
    
    </td>
</body>
</html>
