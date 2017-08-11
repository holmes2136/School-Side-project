package org.apache.jsp;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import Control.*;
import java.util.*;
import Friends.FriendsControl;
import Friends.FriendsVO;
import Page.*;

public final class reference_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {


                                    int pageCount;
                                    
  private static java.util.List _jspx_dependants;

  static {
    _jspx_dependants = new java.util.ArrayList(2);
    _jspx_dependants.add("/Login/loginPanel1.jsp");
    _jspx_dependants.add("/Login/loginPanel.jsp");
  }

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
      out.write("<html xmlns=\"http://www.w3.org/1999/xhtml\">\r\n");
      out.write("    <head>\r\n");
      out.write("        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />\r\n");
      out.write("        <title>HB部落格首頁</title>\r\n");
      out.write("        <style type=\"text/css\">\r\n");
      out.write("            <!--\r\n");
      out.write("#apDiv1 {\r\n");
      out.write("\tposition:absolute;\r\n");
      out.write("\tleft:23px;\r\n");
      out.write("\ttop:39px;\r\n");
      out.write("\twidth:193px;\r\n");
      out.write("\theight:38px;\r\n");
      out.write("\tz-index:1;\r\n");
      out.write("}\r\n");
      out.write("#apDiv2 {\r\n");
      out.write("\tposition:absolute;\r\n");
      out.write("\tleft:40px;\r\n");
      out.write("\ttop:54px;\r\n");
      out.write("\twidth:172px;\r\n");
      out.write("\theight:34px;\r\n");
      out.write("\tz-index:1;\r\n");
      out.write("}\r\n");
      out.write("body {\r\n");
      out.write("\tbackground-image: url(image/blackg2.jpg);\r\n");
      out.write("\tbackground-repeat: repeat-y;\r\n");
      out.write("\tbackground-color: #FFFF00;\r\n");
      out.write("\tcolor: #000000;\r\n");
      out.write("}\r\n");
      out.write(".style1 {\r\n");
      out.write("\tfont-size: 24px;\r\n");
      out.write("\tfont-weight: bold;\r\n");
      out.write("\tcolor: #000000;\r\n");
      out.write("}\r\n");
      out.write("#apDiv3 {\r\n");
      out.write("\tposition:absolute;\r\n");
      out.write("\tleft:233px;\r\n");
      out.write("\ttop:282px;\r\n");
      out.write("\twidth:170px;\r\n");
      out.write("\theight:135px;\r\n");
      out.write("\tz-index:2;\r\n");
      out.write("\tbackground-color: #FFFFFF;\r\n");
      out.write("}\r\n");
      out.write("#apDiv4 {\r\n");
      out.write("\tposition:absolute;\r\n");
      out.write("\tleft:15px;\r\n");
      out.write("\ttop:212px;\r\n");
      out.write("\twidth:187px;\r\n");
      out.write("\theight:442px;\r\n");
      out.write("\tz-index:2;\r\n");
      out.write("\tbackground-color: #FFFFFF;\r\n");
      out.write("}\r\n");
      out.write("#apDiv5 {\r\n");
      out.write("\tposition:absolute;\r\n");
      out.write("\tleft:15px;\r\n");
      out.write("\ttop:675px;\r\n");
      out.write("\twidth:187px;\r\n");
      out.write("\theight:78px;\r\n");
      out.write("\tz-index:3;\r\n");
      out.write("\tbackground-color: #FFFFFF;\r\n");
      out.write("}\r\n");
      out.write("#apDiv6 {\r\n");
      out.write("\tposition:absolute;\r\n");
      out.write("\tleft:18px;\r\n");
      out.write("\ttop:770px;\r\n");
      out.write("\twidth:185px;\r\n");
      out.write("\theight:78px;\r\n");
      out.write("\tz-index:4;\r\n");
      out.write("\tbackground-color: #FFFFFF;\r\n");
      out.write("}\r\n");
      out.write("#apDiv7 {\r\n");
      out.write("\tposition:absolute;\r\n");
      out.write("\tleft:17px;\r\n");
      out.write("\ttop:862px;\r\n");
      out.write("\twidth:187px;\r\n");
      out.write("\theight:93px;\r\n");
      out.write("\tz-index:5;\r\n");
      out.write("\tbackground-color: #FFFFFF;\r\n");
      out.write("}\r\n");
      out.write("            -->\r\n");
      out.write("        </style>\r\n");
      out.write("        <script language=\"JavaScript\">\r\n");
      out.write("    <!--\r\n");
      out.write("    function Jumping(){\r\n");
      out.write("        document.friends.submit();\r\n");
      out.write("        return;\r\n");
      out.write("       \r\n");
      out.write("    }\r\n");
      out.write("   \r\n");
      out.write(" -->  \r\n");
      out.write(" \r\n");
      out.write(" <!--\r\n");
      out.write("    function category(){\r\n");
      out.write("        document.Category.submit();\r\n");
      out.write("        return;\r\n");
      out.write("       \r\n");
      out.write("    }\r\n");
      out.write("   \r\n");
      out.write(" --> \r\n");
      out.write("        </script>\r\n");
      out.write("        <link rel=\"SHORTCUT ICON\" href=\"favicon.jpg\"/>\r\n");
      out.write("        <link href=\"addtional.css\" rel=\"stylesheet\" type=\"text/css\" />\r\n");
      out.write("    </head>\r\n");
      out.write("    \r\n");
      out.write("    <body>\r\n");
      out.write("        <div id=\"apDiv2\">HB部落格</div>\r\n");
      out.write("        <div id=\"apDiv4\">\r\n");
      out.write("            <div>My Space</div>\r\n");
      out.write("            <div>\r\n");
      out.write("                <p><img src=\"image/pili.jpg\" width=\"150\" height=\"134\" /></p>\r\n");
      out.write("            </div>\r\n");
      out.write("            <div>\r\n");
      out.write("                ");
if(session.getAttribute("username")!=null){
                
                
      out.write("\r\n");
      out.write("                ");
      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("<html>\n");
      out.write("    <head>\n");
      out.write("        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n");
      out.write("        <title>JSP Page</title>\n");
      out.write("    </head>\n");
      out.write("    <body>\n");
      out.write("        <td>\n");
      out.write("        \n");
      out.write("        <form action=\"Login/sessionDestroy.jsp\" method=\"post\">\n");
      out.write("            <input type=\"submit\" name=\"sessionDestroy\" value=\"登出\">\n");
      out.write("            \n");
      out.write("        </form>\n");
      out.write("        \n");
      out.write("        <li> <a href=\"friends/friends.jsp\">好友</a></li>\n");
      out.write("        <li><a href=\"http://localhost:8084/FormalProject/controlPanel.jsp\">控制台</a></li>\n");
      out.write("            \n");
      out.write("            \n");
      out.write("       \n");
      out.write("        </td>\n");
      out.write("    </body>\n");
      out.write("</html>\n");
      out.write("\r\n");
      out.write("                ");
} else{
      out.write("   \r\n");
      out.write("                \r\n");
      out.write("                ");
      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("<!--\n");
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
      out.write("-->\n");
      out.write("</style>\n");
      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("<html>\n");
      out.write("    <head>\n");
      out.write("        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n");
      out.write("        <title>JSP Page</title>\n");
      out.write("    </head>\n");
      out.write("    <body>\n");
      out.write("        <td colspan=\"4\" align=\"center\"><form id=\"form1\" name=\"form1\" method=\"post\" action=\"login.action\">\n");
      out.write("                <p align=\"left\">帳號\n");
      out.write("                    <input name=\"username\" type=\"text\" id=\"textfield\" size=\"10\" />\n");
      out.write("                </p>\n");
      out.write("                <p align=\"left\">\n");
      out.write("                    密碼 \n");
      out.write("                    <input name=\"password\" type=\"password\" id=\"textfield2\" size=\"10\" />\n");
      out.write("                </p>\n");
      out.write("                <p align=\"center\">\n");
      out.write("                    <input name=\"button\" type=\"submit\" id=\"button\" value=\"登入\" border=\"0\" />\n");
      out.write("                </p>\n");
      out.write("        </form></td>\n");
      out.write("    </body>\n");
      out.write("</html>\n");
      out.write("  \r\n");
      out.write("                ");

                }
                
