var gua_CanLoad = false;
$(function () {
    $(document).click(function (e) {
        var target = $(e.target);
        if (target.closest(".datagrid-btable,.calendar-noborder").length == 0) {
            endGuEditing();
        }
    });
    loadguaranteechargeList();
})
function loadguaranteechargeList() {
    $('#gua_table').datagrid({
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
        onClickRow: onClickGuaRow,
        onDblClickRow: onDblClickGuaRow,
        striped: true,
        pageSize: global_variable.pageSize,
        pageList: global_variable.pageList,
        onBeforeLoad: function (data) {
            if (!gua_CanLoad) {
                $('#gua_table').datagrid("loadData", {
                    total: 0,
                    rows: []
                });
            }
            return gua_CanLoad;
        },
        onLoadError: function (data) {
            //alert("有错");
            $('#gua_table').datagrid("loadData", {
                total: 0,
                rows: []
            });
        },
        columns: [[
            { field: 'ck', checkbox: true },
            { field: 'RoomName', title: '资源编号', width: 60 },
            { field: 'ChargeName', title: '收费项目', width: 100 },
            { field: 'ChargeStateDesc', title: '收费状态', width: 100 },
            { field: 'StartTime', formatter: formatStartTime, title: '计费开始日期', width: 100 },
            { field: 'EndTime', formatter: formatEndTime, title: '计费结束日期', width: 100 },
            { field: 'RealCost', title: '实收金额', width: 60 },
            { field: 'BackCost', formatter: formatBackCost, title: '实退金额', width: 60 },
            { field: 'UnPayCost', formatter: formatUnPayCost, editor: { type: 'numberbox', options: { precision: 2 } }, title: '本次退还', width: 60 },
            { field: 'Remark', editor: 'textbox', title: '备注', width: 100 }
        ]],
        toolbar: '#tt_mm'
    });
    SearchGua(3)
}
function formatBackCost(value, row) {
    return calculateBackCost(row);
}
function calculateBackCost(row) {
    if (parseFloat(row.BackCost) > 0) {
        return row.BackCost;
    }
    return 0;
}
function calculateRestCost(row) {
    var backcost = calculateBackCost(row);
    var restcost = parseFloat(row.RealCost) - parseFloat(backcost);
    if (restcost > 0) {
        return restcost;
    }
    return 0;
}
function formatUnPayCost(value, row) {
    return calculateUnPayCost(row);
}
function calculateUnPayCost(row) {
    var restcost = calculateRestCost(row);
    if (restcost - parseFloat(row.UnPayCost) > 0) {
        return row.UnPayCost;
    }
    return restcost;
}
function SearchGua(CategoryID) {
    var idarry = parent.GetRoomIDList();
    if (idarry.length == 0) {
        //show_message("请选择一个房间", "info");
        return;
    }
    if (idarry.length > 1) {
        //show_message("请选择单个房间进行操作", "info");
        return;
    }
    gua_CanLoad = true;
    $("#gua_table").datagrid("load", {
        "visit": "loadguaranteefeelist",
        "RoomID": JSON.stringify(idarry),
        "CategoryID": CategoryID
    });
}
var gua_editIndex = undefined;
function endGuEditing() {
    if (gua_editIndex == undefined) {
        return true;
    }
    $('#gua_table').datagrid('endEdit', gua_editIndex);
    gua_editIndex = undefined;
    return true;
}
function onDblClickGuaRow(index, row) {
    if (row.ChargeState != 1) {
        return;
    }
    var restcost = calculateRestCost(row);
    if (restcost <= 0) {
        return;
    }
    if (endGuEditing()) {
        editGuaRoomFee(row);
        gua_editIndex = index;
    } else {
        setTimeout(function () {
            $('#gua_table').datagrid('selectRow', gua_editIndex);
        }, 100);
    }
}
function onClickGuaRow(index, row) {
    if (gua_editIndex != index) {
        endGuEditing();
        return;
    }
    setTimeout(function () {
        $('#gua_table').datagrid('selectRow', index);
    }, 100);
}
function editGuaRoomFee(row) {
    var rowIndex = $('#gua_table').datagrid('getRowIndex', row);
    $('#gua_table').datagrid('selectRow', rowIndex).datagrid('beginEdit', rowIndex);
}
function chargeBackGuaranteeFee() {
    endGuEditing();
    var rows = $('#gua_table').datagrid("getSelections");
    var canBack = true;
    var isAllBack = false;
    if (rows.length == 0) {
        show_message('请选择一条数据，操作取消', 'warning');
        return;
    }
    var HistoryIDList = [];
    var PrintIDList = [];
    var RealPayList = [];
    var RemarkList = "";
    var values = [];
    $.each(rows, function (index, row) {
        if (row.ChargeState != 1) {
            canBack = false;
            return false;
        }
        row.UnPayCost = calculateUnPayCost(row);
        values.push({ HistoryID: row.HistoryID, PrintID: row.PrintID, RealPay: row.UnPayCost, Remark: row.Remark })
    });
    if (!canBack) {
        show_message("选中的列表中包含未收费的收费项目,退保证金取消", "info");
        return;
    }
    if (isAllBack) {
        show_message("退还金额不能大于实收金额", "info");
        return;
    }
    //if (PrintIDList.length > 1) {
    //    show_message("请选择同一个单号退保证金", "info");
    //    return;
    //}
    var options = { visit: 'savechargebackguarantee', values: JSON.stringify(values) };
    $.ajax({
        type: 'POST',
        dataType: 'html',
        url: '../Handler/TempProcessHandler.ashx',
        data: options,
        success: function (guid) {
            var iframe = "../PrintPage/printchargebackguaranteefee.aspx?guid=" + guid;
            do_open_dialog('退保证金', iframe);
        }
    });
}
function chargeBackGuaranteeFee_done() {
    $('#gua_table').datagrid("reload");
    parent.GetBalance(0);
}
