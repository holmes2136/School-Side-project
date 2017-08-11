package org.apache.jsp.addNewTopic;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import Control.*;
import java.util.*;

public final class addNewTopic_005fdo_jsp extends org.apache.jasper.runtime.HttpJspBase
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
      out.write("        <title>JSP Page</title>\n");
      out.write("    </head>\n");
      out.write("    <body>\n");
      out.write("        ");

        request.setCharacterEncoding("utf-8");
        Enumeration param = (Enumeration)request.getParameterNames();//取得String物件
        
        
        
      out.write("\n");
      out.write("        \n");
      out.write("        ");

        String[] parameter = new String[4];
        while(param.hasMoreElements()){
            
            parameter[0] = (String)param.nextElement();//title物件
            parameter[1] = (String)param.nextElement();//content物件
            parameter[2] =(String)param.nextElement();//time物件
            parameter[3] = (String)param.nextElement();//category物件
            
        }
        String content = request.getParameter(parameter[0]);
        String category = request.getParameter(parameter[1]);
        String time = request.getParameter(parameter[2]);
        String title = request.getParameter(parameter[3]);
        
        
        Control control = new Control();
        Artical artical = new Artical();
        artical.setTitle(title);
        artical.setContent(content);
        artical.setTime(time);
        artical.setCategory(category);
        control.addNewTopic(artical);
        response.sendRedirect("http://localhost:8084/731Project/index.jsp");
        
      out.write("\n");
      out.write("        \n");
      out.write("        \n");
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
