var Redux = require('redux');

function logReduxState () {
  console.log('============= Redux state =============');
  console.log(JSON.stringify(store.getState()));
}
/*
 * Redux action creators
 *
 * Use string literals for action types, no constants for actions
 * Use like: dispatch(addhit(hit));
 */
// TODO consider Redux standard action: https://github.com/acdlite/flux-standard-action for later
function addHit (hit) {
  return {
    type: 'ADD_HIT',
    hit
  };
}
function addCounter (counter) {
  return {
    type: 'ADD_COUNTER',
    counter
  };
}

const initialState = [];

// Counter reducer
function counter (state, action) {
  switch (action.type) {
      case 'ADD_HIT':
        if (state.serialNumber !== action.hit.serialNumber) {
          return state;
        }
        if (!state.hits) {
          return Object.assign({}, state, {
               hits: [action.hit]
          });
        }
        var collisions = state.hits.map(function (h) {
          //console.log('h', h);
          return h._id === action.hit._id;
        });
        var duplicate = collisions.reduce(function (prev, curr) {
          return prev || curr;
        }, "");
        if (duplicate) {
          return state;
        }
        return Object.assign({}, state, {
             hits: state.hits.concat([action.hit])
        });
      default:
          return state;
  }
}

// Counters reducer
function counters (state, action) {
    if (typeof state === 'undefined') {
        return initialState;
    }
    switch (action.type) {
      case 'ADD_COUNTER':
        var collisions = state.map(function (c) {
          //console.log('c', c);
          return c.serialNumber === action.counter.serialNumber;
        });
        //console.log('what is collisions', collisions);
        var matched = collisions.reduce(function (prev, curr) {
          return prev || curr;
        }, "");
        if (!matched) {
          return state.concat([action.counter]);
        };
      case 'ADD_HIT':
        return state.map(c => counter(c, action));
      default:
          return state;
    }
}

// Create Redux store
var store = Redux.createStore(counters, initialState);

// Expose module
exports.logger = logReduxState;
exports.addHit = addHit;
exports.addCounter = addCounter;
exports.store = store;
// Used in test
// TODO don't do this... maybe with reducers module....
exports.counters = counters;
exports.counter = counter;
