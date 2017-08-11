<%@page contentType="text/html"import="Control.*,java.util.*,Friends.FriendsControl,Friends.FriendsVO"%>
<%@page pageEncoding="UTF-8" import="Page.*"%>

<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>HB部落格首頁</title>
        <style type="text/css">
            <!--
#apDiv1 {
	position:absolute;
	left:23px;
	top:39px;
	width:193px;
	height:38px;
	z-index:1;
}
#apDiv2 {
	position:absolute;
	left:40px;
	top:54px;
	width:172px;
	height:34px;
	z-index:1;
}
body {
	background-image: url(image/blackg2.jpg);
	background-repeat: repeat-y;
	background-color: #FFFF00;
	color: #000000;
}
.style1 {
	font-size: 24px;
	font-weight: bold;
	color: #000000;
}
#apDiv3 {
	position:absolute;
	left:233px;
	top:282px;
	width:170px;
	height:135px;
	z-index:2;
	background-color: #FFFFFF;
}
#apDiv4 {
	position:absolute;
	left:15px;
	top:212px;
	width:187px;
	height:442px;
	z-index:2;
	background-color: #FFFFFF;
}
#apDiv5 {
	position:absolute;
	left:15px;
	top:675px;
	width:187px;
	height:78px;
	z-index:3;
	background-color: #FFFFFF;
}
#apDiv6 {
	position:absolute;
	left:18px;
	top:770px;
	width:185px;
	height:78px;
	z-index:4;
	background-color: #FFFFFF;
}
#apDiv7 {
	position:absolute;
	left:17px;
	top:862px;
	width:187px;
	height:93px;
	z-index:5;
	background-color: #FFFFFF;
}
            -->
        </style>
        <script language="JavaScript">
    <!--
    function Jumping(){
        document.friends.submit();
        return;
       
    }
   
 -->  
 
 <!--
    function category(){
        document.Category.submit();
        return;
       
    }
   
 --> 
        </script>
        <link rel="SHORTCUT ICON" href="favicon.jpg"/>
        <link href="addtional.css" rel="stylesheet" type="text/css" />
    </head>
    
    <body>
        <div id="apDiv2">HB部落格</div>
        <div id="apDiv4">
            <div>My Space</div>
            <div>
                <p><img src="image/pili.jpg" width="150" height="134" /></p>
            </div>
            <div>
                <%if(session.getAttribute("username")!=null){
                
                %>
                <%@ include  file="Login/loginPanel1.jsp"%>
                <%} else{%>   
                
                <%@ include  file="Login/loginPanel.jsp" %>  
                <%
                }
                %>
            </div>
            <div>
                <blockquote>
                    <p>好友列表   
                        <form action="index.jsp" method="post" name="friends">
                            <select name="friend" id="select" onChange="Jumping()">
                                <option value="">好友列表</option>
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
                    </p>
                </blockquote>
            </div>
            <div></div>
        </div>
        <div id="apDiv5">
            <div>最新文章</div>
            <table>
                
                <%
                
                Control control3 = new Control();       //左邊最新文章欄位
                Collection ret3 = control3.getNewArtical();
                Iterator it3 = ret3.iterator();
                while(it3.hasNext()){
                    Artical artical3 = (Artical)it3.next();
                    out.println("<tr>");
                    out.println("<td><a href=topicDetail.jsp?titleid="+artical3.getTitleid()+">"+artical3.getTitle()+"</a></td>");
                    out.println("</tr>");
                }
                
                %>
            </table>          
        </div>
        <div id="apDiv6">
            <div>分類文章</div>
            <table>
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
                        <option value="<%=category.getCatid()%>"><%=category.getName()%></option>
                        
                        <%}%>
                        
                    </select>
                </form>
                <tr>
                    <table>
                        <%//顯示分類之下的文章
                        Control control6 = new Control();
                        Collection ret6= control6.getAllArticalByCategory((String)request.getParameter("categoryId"));
                        Iterator it6 = ret6.iterator();
                        while(it6.hasNext()){
                            Artical artical6 = (Artical)it6.next();
                            
                        %>
                        
                        
                        <tr>
                            <td><%=artical6.getTitle()%></td>
                        </tr>
                        <%}%>
                    </table>
                </tr>
            </table>
        </div>
        <div id="apDiv7">
            <div>文章列表</div>
            <table>
                <%    
                Control control = new Control();   //左邊文章列表欄位取Title
                Collection ret = control.leftGetAllArtical();
                Iterator it = ret.iterator();
                while(it.hasNext()){
                    Artical artical = (Artical)it.next();
                %>
                
                <tr>
                    <td><a href="topicDetail.jsp?titleid=<%=artical.getTitleid()%>"><%=artical.getTitle()%></a></td>
                    
                </tr>
                
                
                <%}%>   
            </table>
        </div>
        <table width="105%" height="1181" border="1">
            <tr>
                <td height="70" valign="top" bgcolor="#FF9900"><div>
                        <p class="style1"></p>
                        <p>&nbsp;</p>
                </div></td>
            </tr>
            <tr>
                <td valign="top"><p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    
                    <div> 
                        
                        <table width="100%" height="573">
                            <tr>
                                <td width="19%" rowspan="2" valign="top"><p>&nbsp;</p>
                                    <p>&nbsp;</p>
                                    <p>&nbsp;</p>
                                    <p>&nbsp;</p>
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
                                <td width="11%" rowspan="2" valign="top">&nbsp;</td>
                                
                                <td valign="top">
                                    <table align="right"><tr><td><a href="addNewTopic/addNewTopic.jsp">新增文章</a></td></tr></table>
                                    
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
                                    
                                    
                                    
                                    
                                    
                                    
                                    
                                    
                                    
                                    
                                    
                                    <table width="100%" height="116" border="0" bordercolor="#FFFFFF">
                                        <tr>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td><h2><%
                                                    if(artical4.getTitle().length()>20){//文章標題超過20字便簡略
                                        out.println("<a href=topicDetail.jsp?titleid="+artical4.getTitleid()+">"+"<font color=#000000>"+artical4.getTitle().substring(0,20)+"</font>"+"</a>........");
                                        
                                                    } else{
                                        out.println("<font color=#000000><a href=topicDetail.jsp?titleid="+artical4.getTitleid()+">"+"<font color=#000000>"+artical4.getTitle()+"</font>"+"</a>");
                                                    }
                                                    
                                            %></h2></td>
                                        </tr>
                                        <tr>
                                            <td><%if(artical4.getContent().length()>40){//文章內容超過40字便簡略
                                                out.println(artical4.getContent().substring(0,40)+".............");
                                                }
                                                else{
                                                out.println(artical4.getContent());
                                                }
                                                
                                            %></td>
                                        </tr>
                                        <tr>
                                            <td><table width="683">
                                                    <tr>
                                                        <td></td>    
                                                    </tr>
                                                    <tr>
                                                        <td></td>
                                                    </tr>
                                                    <tr>
                                                        <td width="154" align="center" valign="middle">Account於HB部落格</td>
                                                        <td width="12" align="center" valign="middle">|</td>
                                                        <td width="120" align="center" valign="middle"><%=artical4.getTime()%>發布</td>
                                                        <td width="14" align="center" valign="middle">|</td>
                                                        <td width="60" align="center" valign="middle"><a href="FunctionList/response.jsp?titleid=<%=artical4.getTitleid()%>">回應(X)</a></td>
                                                        <td width="10" align="center" valign="middle">|</td>
                                                        <td width="62" align="center" valign="middle">引用(X)</td>
                                                        <td width="10" align="center" valign="middle">|</td>
                                                        <td width="250" align="left" valign="middle"><a href="mailto:">轉寄</a></td>
                                                        <td width="250" align="left" valign="middle"><a href="FunctionList/updateTopic.jsp?titleid=<%=artical4.getTitleid()%>"><img src="image/icon18_edit_allbkg.gif" border="0"></a></td>
                                                    </tr>                                                                                                           <!--pencial(修改)-->
                  
                                                </table>
                                                <hr>
                                            </td>
                                        </tr>
                                </table><%}//對照(1)%>            <p>&nbsp;</p></td>            
                                
                            </tr>
                            <td>
                                <table>
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
                            </td>
                            <tr>
                                
                                <td height="250" valign="top">&nbsp;</td>
                                
                            </tr>
                        </table>
                        <p>&nbsp;</p>
                        <p>&nbsp;</p>
                        <p>&nbsp;</p>
                        <p>&nbsp;</p>
                </div>    </td>
            </tr>
        </table>
    </body>
</html>
