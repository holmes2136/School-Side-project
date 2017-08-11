package org.apache.jsp.Login;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class LoginOut_jsp extends org.apache.jasper.runtime.HttpJspBase
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
      out.write("<style type=\"text/css\">\n");
      out.write("    <!--\n");
      out.write("body {\n");
      out.write("\tbackground-image: url(image/blackg.jpg);\n");
      out.write("\tbackground-repeat: no-repeat;\n");
      out.write("\tmargin-left: 100px;\n");
      out.write("\tmargin-top: 50px;\n");
      out.write("\tmargin-right: 100px;\n");
      out.write("\tmargin-bottom: 50px;\n");
      out.write("\tbackground-color: #000000;\n");
      out.write("}\n");
      out.write(".style2 {color: #FFFFFF}\n");
      out.write(".style5 {font-size: 12px}\n");
      out.write("body,td,th {\n");
      out.write("\tcolor: #FFFFFF;\n");
      out.write("}\n");
      out.write("    -->\n");
      out.write("</style>\n");
      out.write("\n");
      out.write("<html xmlns=\"http://www.w3.org/1999/xhtml\">\n");
      out.write("    <head>\n");
      out.write("        \n");
      out.write("        <title>ErrorLogin</title>\n");
      out.write("        \n");
      out.write("        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />\n");
      out.write("        <style type=\"text/css\">\n");
      out.write("            <!--\n");
      out.write("body {\n");
      out.write("\tbackground-image: url(image/blackg.jpg);\n");
      out.write("\tbackground-repeat: no-repeat;\n");
      out.write("\tmargin-left: 100px;\n");
      out.write("\tmargin-top: 50px;\n");
      out.write("\tmargin-right: 100px;\n");
      out.write("\tmargin-bottom: 50px;\n");
      out.write("\tbackground-color: #000000;\n");
      out.write("}\n");
      out.write(".style2 {color: #FFFFFF}\n");
      out.write(".style5 {font-size: 12px}\n");
      out.write("body,td,th {\n");
      out.write("\tcolor: #FFFFFF;\n");
      out.write("}\n");
      out.write("            -->\n");
      out.write("    </style></head>\n");
      out.write("    <body class=\"sub\" dir=\"ltr\" lang=\"af\" xml:lang=\"af\">\n");
      out.write("        \n");
      out.write("        ");

        response.setHeader("Refresh", "3; URL="+url+"index.jsp");
        
        
      out.write("\n");
      out.write("        <table width=\"98%\" border=\"1\">\n");
      out.write("            <tr>\n");
      out.write("                <th scope=\"col\"><div align=\"left\"><span class=\"style5\">黑皮部落格→提醒訊息</span></div></th>\n");
      out.write("            </tr>\n");
      out.write("        </table>\n");
      out.write("        <table width=\"98%\" height=\"228\" bordercolor=\"#000000\" bgcolor=\"#000000\">\n");
      out.write("            <tr>\n");
      out.write("                <th height=\"222\" align=\"center\" bordercolor=\"#353535\" background=\"image/blackg-2.jpg\" \" \"><p align=\"center\">黑皮提醒您</p>\n");
      out.write("                    <p align=\"center\">即將回到首頁</p>\n");
      out.write("                    \n");
      out.write("                <p>&nbsp;</p></th>\n");
      out.write("            </tr>\n");
      out.write("        </table>\n");
      out.write("        <div align=\"left\" class=\"style2\">重要聲明：本網站是學生的專題製作，如有相同，請多見諒。本網站對於所有留言與討論及立場，不負法律任何責任，一切留言與討論皆屬於個人意見，並非網站立場。用戶不應信賴內容，請自行判斷內容之真實性。若用戶發現任何留言有問題，請隨時與我們連絡，本網站有權刪除任何留言與拒絕任何人士的上傳下載。</div>\n");
      out.write("        <p>&nbsp;</p>\n");
      out.write("        <p>&nbsp;</p>\n");
      out.write("    </body>\n");
      out.write("</html>");
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
