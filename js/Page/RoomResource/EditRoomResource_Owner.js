var home_CanLoad = false;
$(function () {
    loadHome();
});
function loadHome() {
    $('#home_table').datagrid({
        url: '../Handler/RoomResourceHandler.ashx',
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
        onDblClickRow: onDblClickHomeRow,
        striped: true,
        pageSize: global_variable.pageSize,
        pageList: global_variable.pageList,
        onBeforeLoad: function (data) {
            if (!home_CanLoad) {
                $('#home_table').datagrid("loadData", {
                    total: 0,
                    rows: []
                });
            }
            return home_CanLoad;
        },
        onLoadError: function (data) {
            //alert("有错");
            $('#home_table').datagrid("loadData", {
                total: 0,
                rows: []
            });
        },
        toolbar: '#home_tb'
    });
    SearchHome()
}
function onDblClickHomeRow(index, row) {
    edithomebyid(row.ID);
}
function SearchHome() {
    home_CanLoad = true;
    $("#home_table").datagrid("load", {
        "visit": "loadlrelatefamily",
        "RoomID": RoomID,
        "IsProjectUser": true
    });
}
function edithomebyid(id) {
    doOpenWin({
        title: '修改住户',
        url: '../RoomResource/EditRelateFamily.html?ID=' + id,
        width: "100%",
        height: "100%",
        winParent: true,
        hideBg: true,
    }, function () {
        $("#home_table").datagrid("reload");
    });
}
function edithome() {
    var rows = $('#home_table').datagrid("getSelections");
    if (rows.length == 0) {
        show_message("请选择一个成员", "info");
        return;
    }
    if (rows.length > 1) {
        show_message("最多只能选择一个成员进行编辑", "info");
        return;
    }
    edithomebyid(rows[0].ID);
}
function addhome() {
    doOpenWin({
        title: '新增住户',
        url: '../RoomResource/EditRelateFamily.html?RoomID=' + RoomID,
        width: "100%",
        height: "100%",
        winParent: true,
        hideBg: false
    }, function () {
        $("#home_table").datagrid("reload");
    });
}
function deletehome(type) {
    var rows = $('#home_table').datagrid("getSelections");
    var IDList = [];
    if (rows.length == 0) {
        show_message("请选择一个资源", "info");
        return;
    }
    $.each(rows, function (index, row) {
        IDList.push(row.ID);
    })
    top.$.messager.confirm("提示", "是否删除选中的住户?", function (r) {
        if (r) {
            var options = { visit: 'deletefamily', IDList: JSON.stringify(IDList) };
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: '../Handler/RoomResourceHandler.ashx',
                data: options,
                success: function (message) {
                    if (message.status) {
                        show_message('删除成功', 'success');
                        $('#home_table').datagrid("reload");
                    }
                    else {
                        show_message('系统错误', 'error');
                    }
                }
            });
        }
    })
}
function editapp() {
    var rows = $("#home_table").datagrid("getSelections");
    if (rows.length == 0) {
        show_message("请至少选择一个住户进行此操作", "info");
        return;
    }
    if (rows.length > 1) {
        show_message("请选择单行进行此操作", "info");
        return;
    }
    doOpenWin({
        title: '修改APP帐号',
        url: '../RoomResource/EditAPPAccount.html?RelationID=' + rows[0].ID,
        width: "80%",
        height: "80%",
        hideBg: true
    }, function () {
        $("#home_table").datagrid("reload");
    });
}
