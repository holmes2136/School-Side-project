<%@page contentType="text/html"%>
<%@page pageEncoding="UTF-8"%>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
    <head>
        <title>script.aculo.us Drag and drop functional test file</title>
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <script src="prototype.js" type="text/javascript"></script>
        <script src="scriptaculous.js" type="text/javascript"></script>
        <script src="unittest.js" type="text/javascript"></script>
        
        
        <link href="main.css" rel="stylesheet" type="text/css" />
        <script language="JavaScript">
        
        function change(){
            document.getElementById("li1").style.border = 'dotted';
        }
        
        function silent(){
            document.getElementById("li1").style.border = 'none';
        }
        </script>
    </head>
    <body>
        
        
        
        
        <div style="width:400px;height:400px;position:relative;" id="test">
            
            <ul id="thelist2" style="padding: 2px; list-style-type:none">
                
                
                <table>
                    <tr>
                        <td><li  id ="li1" onmousedown="change()" onmouseout="silent()" ><div id="top">here is top</div></li></td>
                    </tr>
                    <tr>
                        <td><li id="li1" onmousedown="change()" onmouseout="silent()"><div id="left">here is left</div></li></td>
                    </tr>
                </table>
            </ul>
            
        </div>
        
        
        
        <script type="text/javascript" language="javascript" charset="utf-8">
// <![CDATA[


Sortable.create('thelist2',{scroll:'test'});

   

// ]]>
        </script>
        
    </body>
</html>