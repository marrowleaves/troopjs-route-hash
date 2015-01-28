var _hub;
define([
    "../component",
    "troopjs-core/component/signal/start",
    "troopjs-core/component/signal/finalize",
    "troopjs-core/pubsub/hub"
], function(Component, start, finalize, hub){
    _hub = hub;
    buster.testCase("troopjs-route-hash/component", function(run){

        var assert = buster.referee.assert;
        var refute = buster.referee.refute;

        run({
            "setUp": function(){
                window.location.hash = ""; // reset
                // attach the route-hash component to the window
                this.c = Component(window);
                return start.call(this.c);
            },
            "tearDown": function(){
                return finalize.call(this.c).tap(function(){
                    window.location.hash = ""; // reset
                });
            },
            "detect location hash change": function(done){
                var path = "page-1";
                hub.subscribe('route/change', function(_path){
                    assert.equals(_path, path);
                    hub.unsubscribe('route/change');
                    done();
                });
                window.location.hash = path;
            },
            "able to set location hash": function(done){
                var path = "page-2";
                hub.subscribe('route/change', function(_path){
                    assert.equals(_path, path);
                    hub.unsubscribe('route/change');
                    done();
                });
                hub.publish('route/set', path)
                    .then(function(){
                        assert.equals(window.location.hash, '#' + path);
                    });
            },
            "able to set location hash (silent)": function(done){
                // !!!!!:
                // this test is not reliable, as we can't ensure that the
                // failed assertion in the 'route/change' handler will run
                // before it is unsubscribed by the 'route/set' callback
                // (in case silent set is failed).
                var path = "page-2";
                hub.subscribe('route/change', function(_path){
                    assert.equals(true, false, "should not be called");
                });
                hub.publish('route/set', path, undefined, true)
                    .then(function(){
                        assert.equals(window.location.hash, '#' + path);
                        hub.unsubscribe('route/change');
                        done();
                    });
            },
        });

    });
});
