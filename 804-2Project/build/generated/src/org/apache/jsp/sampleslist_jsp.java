package org.apache.jsp;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class sampleslist_jsp extends org.apache.jasper.runtime.HttpJspBase
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
      response.setContentType("text/html; charset=UTF-8");
      pageContext = _jspxFactory.getPageContext(this, request, response,
      			null, true, 8192, true);
      _jspx_page_context = pageContext;
      application = pageContext.getServletContext();
      config = pageContext.getServletConfig();
      session = pageContext.getSession();
      out = pageContext.getOut();
      _jspx_out = out;

      out.write("<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \r\n");
      out.write("\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\r\n");
      out.write("<html xmlns=\"http://www.w3.org/1999/xhtml\">\r\n");
      out.write("\t<head>\r\n");
      out.write("\t\t<title>FCKeditor - Sample Selection</title>\r\n");
      out.write("\t\t<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />\r\n");
      out.write("\t\t<meta name=\"robots\" content=\"noindex, nofollow\" />\r\n");
      out.write("\t\t<link href=\"sample.css\" rel=\"stylesheet\" type=\"text/css\" />\r\n");
      out.write("\t\t<script type=\"text/javascript\">\r\n");
      out.write("\t\t\tif (window.top == window)\r\n");
      out.write("\t\t\t\tdocument.location = 'index.jsp' ;\r\n");
      out.write("\r\n");
      out.write("\t\t\tfunction OpenSample(sample) {\r\n");
      out.write("\t\t\t\tif (sample.length > 0)\r\n");
      out.write("\t\t\t\t\twindow.open( sample, 'Sample' );\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t</script>\r\n");
      out.write("\t</head>\r\n");
      out.write("\t<body>\r\n");
      out.write("\t\t<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\r\n");
      out.write("\t\t\t<tr>\r\n");
      out.write("\t\t\t\t<td>Please select the sample you want to view: <br />\r\n");
      out.write("\t\t\t\t<select onchange=\"OpenSample(this.value);\">\r\n");
      out.write("\t\t\t\t\t<option value=\"jsp/sample01.jsp\" selected=\"selected\">\r\n");
      out.write("\t\t\t\t\tSample 01: Editor with all features generated via API</option>\r\n");
      out.write("\t\t\t\t\t<option value=\"jsp/sample02.jsp\">Sample 02: Editor with all \r\n");
      out.write("\t\t\t\t\tfeatures generated with JSP Taglib</option>\r\n");
      out.write("\t\t\t\t\t<option value=\"jsp/sample03.jsp\">Sample 03:\tMulti-language \r\n");
      out.write("\t\t\t\t\tsupport</option>\r\n");
      out.write("\t\t\t\t\t<option value=\"jsp/sample04.jsp\">Sample 04: Toolbar\r\n");
      out.write("\t\t\t\t\tselection</option>\r\n");
      out.write("\t\t\t\t\t<option value=\"jsp/sample05.jsp\">Sample 05: Skins\r\n");
      out.write("\t\t\t\t\tsupport</option>\r\n");
      out.write("\t\t\t\t\t<option value=\"jsp/sample06.jsp\">Sample 06: Plugins\r\n");
      out.write("\t\t\t\t\tsupport</option>\r\n");
      out.write("\t\t\t\t\t<option value=\"jsp/sample07.jsp\">Sample 07: Full Page\r\n");
      out.write("\t\t\t\t\tediting</option>\r\n");
      out.write("\t\t\t\t</select></td>\r\n");
      out.write("\t\t\t</tr>\r\n");
      out.write("\t\t</table>\r\n");
      out.write("\t</body>\r\n");
      out.write("</html>\r\n");
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
