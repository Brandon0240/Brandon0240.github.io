import { Mat4 } from './math.js';
import { Parser } from './parser.js';
import { Scene } from './scene.js';
import { Renderer } from './renderer.js';
import { TriangleMesh } from './trianglemesh.js';

const quad = {
  positions: [-1, -1, -1, 1, -1, -1, 1, 1, -1, -1, -1, -1, 1, 1, -1, -1, 1, -1],
  normals: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
  uvCoords: [0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]
}

TriangleMesh.prototype.createCube = function () {
  this.positions = [
    
    -1, -1,  1,   1, -1,  1,   1,  1,  1,
    -1, -1,  1,   1,  1,  1,  -1,  1,  1,

     1, -1, -1,  -1, -1, -1,  -1,  1, -1,
     1, -1, -1,  -1,  1, -1,   1,  1, -1,

    -1,  1,  1,   1,  1,  1,   1,  1, -1,
    -1,  1,  1,   1,  1, -1,  -1,  1, -1,

    -1, -1, -1,   1, -1, -1,   1, -1,  1,
    -1, -1, -1,   1, -1,  1,  -1, -1,  1,

     1, -1,  1,   1, -1, -1,   1,  1, -1,
     1, -1,  1,   1,  1, -1,   1,  1,  1,

    -1, -1, -1,  -1, -1,  1,  -1,  1,  1,
    -1, -1, -1,  -1,  1,  1,  -1,  1, -1,
    
  ];

  this.normals = [

    0, 0, 1,  0, 0, 1,  0, 0, 1,
    0, 0, 1,  0, 0, 1,  0, 0, 1,

    0, 0, -1,   0, 0, -1,   0, 0, -1,
    0, 0, -1,   0, 0, -1,   0, 0, -1,

    0, 1, 0,   0, 1, 0,   0, 1, 0,
    0, 1, 0,   0, 1, 0,   0, 1, 0,

    0, -1, 0,   0, -1, 0,   0, -1, 0,
    0, -1, 0,   0, -1, 0,   0, -1, 0,

    1, 0, 0,   1, 0, 0,   1, 0, 0,
    1, 0, 0,   1, 0, 0,   1, 0, 0,

    -1, 0, 0,  -1, 0, 0,  -1, 0, 0,
    -1, 0, 0,  -1, 0, 0,  -1, 0, 0,
  ];

  this.uvCoords = [
    0, 2/3,  0.5, 2/3,  0.5, 1,
    0, 2/3,  0.5, 1,    0, 1,

    1, 0,    0.5, 0,    0.5, 1/3,
    1, 0,    0.5, 1/3,  1, 1/3,
  
    0, 0,    0.5, 0,    0.5, 1/3,
    0, 0,    0.5, 1/3,  0, 1/3,
  
    0.5, 2/3,  1, 2/3,  1, 1,
    0.5, 2/3,  1, 1,    0.5, 1,
   
    0, 1/3,  0.5, 1/3,  0.5, 2/3,
    0, 1/3,  0.5, 2/3,  0, 2/3,

    0.5, 2/3,  1, 2/3,  1, 1/3,
    0.5, 2/3,  1, 1/3,  0.5, 1/3,
  ];

  this.indices = [];
};

TriangleMesh.prototype.createSphere = function (numStacks, numSectors) {

  this.positions = [];
  this.normals = [];
  this.uvCoords = [];
  this.indices = [];
  this.lineIndices = [];
  
 
  let x, y, z, xy;
  let nx, ny, nz, lengthInv = 1.0 / 1;
  let s, t;
  let sectorStep = (2 * Math.PI) / numSectors;
  let stackStep = Math.PI / numStacks;
  let sectorAngle, stackAngle;
  
  for (let i = 0; i <= numStacks; ++i) {
    stackAngle = Math.PI / 2 - i * stackStep;
    xy = 1 * Math.cos(stackAngle); 
    z = 1 * Math.sin(stackAngle);

    for (let j = 0; j <= numSectors; ++j) {
      sectorAngle = j * sectorStep;

      x = xy * Math.cos(sectorAngle);
      y = xy * Math.sin(sectorAngle);

      this.positions.push(x);
      this.positions.push(y);
      this.positions.push(z);


      nx = x * lengthInv;
      ny = y * lengthInv;
      nz = z * lengthInv;
      this.normals.push(nx);
      this.normals.push(ny);
      this.normals.push(nz);

      s = j / numSectors;
      t = i / numStacks;
      this.uvCoords.push(s);
      this.uvCoords.push(t);
    }
  }
  let k1, k2;
 
  for (let i = 0; i < numStacks; ++i) {
    k1 = i * (numSectors + 1);
    k2 = k1 + numSectors + 1;
    
    for (let j = 0; j < numSectors; ++j,++k1,++k2) {
  
      
      if (i != 0) {
        this.indices.push(k1);
        this.indices.push(k2);
        this.indices.push(k1 + 1);
      }
      if (i != (numStacks - 1)) {
        this.indices.push(k1 + 1);
        this.indices.push(k2);
        this.indices.push(k2 + 1);
      }
      this.lineIndices.push(k1); 
      this.lineIndices.push(k2);
      if (i != 0) {
        this.lineIndices.push(k1);
        this.lineIndices.push(k1 + 1);
      }
    }
  }
  for (let a of [this.positions, this.normals]) {
    for (let x = 0; x < a.length; x += 3) {
      let degrees = 44.05;
      a[x + 1] = -((Math.cos(degrees) * a[x + 1]) - (Math.sin(degrees) * a[x + 2]));
      a[x + 2] =   (Math.cos(degrees) * a[x + 2]) + (Math.sin(degrees) * a[x + 1]);
    }
  }

  

  
}

