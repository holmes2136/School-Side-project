package org.apache.jsp.friends;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import java.util.*;
import Friends.*;

public final class friendsControl_jsp extends org.apache.jasper.runtime.HttpJspBase
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

      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("<script language=\"JavaScript\">\n");
      out.write("    <!--\n");
      out.write("function check() {\n");
      out.write("        var n = 0; \n");
      out.write("    for (var i=0;i<document.f1.friends.length;i++) { \n");
      out.write("            var e = document.f1.friends[i]; \n");
      out.write("        if (e.type == 'checkbox' && e.checked == true) \n");
      out.write("                n++; \n");
      out.write("        }\n");
      out.write("        if (n > 0){\n");
      out.write("            alert(\"Are you sure delete\");\n");
      out.write("        }\n");
      out.write("       \n");
      out.write("        else {\n");
      out.write("                alert(\"At least choose one\");\n");
      out.write("                document.location(\"friendsControl.jsp\");\n");
      out.write("                return false;\n");
      out.write("        }\n");
      out.write("} \n");
      out.write("\n");
      out.write("-->\n");
      out.write("</script>\n");
      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("<html>\n");
      out.write("    <head>\n");
      out.write("        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n");
      out.write("        <title>JSP Page</title>\n");
      out.write("        \n");
      out.write("         <link href=\"");
      out.print(css);
      out.write("\" rel=\"stylesheet\" type=\"text/css\" />\n");
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
      out.write("        \n");
      out.write("    </head>\n");
      out.write("    <iframe src=\"http://localhost:8084/731Project/TopFunction.jsp\" height=\"40\" width=\"1024\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\" frameborder=\"0\"></iframe>\n");
      out.write("    \n");
      out.write("    <body background=\"../image/bg_minidots.gif\"\">\n");
      out.write("    <center>\n");
      out.write("        <table class=\"tablelclassine\">\n");
      out.write("            <tr>\n");
      out.write("                <td><a href=\"addFriends.jsp\">新增好友</a></td>\n");
      out.write("            </tr>\n");
      out.write("            \n");
      out.write("        </table>\n");
      out.write("        <form action=\"deleteFriends.jsp\" method=\"post\" name=\"f1\">\n");
      out.write("            <table class=\"tableline\" cellpadding=\"5\">\n");
      out.write("               \n");
      out.write("                ");

                FriendsControl friends = new FriendsControl();
                Collection ret = friends.getAllFriends();
                Iterator it = ret.iterator();
                while(it.hasNext()){
                    FriendsVO friends1 = (FriendsVO)it.next();
                
      out.write("        \n");
      out.write("                \n");
      out.write("                <tr>\n");
      out.write("                    <td><input type=\"checkbox\" name=\"friends\" value=\"");
      out.print(friends1.getId());
      out.write("\"></td>\n");
      out.write("                    <td>");
      out.print(friends1.getId());
      out.write("</td>\n");
      out.write("                    <td>");
      out.print(friends1.getName());
      out.write("</td>\n");
      out.write("                    <td align=\"right\">");
      out.print(friends1.getAddress());
      out.write("</td>\n");
      out.write("                </tr>\n");
      out.write("                \n");
      out.write("                \n");
      out.write("                ");
}
      out.write("\n");
      out.write("            </table>\n");
      out.write("            <input type=\"submit\" value=\"刪除\"  onclick=\"check()\">\n");
      out.write("        </form>\n");
      out.write("        </center>\n");
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
