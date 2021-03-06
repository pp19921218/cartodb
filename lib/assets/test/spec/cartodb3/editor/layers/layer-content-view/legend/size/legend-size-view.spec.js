var _ = require('underscore');
var Backbone = require('backbone');
var LegendSizeView = require('../../../../../../../../javascripts/cartodb3/editor/layers/layer-content-views/legend/size/legend-size-view');
var LayerDefinitionModel = require('../../../../../../../../javascripts/cartodb3/data/layer-definition-model');
var LegendDefinitionsCollection = require('../../../../../../../../javascripts/cartodb3/data/legends/legend-definitions-collection');
var LegendBaseDefinitionModel = require('../../../../../../../../javascripts/cartodb3/data/legends/legend-base-definition-model');
var LegendFactory = require('../../../../../../../../javascripts/cartodb3/editor/layers/layer-content-views/legend/legend-factory');
var ConfigModel = require('../../../../../../../../javascripts/cartodb3/data/config-model');

describe('editor/layers/layer-content-view/legend/size/legend-size-view', function () {
  beforeEach(function () {
    this.configModel = new ConfigModel({
      base_url: '/u/pepe'
    });

    this.layerDefinitionModel = new LayerDefinitionModel({
      id: 'l-1',
      fetched: true,
      options: {
        type: 'CartoDB',
        table_name: 'foo',
        cartocss: 'asd',
        source: 'a0'
      }
    }, {
      parse: true,
      configModel: this.configModel
    });

    this.layerDefinitionsCollection = new Backbone.Collection();
    this.layerDefinitionsCollection.add(this.layerDefinitionModel);

    this.legendDefinitionsCollection = new LegendDefinitionsCollection(null, {
      configModel: this.configModel,
      layerDefinitionsCollection: this.layerDefinitionsCollection,
      vizId: 'v-123'
    });

    LegendFactory.init(this.legendDefinitionsCollection);

    this.editorModel = new Backbone.Model({
      edition: false
    });
    this.editorModel.isEditing = function () { return false; };

    this.htmlModel = new Backbone.Model();

    this.view = new LegendSizeView({
      editorModel: this.editorModel,
      modelView: new Backbone.Model(),
      layerDefinitionModel: this.layerDefinitionModel,
      legendDefinitionsCollection: this.legendDefinitionsCollection,
      type: 'size'
    });

    this.view.render();
  });

  it('should render properly', function () {
    expect(_.size(this.view._subviews)).toBe(1); // carousel and overlay
    expect(this.view.$('.Infobox').length).toBe(0);
  });

  it('should render imported legend infobox properly', function () {
    this.legendDefinitionsCollection.add(new LegendBaseDefinitionModel({
      type: 'html'
    }, {
      layerDefinitionModel: this.layerDefinitionModel,
      configModel: this.configModel,
      vizId: 'v-123'
    }));

    this.view._infoboxState();

    expect(this.view.$('.Infobox').length).toBe(1);
    expect(this.view.$('.Infobox').html()).toContain('editor.legend.messages.migrated-legend.body');
  });

  it('should render hidden layer infobox properly', function () {
    this.layerDefinitionModel.set({visible: false});

    expect(this.view.$('.Infobox').length).toBe(1);
    expect(this.view.$('.Infobox').html()).toContain('editor.legend.messages.layer-hidden.body');
  });

  it('should transmit html snippets changes properly', function () {
    this.legendDefinitionsCollection.add(new LegendBaseDefinitionModel({
      type: 'category'
    }, {
      layerDefinitionModel: this.layerDefinitionModel,
      configModel: this.configModel,
      vizId: 'v-123'
    }));

    this.view._legendDefinitionModel = this.legendDefinitionsCollection.at(0);
    this.view._codemirrorModel.set('content', 'Wadus[[Legend]]');
    this.view._saveLegendHTML();

    expect(this.view._legendDefinitionModel.get('preHTMLSnippet')).toBe('Wadus');

    this.view._codemirrorModel.set('content', 'Foo[[Legend]]Bar');
    this.view._saveLegendHTML();

    expect(this.view._legendDefinitionModel.get('preHTMLSnippet')).toBe('Foo');
    expect(this.view._legendDefinitionModel.get('postHTMLSnippet')).toBe('Bar');
  });

  it('should not have any leaks', function () {
    expect(this.view).toHaveNoLeaks();
  });
});

