package org.apache.jsp.friends;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import Friends.*;
import java.util.*;

public final class addFriends_005fdo_jsp extends org.apache.jasper.runtime.HttpJspBase
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
      out.write("            ");

                request.setCharacterEncoding("utf-8");
            
            
      out.write("\n");
      out.write("            ");
      Friends.FriendsVO friendsVO = null;
      synchronized (_jspx_page_context) {
        friendsVO = (Friends.FriendsVO) _jspx_page_context.getAttribute("friendsVO", PageContext.PAGE_SCOPE);
        if (friendsVO == null){
          friendsVO = new Friends.FriendsVO();
          _jspx_page_context.setAttribute("friendsVO", friendsVO, PageContext.PAGE_SCOPE);
          out.write("\n");
          out.write("            ");
          org.apache.jasper.runtime.JspRuntimeLibrary.introspect(_jspx_page_context.findAttribute("friendsVO"), request);
          out.write("\n");
          out.write("            ");
        }
      }
      out.write("\n");
      out.write("            \n");
      out.write("            ");

                FriendsControl control = new FriendsControl();
                control.addFriends(friendsVO);
                response.sendRedirect("friendsControl.jsp");
            
      out.write("\n");
      out.write("    \n");
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
