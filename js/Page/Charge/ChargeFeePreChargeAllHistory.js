var his_CanLoad = false;
$(function () {
    getcomboboxparams();
    loadchargeHistoryBill();
})
function getcomboboxparams() {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        data: { 'visit': 'getchargeprechargeallparams' },
        url: '../Handler/FeeCenterHandler.ashx',
        success: function (data) {
            tdChargeSummary.combobox({
                editable: false,
                data: data.chargelist,
                valueField: 'ID',
                textField: 'Name',
                multiple: true
            });
        }
    });
}
function loadchargeHistoryBill() {
    $('#his_table').datagrid({
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
        showFooter: true,
        onCheck: onCheck,
        onUncheck: onUncheck,
        pageSize: 100,
        pageList: [100, 500],
        onBeforeLoad: function (data) {
            if (!his_CanLoad) {
                $('#his_table').datagrid("loadData", {
                    total: 0,
                    rows: []
                });
            }
            return his_CanLoad;
        },
        onLoadError: function (data) {
            //alert("有错");
            $('#his_table').datagrid("loadData", {
                total: 0,
                rows: []
            });
        },
        columns: [[
            { field: 'ck', checkbox: true },
            { field: 'FullName', title: '资源位置', width: 260 },
            { field: 'RoomName', title: '资源编号', width: 100 },
            { field: 'PrintNumber', formatter: formatPrintNumber, title: '收款单号', width: 100 },
            { field: 'ChargeStateDesc', title: '收费状态', width: 100 },
            { field: 'ChargeMan', title: '收款人', width: 100 },
            { field: 'ChargeTime', formatter: formatDateTime, title: '收款日期', width: 120 },
            { field: 'ChargeName', title: '收费项目', width: 100 },
            { field: 'ChargeTypeName', title: '费项分类', width: 80 },
            { field: 'StartTime', formatter: formatTime, title: '计费开始日期', width: 80 },
            { field: 'EndTime', formatter: formatTime, title: '计费结束日期', width: 80 },
            { field: 'FormatUnitPrice', title: '单价', width: 80 },
            { field: 'UseCount', title: '面积/用量', width: 80 },
            { field: 'FormatSumRealCost', formatter: formatPrintRealCost, title: '实收合计', width: 80 },
            { field: 'FormatRealCost', formatter: formatRealCost, title: '实收金额', width: 80 },
            { field: 'Remark', title: '备注', width: 100 }
        ]],
        onLoadSuccess: onLoadSuccess,
        toolbar: '#tb'
    });
}
function SearchHis() {
    var StartChargeTime = tdStartTime.datebox("getValue");
    var EndChargeTime = tdEndTime.datebox("getValue");
    if (StartChargeTime != '' && EndChargeTime != '') {
        if (stringToDate(StartChargeTime).valueOf() > stringToDate(EndChargeTime).valueOf()) {
            show_message('开始日期不能大于结束日期', 'warning');
            return;
        }
    }
    var RoomIDs = parent.GetSelectedRooms();
    var ProjectIDs = parent.GetSelectedProjects();
    var ChargeSummarys = tdChargeSummary.combobox("getValues");
    his_CanLoad = true;
    $("#his_table").datagrid("load", {
        "visit": "loadroomfeehistorylist",
        "RoomID": JSON.stringify(RoomIDs),
        "ProjectID": JSON.stringify(ProjectIDs),
        "StartChargeTime": StartChargeTime,
        "EndChargeTime": EndChargeTime,
        "IncludePreCharge": true,
        "CompanyID": CompanyID,
        "IncludeFooter": true,
        "PreChargeStatus": tdChargeStatus.combobox("getValue"),
        "ChargeSummarys": JSON.stringify(ChargeSummarys)
    });
}
function cancelHistoryChargeFee() {
    var rows = $('#his_table').datagrid("getSelections");
    var PrintIDList = [];
    if (rows.length == 0) {
        show_message('请选择一条数据，操作取消', 'warning');
        return;
    }
    var canCancel = true;
    var isPreCharge = false;
    var PreChargeID = [];
    $.each(rows, function (index, row) {
        if (row.ChargeState == 2) {
            canCancel = false;
            return false;
        }
        if ($.inArray(row.PrintID, PrintIDList) == -1) {
            PrintIDList.push(row.PrintID);
        }
    });
    if (!canCancel) {
        show_message("不能重复作废", "info");
        return;
    }
    //if (isPreCharge) {
    //    var options = { visit: 'checkprechargeroomfeehistory', RoomIDs: JSON.stringify(PreChargeID) };
    //    $.ajax({
    //        type: 'POST',
    //        dataType: 'json',
    //        url: '../Handler/FeeCenterHandler.ashx',
    //        data: options,
    //        success: function (message) {
    //            if (message.status == 2) {
    //                show_message("预收款已经冲销,禁止作废", "info");
    //                return;
    //            }
    //            if (message.status == 1) {
    //                top.$.messager.confirm("提示", "确认作废选中的单据?", function (r) {
    //                    if (r) {
    //                        CancelRoomFeeHistory(PrintIDList)
    //                    }
    //                })
    //            }
    //        }
    //    });
    //    return;
    //}
    top.$.messager.confirm("提示", "确认作废选中的单据?", function (r) {
        if (r) {
            CancelRoomFeeHistory(PrintIDList)
        }
    })
}
function CancelRoomFeeHistory(PrintIDList) {
    var options = { visit: 'cancelhistoryfee', PrintIDList: JSON.stringify(PrintIDList) };
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '../Handler/FeeCenterHandler.ashx',
        data: options,
        success: function (data) {
            if (data.status) {
                if (data.hasorder) {
                    show_message("选中的订单部分已交班，禁止作废操作", "info");
                    return;
                }
                show_message("作废成功", "info");
                $('#his_table').datagrid("reload");
                parent.GetBalance(0);
            }
            else if (data.msg) {
                show_message(data.msg, 'warning');
            }
            else {
                show_message('系统错误', 'error');
            }
        }
    });
}