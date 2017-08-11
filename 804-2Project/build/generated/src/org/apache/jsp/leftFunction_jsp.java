package org.apache.jsp;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import Control.*;
import java.util.*;
import Friends.FriendsControl;
import Friends.FriendsVO;

public final class leftFunction_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {


String toolsPic = "image/icon18_wrench_allbkg.png";


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
 


String address = "";//取得好友網址
address = request.getParameter("friend");
if(address!=null){
    response.sendRedirect(address);
    
}

String username = (String)session.getAttribute("username");//取得會員資料
Register user = new Register();
User userInfo = user.getUserInfo(username);




      out.write("\n");
      out.write("<html>\n");
      out.write("    <head>\n");
      out.write("        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n");
      out.write("        <title>JSP Page</title>\n");
      out.write("        \n");
      out.write("        <link href=\"blog.css\" rel=\"stylesheet\" type=\"text/css\" />\n");
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
      out.write("    <body background=\"image/bg02.jpg\">\n");
      out.write("        <table width=\"90%\">\n");
      out.write("                <tr>\n");
      out.write("                    <td colspan=\"4\"><p>\n");
      out.write("                            <script type=\"text/javascript\">\n");
      out.write("AC_FL_RunContent( 'codebase','http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,28,0','width','113','height','100','align','left','src','HB','quality','high','pluginspage','http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash','movie','HB' );\n");
      out.write("                            </script>\n");
      out.write("                            <noscript>\n");
      out.write("                                <object classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" codebase=\"http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,28,0\" width=\"113\" height=\"100\" align=\"left\">\n");
      out.write("                                    <param name=\"movie\" value=\"HB.swf\" />\n");
      out.write("                                    <param name=\"quality\" value=\"high\" />\n");
      out.write("                                    <embed src=\"HB.swf\" width=\"113\" height=\"100\" align=\"left\" quality=\"high\" pluginspage=\"http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash\" type=\"application/x-shockwave-flash\"></embed>\n");
      out.write("                                </object>\n");
      out.write("                            </noscript>\n");
      out.write("                        </p>\n");
      out.write("                    <p>&nbsp;</p></td>\n");
      out.write("                </tr>\n");
      out.write("                <tr>\n");
      out.write("                    <td colspan=\"4\">MySpace</td>\n");
      out.write("                </tr>\n");
      out.write("                <tr>\n");
      out.write("                    <td colspan=\"3\">\n");
      out.write("                        ");
if(userInfo.getPhoto()!=null){
      out.write(" \n");
      out.write("                        <img src=\"images/");
      out.print(userInfo.getPhoto());
      out.write("\" width=\"114\" height=\"120\" border=\"0\" />\n");
      out.write("                        ");
}else{
      out.write("\n");
      out.write("                        <img src=\"image/pili.jpg\" width=\"114\" height=\"120\" border=\"0\" />\n");
      out.write("                        ");
}
      out.write("    \n");
      out.write("                        \n");
      out.write("                        \n");
      out.write("                        \n");
      out.write("                        \n");
      out.write("                    </td>\n");
      out.write("                    <td width=\"18\">&nbsp;</td>\n");
      out.write("                </tr>\n");
      out.write("                <tr>\n");
      out.write("                    <td colspan=\"3\">&nbsp;</td>\n");
      out.write("                    <td><a href=\"index.jsp\" onclick=\"window.open('http://localhost:8084/731Project/upload/photo_sticker.jsp','大頭照設定',config='height=350,width=300')\"><img src=\"");
      out.print(toolsPic);
      out.write("\" alt=\"\" width=\"18\" height=\"18\" border=\"0\" /></a></td>\n");
      out.write("                </tr>\n");
      out.write("                <tr>\n");
      out.write("                    <td colspan=\"4\"><a href=\"register/register.html\">註冊</a></td>\n");
      out.write("                </tr>\n");
      out.write("                <tr>\n");
      out.write("                    <div id=\"login\">\n");
      out.write("                        \n");
      out.write("                    </div>\n");
      out.write("                </tr>\n");
      out.write("                <tr>\n");
      out.write("                    <td width=\"30\" align=\"center\" valign=\"middle\"><a href=\"index.jsp\" class=\"tableline\">首頁</a></td>\n");
      out.write("                    <td width=\"28\" align=\"center\" valign=\"middle\" class=\"tableline\"><a href=\"album/album.html\">相簿</a></td>\n");
      out.write("                    <td colspan=\"2\" align=\"center\" valign=\"middle\" class=\"tableline\">上傳照片</td>\n");
      out.write("                </tr>\n");
      out.write("                <tr>\n");
      out.write("                    <td colspan=\"4\">\n");
      out.write("                        <form action=\"index.jsp\" method=\"post\" name=\"friends\" id=\"friends\">\n");
      out.write("                            <select name=\"friend\" id=\"friend\" onChange=\"Jumping()\">\n");
      out.write("                                <option value=\"\">好友列表</option>\n");
      out.write("                                <option value=\"http://localhost:8084/731Project/friends/friends.jsp\">好友總覽</option>\n");
      out.write("                                ");
//左邊好友列表欄位
                                FriendsControl control5 = new FriendsControl();
                                Collection ret5 = control5.getAllFriends();
                                Iterator it5 = ret5.iterator();
                                while(it5.hasNext()){
                                FriendsVO friends = (FriendsVO)it5.next();
                                
      out.write("        \n");
      out.write("                                \n");
      out.write("                                <option value=\"");
      out.print(friends.getAddress());
      out.write('"');
      out.write('>');
      out.print(friends.getName());
      out.write("</option>        \n");
      out.write("                                \n");
      out.write("                                ");
}
      out.write("  \n");
      out.write("                            </select>\n");
      out.write("                            \n");
      out.write("                        </form>\n");
      out.write("                    </td>\n");
      out.write("                </tr>\n");
      out.write("                <tr>\n");
      out.write("                    <td colspan=\"3\" class=\"tableline\">最新文章</td>\n");
      out.write("                    <td align=\"center\"><a href=\"\"><img src=\"");
      out.print(toolsPic);
      out.write("\" width=\"18\" height=\"18\" border=\"0\" /></a></td>\n");
      out.write("                </tr>\n");
      out.write("                <tr>\n");
      out.write("                    <td colspan=\"4\">\n");
      out.write("                        <div id=\"newtopic\">\n");
      out.write("                            <table>\n");
      out.write("                                \n");
      out.write("                                ");

                                
                                Control control3 = new Control();       //左邊最新文章欄位
                                Collection ret3 = control3.getNewArtical();
                                Iterator it3 = ret3.iterator();
                                while(it3.hasNext()){
                                    Artical artical3 = (Artical)it3.next();
                                    out.println("<tr>");
                                    out.println("<td><a href=topicDetail.jsp?titleid="+artical3.getTitleid()+">"+artical3.getTitle()+"</a></td>");
                                    out.println("</tr>");
                                }
                                
                                
      out.write("\n");
      out.write("                            </table>\n");
      out.write("                    </div></td>\n");
      out.write("                </tr>\n");
      out.write("                <tr>\n");
      out.write("                    <td colspan=\"3\" class=\"tableline\">分類文章</td>\n");
      out.write("                    <td align=\"center\"><a href=\"Category/CategoryControl.jsp\" target=\"_parent\"><img src=\"");
      out.print(toolsPic);
      out.write("\" alt=\"\" width=\"18\" height=\"18\" border=\"0\" /></a></td>\n");
      out.write("                </tr>\n");
      out.write("                <tr>\n");
      out.write("                    <td colspan=\"4\">\n");
      out.write("                        <form action=\"index.jsp\" method=\"post\" name=\"Category\">\n");
      out.write("                            <select name=\"categoryId\" onChange=\"category()\">\n");
      out.write("                                <option value=\"\">分類標籤</option>\n");
      out.write("                                ");

