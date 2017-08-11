package org.apache.jsp.Category;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import Control.*;
import java.util.*;

public final class CategoryControl_jsp extends org.apache.jasper.runtime.HttpJspBase
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
      out.write("<head>\n");
      out.write("    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n");
      out.write("    <title>JSP Page</title>\n");
      out.write("    \n");
      out.write("    <link href=\"../blog.css\" rel=\"stylesheet\" type=\"text/css\" />\n");
      out.write("    \n");
      out.write("    <style type=\"text/css\">\n");
      out.write("        <!--\n");
      out.write("body {\n");
      out.write("\tmargin-left: 0px;\n");
      out.write("\tmargin-top: 0px;\n");
      out.write("\tmargin-right: 0px;\n");
      out.write("\tmargin-bottom: 0px;\n");
      out.write("}\n");
      out.write("            -->\n");
      out.write("    </style>\n");
      out.write("    \n");
      out.write("</head>\n");
      out.write("\n");
      out.write("<iframe src=\"http://localhost:8084/731Project/TopFunction.jsp\" height=\"40\" width=\"1024\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\" frameborder=\"0\"></iframe>\n");
      out.write("<body background=\"../image/bg_minidots.gif\">\n");
      out.write("<center>\n");
      out.write("<form action=\"deleteCategory.jsp\" method=\"post\">\n");
      out.write("<table width=\"500\" class=\"tableline\">\n");
      out.write("<tr >\n");
      out.write("    <td>刪除</td>\n");
      out.write("    <td>分類名稱</td>\n");
      out.write("    <td>分類描述</td>\n");
      out.write("    <td><a href=\"addCategory.jsp\">新增分類</td>\n");
      out.write("    \n");
      out.write("</tr>\n");

Control control = new Control();
Collection ret = control.getAllCategory();
Iterator it = ret.iterator();
while(it.hasNext()){
    Category category = (Category)it.next();

      out.write("         \n");
      out.write("<tr>\n");
      out.write("    <td><input type=\"checkbox\" name=\"category\" value=\"");
      out.print(category.getCatid());
      out.write("\"></td>\n");
      out.write("    <td>");
      out.print(category.getCatid());
      out.write("</td>\n");
      out.write("    <td>");
      out.print(category.getDescn());
      out.write("</t<td>\n");
      out.write("    \n");
      out.write("</tr>\n");
      out.write("\n");
      out.write("\n");
}
      out.write("\n");
      out.write("<tr><td><input type=\"submit\" value=\"送出\"></td></tr>\n");
      out.write("</table> \n");
      out.write("\n");
      out.write("</form>\n");
      out.write("</center>\n");
      out.write("\n");
      out.write("</body>\n");
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
