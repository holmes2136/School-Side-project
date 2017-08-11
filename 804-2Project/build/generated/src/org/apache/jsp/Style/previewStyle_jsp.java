package org.apache.jsp.Style;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import Control.*;
import java.util.*;
import Friends.FriendsControl;
import Friends.FriendsVO;
import Page.*;

public final class previewStyle_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {


    String style;

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
      out.write("\r\n");

    style = request.getParameter("style");

      out.write("\r\n");
      out.write("<html xmlns=\"http://www.w3.org/1999/xhtml\">\r\n");
      out.write("<head>\r\n");
      out.write("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />\r\n");
      out.write("\r\n");
      out.write("<title>HB首頁</title>\r\n");
      out.write("\r\n");
      out.write("<script src=\"Scripts/AC_RunActiveContent.js\" type=\"text/javascript\"></script>\r\n");
      out.write("<link href=\"../");
      out.print(style);
      out.write("\" rel=\"stylesheet\" type=\"text/css\" />\r\n");
      out.write("</head>\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("<div id=\"top\"> id \"top\" 的內容放在這裡</div>\r\n");
      out.write("<div id=\"content\">\r\n");
      out.write("  <div id=\"nofunction\">\r\n");
      out.write("    <p>id \"nofunction&quot;無須內容 顏色預設</p>\r\n");
      out.write("    <p>&nbsp;</p>\r\n");
      out.write("    <p>&nbsp;</p>\r\n");
      out.write("    <p>&nbsp;</p>\r\n");
      out.write("  </div>\r\n");
      out.write("  <div id=\"left\">\r\n");
      out.write("    <table width=\"90%\">\r\n");
      out.write("      <tr>\r\n");
      out.write("        <td colspan=\"4\"><p>\r\n");
      out.write("            <script type=\"text/javascript\">\r\n");
      out.write("AC_FL_RunContent( 'codebase','http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,28,0','width','113','height','100','align','left','src','HB','quality','high','pluginspage','http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash','movie','HB' ); //end AC code\r\n");
      out.write("        </script>\r\n");
      out.write("            <noscript>\r\n");
      out.write("            <object classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" codebase=\"http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,28,0\" width=\"113\" height=\"100\" align=\"left\">\r\n");
      out.write("              <param name=\"movie\" value=\"HB.swf\" />\r\n");
      out.write("              <param name=\"quality\" value=\"high\" />\r\n");
      out.write("              <embed src=\"HB.swf\" width=\"113\" height=\"100\" align=\"left\" quality=\"high\" pluginspage=\"http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash\" type=\"application/x-shockwave-flash\"></embed>\r\n");
      out.write("            </object>\r\n");
      out.write("            </noscript>\r\n");
      out.write("          </p>\r\n");
      out.write("            <p>&nbsp;</p></td>\r\n");
      out.write("      </tr>\r\n");
      out.write("      <tr>\r\n");
      out.write("        <td colspan=\"4\">MySpace</td>\r\n");
      out.write("      </tr>\r\n");
      out.write("      <tr>\r\n");
      out.write("        <td colspan=\"3\"><img src=\"image/pili.jpg\" width=\"114\" height=\"120\" border=\"0\" /></td>\r\n");
      out.write("        <td width=\"19%\">&nbsp;</td>\r\n");
      out.write("      </tr>\r\n");
      out.write("      <tr>\r\n");
      out.write("        <td colspan=\"3\">&nbsp;</td>\r\n");
      out.write("        <td><a href=\"MySpace.html\"><img src=\"image/icon18_wrench_allbkg.png\" alt=\"\" width=\"18\" height=\"18\" border=\"0\" /></a></td>\r\n");
      out.write("      </tr>\r\n");
      out.write("      <tr>\r\n");
      out.write("        <td colspan=\"4\"><a href=\"註冊.html\">註冊</a></td>\r\n");
      out.write("      </tr>\r\n");
      out.write("      \r\n");
      out.write("      <tr>\r\n");
      out.write("        <td colspan=\"4\" align=\"center\"><div id=\"login\">\r\n");
      out.write("          <form id=\"form4\" name=\"form4\" method=\"post\" action=\"\">\r\n");
      out.write("            <p align=\"left\">帳號\r\n");
      out.write("              <input name=\"textfield\" type=\"text\" id=\"textfield\" size=\"10\" />\r\n");
      out.write("            </p>\r\n");
      out.write("            <p align=\"left\"> 密碼\r\n");
      out.write("              <input name=\"textfield2\" type=\"password\" id=\"textfield2\" size=\"10\" />\r\n");
      out.write("            </p>\r\n");
      out.write("            <p align=\"center\">\r\n");
      out.write("              <input name=\"button\" type=\"submit\" id=\"button\" value=\"登入\" border=\"0\" />\r\n");
      out.write("            </p>\r\n");
      out.write("                    </form>\r\n");
      out.write("          </div></td>\r\n");
      out.write("      </tr>\r\n");
      out.write("      <tr>\r\n");
      out.write("        <td width=\"23%\" align=\"center\" valign=\"middle\"><a href=\"Account網誌.html\" class=\"style8\">首頁</a></td>\r\n");
      out.write("        <td width=\"26%\" align=\"center\" valign=\"middle\"><span class=\"style8\"><a href=\"相簿.html\">相簿</a></span></td>\r\n");
      out.write("        <td colspan=\"2\" align=\"center\" valign=\"middle\"><span class=\"style8\">上傳照片</span></td>\r\n");
      out.write("      </tr>\r\n");
      out.write("      <tr>\r\n");
      out.write("        <td colspan=\"4\"><form id=\"form2\" name=\"form2\" method=\"post\" action=\"\">\r\n");
      out.write("            <select name=\"select\" id=\"select\">\r\n");
      out.write("              <option>好友清單</option>\r\n");
      out.write("            </select>\r\n");
      out.write("        </form></td>\r\n");
      out.write("      </tr>\r\n");
      out.write("      <tr>\r\n");
      out.write("        <td colspan=\"3\">最新文章</td>\r\n");
      out.write("        <td align=\"center\"><a href=\"最新文章.html\"><img src=\"image/icon18_wrench_allbkg.png\" width=\"18\" height=\"18\" border=\"0\" /></a></td>\r\n");
      out.write("      </tr>\r\n");
      out.write("      <tr>\r\n");
      out.write("        <td colspan=\"4\"><div id=\"newtopic\"> <a href=\"#\">id \"newtopic\"的內容放在這裡</a></div></td>\r\n");
      out.write("      </tr>\r\n");
      out.write("      <tr>\r\n");
      out.write("        <td colspan=\"3\">分類文章</td>\r\n");
      out.write("        <td align=\"center\"><a href=\"分類文章.html\"><img src=\"image/icon18_wrench_allbkg.png\" alt=\"\" width=\"18\" height=\"18\" border=\"0\" /></a></td>\r\n");
      out.write("      </tr>\r\n");
      out.write("      <tr>\r\n");
      out.write("        <td colspan=\"4\"><form id=\"form3\" name=\"form3\" method=\"post\" action=\"\">\r\n");
      out.write("            <select name=\"select2\" id=\"select2\">\r\n");
      out.write("              <option>分類文章</option>\r\n");
      out.write("            </select>\r\n");
      out.write("        </form></td>\r\n");
      out.write("      </tr>\r\n");
      out.write("      <tr>\r\n");
      out.write("        <td colspan=\"4\"><div id=\"topic_class\"> id \"topic_class\" 的內容放在這裡</div></td>\r\n");
      out.write("      </tr>\r\n");
      out.write("      <tr>\r\n");
      out.write("        <td colspan=\"3\">所有文章列表</td>\r\n");
      out.write("        <td align=\"center\"><a href=\"所有文章列表.html\"><img src=\"image/icon18_wrench_allbkg.png\" alt=\"\" width=\"18\" height=\"18\" border=\"0\" /></a></td>\r\n");
      out.write("      </tr>\r\n");
      out.write("      <tr>\r\n");
      out.write("        <td colspan=\"4\"><div id=\"alltopic\"> id \"alltopic\" 的內容放在這裡</div></td>\r\n");
      out.write("      </tr>\r\n");
      out.write("    </table>\r\n");
      out.write("  </div>\r\n");
      out.write("  <div id=\"right\">\r\n");
      out.write("    <table width=\"651\" border=\"0\" align=\"left\">\r\n");
      out.write("      <tr>\r\n");
      out.write("        <td width=\"14\" rowspan=\"2\" bordercolor=\"0\"><p>&nbsp;</p>\r\n");
      out.write("            <p>&nbsp;</p>\r\n");
      out.write("          <p>&nbsp;</p>\r\n");
      out.write("          <p>&nbsp;</p>\r\n");
      out.write("          <p>&nbsp;</p>\r\n");
      out.write("          <p>&nbsp;</p>\r\n");
      out.write("          <p>&nbsp;</p>\r\n");
      out.write("          <p>&nbsp;</p>\r\n");
      out.write("          <p>&nbsp;</p>\r\n");
      out.write("          <p>&nbsp;</p>\r\n");
      out.write("          <p>&nbsp;</p></td>\r\n");
      out.write("        <td width=\"536\" height=\"5\" bgcolor=\"#FFFF00\">最新文章</td>\r\n");
      out.write("        <td width=\"79\" bgcolor=\"#FFFF00\"><a href=\"文章回覆.html\">新增文章</a></td>\r\n");
      out.write("      </tr>\r\n");
      out.write("      <tr>\r\n");
      out.write("        <td colspan=\"2\" valign=\"top\"><table width=\"100%\" bgcolor=\"#FFFFFF\">\r\n");
      out.write("            <tr>\r\n");
      out.write("              <td colspan=\"9\" background=\"file:///C|/FormalProject/731Project/web/image/bg_minidots.gif\" class=\"style8\"><form id=\"form1\" name=\"form1\" method=\"post\" action=\"\">\r\n");
      out.write("                <input name=\"textfield3\" type=\"text\" class=\"tableline2\" id=\"textfield3\" />\r\n");
      out.write("              </form></td>\r\n");
      out.write("            </tr>\r\n");
      out.write("            <tr>\r\n");
      out.write("              <td colspan=\"9\" background=\"file:///C|/FormalProject/731Project/web/image/bg_minidots.gif\">今天跟大朱一起做網頁....              </td>\r\n");
      out.write("            </tr>\r\n");
      out.write("            <tr>\r\n");
      out.write("              <td colspan=\"9\" align=\"center\" valign=\"middle\" background=\"file:///C|/FormalProject/731Project/web/image/bg_minidots.gif\"><hr /></td>\r\n");
      out.write("            </tr>\r\n");
      out.write("            <tr>\r\n");
      out.write("              <td width=\"51%\" align=\"right\" valign=\"middle\" background=\"file:///C|/FormalProject/731Project/web/image/bg_minidots.gif\"><div align=\"right\" class=\"style7\"></div></td>\r\n");
      out.write("              <td width=\"11%\" align=\"right\" valign=\"middle\" background=\"file:///C|/FormalProject/731Project/web/image/bg_minidots.gif\"><span class=\"style7\"><span class=\"style2\">Account於</span></span></td>\r\n");
      out.write("              <td width=\"3%\" align=\"right\" valign=\"middle\" background=\"file:///C|/FormalProject/731Project/web/image/bg_minidots.gif\"><div align=\"right\" class=\"style7\"><span class=\"style2\">|</span></div></td>\r\n");
      out.write("              <td width=\"6%\" align=\"right\" valign=\"middle\" background=\"file:///C|/FormalProject/731Project/web/image/bg_minidots.gif\"><div align=\"right\" class=\"style7\"><span class=\"style2\"> TIME</span></div></td>\r\n");
      out.write("              <td width=\"6%\" align=\"right\" valign=\"middle\" background=\"file:///C|/FormalProject/731Project/web/image/bg_minidots.gif\"><div align=\"right\" class=\"style7\"><span class=\"style2\">發布</span></div></td>\r\n");
      out.write("              <td width=\"3%\" align=\"right\" valign=\"middle\" background=\"file:///C|/FormalProject/731Project/web/image/bg_minidots.gif\"><div align=\"right\" class=\"style7\"><span class=\"style2\">|</span></div></td>\r\n");
      out.write("              <td width=\"6%\" align=\"right\" valign=\"middle\" background=\"file:///C|/FormalProject/731Project/web/image/bg_minidots.gif\"><div align=\"right\" class=\"style7\"><span class=\"style2\">轉寄</span></div></td>\r\n");
      out.write("              <td width=\"3%\" align=\"right\" valign=\"middle\" background=\"file:///C|/FormalProject/731Project/web/image/bg_minidots.gif\"><div align=\"right\" class=\"style7\"><span class=\"style2\">|</span></div></td>\r\n");
      out.write("              <td width=\"11%\" align=\"right\" valign=\"middle\" background=\"file:///C|/FormalProject/731Project/web/image/bg_minidots.gif\"><div align=\"right\" class=\"style7\">\r\n");
      out.write("                <div align=\"center\"><img src=\"image/icon18_edit_allbkg.gif\" width=\"18\" height=\"18\" border=\"0\" /></div>\r\n");
      out.write("              </div></td>\r\n");
      out.write("            </tr>\r\n");
      out.write("        </table></td>\r\n");
      out.write("      </tr>\r\n");
      out.write("    </table>\r\n");
      out.write("  </div>\r\n");
      out.write("  <p>id \"content\" 的內容放在這裡</p>\r\n");
      out.write("</div>\r\n");
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
