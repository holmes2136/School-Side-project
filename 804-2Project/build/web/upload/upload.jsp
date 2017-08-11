<%@page contentType="text/html" import="com.oreilly.servlet.*"%>
<%@page pageEncoding="UTF-8"%>


<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
        
       
    </head>
    <body>
        <form action="upload_do.jsp" method="post" enctype="multipart/form-data">
            <input type=file name="file">
            <input type=submit value="上傳">
        </form>
        
    </body>
</html>
