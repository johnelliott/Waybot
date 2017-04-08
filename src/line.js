var React = require('react');
var ReactDOM = require('react-dom');
var Sparkline = require('sparklines');
/*
 * Sparkline
 * TODO make this work as part of react rendering instead of outside..
 */
module.exports = React.createClass({
   draw: function(props) {
    var lineData = props.data.map(function(point) {
      return point.speed;
    });
    //console.log('lineData ' + lineData);
    var node = ReactDOM.findDOMNode(this);
    var line = new Sparkline(node, {width: 100, height: 20});
    //console.log('line', line);
    line.draw(lineData);
  },
  componentDidMount: function() {
    this.draw(this.props);
  },
  shouldComponentUpdate: function () {
    return false;
  },
  componentWillReceiveProps: function(nextProps) {
    //console.log('i will get props', nextProps);
    if (this.props.data !== nextProps.data) {
      this.draw(nextProps);
    }
  },
  render: function() {
    return ( <span></span> );
  }
});
