require('./google');

var PhotoSwipe = require('photoswipe');
var PhotoSwipeUI_Default = require('../../node_modules/photoswipe/dist/photoswipe-ui-default.js');


function open_photoswipe(items, index, disable_animation, from_url) {

  var options = {
    // define gallery index (for URL)
    galleryUID: GALLERY_INDEX,
    loop: false,

    getThumbBoundsFn: function (index) {
      var rect = items[index].img_elem.getBoundingClientRect();

      return {
        x: rect.left,
        y: rect.top + (window.pageYOffset || document.documentElement.scrollTop),
        w: rect.width
      };
    }

  };

  if (from_url) {
    options.index = parseInt(index, 10) - 1;
  } else {
    options.index = parseInt(index, 10);
  }

  if (!isNaN(options.index)) {

    if (disable_animation) {
      options.showAnimationDuration = 0;
    }

    var gallery = new PhotoSwipe(pswp_elem, PhotoSwipeUI_Default, items, options);
    gallery.init();
  }
}


function parse_url_hash() {
  var params = {};
  var vars = window.location.hash.substring(1).split('&');

  for (var i = 0; i < vars.length; i++) {
    if (vars[i]) {
      var pair = vars[i].split('=');
      if (pair.length >= 2) {
        params[pair[0]] = pair[1];
      }
    }
  }
  return params;
}


function parse_thumbnails() {
  var items = [];

  for (var i = 0; i < gallery_elem.childNodes.length; i++) {
    var figure_elem = gallery_elem.childNodes[i];

    // include only element nodes
    if (figure_elem.nodeType === Node.ELEMENT_NODE) {

      var link_elem = figure_elem.children[0];
      var img_elem = link_elem.children[0];
      var size = link_elem.getAttribute('data-size').split('x');

      var item = {
        src: link_elem.getAttribute('href'),
        w: parseInt(size[0], 10),
        h: parseInt(size[1], 10),
        img_elem: img_elem
      };

      // Get thumbnail url
      if (link_elem.children.length > 0) {
        item.msrc = img_elem.getAttribute('src');
      }

      // Get caption
      if (figure_elem.children.length > 1) {
        item.title = figure_elem.children[1].innerHTML;
      }

      items.push(item);
    }
  }

  return items;
}


function setup_events(items) {
  for (var i = 0; i < items.length; i++) {
    items[i].img_elem.parentNode.onclick = (function (index) {
      return function () {
        if (event.preventDefault) {
          event.preventDefault()
        } else {
          event.returnValue = false;
        }

        open_photoswipe(items, index);
        return false;
      };
    })(i);
  }
}


var GALLERY_INDEX = 1;

var pswp_elem = document.querySelectorAll('.pswp')[0];
var gallery_elem = document.querySelectorAll('.gallery')[0];

gallery_elem.setAttribute('data-pswp-uid', GALLERY_INDEX);

var items = parse_thumbnails();
setup_events(items);

var url_data = parse_url_hash();
if (url_data.pid) {
  open_photoswipe(items, url_data.pid, true, true);
}
