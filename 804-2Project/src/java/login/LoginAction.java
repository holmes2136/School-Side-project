package login;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.ConnectException;
import java.util.*;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.*;
import java.sql.*;
import Sql.*;

public class LoginAction implements IAction {
    sql sql = new sql();
    Connection conn;
    
    public LoginAction() {
        conn = sql.getConnection();
        
    }
    
    public void execute(HttpServletRequest req, HttpServletResponse res){
        
        try {
            req.setCharacterEncoding("utf-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        String username = req.getParameter("username");
        String password = req.getParameter("password");
        RequestDispatcher dispatcher = null;
        
        if(checkMember(username,password)==true){
            HttpSession session = req.getSession();
            session.setAttribute("username",username);
            session.setAttribute("password",password);
            dispatcher = req.getRequestDispatcher("http://holmes2136.no-ip.org:8084/731Project/index.jsp");
        } else {
            
            
            req.setAttribute("fail", "¦WºÙ¡B±K½X¤£²Å");
            dispatcher = req.getRequestDispatcher("Login/errorLogin.html");
            
            
        }
        try {
            dispatcher.forward(req, res);
        } catch (ServletException e) {
        } catch (IOException e) {
        }
        
    }
    
    public boolean checkMember(String username,String password){
        if((username!=null)&&(password!=null)){
            try {
                
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery("select * from member where username='"+username+"'");
                if(!rs.next()){
                    return false;
                } else if(!rs.getString("password").equals(password)){
                    return false;
                }
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        
        }
        return true;
    }
    
}
