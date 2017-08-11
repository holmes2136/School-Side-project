
 /* 
 * This script is called when the client tries to access the "/" URL.
 * It simply redirects to a URL that causes the calculator page to be displayed.
 */
library.httpserver.sendRedirect(library.httpserver.makeUrl("/main/show"));
