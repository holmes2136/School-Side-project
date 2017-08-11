package org.apache.jsp.friends;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import Friends.*;
import java.util.*;

public final class friends_jsp extends org.apache.jasper.runtime.HttpJspBase
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

      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write('\r');
      out.write('\n');

String address = request.getParameter("friend_id");
if(address!=null){
    response.sendRedirect(address);
    
}

      out.write("\r\n");
      out.write("<html xmlns=\"http://www.w3.org/1999/xhtml\">\r\n");
      out.write("    <head>\r\n");
      out.write("        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />\r\n");
      out.write("        <title>好友列表</title>\r\n");
      out.write("        <style type=\"text/css\">\r\n");
      out.write("            <!--\r\n");
      out.write("body {\r\n");
      out.write("\tbackground-color: #999999;\r\n");
      out.write("        margin-left: 0px;\r\n");
      out.write("\tmargin-top: 0px;\r\n");
      out.write("\tmargin-right: 0px;\r\n");
      out.write("\tmargin-bottom: 0px;\r\n");
      out.write("}\r\n");
      out.write(".style5 {font-size: 36px; font-weight: bold; }\r\n");
      out.write("            -->\r\n");
      out.write("        </style>\r\n");
      out.write("        <script src=\"Scripts/AC_RunActiveContent.js\" type=\"text/javascript\"></script>\r\n");
      out.write("        <script language=\"JavaScript\">\r\n");
      out.write("    <!--\r\n");
      out.write("    function Jumping(){\r\n");
      out.write("        document.friends.submit();\r\n");
      out.write("        return;\r\n");
      out.write("       \r\n");
      out.write("    }\r\n");
      out.write("   \r\n");
      out.write(" -->  \r\n");
      out.write("        </script>\r\n");
      out.write("        \r\n");
      out.write("        <link href=\"");
      out.print(css);
      out.write("\" rel=\"stylesheet\" type=\"text/css\"/>\r\n");
      out.write("    </head>\r\n");
      out.write("    <iframe src=\"http://localhost:8084/731Project/TopFunction.jsp\" height=\"40\" width=\"1024\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\" frameborder=\"0\"></iframe>\r\n");
      out.write("    <body background=\"../image/bg_minidots.gif\">\r\n");
      out.write("        <table width=\"105%\" height=\"540\" class=\"tableline\">\r\n");
      out.write("            <tr>\r\n");
      out.write("                \r\n");
      out.write("                \r\n");
      out.write("            </tr>\r\n");
      out.write("            <tr>\r\n");
      out.write("                <td height=\"120\" colspan=\"3\" valign=\"top\">&nbsp;</td>\r\n");
      out.write("            </tr>\r\n");
      out.write("            <tr>\r\n");
      out.write("                <td width=\"21%\" rowspan=\"2\" valign=\"top\" bordercolor=\"1\"><div><img src=\"http://localhost:8084/Project/image/pili.jpg\" width=\"150\" height=\"150\" /></div>      \r\n");
      out.write("                    <p>&nbsp;</p>\r\n");
      out.write("                    <div><a href=\"friendsControl.jsp\">好友列表</a></div>      \r\n");
      out.write("                <p>&nbsp;</p></td>\r\n");
      out.write("                <td width=\"14%\" height=\"36\" valign=\"top\" bordercolor=\"1\"><span class=\"style5\">Account</span></td>\r\n");
      out.write("                <td width=\"65%\" valign=\"top\" bordercolor=\"1\"><span class=\"style5\">的好友列表</span></td>\r\n");
      out.write("            </tr>\r\n");
      out.write("            <tr>\r\n");
      out.write("                <td colspan=\"2\" valign=\"top\"><ul>\r\n");
      out.write("                        <li><a href=\"http://localhost:8084/731Project/index.jsp\">首頁</a></li>\r\n");
      out.write("                        <li>相簿</li>\r\n");
      out.write("                        <li>照片上傳</li>\r\n");
      out.write("                        <li><a href=\"friends.jsp\">好友</a></li>\r\n");
      out.write("                    </ul>\r\n");
      out.write("                    <div>\r\n");
      out.write("                        <form action=\"friends.jsp\" method=\"post\" name=\"friends\">\r\n");
      out.write("                            <select name=\"friend_id\" id=\"friend_id\" onchange=\"Jumping()\">\r\n");
      out.write("                                <option value=\"\">好友列表</option>\r\n");
      out.write("                                ");

                                FriendsControl control = new FriendsControl();
                                Collection ret = control.getAllFriends();
                                Iterator it = ret.iterator();
                                while(it.hasNext()){
                                FriendsVO friends = (FriendsVO)it.next();
                                
      out.write("     \r\n");
      out.write("                                <option value=\"");
      out.print(friends.getAddress());
      out.write('"');
      out.write('>');
      out.print(friends.getName());
      out.write("</option> \r\n");
      out.write("                                \r\n");
      out.write("                                ");
}
      out.write("\r\n");
      out.write("                            </select>\r\n");
      out.write("                        </form>\r\n");
      out.write("                    </div>\r\n");
      out.write("                <p>&nbsp;</p></td>\r\n");
      out.write("            </tr>\r\n");
      out.write("        </table>\r\n");
      out.write("    </body>\r\n");
      out.write("</html>\r\n");
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
