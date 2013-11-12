### Create an App

```
Contra.App('EHQ', {

  instagram : {
    key : 'xCgk36876jjHJYT90sd56GHtYYuns',
    url : 'https://api.instagram.com/'
  },

  leafLet : {
    key : 'xCgk36876jjHJYT90sd56GHtYYuns',
    url : 'https://api.leaflet.com/',
    secretcode : '4356'
  }

});
```
### Create an View

```
Contra.App('EHQ')
  .View('instagram.admin',
    ['View:instagram.login', 'instagram', 'twitter.login'],
    {

      initialize : function() {},

      loadEventBindings : function() {},

      userLogin : function() {
        this._service.instagramLogin = new this.deps.instagram.login();
        this._service.instagramLogin.fetch();
        this._service.instagramLogin.on('onFetch', this._updateView);
      }

    }
  );
```

### Create an Service

```
Contra.App('EHQ').Service('instagram.login',[], {
  // methods to extend.
});
```

### Create an Module

```
Contra.App('EHQ').Module('instagram',[], {
  // methods to extend.
});
```

Contra.App('EHQ').start();