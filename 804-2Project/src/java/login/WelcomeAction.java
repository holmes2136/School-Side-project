

package login;

import java.io.IOException;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class WelcomeAction implements IAction{
  
    public WelcomeAction() {
    }

    public void execute(HttpServletRequest req, HttpServletResponse res) {
        RequestDispatcher dispatcher = req.getRequestDispatcher("Login/welcome.jsp");
        try {
            dispatcher.forward(req,res);
        } catch (IOException ex) {
            ex.printStackTrace();
        } catch (ServletException ex) {
            ex.printStackTrace();
        }
        
    }
    
}
