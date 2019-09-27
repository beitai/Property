var tt_CanLoad = false;
$(function () {

    loadTT();
});
function loadTT() {
    $('#tt_table').datagrid({
        url: '../Handler/FeeCenterHandler.ashx',
        loadMsg: '正在加载',
        border: false,
        remoteSort: false,
        pagination: true,
        rownumbers: true,
        fit: true,
        fitColumns: false,
        singleSelect: false,
        selectOnCheck: true,
        checkOnSelect: true,
        striped: true,
        pageSize: global_variable.pageSize,
        pageList: global_variable.pageList,
        columns: [[
            { field: 'ck', checkbox: true },
            { field: 'FullName', title: '资源位置', width: 260 },
            { field: 'RoomName', title: '资源编号', width: 80, },
            { field: 'BankChargeType', title: '代扣收费项目类型', width: 130 },
            { field: 'ChargeNo', title: '缴费编号', width: 100 },
            { field: 'BankAccountNo', title: '付方卡号', width: 100 },
            { field: 'BankName', title: '付方开户行名称', width: 150 },
            { field: 'BankAccountName', title: '付款户名', width: 100 },
            { field: 'IDCardNumber', title: '代扣人身份证号', width: 150 },
            { field: 'PhoneNumber', title: '银行短信通知手机号码', width: 150 },
            { field: 'AddUserName', title: '创建人', width: 100 },
            { field: 'AddTime', formatter: formatDateTime, title: '创建日期', width: 150 }

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
    var options = get_options();
    if (options == null) {
        return;
    }
    tt_CanLoad = true;
    $("#tt_table").datagrid("load", options);
}
function get_options() {
    var RoomIDs = [];
    var ProjectIDs = [];
    try {
        RoomIDs = GetSelectedRooms();
        ProjectIDs = GetSelectedProjects();
    } catch (e) {
    }
    var options = {
        "visit": "loadbankchargeroomlist",
        "Keywords": $("#tdKeywords").searchbox("getValue"),
        "ChargeType": $("#tdChargeType").combobox("getValue"),
        "RoomIDs": JSON.stringify(RoomIDs),
        "ProjectIDs": JSON.stringify(ProjectIDs),
    };
    return options;
}
function editchargebyid(id, roomid) {
    var width = $(window).width();
    var height = $(window).height();
    var iframe = "../BankCharge/BankCharge_Room_Edit.html?ID=" + id + "&RoomID=" + roomid;
    doOpenWin({
        title: '修改代扣信息',
        url: iframe,
        winParent: false,
        width: '80%',
        height: "80%",
    }, function () {
        $("#tt_table").datagrid("reload");
    });

}
function editcharge() {
    var rows = $('#tt_table').datagrid("getSelections");
    if (rows.length == 0) {
        show_message("请选择一个成员", "info");
        return;
    }
    if (rows.length > 1) {
        show_message("最多只能选择一个成员进行编辑", "info");
        return;
    }
    editchargebyid(rows[0].ID, rows[0].RoomID);
}
function addcharge() {
    var iframe = "../BankCharge/BankCharge_Room_Edit.html?RoomID=" + RoomID;
    doOpenWin({
        title: '新增代扣信息',
        url: iframe,
        winParent: false,
        width: '80%',
        height: "80%",
    }, function () {
        $("#tt_table").datagrid("reload");
    });

}
function deletecharge() {
    var rows = $('#tt_table').datagrid("getSelections");
    var IDList = [];
    if (rows.length == 0) {
        show_message("请选择一个资源", "info");
        return;
    }
    $.each(rows, function (index, row) {
        IDList.push(row.ID);
    })
    top.$.messager.confirm("提示", "是否删除选中的信息?", function (r) {
        if (r) {
            var options = { visit: 'removebankchargeroom', IDList: JSON.stringify(IDList) };
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

function do_export() {
    var row = $('#tt_table').datagrid('getSelections');
    if (row.length <= 0) {
        show_message('请至少选择一条代扣方信息，然后再执行本次操作', "info");
        return;
    }
    var ID = [];
    for (var i = 0; i < row.length; i++) {
        ID.push(row[i].ID);
    }
    MaskUtil.mask('body', '导出中');
    var options = {};
    options.ID = JSON.stringify(ID);
    options.page = 1;
    options.rows = 1;
    options.canexport = true;
    options.visit = 'getbankchargeroomgrid';
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

    var iframe = '../BankCharge/ImportBarkChargeRoom.html';
    doOpenWin({
        title: '导入',
        url: iframe,
        winParent: false,
        width: '80%',
        height: "80%",
    }, function () {
        $("#tt_table").datagrid("reload");
    });

}