Scene.prototype.computeTransformation = function (transformSequence) {

  let overallTransform = Mat4.create(); 
 
  for (let i = transformSequence.length - 1; i >= 0; i--) {
    const item = transformSequence[i];
    switch (item[0]) {
      case 'T':
        
        console.log("item[0]:", item[0]);
       
        let transform_matrix = [
          1, 0, 0, 0,  
          0, 1, 0, 0,  
          0, 0, 1, 0,  
          item[1], item[2], item[3], 1  
        ];
      
      
        overallTransform = Mat4.multiply(overallTransform, overallTransform,transform_matrix)

        console.log("overallTransform:", overallTransform);
        break;
      case 'Rx':
        console.log("item[0]:", item[0]);
        let radianx =  Math.PI / 180 * item[1] ;
    
        let cosx = Math.cos(radianx)
        let sinx = Math.sin(radianx)
        
        let rx_matrix = [
          1, 0, 0, 0,
          0, cosx, sinx,  0,
          0, -sinx, cosx, 0,
          0, 0, 0, 1
        ];
        overallTransform = Mat4.multiply(overallTransform, overallTransform,rx_matrix)
      
        break;
      case 'Ry':
        let radiany =  Math.PI / 180 * item[1] ;
        console.log("item[0]:", item[0]);
        let cosy = Math.cos(radiany)
        let siny = Math.sin(radiany)
     
        let ry_matrix = [
          cosy, 0, -siny, 0,
          0, 1, 0,  0,
          siny, 0, cosy, 0,
          0, 0, 0, 1
        ];
        overallTransform = Mat4.multiply(overallTransform, overallTransform,ry_matrix)
       
        break;

      case 'Rz':
        console.log("item[0]:", item[0]);
        let radianz =  Math.PI / 180 * item[1] ;
        let cosz = Math.cos(radianz)
        let sinz = Math.sin(radianz)
        let rz_matrix = [
          cosz, sinz, 0, 0,
          -sinz,cosz, 0,  0,
          0, 0, 1, 0,
          0, 0, 0, 1
        ];
        overallTransform = Mat4.multiply(overallTransform, overallTransform,rz_matrix)
      
        break;
  
      case 'S':
        console.log("item[0]:", item[0]);
        let scale_matrix = [
          item[1], 0, 0, 0,
          0, item[2], 0,  0,
          0, 0, item[3], 0,
          0, 0, 0, 1
        ];
        overallTransform = Mat4.multiply(overallTransform, overallTransform,scale_matrix)
      
        break;
        
  
    }

  }
 
  
  return overallTransform;
}

Renderer.prototype.VERTEX_SHADER = `
precision mediump float;
attribute vec3 position, normal;
attribute vec2 uvCoord;
uniform vec3 lightPosition;//L
uniform mat4 projectionMatrix, viewMatrix, modelMatrix;
uniform mat3 normalMatrix;
varying vec2 vTexCoord;

varying vec3 surfaceNormal;
varying vec3 vlightPosition;
varying vec3 V;
//varying vec3 gl_Position;
// TODO: implement vertex shader logic below

//varying vec3 temp;

void main() {
  V = normalize(vec3(viewMatrix * modelMatrix * vec4(position, 1.0)));
  vlightPosition = lightPosition;
  surfaceNormal = normal;
  vTexCoord = uvCoord;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  }
`;

