/**
 * @license MIT http://troopjs.mit-license.org/
 */
define([
	"troopjs-dom/component",
	"troopjs-core/pubsub/hub",
	"mu-jquery-hashchange/jquery.hashchange"
], function (Component, hub) {
	"use strict";

	/**
	 * Component that attaches to the window object in order to handle
	 * `window.location.hash` changes.
	 * @class route.hash.component
	 * @extend dom.component
	 * @alias component.hash
	 */

	var $ELEMENT = "$element";
	var HASH = "_hash";
	var RE = /^#/;

	/**
	 * Hash set event (global)
	 * @localdoc Triggered when a component wants to change the hash of an
	 * {@link #$element} with {@link route.hash.component} attached to it
	 * @event hub/hash/set
	 * @param {String} hash The new hash
	 * @param {Boolean} [silent=false] Change the hash silently without
	 * triggering {@link route.hash.component#event-hub/hash/change} event.
	 */

	/**
	 * Fires whenever the browser route has changed
	 * @event hub/route/change
	 * @preventable
	 * @param {String} hash The new hash
	 */

	/**
	 * Hash change handler (global)
	 * @inheritdoc #event-hub/hash/change
	 * @handler hub/hash/change
	 * @template
	 * @return {Promise}
	 */

	return Component.extend({
		"displayName" : "route/hash/component",

		/**
		 * @inheritdoc
		 * @handler
		 */
		"sig/start" : function () {
			this[$ELEMENT].trigger("hashchange");
		},

		/**
		 * Hash change handler (local)
		 * @handler
		 * @inheritdoc #event-dom/hashchange
		 * @localdoc Handles changing hash of the attached {@link #$element}
		 * @param {Object} $event {@link jQuery} event
		 * @fires hub/route/change
		 */
		"dom/hashchange": function ($event) {
			var me = this;
			var hash = me[$ELEMENT].get(0).location.hash.replace(RE, "");

			// Did anything change?
			if (hash !== me[HASH]) {
				// Store and publish new hash
				hub.publish("route/change", me[HASH] = hash);
			}
			else {
				// Prevent further hashchange handlers from receiving this
				$event.stopImmediatePropagation();
			}
		},

		/**
		 * Route set handler (global)
		 * @handler hub/route/set
		 * @return {Promise}
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
