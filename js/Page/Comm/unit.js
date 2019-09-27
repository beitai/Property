
var global_variable = {
    pageSize: 500,
    pageList: [500, 2000]
};
$(function () {
    Date.prototype.Format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "h+": this.getHours(), //小时 
            "m+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }
    setTimeout(function () {
        var dateBoxDoms = $('.easyui-datebox');
        dateBoxDoms.datebox({
            panelWidth: 200,
            panelHeight: 230
        })
        var dateTimeBoxDoms = $('.easyui-datetimebox');
        dateTimeBoxDoms.datetimebox({
            panelWidth: 200,
            panelHeight: 260
        })
    }, 500);
})
function set_textbox_icon(newValue, target) {
    var icon_disabled = true;
    if (newValue != '') {
        $(target).textbox({
            icons: [{
                iconCls: 'icon-guanbi_2',
                handler: function (e) {
                    $(e.data.target).textbox('clear')
                    $(e.data.target).textbox().next('span').find('input').focus();
                }
            }]
        })
    } else {
        $(target).textbox({
            icons: []
        })
    }
    setTimeout(function () {
        resize_easyui_box();
    }, 100);
}
function resize_easyui_box() {
    $('input.easyui-textbox').css('height', '25px');
    $('input.easyui-combobox').css('height', '25px');
    $('input.textbox-text').css('height', '25px').css('padding-top', '0px').css('padding-bottom', '1px');
    $('span.textbox').css('height', '28px');
    $('.textbox-icon').css('height', '25px');
    $('.textbox-button').css('height', '25px');
    $('.textbox-icon.combo-arrow').css('height', '25px');
    $('textarea.textbox-text').parent().css('height', '60px');
    $('textarea.textbox-text').css('height', '58px');
    $('.textbox-button .l-btn-text').css('line-height', '28px');
}
function formatTime(value, row) {
    if (value == undefined || value == null || value == '' || value == '0001-01-01T00:00:00.0000000' || value == '0001-01-01T00:00:00' || value == '1900-01-01T00:00:00.0000000' || value == '1900-01-01T00:00:00') {
        return "--";
    }
    return value.substring(0, 16).split("T")[0];
}
function formatPrice(value, row) {
    if (Number(value) < 0) {
        return 0.00;
    }
    return value;
}
function formatIntCount(value, row) {
    if (Number(value) < 0) {
        return 0;
    }
    return value;
}
function formatDateTime(value, row) {
    if (value == undefined || value == null || value == '0001-01-01T00:00:00.0000000' || value == '0001-01-01T00:00:00' || value == '1900-01-01T00:00:00.0000000' || value == '1900-01-01T00:00:00') {
        return "--";
    }
    return value.substring(0, 19).replace("T", " ");
}
function timeToStamp(stringTime) {
    stringTime = stringTime.replace(/-/g, "/").replace("T", " ");
    var date = new Date(stringTime);
    var timestamp = Date.parse(date) / 1000;
    return timestamp;
}
function stampToTime(timestamp) {
    var newDate = new Date();
    newDate.setTime(Number(timestamp) * 1000);
    var yyyy = newDate.getFullYear().toString();
    var MM = (Number(newDate.getMonth() + 1) < 10 ? "0" + (newDate.getMonth() + 1).toString() : (newDate.getMonth() + 1).toString());
    var dd = (Number(newDate.getDate()) < 10 ? "0" + newDate.getDate().toString() : newDate.getDate().toString());
    var HH = (Number(newDate.getHours()) < 10 ? "0" + newDate.getHours().toString() : newDate.getHours().toString());
    var mm = (Number(newDate.getMinutes()) < 10 ? "0" + newDate.getMinutes().toString() : newDate.getMinutes().toString());
    var ss = (Number(newDate.getSeconds()) < 10 ? "0" + newDate.getSeconds().toString() : newDate.getSeconds().toString());
    return yyyy + "-" + MM + "-" + dd + " " + HH + ":" + mm + ":" + ss;
}
function stampToDate(timestamp) {
    var newDate = new Date();
    newDate.setTime(Number(timestamp) * 1000);
    var yyyy = newDate.getFullYear().toString();
    var MM = (Number(newDate.getMonth() + 1) < 10 ? "0" + (newDate.getMonth() + 1).toString() : (newDate.getMonth() + 1).toString());
    var dd = (Number(newDate.getDate()) < 10 ? "0" + newDate.getDate().toString() : newDate.getDate().toString());
    return yyyy + "-" + MM + "-" + dd;
}
function stringToDate(str) {
    return new Date(Date.parse(str.replace(/-/g, "/")));
}
function calculate_month(starttime, endtime) {
    var arry1, arry2, year1, year2, month1, month2, day1, day2, count, newenddate, newday2;
    arry1 = starttime.split("-");
    year1 = parseInt(arry1[0]);
    month1 = parseInt(arry1[1]);
    day1 = parseInt(arry1[2]);
    arry2 = endtime.split("-");
    year2 = parseInt(arry2[0]);
    month2 = parseInt(arry2[1]);
    day2 = parseInt(arry2[2]);
    newenddate = new Date(year2, month2, 0);
    newday2 = newenddate.getDate();
    if (day1 == 1) {
        if (day2 == newday2) {
            count = (year2 - year1) * 12 + (month2 - month1) + 1;
        }
        else {
            count = (year2 - year1) * 12 + (month2 - month1);
        }
    }
    else if (day2 < (day1 - 1)) {
        count = (year2 - year1) * 12 + (month2 - month1) - 1;
    }
    else {
        count = (year2 - year1) * 12 + (month2 - month1);
    }
    return count;
}
function toThousands(num) {
    num = num || 0;
    var numarray = num.toString().split(".");
    if (numarray.length > 1) {
        if (numarray[1].length > 4 || numarray[1].length <= 2)
            num = (parseFloat(num)).toFixed(2);
    }
    numarray = num.toString().split(".");
    var num0 = numarray[0], result = '';
    while (num0.length > 3) {
        result = ',' + num0.slice(-3) + result;
        num0 = num0.slice(0, num0.length - 3);
    }
    if (num0) {
        result = num0 + result;
    }
    if (numarray.length > 1) {
        result = result + "." + numarray[1];
    }
    else {
        result = result + ".00";
    }
    return result;
}
function calculate_day(starttime, endtime) {
    if (starttime == '' || endtime == '') {
        return 0;
    }
    var startdate = stringToDate(starttime);
    var enddate = stringToDate(endtime);
    var days = parseInt(Math.abs(enddate - startdate) / 1000 / 60 / 60 / 24);
    return (days >= 0 ? (days + 1) : 0);
}
function do_close_dialog(fn, showtree, options) {
    if (options && options.closeWin) {
        var winid = '';
        if (options.winid) {
            winid = options.winid;
        } else {
            winid = 'sub_win_' + top.winCount;
            top.winCount--;
        }
        parent.$('#' + winid).window('close');
    }
    else {
        $('#main_layoutframe').hide();
        $('#dialog_form').hide();
        $('#dialog_title2').text('');
        $('#dialog_frame2').attr("src", "");
        $('#dialog_frame2').css('height', '0px');
        $('#dialog_title1').text('');
        $('#dialog_frame1').attr("src", "");
        $('#dialog_frame1').css('height', '0px');
    }
    if (typeof fn == 'function') {
        fn.call(this);
    }
}
function do_open_dialog(title, url, hidetree) {
    var height = height || ($('body').height() - 10);
    if (hidetree) {
        $('#dialog_title2').text(title);
        $('#dialog_frame2').css('height', height + 'px');
        $('#dialog_frame2').css('top', '0px');
        $('#dialog_frame2').css('position', 'relative');
        $('#main_layoutframe').show();
        setTimeout(function () {
            $('#dialog_frame2').attr("src", url);
        }, 100);
    } else {
        $('#dialog_form').show();
        $('#dialog_title1').text(title);
        $('#dialog_frame1').css('height', height + 'px');
        $('#dialog_frame1').css('top', '0px');
        $('#dialog_frame1').css('position', 'relative');
        setTimeout(function () {
            $('#dialog_frame1').attr("src", url);
        }, 100);
    }
    $('.dialogtitle').hide();
    $('a.btn_dialog_close').hide();
}
var winCount = 0;
var winUpdate = false;
function getPathName() {
    var strPath = top.window.document.location.pathname;
    if (strPath == '') {
        return '';
    }
    var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
    if (postPath == '/') {
        return '';
    }
    return postPath;
}
function doOpenWin(options, onClose) {
    var winid = '';
    if (options.winid) {
        winid = options.winid;
    } else {
        top.winCount++;
        winid = 'sub_win_' + top.winCount;
    }
    var width = options.width || '80%';
    var height = options.height || '80%';
    var title = options.title || ' ';
    var url = options.url;
    var modal = !options.hideBg;
    var iframeid = 'dialog_frame_' + winid;
    options.iframeid = iframeid;
    if (url.indexOf('http') <= -1 && url.indexOf('../') > -1) {
        var postPath = getPathName();
        url = postPath + url.substring(2, url.length);
    }
    var frame = '<iframe name="win_dialog_frame" id="' + iframeid + '" scrolling="auto" frameborder="0"  src="' + url + '" style="width:100%;height:99%;border:0;z-index:9999"></iframe>';
    var baseOptions = {
        title: '',
        width: width,
        height: height,
        modal: modal,
        inline: true,
        minimizable: false,
        maximizable: false,
        collapsible: false,
        closable: true,
        draggable: false,
        resizable: false,
        content: frame,
        onOpen: function () {
            setTimeout(function () {
                loadWinFrameDone(title, options);
            }, 10);
        }
    };
    if (options.winInline) {
        var winOptions = {
            onClose: function () {
                if (onClose && typeof onClose == 'function') {
                    if (top.winUpdate) {
                        onClose.call(this);
                    }
                }
                top.winUpdate = false;
                $('#' + winid).remove();
            }
        };
        winOptions = jQuery.extend(true, winOptions, baseOptions);
        $("<div class='popWin' id='" + winid + "'></div>").appendTo("body").window(winOptions)
        $('#' + winid).window('center');
    }
    else if (options.winParent) {
        var winOptions = {
            onClose: function () {
                if (onClose && typeof onClose == 'function') {
                    if (top.winUpdate) {
                        onClose.call(this);
                    }
                }
                top.winUpdate = false;
                parent.$('#' + winid).remove();
            }
        };
        winOptions = jQuery.extend(true, winOptions, baseOptions);
        parent.$("<div id='" + winid + "'></div>").appendTo("body").window(winOptions)
        parent.$('#' + winid).window('center');
    }
    else {
        winOptions = {
            onClose: function () {
                if (onClose && typeof onClose == 'function') {
                    if (top.winUpdate) {
                        onClose.call(this);
                    }
                }
                top.winUpdate = false;
                top.$('#' + winid).remove();
            }
        };
        winOptions = jQuery.extend(true, winOptions, baseOptions);
        top.$("<div id='" + winid + "'></div>").appendTo("body").window(winOptions)
        top.$('#' + winid).window('center');
    }
}
var loadCount = 0;
function loadWinFrameDone(title, options) {
    var iframe = null;
    if (options.winInline) {
        iframe = $("iframe#" + options.iframeid)[0];
    }
    else if (options.winParent) {
        iframe = parent.$("iframe#" + options.iframeid)[0];
    } else {
        iframe = top.$("iframe#" + options.iframeid)[0];
    }
    var body = [];
    try {
        body = iframe.contentWindow.$('body');
    } catch (e) {
    }
    if (body.length == 0) {
        top.loadCount++;
        if (top.loadCount > 50) {
            top.loadCount = 0;
            return;
        }
        setTimeout(function () {
            loadWinFrameDone(title, options);
        }, 100);
        return;
    }
    top.loadCount = 0;
    var opeBoxDom = iframe.contentWindow.$('.operation_box');
    if (opeBoxDom.length > 0) {
        var opeInlineBoxDom = iframe.contentWindow.$('.operation_box.linebox');
        if (opeInlineBoxDom.length > 0) {
            return;
        }
        opeBoxDom.append("<div class=\"win_title\">" + title + "</div>");
    }
}
function doCloseWin(options, fn) {
    var winid = '';
    if (options && options.winid) {
        winid = options.winid;
    } else {
        winid = 'sub_win_' + top.winCount;
        top.winCount--;
    }
    parent.$('#' + winid).window('close');
    if (typeof fn == 'function') {
        fn.call(this);
    }
}
function show_message(msg, type, callback, timeout) {
    setTimeout(function () {
        type = type || 'success';
        if (type == 'info') {
            type = 'warning';
        }
        timeout = timeout || 1000;
        top.$.messager.show({
            title: '',
            timeout: timeout,
            width: '100%',
            height: 30,
            msg: msg,
            showType: 'slide',
            style: {
                top: 0,
                textAlign: 'center',
                padding: '0px',
                borderRadius: '0px',
                zIndex: 9999
            }
        });
        setTimeout(function () {
            top.$('.messager-body').css('padding', '5px 0');
            top.$('.messager-body').css('width', 'auto');
            top.$('.messager-body').css('height', 'auto');
            top.$('.messager-body').css('background-color', '#00bcd4');
            top.$('.messager-body').css('color', '#fff');
            top.$('.messager-body').css('font-size', '14px');
            if (type == 'success') {
                top.$('.messager-body').css('background-color', '#03a9f4');
            }
            else if (type == 'warning') {
                top.$('.messager-body').css('background-color', '#ffc107');
            }
            else if (type == 'error') {
                top.$('.messager-body').css('background-color', '#e51c23');
            }
        }, 100);
        if (typeof callback == "function") {
            setTimeout(function () {
                callback();
            }, 200);
        }
    }, 100);
}


