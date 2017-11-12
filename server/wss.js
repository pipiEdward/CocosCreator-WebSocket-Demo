'use strict'

const webSocketServer = require('ws').Server;

function hook(ws, _open, _message, _close, _error) {
	ws.on('open', _open);
	ws.on('message', _message);
	ws.on('close', _close);
	ws.on('error', _error);
};

exports.start = ()=>{
	console.log('ws start');
	let wss = new webSocketServer({port:3000});
	wss.on('connection',(ws)=>{
		console.log('client connected');
		hook(ws,
				onOpen.bind(ws),
				onMessage.bind(ws),
				onClose.bind(ws),
				onError.bind(ws));
	});
};

function onOpen(event){
	console.log('open');
};

function onMessage(event){
	let self = this;
	let msg = parseJson(event);
	console.log(msg);
	if(msg&&msg.f){
		switch(msg.f){
			case 'login':
				onLogin.call(self,msg);
				break;
			default:
				break;
		}
	}else{
		console.log('bad package');
	}
};

function onClose(event){
	console.log('onClose');
};

function onError(event){
	console.log('onError');
};

//登录
function onLogin(msg){
	console.log('onLogin');
	if(msg.msg){
		let _msg = {f:'login',msg:'user '+msg.msg+' login success'};
		this.send(stringifyJson(_msg));
	}

}

//字符串转json
function parseJson(s){
	try{
		return JSON.parse(s);
	}catch(e){}
};

//json转字符串
function stringifyJson(j){
	try{
		return JSON.stringify(j);
	}catch(e){}
};

//检测变量是否存在
function checkExist(obj){
	return typeof obj!= 'undefined';
};