<%@page contentType="text/html" import="Control.*,java.util.*"%>
<%@page pageEncoding="UTF-8"%>

<%!
    String css = "../blog.css";

%>
<%  //功能列pencial(1)
    Control control = new Control();
    Artical artical = control.getArticalDetail(request.getParameter("titleid"));
    

%>

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
        
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
    </head>
   <iframe src="http://localhost:8084/731Project/TopFunction.jsp" height="40" width="1024" scrolling="no" marginheight="0" marginwidth="0" frameborder="0"></iframe>
    <body background="../image/bg_paper_mid.jpg">
        <center>
            <form action="updateTopic_do.jsp" method="post">
                <table class="tableline" cellpadding="5" cellspacing="0">
                    <tr>
                        <td>標題</td>
                        <td><input type="text" name="title" value="<%=artical.getTitle()%>"></td>
                    </tr>
                    <tr>
                        <td>內容</td>
                        <td><textarea cols="40" name="content" rows="10"><%=artical.getContent()%></textarea></td>
                    </tr>
                    
                    <tr>
                        <table>
                       
                        <select name="category">
                            <option value=""><%=artical.getCategory()%></option>
                        <%
                            Collection ret = control.getAllCategory();
                            Iterator it = ret.iterator();
                            while(it.hasNext()){
                               Category category = (Category)it.next();
                        %>     
                          <option value="<%=category.getCatid()%>"><%=category.getCatid()%></option>
                          
                        <%}%>   
                        </select>
                        </table>
                    </tr>
                    <tr>
                        <input type="hidden" name="titleid" value="<%=artical.getTitleid()%>">
                        <td><input type="submit" value="送出"></td>
                    </tr>
                    
                </table>
                
            </form>
        </center>
    </body>
</html>
