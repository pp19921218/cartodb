var Backbone = require('backbone');
var _ = require('underscore');
var StyleFormComponents = require('./style-form-components-dictionary');
var DEBOUNCE_TIME = 350;

module.exports = Backbone.Model.extend({

  _FORM_NAME: '',

  initialize: function (attrs, opts) {
    if (!opts.styleModel) throw new Error('Style model is required');
    this._styleModel = opts.styleModel;
    this._querySchemaModel = opts.querySchemaModel;
    this._queryGeometryModel = opts.queryGeometryModel;
    this._configModel = opts.configModel;
    this.schema = this._generateSchema();
    this._initBinds();
  },

  _initBinds: function () {
    this.bind('change', _.debounce(this._onChange.bind(this), DEBOUNCE_TIME), this);
  },

  _onChange: function () {
    throw new Error('_onChange should be defined');
  },

  _generateSchema: function () {
    var querySchemaModel = this._querySchemaModel;
    var queryGeometryModel = this._queryGeometryModel;
    var configModel = this._configModel;
    var styleType = this._styleModel.get('type');
    var animationType = this._styleModel.get('style');
    var formName = this._FORM_NAME ? (this._FORM_NAME + '-') : '';

    return _.reduce(this.attributes, function (memo, value, key) {
      var d = StyleFormComponents[formName + key];
      if (d) {
        memo[key] = d({
          styleType: styleType,
          animationType: animationType,
          querySchemaModel: querySchemaModel,
          queryGeometryModel: queryGeometryModel,
          configModel: configModel
        });
      }
      return memo;
    }, {});
  }

});
