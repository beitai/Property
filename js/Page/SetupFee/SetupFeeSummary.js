
var chooseTitle;
$(function () {
    chooseTitle = $("#hdSelectedTitle").val();
    loadIframe();
    $('#ChargeSummaryAccording').tabs({
        onSelect: function (title, index) {
            chooseTitle = title;
            loadIframe();
        }
    });
});
function loadIframe() {
    var curTab = $('#ChargeSummaryAccording').tabs('getSelected');
    if (curTab.find("iframe:first").attr("src") == "") {
        var iframesrc = curTab.find("input[type=hidden]:first").val();
        curTab.find("iframe:first").attr("src", iframesrc);
        //curTab.find("iframe:first").css("height", "300px");
    }
}
function SearchTT() {
    var id = getTabID();
    document.getElementById('iframe_' + id).contentWindow.SearchTT();
    return;
}
function addFee() {
    doOpenWin({
        title: '新增收费项目',
        url: '../HandlerSetupFee/EditFee.html',
        width: '90%',
        height: "90%",
    }, function () {
        reload_tt();
    });
}
function reload_tt() {
    var id = getTabID();
    document.getElementById('iframe_' + id).contentWindow.reLoadTT();
}
function getSelectRows() {
    var id = getTabID();
    var rows = document.getElementById('iframe_' + id).contentWindow.getRows();
    return rows;
}
function getTabID() {
    return $("#ChargeSummaryAccording").tabs("getSelected").panel("options").id;
}
function editFee(ID) {
    if (!ID) {
        var rows = getSelectRows();
        if (rows.length == 0) {
            show_message("请至少选择一个收费项目", "info");
            return;
        }
        if (rows.length > 1) {
            show_message("请选择单个收费项目进行编辑", "info");
            return;
        }
        ID = rows[0].ID;
    }
    doOpenWin({
        title: '修改收费项目',
        url: '../HandlerSetupFee/EditFee.html?ID=' + ID,
        width: '80%',
        height: "80%",
    }, function () {
        reload_tt();
    });
}
function deleteFee() {
    var list = [];
    var rows = getSelectRows();
    if (rows.length == 0) {
        show_message('请选择一条数据，操作取消', 'warning');
        return;
    }
    $.each(rows, function (index, row) {
        list.push(row.ID);
    });
    var options = { visit: "checkdeletechargesummary", ChargeIDs: JSON.stringify(list) };
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: 'http://demo.saasyy.com/Handler/CheckStatusHandler.ashx',
        data: options,
        success: function (data) {

            data.status = true;


            if (!data.status) {
                if (data.error) {
                    show_message(data.error, "warning");
                    return;
                }
                show_message("系统异常", "info");
                return;
            }
            top.$.messager.confirm("提示", "确认删除选中的收费项目?", function (r) {
                if (r) {
                    deletesummaryfee(list)
                }
            });
        }
    });
}
function deletesummaryfee(list) {
    var options = { visit: 'deletesummaryfee', list: JSON.stringify(list) };
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: 'http://demo.saasyy.com/Handler/FeeCenterHandler.ashx',
        data: options,
        success: function (message) {

            message.status = true;

            if (message.status) {
                show_message('删除成功', 'success');
                document.getElementById('iframe_' + getTabID()).contentWindow.reLoadTT();
            }
            else {
                show_message('系统错误', 'error');
            }
        }
    });
}
function do_start() {
    var list = [];
    var rows = getSelectRows();
    if (rows.length == 0) {
        show_message('请选择一条数据，操作取消', 'warning');
        return;
    }
    var notzhouqi = false;
    $.each(rows, function (index, row) {
        if (row.FeeType != 1) {
            notzhouqi = true;
            return false;
        }
        list.push(row.ID);
    });
    if (notzhouqi) {
        show_message("请选择周期费用", "warning");
        return;
    }
    var roomidlist = [];
    var projectidlist = [];
    var projectid = null;
    try {
        roomidlist = GetSelectedRooms();
        projectid = GetSelectRadio();
    } catch (e) {

    }
    if (roomidlist.length == 0 && (projectid == null || projectid == "")) {
        show_message("请同时选中收费标准和对应资源", "warning");
        return;
    }
    if (projectid != null && projectid != "") {
        projectidlist.push(projectid);
    }
    var options = { visit: "checkroomfeesummary", summaryids: JSON.stringify(list), projectids: JSON.stringify(projectidlist), roomids: JSON.stringify(roomidlist), CompanyID: CompanyID };
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: 'http://demo.saasyy.com/HandlerHandler/FeeCenterHandler.ashx',
        data: options,
        success: function (data) {
            if (data.status) {
                if (data.hasfee) {
                    top.$.messager.confirm("提示", "当前选中的资源已启用该收费项目，是否重复启用", function (r) {
                        if (r) {
                            startFeeProcess(list, projectidlist, roomidlist);
                        }
                    })
                    return;
                }
                startFeeProcess(list, projectidlist, roomidlist);
            }
        }
    });
}
function startFeeProcess(summaryidlist, projectidlist, roomidlist) {
    MaskUtil.mask('body', '提交中');
    var options = { visit: "saveroomfee", summaryids: JSON.stringify(summaryidlist), projectids: JSON.stringify(projectidlist), roomids: JSON.stringify(roomidlist), CompanyID: CompanyID };
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: 'http://demo.saasyy.com/HandlerHandler/FeeCenterHandler.ashx',
        data: options,
        success: function (data) {
            MaskUtil.unmask();
            if (data.status) {
                show_message("启用成功", "success");
            }
            else if (data.error) {
                show_message(data.error, "warning");
            }
            else {
                show_message('系统错误', 'error');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (textStatus == "timeout") {
                show_message("启用成功", "success");
            } else {
                alert(textStatus);
            }
        }
    });
}
