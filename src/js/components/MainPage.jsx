var React = require('react');

var MainStore = require('../stores/MainStore');
var MainActions = require('../actions/MainActions');

var Messages = require('./Messages');

var MainPage = React.createClass({	
  getInitialState: function() {
    return { msg: {}, input: '', errStyle: {}, errText: ''}
  },
  
  componentDidMount: function() {
    MainStore.addChangeListener(this._onMsgReceive);
    MainStore.addErrorListener(this._onError);
    MainActions.receiveMessage();
  },
  
  componentWillUnmount: function() {
    MainStore.removeChangeListener(this._onMsgReceive);
    MainStore.removeErrorListener(this._onError);
  },
  
  _onMsgReceive: function() {
    this.setState({
      msg: MainStore.getMessagesList(),
    });
  },

  _onError: function(e) {
    switch(e) {
      case 'short':
        this.showError('Message is too short!');
        break;
          
      case 'big':
        this.showError('Message is too big!');
        break;

      case 'time':
        this.showError('One message per 2 second allowed!');
        break;
          
      default:
          // no op
    };
  },

  showError: function(errMsg) {
    this.setState({
      errText: errMsg,
      errStyle: {zIndex: 999}
    });    

    window.setTimeout(function(){this.setState({ errStyle: {zIndex: -1} })}.bind(this), 1500);

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

  handleKeyPress: function(e) {
    if (e.which == 13) {
      this.sendMsg();
    };
  },

  render: function() { 
    return (
      <div className="content">
        
        <div className="errors" style={this.state.errStyle}>
          <div className="errors__text">
            {this.state.errText}
          </div>
        </div>

    		<Messages list={this.state.msg} />

        <div className="input">
          <input className="input__field" type="text" value={this.state.input} onChange={this.handleChange} onKeyPress={this.handleKeyPress} />
          <div className="input__button" onClick={this.sendMsg}>
            Say
          </div>
        </div>
      </div>
    );
  }
});

module.exports = MainPage;