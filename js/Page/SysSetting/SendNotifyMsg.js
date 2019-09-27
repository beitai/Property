
var content;
$(function () {
    content = new Vue({
        el: '#fieldcontent',
        data: {
            list: [],
            count: 0
        },
        methods: {
            getdata: function () {
                var that = this;
                var options = { visit: 'getweixinnotifytemplates' };
                MaskUtil.mask();
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: 'http://demo.saasyy.com/Handler/WechatHandler.ashx',
                    data: options,
                    success: function (data) {

                        data = { "status": true, "list": [{ "ID": 6, "Value": "", "count": 1 }, { "ID": 131, "Value": "23", "count": 2 }, { "ID": 132, "Value": "1", "count": 3 }] };

                        MaskUtil.unmask();
                        if (data.status) {
                            that.list = data.list;
                            that.count = that.list.length;
                            if (that.list.length == 0) {
                                that.add_line();
                            }
                            return;
                        }
                        show_message('系统错误', 'error');
                    }
                });
            },
            add_line: function () {
                var that = this;
                that.count++;
                var item = { ID: 0, Value: '', count: that.count };
                that.set_value();
                that.list.push(item);
            },
            set_value: function () {
                var that = this;
                return;
                $.each(that.list, function (index, item2) {
                    item2.Value = $('#' + item2.count).val();
                });
            },
            remove_line: function (item) {
                var that = this;
                that.set_value();
                if (item.ID == 0) {
                    $.each(that.list, function (index, item2) {
                        if (item.count == item2.count) {
                            that.list.splice(index, 1);
                        }
                    });
                    return;
                }
                var options = { visit: 'removeweixinnotifytemplate', ID: item.ID };
                MaskUtil.mask();
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: 'http://demo.saasyy.com/Handler/WechatHandler.ashx',
                    data: options,
                    success: function (data) {

                        message.status = true

                        MaskUtil.unmask();
                        if (data.status) {
                            that.getdata();
                            return;
                        }
                        show_message('系统错误', 'error');
                    }
                });
            },
            do_save: function (data) {
                var that = this;
                that.set_value();
                var options = { visit: 'savewechatnotify', list: JSON.stringify(that.list) };
                MaskUtil.mask('body', '提交中');
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: 'http://demo.saasyy.com/Handler/WechatHandler.ashx',
                    data: options,
                    success: function (result) {

                        result.status = true;

                        MaskUtil.unmask();
                        if (result.status) {
                            show_message('保存成功', 'success');
                            that.getdata();
                            return;
                        }
                        show_message('系统错误', 'error');
                    }
                });
            },
            viewroomfee: function (item) {
                var that = this;
                top.addTab('收费中心', GetContextPath + '/main/subpage.html?ID=11&roomid=' + item.RoomID, 11, 'newsfzx')
            }
        }
    });
    content.getdata();
})
function SearchTT() {
    content.getdata();
}
function CreateZuKong() {
    content.createdata();
}
function SetUp() {
    var iframe = "<iframe id='myFrame' scrolling='auto' frameborder='0' src='../SysSeting/RoomStateColorSetUp.aspx' style='width:100%;height:" + ($(window).height() - 40) + "px'></iframe>";
    parent.$("<div id='winadd'></div>").appendTo("body").window({
        title: '属性设置',
        width: $(window).width() - 400,
        height: $(window).height(),
        top: 0,
        left: 200,
        modal: true,
        minimizable: false,
        maximizable: false,
        collapsible: false,
        content: iframe,
        onClose: function () {
            parent.$("#winadd").remove();
            content.getdata();
        }
    });
}
function doRemove() {
    content.doremove();
}