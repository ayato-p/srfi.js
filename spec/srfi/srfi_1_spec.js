'use strict';

var assert = require('power-assert');
var srfi = require('../../src/srfi/srfi_1');

describe('srfi', function(){
  var actual;

  beforeEach(function(){
    actual = null;
  });

  describe('.list', function(){

    describe('0 argument', function(){
      it('should be return empty array', function(){
        actual = srfi.list();
        assert.deepEqual(actual, []);
      });
    });

    describe('any arguments', function(){
      it('should be return array included any objects', function(){
        actual = srfi.list(1, 2, 3, [4, 5], {foo: {bar: 'bar'}}, 'Hello');
        assert.deepEqual(actual, [1, 2, 3, [4, 5], {foo: {bar: 'bar'}}, 'Hello']);
      });
    });
  });

  describe('.makeList', function(){
    describe('misshing **n**', function(){
      it('should be throw exception', function(){
        assert.throws(srfi.makeList);
      });
    });

    describe('n is not a number', function(){
      it('should be throw exception', function(){
        assert.throws(function(){
          srfi.makeList('Hello');
        }, /^TypeError: n is not number$/);
      });

      it('should be throw exception', function(){
        assert.throws(function(){
          srfi.makeList('Hello', 10);
        });
      });
    });

    describe('only **n**', function(){
      beforeEach(function(){
        actual = srfi.makeList(10);
      });

      it('should be make length **n** array', function(){
        assert(actual.length === 10);
      });

      it('should be make array with all undefined', function(){
        srfi.forEach(function(e, idx){
          assert(typeof actual[idx] === 'undefined');
        }, actual);
      });
    });

    describe('has **n** and **fill**', function(){
      it('should be make length same as **n**', function(){
        actual = srfi.makeList(5, 'Hello');
        assert(actual.length === 5);
      });

      it('should be make array with some string', function(){
        actual = srfi.makeList(3, 'Hello');
        srfi.forEach(function(e, idx){
          assert(actual[idx] === 'Hello');
        }, actual);
      });

      it('should be make array with some object', function(){
        var someobj = {foo: 'bar'};
        actual = srfi.makeList(3, someobj);
        srfi.forEach(function(e, idx){
          assert(actual[idx] === someobj);
        }, actual);
      });
    });
  });

  describe('.listTabulate', function(){
    describe('misshing **n** or **init-proc**', function(){
      it('should be throw exception', function(){
        assert.throws(srfi.listTabulate, /TypeError: n must be nonnegative number$/);
      });

      it('should be throw exception', function(){
        assert.throws(function(){ srfi.listTabulate(10); });
      });
    });

    describe('calling with negative number and some function', function(){
      it('should be throw exception', function(){
        assert.throws(function(){ srfi.listTabulate(-1, function(n){ return n; });});
      });
    });

    describe('calling with positive number and some function', function(){
      beforeEach(function(){
        actual = srfi.listTabulate(5, function(n){ return n * n; });
      });

      it('should be made array', function(){
        assert(actual.length === 5);
      });

      it('should be applied to initProc', function(){
        assert.deepEqual(actual, [0,1,4,9,16]);
      });
    });
  });

  describe('.iota', function(){
    describe('misshing **count**', function(){
      it('should be throw exception', function(){
        assert.throws(srfi.iota);
      });
    });

    describe('calling with count argument', function(){
      beforeEach(function(){ actual = srfi.iota(10); });

      it('should be made array', function(){
        assert.deepEqual(actual, [0,1,2,3,4,5,6,7,8,9]);
      });

      it('should be make array and length as same as **count**', function(){
        assert(actual.length === 10);
      });
    });

    describe('calling with count, start arguments', function(){
      beforeEach(function(){ actual = srfi.iota(5, 10); });

      it('should be made array', function(){
        assert.deepEqual(actual, [10, 11, 12, 13, 14]);
      });
    });

    describe('calling with minus step', function(){
      it('should be made array', function(){
        actual = srfi.iota(3, -2, -3);
        assert.deepEqual(actual, [-2, -5, -8]);
      });
    });

    describe('calling with all arguments', function(){
      beforeEach(function(){ actual = srfi.iota(5, 10, 3); });

      it('should be made array', function(){
        assert.deepEqual(actual, [10, 13, 16, 19, 22]);
      });
    });
  });

  describe('.forEach', function(){
    describe('misshing **proc**', function(){
      it('should be throw exception', function(){
        assert.throws(srfi.forEach);
      });
    });

    describe('first argument is not function', function(){
      it('should be throw exception', function(){
        assert.throws(function(){
          srfi.forEach('Hello');
        });
      });
    });

    describe('**lists** is misshing', function(){
      var proc;

      it('should be throw exception', function(){
        proc = jasmine.createSpy('some proc');

        assert.throws(function(){
          srfi.forEach(proc);
        });
      });
    });

    describe('has a proc and one list', function(){
      var proc, list;

      beforeEach(function(){
        proc = jasmine.createSpy('some proc');
        list = [1,2,3,4,5];
      });

      it('should be execute only as any times as list length', function(){
        srfi.forEach(proc, list);

        assert(proc.calls.count() === list.length);
      });

      it('should be called with element from list', function(){
        srfi.forEach(function(e, i){
          proc(e);
          assert(proc.calls.mostRecent().args[0] === list[i]);
        }, list);
      });
    });

    describe('has a proc and some lists', function(){
      var proc, minList, someList;

      beforeEach(function(){
        proc = jasmine.createSpy('some proc');
        minList = [1,2,3,4];
        someList = [1,2,3,4,5];
      });

      it('should be execute only as any times as most min list length', function(){
        srfi.forEach(proc, minList, someList);

        assert(proc.calls.count() === minList.length);
      });

      it('should be called with elements from any lists', function(){
        var anyLists = [minList, someList];

        srfi.forEach(function(e1, e2, idx){
          proc(e1, e2);
          for(var i = 0; i < anyLists.length; i++){
            assert(proc.calls.mostRecent().args[i] === anyLists[i][idx]);
          }
        }, minList, someList);
      });
    });

    xdescribe('has a proc and circular list', function(){
      var proc, circularList;

      beforeEach(function(){
        proc = jasmine.createSpy('some proc');
        circularList = [];
      });

      xit('should be execute to infinity', function(){
      });
    });

    xdescribe('has a proc and some lists, include circular-list', function(){
      var proc, circularList, fixedList;

      beforeEach(function(){
        proc = jasmine.createSpy('some proc');
        circularList = [];
        fixedList = [1,2,3,4,5];
      });

      it('should be execute only as any times as fixed list length', function(){
        srfi.forEach(proc, circularList, fixedList);

        assert(proc.calls.count() === fixedList.length);
      });

      it('should be called with elements from any lists', function(){
        var anyLists = [circularList, fixedList];

        srfi.forEach(function(e1, e2, idx){
          proc(e1, e2);
          for(var i = 0; i < anyLists.length; i++){
            assert(proc.calls.mostRecent().args[i] === anyLists[i][idx]);
          }
        });
      });
    });
  });
});
