!function(){
    var lessmore = function(config){
        let objArray = new lessmore.ObjArray;

        config.call(objArray, objArray);
        return objArray;
    };

    lessmore.ObjArray = function(){
        this.objectArray = [];
        this.add = function(data){
          this.objectArray.push(data);
        }
        this.search = function(str){
          let result = [];
          this.objectArray.forEach(obj=>{
            if((obj.id+'').toLowerCase().indexOf(str)>-1
            || obj.url.toLowerCase().indexOf(str)>-1
            || obj.title.toLowerCase().indexOf(str)>-1
            || obj.body.toLowerCase().indexOf(str)>-1
            || obj.tag.toLowerCase().indexOf(str)>-1
            ){
              obj.ref = obj.id
              result.push(obj);
            }
          });
          return result;
        }
    };

    (function(root, factory){
        if (typeof define === 'function' && define.amd) {
            // AMD. Register as an anonymous module.
            define(factory)
          } else if (typeof exports === 'object') {
            /**
             * Node. Does not work with strict CommonJS, but
             * only CommonJS-like enviroments that support module.exports,
             * like Node.
             */
            module.exports = factory();
          } else {
            // Browser globals (root is window)
            root.lessmore = factory();
          }
    }(this, function(){
        return lessmore
    }))
}();