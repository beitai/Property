var returnvalue = "";
var ytnamevalue = [];
var trycount = 0;
var isSaveUpdate = false;
function LoginSocketInit() {
    if (trycount > 3) {
        return;
    }
    var options = { visit: "socketinit" }
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: 'Handler/CommHandler.ashx',
        data: options,
        success: function (data) {
            try {
                var obj = {
                    loginname: data.loginname,
                    guid: data.guid,
                    url: url,
                    socketserver: "ws://" + socketserverurl,
                    action: 'login'
                };
                LoginConnect.init(obj);
                LoginConnect.submit();
            } catch (e) {
                trycount++;
                LoginSocketInit();
            }
        }
    });
}
function loginJudge() {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: window.SERVERPATH + 'api/getprojectinfo?sessionId=' + sessionId,
        success: function (data) {
            // console.log('是否用重新测试');
            // console.log(data.status);
            // console.log(data.status == 'false');
            if (data.status == 'false') {
                // LoginSocketInit();
                poplogin();
            }
            /* try { 
            } catch (e) {
                trycount++;
                LoginSocketInit();
            } */
        }
    });
}
function get_data() {
    var options = { visit: "gethomedatasource" }
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: 'Handler/CommHandler.ashx',
        data: options,
        success: function (data) {
            if (!data.status) {
                return;
            }
            try {
                if (data.msgcount && data.msgcount > 0) {
                    $('#notify_img').show();
                    $('#notify_img').html(data.msgcount + '+');
                }
                else {
                    $('#notify_img').hide();
                }
            } catch (e) {
            }
            try {
                if (data.total_count && data.total_count > 0) {
                    $('#warning_point').show();
                    $('#warning_point').html(data.total_count);
                }
                else {
                    $('#warning_point').hide();
                }
            } catch (e) {
            }
            try {
                if (data.daoqi_contractcount && data.daoqi_contractcount > 0) {
                    $('#daoqi_count').html(data.daoqi_contractcount);
                }
                else {
                    $('#shoufei_count').html('0');
                }
            } catch (e) {
            }
            try {
                if (data.shoufei_contractcount && data.shoufei_contractcount > 0) {
                    $('#shoufei_count').html(data.shoufei_contractcount);
                }
                else {
                    $('#shoufei_count').html('0');
                }
            } catch (e) {
            }
            try {
                if (data.service_count && data.service_count > 0) {
                    $('#service_count').html(data.service_count);
                }
                else {
                    $('#service_count').html('0');
                }
            } catch (e) {
            }
        }
    });
}
function get_notify_alert() {
    var options = { visit: "getsysmessage" }
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: 'Handler/CommHandler.ashx',
        data: options,
        success: function (data) {
            if (!data.status) {
                return;
            }
        }
    });
}
function do_grab_chat(ID) {
    var options = { visit: "grabwechatchat", ID: ID }
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: 'Handler/CommHandler.ashx',
        data: options,
        success: function (data) {
            if (data.status) {
                show_message('请打开微信在线客服页面开始聊天', 'success', function () {
                    window.open('https://mpkf.weixin.qq.com/');
                });
                return;
            }
            if (data.error) {
                show_message(data.error, 'warning');
                return;
            }
            show_message('系统异常', 'error');
        }
    });
    close_message();
}
$(function () {
    $('#notify_img').hide();

    // 首页获取通知信息的接口,暂时没用到
    // get_data();

    // 隔一秒后去调接口，进行是否有人登陆这个账号的判断。
    setTimeout(function () {
        // LoginSocketInit();
        // 重新写一个判断登录的接口，是否有判断，是否被登出。
        // loginJudge();
    }, 1000);

    // addnewTab('初始桌面', 'InitialSetup/Default.aspx?ID=0', '');
    // addnewTab('初始桌面', 'InitialSetup/Default.html?ID=0', '');
    // addnewTab('初始桌面', './InitialSetup/MainSetup.html?ParentID=0', '');
    addnewTab('初始桌面', './Main/MainSetup.html?ParentID=0', '');

    $("#time").hover(function () {
        $("#time .floatBox").show();
    }, function () {
        $("#time .floatBox").hide();
    });
    $("#user_center").click(function (e) {
        var target = $(e.target);
        if (target.closest("#user_center").length == 0) {
            if ($("#user_center").hasClass('open')) {
                $("#user_center").removeClass('open');
            }
        }
        else {
            if ($("#user_center").hasClass('open')) {
                $("#user_center").removeClass('open');
            }
            else {
                $("#user_center").addClass('open');
            }
            $("#btnwarning").removeClass('open');
        }
    });
    $("#btnwarning").click(function (e) {
        var target = $(e.target);
        if (target.closest("#btnwarning").length == 0) {
            if ($("#btnwarning").hasClass('open')) {
                $("#btnwarning").removeClass('open');
            }
        }
        else {
            if ($("#btnwarning").hasClass('open')) {
                $("#btnwarning").removeClass('open');
            }
            else {
                $("#btnwarning").addClass('open');
            }
            $("#user_center").removeClass('open');
        }
    });
    setTimeout(function () {
        $('#tabs .tabs-header').bind('click', function () {
            hide_popup();
        })
    }, 1000);
    $('#notifymsg').bind('click', function () {
        addTab('系统消息', 'Main/subpage.aspx?pageurl=../sysseting/sysmsglist.aspx&title=系统通知', 0);
    })
    $('#left_menu .menubox').bind('click', function () {
        if ($(this).hasClass('active')) {
            return;
        }
        $('#left_menu .menubox').removeClass('active');
        $(this).addClass('active');
        var id = $(this).attr('data-id');
        addnewTab('初始桌面', 'InitialSetup/Default.aspx?ID=0&groupname=' + id, '');
    })
    $('#sub_shoufei').bind('click', function () {
        addTab('租金收取', 'Main/subpage.aspx?pageurl=../Contract/ContractFeeSummaryAnalysis.aspx&title=租金收取', 0);
    })
    $('#sub_daoqi').bind('click', function () {
        addTab('合同到期', 'Main/subpage.aspx?pageurl=../Contract/ContractSummary.aspx&expired=1&title=合同到期', 0);
    })
    $('#sub_baoxiu').bind('click', function () {
        do_view_baoshi();
    })
});
function do_view_baoshi() {
    addTab('报事报修', 'Main/subpage.aspx?pageurl=../CustomerService/ServiceMgr.aspx?status=100&title=报事报修', 0);
    close_message();
}
function do_view_suggestion() {
    addTab('投诉建议', 'Main/subpage.aspx?pageurl=../CustomerService/ServiceSuggestionList.aspx?status=1002&title=投诉建议', 0);
    close_message();
}
function hide_popup() {
    if ($("#user_center,#btnwarning").hasClass('open')) {
        $("#user_center,#btnwarning").removeClass('open');
    }
}
function viewPersonal() {
    doOpenWin({
        title: '个人中心',
        url: 'UserInfo/PersionalInfo.aspx?op=detail',
        winInline: false,
        winParent: false,
        width: '80%',
        height: "80%"
    });
}
function checkWaringContract() {
    var options = { visit: "checkwarningcontract" }
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: 'Handler/CommHandler.ashx',
        data: options,
        success: function (data) {
            if (data.status && data.totalcount > 0) {
                var messages = '您有' + data.totalcount + '个合同即将到期，<a href="javascript:viewContract(' + data.totalcount + ')">查看详情</a>'
                alertNotify(messages);
                return;
            }
        }
    });
}
function alertNotify(messages) {
    if (!messages) {
        return;
    }
    $('#message_ring')[0].play();
    $.messager.show({
        title: '温馨提示',
        msg: messages,
        showSpeed: 1000,
        timeout: 0,     //手动关闭
        showType: 'slide',
        width: 260,
        height: 160
    });
}
function viewContract(totalCount) {
    addTab('租赁到期', 'Contract/Setup.aspx?total=' + totalCount, 0);
}
function poplogin() {
    var options = { visit: "forcelogout" }
    // $.ajax({
    //     type: 'POST',
    //     dataType: 'json',
    //     url: 'Handler/CommHandler.ashx',
    //     data: options,
    //     success: function (data) {
    top.winUpdate = true;
    $.messager.alert('提示', '帐号已在别处登录，你将被强迫下线（请保管好自己的用户密码）！', 'info', function () {
        doOpenWin({
            title: '登录',
            url: 'MinLogin.html',
            winInline: false,
            winParent: false,
            width: '400',
            height: "300",
            winid: 'winlogin'
        }, function () {
            LoginSocketInit();
        });
    })
    // }
    // });
}
function clearcache() {
    var options = { visit: "clearcache" }
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: 'Handler/CommHandler.ashx',
        data: options,
        success: function (data) {
        }
    });
}
function close_message() {
    //$.messager.close();
    $(".messager-body").window('close');
}
function socket_notify(obj) {
    if (obj.type == 'notifychat' && HasWechatServiceAuth) {
        var messages = '微信在线聊天申请，<a href="javascript:do_grab_chat(' + obj.ID + ')">开始聊天</a>'
        alertNotify(messages);
        return;
    }
    if (obj.type == 'notifyclearcache') {
        clearcache();
        return;
    }
    if (obj.type == 'notifysuggestion') {
        var messages = '您有一条新的投诉建议，<a href="javascript:do_view_suggestion()">点击查看</a>'
        alertNotify(messages);
        return;
    }
    if (obj.type == 'notifyservice') {
        var messages = '您有一条新的报事报修单，<a href="javascript:do_view_baoshi()">查看详情</a>'
        alertNotify(messages);
        return;
    }
}