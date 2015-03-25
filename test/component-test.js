define([
  "buster",
  "../component",
  "troopjs-core/component/signal/start",
  "troopjs-core/component/signal/finalize",
  "troopjs-hub/emitter"
], function (buster, Component, start, finalize, hub) {
  "use strict";

  var UNDEFINED;
  var assert = buster.referee.assert;

  buster.testCase("troopjs-route-hash/component", {
    "setUp": function () {
      window.location.hash = ""; // reset
      // attach the route-hash component to the window
      this.c = Component(window);
      return start.call(this.c);
    },
    "tearDown": function () {
      return finalize.call(this.c).tap(function () {
        window.location.hash = ""; // reset
      });
    },
    "detect location hash change": function (done) {
      var path = "page-1";
      hub.on("route/change", function (_path) {
        assert.equals(_path, path);
        hub.off("route/change");
        done();
      });
      window.location.hash = path;
    },
    "able to set location hash": function (done) {
      var path = "page-2";
      hub.on("route/change", function (_path) {
        assert.equals(_path, path);
        hub.off("route/change");
        done();
      });
      hub.emit("route/set", path)
        .then(function () {
          assert.equals(window.location.hash, "#" + path);
        });
    },
    "able to set location hash (silent)": function (done) {
      // !!!!!:
      // this test is not reliable, as we can't ensure that the
      // failed assertion in the 'route/change' handler will run
      // before it is unsubscribed by the 'route/set' callback
      // (in case silent set is failed).
      var path = "page-2";
      hub.on("route/change", function () {
        assert.equals(true, false, "should not be called");
      });
      hub.emit("route/set", path, UNDEFINED, true)
        .then(function () {
          assert.equals(window.location.hash, "#" + path);
          hub.off("route/change");
          done();
        });
    }
  });
});
