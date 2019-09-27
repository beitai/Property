var his_CanLoad = false;
$(function () {
    loadchargeHistoryBill();
});
function loadchargeHistoryBill() {
    $('#his_table').datagrid({
        url: '../../mock/FeeCenterHandler2.json',
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
        onCheck: onCheck,
        onUncheck: onUncheck,
        pageSize: global_variable.pageSize,
        pageList: global_variable.pageList,
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
            { field: 'FinalPrintNumber', formatter: formatPrintNumber, title: '收款单号', width: 100 },
            { field: 'ChargeStateDesc', title: '单据状态', width: 100 },
            { field: 'ChargeMan', title: '收款人', width: 100 },
            { field: 'ChargeTime', formatter: formatDateTime, title: '收款日期', width: 120 },
            { field: 'RoomName', title: '房号', width: 100 },
            { field: 'ChargeName', title: '收费项目', width: 100 },
            //{ field: 'ChargeTypeName', title: '费项分类', width: 80 },
            { field: 'StartTime', formatter: formatTime, title: '计费开始日期', width: 80 },
            { field: 'EndTime', formatter: formatTime, title: '计费结束日期', width: 80 },
            { field: 'FormatUnitPrice', title: '单价', width: 80 },
            { field: 'UseCount', title: '面积/用量', width: 80 },
            { field: 'FormatSumRealCost', title: '实收合计', width: 80 },
            { field: 'FormatRealCost', title: '实收金额', width: 80 },
            { field: 'Discount', formatter: formatDiscount, title: '减免金额', width: 80 },
            { field: 'StartPoint', formatter: formatDecimal, title: '上次读数', width: 80 },
            { field: 'EndPoint', formatter: formatDecimal, title: '本次读数', width: 80 },
            { field: 'TotalPoint', formatter: formatDecimal, title: '本次用量', width: 80 },
            { field: 'Remark', title: '备注', width: 100 }
        ]],
        onLoadSuccess: onLoadSuccess,
        toolbar: '#tt_mm'
    });
    SearchHis();
}
function SearchHis() {
    var idarry = parent.GetRoomIDList();
    if (idarry.length == 0) {
        return;
    }
    his_CanLoad = true;
    $("#his_table").datagrid("load", {
        "visit": "loadroomfeehistorylist",
        "RoomID": JSON.stringify(idarry)
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
        show_message("不能重复作废", "warning");
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
    //                show_message("预收款已经冲销,禁止作废", "warning");
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
    MaskUtil.mask('body', '提交中');
    var options = { visit: 'cancelhistoryfee', CompanyID: companyID, AddMan: AddMan, PrintIDList: JSON.stringify(PrintIDList) };
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '../Handler/FeeCenterHandler.ashx',
        data: options,
        success: function (data) {
            MaskUtil.unmask();
            if (data.status) {
                if (data.hasorder) {
                    show_message("选中的订单部分已交班，禁止作废操作", "warning");
                    return;
                }
                show_message("作废成功", "success");
                $('#his_table').datagrid("reload");
                parent.GetBalance(0);
            }
            else if (data.error) {
                show_message(data.error, 'warning');
            }
            else {
                show_message('系统错误', 'error');
            }
        }
    });
}
