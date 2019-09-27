var tt_CanLoad = false;
$(function () {
    loadTT();
})

function loadTT() {
    //加载
    $('#tt_table').datagrid({
        // url: '../Handler/SysSettingHandler.ashx',
        url: '../mock/SysSettingHandler5.json',
        loadMsg: '正在加载',
        border: false,
        remoteSort: false,
        pagination: true,
        rownumbers: true,
        fit: true,
        fitColumns: true,
        singleSelect: false,
        selectOnCheck: true,
        checkOnSelect: true,
        striped: true,
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
        },
        toolbar: '#tb'
    });
    SearchTT();
}
function SearchTT() {
    tt_CanLoad = true;
    $("#tt_table").datagrid("load", {
        "visit": "loadchargediscount"
    });
}
function formatValidTime(value, row) {
    var starttime = checktime(row.StartTime);
    var endtime = checktime(row.EndTime);
    if (starttime != "" || endtime != "") {
        return (starttime == "" ? "--" : starttime) + " 至 " + (endtime == "" ? "--" : endtime);
    }
    return "--";
}
function formatDiscountValue(value, row) {
    if (row.DiscountType == "percent") {
        return value + '%';
    } else if (row.DiscountType == "permonth") {
        return value + '个月';
    }
    else {
        return value + '元';
    }
}
function formatRemark(value, row) {
    if (row.Remark.length > 10) {
        return row.Remark.substring(0, 10) + "...";
    }
    return row.Remark;
}
function checktime(time) {
    if (time == undefined || time == "" || time == null || time == '0001-01-01T00:00:00.0000000' || time == '0001-01-01T00:00:00' || time == '1900-01-01T00:00:00.0000000' || time == '1900-01-01T00:00:00') {
        return "";
    }
    return time.substring(0, 16).split("T")[0];
}
function do_add() {
    doOpenWin({
        title: '新增减免方案',
        url: '../SysSeting/ChargeDiscountEdit.html',
        width: '80%',
        height: "80%",
    }, function () {
        $("#tt_table").datagrid("reload");
    });
}
function do_edit() {
    var rows = $("#tt_table").datagrid("getSelections");
    if (rows.length != 1) {
        show_message("请选择一行进行此操作", "info");
        return;
    }
    doOpenWin({
        title: '修改减免方案',
        url: '../SysSeting/ChargeDiscountEdit.html?ID=' + rows[0].ID,
        width: '80%',
        height: "80%",
    }, function () {
        $("#tt_table").datagrid("reload");
    });
}
function do_remove() {
    var rows = $("#tt_table").datagrid("getSelections");
    if (rows.length == 0) {
        show_message("请至少选择一行进行此操作", "info");
        return;
    }
    var IDList = [];
    $.each(rows, function (index, row) {
        IDList.push(row.ID);
    })
    top.$.messager.confirm("提示", "确认删除?", function (r) {
        if (r) {
            var options = { visit: 'deletechargediscount', ids: JSON.stringify(IDList) };
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: 'http://demo.saasyy.com/Handler/SysSettingHandler.ashx',
                data: options,
                success: function (message) {
                    
                    message.status = true

                    if (message.status) {
                        show_message('删除成功', 'success', function () {
                            $("#tt_table").datagrid("reload");
                        });
                        return;
                    }
                    if (message.error) {
                        show_message(message.error, 'warning');
                        return;
                    }
                    show_message('系统错误', 'error');
                }
            });
        }
    })
}
