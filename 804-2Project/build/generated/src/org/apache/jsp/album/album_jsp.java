package org.apache.jsp.album;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import Control.*;
import java.util.*;
import Friends.FriendsControl;
import Friends.FriendsVO;
import Page.*;
import Image.*;

public final class album_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {


String toolsPic = "../image/icon18_wrench_allbkg.png";
String imagePath = "../images/";
String url = "http://holmes2136.no-ip.org:8084/731Project/";
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
      out.write("\r\n");
      out.write("\r\n");
 


String address = "";//取得好友網址
address = request.getParameter("friend");
if(address!=null){
    response.sendRedirect(address);
    
}

String username = (String)session.getAttribute("username");//取得會員資料
Register user = new Register();
User userInfo = user.getUserInfo(username);




      out.write("\r\n");
      out.write("<html xmlns=\"http://www.w3.org/1999/xhtml\">\r\n");
      out.write("    <head>\r\n");
      out.write("        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />\r\n");
      out.write("        \r\n");
      out.write("        <title>相簿</title>\r\n");
      out.write("        \r\n");
      out.write("        <script src=\"Scripts/AC_RunActiveContent.js\" type=\"text/javascript\"></script>\r\n");
      out.write("        <link href=\"");
      out.print(css);
      out.write("\" rel=\"stylesheet\" type=\"text/css\" />\r\n");
      out.write("        \r\n");
      out.write("        <style type=\"text/css\">\r\n");
      out.write("            <!--\r\n");
      out.write("body {\r\n");
      out.write("\tmargin-left: 0px;\r\n");
      out.write("\tmargin-top: 0px;\r\n");
      out.write("\tmargin-right: 0px;\r\n");
      out.write("\tmargin-bottom: 0px;\r\n");
      out.write("}\r\n");
      out.write("            -->\r\n");
      out.write("        </style>\r\n");
      out.write("    </head>\r\n");
      out.write("    \r\n");
      out.write("    \r\n");
      out.write("    <div id=\"top\"><iframe src=\"http://holmes2136.no-ip.org:8084/731Project/TopFunction.jsp\" height=\"40\" width=\"1024\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\" frameborder=\"0\"></iframe></div>\r\n");
      out.write("    <div id=\"content\">\r\n");
      out.write("        <div id=\"nofunction\">\r\n");
      out.write("            <p></p>\r\n");
      out.write("            <p>&nbsp;</p>\r\n");
      out.write("            <p>&nbsp;</p>\r\n");
      out.write("            <p>&nbsp;</p>\r\n");
      out.write("        </div>\r\n");
      out.write("        <div id=\"left\">\r\n");
      out.write("            <table width=\"90%\">\r\n");
      out.write("                <tr>\r\n");
      out.write("                    <td colspan=\"4\"><p>\r\n");
      out.write("                            <script type=\"text/javascript\">\r\n");
      out.write("AC_FL_RunContent( 'codebase','http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,28,0','width','113','height','100','align','left','src','HB','quality','high','pluginspage','http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash','movie','HB' );\r\n");
      out.write("                            </script>\r\n");
      out.write("                            <noscript>\r\n");
      out.write("                                <object classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" codebase=\"http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,28,0\" width=\"113\" height=\"100\" align=\"left\">\r\n");
      out.write("                                    <param name=\"movie\" value=\"HB.swf\" />\r\n");
      out.write("                                    <param name=\"quality\" value=\"high\" />\r\n");
      out.write("                                    <embed src=\"HB.swf\" width=\"113\" height=\"100\" align=\"left\" quality=\"high\" pluginspage=\"http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash\" type=\"application/x-shockwave-flash\"></embed>\r\n");
      out.write("                                </object>\r\n");
      out.write("                            </noscript>\r\n");
      out.write("                        </p>\r\n");
      out.write("                    <p>&nbsp;</p></td>\r\n");
      out.write("                </tr>\r\n");
      out.write("                <tr>\r\n");
      out.write("                    <td colspan=\"4\">MySpace</td>\r\n");
      out.write("                </tr>\r\n");
      out.write("                <tr>\r\n");
      out.write("                    <td colspan=\"3\">\r\n");
      out.write("                        ");
if(userInfo.getPhoto()!=null){
      out.write(" \r\n");
      out.write("                        <img src=\"");
      out.print(imagePath);
      out.print(userInfo.getPhoto());
      out.write("\" width=\"114\" height=\"120\" border=\"0\" />\r\n");
      out.write("                        ");
}else{
      out.write("\r\n");
      out.write("                        <img src=\"");
      out.print(imagePath);
      out.write("pili.jpg\" width=\"114\" height=\"120\" border=\"0\" />\r\n");
      out.write("                        ");
}
      out.write("    \r\n");
      out.write("                        \r\n");
      out.write("                        \r\n");
      out.write("                        \r\n");
      out.write("                        \r\n");
      out.write("                    </td>\r\n");
      out.write("                    <td width=\"18\">&nbsp;</td>\r\n");
      out.write("                </tr>\r\n");
      out.write("                <tr>\r\n");
      out.write("                    <td colspan=\"3\">&nbsp;</td>\r\n");
      out.write("                    <td><a href=\"index.jsp\" onclick=\"window.open('http://localhost:8084/731Project/upload/photo_sticker.jsp','大頭照設定',config='height=350,width=300')\"><img src=\"");
      out.print(toolsPic);
      out.write("\" alt=\"\" width=\"18\" height=\"18\" border=\"0\" /></a></td>\r\n");
      out.write("                </tr>\r\n");
      out.write("                <tr>\r\n");
      out.write("                    <td colspan=\"4\"><a href=\"");
      out.print(url);
      out.write("register.html\">註冊</a></td>\r\n");
      out.write("                </tr>\r\n");
      out.write("                <tr>\r\n");
      out.write("                    <div id=\"login\">\r\n");
      out.write("                        \r\n");
      out.write("                    </div>\r\n");
      out.write("                </tr>\r\n");
      out.write("                <tr>\r\n");
      out.write("                    <td width=\"30\" align=\"center\" valign=\"middle\"><a href=\"http://holmes2136.no-ip.org:8084/731Project/index.jsp\" class=\"tableline\">首頁</a></td>\r\n");
      out.write("                    <td width=\"28\" align=\"center\" valign=\"middle\" class=\"tableline\"><a href=\"");
      out.print(url);
      out.write("album/album.jsp\">相簿</a></td>\r\n");
      out.write("                    <td colspan=\"2\" align=\"center\" valign=\"middle\" class=\"tableline\"><a href=\"");
      out.print(url);
      out.write("upload/photoUpload.jsp\">上傳照片</a></td>\r\n");
      out.write("                </tr>\r\n");
      out.write("                <tr>\r\n");
      out.write("                    <td colspan=\"4\">\r\n");
      out.write("                        <form action=\"index.jsp\" method=\"post\" name=\"friends\" id=\"friends\">\r\n");
      out.write("                            <select name=\"friend\" id=\"friend\" onChange=\"Jumping()\">\r\n");
      out.write("                                <option value=\"\">好友列表</option>\r\n");
      out.write("                                <option value=\"");
      out.print(url);
      out.write("friends/friends.jsp\">好友總覽</option>\r\n");
      out.write("                                ");
//左邊好友列表欄位
                                FriendsControl control5 = new FriendsControl();
                                Collection ret5 = control5.getAllFriends();
                                Iterator it5 = ret5.iterator();
                                while(it5.hasNext()){
                                FriendsVO friends = (FriendsVO)it5.next();
                                
      out.write("        \r\n");
      out.write("                                \r\n");
      out.write("                                <option value=\"");
      out.print(friends.getAddress());
      out.write('"');
      out.write('>');
      out.print(friends.getName());
      out.write("</option>        \r\n");
      out.write("                                \r\n");
      out.write("                                ");
}
      out.write("  \r\n");
      out.write("                            </select>\r\n");
      out.write("                            \r\n");
      out.write("                        </form>\r\n");
      out.write("                    </td>\r\n");
      out.write("                </tr>\r\n");
      out.write("                <tr>\r\n");
      out.write("                    <td colspan=\"3\" class=\"tableline\">最新文章</td>\r\n");
      out.write("                    <td align=\"center\"><a href=\"\"><img src=\"");
      out.print(toolsPic);
      out.write("\" width=\"18\" height=\"18\" border=\"0\" /></a></td>\r\n");
      out.write("                </tr>\r\n");
      out.write("                <tr>\r\n");
      out.write("                    <td colspan=\"4\">\r\n");
      out.write("                        <div id=\"newtopic\">\r\n");
      out.write("                            <table>\r\n");
      out.write("                                \r\n");
      out.write("                                ");

                                
                                Control control3 = new Control();       //左邊最新文章欄位
                                Collection ret3 = control3.getNewArtical();
                                Iterator it3 = ret3.iterator();
                                while(it3.hasNext()){
                                    Artical artical3 = (Artical)it3.next();
                                    out.println("<tr>");
                                    out.println("<td><a href="+url+"topicDetail.jsp?titleid="+artical3.getTitleid()+">"+artical3.getTitle()+"</a></td>");
                                    out.println("</tr>");
                                }
                                
                                
      out.write("\r\n");
      out.write("                            </table>\r\n");
      out.write("                    </div></td>\r\n");
      out.write("                </tr>\r\n");
      out.write("                <tr>\r\n");
      out.write("                    <td colspan=\"3\" class=\"tableline\">分類文章</td>\r\n");
      out.write("                    <td align=\"center\"><a href=\"");
      out.print(url);
      out.write("Category/CategoryControl.jsp\"><img src=\"");
      out.print(toolsPic);
      out.write("\" alt=\"\" width=\"18\" height=\"18\" border=\"0\" /></a></td>\r\n");
      out.write("                </tr>\r\n");
      out.write("                <tr>\r\n");
      out.write("                    <td colspan=\"4\">\r\n");
      out.write("                        <form action=\"index.jsp\" method=\"post\" name=\"Category\">\r\n");
      out.write("                            <select name=\"categoryId\" onChange=\"category()\">\r\n");
      out.write("                                <option value=\"\">分類標籤</option>\r\n");
      out.write("                                ");

