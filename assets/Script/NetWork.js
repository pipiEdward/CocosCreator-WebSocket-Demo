let WebSocket = WebSocket || window.WebSocket || window.MozWebSocket;
window.NetTarget = null;

let instance = null;

let Network = cc.Class({
    properties: {
        data: 1000,
        isInit: false,
    },

    ctor() {
        NetTarget = new cc.EventTarget();;
    },

    initNetwork() {
        if(this.isInit){
            cc.log('Network is already inited...');
            return;
        }
        cc.log('Network initSocket...');
        let host = "ws://localhost:3000";
         //let host = "ws://47.104.15.140:3000"
        this.socket = new WebSocket(host);
        this.socket.onopen = (evt) => {
            cc.log('Network onopen...');
            this.isInit = true;
            NetTarget.emit("netstart");
        }

        this.socket.onmessage = (evt) => {
             let msg = evt.data;
            cc.log('Network onmessage:'+evt.data);
             let dataObj = JSON.parse(msg);
            this.appandeMsg(dataObj);
        }

        this.socket.onerror = (evt) => {
            cc.log('Network onerror...');
        };

        this.socket.onclose = (evt) => {
            cc.log('Network onclose...');
            NetTarget.emit("netclose");
            this.isInit = false;
        }
    },

    //发送消息给服务器
    send(data) {
        if (!this.isInit) cc.log('Network is not inited...');
        else if (this.socket.readyState == WebSocket.OPEN) {
             let tdata = JSON.stringify(data);
            cc.log('Network send:' + tdata);
            this.socket.send(tdata);
        } else cc.log('Network WebSocket readState:' + this.socket.readyState);
    },

    //断开连接
    close() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    },
    //接受数据
    appandeMsg(data) {
        NetTarget.emit("net", data);
    },
    /**
     * 模拟服务端数据
     */
    testServerData(data) {
        this.appandeMsg(data);
    },

});

window.Network = instance ? instance : new Network();