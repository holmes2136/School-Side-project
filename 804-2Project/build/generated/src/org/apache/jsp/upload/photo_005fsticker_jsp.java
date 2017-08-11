package org.apache.jsp.upload;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class photo_005fsticker_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

  private static java.util.List _jspx_dependants;

  public Object getDependants() {
    return _jspx_dependants;
  }

  public void _jspService(HttpServletRequest request, HttpServletResponse response)
        throws java.io.IOException, ServletException {

    JspFactory _jspxFactory = null;
    PageContext pageContext = null;
    HttpSession session = null;
    ServletContext application = null;
    ServletConfig config = null;
    JspWriter out = null;
    Object page = this;
    JspWriter _jspx_out = null;
    PageContext _jspx_page_context = null;


    try {
      _jspxFactory = JspFactory.getDefaultFactory();
      response.setContentType("text/html;charset=UTF-8");
      pageContext = _jspxFactory.getPageContext(this, request, response,
      			null, true, 8192, true);
      _jspx_page_context = pageContext;
      application = pageContext.getServletContext();
      config = pageContext.getServletConfig();
      session = pageContext.getSession();
      out = pageContext.getOut();
      _jspx_out = out;

      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("<html>\n");
      out.write("    <head>\n");
      out.write("        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n");
      out.write("        <title>大頭照設定</title>\n");
      out.write("        \n");
      out.write("        \n");
      out.write("        <script language = \"JavaScript\">\n");
      out.write("           var fileObjectValue = shift1.file.value;\n");
      out.write("            \n");
      out.write("            function checkfile(n,v){\n");
      out.write("  var ext = v.substring(v.lastIndexOf(\".\")+1).toLowerCase();\n");
      out.write("    if (ext != \"gif\" && ext !=\"jpg\" && ext !=\"jpeg\"){\n");
      out.write("      alert(\"檔案類型不符，請上傳檔案如：.gif,.jpg,.jpeg\");\n");
      out.write("      document.getElementById(n).outerHTML=document.getElementById(n).outerHTML.replace(/value=\\w/g,'');\n");
      out.write("    }\n");
      out.write("  }\n");
      out.write("            function test(){\n");
      out.write("    fileObjectValue = shift1.file.value;\n");
      out.write("    parent.shift.document.shift3.filename.value= fileObjectValue;\n");
      out.write("    parent.shift.document.shift3.submit( );\n");
      out.write("                            }\n");
      out.write("            \n");
      out.write("        function openwin() {\n");
      out.write("　　window.open(\"http://localhost:8084/731Project/index.jsp?image=\"+fileObjectValue, \"newwindow\", \"height=100, width=400, toolbar =no, menubar=no, scrollbars=yes, resizable=no, location=no, status=no\")\n");
      out.write("　　} \n");
      out.write("    \n");
      out.write("\n");
      out.write("        </script> \n");
      out.write("        \n");
      out.write("    </head>\n");
      out.write("    <body background=\"../image/bg_paper_mid.jpg\">\n");
      out.write("    <table>\n");
      out.write("        <form action = \"upload_do.jsp\" method=\"post\" name=\"shift1\" enctype=\"multipart/form-data\" target=\"shift\">\n");
      out.write("            <tr><td><input type=file name=\"file\" onChange =\"test();checkfile(this.name,this.value)\"></td></tr>\n");
      out.write("            <tr><td><input type=submit  value=\"上傳\"></td> </tr>\n");
      out.write("            <tr><td><input type=submit  value=\"Ensure\" onclick=\"openwin()\"></td></tr>\n");
      out.write("            \n");
      out.write("            \n");
      out.write("        </form>\n");
      out.write("        <iframe src = \"test_do.jsp\" height=\"150\" width=\"150\" name=\"shift\" id=\"shift\" marginwidth=\"0\" marginheight=\"0\" scrolling=\"no\"></iframe>\n");
      out.write("    </table>\n");
      out.write("    \n");
      out.write("    </body>\n");
      out.write("</html>\n");
    } catch (Throwable t) {
      if (!(t instanceof SkipPageException)){
        out = _jspx_out;
        if (out != null && out.getBufferSize() != 0)
          out.clearBuffer();
        if (_jspx_page_context != null) _jspx_page_context.handlePageException(t);
      }
    } finally {
      if (_jspxFactory != null) _jspxFactory.releasePageContext(_jspx_page_context);
    }
  }
}
