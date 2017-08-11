<%@page contentType="text/html" import="com.oreilly.servlet.*,java.io.*,Upload.*,Image.*"%>
<%@page pageEncoding="UTF-8"%>


<%!
String FileName = null;
String ContentType = null;
int maxPostSize = 1000 * 1024 * 1024 ;
String enCoding = "utf-8";
String path = "C://workSpace//804-2Project//web//images//";
%>


<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
    </head>
    <body background="../image/bg_minidots.gif">
        <center>
            <%
            String check = request.getParameter("filename");
            Control control = new Control();
            if(check!=null){
                MultipartRequest multi = new MultipartRequest(request , path, maxPostSize, enCoding);
                String name = multi.getFilesystemName("filename");
                out.println("<img name=showing width=150 height=80 src=../images/"+name+">");
                
                
                ImageVO img = new ImageVO();
                ImageControl imgControl = new ImageControl();
                img.setPath("images/");
                img.setName(name);
                imgControl.addImg(img);
                
            } 
            %>
            
        </center>
    </body>
</html>
