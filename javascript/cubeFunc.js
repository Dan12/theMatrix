//where verts contains 8 verticies in 2-d float array, 
//top face clockwise, bottom face clockwise, 
//starting on same edge
function cubeVerts(verts, colors){
  var tempVerts = [];
  
  //top
  var vertMat = triVert(null, verts[2],verts[1],verts[0]);
  vertMat = triVert(vertMat, verts[0],verts[3],verts[2]);
  //front
  vertMat = triVert(vertMat, verts[3], verts[0], verts[4]);
  vertMat = triVert(vertMat, verts[4], verts[7], verts[3]);
  //right
  vertMat = triVert(vertMat, verts[2], verts[3], verts[7]);
  vertMat = triVert(vertMat, verts[7], verts[6], verts[2]);
  //back
  vertMat = triVert(vertMat, verts[1], verts[2], verts[6]);
  vertMat = triVert(vertMat, verts[6], verts[5], verts[1]);
  //left
  vertMat = triVert(vertMat, verts[0], verts[1], verts[5]);
  vertMat = triVert(vertMat, verts[5], verts[4], verts[0]);
  //bottom
  vertMat = triVert(vertMat, verts[6], verts[5], verts[4]);
  vertMat = triVert(vertMat, verts[4], verts[7], verts[6]);
  
  var tempColors = [];
  if(colors.length == 24){
    for(var i = 0; i < 6; i++){
      tempColors = tempColors.concat(reshapColors(colors.slice(i*4,(i+1)*4),6));
    }
  }
  else
    tempColors = colors;
  
  tempVerts = vertMat.flatten();
  
  matVerts = Matrix.create([verts[0],verts[1],verts[2],verts[3],verts[4],verts[5],verts[6],verts[7]]).transpose();
  return {"buffer": initArrayBuffer(tempVerts, tempVerts.length/3, tempColors), "mat": vertMat, "verts": homogenize(matVerts)};
}

function triVert(m1, v1, v2, v3){
  if(m1 == null)
    return Matrix.create([v1,v2,v3]).transpose();
  else
    return m1.augment(Matrix.create([v1,v2,v3]).transpose());
}

function homogenize(m){
  var ones = [];
  for(var i = 0; i < m.dimensions().cols; i++)
    ones.push(1);
  return m.transpose().augment(Vector.create(ones)).transpose();
}