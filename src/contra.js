var Contra = {

  namespace : function(name)  {
    var modulesName = name.split('.'),
        modulesLength = modulesName.length,
        parent = this._app;

    for(var i = 0; i < modulesLength; i++)  {
      if (typeof parent[modulesName[i]] === "undefined") {
        parent[modulesName[i]] = {};
      }

      parent = parent[modulesName[i]];
    }

    return parent;
  },

  extend : function(child, parent) {
    parent = (parent) ? parent : this;

    var mutant = function() { parent.apply(this,arguments); },
    p = parent.prototype;

    for(var prop in parent.prototype)  {
      mutant.prototype[prop] = parent.prototype[prop];
    }

    if(child) {
      for(var prop in child)  {
        mutant.prototype[prop] = child[prop];
      }
    }

    return mutant;
  }

};