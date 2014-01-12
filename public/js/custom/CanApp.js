//    CanApp
//    ____________________________________________________________________
//    ____________________________________________________________________
//    ____________________________________________________________________
//    ____________________________________________________________________
//    ____________________________________________________________________
//    ____________________________________________________________________
//    ____________________________________________________________________

/** CanApp **/
CanApp.prototype = App.prototype;

function CanApp (el) {
  el = el || '';
  this.container = typeof el === 'string' ? document.getElementById(el) : el;
  App.call(this);
}

// Init ___ App
CanApp.prototype.init = function () {
  var self = this;
  self.app.width      = 800;
  self.app.height     = 800;
  self.app.view_angle = 15;
  self.app.aspect     = self.app.width/self.app.height;
  self.app.near       = 0.1;
  self.app.far        = 10000;
  self.app.iterations = 0;
  self.app.time       = 0;

  this.renderer = !! window.WebGLRenderingContext ? new THREE.WebGLRenderer({ antialias : true }) : new THREE.CanvasRenderer();
  this.scene    = new THREE.Scene();
  this.camera = new THREE.PerspectiveCamera(
    this.app.view_angle,
    this.app.aspect,
    this.app.near,
    this.app.far
  );

  this.pointLight   = new THREE.PointLight(0x99BBCC);
  this.pointLight.position.x = +10;
  this.pointLight.position.y = +00;
  this.pointLight.position.z = +00;
  this.pointLight.lookAt(new THREE.Vector3(0, 0, 0));
  this.ambientLight = new THREE.AmbientLight(0x333333);

  console.log(this.pointLight);

  {
    var manager = new THREE.LoadingManager();
    manager.onProgress = function () { };

    var uniforms = {
      shadowMatrix  : { type : 'm4',  value : this.camera.matrix },
      proj          : { type : 't',   value : THREE.ImageUtils.loadTexture('/public/img/salmon.jpg') },
      uLightPos     : { type : 'v3',  value : this.pointLight.position }
    };


    var material = new THREE.ShaderMaterial( {
      uniforms        : uniforms,
      vertexShader    : document.getElementById('proj.vert').innerHTML,
      fragmentShader  : document.getElementById('proj.frag').innerHTML
    });

    // material = new THREE.MeshPhongMaterial({ color : 0xCCCCCC });
    // console.log(material);

    var loader = new THREE.OBJLoader(manager);
    loader.load('/public/obj/Soda-Can.obj', function (object) {
      self.sodaCan  = object.children[0];
      self.sodaCan.material = material;
      self.sodaCan.position.y = 0;
      self.scene.add(self.sodaCan);
      self.container.appendChild(self.renderer.domElement);
    });
  }

  this.renderer.setSize(this.app.width, this.app.height);
  this.renderer.setClearColor(new THREE.Color(0xBBBBFF));

  this.scene.add(this.camera);
  this.scene.add(this.pointLight);
  this.scene.add(this.ambientLight);

  this.container.appendChild(this.renderer.domElement);
};

// Update Can App
CanApp.prototype.update = function () {
  this.app.time += 0.00075;
  t = 10 * this.app.time;
  this.camera.position.x = 15;
  this.camera.position.y = 3;
  this.camera.position.z = 15;
  this.camera.up = new THREE.Vector3(0, 1, 0);
  this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  this.camera.updateMatrix();
  this.camera.updateMatrixWorld();

  if (this.sodaCan) {
    this.sodaCan.rotation.x += +.0010;
    this.sodaCan.rotation.y += +.0020;
    this.sodaCan.rotation.z += +.0002;
    this.sodaCan.geometry.computeVertexNormals();
  }
  else {
  }
};

// Draw cube to scene
CanApp.prototype.draw = function () {
  this.renderer.render(this.scene, this.camera);
};

// !!!
CanApp.prototype.set = function (what, val) {
  if (what in this.params) {
    this.params[what] = val;
  }
};
