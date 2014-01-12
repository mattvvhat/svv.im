/**
 * App.js
 * A class that automatically handles looping, and creates default functions
 * for `update`, `draw`, `loop`, and `stop`. `loop` and `stop` should not be
 * overwritten, the should be used as-is.
 */
function App () {

  // Private stock
  var _running = true;
  var _error_callback = function () {};
  var self = this;

  // Public
  this.app = {};

  this.stop = _stop;
  this.loop = function () {
    _running = true;
    requestAnimationFrame(_loop);
  };

  this.init   = this.init   ? this.init   : function () {};

  this.init();

  /**
   * Update App Prior to Rendering
   * This method updates the app before the draw step.
   * @note This method is automatically called during a `loop` cycle.
   */
  function _update () { }

  /**
   * Render App to DOM
   * This method draws the app to the DOM, after the update step.
   * @note This method is automatically called during a `loop` cycle.
   */
  function _draw () { }

  /**
   * Initiate a Loop
   * This method begins the app's loop cycle.
   * @note This method calls `update` and `draw` until `stop` is called.
   */
  function _loop () {
    if (_running) {
      requestAnimationFrame(_loop);
    }

    self.update();
    self.draw();
  };

  /**
   * Stop the Loop Cycle
   * This method stops the app from looping.
   */
  function _stop () {
    _running = false;
  }

  /**
   * Event to fire on error
   * This method triggers a callback
   * @param {function} callback a callback function to call when an error
   * occurs in the update-draw loop.
   */
  function _error (callback) {
    if (typeof callback === 'function') {
      _error_callback = callback;
    }
  }
}