                                Control control2 = new Control();       //左邊分類文章欄位
                                Collection ret2 = control2.getAllCategory();
                                Iterator it2 = ret2.iterator();
                                while(it2.hasNext()){
                                    Category category = (Category)it2.next();
                                
      out.write("  \r\n");
      out.write("                                <option value=\"");
      out.print(category.getCatid());
      out.write('"');
      out.write('>');
      out.print(category.getCatid());
      out.write("</option>\r\n");
      out.write("                                \r\n");
      out.write("                                ");
}
      out.write("\r\n");
      out.write("                                \r\n");
      out.write("                            </select>\r\n");
      out.write("                        </form>\r\n");
      out.write("                    </td>\r\n");
      out.write("                </tr>\r\n");
      out.write("                <tr>\r\n");
      out.write("                    <td colspan=\"4\">\r\n");
      out.write("                        <div id=\"categoryTopic\">\r\n");
      out.write("                            \r\n");
      out.write("                            <table>\r\n");
      out.write("                                ");

                                Control control8 = new Control();
                                Collection ret6 = control8.getAllArticalByCategory((String)request.getParameter("categoryId"));
                                Iterator it6 = ret6.iterator();
                                while(it6.hasNext()){
                                    Artical artical6 = (Artical)it6.next();
                                
                                
      out.write("\r\n");
      out.write("                                \r\n");
      out.write("                                \r\n");
      out.write("                                <tr>\r\n");
      out.write("                                    <td><a href=\"");
      out.print(url);
      out.write("topicDetail.jsp?titleid=");
      out.print(artical6.getTitleid());
      out.write('"');
      out.write('>');
      out.print(artical6.getTitle());
      out.write("</a></td>\r\n");
      out.write("                                </tr>\r\n");
      out.write("                                ");
}
      out.write("\r\n");
      out.write("                            </table>\r\n");
      out.write("                        </div>\r\n");
      out.write("                    </td>\r\n");
      out.write("                </tr>\r\n");
      out.write("                <tr>\r\n");
      out.write("                    <td colspan=\"3\" class=\"tableline\">所有文章列表</td>\r\n");
      out.write("                    <td align=\"center\"><a href=\"\"><img src=\"");
      out.print(toolsPic);
      out.write("\" alt=\"\" width=\"18\" height=\"18\" border=\"0\" /></a></td>\r\n");
      out.write("                </tr>\r\n");
      out.write("                <tr>\r\n");
      out.write("                    <td colspan=\"4\">\r\n");
      out.write("                        <div id=\"alltopic\">\r\n");
      out.write("                            <table>\r\n");
      out.write("                                ");
    
