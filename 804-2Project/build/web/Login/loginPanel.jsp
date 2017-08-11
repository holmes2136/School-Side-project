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
        <table align="right" class="tableline" cellpadding="5" cellspacing="0">
            <form id="form1" name="form1" method="post" action="login.action" class="tableline"  target="_parent">
                <tr>
                    <td><a href="<%=url%>index.jsp" target="_parent">首頁</a></td>
                    <td>|</td>
                    <td colspan="4"><a href="<%=url%>register/register.html" target="_parent">註冊</a></td>
                    <td>|</td>
                    <td colspan="4"><a href="<%=url%>Board/BoardPanel.jsp"  target="_parent">消息看板</a></td>
                    <td>|</td>
                    <td colspan="4"><a href="<%=url%>upload/photoUpload.jsp"  target="_parent">上傳</a></td>
                    <td>|</td>
                    <td colspan="4"><a href="<%=url%>album/album.jsp"  target="_parent">相簿</a></td>
                    <td>|</td>
                     <td colspan="4"><a href="<%=url%>googleMap.jsp/"  target="_parent">地圖日記</a></td>
                     <td>|</td>
                    <td>帳號:</td><td> <input name="username" type="text" id="textfield" size="10"/></td>
                    <td>|</td>
                    <td>密碼:</td><td> <input name="password" type="text" id="textfield" size="10"/></td>
                    <td>|</td>
                    <td><input name="submit" type="submit" id="textfield" size="10" value="登入"/></td>
                    
                   
                </tr>
                
                
            </form>
        </table>
    </body>
</html>
