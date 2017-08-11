<%@ taglib prefix="a" uri="http://jmaki/v1.0/jsp" %>
<%@page contentType="text/html"%>
<%@page pageEncoding="UTF-8"%>


<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
    </head>
   
    <body>
        
  <a:widget name="yahoo.tabbedview"
   value="{items:[
           {label : '維修中', content : 'Some Content',include:'news.jsp'},
           {id : 'bar', label : '留言', include : 'news.jsp', lazyLoad : true },
           {label : '新消息', content : 'More Content',include:'news.jsp',  selected : true}
          ]
         }" />

    
    </body>
</html>
