<%@page contentType="text/html" import="Control.*,java.util.*,Friends.FriendsControl,Friends.FriendsVO"%>
<%@page pageEncoding="UTF-8" import="Page.*"%>


<%
String toolsPic = "image/icon18_wrench_allbkg.png";
String imagePath = "images/";
String url = "http://holmes2136.no-ip.org:8084/731Project/";
String css = "blog.css";
%>

<% 


String address = "";//取得好友網址
address = request.getParameter("friend");
if(address!=null){
    response.sendRedirect(address);
    
}

String username = (String)session.getAttribute("username");//取得會員資料
Register user = new Register();
User userInfo = user.getUserInfo(username);



%>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        
        <title></title>
        <script src="prototype.js" type="text/javascript"></script>
        <script src="scriptaculous.js" type="text/javascript"></script>
        <script src="unittest.js" type="text/javascript"></script>
        <script src="Scripts/AC_RunActiveContent.js" type="text/javascript"></script>
        <link href="blog.css" rel="stylesheet" type="text/css" />
        <link rel="SHORTCUT ICON" href="favicon.ico"/>
        <style type="text/css">
            <!--
body {
	margin-left: 0px;
	margin-top: 0px;
	margin-right: 0px;
	margin-bottom: 0px;
}
            -->
        </style>
        <script language="JavaScript">
            <!--
                function divChange(x){
                    
                    document.getElementById("li"+x).style.border='dotted';
                    document.getElementById("li"+x).style.borderColor='#CCCCCC';
                    
                }
                
                function silent(x){
                document.getElementById("li"+x).style.border = 'none';
                }
                
                function cursor(x){
                    document.getElementById("li"+x).style.cursor = 'move';
                }
            -->
            
        </script>
    </head>
    
    
    <div id="top">
        <iframe src="TopFunction.jsp" height="40" width="1024" scrolling="no" marginheight="0" marginwidth="0" frameborder="0"></iframe>
    </div>
    <div id="content">
        <div id="nofunction">
            
        </div>
        <div id="left" style="position:relative;">
            <ul id="thelist2" style="padding: 0px;list-style-type:none">
                <li id="li1"  onmouseover="cursor(1)" onmousedown="divChange(1)"  onmouseout="silent(1)"><div id="flash">
                        <script type="text/javascript">
