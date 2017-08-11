package org.apache.jsp;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import Control.*;
import java.util.*;
import Friends.FriendsControl;
import Friends.FriendsVO;
import Page.*;

public final class index1_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {


String toolsPic = "image/icon18_wrench_allbkg.png";
String imagePath = "images/";
String url = "http://holmes2136.no-ip.org:8084/731Project/";
String css = "blog.css";


                            int pageCount;
                            
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
      out.write("        <title></title>\r\n");
      out.write("        <script src=\"prototype.js\" type=\"text/javascript\"></script>\r\n");
      out.write("        <script src=\"scriptaculous.js\" type=\"text/javascript\"></script>\r\n");
      out.write("        <script src=\"unittest.js\" type=\"text/javascript\"></script>\r\n");
      out.write("        <script src=\"Scripts/AC_RunActiveContent.js\" type=\"text/javascript\"></script>\r\n");
      out.write("        <link href=\"blog.css\" rel=\"stylesheet\" type=\"text/css\" />\r\n");
      out.write("        <link rel=\"SHORTCUT ICON\" href=\"favicon.ico\"/>\r\n");
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
      out.write("        <script language=\"JavaScript\">\r\n");
      out.write("            <!--\r\n");
      out.write("                function divChange(x){\r\n");
      out.write("                    document.getElementById(\"li\"+x).style.cursor='move';\r\n");
      out.write("                    document.getElementById(\"li\"+x).style.border='dotted';\r\n");
      out.write("                    document.getElementById(\"li\"+x).style.borderColor='#CCCCCC';\r\n");
      out.write("                    \r\n");
      out.write("                }\r\n");
      out.write("                \r\n");
      out.write("                function silent(x){\r\n");
      out.write("                document.getElementById(\"li\"+x).style.border = 'none';\r\n");
      out.write("        }\r\n");
      out.write("            -->\r\n");
      out.write("            \r\n");
      out.write("        </script>\r\n");
      out.write("    </head>\r\n");
      out.write("    \r\n");
      out.write("    \r\n");
      out.write("    <div id=\"top\">\r\n");
      out.write("        <iframe src=\"TopFunction.jsp\" height=\"40\" width=\"1024\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\" frameborder=\"0\"></iframe>\r\n");
      out.write("    </div>\r\n");
      out.write("    <div id=\"content\">\r\n");
      out.write("        <div id=\"nofunction\">\r\n");
      out.write("            \r\n");
      out.write("        </div>\r\n");
      out.write("        <div id=\"left\" style=\"position:relative;\">\r\n");
      out.write("            <ul id=\"thelist2\" style=\"padding: 0px;list-style-type:none\">\r\n");
      out.write("                <li id=\"li1\"   onmousedown=\"divChange(1)\" onmouseout=\"silent(1)\"><div id=\"flash\">\r\n");
      out.write("                        <script type=\"text/javascript\">\r\n");
      out.write("AC_FL_RunContent( 'codebase','http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,28,0','width','113','height','100','align','left','src','HB','quality','high','pluginspage','http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash','movie','HB' );\r\n");
      out.write("                        </script>\r\n");
      out.write("                        <noscript>\r\n");
      out.write("                            <object classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" codebase=\"http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,28,0\" width=\"150\" height=\"100\" align=\"left\">\r\n");
      out.write("                                <param name=\"movie\" value=\"HB.swf\" />\r\n");
      out.write("                                <param name=\"quality\" value=\"high\" />\r\n");
      out.write("                                <embed src=\"HB.swf\" width=\"150\" height=\"100\" align=\"left\" quality=\"high\" pluginspage=\"http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash\" type=\"application/x-shockwave-flash\"></embed>\r\n");
      out.write("                            </object>\r\n");
      out.write("                        </noscript>\r\n");
      out.write("                        \r\n");
      out.write("                </div></li>\r\n");
      out.write("                \r\n");
      out.write("                <li id=\"li2\"  onmousedown=\"divChange(2)\"  onmouseout=\"silent(2)\"><div id=\"photoSticker\">\r\n");
      out.write("                        <table>\r\n");
      out.write("                            <tr>\r\n");
      out.write("                                <td> ");
if(userInfo.getPhoto()!=null){
      out.write(" \r\n");
      out.write("                                    <img src=\"images/");
      out.print(userInfo.getPhoto());
      out.write("\" width=\"114\" height=\"120\" border=\"0\" />\r\n");
      out.write("                                    ");
}else{
      out.write("\r\n");
      out.write("                                    <img src=\"image/pili.jpg\" width=\"114\" height=\"120\" border=\"0\" />\r\n");
      out.write("                                    ");
}
      out.write("\r\n");
      out.write("                                    <a href=\"");
      out.print(url);
      out.write("index.jsp\" onclick=\"window.open('http://holmes2136.no-ip.org:8084/731Project/upload/photo_sticker.jsp','大頭照設定',config='height=350,width=300')\"><img src=\"");
      out.print(toolsPic);
      out.write("\" width=\"18\" height=\"18\" border=\"0\" /></a>\r\n");
      out.write("                                </td>\r\n");
      out.write("                                \r\n");
      out.write("                            </tr>\r\n");
      out.write("                        </table>\r\n");
      out.write("                        \r\n");
      out.write("                </div></li>\r\n");
      out.write("                \r\n");
      out.write("                <li id=\"li3\"  onmousedown=\"divChange(3)\" onmouseout=\"silent(3)\"><div id=\"friends\">\r\n");
      out.write("                        <table cellpadding=\"0\" cellspacing=\"0\">\r\n");
      out.write("                            <tr>\r\n");
      out.write("                                <td><form action=\"index.jsp\" method=\"post\" name=\"friends\" id=\"friends\">\r\n");
      out.write("                                        <select name=\"friend\" id=\"friend\" onChange=\"Jumping()\">\r\n");
      out.write("                                            <option value=\"\">好友列表</option>\r\n");
      out.write("                                            <option value=\"");
      out.print(url);
      out.write("friends/friends.jsp\">好友總覽</option>\r\n");
      out.write("                                            ");
//左邊好友列表欄位
                                            FriendsControl control5 = new FriendsControl();
                                            Collection ret5 = control5.getAllFriends();
                                            Iterator it5 = ret5.iterator();
                                            while(it5.hasNext()){
                                            FriendsVO friends = (FriendsVO)it5.next();
                                            
      out.write("        \r\n");
      out.write("                                            \r\n");
      out.write("                                            <option value=\"");
      out.print(friends.getAddress());
      out.write('"');
      out.write('>');
      out.print(friends.getName());
      out.write("</option>        \r\n");
      out.write("                                            \r\n");
      out.write("                                            ");
}
      out.write("  \r\n");
      out.write("                                        </select>\r\n");
      out.write("                                          <a href=\"\"><img src=\"");
      out.print(toolsPic);
      out.write("\" width=\"18\" height=\"18\" border=\"0\" /></a>\r\n");
      out.write("                                </form></td>\r\n");
      out.write("                              \r\n");
      out.write("                            </tr>\r\n");
      out.write("                        </table>\r\n");
      out.write("                        \r\n");
      out.write("                </div></li>\r\n");
      out.write("                \r\n");
      out.write("                <li id=\"li4\" onmousedown=\"divChange(4)\" onmouseout=\"silent(4)\"><div id=\"newTopic\">\r\n");
      out.write("                        <table>\r\n");
      out.write("                           \r\n");
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
      out.write("                              \r\n");
      out.write("                            \r\n");
      out.write("                        </table>\r\n");
      out.write("                </div></li>\r\n");
      out.write("                \r\n");
      out.write("                <li id=\"li5\" onmousedown=\"divChange(5)\" onmouseout=\"silent(5)\"><div id=\"category\">\r\n");
      out.write("                        <table>\r\n");
      out.write("                            <tr>\r\n");
      out.write("                                <td><form action=\"index.jsp\" method=\"post\" name=\"Category\">\r\n");
      out.write("                                        <select name=\"categoryId\" onChange=\"category()\">\r\n");
      out.write("                                            <option value=\"\">分類標籤</option>\r\n");
      out.write("                                            ");

