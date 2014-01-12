//    ___ app
//    ____________________________________________________________________
//    ____________________________________________________________________
//    ____________________________________________________________________
//    ____________________________________________________________________
//    ____________________________________________________________________
//    ____________________________________________________________________
//    ____________________________________________________________________

/** CUBE APP **/
___App.prototype = App.prototype;

function ___App (el) {
  el = el || '';
  this.container = typeof el === 'string' ? document.getElementById(el) : el;
  App.call(this);
}

// Init ___ App
___App.prototype.init = function () {
  var self = this;
  self.app.width      = 400;
  self.app.height     = 400;
  self.app.view_angle = 15;
  self.app.aspect     = self.app.width/self.app.height;
  self.app.near       = 0.1;
  self.app.far        = 10000;
  self.app.iterations = 0;
  self.app.time       = 0;

  this.scene    = new THREE.Scene();
  this.renderer = !! window.WebGLRenderingContext ? new THREE.WebGLRenderer({ antialias : true }) : new THREE.CanvasRenderer();
  this.camera = new THREE.PerspectiveCamera(
    this.app.view_angle,
    this.app.aspect,
    this.app.near,
    this.app.far
  );

  this.pointLight   = new THREE.PointLight(0x999999);
  this.pointLight.position.x = 0;
  this.pointLight.position.y = 05;
  this.pointLight.position.z = 15;
  this.ambientLight = new THREE.AmbientLight(0x996644);

  this.renderer.setSize(this.app.width, this.app.height);
  this.renderer.setClearColor(new THREE.Color(0xBBBBFF));

  this.scene.add(this.camera);
  this.scene.add(this.pointLight);
  this.scene.add(this.ambientLight);

  this.container.appendChild(this.renderer.domElement);
};

// Update ___ App
___App.prototype.update = function () {
  this.app.time += 0.00075;
  t = 10 * this.app.time;
  this.camera.position.x = 12 * Math.cos(3*t);
  this.camera.position.y = 15 * Math.sin(5*t);
  this.camera.position.z = 15 + 10 * Math.cos(3 * t);
  this.camera.up = new THREE.Vector3(0, 0, 1);
  this.camera.lookAt(new THREE.Vector3(0, 0, 0));
};

// Draw cube to scene
___App.prototype.draw = function () {
  this.renderer.render(this.scene, this.camera);
};

// !!!
___App.prototype.set = function (what, val) {
  if (what in this.params) {
    this.params[what] = val;
  }
};
