var tt_CanLoad = false;
$(function () {
    loadTT()
})
function loadTT() {
    //加载
    $('#tt_table').datagrid({
        // url: '../Handler/SysSettingHandler.ashx',
        url: '../mock/SysSettingHandler2.json',
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
    $('#tdOrderTypeName').combobox({
        onChange: function () {
            checkChargeType();
        }
    })
}
function checkChargeType() {
    if ($('#tdOrderTypeName').combobox('getValue') == 'chargefee') {
        $('.tr_chargetype').show();
    }
    else {
        $('.tr_chargetype').hide();
    }
}
function SearchTT() {
    tt_CanLoad = true;
    $("#tt_table").datagrid("load", {
        "visit": "loadordernumberlist"
    });
}
function formatSortOrder(value, row) {
    if (Number(value) < 0) {
        return 0;
    }
    return value;
}
function formatOper(value, row) {
    if (row.OrderTypeName == 'productinnumber' || row.OrderTypeName == 'productoutnumber') {
        return '';
    }
    var str = '<a href="javascript:AssignProject(' + row.ID + ')">分配</a>';
    return str;
}
function AssignProject(ID) {
    doOpenWin({
        title: '分配项目',
        url: '../SysSeting/AssignProjectNumber.html?OrderNumberID=' + ID,
        width: '50%',
        height: "80%",
        winid: 'winadd'
    });
}
function do_add() {
    doOpenWin({
        title: '新增单据设置',
        url: '../SysSeting/OrderNumberEdit.html',
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
        title: '修改单据设置',
        url: '../SysSeting/OrderNumberEdit.html?ID=' + rows[0].ID,
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
            var options = { visit: 'deleteordernumber', ids: JSON.stringify(IDList) };
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: '../Handler/SysSettingHandler.ashx',
                data: options,
                success: function (message) {
                    if (message.status) {
                        show_message('删除成功', 'success', function () {
                            $("#tt_table").datagrid("reload");
                        });
                        return;
                    }
                    show_message('系统错误', 'error');
                }
            });
        }
    })
}