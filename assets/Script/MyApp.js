cc.Class({
    extends: require('NetComponent'),

    properties: {
        label: cc.Label,
    },

    // use this for initialization
    onLoad() {
        this._super();

    },
    connection() {
        Network.initNetwork();
    },

    login() {
        let randomId = Math.floor(Math.random()*100);
        Network.send({ f: 'login', msg:  randomId});
    },

    close() {
        Network.close();
    },

    getNetData(event) {
        let data = event.detail
        let str = "接受数据：" + JSON.stringify(data);
        this.showInfo(str);
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
    },

    showInfo(str) {
        this.label.string = str;
    },


    // called every frame, uncomment this function to activate update callback
    // update  (dt) {

    // },
});