                                            Control control2 = new Control();       //左邊分類文章欄位
                                            Collection ret2 = control2.getAllCategory();
                                            Iterator it2 = ret2.iterator();
                                            while(it2.hasNext()){
                                                Category category = (Category)it2.next();
                                            
      out.write("  \r\n");
      out.write("                                            <option value=\"");
      out.print(category.getCatid());
      out.write('"');
      out.write('>');
      out.print(category.getCatid());
      out.write("</option>\r\n");
      out.write("                                            \r\n");
      out.write("                                            ");
}
      out.write("\r\n");
      out.write("                                            \r\n");
      out.write("                                        </select>\r\n");
      out.write("                                </form>\r\n");
      out.write("                                 \r\n");
      out.write("                            </td>\r\n");
      out.write("                                <td> <a href=\"");
      out.print(url);
      out.write("Category/CategoryControl.jsp\"><img src=\"");
      out.print(toolsPic);
      out.write("\" width=\"18\" height=\"18\" border=\"0\" /></a></td>\r\n");
      out.write("                            </tr>\r\n");
      out.write("                        </table>\r\n");
      out.write("                </div></li>\r\n");
      out.write("                \r\n");
      out.write("                <li id=\"li6\" onmousedown=\"divChange(6)\" onmouseout=\"silent(6)\"><div id=\"categoryTopic\">\r\n");
      out.write("                        <table>\r\n");
      out.write("                            ");

