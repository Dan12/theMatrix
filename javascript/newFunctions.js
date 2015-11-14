function createCube(r, colors){
  var tempVerticies = [];
  
  fMat = getSquareVerts(r);
  
  //front
  tempVerticies = tempVerticies.concat(fMat.flatten());
  //right
  tempVerticies = tempVerticies.concat((Matrix.Rotation(Math.PI/2, Vector.create([0,1,0]))).x(fMat).flatten());
  //back
  tempVerticies = tempVerticies.concat((Matrix.Rotation(Math.PI, Vector.create([0,1,0]))).x(fMat).flatten());
  //right
  tempVerticies = tempVerticies.concat((Matrix.Rotation(Math.PI*3/2, Vector.create([0,1,0]))).x(fMat).flatten());
  //bottom
  tempVerticies = tempVerticies.concat((Matrix.Rotation(Math.PI/2, Vector.create([1,0,0]))).x(fMat).flatten());
  //top
  tempVerticies = tempVerticies.concat((Matrix.Rotation(Math.PI*3/2, Vector.create([1,0,0]))).x(fMat).flatten());
  
  var tempColors = [];
  
  if(colors.length == 24){
    for(var i = 0; i < 6; i++){
      tempColors = tempColors.concat(reshapColors(colors.slice(i*4,(i+1)*4),6));
    }
  }
  else
    tempColors = colors;
  
  return initArrayBuffer(tempVerticies, tempVerticies.length/3, tempColors);
}

function getSquareVerts(r){
  var V1 = Vector.create([-r,-r,r]);
  var V2 = V1.add(Vector.create([2*r,0,0]));
  var V4 = V1.add(Vector.create([2*r,2*r,0]));
  var M1 = Matrix.create([V1.elements,V2.elements,V4.elements]).transpose();
  var M2 = (Matrix.Rotation(Math.PI, Vector.create([0,0,1])).round()).x(M1);
  //matrix of square, 6 verticies
  return M1.augment(M2);
}

function createPyramid(r, colors){
  var tempVerticies = [];
  var V1 = Vector.create([-r,-r,r]);
  var V2 = V1.add(Vector.create([2*r,0,0]));
  var V3 = V1.add(Vector.create([r,r,-r]));
  var M1 = Matrix.create([V1.elements,V2.elements,V3.elements]);
  var M1 = M1.transpose();
  //front
  tempVerticies = tempVerticies.concat(M1.flatten());
  //right
  tempVerticies = tempVerticies.concat((Matrix.Rotation(Math.PI/2, Vector.create([0,1,0]))).x(M1).flatten());
  //back
  tempVerticies = tempVerticies.concat((Matrix.Rotation(Math.PI, Vector.create([0,1,0]))).x(M1).flatten());
  //left
  tempVerticies = tempVerticies.concat((Matrix.Rotation(Math.PI*3/2, Vector.create([0,1,0]))).x(M1).flatten());
  //bottom
  fMat = getSquareVerts(r);
  tempVerticies = tempVerticies.concat((Matrix.Rotation(Math.PI/2, Vector.create([1,0,0]))).x(fMat).flatten());
  
  var tempColors = [];
  
  if(colors.length == 20){
    for(var i = 0; i < 5; i++){
      tempColors = tempColors.concat(reshapColors(colors.slice(i*4,(i+1)*4),3));
    }
  }
  else
    tempColors = colors;
    
  return initArrayBuffer(tempVerticies, tempVerticies.length/3, tempColors);
}

function initArrayBuffer(verticies, numVert, colors){
  var tempVertBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tempVertBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticies), gl.STATIC_DRAW);
  tempVertBuffer.itemSize = 3;
  tempVertBuffer.numItems = numVert;
  
  colors = reshapColors(colors, numVert);
  var tempColBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tempColBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)
  tempColBuffer.itemSize = 4;
  tempColBuffer.numItems = numVert;
  
  var tempNormBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tempNormBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(computeNormal(verticies)), gl.STATIC_DRAW);
  tempNormBuffer.itemSize = 3;
  tempNormBuffer.numItems = numVert;
  
  return [tempVertBuffer, tempColBuffer, tempNormBuffer];
}

function drawArrayBuffer(verticies, colors, norms, glType){
  // push verticies
  gl.bindBuffer(gl.ARRAY_BUFFER, verticies);
  gl.vertexAttribPointer(vertexPositionAttribute, verticies.itemSize, gl.FLOAT, false, 0, 0);
  // adding color
  gl.bindBuffer(gl.ARRAY_BUFFER, colors);
  gl.vertexAttribPointer(vertexColorAttribute, colors.itemSize, gl.FLOAT, false, 0, 0);
  //norms
  if(norms !== undefined){
    gl.bindBuffer(gl.ARRAY_BUFFER, norms);
    gl.vertexAttribPointer(vertexNormalAttribute, norms.itemSize, gl.FLOAT, false, 0, 0);
  }
  setMatrixUniforms();
  gl.drawArrays(glType, 0, verticies.numItems);
}

function reshapColors(colors, numVert){
  var retColors = colors;
  for(var i = 0; i < numVert-colors.length/4; i++){
    retColors = retColors.concat(colors.slice(colors.length-12,colors.length));
  }
  return retColors;
}

function computeNormal(verticies){
  var normals = [];
  for(var i = 0; i < verticies.length; i+=9){
    var P1 = Vector.create([verticies[i],verticies[i+1],verticies[i+2]]);
    var P2 = Vector.create([verticies[i+3],verticies[i+4],verticies[i+5]]);
    var P3 = Vector.create([verticies[i+6],verticies[i+7],verticies[i+8]]);
    var V = P2.subtract(P1);
    var W = P3.subtract(P1);
    var x = V.elements[1]*W.elements[2]-V.elements[2]*W.elements[1];
    var y = V.elements[2]*W.elements[0]-V.elements[0]*W.elements[2];
    var z = V.elements[0]*W.elements[1]-V.elements[1]*W.elements[0];
    var sum = Math.abs(x)+Math.abs(y)+Math.abs(z);
    x = x/sum; y = y/sum; z = z/sum;
    normals.push(x,y,z);
    normals.push(x,y,z);
    normals.push(x,y,z);
  }
  return normals;
}