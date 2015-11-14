// Initialize the buffers we'll need.
function initBuffers() {
  //radius, colors
  cubeBuffer = cubeVerts(
    [[-1,1,1],
     [-1,1,-1],
     [1,1,-1],
     [1,1,1],
     [-1,-1,1],
     [-1,-1,-1],
     [1,-1,-1],
     [1,-1,1]],
    [1.0,0.0,1.0,1.0,
     1.0,0.0,0.0,1.0,
     0.0,1.0,0.0,1.0,
     0.0,0.0,1.0,1.0,
     1.0,1.0,0.0,1.0,
     0.0,1.0,1.0,1.0]);
     
  threedGuides = initArrayBuffer(
    [0,.5,-.5,
      0,-.5,-.5,
     10,0,0,
     -.5,0,-.5,
     .5,0,-.5,
     0,10,0,
      .5,0,.5,
     -.5,0,-.5,
     0,0,20],9,
    [1,0,0,1,
     1,0,0,1,
     1,0,0,1,
     0,0,1,1,
     0,0,1,1,
     0,0,1,1,
     0,1,0,1,
     0,1,0,1,
     0,1,0,1]);
}

// Draw the scene.
function drawScene() {

  initScene();
  
  mvPushMatrix();
  mvTranslate([0,0,-60]);
  mvRotate(-5,[0,1,0]);
  mvRotate(10,[1,0,0]);
  drawArrayBuffer(threedGuides[0], threedGuides[1], threedGuides[2], gl.TRIANGLES);
  threedMV = mvMatrix.dup();
  mvPopMatrix();
  
  //look at matrix
  //mvMatrix = makeLookAt(0,0,10,0,0,0,0,1,0);
  matrixStack.push(mvTranslate(variables.slice(0,3)));
  matrixStack.push(mvRotate(variables[3],[1,0,0]));
  matrixStack.push(mvRotate(variables[4],[0,1,0]));
  drawArrayBuffer(cubeBuffer.buffer[0], cubeBuffer.buffer[1], cubeBuffer.buffer[2], gl.TRIANGLES);


  matrixStack.push({"desc":"Model View Matrix (1*2*3)", "mat":mvMatrix});
  var finalVertex = mvMatrix.x(cubeBuffer.verts);
  matrixStack.push({"desc":"Model Vertex Matrix (4*Original Vertices)", "mat":finalVertex});
  finalVertex = perspectiveMatrix.x(finalVertex);
  var sx = [];
  var sy = [];
  for(var i = 1; i <= finalVertex.dimensions().cols; i++){
    sx.push(finalVertex.e(1,i)/finalVertex.e(4,i));
    sy.push(finalVertex.e(2,i)/finalVertex.e(4,i));
  }
  var screenVertex = Matrix.create([sx,sy,finalVertex.elements[2]]);
  matrixStack.push({"desc":"Screen Vertex Matrix (Click Help for an explanation)", "mat":screenVertex});
  
  drawSceneText([toScreenSpace(Matrix.create([[10,0,0,1],[0,10,0,1],[0,0,20,1]]).transpose(), threedMV),toScreenSpace(cubeBuffer.verts,mvMatrix)]);
  
  //animate
  animate();
}

// Animate
function animate(){
  for(var i = 0; i < variables.length; i++){
    variables[i]+=variableDelta[i];
  }
  if(variables[1] >= yPosTerminate*Math.sign(variableDelta[1])){
    for(var i = 0; i < variables.length; i++){
      variables[i] = variablesInit[i];
    }
  }
}

function initScene(){
  gl.viewport(0, 0, canvas.width, canvas.height);
  
  //console.log(canvas.width+","+canvas.height+","+gl.viewportWidth+","+gl.viewportHeight);
  
  // Clear the canvas before we start drawing on it.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Establish the perspective with which we want to view the
  // scene. Our field of view is 45 degrees, with a width/height
  // ratio of 640:480, and we only want to see objects between 0.1 units
  // and 100 units away from the camera.
  perspectiveMatrix = makePerspective(45, canvas.width/canvas.height, 0.1, 120.0);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  loadIdentity();
  
  matrixStack = [];
  
    matrixStack.push({"desc":"Perspective matrix", "mat": perspectiveMatrix});
}