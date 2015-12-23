var React = require('react');
var ReactDOM = require('react-dom');

var serverPath = "ws://10.27.13.204:3000";

module.exports.serverPath = serverPath;

var MainPage = require('./components/MainPage.jsx');

window.addEventListener("DOMContentLoaded", function() {
		ReactDOM.render((
			<div className="App">
				<MainPage/>
			</div> 
		), document.getElementById('page'));
});