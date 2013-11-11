var Contra = Contra || {};

Contra.Service = function() {
  return function($ns, $deps, $ext) {

    $ns = ['_services', $ns].join('.');
    Contra.namespace($ns);

  }
}