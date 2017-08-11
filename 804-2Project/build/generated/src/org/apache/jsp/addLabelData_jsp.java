package org.apache.jsp;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import net.fckeditor.*;
import java.text.*;
import java.util.*;
import Control.*;

public final class addLabelData_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

  private static java.util.List _jspx_dependants;

  private org.apache.jasper.runtime.TagHandlerPool _jspx_tagPool_FCK_editor_width_toolbarSet_instanceName_height_nobody;

  public Object getDependants() {
    return _jspx_dependants;
  }

  public void _jspInit() {
    _jspx_tagPool_FCK_editor_width_toolbarSet_instanceName_height_nobody = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
  }

  public void _jspDestroy() {
    _jspx_tagPool_FCK_editor_width_toolbarSet_instanceName_height_nobody.release();
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
      out.write("\n");

    String css = "../blog.css";

      out.write('\n');

SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:MM:SS");
Calendar now = Calendar.getInstance();
String date = sdf.format(now.getTime());

      out.write("\n");
      out.write("<html>\n");
      out.write("    <head>\n");
      out.write("        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n");
      out.write("        <title>JSP Page</title>\n");
      out.write("        \n");
      out.write("        <link href=\"");
      out.print(css);
      out.write("\" rel=\"stylesheet\" type=\"text/css\"/>\n");
      out.write("        \n");
      out.write("        <style type=\"text/css\">\n");
      out.write("            <!--\n");
      out.write("body {\n");
      out.write("\tmargin-left: 0px;\n");
      out.write("\tmargin-top: 0px;\n");
      out.write("\tmargin-right: 0px;\n");
      out.write("\tmargin-bottom: 0px;\n");
      out.write("}\n");
      out.write("            -->\n");
      out.write("        </style>\n");
      out.write("    </head>\n");
      out.write("   \n");
      out.write("\n");
      out.write("\n");
      out.write("        <body background=\"../image/bg_paper_mid.jpg\">\n");
      out.write("       \n");
      out.write("        <form action=\"addNewTopic_do.jsp\" method=\"post\">\n");
      out.write("            <table width=\"800\" class=\"tableline2\"  cellpadding=\"5\" cellspacing=\"0\">\n");
      out.write("                <tr><td><font color=\"#FFCC00\">標題 <input type=text name=\"title\" class=\"tableline2\"></td></tr>\n");
      out.write("                <tr><td>");
      if (_jspx_meth_FCK_editor_0(_jspx_page_context))
        return;
      out.write("</td></tr>\n");
      out.write("                <tr><td><input type=text name=\"time\" value=\"");
      out.print(date);
      out.write("\" height=\"10\" class=\"tableline2\"></td></tr>\n");
      out.write("                <tr></tr>\n");
      out.write("                <tr><td><input type=submit value=\"送出\"></td></tr>\n");
      out.write("            </table>\n");
      out.write("        </form>\n");
      out.write("        \n");
      out.write("    </body>\n");
      out.write("    \n");
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

  private boolean _jspx_meth_FCK_editor_0(PageContext _jspx_page_context)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  FCK:editor
    net.fckeditor.tags.EditorTag _jspx_th_FCK_editor_0 = (net.fckeditor.tags.EditorTag) _jspx_tagPool_FCK_editor_width_toolbarSet_instanceName_height_nobody.get(net.fckeditor.tags.EditorTag.class);
    _jspx_th_FCK_editor_0.setPageContext(_jspx_page_context);
    _jspx_th_FCK_editor_0.setParent(null);
    _jspx_th_FCK_editor_0.setInstanceName("Basic");
    _jspx_th_FCK_editor_0.setToolbarSet("Default");
    _jspx_th_FCK_editor_0.setWidth("180");
    _jspx_th_FCK_editor_0.setHeight("150");
    out = _jspx_page_context.pushBody();
    out.write("This is some <strong>sample text\n");
    out.write("                                </strong>. You are using <a href=\"http://www.fckeditor.net\">\n");
    out.write("                                FCKeditor</a>.");
    String _jspx_temp0 = ((javax.servlet.jsp.tagext.BodyContent)out).getString();
    out = _jspx_page_context.popBody();
    _jspx_th_FCK_editor_0.setValue(_jspx_temp0);
    int _jspx_eval_FCK_editor_0 = _jspx_th_FCK_editor_0.doStartTag();
    if (_jspx_th_FCK_editor_0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _jspx_tagPool_FCK_editor_width_toolbarSet_instanceName_height_nobody.reuse(_jspx_th_FCK_editor_0);
      return true;
    }
    _jspx_tagPool_FCK_editor_width_toolbarSet_instanceName_height_nobody.reuse(_jspx_th_FCK_editor_0);
    return false;
  }
}
