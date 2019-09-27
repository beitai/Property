var tt_CanLoad = false;
$(function () {
    loadTT();
});
function loadTT() {
    tt_CanLoad = false;
    $('#tt_table').datagrid({
        url: '../Handler/FeeCenterHandler.ashx',
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
        showFooter: true,
        striped: true,
        columns: [[
            { field: 'ck', checkbox: true },
            { field: 'TypeName', title: '代扣名称', width: 100 },
            { field: 'ChargeNames', title: '代扣类型', width: 200 },
            { field: 'AddTimeDesc', formatter: formatTime, title: '添加时间', width: 150 },
            { field: 'AddUserName', title: '添加人', width: 200 },
        ]],
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
        },
        toolbar: '#tb'
    });
    SearchTT();
}

function SearchTT() {
    tt_CanLoad = true;
    $("#tt_table").datagrid("load", {
        "visit": "getchargetypegrid",
        "Keywords": $("#tdKeywords").searchbox("getValue")
    });
}
function addRow() {
    var iframe = "../BankCharge/BankCharge_ChargeTypeAdd.html";
    doOpenWin({
        title: '新增规则',
        url: iframe,
        winParent: false,
        width: '80%',
        height: "80%",
    }, function () {
        $("#tt_table").datagrid("reload");
    });

}
function editRow() {
    var rows = $("#tt_table").datagrid("getSelections");
    if (rows.length == 0) {
        show_message("请先选择一个规则", "info");
        return;
    }
    if (rows.length > 1) {
        show_message("只能选择一个规则", "info");
        return;
    }
    var ID = rows[0].ID;
    var iframe = "../BankCharge/BankCharge_ChargeTypeAdd.html?ID=" + ID;
    doOpenWin({
        title: '修改规则',
        url: iframe,
        winParent: false,
        width: '80%',
        height: "80%",
    }, function () {
        $("#tt_table").datagrid("reload");
    });

}
function removeRows() {
    var rows = $("#tt_table").datagrid("getSelections");
    if (rows.length == 0) {
        show_message("请先选择一个规则", "info");
        return;
    }
    var IDList = [];
    $.each(rows, function (index, row) {
        IDList.push(row.ID);
    })
    top.$.messager.confirm("提示", "删除后可能导致数据显示错误,确定?", function (r) {
        if (r) {
            var options = { visit: 'removechargetypegrid', IDList: JSON.stringify(IDList) };
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: '../Handler/FeeCenterHandler.ashx',
                data: options,
                success: function (message) {
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
