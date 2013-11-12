var Contra = Contra || {};

Contra.App = function(name, config) {

  if(!name) { name = 'App'}

  if(window.hasOwnProperty(name)) {
    return this._app;
  }

  var toolchain = {
    get : function(module) {
      var type = '',
          path = '',
          typeLookup = {},
          moduleLookup = {},
          mod = {},
          that = this;

      typeLookup = function(type) {
        switch(type)  {
          case 'SERVICE':
            return that._services;
        }
      }

      type = module.split(':')[0].toUpperCase();
      mod = typeLookup(type)[module.split(':')[1]];

//       mod = typeLookup(type);

//       for(var i = 0; i < path.length; i++)  {
//         mod = mod[path[i]];
//       }
// console.log('mod' , mod);
      return mod;
    }
  };

  this._app = window[name] = {};
  this._app.config = config;
  this._app._services = {};

  for(var utility in toolchain) {
    this._app[utility] = toolchain[utility];
  }

  this._app.Service = Contra.Service.apply(this);

};