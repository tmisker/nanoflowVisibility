define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",

    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",


], function (declare, _WidgetBase, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, lang, dojoText, dojoHtml, dojoEvent) {
    "use strict";

    return declare("NanoflowVisibility.widget.NanoflowVisibility", [ _WidgetBase ], {


        // Modeler input
        nanoflow: null,


        // Internal variables.
        _handles: null,
        _contextObj: null,

        constructor: function () {
            this._handles = [];
        },

        postCreate: function () {
            logger.debug(this.id + ".postCreate");
        },

        update: function (obj, callback) {
            logger.debug(this.id + ".update");

            this._contextObj = obj;
            this._resetSubscriptions();
            this._updateRendering(callback);
        },

        resize: function (box) {
            logger.debug(this.id + ".resize");
        },

        uninitialize: function () {
            logger.debug(this.id + ".uninitialize");
        },

        _updateRendering: function (callback) {
            logger.debug(this.id + "._updateRendering");

            if (this._contextObj !== null) {
                dojoStyle.set(this.domNode, "display", "block");
                if (this.nanoflow && this.mxcontext) {
                  mx.data.callNanoflow({
                    nanoflow: this.nanoflow,
                    context: this.mxcontext,
                    origin: this.mxform,
                    callback: lang.hitch(this, function(callback, visibility) {
                      console.log("Nanoflow result " + visibility);
                      if (visibility) {
                        this.domNode.parentElement.style.display = "block";
                      } else {
                        var odv = this.domNode.parentElement.style.display;
                        this.domNode.parentElement.style.display = "none";
                      }
                    }, callback),
                    error: lang.hitch(this, function(error) {
                      console.log("Nanoflow error");
                      console.log(error);
                    })
                  });
                };
            } else {
                dojoStyle.set(this.domNode, "display", "none");
            }

            this._executeCallback(callback, "_updateRendering");
        },

        // Reset subscriptions.
        _resetSubscriptions: function () {
          logger.debug(this.id + "._resetSubscriptions");
          // Release handles on previous object, if any.
          this.unsubscribeAll();

          // When a mendix object exists create subscribtions.
          if (this._contextObj) {
            this.subscribe({
              guid: this._contextObj.getGuid(),
              callback: lang.hitch(this, function (guid) {
                this._updateRendering();
              })
            });
          }
        },

        // Shorthand for executing a callback, adds logging to your inspector
        _executeCallback: function (cb, from) {
            logger.debug(this.id + "._executeCallback" + (from ? " from " + from : ""));
            if (cb && typeof cb === "function") {
                cb();
            }
        }
    });
});

require(["NanoflowVisibility/widget/NanoflowVisibility"]);
