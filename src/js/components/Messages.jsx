var React = require('react');

var MainActions = require('../actions/MainActions');
var Message = require('./Message');

var Messages = React.createClass({	
  render: function() { 
    var messages = [];

    for (var key in this.props.list) {
      messages.push(<Message key={key} id={key} style={this.props.list[key].style} text={this.props.list[key].text} />);
    };

    return (
      <div className="messages">
        {messages}
      </div>
    );
  }
});

module.exports = Messages;