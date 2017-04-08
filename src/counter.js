var React = require('react');
var ReactDOM = require('react-dom');
var PouchDB = require('pouchdb');
var Line = require('./line.js');

/* Counters container
 * props: value <number>
 */
exports.CounterList = ({ data }) => {
    return (
      <div>
        {data.map(counter => {
          if (counter.hits) {
            return <Counter key={counter.serialNumber} data={counter} />;
          }
          // if there are no hits just render the blank counter
          return <p key={counter.serialNumber}>Counter {counter.serialNumber}</p>;
        })}
      </div>
    );
};

/* Counter
 * props: value <number>
 */
const Counter = ({ data }) => (
    <div>
      <p>Counter {data.serialNumber}</p>
      <p>
        <Line data={data.hits} />
      </p>
      <p>
        The speed <em>(mph)</em> of {data.hits.length} vehicles averages {
          Math.round(data.hits.map(function(h) {
            return h.speed;
          })
          .reduce(function(a, b) {
            return a + b;
          },0) / data.hits.length)
        }.
      </p>
    </div>
);
