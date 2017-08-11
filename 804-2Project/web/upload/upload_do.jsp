<%@page contentType="text/html" import="com.oreilly.servlet.*,java.io.*,Control.*"%>
<%@page pageEncoding="UTF-8"%>

<%!
String FileName = null;
String ContentType = null;
int maxPostSize = 1000 * 1024 * 1024 ;
String enCoding = "utf-8";
String path = "C://workSpace//804-2Project//web//images";
%>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
        
       
    </head>
    <body>
        
        <%
        String username = "";
        if(session.getAttribute("username")!=null){
        username = (String)session.getAttribute("username");
        }
      
        MultipartRequest multi = new MultipartRequest(request , path, maxPostSize, enCoding);
        
        Register updateUserInfo = new Register();
        User user = new User();
        
        String name = multi.getFilesystemName("file");
        user.setPhoto(name);
        user.setUsername(username);
       
        updateUserInfo.updatePhoto(user);
        
        File file = new File(path+name);
        
        
        if(!file.exists()){
            
            out.println("");
        } else{
            
            out.println("<img width=100 height=200  src=../images/"+name+">");
        }
        
        
        %> 
        
        
        
        
        
        
    </body>
</html>
