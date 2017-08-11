function Print(){
    window.print();
} 

function changeStyle(x){
    if(x!=null){
    document.getElementById("x").style.background = '#e0d5c2';
    }
    else{
    document.getElementById("x").style.background = 'image/bt2.png';
    }
}

function drawLine(){
    var x = document.getElementById("mapX").value;
    var y = document.getElementById("mapY").value;
    var bounds = map.getBounds();
    var northEast = bounds.getNorthEast();
    var northEast_x = northEast.lat();
    var northEast_y = northEast.lng();
    var points = [new GLatLng(x, y), new GLatLng(northEast_x,northEast_y)];
    var line = new GPolyline(points, "#ff0000");
    map.addOverlay(line);
}