AC_FL_RunContent( 'codebase','http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,28,0','width','113','height','100','align','left','src','HB','quality','high','pluginspage','http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash','movie','HB' );
                        </script>
                        <noscript>
                            <object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,28,0" width="150" height="100" align="left">
                                <param name="movie" value="HB.swf" />
                                <param name="quality" value="high" />
                                <embed src="HB.swf" width="150" height="100" align="left" quality="high" pluginspage="http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash" type="application/x-shockwave-flash"></embed>
                            </object>
                        </noscript>
                        
                </div></li>
                
                <li id="li2" onmouseover="cursor(2)"  onmousedown="divChange(2)"  onmouseout="silent(2)"><div id="photoSticker">
                        <table>
                            <tr>
                                <td> <%if(userInfo.getPhoto()!=null){%> 
                                    <img src="images/<%=userInfo.getPhoto()%>" width="114" height="120" border="0" />
                                    <%}else{%>
                                    <img src="image/pili.jpg" width="114" height="120" border="0" />
                                    <%}%>
                                    <a href="<%=url%>index.jsp" onclick="window.open('http://holmes2136.no-ip.org:8084/731Project/upload/photo_sticker.jsp','大頭照設定',config='height=350,width=300')"><img src="<%=toolsPic%>" width="18" height="18" border="0" /></a>
                                </td>
                                
                            </tr>
                        </table>
                        
                </div></li>
                
                <li id="li3"onmouseover="cursor(3)" onmousedown="divChange(3)"  onmouseout="silent(3)"><div id="friends">
                        <table cellpadding="0" cellspacing="0">
                            <tr>
                                <td><form action="index.jsp" method="post" name="friends" id="friends">
                                        <select name="friend" id="friend" onChange="Jumping()">
                                            <option value="">好友列表</option>
                                            <option value="<%=url%>friends/friends.jsp">好友總覽</option>
                                            <%//左邊好友列表欄位
                                            FriendsControl control5 = new FriendsControl();
                                            Collection ret5 = control5.getAllFriends();
                                            Iterator it5 = ret5.iterator();
                                            while(it5.hasNext()){
                                            FriendsVO friends = (FriendsVO)it5.next();
                                            %>        
                                            
                                            <option value="<%=friends.getAddress()%>"><%=friends.getName()%></option>        
                                            
                                            <%}%>  
                                        </select>
                                          <a href="<%=url%>friends/friendsControl.jsp"><img src="<%=toolsPic%>" width="18" height="18" border="0" /></a>
                                </form></td>
                              
                            </tr>
                        </table>
                        
                </div></li>
                    
                <li id="li4"onmouseover="cursor(4)" onmousedown="divChange(4)"  onmouseout="silent(4)"><div id="newTopic">
                        <table>
                           
                                <%
                                
                                Control control3 = new Control();       //左邊最新文章欄位
                                Collection ret3 = control3.getNewArtical();
                                Iterator it3 = ret3.iterator();
                                while(it3.hasNext()){
                                    Artical artical3 = (Artical)it3.next();
                                    out.println("<tr>");
                                    out.println("<td><a href="+url+"topicDetail.jsp?titleid="+artical3.getTitleid()+">"+artical3.getTitle()+"</a></td>");
                                    out.println("</tr>");
                                }
                                
                                %>
                              
                            
                        </table>
                </div></li>
                
                <li id="li5"onmouseover="cursor(5)"onmousedown="divChange(5)" onmouseout="silent(5)"><div id="category">
                        <table>
                            <tr>
                                <td><form action="index.jsp" method="post" name="Category">
                                        <select name="categoryId" onChange="category()">
                                            <option value="">分類標籤</option>
                                            <%
                                            Control control2 = new Control();       //左邊分類文章欄位
                                            Collection ret2 = control2.getAllCategory();
                                            Iterator it2 = ret2.iterator();
                                            while(it2.hasNext()){
                                                Category category = (Category)it2.next();
                                            %>  
                                            <option value="<%=category.getCatid()%>"><%=category.getCatid()%></option>
                                            
                                            <%}%>
                                            
                                        </select>
                                </form>
                                 
                            </td>
                                <td> <a href="<%=url%>Category/CategoryControl.jsp"><img src="<%=toolsPic%>" width="18" height="18" border="0" /></a></td>
                            </tr>
                        </table>
                </div></li>
                
                <li id="li6"onmouseover="cursor(6)"onmousedown="divChange(6)"  onmouseout="silent(6)"><div id="categoryTopic">
                        <table>
                            <%
                            Control control8 = new Control();
                            Collection ret6 = control8.getAllArticalByCategory((String)request.getParameter("categoryId"));
                            Iterator it6 = ret6.iterator();
                            while(it6.hasNext()){
                                Artical artical6 = (Artical)it6.next();
                            
                            %>
                            
                            
                            <tr>
                                <td><a href="<%=url%>topicDetail.jsp?titleid=<%=artical6.getTitleid()%>"><%=artical6.getTitle()%></a></td>
                            </tr>
                            <%}%>
                        </table>
                </div></li>
                
                <li id="li7"onmouseover="cursor(7)"onmousedown="divChange(7)"  onmouseout="silent(7)"><div id="allTopic">
                        
                        <table>
                            <%    
                            Control control = new Control();   //左邊文章列表欄位取Title
                            Collection ret = control.leftGetAllArtical();
                            Iterator it = ret.iterator();
                            while(it.hasNext()){
                                Artical artical = (Artical)it.next();
                            %>
                            
                            <tr>
                                <td><a href="<%=url%>topicDetail.jsp?titleid=<%=artical.getTitleid()%>"><%=artical.getTitle()%></a></td>
                                
                            </tr>
                            
                            
                            <%}%>   
                        </table>
                </div></li>
                
            </ul>
        </div>
        <div id="right">
            <table width="651" border="0" align="left">
                <tr>
                    <td width="14" rowspan="2" bordercolor="0"><p>&nbsp;</p>
                        <p>&nbsp;</p>
                        <p>&nbsp;</p>
                        <p>&nbsp;</p>
                        <p>&nbsp;</p>
                        <p>&nbsp;</p>
                        <p>&nbsp;</p>
                        <p>&nbsp;</p>
                        <p>&nbsp;</p>
                        <p>&nbsp;</p>
                    <p>&nbsp;</p></td>
                    <td width="536" height="5">最新文章</td>
                    
                    <td width="79"><a href="<%=url%>addNewTopic/addNewTopic.jsp">新增文章</a></td>
                </tr>
                <tr>
                    <td colspan="2" valign="top"><table width="100%" bgcolor="#FFFFFF">
                            <%!
                            int pageCount;
                            %>
                            <%//分頁
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
                            %>
                            <table width="100%" class="tableline">
                                <tr>
                                    <td colspan="9" class="titleStyle">
                                        <%
                                        if(artical4.getTitle().length()>20){//文章標題超過20字便簡略
                                out.println("<a href=topicDetail.jsp?titleid="+artical4.getTitleid()+">"+artical4.getTitle().substring(0,20)+".......</a>");
                                
                                        } else{
                                out.println("<a href=topicDetail.jsp?titleid="+artical4.getTitleid()+">"+artical4.getTitle()+"</a>");
                                        }
                                        
                                        %>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="9">
                                        <%if(artical4.getContent().length()>40){//文章內容超過40字便簡略
                                        out.println(artical4.getContent().substring(0,40)+".............");
                                        }
                                        else{
                                        out.println(artical4.getContent());
                                        }
                                        
                                        %>
                                        
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="9" align="center" valign="middle"></td>
                                </tr>
                                <tr>
                                    <td width="41%" align="right" valign="middle"><div align="right"></div></td>
                                    <td width="6%" align="right" valign="middle"><span class="style7">Account</span></td>
                                    <td width="3%" align="right" valign="middle"><div align="right">|</div></td>
                                    <td width="6%" align="right" valign="middle"><div align="right"></div></td>
                                    <td width="21%" align="left" valign="middle"><div align="right"><%=artical4.getTime()%>發布</div></td>
                                    <td width="3%" align="right" valign="middle"><div align="right">|</div></td>
                                    <td width="6%" align="right" valign="middle"><div align="right"><a href="mailto:">轉寄</a></div></td>
                                    <td width="3%" align="right" valign="middle"><div align="right">|</div></td>
                                    <td width="11%" align="right" valign="middle"><div align="right">
                                            <div align="center"><a href="FunctionList/updateTopic.jsp?titleid=<%=artical4.getTitleid()%>"><img src="image/icon18_edit_allbkg.gif" width="18" height="18" border="0" /></a></div>
                                        </div>
                                    </td>
                                </tr>
                                
                            </table>
                            <%}//對照(1)%>
                        </td>
                    </tr>
                </tr>
              
                
            </table>
            
           
                <table align="left" cellspacing="0">
                    <tr>
                        
                        <% for(int i=1;i<=pageCount;i++){//頁數總覽
                                out.println("<td>"+"<a href=index.jsp?curPage="+i+">"+i+"</a></td>");
                                
                        }
                            out.println("<td>"+"<a href=index.jsp?curPage="+1+">"+"<img src=image/first.gif border=0></a></td>");
                            out.println("<td>"+"<a href=index.jsp?curPage="+(nowPage-1)+">"+"<img src=image/previous.gif border=0></a></td>");
                            
                            
                            out.println("<td>"+"<a href=index.jsp?curPage="+(nowPage+1)+">"+"<img src=image/next.gif border=0></a></td>");
                            out.println("<td>"+"<a href=index.jsp?curPage="+pageCount+"><img src=image/last.gif border=0></a></td>");
                        
                        %>
                    </tr>
                </table>
           
            
            
            
        </div>
        </td>
        </tr>
        
        </table>
        </div>
        <script type="text/javascript" language="javascript" charset="utf-8">
        // <![CDATA[
        //  Sortable.create('thelist', {overlap: 'horizontal', constraint: false});
        Position.includeScrollOffsets = true;
        Sortable.create('thelist2',{scroll:'left'});
        // ]]>


  
        </script>
    </div>
</html>
