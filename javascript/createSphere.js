function createSphere(radius, ml, colors){
  tempVerticies = null;
  
  //Top
  splitTriangle(Vector.create([-radius, 0, radius]), radius*2, 0, 1, 1,ml,tempVerticies,radius);

  //splitTriangle(Vector.create([-radius, 0, -radius]), radius*2, 0, 1, -1,ml,tempVerticies,radius);

  splitTriangle(Vector.create([-radius, 0, radius]), radius*2, 1, 1, 0,ml,tempVerticies,radius);

  //splitTriangle(Vector.create([radius, 0, radius]), radius*2, -1, 1, 0,ml,tempVerticies,radius);

  //Bottom
  splitTriangle(Vector.create([-radius, 0, radius]), radius*2, 0, -1, 1,ml,tempVerticies,radius);

  //splitTriangle(Vector.create([-radius, 0, -radius]), radius*2, 0, -1, -1,ml,tempVerticies,radius);

  splitTriangle(Vector.create([-radius, 0, radius]), radius*2, 1, -1, 0,ml,tempVerticies,radius);

  //splitTriangle(Vector.create([radius, 0, radius]), radius*2, -1, -1, 0,ml,tempVerticies,radius);
  
  if(colors === undefined || colors.length == 0){
    colors = [];
    for(var i = 0; i < tempVerticies.length; i+=36){
      for(var j = 0; j < 4; j++){
        var tempc = [];
        if(j == 0)
          tempc = [1.0,0.0,0.0,1.0];
        else if(j == 1)
          tempc = [0.0,1.0,0.0,1.0];
        else if(j == 2)
          tempc = [1.0,1.0,0.0,1.0];
        else
          tempc = [0.0,0.0,1.0,1.0];
        for(var k = 0; k < 3; k++)
          colors = colors.concat(tempc);
      }
    }
  }
  
  tempVerticies = tempVerticies.augment((Matrix.Rotation(Math.PI, Vector.create([0,1,0]))).x(tempVerticies));
  tempVerticies = tempVerticies.flatten();
  
  return initArrayBuffer(tempVerticies, tempVerticies.length/3, colors);
}

var tempVerticies;

//add verticies to tempverticies at point right
function decTriSide(right,l,xd,yd,zd,m,tv,rad){
  if(l>m)
      splitTriangle(right, l, xd, yd, zd,m,tv,rad);
  else{ 
      var halfL = l/2;
      vertexP(right,rad,tv);
      if(xd == 0){
        if(yd == 1){
          vertexP(right.add(Vector.create([l, 0, 0])),rad,tv);
          vertexP(right.add(Vector.create([halfL, halfL*yd, -halfL*zd])),rad,tv);
        }
        else{
          vertexP(right.add(Vector.create([halfL, halfL*yd, -halfL*zd])),rad,tv);
          vertexP(right.add(Vector.create([l, 0, 0])),rad,tv);
        }
      }
      else if(zd == 0){
        if(yd == 1){
          vertexP(right.add(Vector.create([halfL*xd, halfL*yd, -halfL])),rad,tv);  
          vertexP(right.add(Vector.create([0, 0, -l])),rad,tv);
        }
        else{
          vertexP(right.add(Vector.create([0, 0, -l])),rad,tv);
          vertexP(right.add(Vector.create([halfL*xd, halfL*yd, -halfL])),rad,tv);
          
        }
      }
  }
}

//split triangle defined by point right in direction xd,yd,zd
function splitTriangle(right,l,xd,yd,zd,m,tv,rad){
  var halfL = l/2;
  var quartL = halfL/2;
  
  decTriSide(right, halfL, xd, yd, zd,m,tv,rad);

  if(xd == 0)
      decTriSide(right.add(Vector.create([halfL, 0, 0])), l/2, xd, yd, zd,m,tv,rad);
  else if(zd == 0)
      decTriSide(right.add(Vector.create([0, 0, -halfL])), l/2, xd, yd, zd,m,tv,rad);
  
  if(xd == 0)
      decTriSide(right.add(Vector.create([quartL, quartL*yd, -quartL*zd])), l/2, xd, -yd, -zd,m,tv,rad);
  else if(zd == 0)
      decTriSide(right.add(Vector.create([quartL*xd, quartL*yd, -quartL])), l/2, -xd, -yd, zd,m,tv,rad);
  
  if(xd == 0)
      decTriSide(right.add(Vector.create([quartL, quartL*yd, -quartL*zd])), l/2, xd, yd, zd,m,tv,rad);
  else if(zd == 0)
      decTriSide(right.add(Vector.create([quartL*xd, quartL*yd, -quartL])), l/2, xd, yd, zd,m,tv,rad);
}

//nromalize point b to distance d from point a
function normalizePoint(a,b,d){
  var tempV = Vector.create([b.elements[0]-a.elements[0],b.elements[1]-a.elements[1],b.elements[2]-a.elements[2]]);
  var dist = distance3P(tempV,Vector.create([0,0,0]));
  return a.add(Vector.create([tempV.elements[0]*d/dist,tempV.elements[1]*d/dist,tempV.elements[2]*d/dist]));
}

//distance between point a and b
function distance3P(a,b){
  return Math.sqrt((a.elements[0]-b.elements[0])*(a.elements[0]-b.elements[0])+(a.elements[1]-b.elements[1])*(a.elements[1]-b.elements[1])+(a.elements[2]-b.elements[2])*(a.elements[2]-b.elements[2]));
}

//add point a to tv
function vertexP(a,r,tv){
  if(tempVerticies == null){
    var p = normalizePoint(Vector.create([0,0,0]),a,r);
    tempVerticies = Matrix.create([[p.elements[0]],[p.elements[1]],[p.elements[2]]]);
  }
  else
    tempVerticies = tempVerticies.augment(normalizePoint(Vector.create([0,0,0]),a,r));
}