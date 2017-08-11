package org.apache.jsp.Login;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class loginPanel_jsp extends org.apache.jasper.runtime.HttpJspBase
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

      out.write('\n');
      out.write('\n');
      out.write('\n');

    String url = "http://holmes2136.no-ip.org:8084/731Project/";

      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("<html>\n");
      out.write("    <head>\n");
      out.write("        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n");
      out.write("        <title>JSP Page</title>\n");
      out.write("        \n");
      out.write("        \n");
      out.write("        \n");
      out.write("        \n");
      out.write("        \n");
      out.write("        \n");
      out.write("    </head>\n");
      out.write("    <body>\n");
      out.write("        <table align=\"right\" class=\"tableline\" cellpadding=\"5\" cellspacing=\"0\">\n");
      out.write("            <form id=\"form1\" name=\"form1\" method=\"post\" action=\"login.action\" class=\"tableline\"  target=\"_parent\">\n");
      out.write("                <tr>\n");
      out.write("                    <td><a href=\"");
      out.print(url);
      out.write("index.jsp\" target=\"_parent\">首頁</a></td>\n");
      out.write("                    <td>|</td>\n");
      out.write("                    <td colspan=\"4\"><a href=\"");
      out.print(url);
      out.write("register/register.html\" target=\"_parent\">註冊</a></td>\n");
      out.write("                    <td>|</td>\n");
      out.write("                    <td colspan=\"4\"><a href=\"");
      out.print(url);
      out.write("Board/BoardPanel.jsp\"  target=\"_parent\">消息看板</a></td>\n");
      out.write("                    <td>|</td>\n");
      out.write("                    <td colspan=\"4\"><a href=\"");
      out.print(url);
      out.write("upload/photoUpload.jsp\"  target=\"_parent\">上傳</a></td>\n");
      out.write("                    <td>|</td>\n");
      out.write("                    <td colspan=\"4\"><a href=\"");
      out.print(url);
      out.write("album/album.jsp\"  target=\"_parent\">相簿</a></td>\n");
      out.write("                    <td>|</td>\n");
      out.write("                     <td colspan=\"4\"><a href=\"");
      out.print(url);
      out.write("googleMap.jsp\"  target=\"_parent\">地圖日記</a></td>\n");
      out.write("                     <td>|</td>\n");
      out.write("                    <td>帳號:</td><td> <input name=\"username\" type=\"text\" id=\"textfield\" size=\"10\"/></td>\n");
      out.write("                    <td>|</td>\n");
      out.write("                    <td>密碼:</td><td> <input name=\"password\" type=\"text\" id=\"textfield\" size=\"10\"/></td>\n");
      out.write("                    <td>|</td>\n");
      out.write("                    <td><input name=\"submit\" type=\"submit\" id=\"textfield\" size=\"10\" value=\"登入\"/></td>\n");
      out.write("                    \n");
      out.write("                   \n");
      out.write("                </tr>\n");
      out.write("                \n");
      out.write("                \n");
      out.write("            </form>\n");
      out.write("        </table>\n");
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
