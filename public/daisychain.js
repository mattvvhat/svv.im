var daisychain = function (container, options) {

  var ANIMATION_TIME = 200;

  var images = [], max = 3, ll = undefined, last = undefined, started = false;

  if (typeof container === "string") {
    container = document.getElementById(container);
  }

  container = document.getElementById("instagrammer");

  return {
    prepend : function (sources) {
      prepend(sources);
    },
    chain : function (sources) {
      var c = createchain(sources);

      if (last !== undefined)
        last.next = c.ll;
      else
        last = c.last;

      return c;
    },
    removetail : removetail
  };

  function prepend (sources) {
    var c = createchain(sources);

    if (last !== undefined)
      last.next = c.ll;
    else {
      last = c.last;
      c.start();
    }

  }

  function removetail (num) {
    var r = $(container).children("div")
                         .toArray()
                         .reverse()
                         .slice(0, num);

    for (var k = 0; k < r.length; k++) {
      $(r[k]).fadeOut(ANIMATION_TIME, function () {
        $(this).remove();
      });
    }
  }

  function createchain (sources) {

    var mcallback = undefined, mll = undefined, mlast, prev = undefined;

    for (var k = 0; k < sources.length; k++) {
      var val = sources[k];
      mll = { value : val, next : prev };

      if (prev === undefined)
        mlast = mll;

      prev = mll;
    }

    return { 
      ll : mll,
      last : mlast,
      start : function (cb) {
        callback = cb;
        loadnext();
      }
    };

    function loadnext () {
      var node = mll, img = new Image();

      if (mll === undefined) {
        last = undefined;
        return;
      }

      mll = mll.next;

      img.onload = function () {
        var div = document.createElement("DIV");
        setTimeout(function () {
          $(div).height(0)
                .animate({ height : '306px' }, ANIMATION_TIME)
                .prepend(img)
                .prependTo(container);
          loadnext();
        }, 3*ANIMATION_TIME);
      }
      img.src = node.value;
      delete node;
    }
  }
};
