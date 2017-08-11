<%@page contentType="text/html"import="Control.*,java.util.*"%>
<%@page pageEncoding="UTF-8"%>


<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
    </head>
    <body>
        <%
        request.setCharacterEncoding("utf-8");
        Enumeration param = (Enumeration)request.getParameterNames();//取得String物件
        
        
        %>
        
        <%
        String[] parameter = new String[4];
        while(param.hasMoreElements()){
            
            parameter[0] = (String)param.nextElement();//title物件
            parameter[1] = (String)param.nextElement();//content物件
            parameter[2] =(String)param.nextElement();//time物件
            parameter[3] = (String)param.nextElement();//category物件
            
        }
        String content = request.getParameter(parameter[0]);
        String category = request.getParameter(parameter[1]);
        String time = request.getParameter(parameter[2]);
        String title = request.getParameter(parameter[3]);
        
        
        Control control = new Control();
        Artical artical = new Artical();
        artical.setTitle(title);
        artical.setContent(content);
        artical.setTime(time);
        artical.setCategory(category);
        control.addNewTopic(artical);
        response.sendRedirect("http://localhost:8084/731Project/index.jsp");
        %>
        
        
        
    </body>
</html>
