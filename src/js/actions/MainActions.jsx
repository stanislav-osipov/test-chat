var AppDispatcher = require('../dispatcher/AppDispatcher');
var MainConstants = require('../constants/MainConstants');

var MainActions = {
	sendMessage: function(msg) {
    AppDispatcher.dispatch({
      actionType: MainConstants.SEND_MESSAGE,
			msg: msg
    });
  },
	
	receiveMessage: function() {
    AppDispatcher.dispatch({
      actionType: MainConstants.MESSAGE_RECEIVED
    });
  },

  removeMsg: function(id) {
    AppDispatcher.dispatch({
      actionType: MainConstants.REMOVE_MESSAGE,
      id: id
    });
  }
	
};

module.exports = MainActions;