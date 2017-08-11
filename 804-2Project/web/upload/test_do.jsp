<%@page contentType="text/html" import="Upload.Control"%>
<%@page pageEncoding="UTF-8"%>

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title></title>
        
        
    </head>
    </head>
    <body>
        <%
        String path = "C://workSpace//804-2Project//web//images";
        String filename = request.getParameter("filename");
        
        Control control = new Control();
        if((path!=null)||(filename!=null)) {
            String result = control.FileExist(path+filename);
            out.println(result);
           
        } else{
            out.println("please choose Picture");
        }                                                                                                                                                                        
        
        
        %>
        
        <form action="test_do.jsp" method="get" name="shift3" id="shift3">
            <input type="hidden" name="filename" value="">
            
        </form>
        
        
        
    </body>
</html>