      out.write("\r\n");
      out.write("            </div>\r\n");
      out.write("            <div>\r\n");
      out.write("                <blockquote>\r\n");
      out.write("                    <p>好友列表   \r\n");
      out.write("                        <form action=\"index.jsp\" method=\"post\" name=\"friends\">\r\n");
      out.write("                            <select name=\"friend\" id=\"select\" onChange=\"Jumping()\">\r\n");
      out.write("                                <option value=\"\">好友列表</option>\r\n");
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
      out.write("                        </form>\r\n");
      out.write("                    </p>\r\n");
      out.write("                </blockquote>\r\n");
      out.write("            </div>\r\n");
      out.write("            <div></div>\r\n");
      out.write("        </div>\r\n");
      out.write("        <div id=\"apDiv5\">\r\n");
      out.write("            <div>最新文章</div>\r\n");
      out.write("            <table>\r\n");
      out.write("                \r\n");
      out.write("                ");

                
                Control control3 = new Control();       //左邊最新文章欄位
                Collection ret3 = control3.getNewArtical();
                Iterator it3 = ret3.iterator();
                while(it3.hasNext()){
                    Artical artical3 = (Artical)it3.next();
                    out.println("<tr>");
                    out.println("<td><a href=topicDetail.jsp?titleid="+artical3.getTitleid()+">"+artical3.getTitle()+"</a></td>");
                    out.println("</tr>");
                }
                
                
      out.write("\r\n");
      out.write("            </table>          \r\n");
      out.write("        </div>\r\n");
      out.write("        <div id=\"apDiv6\">\r\n");
      out.write("            <div>分類文章</div>\r\n");
      out.write("            <table>\r\n");
      out.write("                    <form action=\"index.jsp\" method=\"post\" name=\"Category\">\r\n");
      out.write("                    <select name=\"categoryId\" onChange=\"category()\">\r\n");
      out.write("                        <option value=\"\">分類標籤</option>\r\n");
      out.write("                        ");