                            Control control8 = new Control();
                            Collection ret6 = control8.getAllArticalByCategory((String)request.getParameter("categoryId"));
                            Iterator it6 = ret6.iterator();
                            while(it6.hasNext()){
                                Artical artical6 = (Artical)it6.next();
                            
                            
      out.write("\r\n");
      out.write("                            \r\n");
      out.write("                            \r\n");
      out.write("                            <tr>\r\n");
      out.write("                                <td><a href=\"");
      out.print(url);
      out.write("topicDetail.jsp?titleid=");
      out.print(artical6.getTitleid());
      out.write('"');
      out.write('>');
      out.print(artical6.getTitle());
      out.write("</a></td>\r\n");
      out.write("                            </tr>\r\n");
      out.write("                            ");
}
      out.write("\r\n");
      out.write("                        </table>\r\n");
      out.write("                </div></li>\r\n");
      out.write("                \r\n");
      out.write("                <li id=\"li7\" onmousedown=\"divChange(7)\" onmouseout=\"silent(7)\"><div id=\"allTopic\">\r\n");
      out.write("                        \r\n");
      out.write("                        <table>\r\n");
      out.write("                            ");
    
                            Control control = new Control();   //左邊文章列表欄位取Title
                            Collection ret = control.leftGetAllArtical();
                            Iterator it = ret.iterator();
                            while(it.hasNext()){
                                Artical artical = (Artical)it.next();
                            
      out.write("\r\n");
      out.write("                            \r\n");
      out.write("                            <tr>\r\n");
      out.write("                                <td><a href=\"");
      out.print(url);
      out.write("topicDetail.jsp?titleid=");
      out.print(artical.getTitleid());
      out.write('"');
      out.write('>');
      out.print(artical.getTitle());
      out.write("</a></td>\r\n");
      out.write("                                \r\n");
      out.write("                            </tr>\r\n");
      out.write("                            \r\n");
      out.write("                            \r\n");
      out.write("                            ");
}
      out.write("   \r\n");
      out.write("                        </table>\r\n");
      out.write("                </div></li>\r\n");
      out.write("                \r\n");
      out.write("            </ul>\r\n");
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
      out.write("                    <td width=\"536\" height=\"5\">最新文章</td>\r\n");
      out.write("                    \r\n");
      out.write("                    <td width=\"79\"><a href=\"");
      out.print(url);
      out.write("addNewTopic/addNewTopic.jsp\">新增文章</a></td>\r\n");
      out.write("                </tr>\r\n");
      out.write("                <tr>\r\n");
      out.write("                    <td colspan=\"2\" valign=\"top\"><table width=\"100%\" bgcolor=\"#FFFFFF\">\r\n");
      out.write("                            ");
      out.write("\r\n");
      out.write("                            ");
//分頁
                            PageBean pageBean = new PageBean();
                            int rowsCount = pageBean.getRowCount();
                            pageCount = pageBean.getPageCount();
                            int nowPage = 0;
                            String toPage = request.getParameter("curPage");
                            if(toPage!=null){
                            nowPage = Integer.parseInt(toPage);
                            if(nowPage>pageCount){
                            nowPage = pageCount;
                            }
                            else if(nowPage<=0){
                            nowPage = 1;
                            }
                            }
                            else{
                            nowPage = 1;
                            }
                            
