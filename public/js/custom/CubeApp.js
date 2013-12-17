//    Cube app
//    +------+       +------+       +------+       +------+       +------+
//    |`.    |`.     |\     |\      |      |      /|     /|     .'|    .'|
//    |  `+--+---+   | +----+-+     +------+     +-+----+ |   +---+--+'  |
//    |   |  |   |   | |    | |     |      |     | |    | |   |   |  |   |
//    +---+--+   |   +-+----+ |     +------+     | +----+-+   |   +--+---+
//     `. |   `. |    \|     \|     |      |     |/     |/    | .'   | .'
//       `+------+     +------+     +------+     +------+     +------+'

/** CUBE APP **/
CubeApp.prototype = App.prototype;

function CubeApp () {
  App.call(this);
}

~function () {
  // Private stock
  var _renderer;
  var _camera;
  var _map
  var _cube;
  var _pointLight;
  var _scene;
  var _container;

  // Init Cube App
  CubeApp.prototype.init = function () {
    this.app.width = this.app.height = 600;
    this.app.view_angle = 45;
    this.app.aspect = this.app.width/this.app.height;
    this.app.near = 0.1;
    this.app.far = 10000;

    _scene = new THREE.Scene();
    _renderer = new THREE.WebGLRenderer();
    _camera = new THREE.PerspectiveCamera(
      this.app.view_angle,
      this.app.aspect,
      this.app.near,
      this.app.far
    );

    _camera.position.z = 300;
    _renderer.setSize(this.app.width, this.app.height);

    var marble = THREE.ImageUtils.loadTexture('/public/image/marble.jpg');
    var material = new THREE.MeshLambertMaterial({ color: 0xFFFFFF, map : marble });
    _pointLight = new THREE.PointLight(0xFFFFFF);
    _cube = new THREE.Mesh(
      new THREE.CubeGeometry(50, 50, 50, 10, 10, 10),
      material
    );

    _scene.add(_camera);
    _scene.add(_cube);
    _scene.add(_pointLight);
    _scene.add(new THREE.AmbientLight( 0x666666 ));
    _renderer.setClearColor(new THREE.Color(0x111111));

    _container = document.getElementById('threeScene');
    _container.appendChild(_renderer.domElement);
  };

  // Update Cube App
  CubeApp.prototype.update = function () {
    _cube.rotation.x += 0.01;
    _cube.rotation.y += 0.03;
    _pointLight.position.x = 100;
    _pointLight.position.y = 0;
    _pointLight.position.z = 100;
  };

  // Draw cube to scene
  CubeApp.prototype.draw = function () {
    _renderer.render(_scene, _camera);
  };
}();

var s = new CubeApp();
s.loop();
