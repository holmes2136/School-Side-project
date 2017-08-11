<%@page contentType="text/html"%>
<%@page pageEncoding="UTF-8"%>

<%

    String url = "http://holmes2136.no-ip.org:8084/731Project/";
%>
<style type="text/css">
    <!--
body {
	background-image: url(image/blackg.jpg);
	background-repeat: no-repeat;
	margin-left: 100px;
	margin-top: 50px;
	margin-right: 100px;
	margin-bottom: 50px;
	background-color: #000000;
}
.style2 {color: #FFFFFF}
.style5 {font-size: 12px}
body,td,th {
	color: #FFFFFF;
}
    -->
</style>

<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        
        <title>ErrorLogin</title>
        
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
            <!--
body {
	background-image: url(image/blackg.jpg);
	background-repeat: no-repeat;
	margin-left: 100px;
	margin-top: 50px;
	margin-right: 100px;
	margin-bottom: 50px;
	background-color: #000000;
}
.style2 {color: #FFFFFF}
.style5 {font-size: 12px}
body,td,th {
	color: #FFFFFF;
}
            -->
    </style></head>
    <body class="sub" dir="ltr" lang="af" xml:lang="af">
        
        <%
        response.setHeader("Refresh", "3; URL="+url+"index.jsp");
        
        %>
        <table width="98%" border="1">
            <tr>
                <th scope="col"><div align="left"><span class="style5">黑皮部落格→提醒訊息</span></div></th>
            </tr>
        </table>
        <table width="98%" height="228" bordercolor="#000000" bgcolor="#000000">
            <tr>
                <th height="222" align="center" bordercolor="#353535" background="image/blackg-2.jpg" " "><p align="center">黑皮提醒您</p>
                    <p align="center">即將回到首頁</p>
                    
                <p>&nbsp;</p></th>
            </tr>
        </table>
        <div align="left" class="style2">重要聲明：本網站是學生的專題製作，如有相同，請多見諒。本網站對於所有留言與討論及立場，不負法律任何責任，一切留言與討論皆屬於個人意見，並非網站立場。用戶不應信賴內容，請自行判斷內容之真實性。若用戶發現任何留言有問題，請隨時與我們連絡，本網站有權刪除任何留言與拒絕任何人士的上傳下載。</div>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
    </body>
</html>