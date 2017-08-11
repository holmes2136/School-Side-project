

package login;

import java.io.*;
import java.net.*;

import javax.servlet.*;
import javax.servlet.http.*;


public class DispatcherServlet extends HttpServlet {
    private Invoker invoker;
    
    public void init(){
        invoker = new Invoker();
        invoker.addCommand("/welcome.action",new WelcomeAction());
        invoker.addCommand("/login.action",new LoginAction());
        invoker.setDefaultPage("/welcome.action");
    }
  
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
       
        out.close();
    }
    
    
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
    throws ServletException, IOException {
        doPost(req,res);
        processRequest(req, res);
    }
    
    
    protected void doPost(HttpServletRequest req, HttpServletResponse res)
    throws ServletException, IOException {
        invoker.request(req,res);
        processRequest(req, res);
    }
    
    public String getServletInfo() {
        return "Short description";
    }
   
}
