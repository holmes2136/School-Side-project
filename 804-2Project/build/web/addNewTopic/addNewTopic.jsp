<%@page contentType="text/html" import="net.fckeditor.*,java.text.*,java.util.*,Control.*"%>
<%@page pageEncoding="UTF-8"%>
<%@ taglib  prefix="FCK" uri="http://java.fckeditor.net" %>


<%!
    String css = "../blog.css";
%>
<%
SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:MM:SS");
Calendar now = Calendar.getInstance();
String date = sdf.format(now.getTime());
%>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
        
        <link href="<%=css%>" rel="stylesheet" type="text/css"/>
        
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
       
        <form action="addNewTopic_do.jsp" method="post">
            <table width="800" class="tableline2"  cellpadding="5" cellspacing="0">
                <tr><td><font color="#FFCC00">標題 <input type=text name="title" class="tableline2"></td></tr>
                <tr><td><FCK:editor instanceName="EditorDefault">
                            <jsp:attribute name="value">This is some <strong>sample text
                                </strong>. You are using <a href="http://www.fckeditor.net">
                                FCKeditor</a>.
                            </jsp:attribute>
                </FCK:editor></td></tr>
                <tr><td><input type=text name="time" value="<%=date%>" height="10" class="tableline2"></td></tr>
                <tr><td>
                        <select name="category"  class="tableline2">
                            <option value="">分類清單</option>
                            <option value="">分類總覽</option>
                            <%
                            Control control = new Control();
                            Collection ret = control.getAllCategory();
                            Iterator it = ret.iterator();
                            while(it.hasNext()){
                                Category category = (Category)it.next();
                            %>    
                            <option value="<%=category.getCatid()%>"><%=category.getCatid()%></option>
                            
                            <%}%>
                            
                            
                        </select>
                </td></tr>
                <tr><td><input type=submit value="送出"></td></tr>
            </table>
        </form>
        
    </body>
    
</html>
