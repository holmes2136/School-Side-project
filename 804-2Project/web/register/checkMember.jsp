<%@page contentType="text/html"import="java.util.*,Control.*"%>
<%@page pageEncoding="UTF-8"%>

<%!
    String css = "../blog.css";
%>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>會員資料</title>
        
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
        <iframe src="http://localhost:8084/731Project/TopFunction.jsp" height="40" width="1024" scrolling="no" marginheight="0" marginwidth="0" frameborder="0"></iframe>
    </head>
    <body background="../image/bg_minidots.gif"">

<center>
    <table class="tableline" cellpadding="5" cellspacing="0">
        <tr><td>會員ID</td><td>會員帳號</td><td>會員密碼</td><td>性別</td><td>email</td><td>身分證</td></tr>
   <%
            Register register = new Register();
            Collection ret = register.getTestMember();
            Iterator it = ret.iterator();
            while(it.hasNext()){
                User user = (User)it.next();
                out.println("<tr>");
                out.println( "<td>"+user.getId()+"</td>");
                out.println( "<td>"+user.getUsername()+"</td>");
                out.println( "<td>"+user.getPassword()+"</td>");
                out.println("<td>"+user.getSex()+"</td>");
                out.println("<td>"+user.getEmail()+"</td>");
                out.println( "<td>"+user.getIDcard()+"</td>");
                out.println("</tr>");
                }
                
    %> 
    </table>
          
                    
                   
                   
                    
                    
                   
                    
             
    
   
    
           
     
    </center>
    </body>
</html>
