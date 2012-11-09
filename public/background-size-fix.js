var bg = document.createElement("IMG");
bg.src = '/public/deep.png';
$(bg).css({
       "z-index" : -10000,
       position : 'fixed',
       width  : '100%',
       height : '100%'
     });
$(bg).prependTo("body");
