# TroopJS Route-Hash

A Troop component which exposes an API through the hub to:

0. Subscribe to a DOM element's hash changes (with the `hub/route/change`
   event).
0. Set the DOM element's hash (by publishing `hub/route/set`).

Note that in this context, the only DOM element for which it makes sense to
initialize this component is a `window` element.

## Tests

0. `bower install`
0. `npm install -g buster`
0. `npm install buster-amd` (yes, locally, without `-g`)
0. `buster-static`
0. Open your browser and go to the url provided by Buster.
