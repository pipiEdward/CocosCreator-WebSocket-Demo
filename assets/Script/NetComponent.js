//网络组件
let NetworkComponent = cc.Class({
    extends: cc.Component,

    properties: {
    },
    onLoad: function () {

    },

    onEnable() {
        NetTarget.on('net', this.getNetData.bind(this));
        NetTarget.on('netstart', this.netStart.bind(this));
        NetTarget.on('netclose', this.netClose.bind(this));
    },

    onDisable() {
        NetTarget.off('net', this.getNetData.bind(this));
        NetTarget.off('netstart', this.netStart.bind(this));
        NetTarget.off('netclose', this.netClose.bind(this));
    },
    /**
     * 获取服务端数据
     */
    getNetData: function (event) {
        cc.log("append");
    },
    /**
     * 网络连接开始
     */
    netStart: function (event) {
        cc.log("net start");
    },
    /**
     * 网络断开
     */
    netClose: function (event) {
        cc.log("net close");
    },
});
