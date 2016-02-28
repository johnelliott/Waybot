var test = require('tape');
var freeze = require('deep-freeze');
var counters = require('../src/state').counters;
var counter = require('../src/state').counter;

/*
 * Setup
 */
test('verify test setup', function(t) {
  t.plan(1);
  const a = 1;
  t.equal(a, 1);
});

/*
 * Counter
 */
test('Initial add hit', function(t) {
  t.plan(1);
  const stateBefore = {hits: []};
  const stateAfter = {
    hits: [{yo: 'potle'}]
  };
  freeze(stateBefore);
  t.deepEqual(counter(stateBefore, {type: 'ADD_HIT', hit: {yo: 'potle'}}), stateAfter);
});

test('don\'t add duplicate hit', function(t) {
  t.plan(1);
  const stateBefore = {
    hits: [{_id: 'potle'}]
  };
  const stateAfter = {
    hits: [{_id: 'potle'}]
  };
  freeze(stateBefore);
  t.deepEqual(counter(stateBefore,
                      {type: 'ADD_HIT', hit: {_id: 'potle'}}), stateAfter);
});

test('don\'t add anything for bad action type', function(t) {
  t.plan(1);
  const stateBefore = {
    hits: [{_id: 'potle'}]
  };
  const stateAfter = {
    hits: [{_id: 'potle'}]
  };
  freeze(stateBefore);
  t.deepEqual(counter(stateBefore,
                      {type: 'BAZ', hit: {_id: 'potle'}}), stateAfter);
});

/*
 * Counters
 */
test('add counter to empty state', function(t) {
  t.plan(1);
  const stateBefore = [];
  const stateAfter = [{ id: 1 }];
  freeze(stateBefore);
  t.deepEqual(counters(stateBefore, {type: 'ADD_COUNTER', counter: { id: 1 }}), stateAfter);
});

test('add existing counter', function(t) {
  t.plan(1);
  const stateBefore = [{ id: 1 }];
  const stateAfter = [{ id: 1 }];
  freeze(stateBefore);
  t.deepEqual(counters(stateBefore, {type: 'ADD_COUNTER', counter: { id: 1 }}), stateAfter);
});
// TODO do more coutners top-level testing

/*
 * Reducer composition
 */
test('add hit through combined reducers', function(t) {
  t.plan(1);
  const stateBefore = [{ id: 1 }]
  const stateAfter = [{ id: 1, hits: [{ yo: 'potle'}] }];
  freeze(stateBefore);
  t.deepEqual(counters(stateBefore, {type: 'ADD_HIT', id: 1, hit: {yo: 'potle'}}), stateAfter);
});

test('add hit to intended counter', function(t) {
  t.plan(1);
  const stateBefore = [{ id: 1 }, { id: 2 }]
  const stateAfter = [{ id: 1, hits: [{ yo: 'potle'}]}, { id: 2 }];
  freeze(stateBefore);
  t.deepEqual(counters(stateBefore, {type: 'ADD_HIT', id: 1, hit: {yo: 'potle'}}), stateAfter);
});

test('add hit to intended counter', function(t) {
  t.plan(1);
  const stateBefore = [{ id: 1 }, { id: 2 }]
  const stateAfter = [{ id: 1 }, { id: 2 }];
  freeze(stateBefore);
  t.deepEqual(counters(stateBefore, {type: 'ADD_HIT', id: 'BOGUS_ID', hit: {yo: 'potle'}}), stateAfter);
});
// Wow, TDD actually makes a lot of sense when refactoring redux
