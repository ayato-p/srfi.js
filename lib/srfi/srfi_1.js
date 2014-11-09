'use strict';
// srfi-1
;(function(definition){
  // CommonJS
  module.exports = definition();

})(function(){

  var srfi1 = {
    VERSION: '0.0.1',
    AUTHOR: 'ayato_p'
  };

  /*
   * Commonly Functinos
   */
  var isFunction = function(obj){
    return typeof obj === 'function' || false;
  };

  srfi1.list = function(){
    var result = [];

    srfi1.forEach(function(e){
      result.push(e);
    }, arguments);

    return result;
  };

  srfi1.makeList = function(n, fill){
    if(typeof n !== 'number'){ throw new TypeError('n is not number'); }

    var result = [];

    srfi1.forEach(function(){
      result.push(fill);
    }, srfi1.iota(n));

    return result;
  };

  srfi1.listTabulate = function(n, initProc){
    if(typeof n !== 'number' || n < 0){ throw new TypeError('n must be nonnegative number'); }
    if(!isFunction(initProc)){ throw new TypeError('initProc is not function'); }

    var result = [];

    for(var i = 0; i < n; i++){
      result.push(initProc(i));
    }

    return result;
  };

  srfi1.listCopy = function(){};

  srfi1.circularList = function(){};

  srfi1.iota = function(count, start, step){
    if(typeof count !== 'number' || count < 0){ throw new TypeError('count is not number'); }

    var _start = start || 0,
        _step = step || 1,
        result = [];

    for(var i = 0; i < count; i++){
      result.push(_start + (i * _step));
    }

    return result;
  };

  var min = function(obj, iteratee){
    var result = Infinity, lastComputed = Infinity,
        value, computed;

    for(var i = 0; i < obj.length; i++){
      value = obj[i];
      computed = iteratee(value);
      if(computed < lastComputed){
        result = value;
        lastComputed = computed;
      }
    }
    return result;
  };

  srfi1.forEach = function(proc){
    if(!isFunction(proc)){ throw new TypeError('proc is not function'); }
    if(arguments.length < 2){ throw new TypeError('lists are not found'); }

    var lists = Array.prototype.slice.call(arguments, 1),
        minLengthList = min(lists, function(list){ return list.length; }),
        applyArgs;

    for(var i = 0; i < minLengthList.length; i++){
      applyArgs = [];

      for(var j = 0; j < lists.length; j++){
        applyArgs.push(lists[j][i]);
      }
      applyArgs.push(i);

      proc.apply(srfi1, applyArgs);
    }
  };

  return srfi1;
});
