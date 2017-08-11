<%@page contentType="text/html"import="Control.*,java.util.*,Friends.FriendsControl,Friends.FriendsVO"%>
<%@page pageEncoding="UTF-8"import="Page.*"%>


<%!

String toolsPic = "../image/icon18_wrench_allbkg.png";
String imagePath = "../images/";
String url = "http://holmes2136.no-ip.org:8084/731Project/";
String css = "../blog.css";
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
        
        <title>照片上傳</title>
        
        
        <link href="<%=css%>" rel="stylesheet" type="text/css" />
        
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
        <script type="text/javascript" src="../prototype.js"></script>
        
        
        
        
        
        
    </head>
    
    
    <div id="top">
        <iframe src="../TopFunction.jsp" frameborder="0" scrolling="no" height="40" width="1024"></iframe>
    </div>
    <div id="content">
        <div id="nofunction">
            
            
        </div>
       <div id="left">
            <table width="90%">
                <tr>
                    <td colspan="4"><p>
                            <script type="text/javascript">
AC_FL_RunContent( 'codebase','http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,28,0','width','113','height','100','align','left','src','HB','quality','high','pluginspage','http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash','movie','HB' );
                            </script>
                            <noscript>
                                <object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,28,0" width="113" height="100" align="left">
                                    <param name="movie" value="HB.swf" />
                                    <param name="quality" value="high" />
                                    <embed src="HB.swf" width="113" height="100" align="left" quality="high" pluginspage="http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash" type="application/x-shockwave-flash"></embed>
                                </object>
                            </noscript>
                        </p>
                    <p>&nbsp;</p></td>
                </tr>
                <tr>
                    <td colspan="4">MySpace</td>
                </tr>
                <tr>
                    <td colspan="3">
                        <%if(userInfo.getPhoto()!=null){%> 
                        <img src="<%=imagePath%><%=userInfo.getPhoto()%>" width="114" height="120" border="0" />
                        <%}else{%>
                        <img src="<%=imagePath%>pili.jpg" width="114" height="120" border="0" />
                        <%}%>    
                        
                        
                        
                        
                    </td>
                    <td width="18">&nbsp;</td>
                </tr>
                <tr>
                    <td colspan="3">&nbsp;</td>
                    <td><a href="index.jsp" onclick="window.open('http://localhost:8084/731Project/upload/photo_sticker.jsp','大頭照設定',config='height=350,width=300')"><img src="<%=toolsPic%>" alt="" width="18" height="18" border="0" /></a></td>
                </tr>
                <tr>
                    <td colspan="4"><a href="<%=url%>register.html">註冊</a></td>
                </tr>
                <tr>
                    <div id="login">
                        
                    </div>
                </tr>
                <tr>
                    <td width="30" align="center" valign="middle"><a href="http://holmes2136.no-ip.org:8084/731Project/index.jsp" class="tableline">首頁</a></td>
                    <td width="28" align="center" valign="middle" class="tableline"><a href="<%=url%>album/album.jsp">相簿</a></td>
                    <td colspan="2" align="center" valign="middle" class="tableline"><a href="<%=url%>upload/photoUpload.jsp">上傳照片</a></td>
                </tr>
                <tr>
                    <td colspan="4">
                        <form action="index.jsp" method="post" name="friends" id="friends">
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
                            
                        </form>
                    </td>
                </tr>
                <tr>
                    <td colspan="3" class="tableline">最新文章</td>
                    <td align="center"><a href=""><img src="<%=toolsPic%>" width="18" height="18" border="0" /></a></td>
                </tr>
                <tr>
                    <td colspan="4">
                        <div id="newtopic">
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
                    </div></td>
                </tr>
                <tr>
                    <td colspan="3" class="tableline">分類文章</td>
                    <td align="center"><a href="<%=url%>Category/CategoryControl.jsp"><img src="<%=toolsPic%>" alt="" width="18" height="18" border="0" /></a></td>
                </tr>
                <tr>
                    <td colspan="4">
                        <form action="index.jsp" method="post" name="Category">
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
                </tr>
                <tr>
                    <td colspan="4">
                        <div id="categoryTopic">
                            
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
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="3" class="tableline">所有文章列表</td>
                    <td align="center"><a href=""><img src="<%=toolsPic%>" alt="" width="18" height="18" border="0" /></a></td>
                </tr>
                <tr>
                    <td colspan="4">
                        <div id="alltopic">
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
                        </div>
                    </td>
                </tr>
            </table>
            <div id="googleMap">
              
                
            </div>
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
                    <td height="5" bgcolor="#FFFF00">照片上傳</td>
                </tr>
                <tr>
                    <td valign="top"><form action="uploadIframe.jsp?filename=" method="post" enctype="multipart/form-data" name="uploadForm" id="form4" target="preview">
                            <table width="100%" border="1" class="tableline">
                                <tr>
                                    <td width="15%"><div align="left">照片上傳：</div></td>
                                    <td width="85%">
                                        <div align="left">
                                            <input type="file" name="filename" id="fileField" id="filename">
                                            
                                    </div></td>
                                </tr>
                                <tr>
                                    <td colspan="2"><div id="previewPic">
                                            <iframe src="uploadIframe.jsp" width="650" height="100" frameborder="0" scrolling="no" name="preview"></iframe>
                                    </div></td>
                                </tr>
                                <tr>
                                    <td colspan="2"><div align="center" id="msg">
                                            <input type="submit" name="button2" id="button2" value="確認">
                                            <input type="submit" name="button3" id="button3" value="取消" />
                                    </div></td>
                                </tr>
                            </table>
                        </form>
                        
                    </td>
                </tr>
            </table>
        </div>
        <p></p>
    </div>
</html>
