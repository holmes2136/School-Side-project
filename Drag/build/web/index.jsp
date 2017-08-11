<%@page contentType="text/html"%>
<%@page pageEncoding="UTF-8"%>


<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>JSP Page</title>
    
    <script src="prototype.js" type="text/javascript"></script>
    <script src="scriptaculous.js" type="text/javascript"></script>
    
    <link href="main.css" rel="stylesheet" type="text/css" />
</head>
<body>
    <div id="test">
        <div id="top">
        <span id="handle1">Click here if you've seen enough.</span>
        <input type="checkbox" id="shouldrevert1"/> 
        </div>
        <div id="left">
        <span id="handle2"> i'm Mr.right</span>
        <input type="checkbox" id="shouldrevert2">
        <span id="event-info"></span>
        </div>
       
    </div>
    
    <div id="content"></div>
    <input type="button">
    <input onclick="this.checked = !this.checked" name="x" id="x" type="checkbox"/>
    
    <script type="text/javascript" language="javascript">
          // <![CDATA[
        
        
        new Draggable('top',{scroll:window,handle:'handle1',revert:function(element){return ($('shouldrevert1').checked)}});
        
        new Draggable('left',{scroll:window,
        handle:'handle2',
        revert:function(element){return ($('shouldrevert2').checked)},
        onStart:function(){$('left').setStyle({backgroundColor:'#bfb'})},
        onDrag:function(){$('event-info').update('drag!')},
        onEnd:function(){alert('end!')}
        });
          // ]]>
        
          
    </script>
</body>
</html>
