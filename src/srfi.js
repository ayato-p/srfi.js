;(function(definition){
  // CommonJS
  if(typeof exports === 'object'){
    module.exports = definition();

  } else {
    srfi = definition();
  }
})(function(){
  'use strict';

  var srfi = {
    VERSION: '0.0.1',
    AUTHOR: 'ayato_p'
  };

  srfi.srfi1 = require('./srfi/srfi_1');

  return srfi;
});

