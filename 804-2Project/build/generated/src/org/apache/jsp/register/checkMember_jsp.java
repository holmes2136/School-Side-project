package org.apache.jsp.register;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import java.util.*;
import Control.*;

public final class checkMember_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {


    String css = "../blog.css";

  private static java.util.List _jspx_dependants;

  public Object getDependants() {
    return _jspx_dependants;
  }

  public void _jspService(HttpServletRequest request, HttpServletResponse response)
        throws java.io.IOException, ServletException {

    JspFactory _jspxFactory = null;
    PageContext pageContext = null;
    HttpSession session = null;
    ServletContext application = null;
    ServletConfig config = null;
    JspWriter out = null;
    Object page = this;
    JspWriter _jspx_out = null;
    PageContext _jspx_page_context = null;


    try {
      _jspxFactory = JspFactory.getDefaultFactory();
      response.setContentType("text/html;charset=UTF-8");
      pageContext = _jspxFactory.getPageContext(this, request, response,
      			null, true, 8192, true);
      _jspx_page_context = pageContext;
      application = pageContext.getServletContext();
      config = pageContext.getServletConfig();
      session = pageContext.getSession();
      out = pageContext.getOut();
      _jspx_out = out;

      out.write('\n');
      out.write('\n');
      out.write('\n');
      out.write("\n");
      out.write("<html>\n");
      out.write("    <head>\n");
      out.write("        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n");
      out.write("        <title>會員資料</title>\n");
      out.write("        \n");
      out.write("         <link href=\"");
      out.print(css);
      out.write("\" rel=\"stylesheet\" type=\"text/css\" />\n");
      out.write("         \n");
      out.write("         <style type=\"text/css\">\n");
      out.write("            <!--\n");
      out.write("body {\n");
      out.write("\tmargin-left: 0px;\n");
      out.write("\tmargin-top: 0px;\n");
      out.write("\tmargin-right: 0px;\n");
      out.write("\tmargin-bottom: 0px;\n");
      out.write("}\n");
      out.write("            -->\n");
      out.write("        </style>\n");
      out.write("        <iframe src=\"http://localhost:8084/731Project/TopFunction.jsp\" height=\"40\" width=\"1024\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\" frameborder=\"0\"></iframe>\n");
      out.write("    </head>\n");
      out.write("    <body background=\"../image/bg_minidots.gif\"\">\n");
      out.write("\n");
      out.write("<center>\n");
      out.write("    <table class=\"tableline\" cellpadding=\"5\" cellspacing=\"0\">\n");
      out.write("        <tr><td>會員ID</td><td>會員帳號</td><td>會員密碼</td><td>性別</td><td>email</td><td>身分證</td></tr>\n");
      out.write("   ");

            Register register = new Register();
            Collection ret = register.getTestMember();
            Iterator it = ret.iterator();
            while(it.hasNext()){
                User user = (User)it.next();
                out.println("<tr>");
                out.println( "<td>"+user.getId()+"</td>");
                out.println( "<td>"+user.getUsername()+"</td>");
                out.println( "<td>"+user.getPassword()+"</td>");
                out.println("<td>"+user.getSex()+"</td>");
                out.println("<td>"+user.getEmail()+"</td>");
                out.println( "<td>"+user.getIDcard()+"</td>");
                out.println("</tr>");
                }
                
    
      out.write(" \n");
      out.write("    </table>\n");
      out.write("          \n");
      out.write("                    \n");
      out.write("                   \n");
      out.write("                   \n");
      out.write("                    \n");
      out.write("                    \n");
      out.write("                   \n");
      out.write("                    \n");
      out.write("             \n");
      out.write("    \n");
      out.write("   \n");
      out.write("    \n");
      out.write("           \n");
      out.write("     \n");
      out.write("    </center>\n");
      out.write("    </body>\n");
      out.write("</html>\n");
    } catch (Throwable t) {
      if (!(t instanceof SkipPageException)){
        out = _jspx_out;
        if (out != null && out.getBufferSize() != 0)
          out.clearBuffer();
        if (_jspx_page_context != null) _jspx_page_context.handlePageException(t);
      }
    } finally {
      if (_jspxFactory != null) _jspxFactory.releasePageContext(_jspx_page_context);
    }
  }
}
