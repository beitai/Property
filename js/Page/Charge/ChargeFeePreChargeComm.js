var pre_CanLoad = false, PreChargeID = 0;
$(function () {
    $(document).click(function (e) {
        var target = $(e.target);
        if (target.closest(".datagrid-btable,.calendar-noborder").length == 0) {
            //alert(target.closest(".calendar-noborder").length);
            endPreEditing();
        }
    });
    setTimeout(function () {
        all_check_btn_selected();
    }, 1000)
})

function loadprechargeList() {
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
        onCheck: onSelectPre,
        onUncheck: onUnSelectPre,
        onClickRow: onClickPreRow,
        onDblClickCell: onDblClickCell,
        pageSize: global_variable.pageSize,
        pageList: global_variable.pageList,
        onBeforeLoad: function (data) {
            if (!pre_CanLoad) {
                $('#tt_table').datagrid("loadData", {
                    total: 0,
                    rows: []
                });
            }
            return pre_CanLoad;
        },
        onLoadError: function (data) {
            //alert("有错");
            $('#tt_table').datagrid("loadData", {
                total: 0,
                rows: []
            });
        }, columns: [[
            { field: 'ck', checkbox: true },
            { field: 'FullName', title: '资源位置', width: 200 },
            { field: 'RoomName', title: '房号', width: 60 },
            { field: 'Name', title: '收费项目', width: 100 },
            { field: 'TotalCost', formatter: formatCost, title: '应收金额', width: 60 },
            { field: 'Discount', formatter: formatDiscount, editor: { type: 'numberbox', options: { precision: 2 } }, title: '减免金额', width: 60 },
            { field: 'TotalRealCost', formatter: formatTotalRealCost, title: '已收金额', width: 60 },
            { field: 'ChargeFee', editor: { type: 'numberbox', options: { precision: 2 } }, formatter: formatChargeFee, title: '冲销金额', width: 60 },
            { field: 'PreChargeBalance', formatter: formatPreChargeBalance, title: '预收款余额', width: 100 },
            { field: 'CalculateUnitPrice', formatter: formatUnitPrice, editor: { type: 'numberbox', options: { precision: 4 } }, title: '单价', width: 50 },
            { field: 'CalculateUseCount', formatter: formatUseCount, editor: { type: 'numberbox', options: { precision: 2 } }, title: '面积/用量', width: 80 },
            { field: 'CalculateStartTime', editor: 'datebox', formatter: formatStartTime, title: '计费开始日期', width: 100 },
            { field: 'CalculateEndTime', editor: 'datebox', formatter: formatEndTime, title: '计费结束日期', width: 100 },
            { field: 'NewEndTime', editor: 'datebox', formatter: formatNewEndTime, title: '计费停用日期', width: 100 },
            { field: 'WriteDate', formatter: formatTime, title: '账单日期', width: 80 },
            { field: 'OutDays', formatter: formatOutDays, title: '逾期', width: 80 },
            { field: 'Remark', editor: 'textbox', formatter: formatRemark, title: '备注', width: 100 }
        ]],
        toolbar: '#tt_mm',
        onLoadSuccess: function (data) {
            var currentcount = data.currentcount || 0;
            var url = '../Handler/FeeCenterHandler.ashx?currentcount=' + currentcount;
            $("#tt_table").datagrid("options").url = url;
        },
    });
}
function SearchPre() {
    var options = get_options();
    if (options == null) {
        return;
    }
    pre_CanLoad = true;
    $("#tt_table").datagrid("load", options);
}
function formatPreChargeBalance(value, row, index) {
    if (value < 0) {
        return 0;
    }
    return value;
}
function formatChargeFee(value, row, index) {
    if (value < 0) {
        return 0;
    }
    row.ChargeFee = xround(parseFloat(row.ChargeFee), 2)
    return row.ChargeFee;
}
var pre_editIndex = undefined;
function endPreEditing() {
    if (pre_editIndex == undefined) {
        return true;
    }
    $('#tt_table').datagrid('endEdit', pre_editIndex);
    pre_editIndex = undefined;
    return true;
}
var double_click = false;
function onDblClickCell(index, field, value) {
    var rows = $('#tt_table').datagrid('getRows');
    var row = rows[index];
    double_click = true;
    setTimeout(function () {
        double_click = false;
    }, 3000);
    if (endPreEditing()) {
        setTimeout(function () {
            var col = $('#tt_table').datagrid('getColumnOption', field);
            if (!col.editor) {
                field = 'ChargeFee';
            }
            editPreRoomFee(row, field);
            pre_editIndex = index;
        }, 1000);
    } else {
        setTimeout(function () {
            $('#tt_table').datagrid('selectRow', pre_editIndex);
        }, 1000);
    }
}
function onSelectPre(index, row) {
    setTimeout(function () {
        if (double_click) {
            return;
        }
        calculateRestBalance(row, true);
    }, 200);
}
function onUnSelectPre(index, row) {
    setTimeout(function () {
        $('#tt_table').datagrid('updateRow', {
            index: index,
            row: {
                ChargeFee: 0
            }
        });
        calculateRestBalance(row, true);
    }, 200);
}
function onClickPreRow(index, row) {
    if (pre_editIndex != index) {
        endPreEditing();
        return;
    }
    return;
    setTimeout(function () {
        $('#tt_table').datagrid('selectRow', index);
    }, 100);
}
function editPreRoomFee(row, fieldName) {
    var rowIndex = $('#tt_table').datagrid('getRowIndex', row);
    $('#tt_table').datagrid('selectRow', rowIndex).datagrid('beginEdit', rowIndex);
    if (row.Discount <= 0) {
        $('#tt_table').datagrid('getEditor', { index: rowIndex, field: 'Discount' }).target.numberbox("setValue", 0);
    }
    var $edUseCount = $('#tt_table').datagrid('getEditor', { index: rowIndex, field: 'CalculateUseCount' });
    if (row.CalculateUseCount > 0) {
        //$edUseCount.target.numberbox('disable', true);
    }
    else if (Number(row.CalculateUseCount) <= 0) {
        var usecount = calculateUseCount(row);
        $edUseCount.target.numberbox("setValue", usecount);
        if (usecount > 0) {
            //$edUseCount.target.numberbox('disable', true);
        }
    }
    var start = checktime(row.CalculateStartTime);
    if (start == "") {
        $('#tt_table').datagrid('getEditor', { index: rowIndex, field: 'CalculateStartTime' }).target.datebox("setValue", start);
    }
    if (row.TimeAuto) {
        $('#tt_table').datagrid('getEditor', { index: rowIndex, field: 'CalculateStartTime' }).target.datebox('disable', true);
    }
    if (checktime(row.CuiShouStartTime) != "") {
        $('#tt_table').datagrid('getEditor', { index: rowIndex, field: 'CalculateStartTime' }).target.datebox('disable', true);
    }
    var newend = calculateNewEndTime(row);
    $('#tt_table').datagrid('getEditor', { index: rowIndex, field: 'NewEndTime' }).target.datebox("setValue", newend);
    if (row.FeeType == 5) {
        $('#tt_table').datagrid('getEditor', { index: rowIndex, field: 'CalculateEndTime' }).target.datebox('disable', true);
    }
    else {
        var end = calculateEndTIme(row);
        $('#tt_table').datagrid('getEditor', { index: rowIndex, field: 'CalculateEndTime' }).target.datebox("setValue", end);
    }
    if (checktime(row.CuiShouEndTime) != "") {
        $('#tt_table').datagrid('getEditor', { index: rowIndex, field: 'CalculateEndTime' }).target.datebox('disable', true);
    }
    var maxChargefee = calculate_max_chargefee(row);
    $('#tt_table').datagrid('getEditor', { index: rowIndex, field: 'ChargeFee' }).target.numberbox({
        max: Number(maxChargefee)
    });
    var $edUnitPrice = $('#tt_table').datagrid('getEditor', { index: rowIndex, field: 'CalculateUnitPrice' });
    var JieTiePrice = calculateJieTiUnitPrice(row);
    if (JieTiePrice > 0) {
        $edUnitPrice.target.numberbox("disable", true);
        $edUnitPrice.target.numberbox("setValue", JieTiePrice);
    }
    else {
        if (Number(row.CalculateUnitPrice) <= 0) {
            row.CalculateUnitPrice = calculateUnitPrice(row);
        }
        if (row.CalculateUnitPrice > 0) {
            $edUnitPrice.target.numberbox("setValue", Number(row.CalculateUnitPrice));
            //$edUnitPrice.target.numberbox('disable', true);
        }
        else {
            $edUnitPrice.target.numberbox("setValue", 0);
        }
    }
    if (fieldName) {
        $('#tt_table').datagrid('getEditor', { index: rowIndex, field: fieldName }).target.next('span').find('input').focus();
    }
}
function all_check_btn_selected() {
    var check_all_elem = $('.datagrid-view .datagrid-header .datagrid-header-check input[type="checkbox"]');
    check_all_elem.bind('click', function () {
        if (check_all_elem.prop('checked')) {
            setTimeout(function () {
                var rows = $("#tt_table").datagrid("getSelections");
                $.each(rows, function (index, row) {
                    calculateRestBalance(row, true);
                })
            }, 100)
        }
        else {
            setTimeout(function () {
                var rows = $("#tt_table").datagrid("getRows");
                $.each(rows, function (index, row) {
                    $('#tt_table').datagrid('updateRow', {
                        index: index,
                        row: {
                            ChargeFee: 0
                        }
                    });
                })
            }, 100)
        }
    })
}
function calculateRestBalance(row, canupdate) {
    var BalanceValue = row.PreChargeBalance;
    var rows = sortby_rows(row);
    $.each(rows, function (i, current) {
        if (current.RoomID != row.RoomID && $.inArray(row.RoomID, current.RelationRoomIDList) == -1) {
            return true;
        }
        var usecount = calculateUseCount(current);
        var unitprice = calculateUnitPrice(current);
        var Cost = calculateCost(current, usecount, unitprice);
        var TotalRealCost = Number(current.TotalRealCost) <= 0 ? 0 : current.TotalRealCost;
        Cost = (Cost - TotalRealCost) > 0 ? (Cost - TotalRealCost) : 0;
        var ChargeFee = BalanceValue;
        if (BalanceValue >= Cost) {
            ChargeFee = Cost;
        }
        if (canupdate) {
            var index = $('#tt_table').datagrid('getRowIndex', current);
            $('#tt_table').datagrid('updateRow', {
                index: index,
                row: {
                    ChargeFee: ChargeFee
                }
            });
        }
        BalanceValue = BalanceValue - ChargeFee;
    });
    if (BalanceValue <= 0) {
        BalanceValue = 0;
    }
    return BalanceValue;
}
function savePreRoomFee() {
    var rows = $('#tt_table').datagrid("getSelections");
    $.each(rows, function (index, row) {
        var rowIndex = $('#tt_table').datagrid('getRowIndex', row);
        $('#tt_table').datagrid('endEdit', rowIndex);
    });
}
var historyidlist;
function dochargechongdiroomfee(PreChargeID, printType) {
    var rows = $('#tt_table').datagrid("getChecked");
    if (rows.length == 0) {
        show_message("请勾选一个收费项目", "warning");
        return;
    }
    $.each(rows, function (index, row) {
        var rowIndex = $('#tt_table').datagrid('getRowIndex', row);
        $('#tt_table').datagrid('endEdit', rowIndex);
    });
    var failedinfo = [];
    var RoomIDs = [];
    var endtimeerror = "";
    var costerror = "";
    var chargefeeerror = "";
    var part_chongqi = false;
    $.each(rows, function (index, row) {
        if (row.CalculateEndTime == "" && row.FeeType == 1) {
            endtimeerror += (index + 1) + ",";
            return true;
        }
        var usecount = calculateUseCount(row);
        row.UseCount = usecount;
        var unitprice = calculateUnitPrice(row);
        row.UnitPrice = unitprice;
        var cost = calculateCost(row, row.UseCount, row.UnitPrice);
        row.Cost = cost;
        if (row.Cost <= 0) {
            costerror += (index + 1) + ",";
            return true;
        }
        row.OutDays = calculateOutDays(row.CuiShouStartTime);
        row.CalculateStartTime = checktime(row.CalculateStartTime);
        row.CalculateEndTime = calculateEndTIme(row);
        if (row.Discount < 0) {
            row.Discount = 0;
        }
        if (row.ChargeFee <= 0) {
            chargefeeerror += (index + 1) + ",";
            return true;
        }
        if (row.Cost > row.ChargeFee) {
            part_chongqi = true;
        }
        var strarry = { ID: row.ID, UnitPrice: row.UnitPrice, UseCount: row.UseCount, StartTime: row.CalculateStartTime, EndTime: row.CalculateEndTime, Cost: row.Cost, Discount: row.Discount, OutDays: row.OutDays, Remark: row.Remark, ChargeFee: row.ChargeFee };
        failedinfo.push(strarry);
        RoomIDs.push(row.RoomID);
    });
    if (RoomIDs.length == 0) {
        if (endtimeerror != "") {
            show_message("第" + endtimeerror.substring(0, endtimeerror.length - 1) + "行计算结束日期不能为空", "warning");
            return;
        }
        if (costerror != "") {
            show_message("第" + costerror.substring(0, costerror.length - 1) + "行应收金额不能为0", "warning");
            return;
        }
        if (chargefeeerror != "") {
            show_message("第" + chargefeeerror.substring(0, chargefeeerror.length - 1) + "行冲销金额不能为0", "warning");
            return;
        }
        return;
    }
    var confirm_info = '确认冲销选中的账单?';
    if (part_chongqi) {
        confirm_info = '部分账单冲销金额不足，只能完成部分冲销，是否继续?';
    }
    top.$.messager.confirm('提示', confirm_info, function (r) {
        if (r) {
            var options = { visit: 'chargeroomfee', CompanyID: companyID, AddMan: AddMan, Fields: JSON.stringify(failedinfo), ChongDiChargeID: PreChargeID };
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: '../Handler/FeeCenterHandler.ashx',
                data: options,
                success: function (message) {
                    if (message.status) {
                        historyidlist = message.HistoryListID;
                        var fn = null;
                        var iframe = '';
                        if (printType == 1) {
                            iframe = "../PrintPage/printoffsetchargefeeall.aspx";
                            fn = function () {
                                $('#tt_table').datagrid('reload');
                            }
                        }
                        else if (printType == 2) {
                            iframe = "../PrintPage/printoffsetchargefee.aspx?IDs=" + JSON.stringify(historyidlist) + "&RoomIDs=" + JSON.stringify(RoomIDs);
                            fn = function () {
                                chargechongdiroomfee_done();
                            }
                        }
                        doOpenWin({
                            title: '打印冲抵收据',
                            url: iframe,
                            winParent: false,
                            width: '80%',
                            height: "90%",
                        }, fn);
                    }
                    else {
                        show_message('系统错误', 'error');
                    }
                }
            });
        }
    })
}
function chargebackprefee() {
    var idarry = parent.GetRoomIDList();
    if (idarry.length == 0) {
        show_message("请选择一个房间", "warning");
        return;
    }
    var roomids = JSON.stringify(idarry);
    var iframe = "../PrintPage/printchargebackprefee.aspx?RoomIDs=" + roomids + "&ChargeID=" + ChargeID;
    do_open_dialog('退预收款', iframe);
}
function sortby_rows(row) {
    var rows = $("#tt_table").datagrid("getSelections");
    var list = [];
    rows = rows.sort(function (a, b) {
        var a_starttime, b_starttime, a_format_starttime, b_format_starttime;
        a_format_starttime = formatTime(a.CalculateStartTime, row);
        if (a_format_starttime != '--') {
            a_starttime = stringToDate(a_format_starttime);
        }
        if (a.ImportFeeID > 0) {
            a_format_starttime = formatTime(a.WriteDate, row);
            if (a_format_starttime != '--') {
                a_starttime = stringToDate(a_format_starttime);
            }
        }
        b_format_starttime = formatTime(b.CalculateStartTime, row);
        if (b_format_starttime != '--') {
            b_starttime = stringToDate(b_format_starttime);
        }
        if (b.ImportFeeID > 0) {
            b_format_starttime = formatTime(b.WriteDate, row);
            if (b_format_starttime != '--') {
                b_starttime = stringToDate(b_format_starttime);
            }
        }
        if (a_starttime < b_starttime) return -1;
        if (a_starttime > b_starttime) return 1;
        return 0;
    });
    return rows;
}
function calculate_max_chargefee(row) {
    var usecount = calculateUseCount(row);
    var unitprice = calculateUnitPrice(row);
    var Cost = calculateCost(row, usecount, unitprice);
    row.ChargeFee = (row.ChargeFee > 0 ? row.ChargeFee : 0);
    var rest_balance = calculateRestBalance(row, false) + row.ChargeFee;
    if (Cost > rest_balance) {
        return rest_balance;
    }
    return Cost;
}
