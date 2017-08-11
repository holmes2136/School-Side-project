package org.apache.jsp.FunctionList;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import Control.*;
import java.util.*;

public final class updateTopic_jsp extends org.apache.jasper.runtime.HttpJspBase
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
      out.write('\n');
  //功能列pencial(1)
    Control control = new Control();
    Artical artical = control.getArticalDetail(request.getParameter("titleid"));
    


      out.write("\n");
      out.write("\n");
      out.write("<html>\n");
      out.write("    <head>\n");
      out.write("        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n");
      out.write("        <title>JSP Page</title>\n");
      out.write("        \n");
      out.write("        <link href=\"");
      out.print(css);
      out.write("\" rel=\"stylesheet\" type=\"text/css\" />\n");
      out.write("        \n");
      out.write("        <style type=\"text/css\">\n");
      out.write("            <!--\n");
      out.write("body {\n");
      out.write("\tmargin-left: 0px;\n");
      out.write("\tmargin-top: 0px;\n");
      out.write("\tmargin-right: 0px;\n");
      out.write("\tmargin-bottom: 0px;\n");
      out.write("}\n");
      out.write("            -->\n");
      out.write("        </style>\n");
      out.write("    </head>\n");
      out.write("   <iframe src=\"http://localhost:8084/731Project/TopFunction.jsp\" height=\"40\" width=\"1024\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\" frameborder=\"0\"></iframe>\n");
      out.write("    <body background=\"../image/bg_paper_mid.jpg\">\n");
      out.write("        <center>\n");
      out.write("            <form action=\"updateTopic_do.jsp\" method=\"post\">\n");
      out.write("                <table class=\"tableline\" cellpadding=\"5\" cellspacing=\"0\">\n");
      out.write("                    <tr>\n");
      out.write("                        <td>標題</td>\n");
      out.write("                        <td><input type=\"text\" name=\"title\" value=\"");
      out.print(artical.getTitle());
      out.write("\"></td>\n");
      out.write("                    </tr>\n");
      out.write("                    <tr>\n");
      out.write("                        <td>內容</td>\n");
      out.write("                        <td><textarea cols=\"40\" name=\"content\" rows=\"10\">");
      out.print(artical.getContent());
      out.write("</textarea></td>\n");
      out.write("                    </tr>\n");
      out.write("                    \n");
      out.write("                    <tr>\n");
      out.write("                        <table>\n");
      out.write("                       \n");
      out.write("                        <select name=\"category\">\n");
      out.write("                            <option value=\"\">");
      out.print(artical.getCategory());
      out.write("</option>\n");
      out.write("                        ");

                            Collection ret = control.getAllCategory();
                            Iterator it = ret.iterator();
                            while(it.hasNext()){
                               Category category = (Category)it.next();
                        
      out.write("     \n");
      out.write("                          <option value=\"");
      out.print(category.getCatid());
      out.write('"');
      out.write('>');
      out.print(category.getCatid());
      out.write("</option>\n");
      out.write("                          \n");
      out.write("                        ");
}
      out.write("   \n");
      out.write("                        </select>\n");
      out.write("                        </table>\n");
      out.write("                    </tr>\n");
      out.write("                    <tr>\n");
      out.write("                        <input type=\"hidden\" name=\"titleid\" value=\"");
      out.print(artical.getTitleid());
      out.write("\">\n");
      out.write("                        <td><input type=\"submit\" value=\"送出\"></td>\n");
      out.write("                    </tr>\n");
      out.write("                    \n");
      out.write("                </table>\n");
      out.write("                \n");
      out.write("            </form>\n");
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