                        Control control2 = new Control();       //左邊分類文章欄位
                        Collection ret2 = control2.getAllCategory();
                        Iterator it2 = ret2.iterator();
                        while(it2.hasNext()){
                            Category category = (Category)it2.next();
                        
      out.write("  \r\n");
      out.write("                        <option value=\"");
      out.print(category.getCatid());
      out.write('"');
      out.write('>');
      out.print(category.getName());
      out.write("</option>\r\n");
      out.write("                        \r\n");
      out.write("                        ");
}
      out.write("\r\n");
      out.write("                        \r\n");
      out.write("                    </select>\r\n");
      out.write("                </form>\r\n");
      out.write("                <tr>\r\n");
      out.write("                    <table>\r\n");
      out.write("                        ");
//顯示分類之下的文章
                        Control control6 = new Control();
                        Collection ret6= control6.getAllArticalByCategory((String)request.getParameter("categoryId"));
                        Iterator it6 = ret6.iterator();
                        while(it6.hasNext()){
                            Artical artical6 = (Artical)it6.next();
                            
                        
      out.write("\r\n");
      out.write("                        \r\n");
      out.write("                        \r\n");
      out.write("                        <tr>\r\n");
      out.write("                            <td>");
      out.print(artical6.getTitle());
      out.write("</td>\r\n");
      out.write("                        </tr>\r\n");
      out.write("                        ");
}
      out.write("\r\n");
      out.write("                    </table>\r\n");
      out.write("                </tr>\r\n");
      out.write("            </table>\r\n");
      out.write("        </div>\r\n");
      out.write("        <div id=\"apDiv7\">\r\n");
      out.write("            <div>文章列表</div>\r\n");
      out.write("            <table>\r\n");
      out.write("                ");
    
