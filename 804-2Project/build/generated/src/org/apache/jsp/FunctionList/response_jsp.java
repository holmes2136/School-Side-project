package org.apache.jsp.FunctionList;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import java.util.*;
import Control.*;
import java.text.*;

public final class response_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {


    String css = "../blog.css";

//功能列回應(1)
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:MM:SS");
        Calendar now = Calendar.getInstance();
        String date = sdf.format(now.getTime());


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
      out.write('\n');

    Control control = new Control();
    Artical artical = control.getArticalDetail(request.getParameter("titleid"));


      out.write("\n");
      out.write("\n");
      out.write("<html>\n");
      out.write("    <head>\n");
      out.write("        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n");
      out.write("        <title>JSP Page</title>\n");
      out.write("        <link href=\"");
      out.print(css);
      out.write("\" rel=\"stylesheet\" type=\"text/css\"/>\n");
      out.write("        \n");
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
      out.write("    </head>\n");
      out.write("    <body background=\"../image/bg_minidots.gif\"\">\n");
      out.write("        <center>\n");
      out.write("<div id=\"replyForm\">\n");
      out.write("  <form  name=\"artical\" method=\"post\" action=\"reply_do.jsp\">\n");
      out.write("    <table width=\"743\" class=\"tableline\">\n");
      out.write("      <tr>\n");
      out.write("        <td width=\"58\" align=\"center\" valign=\"middle\">標題</td>\n");
      out.write("        <td width=\"673\"><input type=\"text\" name=\"title\" value=\"RE:");
      out.print(artical.getTitle());
      out.write("\"/>\n");
      out.write("        </td>\n");
      out.write("      </tr>\n");
      out.write("      <tr>\n");
      out.write("        <td align=\"center\" valign=\"middle\">內容</td>\n");
      out.write("        <td><textarea  name=\"content\" cols=\"45\" rows=\"5\">");
      out.print(artical.getContent());
      out.write("</textarea></td>\n");
      out.write("      </tr>\n");
      out.write("      <tr>\n");
      out.write("        <td align=\"center\" valign=\"middle\">回覆時間</td>\n");
      out.write("        <td><input type=\"text\" name=\"time\"  value=\"");
      out.print(date);
      out.write("\" /></td>\n");
      out.write("      </tr>\n");
      out.write("      <tr>\n");
      out.write("        <td align=\"center\" valign=\"middle\">暱稱</td>\n");
      out.write("        <td><input type=\"text\" name=\"author\"/></td>\n");
      out.write("      </tr>\n");
      out.write("      <tr>\n");
      out.write("        <td colspan=\"2\" align=\"center\" valign=\"middle\"><label>\n");
      out.write("          <input type=\"submit\" name=\"button\"  value=\"送出\" />\n");
      out.write("          <input type=\"hidden\" name=\"replyid\" value=\"");
      out.print(artical.getTitleid());
      out.write("\">\n");
      out.write("        </label></td>\n");
      out.write("      </tr>\n");
      out.write("    </table>\n");
      out.write("    </form>\n");
      out.write("    </center>\n");
      out.write("</div>\n");
      out.write("   \n");
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
