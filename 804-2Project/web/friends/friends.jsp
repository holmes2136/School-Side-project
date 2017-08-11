<%@page contentType="text/html"import="Friends.*,java.util.*"%>
<%@page pageEncoding="UTF-8"%>


<%!
    String css = "../blog.css";
%>
<%
String address = request.getParameter("friend_id");
if(address!=null){
    response.sendRedirect(address);
    
}
%>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>好友列表</title>
        <style type="text/css">
            <!--
body {
	background-color: #999999;
        margin-left: 0px;
	margin-top: 0px;
	margin-right: 0px;
	margin-bottom: 0px;
}
.style5 {font-size: 36px; font-weight: bold; }
            -->
        </style>
        <script src="Scripts/AC_RunActiveContent.js" type="text/javascript"></script>
        <script language="JavaScript">
    <!--
    function Jumping(){
        document.friends.submit();
        return;
       
    }
   
 -->  
        </script>
        
        <link href="<%=css%>" rel="stylesheet" type="text/css"/>
    </head>
    <iframe src="http://localhost:8084/731Project/TopFunction.jsp" height="40" width="1024" scrolling="no" marginheight="0" marginwidth="0" frameborder="0"></iframe>
    <body background="../image/bg_minidots.gif">
        <table width="105%" height="540" class="tableline">
            <tr>
                
                
            </tr>
            <tr>
                <td height="120" colspan="3" valign="top">&nbsp;</td>
            </tr>
            <tr>
                <td width="21%" rowspan="2" valign="top" bordercolor="1"><div><img src="http://localhost:8084/Project/image/pili.jpg" width="150" height="150" /></div>      
                    <p>&nbsp;</p>
                    <div><a href="friendsControl.jsp">好友列表</a></div>      
                <p>&nbsp;</p></td>
                <td width="14%" height="36" valign="top" bordercolor="1"><span class="style5">Account</span></td>
                <td width="65%" valign="top" bordercolor="1"><span class="style5">的好友列表</span></td>
            </tr>
            <tr>
                <td colspan="2" valign="top"><ul>
                        <li><a href="http://localhost:8084/731Project/index.jsp">首頁</a></li>
                        <li>相簿</li>
                        <li>照片上傳</li>
                        <li><a href="friends.jsp">好友</a></li>
                    </ul>
                    <div>
                        <form action="friends.jsp" method="post" name="friends">
                            <select name="friend_id" id="friend_id" onchange="Jumping()">
                                <option value="">好友列表</option>
                                <%
                                FriendsControl control = new FriendsControl();
                                Collection ret = control.getAllFriends();
                                Iterator it = ret.iterator();
                                while(it.hasNext()){
                                FriendsVO friends = (FriendsVO)it.next();
                                %>     
                                <option value="<%=friends.getAddress()%>"><%=friends.getName()%></option> 
                                
                                <%}%>
                            </select>
                        </form>
                    </div>
                <p>&nbsp;</p></td>
            </tr>
        </table>
    </body>
</html>
