package org.apache.jsp.Style;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class styleControl_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

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
      out.write("<html>\n");
      out.write("    <head>\n");
      out.write("        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n");
      out.write("        <title>JSP Page</title>\n");
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
      out.write("        \n");
      out.write("        <script language=\"JavaScript\">\n");
      out.write("           function sucessful(){\n");
      out.write("                alert(\"Change Sucessfully\");\n");
      out.write("           }\n");
      out.write("        </script>\n");
      out.write("         \n");
      out.write("        <link href=\"../blog.css\" rel=\"stylesheet\" type=\"text/css\" />\n");
      out.write("    </head>\n");
      out.write("    \n");
      out.write("    <iframe src=\"http://localhost:8084/731Project/TopFunction.jsp\" height=\"40\" width=\"1024\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\" frameborder=\"0\"></iframe>\n");
      out.write("    <body background=\"../image/bg_paper_mid.jpg\">\n");
      out.write("        <center>\n");
      out.write("            <form action=\"styleChange.jsp\" method=\"post\">\n");
      out.write("                <table class=\"tableline\">\n");
      out.write("                    <tr><td><input type=\"radio\" name=\"style\" value=\"blog.css\"/></td><td>預設樣式</td><td><td><a href=\"previewStyle.jsp?style=blog.css\" target=\"_blank\">預覽</a></td></tr>\n");
      out.write("                    <tr><td><input type=\"radio\" name=\"style\" value=\"blog1.css\"/></td><td>樣式一</td><td><td><a href=\"previewStyle.jsp?style=blog1.css\" target=\"_blank\">預覽</a></td></tr>\n");
      out.write("                    <tr><td><input type=\"radio\" name=\"style\" value=\"blog2.css\"/></td><td>樣式二</td><td><td><a href=\"previewStyle.jsp?style=blog2.css\" target=\"_blank\">預覽</a></td></tr>\n");
      out.write("                    <tr><td><input type=submit value=\"送出\" onclick=\"sucessful()\"></td></tr>\n");
      out.write("                </table>\n");
      out.write("            </form>\n");
      out.write("        </center>\n");
      out.write("        \n");
      out.write("        \n");
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
