package org.apache.jsp.Board;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class BoardPanel_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

  private static java.util.List _jspx_dependants;

  private org.apache.jasper.runtime.TagHandlerPool _jspx_tagPool_a_widget_value_name_nobody;

  public Object getDependants() {
    return _jspx_dependants;
  }

  public void _jspInit() {
    _jspx_tagPool_a_widget_value_name_nobody = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
  }

  public void _jspDestroy() {
    _jspx_tagPool_a_widget_value_name_nobody.release();
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
      out.write("<html>\n");
      out.write("    <head>\n");
      out.write("        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n");
      out.write("        <title>JSP Page</title>\n");
      out.write("    </head>\n");
      out.write("    <iframe src=\"http://localhost:8084/731Project/TopFunction.jsp\" height=\"40\" width=\"1024\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\" frameborder=\"0\"></iframe>\n");
      out.write("    <body>\n");
      out.write("        \n");
      out.write("  ");
      if (_jspx_meth_a_widget_0(_jspx_page_context))
        return;
      out.write("\n");
      out.write("\n");
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

  private boolean _jspx_meth_a_widget_0(PageContext _jspx_page_context)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  a:widget
    jmaki.runtime.jsp.WidgetTag _jspx_th_a_widget_0 = (jmaki.runtime.jsp.WidgetTag) _jspx_tagPool_a_widget_value_name_nobody.get(jmaki.runtime.jsp.WidgetTag.class);
    _jspx_th_a_widget_0.setPageContext(_jspx_page_context);
    _jspx_th_a_widget_0.setParent(null);
    _jspx_th_a_widget_0.setName("yahoo.tabbedview");
    _jspx_th_a_widget_0.setValue(new String("{items:[\n           {label : '維修中', content : 'Some Content',include:'news.jsp'},\n           {id : 'bar', label : '留言', include : 'news.jsp', lazyLoad : true },\n           {label : '新消息', content : 'More Content',include:'news.jsp',  selected : true}\n          ]\n         }"));
    int[] _jspx_push_body_count_a_widget_0 = new int[] { 0 };
    try {
      int _jspx_eval_a_widget_0 = _jspx_th_a_widget_0.doStartTag();
      if (_jspx_th_a_widget_0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
        return true;
      }
    } catch (Throwable _jspx_exception) {
      while (_jspx_push_body_count_a_widget_0[0]-- > 0)
        out = _jspx_page_context.popBody();
      _jspx_th_a_widget_0.doCatch(_jspx_exception);
    } finally {
      _jspx_th_a_widget_0.doFinally();
      _jspx_tagPool_a_widget_value_name_nobody.reuse(_jspx_th_a_widget_0);
    }
    return false;
  }
}