function getQueryString(key) {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = window.decodeURIComponent(hash[1]);
    }
    return !!key ? vars[key] : vars;
};

function loadDataGrid(options, id) {
    id = id || '#tt_table';
    var toolbar = options.toolbar || '#tb';
    var loadMsg = options.loadMsg || '正在加载';
    var columns = options.columns || [[]];
    var onBeforeLoad = function (data) {
        if (!tt_CanLoad) {
            $(id).datagrid("loadData", {
                total: 0,
                rows: []
            });
        }
        return tt_CanLoad;
    }
    if (options.onBeforeLoad) {
        onBeforeLoad = options.onBeforeLoad;
    }
    var onLoadSuccess = function (data) { };
    if (options.onLoadSuccess) {
        onLoadSuccess = options.onLoadSuccess;
    }
    var onDblClickRow = function (index, row) { };
    if (options.onDblClickRow) {
        onDblClickRow = options.onDblClickRow;
    }
    var gridOptions = {
        url: options.url,
        loadMsg: loadMsg,
        border: false,
        remoteSort: false,
        pagination: options.pagination,
        rownumbers: options.rownumbers,
        fit: options.fit,
        fitColumns: options.fitColumns,
        singleSelect: options.singleSelect,
        selectOnCheck: options.selectOnCheck,
        checkOnSelect: options.checkOnSelect,
        striped: true,
        onDblClickRow: onDblClickRow,
        columns: columns,
        pageSize: global_variable.pageSize,
        pageList: global_variable.pageList,
        onBeforeLoad: onBeforeLoad,
        onLoadError: function (data) {
            $(id).datagrid("loadData", {
                total: 0,
                rows: []
            });
        },
        onLoadSuccess: onLoadSuccess,
        toolbar: toolbar
    }
    $(id).datagrid(gridOptions);
}
function loadTreeGrid(options, id) {
    id = id || '#tt_table';
    var toolbar = options.toolbar || '#tb';
    var loadMsg = options.loadMsg || '正在加载';
    var columns = options.columns || [[]];
    var onDblClickRow = function (index, row) { };
    if (options.onDblClickRow) {
        onDblClickRow = options.onDblClickRow;
    }
    var onBeforeExpand = function (row) { };
    if (options.onBeforeExpand) {
        onBeforeExpand = options.onBeforeExpand;
    }
    var onExpand = function (row) { };
    if (options.onExpand) {
        onExpand = options.onExpand;
    }
    var onBeforeLoad = function (data) {
        if (!tt_CanLoad) {
            $(id).datagrid("loadData", {
                total: 0,
                rows: []
            });
        }
        return tt_CanLoad;
    }
    if (options.onBeforeLoad) {
        onBeforeLoad = options.onBeforeLoad;
    }
    var onLoadSuccess = function (data) { };
    if (options.onLoadSuccess) {
        onLoadSuccess = options.onLoadSuccess;
    }

    var gridOptions = {
        url: options.url,
        loadMsg: loadMsg,
        border: false,
        remoteSort: false,
        pagination: options.pagination,
        rownumbers: options.rownumbers,
        fit: options.fit,
        fitColumns: options.fitColumns,
        singleSelect: options.singleSelect,
        selectOnCheck: options.selectOnCheck,
        checkOnSelect: options.checkOnSelect,
        striped: true,
        onDblClickRow: onDblClickRow,
        columns: columns,
        pageSize: global_variable.pageSize,
        pageList: global_variable.pageList,
        idField: 'id',
        treeField: 'Name',
        onBeforeLoad: onBeforeLoad,
        onLoadError: function (data) {
            $(id).datagrid("loadData", {
                total: 0,
                rows: []
            });
        },
        onBeforeExpand: onBeforeExpand,
        onExpand: onExpand,
        onLoadSuccess: onLoadSuccess,
        toolbar: toolbar
    }
    $(id).treegrid(gridOptions);
}
function getTimeSpan() {
    var date = new Date();
    var timestamp = Date.parse(date) / 1000;
    return timestamp;
}

