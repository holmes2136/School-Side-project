package org.apache.jsp;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import MapBean.*;
import XML.myRead;
import org.jdom.*;

public final class googleFunction_jsp extends org.apache.jasper.runtime.HttpJspBase
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

        request.setCharacterEncoding("utf-8");

      out.write(" \n");
      out.write("<html>\n");
      out.write("    <head>\n");
      out.write("        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n");
      out.write("        <title>JSP Page</title>\n");
      out.write("        \n");
      out.write("        <script language=\"JavaScript\">\n");
      out.write("        function sendValueToIframe(){\n");
      out.write("        \n");
      out.write("        x = parent.document.value.mapX.value;\n");
      out.write("        y = parent.document.value.mapY.value;\n");
      out.write("        document.getElementById(\"mapX\").value = x;\n");
      out.write("        document.getElementById(\"mapY\").value = y;\n");
      out.write("        }\n");
      out.write("        </script>\n");
      out.write("    </head>\n");
      out.write("    <body>\n");
      out.write("        \n");
      out.write("        ");

        String x = request.getParameter("mapX");
        String y = request.getParameter("mapY");
        String siteName = request.getParameter("siteName");
        String info = request.getParameter("info");
        if(x!=null){
            myRead xml = new myRead(x,y,siteName);
            
            mapBean control = new mapBean();
            mapVO map = new mapVO();
            
            map.setX(x);
            map.setY(y);
            map.setName(siteName);
            map.setInfo(info);
            control.addLabel(map);
            
           
            
            response.sendRedirect("http://localhost:8086/731Project/googleMap.jsp");
        }
        
        
      out.write("\n");
      out.write("        <form action=\"googleFunction.jsp\" method=\"post\" name=\"addSite\" target=\"_parent\">\n");
      out.write("            <table>\n");
      out.write("                <tr>\n");
      out.write("                    <td>站點:<input type=\"text\" name=\"siteName\" id=\"siteName\"  size=\"15\"></td>\n");
      out.write("                </tr>\n");
      out.write("                <tr> \n");
      out.write("                    <td>說明:<input type=\"text\" name=\"info\" id=\"info\"  size=\"20\"></td>\n");
      out.write("                </tr>\n");
      out.write("                <tr>\n");
      out.write("                    <td><input type=\"submit\"  value=\"送出\" onclick=\"sendValueToIframe()\"></td>\n");
      out.write("                </tr>\n");
      out.write("                <input type=hidden name=\"mapX\" id=\"mapX\">\n");
      out.write("                <input type=hidden  name=\"mapY\" id=\"mapY\">\n");
      out.write("            </table>\n");
      out.write("            \n");
      out.write("        </form>\n");
      out.write("        \n");
      out.write("      \n");
      out.write("           \n");
      out.write("        \n");
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
