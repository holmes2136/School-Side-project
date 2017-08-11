<%@page contentType="text/html"%>
<%@page pageEncoding="UTF-8"%>

<%!
    String css = "../blog.css";
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
    <body background="../image/bg_minidots.gif">
        <center>
            <form action="addCategory_do.jsp" method="post" name="category">
                <table class="tableline">
                    
                    <tr>
                        <td>分類名稱</td>
                        <td><input type="text" name="name"></td>
                        
                    </tr> 
                    <tr>
                        <td>分類描述</td>
                        <td><input type="text" name="descn"></td>
                        
                    </tr> 
                    <tr>
                        <td><input type="submit" value="送出" onclick="value"></td>
                        
                    </tr> 
                </table>
            </form>
        </center>  
        
        
    </body>
</html>
