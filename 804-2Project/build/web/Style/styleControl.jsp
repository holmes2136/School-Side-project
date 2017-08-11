<%@page contentType="text/html"%>
<%@page pageEncoding="UTF-8"%>


<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
        
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
        
        <script language="JavaScript">
           function sucessful(){
                alert("Change Sucessfully");
           }
        </script>
         
        <link href="../blog.css" rel="stylesheet" type="text/css" />
    </head>
    
    <iframe src="http://localhost:8084/731Project/TopFunction.jsp" height="40" width="1024" scrolling="no" marginheight="0" marginwidth="0" frameborder="0"></iframe>
    <body background="../image/bg_paper_mid.jpg">
        <center>
            <form action="styleChange.jsp" method="post">
                <table class="tableline">
                    <tr><td><input type="radio" name="style" value="blog.css"/></td><td>預設樣式</td><td><td><a href="previewStyle.jsp?style=blog.css" target="_blank">預覽</a></td></tr>
                    <tr><td><input type="radio" name="style" value="blog1.css"/></td><td>樣式一</td><td><td><a href="previewStyle.jsp?style=blog1.css" target="_blank">預覽</a></td></tr>
                    <tr><td><input type="radio" name="style" value="blog2.css"/></td><td>樣式二</td><td><td><a href="previewStyle.jsp?style=blog2.css" target="_blank">預覽</a></td></tr>
                    <tr><td><input type=submit value="送出" onclick="sucessful()"></td></tr>
                </table>
            </form>
        </center>
        
        
    </body>
</html>
