(function () {
    var d = document,
        w = window;
    w.LoginConnect = {
        loginname: null,
        url: null,
        guid: null,
        socket: null,
        socketserver: null,
        systemtype: 'platform',
        action: '',
        submit: function () {
            var obj = {
                loginname: this.loginname,
                guid: this.guid,
                url: this.url,
                systemtype: this.systemtype,
                action: this.action
            };
            this.socket.emit('message', obj);
            return false;
        },
        logout: function () {
            this.socket.disconnect();
        },
        init: function (data) {
            this.loginname = data.loginname;
            this.url = data.url;
            this.guid = data.guid;
            this.socketserver = data.socketserver;
            this.action = data.action;
            //����websocket��˷����� 
            this.socket = io.connect(this.socketserver);

            //���߷����������û���¼ 
            this.socket.emit('login', { loginname: this.loginname, url: this.url, guid: this.guid });

            ////������Ϣ���� 
            this.socket.on('message', function (obj) {
                if (obj.action == 'login') {
                    var canpop = false;
                    if (obj.systemtype == LoginConnect.systemtype && obj.loginname == LoginConnect.loginname && obj.url == LoginConnect.url && obj.guid != LoginConnect.guid) {
                        canpop = true;
                    }
                    if (canpop) {
                        LoginConnect.logout();
                        poplogin();
                    }
                    return;
                }
                if (obj.action == 'notifyalert') {
                    var canpop = false;
                    if (obj.systemtype == LoginConnect.systemtype && obj.url == LoginConnect.url) {
                        canpop = true;
                    }
                    if (canpop) {
                        socket_notify(obj);
                    }
                    return;
                }
            });
        }
    };
})();