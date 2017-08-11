<%@page contentType="text/html" import="java.sql.*,Sql.*"%>
<%@page pageEncoding="UTF-8"%>


<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
    </head>
    <body>
        <%
        
        sql sql = new sql();
        Connection conn = sql.getConnection();
        try{
            String x = request.getParameter("x");
            String y = request.getParameter("y");
            PreparedStatement pstmt = conn.prepareStatement("UPDATE member SET x=?,y=? where username=?");
            pstmt.setString(1,x);
            pstmt.setString(2,y);
            pstmt.setString(3,"test");
            pstmt.execute();
        } catch(Exception e){}
        StringBuffer xml = new StringBuffer();
        xml.append("<results>");
        xml.append("<result>");
        xml.append("新增成功");
        xml.append("</result>");
        xml.append("</results>");
        response.setCharacterEncoding("UTF8");
        response.setContentType("text/xml");
        response.getWriter().write(xml.toString());
        response.getWriter().close();
        
        %>
        
        
        
        
    </body>
</html>
