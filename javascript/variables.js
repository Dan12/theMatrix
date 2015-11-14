var canvas;
var gl;

var mvMatrix;
var shaderProgram;
var vertexPositionAttribute;
var vertexColorAttribute;
var perspectiveMatrix;
var vertexNormalAttribute;

var ambientVals = [0.3,0.3,0.4];
var constLightingDirection = [1,1,1];
var lightingDirection = constLightingDirection;
var directVals = [0.9,0.9,0.9];

var cubeBuffer;

var threedGuides;
var textCanvas;
var txtCTX;
var threedMV;

var matrixStack = [];

//translate x,y,z rotate x,y
var variablesInit = [0,-13,-34,15,15];
var variableDelta = [0,1,0,15,15];
var variables = variablesInit.slice(0);
var yPosTerminate = 16;

var playing = false;
var playInterval;