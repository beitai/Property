var tt_CanLoad = false;
$(function () {
    loadtt();
});
function loadtt() {
    $('#tt_table').datagrid({
        // url: '../Handler/FeeCenterHandler.ashx',
        url: '../mock/FeeCenterHandler.json',
        loadMsg: '正在加载',
        border: true,
        remoteSort: false,
        pagination: true,
        rownumbers: true,
        fit: true,
        fitColumns: false,
        singleSelect: false,
        selectOnCheck: true,
        checkOnSelect: true,
        striped: true,
        onDblClickRow: onDblClickRow,
        //onClickCell: onClickCell,
        pageSize: global_variable.pageSize,
        pageList: global_variable.pageList,
        onBeforeLoad: function (data) {
            if (!tt_CanLoad) {
                $('#tt_table').datagrid("loadData", {
                    total: 0,
                    rows: []
                });
            }
            return tt_CanLoad;
        },
        onLoadError: function (data) {
            //alert("有错");
            $('#tt_table').datagrid("loadData", {
                total: 0,
                rows: []
            });
        }
    });
    SearchTT();
}
function SearchTT() {
    var keywords = parent.$('#tdKeywords').searchbox('getValue');
    tt_CanLoad = true;
    $("#tt_table").datagrid("load", {
        "visit": "LoadlChargeSummaryList",
        "CategoryID": CategoryID,
        "keywords": keywords
    });
}
function formatOper(value, row) {
    if (row.FeeType == 1 && canStart == 1) {
        return '<a onclick="startFee(' + row.ID + ')"><span style="color:red;">启用</span></a>';
    }
    return "--";
}
function startFee(ID) {
    var roomidlist = [];
    var projectidlist = [];
    var projectid = null;
    try {
        roomidlist = GetSelectedRooms();
        projectid = GetSelectRadio();
    } catch (e) {

    }
    if (roomidlist.length == 0 && (projectid == null || projectid == "")) {
        show_message("请同时选中收费标准和对应资源");
        return;
    }
    if (projectid != null && projectid != "") {
        projectidlist.push(projectid);
    }
    var summaryidlist = [];
    summaryidlist.push(ID);
    var options = { visit: "checkroomfeesummary", summaryids: JSON.stringify(summaryidlist), projectids: JSON.stringify(projectidlist), roomids: JSON.stringify(roomidlist), CompanyID: CompanyID };
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '../Handler/FeeCenterHandler.ashx',
        data: options,
        success: function (data) {
            if (data.status) {
                if (data.hasfee) {
                    top.$.messager.confirm("提示", "当前选中的资源已启用该收费项目，是否重复启用", function (r) {
                        if (r) {
                            startFeeProcess(summaryidlist, projectidlist, roomidlist);
                        }
                    })
                    return;
                }
                startFeeProcess(summaryidlist, projectidlist, roomidlist);
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
        url: '../Handler/FeeCenterHandler.ashx',
        data: options,
        success: function (data) {
            MaskUtil.unmask();
            if (data.status) {
                show_message("启用成功", "success");
                return;
            }
            if (data.error) {
                show_message(data.error, "warning");
                return;
            }
            show_message('系统错误', 'error');
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
function getRows() {
    var rows = $("#tt_table").datagrid("getSelections");
    return rows;
}
function reLoadTT() {
    $("#tt_table").datagrid("reload");
}
function onDblClickRow(index, row) {
    editFee(row.ID)
}
function editFee(ID) {
    parent.editFee(ID);
}