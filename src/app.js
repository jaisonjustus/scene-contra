var Contra = Contra || {};

Contra.App = function(name, config) {

  if(!name) { name = 'App'}

  if(window.hasOwnProperty(name)) {
    return this._app;
  }

  this._app = window[name] = {};
  this._app.config = config;
  this._app._services = {};

  this._app.Service = Contra.Service.apply(this);

};