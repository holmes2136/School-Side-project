<%@page contentType="text/html"%>
<%@page pageEncoding="UTF-8"%>


<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>大頭照設定</title>
        
        
        <script language = "JavaScript">
           var fileObjectValue = shift1.file.value;
            
            function checkfile(n,v){
  var ext = v.substring(v.lastIndexOf(".")+1).toLowerCase();
    if (ext != "gif" && ext !="jpg" && ext !="jpeg"){
      alert("檔案類型不符，請上傳檔案如：.gif,.jpg,.jpeg");
      document.getElementById(n).outerHTML=document.getElementById(n).outerHTML.replace(/value=\w/g,'');
    }
  }
            function test(){
    fileObjectValue = shift1.file.value;
    parent.shift.document.shift3.filename.value= fileObjectValue;
    parent.shift.document.shift3.submit( );
                            }
            
        function openwin() {
　　window.open("http://localhost:8084/731Project/index.jsp?image="+fileObjectValue, "newwindow", "height=100, width=400, toolbar =no, menubar=no, scrollbars=yes, resizable=no, location=no, status=no")
　　} 
    

        </script> 
        
    </head>
    <body background="../image/bg_paper_mid.jpg">
    <table>
        <form action = "upload_do.jsp" method="post" name="shift1" enctype="multipart/form-data" target="shift">
            <tr><td><input type=file name="file" onChange ="test();checkfile(this.name,this.value)"></td></tr>
            <tr><td><input type=submit  value="上傳"></td> </tr>
            <tr><td><input type=submit  value="Ensure" onclick="openwin()"></td></tr>
            
            
        </form>
        <iframe src = "test_do.jsp" height="150" width="150" name="shift" id="shift" marginwidth="0" marginheight="0" scrolling="no"></iframe>
    </table>
    
    </body>
</html>