                Control control = new Control();   //左邊文章列表欄位取Title
                Collection ret = control.leftGetAllArtical();
                Iterator it = ret.iterator();
                while(it.hasNext()){
                    Artical artical = (Artical)it.next();
                
      out.write("\r\n");
      out.write("                \r\n");
      out.write("                <tr>\r\n");
      out.write("                    <td><a href=\"topicDetail.jsp?titleid=");
      out.print(artical.getTitleid());
      out.write('"');
      out.write('>');
      out.print(artical.getTitle());
      out.write("</a></td>\r\n");
      out.write("                    \r\n");
      out.write("                </tr>\r\n");
      out.write("                \r\n");
      out.write("                \r\n");
      out.write("                ");
}
      out.write("   \r\n");
      out.write("            </table>\r\n");
      out.write("        </div>\r\n");
      out.write("        <table width=\"105%\" height=\"1181\" border=\"1\">\r\n");
      out.write("            <tr>\r\n");
      out.write("                <td height=\"70\" valign=\"top\" bgcolor=\"#FF9900\"><div>\r\n");
      out.write("                        <p class=\"style1\"></p>\r\n");
      out.write("                        <p>&nbsp;</p>\r\n");
      out.write("                </div></td>\r\n");
      out.write("            </tr>\r\n");
      out.write("            <tr>\r\n");
      out.write("                <td valign=\"top\"><p>&nbsp;</p>\r\n");
      out.write("                    <p>&nbsp;</p>\r\n");
      out.write("                    <p>&nbsp;</p>\r\n");
      out.write("                    <p>&nbsp;</p>\r\n");
      out.write("                    \r\n");
      out.write("                    <div> \r\n");
      out.write("                        \r\n");
      out.write("                        <table width=\"100%\" height=\"573\">\r\n");
      out.write("                            <tr>\r\n");
      out.write("                                <td width=\"19%\" rowspan=\"2\" valign=\"top\"><p>&nbsp;</p>\r\n");
      out.write("                                    <p>&nbsp;</p>\r\n");
      out.write("                                    <p>&nbsp;</p>\r\n");
      out.write("                                    <p>&nbsp;</p>\r\n");
      out.write("                                    <p>&nbsp;</p>\r\n");
      out.write("                                    <p>&nbsp;</p>\r\n");
      out.write("                                    <p>&nbsp;</p>\r\n");
      out.write("                                    <p>&nbsp;</p>\r\n");
      out.write("                                    <p>&nbsp;</p>\r\n");
      out.write("                                    <p>&nbsp;</p>\r\n");
      out.write("                                    <p>&nbsp;</p>\r\n");
      out.write("                                    <p>&nbsp;</p>\r\n");
      out.write("                                    <p>&nbsp;</p>\r\n");
      out.write("                                <p>&nbsp;</p></td>\r\n");
      out.write("                                <td width=\"11%\" rowspan=\"2\" valign=\"top\">&nbsp;</td>\r\n");
      out.write("                                \r\n");
      out.write("                                <td valign=\"top\">\r\n");
      out.write("                                    <table align=\"right\"><tr><td><a href=\"addNewTopic/addNewTopic.jsp\">新增文章</a></td></tr></table>\r\n");
      out.write("                                    \r\n");
      out.write("                                    ");
      out.write("\r\n");
      out.write("                                    ");
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
      out.write("                                    \r\n");
      out.write("                                    \r\n");
      out.write("                                    \r\n");
      out.write("                                    \r\n");
      out.write("                                    \r\n");
      out.write("                                    \r\n");
      out.write("                                    \r\n");
      out.write("                                    \r\n");
      out.write("                                    \r\n");
      out.write("                                    \r\n");
      out.write("                                    \r\n");
      out.write("                                    <table width=\"100%\" height=\"116\" border=\"0\" bordercolor=\"#FFFFFF\">\r\n");
      out.write("                                        <tr>\r\n");
      out.write("                                            <td></td>\r\n");
      out.write("                                        </tr>\r\n");
      out.write("                                        <tr>\r\n");
      out.write("                                            <td><h2>");

