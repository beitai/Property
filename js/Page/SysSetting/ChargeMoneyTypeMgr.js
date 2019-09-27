var tt_CanLoad = false;
$(function () {
    loadTT()
})
function loadTT() {
    //加载
    $('#tt_table').datagrid({
        // url: '../Handler/SysSettingHandler.ashx',
        url: '../mock/SysSettingHandler1.json',
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
        "visit": "loadchargemoneytype"
    });
}
function formatSortOrder(value, row) {
    if (Number(value) < 0) {
        return 0;
    }
    return value;
}
function do_add() {
    doOpenWin({
        title: '新增收款设置',
        url: '../SysSeting/ChargeMoneyTypeEdit.html',
        width: '50%',
        height: "50%",
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
        title: '修改收款设置',
        url: '../SysSeting/ChargeMoneyTypeEdit.html?ID=' + rows[0].ChargeTypeID,
        width: '50%',
        height: "50%",
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
        IDList.push(row.ChargeTypeID);
    })
    top.$.messager.confirm("提示", "确认删除?", function (r) {
        if (r) {
            var options = { visit: 'deletechargemoneytype', ids: JSON.stringify(IDList) };
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: 'http://demo.saasyy.com/Handler/SysSettingHandler.ashx',
                data: options,
                success: function (message) {
                    message.status = true;
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
