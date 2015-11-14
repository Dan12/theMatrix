//
// Matrix utility functions
//

var mvMatrixStack = [];

function loadIdentity() {
  mvMatrix = Matrix.I(4);
}

function multMatrix(m) {
  mvMatrix = mvMatrix.x(m);
}

function mvTranslate(v) {
  var tempMat = Matrix.Translation($V([v[0], v[1], v[2]]));
  multMatrix(tempMat.ensure4x4());
  return {"desc": "Translate "+JSON.stringify(v), "mat": tempMat};
}

function setMatrixUniforms() {
  var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
  gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

  var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
  
  var ambUniform = gl.getUniformLocation(shaderProgram, "uAmbientLight");
  gl.uniform3fv(ambUniform, new Float32Array(ambientVals));
  
  var dirUniform = gl.getUniformLocation(shaderProgram, "uDirectionalVector");
  gl.uniform3fv(dirUniform, new Float32Array(lightingDirection));
  
  var dirColUniform = gl.getUniformLocation(shaderProgram, "uDirectionalLightColor");
  gl.uniform3fv(dirColUniform, new Float32Array(directVals));
  
  var normalMatrix = mvMatrix.inverse();
  normalMatrix = normalMatrix.transpose();
  var nUniform = gl.getUniformLocation(shaderProgram, "uNormalMatrix");
  gl.uniformMatrix4fv(nUniform, false, new Float32Array(normalMatrix.flatten()));
}

function mvPushMatrix(m) {
  if (m) {
    mvMatrixStack.push(m.dup());
    mvMatrix = m.dup();
  } else {
    mvMatrixStack.push(mvMatrix.dup());
  }
}

function mvPopMatrix() {
  if (!mvMatrixStack.length) {
    throw("Can't pop from an empty matrix stack.");
  }

  mvMatrix = mvMatrixStack.pop();
  return mvMatrix;
}

function mvRotate(angle, v) {
  var inRadians = angle * Math.PI / 180.0;

  var m = Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4();
  multMatrix(m);
  return {"desc": "Rotate "+angle+" degrees about "+JSON.stringify(v), "mat": m};
}

function mvScale(s,r,t){
  var m = Matrix.create([[s,0,0,0],[0,r,0,0],[0,0,t,0],[0,0,0,1]]);
  multMatrix(m);
}

function toScreenSpace(m, mv){
  var temp = perspectiveMatrix.x(mv.x(m));
  var sx = [];
  var sy = [];
  for(var i = 1; i <= temp.dimensions().cols; i++){
    sx.push((temp.e(1,i)/temp.e(4,i))*(canvas.width/2)+(canvas.width/2));
    sy.push((canvas.height/2)-(temp.e(2,i)/temp.e(4,i))*(canvas.height/2));
  }
  return Matrix.create([sx,sy,temp.elements[2]]);
}