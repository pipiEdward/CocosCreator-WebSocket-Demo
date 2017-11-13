'use strict'

const webSocketServer = require('ws').Server;
let wss = null;

function hook(ws, _open, _message, _close, _error) {
	ws.on('open', _open);
	ws.on('message', _message);
	ws.on('close', _close);
	ws.on('error', _error);
};

exports.start = ()=>{
	console.log('ws start');
	wss = new webSocketServer({port:3000});
	wss.on('connection',(ws)=>{
		console.log('client connected');
		//在线人数
	
		let _msg = {f:'online',msg:wss.clients.size};
	
		//console.log(wss.clients.size);
	
		ws.send(stringifyJson(_msg));

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
			case 'quit':
				onQuit.call(self,msg);
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

//广播  
function broadcast(msg) {  
    // console.log(ws);  
    wss.clients.forEach(function(client) {  
	client.send(stringifyJson(msg));
    });  
};  


//登录
function onLogin(msg){
	console.log('onLogin');
	if(msg.msg){
		let clientId = Date.parse(new Date())/1000;
	
		let _msg = {f:'login',msg:[msg.msg,clientId]};
		this.send(stringifyJson(_msg));
		broadcast({f:'join',msg:msg.msg});
	}
};

//退出
function onQuit(msg){
	console.log('onQuit');
	if(msg.msg){
		broadcast({f:'quit',msg:msg.msg});
	}
	this.close();
};

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