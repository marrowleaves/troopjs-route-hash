/**
 * @license MIT http://troopjs.mit-license.org/
 */
define([
  "troopjs-compose/factory",
  "troopjs-dom/component",
  "troopjs-hub/component",
  "troopjs-hub/emitter",
  "mu-jquery-hashchange/jquery.hashchange"
], function (Factory, DOMComponent, HUBComponent, hub) {
  "use strict";

  /**
   * Component that attaches to the window object in order to handle `window.location.hash` changes.
   * @class route.hash.component
   * @extend dom.component
   * @alias hash.component
   */

  var $ELEMENT = "$element";
  var HASH = "_hash";
  var RE = /^#/;

  /**
   * Triggered when a component wants to change the attached {@link #$element} hash
   * @event dom/hashset
   * @preventable
   * @param {Object} $event {@link jQuery} event
   * @param {String} hash The new hash
   * @param {Boolean} [silent=false] Change the hash silently without triggering {@link route.hash.component#event-dom/hashchange} event.
   */

  /**
   * Triggered when the attached {@link #$element} hash is changed
   * @event dom/hashchange
   * @preventable
   * @param {Object} $event {@link jQuery} event
   * @param {String} hash The new hash
   */

  /**
   * Route set handler (global), implicitly translates to {@link #event-dom/hashset} by setting the {@link #$element} hash
   * @event hub/route/set
   * @param {String} hash The new hash
   * @param {*} data
   * @param {Boolean} [silent=false] Change the hash silently without triggering {@link route.hash.component#event-dom/hashchange} event.
   */

  /**
   * Triggered whenever the browser route has changed
   * @event hub/route/change
   * @preventable
   * @param {String} hash The new hash
   */

  return Factory(HUBComponent, DOMComponent, {
    "displayName": "route/hash/component",

    /**
     * @handler
     * @inheritdoc #event-sig/start
     * @fires dom/hashchange
     */
    "sig/start": function () {
      this[$ELEMENT].trigger("hashchange");
    },

    /**
     * @handler
     * @inheritdoc #event-dom/hashchange
     * @localdoc Handles changing hash of the attached {@link #$element}
     * @fires hub/route/change
     */
    "dom/hashchange": function ($event) {
      var me = this;
      var hash = me[$ELEMENT].get(0).location.hash.replace(RE, "");

      // Did anything change?
      if (hash !== me[HASH]) {
        // Store and publish new hash
        hub.emit("route/change", me[HASH] = hash);
      }
      else {
        // Prevent further hashchange handlers from receiving this
        $event.stopImmediatePropagation();
      }
    },

    /**
     * @handler
     * @inheritdoc #event-dom/hashset
     * @localdoc Translates {@link #event-dom/hashset} to {@link #event-hub/route/set}
     * @fires hub/route/set
     */
    "dom/hashset": function ($event, hash, silent) {
      hub.emit("route/set", hash, null, silent);
    },

    /**
     * @handler
     * @inheritdoc #event-hub/route/set
     * @localdoc Triggers {@link #event-dom/hashchange} by setting the {@link #$element} hash
     * @return {Promise}
     * @fires dom/hashchange
     */
    "hub/route/set": function (path, data, silent) {
      var me = this;

      // If we are silent we update the local me[HASH] to prevent change detection
      if (silent === true) {
        me[HASH] = path;
      }

      me[$ELEMENT].get(0).location.hash = path;
    }
  });
});
