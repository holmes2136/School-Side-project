package org.apache.jsp;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import Control.*;
import java.util.*;
import java.text.*;

public final class topicDetail1_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {


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
      out.write('\n');

    Control control = new Control();//取得主文章
    Artical artical = control.getArticalDetail(request.getParameter("titleid"));
    

      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("<html>\n");
      out.write("    <head>\n");
      out.write("        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n");
      out.write("        <title>JSP Page</title>\n");
      out.write("        \n");
      out.write("        <link href=\"main.css\" rel=\"stylesheet\" type=\"text/css\" />\n");
      out.write("    </head>\n");
      out.write("    <body>\n");
      out.write("<center>\n");
      out.write("<div id=\"mainTopic\">\n");
      out.write("  <table width=\"617\">\n");
      out.write("    <tr>\n");
      out.write("      <td width=\"607\">");
      out.print(artical.getTitle());
      out.write("</td>\n");
      out.write("    </tr>\n");
      out.write("    <tr>\n");
      out.write("      <td>");
      out.print(artical.getContent());
      out.write("</td>\n");
      out.write("    </tr>\n");
      out.write("    \n");
      out.write("    <tr>\n");
      out.write("      <td><table width=\"609\">\n");
      out.write("        <tr>\n");
      out.write("          <td width=\"71\" align=\"center\" valign=\"middle\">Account於HB部落格</td>\n");
      out.write("          <td width=\"71\" align=\"center\" valign=\"middle\">|</td>\n");
      out.write("          <td width=\"71\" align=\"center\" valign=\"middle\">");
      out.print(artical.getTime());
      out.write("發布</td>\n");
      out.write("          <td width=\"71\" align=\"center\" valign=\"middle\">|</td>\n");
      out.write("          <td width=\"71\" align=\"center\" valign=\"middle\"><a href=\"FunctionList/response.jsp?titleid=");
      out.print(artical.getTitleid());
      out.write("\">回應(X)</a></td>\n");
      out.write("          <td width=\"71\" align=\"center\" valign=\"middle\">|</td>\n");
      out.write("          <td width=\"71\" align=\"center\" valign=\"middle\">引用(X)</td>\n");
      out.write("          <td width=\"76\" align=\"center\" valign=\"middle\"><a href=\"mailto:\">轉寄</a></td>\n");
      out.write("        </tr>\n");
      out.write("      </table></td>\n");
      out.write("    </tr>\n");
      out.write("    <tr>\n");
      out.write("      <td><hr /></td>\n");
      out.write("    </tr>\n");
      out.write("  </table>\n");
      out.write("</div>\n");
      out.write("\n");
      //取得所有的回覆文章
    Collection ret = control.getAllReplyTopic(request.getParameter("titleid"));
    Iterator it = ret.iterator();
    while(it.hasNext()){
            Artical artical1 = (Artical)it.next();

      out.write("            \n");
      out.write("<div id=\"replyTopic\">\n");
      out.write("  <table width=\"743\">\n");
      out.write("\n");
      out.write("    \n");
      out.write("\n");
      out.write("    <tr>\n");
      out.write("      <td width=\"735\">");
      out.print(artical1.getContent());
      out.write("</td>\n");
      out.write("    </tr>\n");
      out.write("  \n");
      out.write("    <tr>\n");
      out.write("      <td><table width=\"609\" align=\"center\">\n");
      out.write(" \n");
      out.write("        <tr>\n");
      out.write("          <td width=\"71\" align=\"center\" valign=\"middle\">Account於HB部落格</td>\n");
      out.write("          <td width=\"71\" align=\"center\" valign=\"middle\">|</td>\n");
      out.write("          <td width=\"71\" align=\"center\" valign=\"middle\">2008/10/2發布</td>\n");
      out.write("          <td width=\"71\" align=\"center\" valign=\"middle\">|</td>\n");
      out.write("          <td width=\"71\" align=\"center\" valign=\"middle\"><a href=\"FunctionList/response.jsp?titleid=");
      out.print(artical1.getTitleid());
      out.write("\">回應(X)</a></td>\n");
      out.write("          <td width=\"71\" align=\"center\" valign=\"middle\">|</td>\n");
      out.write("          <td width=\"71\" align=\"center\" valign=\"middle\">引用(X)</td>\n");
      out.write("          <td width=\"76\" align=\"center\" valign=\"middle\"><a href=\"mailto:\">轉寄</a></td>\n");
      out.write("        </tr>\n");
      out.write("      </table></td>\n");
      out.write("    </tr>\n");
      out.write("    <tr><hr></tr>\n");
      out.write("  </table>\n");
      out.write("</div>\n");
}
      out.write(" \n");
      out.write("<div id=\"replyForm\">\n");
      out.write("  <form  name=\"artical\" method=\"post\" action=\"FunctionList/reply_do.jsp\">\n");
      out.write("    <table width=\"743\">\n");
      out.write("      <tr>\n");
      out.write("        <td width=\"58\" align=\"center\" valign=\"middle\">標題</td>\n");
      out.write("        <td width=\"673\"><input type=\"text\" name=\"title\" value=\"RE:");
      out.print(artical.getTitle());
      out.write("\"/>\n");
      out.write("        </td>\n");
      out.write("      </tr>\n");
      out.write("      <tr>\n");
      out.write("        <td align=\"center\" valign=\"middle\">內容</td>\n");
      out.write("        <td><textarea name=\"content\" cols=\"45\" rows=\"5\"></textarea></td>\n");
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
      out.write("\n");
      out.write("  \n");
      out.write("    \n");
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
