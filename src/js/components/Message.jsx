var React = require('react');

var MainActions = require('../actions/MainActions');

var Message = React.createClass({	
  removeMsg: function() {
    MainActions.removeMsg(this.props.id);
  },

  render: function() { 
    return (
      <div className="message__text" style={this.props.style} onClick={this.removeMsg}>
        {this.props.text}
      </div>
    );
  }
});

module.exports = Message;