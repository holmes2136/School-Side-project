<%@page contentType="text/html" import="java.util.*,Control.*,java.text.*"%>
<%@page pageEncoding="UTF-8"%>

<%!
    String css = "../blog.css";
%>
<%!//功能列回應(1)
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:MM:SS");
        Calendar now = Calendar.getInstance();
        String date = sdf.format(now.getTime());

%>
<%
    Control control = new Control();
    Artical artical = control.getArticalDetail(request.getParameter("titleid"));

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
    <body background="../image/bg_minidots.gif"">
        <center>
<div id="replyForm">
  <form  name="artical" method="post" action="reply_do.jsp">
    <table width="743" class="tableline">
      <tr>
        <td width="58" align="center" valign="middle">標題</td>
        <td width="673"><input type="text" name="title" value="RE:<%=artical.getTitle()%>"/>
        </td>
      </tr>
      <tr>
        <td align="center" valign="middle">內容</td>
        <td><textarea  name="content" cols="45" rows="5"><%=artical.getContent()%></textarea></td>
      </tr>
      <tr>
        <td align="center" valign="middle">回覆時間</td>
        <td><input type="text" name="time"  value="<%=date%>" /></td>
      </tr>
      <tr>
        <td align="center" valign="middle">暱稱</td>
        <td><input type="text" name="author"/></td>
      </tr>
      <tr>
        <td colspan="2" align="center" valign="middle"><label>
          <input type="submit" name="button"  value="送出" />
          <input type="hidden" name="replyid" value="<%=artical.getTitleid()%>">
        </label></td>
      </tr>
    </table>
    </form>
    </center>
</div>
   
    </center>
    </body>
</html>