                                Control control2 = new Control();       //左邊分類文章欄位
                                Collection ret2 = control2.getAllCategory();
                                Iterator it2 = ret2.iterator();
                                while(it2.hasNext()){
                                    Category category = (Category)it2.next();
                                
      out.write("  \n");
      out.write("                                <option value=\"");
      out.print(category.getCatid());
      out.write('"');
      out.write('>');
      out.print(category.getCatid());
      out.write("</option>\n");
      out.write("                                \n");
      out.write("                                ");
}
      out.write("\n");
      out.write("                                \n");
      out.write("                            </select>\n");
      out.write("                        </form>\n");
      out.write("                    </td>\n");
      out.write("                </tr>\n");
      out.write("                <tr>\n");
      out.write("                    <td colspan=\"4\">\n");
      out.write("                        <div id=\"categoryTopic\">\n");
      out.write("                            \n");
      out.write("                            <table>\n");
      out.write("                                ");

                                Control control8 = new Control();
                                Collection ret6 = control8.getAllArticalByCategory((String)request.getParameter("categoryId"));
                                Iterator it6 = ret6.iterator();
                                while(it6.hasNext()){
                                Artical artical6 = (Artical)it6.next();
                                
                                
      out.write("\n");
      out.write("                                \n");
      out.write("                                \n");
      out.write("                                <tr>\n");
      out.write("                                    <td><a href=\"topicDetail.jsp?titleid=");
      out.print(artical6.getTitleid());
      out.write('"');
      out.write('>');
      out.print(artical6.getTitle());
      out.write("</a></td>\n");
      out.write("                                </tr>\n");
      out.write("                                ");
}
      out.write("\n");
      out.write("                            </table>\n");
      out.write("                        </div>\n");
      out.write("                    </td>\n");
      out.write("                </tr>\n");
      out.write("                <tr>\n");
      out.write("                    <td colspan=\"3\" class=\"tableline\">所有文章列表</td>\n");
      out.write("                    <td align=\"center\"><a href=\"\"><img src=\"");
      out.print(toolsPic);
      out.write("\" alt=\"\" width=\"18\" height=\"18\" border=\"0\" /></a></td>\n");
      out.write("                </tr>\n");
      out.write("                <tr>\n");
      out.write("                    <td colspan=\"4\">\n");
      out.write("                        <div id=\"alltopic\">\n");
      out.write("                            <table>\n");
      out.write("                                ");
    
                                Control control = new Control();   //左邊文章列表欄位取Title
                                Collection ret = control.leftGetAllArtical();
                                Iterator it = ret.iterator();
                                while(it.hasNext()){
                                    Artical artical = (Artical)it.next();
                                
      out.write("\n");
      out.write("                                \n");
      out.write("                                <tr>\n");
      out.write("                                    <td><a href=\"topicDetail.jsp?titleid=");
      out.print(artical.getTitleid());
      out.write('"');
      out.write('>');
      out.print(artical.getTitle());
      out.write("</a></td>\n");
      out.write("                                    \n");
      out.write("                                </tr>\n");
      out.write("                                \n");
      out.write("                                \n");
      out.write("                                ");
}
      out.write("   \n");
      out.write("                            </table>\n");
      out.write("                        </div>\n");
      out.write("                    </td>\n");
      out.write("                </tr>\n");
      out.write("            </table>\n");
      out.write("            <div id=\"googleMap\">\n");
      out.write("                <iframe width=\"150\" height=\"150\" src=\"googleMap.jsp\" frameborder=\"0\" scrolling=\"no\"></iframe>\n");
      out.write("                \n");
      out.write("            </div>\n");
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
