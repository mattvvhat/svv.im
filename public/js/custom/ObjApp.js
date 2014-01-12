//    Obj app
//    +------+       +------+       +------+       +------+       +------+
//    |`.    |`.     |\     |\      |      |      /|     /|     .'|    .'|
//    |  `+--+---+   | +----+-+     +------+     +-+----+ |   +---+--+'  |
//    |   |  |   |   | |    | |     |      |     | |    | |   |   |  |   |
//    +---+--+   |   +-+----+ |     +------+     | +----+-+   |   +--+---+
//     `. |   `. |    \|     \|     |      |     |/     |/    | .'   | .'
//       `+------+     +------+     +------+     +------+     +------+'

/** CUBE APP **/
ObjApp.prototype = App.prototype;

function ObjApp () {
  App.call(this);
}

~function () {
  // Private stock
  var _renderer;
  var _camera;
  var _map
  var _cube;
  var _pointLight, _ambientLight;
  var _pointColor = [ 0xFF, 0x66, 0x44 ];
  var _ambientColor = [ 0xBB, 0xBB, 0xFF ];

  var _light = { ambient : undefined, point : undefined };
  var _scene;
  var _container;
  var _splash = undefined;
  var _params = { y : 0 };

  // Init Obj App
  ObjApp.prototype.init = function () {
    this.app.width = this.app.height = 800;
    this.app.view_angle = 15;
    this.app.aspect = this.app.width/this.app.height;
    this.app.near = 0.1;
    this.app.far = 10000;

    _container = document.getElementById('div-bg');
    _scene = new THREE.Scene();
    _renderer = new THREE.WebGLRenderer();
    if (!_renderer) {
      _renderer = new THREE.CanvasRenderer();
    }
    _camera = new THREE.PerspectiveCamera(
      this.app.view_angle,
      this.app.aspect,
      this.app.near,
      this.app.far
    );

    var manager = new THREE.LoadingManager();
    manager.onProgress = function () { };

    var texture = new THREE.Texture(THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping);

    /*
    var loader = new THREE.ImageLoader( manager );
    loader.load( '/public/image/marble.jpg', function ( image ) {
      texture.image = image;
      texture.needsUpdate = true;
    });
    */

    var loader = new THREE.OBJLoader(manager);
    loader.load('/public/obj/fluid_spill.obj', function (object) {
      _splash = object;
      _splash.position.y = 0;
      _scene.add(_splash);
      _container.appendChild(_renderer.domElement);
    });

    _camera.position.y = 0;
    _camera.position.z = 20;

    _renderer.setSize(this.app.width, this.app.height);

    _pointLight = new THREE.PointLight(0xFF6644);
    _ambientLight = new THREE.AmbientLight(0xBBBBFF);
    _scene.add(_camera);
    _scene.add(_pointLight);
    _scene.add(_ambientLight);

    _renderer.setClearColor(new THREE.Color(0xBBBBFF));
  };

  // Update Obj App
  ObjApp.prototype.update = function () {
    _pointLight.color.r = _pointColor[0]/0xFF;
    _pointLight.color.g = _pointColor[1]/0xFF;
    _pointLight.color.b = _pointColor[2]/0xFF;
    _ambientLight.color.r = _ambientColor[0]/0xFF;
    _ambientLight.color.g = _ambientColor[1]/0xFF;
    _ambientLight.color.b = _ambientColor[2]/0xFF;

    if (_splash) {
      t = Date.now() / 1000 / 40;
      var pos = {
        x : 30 * Math.cos(7 * t),
        y : 15 * (1 - _params.y) + 1,
        z : 20 * Math.sin(4 * t)
      };
      _camera.position.set(pos.x, pos.y, pos.z);
      _camera.up = new THREE.Vector3(0, 1, 0);
      _camera.lookAt(new THREE.Vector3(0,0,0));
    }
    if (_pointLight) {
      _pointLight.position.x = 100;
      _pointLight.position.y = 0;
      _pointLight.position.z = 20;
    }
  };

  // Draw cube to scene
  ObjApp.prototype.draw = function () {
    _renderer.render(_scene, _camera);
  };

  // 
  ObjApp.prototype.set = function (what, val) {
    if (what in _params) {
      _params[what] = val;
    }
  };
}();