                                                    if(artical4.getTitle().length()>20){//文章標題超過20字便簡略
                                        out.println("<a href=topicDetail.jsp?titleid="+artical4.getTitleid()+">"+"<font color=#000000>"+artical4.getTitle().substring(0,20)+"</font>"+"</a>........");
                                        
                                                    } else{
                                        out.println("<font color=#000000><a href=topicDetail.jsp?titleid="+artical4.getTitleid()+">"+"<font color=#000000>"+artical4.getTitle()+"</font>"+"</a>");
                                                    }
                                                    
                                            
      out.write("</h2></td>\r\n");
      out.write("                                        </tr>\r\n");
      out.write("                                        <tr>\r\n");
      out.write("                                            <td>");
if(artical4.getContent().length()>40){//文章內容超過40字便簡略
                                                out.println(artical4.getContent().substring(0,40)+".............");
                                                }
                                                else{
                                                out.println(artical4.getContent());
                                                }
                                                
                                            
      out.write("</td>\r\n");
      out.write("                                        </tr>\r\n");
      out.write("                                        <tr>\r\n");
      out.write("                                            <td><table width=\"683\">\r\n");
      out.write("                                                    <tr>\r\n");
      out.write("                                                        <td></td>    \r\n");
      out.write("                                                    </tr>\r\n");
      out.write("                                                    <tr>\r\n");
      out.write("                                                        <td></td>\r\n");
      out.write("                                                    </tr>\r\n");
      out.write("                                                    <tr>\r\n");
      out.write("                                                        <td width=\"154\" align=\"center\" valign=\"middle\">Account於HB部落格</td>\r\n");
      out.write("                                                        <td width=\"12\" align=\"center\" valign=\"middle\">|</td>\r\n");
      out.write("                                                        <td width=\"120\" align=\"center\" valign=\"middle\">");
      out.print(artical4.getTime());
      out.write("發布</td>\r\n");
      out.write("                                                        <td width=\"14\" align=\"center\" valign=\"middle\">|</td>\r\n");
      out.write("                                                        <td width=\"60\" align=\"center\" valign=\"middle\"><a href=\"FunctionList/response.jsp?titleid=");
      out.print(artical4.getTitleid());
      out.write("\">回應(X)</a></td>\r\n");
      out.write("                                                        <td width=\"10\" align=\"center\" valign=\"middle\">|</td>\r\n");
      out.write("                                                        <td width=\"62\" align=\"center\" valign=\"middle\">引用(X)</td>\r\n");
      out.write("                                                        <td width=\"10\" align=\"center\" valign=\"middle\">|</td>\r\n");
      out.write("                                                        <td width=\"250\" align=\"left\" valign=\"middle\"><a href=\"mailto:\">轉寄</a></td>\r\n");
      out.write("                                                        <td width=\"250\" align=\"left\" valign=\"middle\"><a href=\"FunctionList/updateTopic.jsp?titleid=");
      out.print(artical4.getTitleid());
      out.write("\"><img src=\"image/icon18_edit_allbkg.gif\" border=\"0\"></a></td>\r\n");
      out.write("                                                    </tr>                                                                                                           <!--pencial(修改)-->\r\n");
      out.write("                  \r\n");
      out.write("                                                </table>\r\n");
      out.write("                                                <hr>\r\n");
      out.write("                                            </td>\r\n");
      out.write("                                        </tr>\r\n");
      out.write("                                </table>");
}//對照(1)
      out.write("            <p>&nbsp;</p></td>            \r\n");
      out.write("                                \r\n");
      out.write("                            </tr>\r\n");
      out.write("                            <td>\r\n");
      out.write("                                <table>\r\n");
      out.write("                                    <tr>\r\n");
      out.write("                                        ");
 for(int i=1;i<=pageCount;i++){//頁數總覽
                                        out.println("<td>"+"<a href=index.jsp?curPage="+i+">"+i+"</a></td>");
                                        
                                        }
                                    out.println("<td>"+"<a href=index.jsp?curPage="+1+">"+"<img src=image/first.gif border=0></a></td>");
                                    out.println("<td>"+"<a href=index.jsp?curPage="+(nowPage-1)+">"+"<img src=image/previous.gif border=0></a></td>");
                                    
                                    
                                    out.println("<td>"+"<a href=index.jsp?curPage="+(nowPage+1)+">"+"<img src=image/next.gif border=0></a></td>");
                                    out.println("<td>"+"<a href=index.jsp?curPage="+pageCount+"><img src=image/last.gif border=0></a></td>");
                                        
                                        
      out.write("\r\n");
      out.write("                                        \r\n");
      out.write("                                    </tr>\r\n");
      out.write("                                </table>\r\n");
      out.write("                            </td>\r\n");
      out.write("                            <tr>\r\n");
      out.write("                                \r\n");
      out.write("                                <td height=\"250\" valign=\"top\">&nbsp;</td>\r\n");
      out.write("                                \r\n");
      out.write("                            </tr>\r\n");
      out.write("                        </table>\r\n");
      out.write("                        <p>&nbsp;</p>\r\n");
      out.write("                        <p>&nbsp;</p>\r\n");
      out.write("                        <p>&nbsp;</p>\r\n");
      out.write("                        <p>&nbsp;</p>\r\n");
      out.write("                </div>    </td>\r\n");
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
