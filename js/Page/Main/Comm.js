$(function () {
    tabCloseEven();
});

function addTab(subtitle, url, pageid, icon) {
    $('#left_menu').hide();
    if (!$('#tabs').tabs('exists', subtitle)) {
        $('#tabs').tabs('add', {
            pageid: pageid,
            id: 0,
            title: subtitle,
            content: createFrame(url, subtitle, pageid),
            closable: true,
            icon: icon
        });
    } else {
        $('#tabs').tabs('select', subtitle);
        if (subtitle == '收费中心' && icon == 'newsfzx') {
            var tab = $('#tabs').tabs('getSelected');
            $('#tabs').tabs('update', {
                tab: tab,
                options: {
                    pageid: pageid,
                    title: subtitle,
                    content: createFrame(url, subtitle, pageid),
                }
            });
        }
    }
    tabClose();
}
function addnewTab(subtitle, url, icon) {
    try {
        $('#left_menu').show();
    } catch (e) {
    }
    if (!$('#tabs').tabs('exists', subtitle)) {
        $('#tabs').tabs('add', {
            pageid: 0,
            id: 0,
            title: subtitle,
            content: createFrame(url),
            closable: false,
            icon: icon
        });
    } else {
        $('#tabs').tabs('select', subtitle);
        var tab = $('#tabs').tabs('getSelected');
        $('#tabs').tabs('update', {
            tab: tab,
            options: {
                title: subtitle,
                content: createFrame(url),
            }
        });
    }
    $('#tabs').tabs({
        onSelect: function (title, index) {
            var id = 0;
            var target = this;
            if (title == '初始桌面') {
                try {
                    $('#left_menu').show();
                } catch (e) {
                }
            }
            else {
                try {
                    $('#left_menu').hide();
                } catch (e) {
                }
                id = $(target).tabs('getSelected').panel('options').id;
            }
            top.treeType = id;
            top.openTreeContent();
        },
        onBeforeClose: function (title, index) {
        }
    })
    tabClose();
}
var realcostamalysisdetails_loaddata, tochargeanalysis_loaddata;
function createFrame(url, title, pageid) {
    var $height = document.body.clientHeight;
    var id = 'top_main_frame_' + pageid;
    //if (pageid == 11 || pageid == 260) {
    //    id = 'top_chargefee_frame';
    //}
    //if (pageid == 53 || pageid == 502 || pageid == 51) {
    //    id = 'top_service_frame';
    //}
    //if (pageid == 72 || pageid == 76) {
    //    id = 'top_payservice_frame';
    //}
    //if (pageid == 9 || pageid == 120 || pageid == 196) {
    //    id = 'top_printformat_frame';
    //}
    //if (pageid == 64) {
    //    id = 'top_paramset_frame';
    //}
    //if (pageid == 65) {
    //    id = 'top_ckmgr_frame';
    //}
    var s = '<iframe name="top_main_frame" id="' + id + '" scrolling="auto" frameborder="0"  src="' + url + '" style="width: 100%; height: 99%; position: relative; top: 0px; left: 0px; right: 0px; bottom: 0px; border: 0px;"></iframe>';
    return s;
}
function tabClose() {
    $(".tabs-inner").dblclick(function () {
        var subtitle = $(this).children(".tabs-closable").text();
        $('#tabs').tabs('close', subtitle);
    });
    $(".tabs-inner").bind('contextmenu', function (e) {
        $('#mm').menu('show', {
            left: e.pageX,
            top: e.pageY
        });
        var subtitle = $(this).children(".tabs-closable").text();
        $('#tabs').tabs('select', subtitle);
        return false;
    });
}
function tabCloseEven() {
    $("#mm-tabclose").click(function () {
        var title = $("#tabs").tabs("getSelected").panel("options").title;
        if (title == "初始桌面")
            return;
        $("#tabs").tabs("close", title);
    });
}
function getTopTabPageID() {
    return $("#tabs").tabs("getSelected").panel("options").pageid;
}