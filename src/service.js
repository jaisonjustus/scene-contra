var Contra = Contra || {};

Contra.Service = function() {

  var Service = function()  {

    /* Specify the Service to act as a collection of data. */
    this.collection = false;

    /* Schema of the Service. */
    this.schema = null;

    /* Data transformation with respect to Schema. */
    this.strict = true;

    /* Object to keep current selected data. */
    this.datum = {};

    /* Array of datum. */
    this.data = [];

    this.id = 'id';

    this.collectionIndex = -1;

    this.url = null;

    this.urlBuilder = function(params)  {
      this.url = window.location.protocol + '//' + window.location.host;
      this.url += params.join('');
    };

    this.initialize.apply(this, arguments);

    if(this.schema) { this._schemaVerification(); }
  };

  /* Extending Service class adding common methods to prototype. */
  Service = Contra.extend({

    /**
     * To verify the dataType specified in the schema is valid or not. if the
     * datatype if invalid, it omitts the attribute from the schema.
     * @method _schemaVerification
     * @access private
     */
    _schemaVerification : function()  {
      for(var attribute in this.schema) {
        if(this.schema[attribute] !== 'int' &&
           this.schema[attribute] !== 'string' &&
           this.schema[attribute] !== 'boolean' &&
           this.schema[attribute] !== 'object' &&
           this.schema[attribute] !== 'float') {
          delete this.schema[attribute];
        }
      }
    },

    /**
     * Enforce the datatype of datum to what specified in the Service
     * schema.
     * @method _enforceSchema
     * @access private
     */
    _enforceSchema : function() {
      var schema = this.schema,
      dataType = null;

      for(var attribute in schema) {
        dataType = schema[attribute].toLowerCase();

        if(this.datum.hasOwnProperty(attribute) && this.datum[attribute] !== null)  {

          if(dataType === 'int')  {
            this.datum[attribute] = parseInt(this.datum[attribute]);
          }else if(dataType === 'float')  {
            this.datum[attribute] = parseFloat(this.datum[attribute]);
          }else if(dataType === 'string') {
            this.datum[attribute] = this.datum[attribute].toString();
          }else if(dataType === 'object') {
            this.datum[attribute] = this.datum[attribute];
          }
        }
      }
    },

    /**
     * Add the datum in the data collection array.
     * @method add
     * @access private
     */
    add : function() {
      this.data.push(this.copy());
      return this;
    },

    /**
     * To get a copy of current datum.
     * @method copy
     * @access public
     * @return object
     */
    copy : function() {
      var forge = {};

      for(var attribute in this.datum)  {
        forge[attribute] = this.datum[attribute];
      }
      return forge;
    },

    /**
     * Set value to the Service.
     * @method set
     * @access public
     * @param object|string key
     * @param object|string value
     */
    set : function(key, value) {
      var set = false;

      if(typeof key === 'object') {
        for(var attribute in this.schema) {
          if(key[attribute] !== undefined)  {
            this.datum[attribute] = key[attribute];
          }
        }
        set = !set;
      }else if(typeof key === 'string' && value)  {
        this.datum[key] = value;
      }

      /* if strict mode is enabled enforce the datatype of elements in datum
         to the what specified in the schema. */
      if(this.strict) { this._enforceSchema(); }

      if(set) {
        /* if the collection transformation flag is enabled add the datum to data
           array. */
        if(this.collection) { this.add(); }
      }

      return this;
    },

    /**
     * Get the data. if you pass '*' as key, the method will return full data.
     * @method get
     * @access public
     * @param string key
     * @return object
     */
    get : function(key)  {
      if(key === '*') {
        return (this.collection) ? this.data : this.datum;
      }else {
        return this.datum[key];
      }
    },

    /**
     * To get the object from the collection with respect to the id give.
     * @method find
     * @access public
     * @param string id
     * @return object
     */
    find : function(id)  {
      this.data.forEach(function(datum, index) {
        if(datum[this.id] === id) {
          this.datum = datum;
          this.collectionIndex = index;
        }
      }, this);

      return this.datum;
    },

    /**
     * To get the data from the collection at the index.
     * @method at
     * @access public
     * @param int index
     * @return object
     */
    at : function(index)  {
      return this.data[index];
    },

    /**
     * To get an array of objects in the collection matches the supplied attributes.
     * @method where
     * @access public
     * @param object attrs
     * @return array
     */
    where : function(attrs)  {
      var filtered = false,
      filteredArray = [];

      this.data.forEach(function(datum) {
        for(var attr in attrs)  {
          if(datum[attr] === attrs[attr]) { filtered = true; }
          else { filtered = false; }
        }
        if(filtered)  { filteredArray.push(datum); }
      }, this);

      return filteredArray;
    },

    fetch : function(success, error)  {
      var successCallback = success,
      options = { success : null, error : error };

      options.success = function()  {

        var parsedResponse = this._parseResponse(response, this.nameSpace);

        if(_.isArray(parsedResponse)) {
          _.forEach(parsedResponse, this.set, this);
        }else{
          this.set(parsedResponse);
        }

        if(successCallback) { successCallback.apply(this); }
      }

      this._comm('GET', null, options, this);
    },

    _comm : function(method, data, options, context) {
      var xhr = new XMLHttpRequest();
      xhr.open(method, this.url, true);
      xhr.onload = function() {
        response = JSON.parse(this.response);
        if(this.status == 200) {
          options.success.apply(context, response);
        }else if(this.status == 400)  {
          options.error.apply(context, arguments);
        }
      }
      xhr.send();
    },

    _parseResponse : function(response,nameSpace) {
      if(nameSpace) {
        var names = nameSpace.split('.');

        for(var i = 0; i < names.length; i++){
          response = response[names[i]];
        }
      }

      return response;
    }

  }, Service);

  Service.extend = Contra.extend;

  return function($ns, $deps, $ext) {

    // console.log(this);

    // var modulePath = '',
    //     module = this;

    // $ns = ['_services', $ns].join('.');
    // Contra.namespace($ns);

    // modulePath = $ns.split('.');

    // for(var i = 0; i < modulePath.length; i++)  {
    //   module = module[modulePath[i]];
    // }

// console.assert((module === this._services.instagram.data));

    this._services[$ns] = Service.extend($ext);

// console.log('module wild :: ', this._services.instagram.data);
  }
}