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
        singleSelect: true,
        selectOnCheck: true,
        checkOnSelect: true,
        showFooter: true,
        striped: true,
        columns: [[
            { field: 'ck', checkbox: true },
            { field: 'OrderNumber', title: '报盘单号', width: 200 },
            { field: 'OrderTitle', title: '标题', width: 200 },
            { field: 'TotalCost', title: '报盘金额', width: 100 },
            { field: 'TotalChargeCost', title: '回盘金额', width: 100 },
            { field: 'OrderStatusDesc', title: '回盘状态', width: 100 },
            { field: 'AddTime', formatter: formatDateTime, title: '添加时间', width: 150 }
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
    $("#tt_table").datagrid("load", get_options());
}
function get_options() {
    var keywords = $("#tdKeywords").searchbox("getValue");
    var OrderStatus = $("#tdOrderStatus").searchbox("getValue");
    var RoomIDs = [];
    var ProjectIDs = [];
    try {
        RoomIDs = parent.GetSelectedRooms();
        ProjectIDs = parent.GetSelectedProjects();
    } catch (e) {

    }
    var options = {
        "visit": "getbankchargeordergrid",
        "keywords": keywords,
        "OrderStatus": OrderStatus,
        "RoomIDs": JSON.stringify(RoomIDs),
        "ProjectIDs": JSON.stringify(ProjectIDs),
    };
    return options;
}
function do_export() {
    var row = $('#tt_table').datagrid('getSelected');
    if (!row) {
        show_message('请选择一条代扣单，然后再执行本次操作', "info");
        return;
    }
    MaskUtil.mask('body', '导出中');
    var options = {};
    options.OrderID = row.ID;
    options.page = 1;
    options.rows = 1;
    options.canexport = true;
    options.visit = 'getchargeroomfeegrid';
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '../Handler/FeeCenterHandler.ashx',
        data: options,
        success: function (data) {
            MaskUtil.unmask();
            if (data.status) {
                window.location.href = data.downloadurl;
                return;
            }
            if (data.error) {
                show_message(data.error, "info");
                return;
            }
            show_message('系统错误', 'error');
        }
    });
}
function do_import() {
    var row = $("#tt_table").datagrid('getSelected');
    if (!row) {
        show_message('请选择一条报盘记录，然后再执行本次操作', 'warning');
        return;
    }
    var iframe = '../BankCharge/ImportBankCharge.aspx';
    doOpenWin({
        title: '回扣回盘',
        url: iframe,
        winParent: false,
        width: '80%',
        height: "80%",
    }, function () {
        $("#tt_table").datagrid("reload");
    });

}
function do_chk() {
    var row = $("#tt_table").datagrid('getSelected');
    if (!row) {
        show_message('请选择一条报盘记录，然后再执行本次操作', 'warning');
        return;
    }
    var iframe = '../BankCharge/BankCharge_RoomFeeList.aspx?OrderID=' + row.ID;
    doOpenWin({
        title: '查看账单',
        url: iframe,
        winParent: false,
        width: '80%',
        height: "80%",
    }, function () {
        $("#tt_table").datagrid("reload");
    });
}
function do_remove() {
    var row = $("#tt_table").datagrid('getSelected');
    if (!row) {
        show_message('请选择一条报盘记录，然后再执行本次操作', 'warning');
        return;
    }
    if (row.OrderStatus == 2) {
        show_message('代扣单已回盘，禁止删除', 'warning');
        return;
    }
    top.$.messager.confirm("提示", "是否删除选中的信息?", function (r) {
        if (r) {
            var options = { visit: 'removebankchargeorder', ID: row.ID };
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: '../Handler/FeeCenterHandler.ashx',
                data: options,
                success: function (message) {
                    if (message.status) {
                        show_message('删除成功', 'success', function () {
                            $('#tt_table').datagrid("reload");
                        });
                    }
                    else if (message.error) {
                        show_message(message.error, 'warning');
                    }
                    else {
                        show_message('系统错误', 'error');
                    }
                }
            });
        }
    })
}
