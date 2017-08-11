

package login;
import java.io.IOException;
import java.util.*;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class Invoker {
    private Map actions;
    private String defaultPage;
   
    public Invoker() {
        actions = new HashMap();
    }
    
    public void addCommand(String actionName,IAction action){
        actions.put(actionName,action);
    }
    
    public void request(HttpServletRequest req,HttpServletResponse res)throws ServletException,IOException{
        IAction action = (IAction)actions.get(req.getServletPath());
        if(action!=null){
            action.execute(req,res);
        }
        else{
            RequestDispatcher dispatcher = req.getRequestDispatcher(defaultPage);
            dispatcher.forward(req,res);
        }
    }

    public String getDefaultPage() {
        return defaultPage;
    }

    public void setDefaultPage(String defaultPage) {
        this.defaultPage = defaultPage;
    }
    
    
    
}
