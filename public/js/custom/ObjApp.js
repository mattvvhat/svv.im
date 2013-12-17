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
  var _pointLight;
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

    _scene = new THREE.Scene();
    _renderer = new THREE.WebGLRenderer();
    if (!_renderer)
      _renderer = new THREE.CanvasRenderer();
    _camera = new THREE.PerspectiveCamera(
      this.app.view_angle,
      this.app.aspect,
      this.app.near,
      this.app.far
    );

    var manager = new THREE.LoadingManager();
    manager.onProgress = function () { };

    var texture = new THREE.Texture(THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping);

    var loader = new THREE.ImageLoader( manager );
    loader.load( '/public/image/marble.jpg', function ( image ) {
      texture.image = image;
      texture.needsUpdate = true;
    });

    var loader = new THREE.OBJLoader(manager);
    loader.load('/public/obj/fluid_spill.obj', function ( object ) {
      object.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          // child.material.map = texture;
        }
      });

      _splash = object;
      _splash.position.y = 0;
      _scene.add(_splash);
    });

    _camera.position.y = 0;
    _camera.position.z = 20;

    _renderer.setSize(this.app.width, this.app.height);

    var material = new THREE.MeshLambertMaterial({ color: 0xDDDDFF });
    _cube = new THREE.Mesh( new THREE.CubeGeometry(50, 50, 50, 10, 10, 10), material );

    _pointLight = new THREE.PointLight(0xFF6644);
    _scene.add(_camera);
    _scene.add(_pointLight);
    _scene.add(new THREE.AmbientLight( 0xBBBBFF ));
    _renderer.setClearColor(new THREE.Color(0xBBBBFF));

    _container = document.getElementById('div-bg');
    _container.appendChild(_renderer.domElement);
  };

  // Update Obj App
  ObjApp.prototype.update = function () {
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
