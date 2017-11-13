
cc.Class({
    extends: require('NetComponent'),

    properties: {
        label: cc.Label,
        onlinelb: cc.Label,  //显示在线人数
        editbox: cc.EditBox,
        joinlb:cc.Label,
        quitelb:cc.Label,
    },

    // use this for initialization
    onLoad() {
        this._super();
        this.onlinelb.node.active = false;

    },
    connection() {
        Network.initNetwork();
    },

    login() {
        if (this.editor.string = '') {
            alert('请输入昵称');
            return;
        }
        Network.send({ f: 'login', msg: this.editor.string });
    },

    close() {
        Network.send({ f: 'quit', msg: this.userName });
        //Network.close();
    },

    getNetData(event) {
        let data = event.detail
        let str = "接受数据：" + JSON.stringify(data);
        this.showInfo(str);
        if (data.f) {
            let msg = data.msg || {};
            switch (data.f) {
                case 'login':
                    this.onLogin(msg);
                    break;
                case 'online':
                    this.onOnline(msg);
                    break;
                case 'join':
                    this.onJoin(msg);
                    break;
                case 'quit':
                    this.onQuite(msg);
                    break
            }
        }
    },

    onLogin(msg) {
        this.userName = msg[0];
        this.clientId = msg[1];
    },

    onOnline(msg) {
        this.onlinelb.node.active = true;
        this.onlinelb.string = '在线人数:' + msg;
    },

    onJoin(msg){
        this.joinlb.string = msg+'加入房间';
    },

    onQuite(msg){
        this.quitelb.string = msg+'退出房间';
    },

    netStart(event) {
        let str = "连接成功";
        cc.log(str);
        this.showInfo(str);
    },

    netClose(event) {
        let str = "断开连接";
        cc.log(str);
        this.showInfo(str);
        this.onlinelb.node.active = false;
    },

    showInfo(str) {
        this.label.string = str;
    },


    // called every frame, uncomment this function to activate update callback
    // update  (dt) {

    // },
});
