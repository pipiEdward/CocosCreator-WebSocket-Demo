'use strict'

const webSocketServer = require('ws').Server;
let wss = null;

function hook(ws, _open, _message, _close, _error) {
	ws.on('open', _open);
	ws.on('message', _message);
	ws.on('close', _close);
	ws.on('error', _error);
};

exports.start = () => {
	console.log('ws start');
	wss = new webSocketServer({ port: 3000 });
	wss.on('connection', (ws) => {
		console.log('client connected');
		//console.log(wss.clients.size);
		hook(ws,
			onOpen.bind(ws),
			onMessage.bind(ws),
			onClose.bind(ws),
			onError.bind(ws));
	});
};

function onOpen(event) {
	console.log('open');

};

function onMessage(event) {
	let self = this;
	let msg = parseJson(event);
	console.log(msg);
	if (msg && msg.f) {
		switch (msg.f) {
			case 'login':
				onLogin.call(self, msg);
				break;
			case 'send':
				onSend.call(self, msg);
			default:
				break;
		}
	} else {
		console.log('bad package');
	}
};

function onClose(event) {
	console.log(wss.clients.size);
	//发送广播
	broadcast({
		f: 'quit',
		msg: {
			userName: this.userName,
			userNum: wss.clients.size,
		}
	});
	console.log('onClose');
};

function onError(event) {
	console.log('onError');
};

//广播  
function broadcast(msg) {
	// console.log(ws);  
	wss.clients.forEach(function (client) {
		client.send(stringifyJson(msg));
	});
};


//登录
function onLogin(msg) {
	console.log('onLogin');
	if (msg.msg) {
		let clientId = Date.parse(new Date()) / 1000;
		let name = msg.msg;
		let _msg = { f: 'login', msg: [name, clientId] };
		this.send(stringifyJson(_msg));
		//在线人数
		let userNum = wss.clients.size;
		broadcast({
			f: 'join', msg: {
				userName: name,
				userNum: userNum,
			}
		});
		this.userName = name;//记录该sever的名字
	}
};

//消息
function onSend(msg) {
	console.log('onSend');
	if (msg.msg) {
		let userName = this.userName;
		let time = parseTime(new Date());
		let _msg = { f: 'sendSuccess', msg: '发送成功' };
		this.send(stringifyJson(_msg));

		broadcast({
			f: 'send',
			msg: {
				userName: userName,
				time: time,
				info: msg.msg,
			}
		});
	}
};

function parseTime(value) {
	var hour = value.getHours();
	var minute = value.getMinutes();
	var second = value.getSeconds();
	var hourStr = hour < 10 ? '0' + hour : hour;
	var minuteStr = minute < 10 ? '0' + minute : minute;
	var secondStr = second < 10 ? '0' + second : second;
	return hourStr + ':' + minuteStr + ':' + secondStr;
};


//字符串转json
function parseJson(s) {
	try {
		return JSON.parse(s);
	} catch (e) { }
};

//json转字符串
function stringifyJson(j) {
	try {
		return JSON.stringify(j);
	} catch (e) { }
};

//检测变量是否存在
function checkExist(obj) {
	return typeof obj != 'undefined';
};