Renderer.prototype.FRAGMENT_SHADER = `
precision mediump float;
uniform vec3 ka, kd, ks, lightIntensity;
uniform float shininess;
uniform sampler2D uTexture;
uniform bool hasTexture;
varying vec2 vTexCoord;

varying vec3 surfaceNormal;
varying vec3 vlightPosition;

varying vec3 V;

// TODO: implement fragment shader logic below

void main() {
  
  vec3 N = normalize(surfaceNormal);
  
  vec3 L = normalize(vlightPosition);
  
   
  vec3 H = normalize(L + V);

  vec3 ambient = ka * lightIntensity;
  
  
  float diff = max(0.0, dot(N, L));
  vec3 diffuse = kd * diff * lightIntensity;

  
  float spec = pow(max(0.0, dot(N, H)), shininess);

  vec3 specular = ks * spec * lightIntensity;

  vec3 finalColor = ambient + diffuse + specular;
  vec3 textureColor = texture2D(uTexture, vTexCoord).rgb;
  if (hasTexture) {
    finalColor *= textureColor;
  }

  gl_FragColor = vec4(finalColor, 1.0);
  
 
}
`;


const DEF_INPUT = [


  
  "c,myCamera,perspective,7,7,7,0,0,0,0,1,0;",
  "l,myLight,point,-4,5,-4,1.2,1.2,1.2;",
  "p,unitCube,cube;",
  "p,unitSphere,sphere,20,20;",
  "m,globeMat,1,1,1,0.7,0.7,0.7,1,1,1,5,sun.png;",
  "o,gl,unitSphere,globeMat;",
  "X,gl,S,1.5,1.5,1.5;X,gl,Rx,90;X,gl,Ry,-150;X,gl,T,-2,4,-1;",
  
  "m,topdirt,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largetopdirt.png;",
"o,d1,unitCube,topdirt;",
"X,d1,Rx,0;X,d1,Rz,0;X,d1,Ry,0; X,d1,T,4,-1,4;X,d1,S,0.5,0.5,0.5;",

"m,topdirt2,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largetopdirt.png;",
"o,g2,unitCube,topdirt2;",
"X,g2,Rx,0;X,g2,Rz,0;X,g2,Ry,0; X,g2,T,6,-1,4;X,g2,S,0.5,0.5,0.5;",

"m,topdirt3,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largetopdirt.png;",
"o,g3,unitCube,topdirt3;",
"X,g3,Rx,0;X,g3,Rz,0;X,g3,Ry,0; X,g3,T,2,-1,4;X,g3,S,0.5,0.5,0.5;",

"m,topdirt3,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largetopdirt.png;",
"o,g4,unitCube,topdirt3;",
"X,g4,Rx,0;X,g4,Rz,0;X,g4,Ry,0; X,g4,T,2,-1,2;X,g4,S,0.5,0.5,0.5;",

"m,topdirt3,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largetopdirt.png;",
"o,g5,unitCube,topdirt3;",
"X,g5,Rx,0;X,g5,Rz,0;X,g5,Ry,0; X,g5,T,2,-1,0 ;X,g5,S,0.5,0.5,0.5;",

"m,topdirt3,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largetopdirt.png;",
"o,g6,unitCube,topdirt3;",
"X,g6,Rx,0;X,g6,Rz,0;X,g6,Ry,0; X,g6,T,4,-1,0 ;X,g6,S,0.5,0.5,0.5;",

"m,topdirt3,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largetopdirt.png;",
"o,g7,unitCube,topdirt3;",
"X,g7,Rx,0;X,g7,Rz,0;X,g7,Ry,0; X,g7,T,6,-1,0 ;X,g7,S,0.5,0.5,0.5;",

"m,topdirt3,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largetopdirt.png;",
"o,g8,unitCube,topdirt3;",
"X,g8,Rx,0;X,g8,Rz,0;X,g8,Ry,0; X,g8,T,4,-1,2 ;X,g8,S,0.5,0.5,0.5;",

"m,topdirt3,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largetopdirt.png;",
"o,g9,unitCube,topdirt3;",
"X,g9,Rx,0;X,g9,Rz,0;X,g9,Ry,0; X,g9,T,6,-1,2 ;X,g9,S,0.5,0.5,0.5;",

"m,topdirt3,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largetopdirt.png;",
"o,g10,unitCube,topdirt3;",
"X,g10,Rx,0;X,g10,Rz,0;X,g10,Ry,0; X,g10,T,2,-1,0 ;X,g10,S,0.5,0.5,0.5;",

"m,bottomdirt,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largebottomdirt.png;",
"o,b1,unitCube,bottomdirt;",
"X,b1,Rx,0;X,b1,Rz,0;X,b1,Ry,0; X,b1,T,4,-3,4;X,b1,S,0.5,0.5,0.5;",

"m,bottomdirt2,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largebottomdirt.png;",
"o,b2,unitCube,bottomdirt2;",
"X,b2,Rx,0;X,b2,Rz,0;X,b2,Ry,0; X,b2,T,6,-3,4;X,b2,S,0.5,0.5,0.5;",

"m,bottomdirt3,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largebottomdirt.png;",
"o,b3,unitCube,bottomdirt3;",
"X,b3,Rx,0;X,b3,Rz,0;X,b3,Ry,0; X,b3,T,2,-3,4;X,b3,S,0.5,0.5,0.5;",

"m,bottomdirt3,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largebottomdirt.png;",
"o,b4,unitCube,bottomdirt3;",
"X,b4,Rx,0;X,b4,Rz,0;X,b4,Ry,0; X,b4,T,2,-3,2;X,b4,S,0.5,0.5,0.5;",

"m,bottomdirt3,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largebottomdirt.png;",
"o,b5,unitCube,bottomdirt3;",
"X,b5,Rx,0;X,b5,Rz,0;X,b5,Ry,0; X,b5,T,2,-3,0 ;X,b5,S,0.5,0.5,0.5;",

"m,bottomdirt3,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largebottomdirt.png;",
"o,b6,unitCube,bottomdirt3;",
"X,b6,Rx,0;X,b6,Rz,0;X,b6,Ry,0; X,b6,T,4,-3,0 ;X,b6,S,0.5,0.5,0.5;",

"m,bottomdirt3,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largebottomdirt.png;",
"o,b7,unitCube,bottomdirt3;",
"X,b7,Rx,0;X,b7,Rz,0;X,b7,Ry,0; X,b7,T,6,-3,0 ;X,b7,S,0.5,0.5,0.5;",

"m,bottomdirt3,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largebottomdirt.png;",
"o,b8,unitCube,bottomdirt3;",
"X,b8,Rx,0;X,b8,Rz,0;X,b8,Ry,0; X,b8,T,4,-3,2 ;X,b8,S,0.5,0.5,0.5;",

"m,bottomdirt3,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largebottomdirt.png;",
"o,b9,unitCube,bottomdirt3;",
"X,b9,Rx,0;X,b9,Rz,0;X,b9,Ry,0; X,b9,T,6,-3,2 ;X,b9,S,0.5,0.5,0.5;",

"m,bottomdirt3,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largebottomdirt.png;",
"o,b10,unitCube,bottomdirt3;",
"X,b10,Rx,0;X,b10,Rz,0;X,b10,Ry,0; X,b10,T,2,-3,0 ;X,b10,S,0.5,0.5,0.5;",

"m,bottomdirt4,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largetopdirt.png;",
"o,b11,unitCube,bottomdirt4;",
"X,b11,Rx,0;X,b11,Rz,0;X,b11,Ry,0; X,b11,T,0,-1,4 ;X,b11,S,0.5,0.5,0.5;",

"m,bottomdirt4,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largetopdirt.png;",
"o,b12,unitCube,bottomdirt4;",
"X,b12,Rx,0;X,b12,Rz,0;X,b12,Ry,0; X,b12,T,0,-1,2 ;X,b12,S,0.5,0.5,0.5;",

"m,bottomdirt4,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largetopdirt.png;",
"o,b13,unitCube,bottomdirt4;",
"X,b13,Rx,0;X,b13,Rz,0;X,b13,Ry,0; X,b13,T,0,-1,0 ;X,b13,S,0.5,0.5,0.5;",

"m,bottomdirt4,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largetopdirt.png;",
"o,b14,unitCube,bottomdirt4;",
"X,b14,Rx,0;X,b14,Rz,0;X,b14,Ry,0; X,b14,T,-2,-1,4 ;X,b14,S,0.5,0.5,0.5;",

"m,bottomdirt4,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largetopdirt.png;",
"o,b15,unitCube,bottomdirt4;",
"X,b15,Rx,0;X,b15,Rz,0;X,b15,Ry,0; X,b15,T,-2,-1,2 ;X,b15,S,0.5,0.5,0.5;",

"m,bottomdirt4,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largetopdirt.png;",
"o,b16,unitCube,bottomdirt4;",
"X,b16,Rx,0;X,b16,Rz,0;X,b16,Ry,0; X,b16,T,-2,-1,0 ;X,b16,S,0.5,0.5,0.5;",

"m,bottomdirt5,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largebottomdirt.png;",
"o,b17,unitCube,bottomdirt5;",
"X,b17,Rx,0;X,b17,Rz,0;X,b17,Ry,0; X,b17,T,-2,-3,4 ;X,b17,S,0.5,0.5,0.5;",

"m,bottomdirt5,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largebottomdirt.png;",
"o,b18,unitCube,bottomdirt5;",
"X,b18,Rx,0;X,b18,Rz,0;X,b18,Ry,0; X,b18,T,-2,-3,2 ;X,b18,S,0.5,0.5,0.5;",

"m,bottomdirt5,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largebottomdirt.png;",
"o,b19,unitCube,bottomdirt5;",
"X,b19,Rx,0;X,b19,Rz,0;X,b19,Ry,0; X,b19,T,-2,-3,0 ;X,b19,S,0.5,0.5,0.5;",

"m,bottomdirt5,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largebottomdirt.png;",
"o,b20,unitCube,bottomdirt5;",
"X,b20,Rx,0;X,b20,Rz,0;X,b20,Ry,0; X,b20,T,-2,-3,4 ;X,b20,S,0.5,0.5,0.5;",

"m,bottomdirt5,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largebottomdirt.png;",
"o,b21,unitCube,bottomdirt5;",
"X,b21,Rx,0;X,b21,Rz,0;X,b21,Ry,0; X,b21,T,-2,-3,2 ;X,b21,S,0.5,0.5,0.5;",

"m,bottomdirt5,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largebottomdirt.png;",
"o,b22,unitCube,bottomdirt5;",
"X,b22,Rx,0;X,b22,Rz,0;X,b22,Ry,0; X,b22,T,0,-3,4 ;X,b22,S,0.5,0.5,0.5;",



"m,trunk3,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largewoodtrunk.png;",
"o,t1,unitCube,trunk3;",
"X,t1,Rx,0;X,t1,Rz,0;X,t1,Ry,0; X,t1,T,4,1,2 ;X,t1,S,0.5,0.5,0.5;",

"m,trunk3,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largewoodtrunk.png;",
"o,t2,unitCube,trunk3;",
"X,t2,Rx,0;X,t2,Rz,0;X,t2,Ry,0; X,t2,T,4,3,2 ;X,t2,S,0.5,0.5,0.5;",

"m,trunk3,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largewoodtrunk.png;",
"o,t3,unitCube,trunk3;",
"X,t3,Rx,90;X,t3,Rz,0;X,t3,Ry,0; X,t3,T,0,1,2 ;X,t3,S,0.5,0.5,0.5;",

"m,trunk4,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largewoodtrunk.png;",
"o,t4,unitCube,trunk3;",
"X,t4,Rx,90;X,t4,Rz,0;X,t4,Ry,0; X,t4,T,0,1,4 ;X,t4,S,0.5,0.5,0.5;",

"m,leaves1,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largeleaves.png;",
"o,l0,unitCube,leaves1;",
"X,l0,Rx,0;X,l0,Rz,0;X,l0,Ry,0; X,l0,T,4,5,0 ;X,l0,S,0.5,0.5,0.5;",

"m,leaves1,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largeleaves.png;",
"o,l1,unitCube,leaves1;",
"X,l1,Rx,0;X,l1,Rz,0;X,l1,Ry,0; X,l1,T,4,5,2 ;X,l1,S,0.5,0.5,0.5;",

"m,leaves1,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largeleaves.png;",
"o,l2,unitCube,leaves1;",
"X,l2,Rx,0;X,l2,Rz,0;X,l2,Ry,0; X,l2,T,4,5,4 ;X,l2,S,0.5,0.5,0.5;",

"m,leaves1,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largeleaves.png;",
"o,l3,unitCube,leaves1;",
"X,l3,Rx,0;X,l3,Rz,0;X,l2,Ry,0; X,l3,T,4,5,0 ;X,l3,S,0.5,0.5,0.5;",

"m,leaves1,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largeleaves.png;",
"o,l4,unitCube,leaves1;",
"X,l4,Rx,0;X,l4,Rz,0;X,l4,Ry,0; X,l4,T,6,5,2 ;X,l4,S,0.5,0.5,0.5;",

"m,leaves1,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largeleaves.png;",
"o,l5,unitCube,leaves1;",
"X,l5,Rx,0;X,l5,Rz,0;X,l5,Ry,0; X,l5,T,4,7,2 ;X,l5,S,0.5,0.5,0.5;",

"m,leaves1,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5, largeleaves.png;",
"o,l6,unitCube,leaves1;",
"X,l6,Rx,0;X,l6,Rz,0;X,l6,Ry,0; X,l6,T,2,5,2 ;X,l6,S,0.5,0.5,0.5;",

 ].join("\n");

export { Parser, Scene, Renderer, DEF_INPUT };