                                Control control = new Control();   //左邊文章列表欄位取Title
                                Collection ret = control.leftGetAllArtical();
                                Iterator it = ret.iterator();
                                while(it.hasNext()){
                                    Artical artical = (Artical)it.next();
                                
      out.write("\r\n");
      out.write("                                \r\n");
      out.write("                                <tr>\r\n");
      out.write("                                    <td><a href=\"");
      out.print(url);
      out.write("topicDetail.jsp?titleid=");
      out.print(artical.getTitleid());
      out.write('"');
      out.write('>');
      out.print(artical.getTitle());
      out.write("</a></td>\r\n");
      out.write("                                    \r\n");
      out.write("                                </tr>\r\n");
      out.write("                                \r\n");
      out.write("                                \r\n");
      out.write("                                ");
}
      out.write("   \r\n");
      out.write("                            </table>\r\n");
      out.write("                        </div>\r\n");
      out.write("                    </td>\r\n");
      out.write("                </tr>\r\n");
      out.write("            </table>\r\n");
      out.write("            <div id=\"googleMap\">\r\n");
      out.write("                \r\n");
      out.write("                \r\n");
      out.write("            </div>\r\n");
      out.write("        </div>\r\n");
      out.write("        <div id=\"right\">\r\n");
      out.write("            <table width=\"651\" border=\"0\" align=\"left\">\r\n");
      out.write("                <tr>\r\n");
      out.write("                    <td width=\"14\" rowspan=\"2\" bordercolor=\"0\"><p>&nbsp;</p>\r\n");
      out.write("                        <p>&nbsp;</p>\r\n");
      out.write("                        <p>&nbsp;</p>\r\n");
      out.write("                        <p>&nbsp;</p>\r\n");
      out.write("                        <p>&nbsp;</p>\r\n");
      out.write("                        <p>&nbsp;</p>\r\n");
      out.write("                        <p>&nbsp;</p>\r\n");
      out.write("                        <p>&nbsp;</p>\r\n");
      out.write("                        <p>&nbsp;</p>\r\n");
      out.write("                        <p>&nbsp;</p>\r\n");
      out.write("                    <p>&nbsp;</p></td>\r\n");
      out.write("                    <td width=\"536\" height=\"5\" bgcolor=\"#FFFF00\">我的相簿</td>\r\n");
      out.write("                    <td width=\"79\" bgcolor=\"#FFFF00\">新增相簿</td>\r\n");
      out.write("                </tr>\r\n");
      out.write("                <tr>\r\n");
      out.write("                    <td colspan=\"2\" valign=\"top\"><div id=\"picture\">\r\n");
      out.write("                            <table width=\"100%\" border=\"1\">\r\n");
      out.write("                                \r\n");
      out.write("                              \r\n");
      out.write("                                    ");

                                    ImageControl imgControl = new ImageControl();
                                    Collection imgRet = imgControl.getAllImage();
                                    Iterator imgIt = imgRet.iterator();
                                    while(imgIt.hasNext()){
                                        ImageVO img = (ImageVO)imgIt.next();
                                    
      out.write("\r\n");
      out.write("                                    <tr>\r\n");
      out.write("                                    <td width=\"25%\"><img src=\"../");
      out.print(img.getPath()+img.getName());
      out.write("\" width=\"150\" height=\"150\" hspace=\"5\" vspace=\"10\" border=\"5\" /></td>\r\n");
      out.write("                                   \r\n");
      out.write("                                    </tr>\r\n");
      out.write("                                    ");
}
      out.write("\r\n");
      out.write("                                    \r\n");
      out.write("                                \r\n");
      out.write("                            </table>\r\n");
      out.write("                    </div></td>\r\n");
      out.write("                </tr>\r\n");
      out.write("            </table>\r\n");
      out.write("        </div>\r\n");
      out.write("        <p></p>\r\n");
      out.write("    </div>\r\n");
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