                            Collection ret4 = pageBean.getPageData(nowPage);
                            Iterator it4 = ret4.iterator();
                            while(it4.hasNext()){
                            Artical artical4 = (Artical)it4.next();
                            
      out.write("\r\n");
      out.write("                            <table width=\"100%\" class=\"tableline\">\r\n");
      out.write("                                <tr>\r\n");
      out.write("                                    <td colspan=\"9\" class=\"titleStyle\">\r\n");
      out.write("                                        ");

                                        if(artical4.getTitle().length()>20){//文章標題超過20字便簡略
                                out.println("<a href=topicDetail.jsp?titleid="+artical4.getTitleid()+">"+artical4.getTitle().substring(0,20)+".......</a>");
                                
                                        } else{
                                out.println("<a href=topicDetail.jsp?titleid="+artical4.getTitleid()+">"+artical4.getTitle()+"</a>");
                                        }
                                        
                                        
      out.write("\r\n");
      out.write("                                    </td>\r\n");
      out.write("                                </tr>\r\n");
      out.write("                                <tr>\r\n");
      out.write("                                    <td colspan=\"9\">\r\n");
      out.write("                                        ");
if(artical4.getContent().length()>40){//文章內容超過40字便簡略
                                        out.println(artical4.getContent().substring(0,40)+".............");
                                        }
                                        else{
                                        out.println(artical4.getContent());
                                        }
                                        
                                        
      out.write("\r\n");
      out.write("                                        \r\n");
      out.write("                                    </td>\r\n");
      out.write("                                </tr>\r\n");
      out.write("                                <tr>\r\n");
      out.write("                                    <td colspan=\"9\" align=\"center\" valign=\"middle\"></td>\r\n");
      out.write("                                </tr>\r\n");
      out.write("                                <tr>\r\n");
      out.write("                                    <td width=\"41%\" align=\"right\" valign=\"middle\"><div align=\"right\"></div></td>\r\n");
      out.write("                                    <td width=\"6%\" align=\"right\" valign=\"middle\"><span class=\"style7\">Account</span></td>\r\n");
      out.write("                                    <td width=\"3%\" align=\"right\" valign=\"middle\"><div align=\"right\">|</div></td>\r\n");
      out.write("                                    <td width=\"6%\" align=\"right\" valign=\"middle\"><div align=\"right\"></div></td>\r\n");
      out.write("                                    <td width=\"21%\" align=\"left\" valign=\"middle\"><div align=\"right\">");
      out.print(artical4.getTime());
      out.write("發布</div></td>\r\n");
      out.write("                                    <td width=\"3%\" align=\"right\" valign=\"middle\"><div align=\"right\">|</div></td>\r\n");
      out.write("                                    <td width=\"6%\" align=\"right\" valign=\"middle\"><div align=\"right\"><a href=\"mailto:\">轉寄</a></div></td>\r\n");
      out.write("                                    <td width=\"3%\" align=\"right\" valign=\"middle\"><div align=\"right\">|</div></td>\r\n");
      out.write("                                    <td width=\"11%\" align=\"right\" valign=\"middle\"><div align=\"right\">\r\n");
      out.write("                                            <div align=\"center\"><a href=\"FunctionList/updateTopic.jsp?titleid=");
      out.print(artical4.getTitleid());
      out.write("\"><img src=\"image/icon18_edit_allbkg.gif\" width=\"18\" height=\"18\" border=\"0\" /></a></div>\r\n");
      out.write("                                        </div>\r\n");
      out.write("                                    </td>\r\n");
      out.write("                                </tr>\r\n");
      out.write("                                \r\n");
      out.write("                            </table>\r\n");
      out.write("                            ");
}//對照(1)
      out.write("\r\n");
      out.write("                        </td>\r\n");
      out.write("                    </tr>\r\n");
      out.write("                </tr>\r\n");
      out.write("              \r\n");
      out.write("                \r\n");
      out.write("            </table>\r\n");
      out.write("            \r\n");
      out.write("           \r\n");
      out.write("                <table align=\"left\" cellspacing=\"0\">\r\n");
      out.write("                    <tr>\r\n");
      out.write("                        \r\n");
      out.write("                        ");
 for(int i=1;i<=pageCount;i++){//頁數總覽
                                out.println("<td>"+"<a href=index.jsp?curPage="+i+">"+i+"</a></td>");
                                
                        }
                            out.println("<td>"+"<a href=index.jsp?curPage="+1+">"+"<img src=image/first.gif border=0></a></td>");
                            out.println("<td>"+"<a href=index.jsp?curPage="+(nowPage-1)+">"+"<img src=image/previous.gif border=0></a></td>");
                            
                            
                            out.println("<td>"+"<a href=index.jsp?curPage="+(nowPage+1)+">"+"<img src=image/next.gif border=0></a></td>");
                            out.println("<td>"+"<a href=index.jsp?curPage="+pageCount+"><img src=image/last.gif border=0></a></td>");
                        
                        
      out.write("\r\n");
      out.write("                    </tr>\r\n");
      out.write("                </table>\r\n");
      out.write("           \r\n");
      out.write("            \r\n");
      out.write("            \r\n");
      out.write("            \r\n");
      out.write("        </div>\r\n");
      out.write("        </td>\r\n");
      out.write("        </tr>\r\n");
      out.write("        \r\n");
      out.write("        </table>\r\n");
      out.write("        </div>\r\n");
      out.write("        <script type=\"text/javascript\" language=\"javascript\" charset=\"utf-8\">\r\n");
      out.write("        // <![CDATA[\r\n");
      out.write("        //  Sortable.create('thelist', {overlap: 'horizontal', constraint: false});\r\n");
      out.write("        Position.includeScrollOffsets = true;\r\n");
      out.write("        Sortable.create('thelist2',{scroll:'left'});\r\n");
      out.write("        // ]]>\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("  \r\n");
      out.write("        </script>\r\n");
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
