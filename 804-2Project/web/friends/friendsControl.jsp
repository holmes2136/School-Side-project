<%@page contentType="text/html"import="java.util.*,Friends.*"%>
<%@page pageEncoding="UTF-8"%>


<%!
    String css = "../blog.css";
%>
<script language="JavaScript">
    <!--
function check() {
        var n = 0; 
    for (var i=0;i<document.f1.friends.length;i++) { 
            var e = document.f1.friends[i]; 
        if (e.type == 'checkbox' && e.checked == true) 
                n++; 
        }
        if (n > 0){
            alert("Are you sure delete");
        }
       
        else {
                alert("At least choose one");
                document.location("friendsControl.jsp");
                return false;
        }
} 

-->
</script>



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
    
    <body background="../image/bg_minidots.gif"">
    <center>
        <table class="tablelclassine">
            <tr>
                <td><a href="addFriends.jsp">新增好友</a></td>
            </tr>
            
        </table>
        <form action="deleteFriends.jsp" method="post" name="f1">
            <table class="tableline" cellpadding="5">
               
                <%
                FriendsControl friends = new FriendsControl();
                Collection ret = friends.getAllFriends();
                Iterator it = ret.iterator();
                while(it.hasNext()){
                    FriendsVO friends1 = (FriendsVO)it.next();
                %>        
                
                <tr>
                    <td><input type="checkbox" name="friends" value="<%=friends1.getId()%>"></td>
                    <td><%=friends1.getId()%></td>
                    <td><%=friends1.getName()%></td>
                    <td align="right"><%=friends1.getAddress()%></td>
                </tr>
                
                
                <%}%>
            </table>
            <input type="submit" value="刪除"  onclick="check()">
        </form>
        </center>
    </body>
</html>
