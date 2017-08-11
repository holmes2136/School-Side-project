package org.apache.jsp;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class index_jsp extends org.apache.jasper.runtime.HttpJspBase
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
      out.write("<head>\n");
      out.write("    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n");
      out.write("    <title>JSP Page</title>\n");
      out.write("    \n");
      out.write("    <script src=\"prototype.js\" type=\"text/javascript\"></script>\n");
      out.write("    <script src=\"scriptaculous.js\" type=\"text/javascript\"></script>\n");
      out.write("    \n");
      out.write("    <link href=\"main.css\" rel=\"stylesheet\" type=\"text/css\" />\n");
      out.write("</head>\n");
      out.write("<body>\n");
      out.write("    <div id=\"test\">\n");
      out.write("        <div id=\"top\">\n");
      out.write("        <span id=\"handle1\">Click here if you've seen enough.</span>\n");
      out.write("        <input type=\"checkbox\" id=\"shouldrevert1\"/> \n");
      out.write("        </div>\n");
      out.write("        <div id=\"left\">\n");
      out.write("        <span id=\"handle2\"> i'm Mr.right</span>\n");
      out.write("        <input type=\"checkbox\" id=\"shouldrevert2\">\n");
      out.write("        <span id=\"event-info\"></span>\n");
      out.write("        </div>\n");
      out.write("       \n");
      out.write("    </div>\n");
      out.write("    \n");
      out.write("    <div id=\"content\"></div>\n");
      out.write("    <input type=\"button\">\n");
      out.write("    <input onclick=\"this.checked = !this.checked\" name=\"x\" id=\"x\" type=\"checkbox\"/>\n");
      out.write("    \n");
      out.write("    <script type=\"text/javascript\" language=\"javascript\">\n");
      out.write("          // <![CDATA[\n");
      out.write("        \n");
      out.write("        \n");
      out.write("        new Draggable('top',{scroll:window,handle:'handle1',revert:function(element){return ($('shouldrevert1').checked)}});\n");
      out.write("        \n");
      out.write("        new Draggable('left',{scroll:window,\n");
      out.write("        handle:'handle2',\n");
      out.write("        revert:function(element){return ($('shouldrevert2').checked)},\n");
      out.write("        onStart:function(){$('left').setStyle({backgroundColor:'#bfb'})},\n");
      out.write("        onDrag:function(){$('event-info').update('drag!')},\n");
      out.write("        onEnd:function(){alert('end!')}\n");
      out.write("        });\n");
      out.write("          // ]]>\n");
      out.write("        \n");
      out.write("          \n");
      out.write("    </script>\n");
      out.write("</body>\n");
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
