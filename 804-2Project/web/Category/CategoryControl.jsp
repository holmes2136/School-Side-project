<%@page contentType="text/html" import="Control.*,java.util.*"%>
<%@page pageEncoding="UTF-8"%>
<%@ taglib  prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>


<%!
    String css = "../blog.css";
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
<body background="../image/bg_minidots.gif">
<center>
<form action="deleteCategory.jsp" method="post">
<table width="500" class="tableline">
<tr >
    <td>刪除</td>
    <td>分類名稱</td>
    <td>分類描述</td>
    <td><a href="addCategory.jsp">新增分類</td>
    
</tr>
<%
Control control = new Control();
Collection ret = control.getAllCategory();
Iterator it = ret.iterator();
while(it.hasNext()){
    Category category = (Category)it.next();
%>         
<tr>
    <td><input type="checkbox" name="category" value="<%=category.getCatid()%>"></td>
    <td><%=category.getCatid()%></td>
    <td><%=category.getDescn()%></t<td>
    
</tr>


<%}%>
<tr><td><input type="submit" value="送出"></td></tr>
</table> 

</form>
</center>

</body>
</html>
