var React = require('react');

var MainStore = require('../stores/MainStore');
var MainActions = require('../actions/MainActions');

var Messages = require('./Messages');

var MainPage = React.createClass({	
  getInitialState: function() {
    return { msg: {}, input: ''}
  },
  
  componentDidMount: function() {
    MainStore.addChangeListener(this._onMsgReceive);
    MainActions.receiveMessage();
  },
  
  componentWillUnmount: function() {
    MainStore.removeChangeListener(this._onMsgReceive);
  },
  
  _onMsgReceive: function() {
    this.setState({
      msg: MainStore.getMessagesList(),
    });
  },

  handleChange: function(e) {
    this.setState({
      input: e.target.value,
    });
  },

  sendMsg: function() {
    MainActions.sendMessage(this.state.input);
    this.setState({
      input: '',
    });
  },

  render: function() { 
    return (
      <div className="content">
  
    		<Messages list={this.state.msg} />

        <div className="input">
          <input className="input__field" type="text" value={this.state.input} onChange={this.handleChange} />
          <div className="input__button" onClick={this.sendMsg}>
            Say
          </div>
        </div>
      </div>
    );
  }
});

module.exports = MainPage;