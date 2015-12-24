var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var MainConstants = require('../constants/MainConstants');
var assign = require('object-assign');

var serverPath = require('../app.jsx').serverPath;

var CHANGE_EVENT = 'change';

/*************************************
ERRORS:
	'short' - too short message (less than 2 characters),
	'big' - too big message (more than 15 characters),
	'time' -  one message per 2 sec allowed

*************************************/
var errors = ['short', 'big', 'time'];

var messages = {};
var socket = null;
var lastMsgTime = 0;

var smallMsgLength = 2;
var longMsgLength = 15;
var timeBetweenAllowed = 2000;

function sendMessage(msg) {
	if (msg.trim().length < smallMsgLength) {
		MainStore.emitError('short');
		return;
	} else if (msg.length > longMsgLength) {
		MainStore.emitError('big');
		return;
	} else if ((+new Date() - lastMsgTime) < timeBetweenAllowed) {
		MainStore.emitError('time');
		return;
	} else {
		socket.send(msg);
		lastMsgTime = +new Date();	
	}
};

function receiveMessages() {
	socket = new WebSocket(serverPath);
	socket.onmessage = function(event) {
		var id = (+new Date()).toString(36);
  		messages[id] = {text: event.data, style: MainStore.getRandomStyle()};
  		MainStore.emitChange();
	};	
};

function removeMessage(id) {
	delete messages[id];
};

var MainStore = assign({}, EventEmitter.prototype, {
	getMessagesList: function() {
		return messages;
	},

	getRandomInt: function(min, max) {
    	return Math.floor(Math.random() * (max - min + 1)) + min;
  	},

	getRandomStyle: function() {
		var dC1 = this.getRandomInt(4, 12).toString(16);
		var dC2 = this.getRandomInt(4, 12).toString(16);
		var dC3 = this.getRandomInt(4, 12).toString(16);

		var dY = this.getRandomInt(0, document.documentElement.clientHeight * 0.77);
      	var dX = this.getRandomInt(0, document.documentElement.clientWidth * 0.92);

      	var dP = this.getRandomInt(10, 50);

		return ({
			padding: dP + 'px',
			background: '#' + dC1 + dC2 + dC3,
	        top: dY + 'px',
	        left: dX + 'px',
	        zIndex: messages.length,
	    });
	},
	
	emitChange: function() {
	    this.emit(CHANGE_EVENT);
	},

	addChangeListener: function(callback) {
	    this.on(CHANGE_EVENT, callback);
	},

	removeChangeListener: function(callback) {
	    this.removeListener(CHANGE_EVENT, callback);
	},

	emitError: function(err) {
		this.emit(err, err);
	},

	addErrorListener: function(callback) {
		var self = this;
		errors.map(function(err, key) {
			self.on(err, callback);
		});		
	},

	removeErrorListener: function(callback) {
		var self = this;
		errors.map(function(err, key) {
			self.removeListener(err, callback);
		}); 
	}
});

AppDispatcher.register(function(action) {

  switch(action.actionType) {

    case MainConstants.SEND_MESSAGE:
		sendMessage(action.msg);
     	break;
			
	case MainConstants.MESSAGE_RECEIVED:
		receiveMessages();
		break;

	case MainConstants.REMOVE_MESSAGE:
		removeMessage(action.id);
		MainStore.emitChange();
		break;
			
    default:
      // no op
  }
});

module.exports = MainStore;