<%@page contentType="text/html"import="Control.*,java.util.*,Friends.FriendsControl,Friends.FriendsVO"%>
<%@page pageEncoding="UTF-8"import="Page.*"%>

<%!
    String style;
%>

<%
    style = request.getParameter("style");
%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<title>HB首頁</title>

<script src="Scripts/AC_RunActiveContent.js" type="text/javascript"></script>
<link href="../<%=style%>" rel="stylesheet" type="text/css" />
</head>


<div id="top"> id "top" 的內容放在這裡</div>
<div id="content">
  <div id="nofunction">
    <p>id "nofunction&quot;無須內容 顏色預設</p>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
    <p>&nbsp;</p>
  </div>
  <div id="left">
    <table width="90%">
      <tr>
        <td colspan="4"><p>
            <script type="text/javascript">
AC_FL_RunContent( 'codebase','http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,28,0','width','113','height','100','align','left','src','HB','quality','high','pluginspage','http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash','movie','HB' ); //end AC code
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
        <td colspan="3"><img src="image/pili.jpg" width="114" height="120" border="0" /></td>
        <td width="19%">&nbsp;</td>
      </tr>
      <tr>
        <td colspan="3">&nbsp;</td>
        <td><a href="MySpace.html"><img src="image/icon18_wrench_allbkg.png" alt="" width="18" height="18" border="0" /></a></td>
      </tr>
      <tr>
        <td colspan="4"><a href="註冊.html">註冊</a></td>
      </tr>
      
      <tr>
        <td colspan="4" align="center"><div id="login">
          <form id="form4" name="form4" method="post" action="">
            <p align="left">帳號
              <input name="textfield" type="text" id="textfield" size="10" />
            </p>
            <p align="left"> 密碼
              <input name="textfield2" type="password" id="textfield2" size="10" />
            </p>
            <p align="center">
              <input name="button" type="submit" id="button" value="登入" border="0" />
            </p>
                    </form>
          </div></td>
      </tr>
      <tr>
        <td width="23%" align="center" valign="middle"><a href="Account網誌.html" class="style8">首頁</a></td>
        <td width="26%" align="center" valign="middle"><span class="style8"><a href="相簿.html">相簿</a></span></td>
        <td colspan="2" align="center" valign="middle"><span class="style8">上傳照片</span></td>
      </tr>
      <tr>
        <td colspan="4"><form id="form2" name="form2" method="post" action="">
            <select name="select" id="select">
              <option>好友清單</option>
            </select>
        </form></td>
      </tr>
      <tr>
        <td colspan="3">最新文章</td>
        <td align="center"><a href="最新文章.html"><img src="image/icon18_wrench_allbkg.png" width="18" height="18" border="0" /></a></td>
      </tr>
      <tr>
        <td colspan="4"><div id="newtopic"> <a href="#">id "newtopic"的內容放在這裡</a></div></td>
      </tr>
      <tr>
        <td colspan="3">分類文章</td>
        <td align="center"><a href="分類文章.html"><img src="image/icon18_wrench_allbkg.png" alt="" width="18" height="18" border="0" /></a></td>
      </tr>
      <tr>
        <td colspan="4"><form id="form3" name="form3" method="post" action="">
            <select name="select2" id="select2">
              <option>分類文章</option>
            </select>
        </form></td>
      </tr>
      <tr>
        <td colspan="4"><div id="topic_class"> id "topic_class" 的內容放在這裡</div></td>
      </tr>
      <tr>
        <td colspan="3">所有文章列表</td>
        <td align="center"><a href="所有文章列表.html"><img src="image/icon18_wrench_allbkg.png" alt="" width="18" height="18" border="0" /></a></td>
      </tr>
      <tr>
        <td colspan="4"><div id="alltopic"> id "alltopic" 的內容放在這裡</div></td>
      </tr>
    </table>
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
        <td width="536" height="5" bgcolor="#FFFF00">最新文章</td>
        <td width="79" bgcolor="#FFFF00"><a href="文章回覆.html">新增文章</a></td>
      </tr>
      <tr>
        <td colspan="2" valign="top"><table width="100%" bgcolor="#FFFFFF">
            <tr>
              <td colspan="9" background="file:///C|/FormalProject/731Project/web/image/bg_minidots.gif" class="style8"><form id="form1" name="form1" method="post" action="">
                <input name="textfield3" type="text" class="tableline2" id="textfield3" />
              </form></td>
            </tr>
            <tr>
              <td colspan="9" background="file:///C|/FormalProject/731Project/web/image/bg_minidots.gif">今天跟大朱一起做網頁....              </td>
            </tr>
            <tr>
              <td colspan="9" align="center" valign="middle" background="file:///C|/FormalProject/731Project/web/image/bg_minidots.gif"><hr /></td>
            </tr>
            <tr>
              <td width="51%" align="right" valign="middle" background="file:///C|/FormalProject/731Project/web/image/bg_minidots.gif"><div align="right" class="style7"></div></td>
              <td width="11%" align="right" valign="middle" background="file:///C|/FormalProject/731Project/web/image/bg_minidots.gif"><span class="style7"><span class="style2">Account於</span></span></td>
              <td width="3%" align="right" valign="middle" background="file:///C|/FormalProject/731Project/web/image/bg_minidots.gif"><div align="right" class="style7"><span class="style2">|</span></div></td>
              <td width="6%" align="right" valign="middle" background="file:///C|/FormalProject/731Project/web/image/bg_minidots.gif"><div align="right" class="style7"><span class="style2"> TIME</span></div></td>
              <td width="6%" align="right" valign="middle" background="file:///C|/FormalProject/731Project/web/image/bg_minidots.gif"><div align="right" class="style7"><span class="style2">發布</span></div></td>
              <td width="3%" align="right" valign="middle" background="file:///C|/FormalProject/731Project/web/image/bg_minidots.gif"><div align="right" class="style7"><span class="style2">|</span></div></td>
              <td width="6%" align="right" valign="middle" background="file:///C|/FormalProject/731Project/web/image/bg_minidots.gif"><div align="right" class="style7"><span class="style2">轉寄</span></div></td>
              <td width="3%" align="right" valign="middle" background="file:///C|/FormalProject/731Project/web/image/bg_minidots.gif"><div align="right" class="style7"><span class="style2">|</span></div></td>
              <td width="11%" align="right" valign="middle" background="file:///C|/FormalProject/731Project/web/image/bg_minidots.gif"><div align="right" class="style7">
                <div align="center"><img src="image/icon18_edit_allbkg.gif" width="18" height="18" border="0" /></div>
              </div></td>
            </tr>
        </table></td>
      </tr>
    </table>
  </div>
  <p>id "content" 的內容放在這裡</p>
</div>
</html>
