

import java.io.*;
import java.net.*;

import javax.servlet.*;
import javax.servlet.http.*;
import java.sql.*;
import Sql.sql;
import java.util.*;

public class setDefaultLocation extends HttpServlet {
    
    
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        
        out.close();
    }
    
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
        String x = request.getParameter("x");
        String y = request.getParameter("y");
        sql sql = new sql();
        try{
            Connection conn = sql.getConnection();
            PreparedStatement pstmt = conn.prepareStatement("update member set x=?,y=? where username=test");
            pstmt.setString(1,x);
            pstmt.setString(2,y);
            pstmt.execute();
        } catch(Exception e){}
        
        StringBuffer xml = new StringBuffer();
        xml.append("<result>");
        xml.append("<result>");
        xml.append("新增成功");
        xml.append("</result>");
        xml.append("</result>");
        response.setCharacterEncoding("UTF8");
        response.setContentType("text/xml");
        response.getWriter().write(xml.toString());
        response.getWriter().close();
        
        processRequest(request, response);
    }
    
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
        processRequest(request, response);
    }
    
    
    public String getServletInfo() {
        return "Short description";
    }
    
}
