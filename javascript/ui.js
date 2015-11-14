$(document).ready(function(){
  
  $("#matrixContainer").css("top",$("#glcanvas").offset().top+"px");
  
  setupCanvasText();
  
  $("#how").click(function(){
    $("#explain").css("display","block");
  });
  
  $("#close-explain").click(function(){
    $("#explain").css("display","none");
  });
  
  for(var i = 0; i < variableDelta.length; i++){
    $('#'+i+'inc').val(variableDelta[i]);
  }
  
  $(".button").click(function(){
    var act = $(this).attr("bAction");
    if(act == "update" && !playing){
      updateFromUI();
    }
    
    else if(act == "play"){
      if(!playing){
        playInterval = setInterval(updateFromUI,300);
        playing = true;
        $(this).val("Pause");
      }
      else{
        clearInterval(playInterval);
        playing = false;
        $(this).val("Play");
      }
    }
  });
  $(document).mouseup(function(){
    $(".button").blur();
  });
  
  $(document).keydown(function(e){
    if(e.keyCode == 13 && !playing)
      updateFromUI();
  })
  
  $("#textcanvas").mousemove(function(e){
    var mouseX = e.pageX - $("#glcanvas").offset().left;
    var mouseY = e.pageY - $("#glcanvas").offset().top;
    var canvXPos = (mouseX-canvas.width/2)/(canvas.width/2);
    var canvYPos = (canvas.height/2-mouseY)/(canvas.height/2);
    $("#mousePos").html("Mouse X: "+elemToStr(canvXPos)+" Mouse Y: "+elemToStr(canvYPos));
  });
});

function setupCanvasText(){
  // look up the text canvas.
  textCanvas = document.getElementById("textcanvas");
   
  // make a 2D context for it
  txtCTX = textCanvas.getContext("2d");
}

function drawSceneText(vertMats) {
    txtCTX.clearRect(0, 0, txtCTX.canvas.width, txtCTX.canvas.height);
    
    var axisMat = vertMats[0];
    txtCTX.font = "20px arial";
    txtCTX.fillStyle = "black";
    txtCTX.fillText("X", axisMat.e(1,1), axisMat.e(2,1));
    txtCTX.fillText("Y", axisMat.e(1,2), axisMat.e(2,2));
    txtCTX.fillText("Z", axisMat.e(1,3), axisMat.e(2,3));
    
    var vertMat = vertMats[1];
    txtCTX.font = "12px arial";
    txtCTX.fillStyle = "black";
    txtCTX.fillText("1", vertMat.e(1,1), vertMat.e(2,1));
    txtCTX.fillText("2", vertMat.e(1,2), vertMat.e(2,2));
    txtCTX.fillText("3", vertMat.e(1,3), vertMat.e(2,3));
    txtCTX.fillText("4", vertMat.e(1,4), vertMat.e(2,4));
    txtCTX.fillText("5", vertMat.e(1,5), vertMat.e(2,5));
    txtCTX.fillText("6", vertMat.e(1,6), vertMat.e(2,6));
    txtCTX.fillText("7", vertMat.e(1,7), vertMat.e(2,7));
    txtCTX.fillText("8", vertMat.e(1,8), vertMat.e(2,8));
}

function updateFromUI(){
  for(var i = 0; i < variableDelta.length; i++){
    var newDelta = parseInt($('#'+i+'inc').val());
    if(!isNaN(newDelta))
      variableDelta[i] = newDelta;
  }
  drawScene();
  showMatrixStack();
  showOrigVert();
}

function showMatrixStack(){
  $("#matrixStack .matrix").remove();
  for(var k = 0; k < matrixStack.length; k++){
    tempMat = matrixStack[k];
    $("#matrixStack").append('<div class="matrix">'+k+') '+tempMat.desc+'</div>');
    for(var i = 1; i <= tempMat.mat.dimensions().rows; i++){
      $("#matrixStack .matrix:last").append('<div class="matrixRow"></div>');
      for(var j = 1; j <= tempMat.mat.dimensions().cols; j++){
        $("#matrixStack .matrixRow:last").append('<div class="matrixElem">'+elemToStr(tempMat.mat.e(i,j))+'</div>');
      }
    }
  }
}

function showOrigVert(){
  $("#vertMat .matrixRow").remove();
  for(var i = 1; i <= cubeBuffer.verts.dimensions().rows; i++){
      $("#vertMat").append('<div class="matrixRow"></div>');
      for(var j = 1; j <= cubeBuffer.verts.dimensions().cols; j++){
        $("#vertMat .matrixRow:last").append('<div class="matrixElem">'+elemToStr(cubeBuffer.verts.e(i,j))+'</div>');
      }
    }
}

function elemToStr(elem){
  var ret = elem.toFixed(4);
  if(elem<0)
    ret = elem.toFixed(3);
  ret = ret.slice(0,5);
  return ret;
}