/* function getCookie(c_name) {
    if (document.cookie.length > 0) {　　//先查询cookie是否为空，为空就return ""
        c_start = document.cookie.indexOf(c_name + "=")　　//通过String对象的indexOf()来检查这个cookie是否存在，不存在就为 -1　　
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1　　//最后这个+1其实就是表示"="号啦，这样就获取到了cookie值的开始位置
            c_end = document.cookie.indexOf(";", c_start)　　//其实我刚看见indexOf()第二个参数的时候猛然有点晕，后来想起来表示指定的开始索引的位置...这句是为了得到值的结束位置。因为需要考虑是否是最后一项，所以通过";"号是否存在来判断
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))　　//通过substring()得到了值。想了解unescape()得先知道escape()是做什么的，都是很重要的基础，想了解的可以搜索下，在文章结尾处也会进行讲解cookie编码细节
        }
    }
    return ""
} */


//设置cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
//获取cookie
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}
//清除cookie  
function clearCookie(name) {
    setCookie(name, "", -1);
}
// 机制checkCookie
function checkCookie() {
    var user = getCookie("username");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
            setCookie("username", user, 365);
        }
    }
}

// 原物业系统
// window.SERVERPATH = "http://demo.saasyy.com";

// 测试环境的ip
// window.SERVERPATH = "http://192.168.31.25/admin/";

// 线上环境的ip
window.SERVERPATH = "http://106.14.19.236:8081/admin/";

// 获得用户的登录身份
// var sessionId = sessionStorage.getItem('sessionId');
var sessionId = getCookie("sessionId")

