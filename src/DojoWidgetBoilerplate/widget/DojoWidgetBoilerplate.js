define([
  "dojo/_base/declare",
  "mxui/widget/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojo/_base/lang",
  "./utils",
  // "DojoWidgetBoilerplate/lib/jquery-1.11.2",
  "dojo/text!DojoWidgetBoilerplate/widget/template/DojoWidgetBoilerplate.html"
], function(
  declare,
  _WidgetBase,
  _TemplatedMixin,
  lang,
  utils,
  /*_jQuery,*/ widgetTemplate
) {
  "use strict";
  // var $ = _jQuery.noConflict(true);
  return declare("DojoWidgetBoilerplate.widget.DojoWidgetBoilerplate", [_WidgetBase, _TemplatedMixin], {
    // _TemplatedMixin will create our dom node using this HTML template.
    templateString: widgetTemplate,
    // DOM elements
    canvas: null,
    // Parameters configured in the Modeler.
    messageString: "",
    // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
    _handles: null,
    _contextObj: null,

    // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
    constructor: function() {
      this._handles = [];
    },

    // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
    postCreate: function() {
      this._updateRendering();
      this._setupEvents();
    },

    // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
    update: function(obj, callback) {
      this._contextObj = obj;
      this._updateRendering(callback); // We're passing the callback to updateRendering to be called after DOM-manipulation
    },

    enable: function() {},
    disable: function() {},
    resize: function(box) {},
    // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
    uninitialize: function() {
      // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
    },

    // Attach events to HTML dom elements
    _setupEvents: function() {},

    // Rerender the interface.
    _updateRendering: function(callback) {
      if (this._contextObj !== null) {
      } else {
      }
      // The callback, coming from update, needs to be executed, to let the page know it finished rendering
      this._executeCallback(callback, "_updateRendering");
    },
    _executeCallback: function(cb, from) {
      if (cb && typeof cb === "function") {
        cb();
      }
    }
  });
});

require(["DojoWidgetBoilerplate/widget/DojoWidgetBoilerplate"]);
