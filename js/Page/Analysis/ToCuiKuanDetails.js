var his_CanLoad = false;
$(function () {
    loadParams();
    tdChargeStatus.combobox({
        editable: false,
        multiple: true,
        onChange: function () {
            var values = tdChargeStatus.combobox('getValues');
            hdChargeStatus.val(JSON.stringify(values));
        }
    });
    tdChargeStatus.combobox("setValues", []);
    setTimeout(function () {
        loadchargeHistoryBill();
    }, 1000);
})
function loadParams() {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '../Handler/AnalysisHandler.ashx?visit=getrealcostsearch',
        success: function (data) {
            tdChargeMan.combobox({
                editable: false,
                data: data.users,
                valueField: 'UserID',
                textField: 'RealName',
                multiple: true,
                onChange: function () {
                    var values = tdChargeMan.combobox('getValues');
                    hdChargeMan.val(JSON.stringify(values));
                }
            });
            tdChargeSummary.combobox({
                editable: false,
                data: data.summarys,
                valueField: 'ID',
                textField: 'Name',
                multiple: true,
                onChange: function () {
                    var values = tdChargeSummary.combobox('getValues');
                    hdChargeSummary.val(JSON.stringify(values));
                }
            });
            tdChargeType.combobox({
                editable: false,
                data: data.chargetypes,
                valueField: 'ChargeTypeID',
                textField: 'ChargeTypeName',
                multiple: true,
                onChange: function () {
                    var values = tdChargeType.combobox('getValues');
                    hdChargeType.val(JSON.stringify(values));
                }
            });
            tdCategory.combobox({
                editable: false,
                data: data.categories,
                valueField: 'ID',
                textField: 'Name',
                multiple: true,
                onChange: function () {
                    var values = tdCategory.combobox('getValues');
                    hdCategory.val(JSON.stringify(values));
                }
            });
        }
    });
}
function loadchargeHistoryBill() {
    var options = { visit: 'loadtablecolumn', pagecode: 'cuikuanfeehistory' };
    $.ajax({
        type: 'POST',
        dataType: 'json',
        // url: '../Handler/RoomResourceHandler.ashx',
        url: 'http://demo.saasyy.com/Handler/RoomResourceHandler.ashx',
        data: options,
        success: function (message) {

            // start
            message = { "status": true, "columns": "[[{field: 'ck', checkbox: true},{field: 'FinalRelationName', title: '业主名称', width: 100},{field: 'PrintNumber', formatter: formatPrintNumber, title: '收款单号', width: 100},{field: 'OneCardNumber', title: '一卡通号', width: 150},{field: 'RelationIDCard', title: '身份证号', width: 150},{field: 'ChargeStateDesc', title: '单据状态', width: 100},{field: 'ChargeName', title: '收费项目', width: 100},{field: 'ChargeMan', title: '收款人', width: 100},{field: 'ChargeTime', formatter: formatDateTime, title: '收款日期', width: 120},{field: 'RoomName', title: '房号', width: 100},{field: 'FullName', title: '资源位置', width: 260},{field: 'CategoryID', formatter: formatChargeTypeName, title: '费项分类', width: 80},{field: 'StartTime', formatter: formatTime, title: '计费开始日期', width: 80},{field: 'EndTime', formatter: formatTime, title: '计费结束日期', width: 80},{field: 'FormatUnitPrice', title: '单价', width: 80},{field: 'UseCount', formatter: formatDecimal, title: '面积/用量', width: 80},{field: 'FormatRealCost', formatter: formatRealCost, title: '实收金额', width: 80},{field: 'FormatSumRealCost', title: '实收合计', width: 80},{field: 'Discount', formatter: formatDecimal, title: '减免金额', width: 80},{field: 'StartPoint', formatter: formatDecimal, title: '上次读数', width: 80},{field: 'EndPoint', formatter: formatDecimal, title: '本次读数', width: 80},{field: 'TotalPoint', formatter: formatDecimal, title: '本次用量', width: 80},{field: 'Remark', title: '备注', width: 100},{field: 'RelatePhoneNumber', title: '联系方式', width: 100},{field: 'ChargeForMan', title: '代扣对象', width: 100},{field: 'BankAccountNo', title: '银行卡号', width: 100},{field: 'HomeAddress', title: '住址', width: 100},{field: 'BelongTeam', title: '部门', width: 100},{field: 'FormatFunctionCoefficient', title: '功能系数', width: 100}]]" };
            // end

            if (message.status) {
                his_CanLoad = false;
                var finalcolumn = [];


                finalcolumn = eval(message.columns);
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
                    onCheck: onCheck,
                    onUncheck: onUncheck,
                    pageSize: 100,
                    pageList: [100, 500],
                    showFooter: true,
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
                    columns: finalcolumn,
                    onLoadSuccess: onLoadSuccess,
                    toolbar: '#tb'
                });
                //SearchHis();
                return;
            }
            show_message('系统正忙，请稍候重试', 'error');
        }
    });
}
function SearchHis() {
    var options = get_options();
    if (!options) {
        return;
    }
    his_CanLoad = true;
    $("#his_table").datagrid("load", options);
}
function get_options() {
    var StartChargeTime = tdStartTime.datebox("getValue");
    var EndChargeTime = tdEndTime.datebox("getValue");
    if (StartChargeTime != '' && EndChargeTime != '') {
        if (stringToDate(StartChargeTime).valueOf() > stringToDate(EndChargeTime).valueOf()) {
            show_message('开始日期不能大于结束日期', 'warning');
            return null;
        }
    }
    var RoomID = [];
    var ProjectID = [];
    try {
        RoomID = parent.GetSelectedRooms();
        ProjectID = parent.GetSelectedProjects();
    } catch (e) {

    }
    var RelationBelongTeam = $('#tdRelationBelongTeam').textbox('getValue');
    var options = {
        "visit": "loadroomfeehistorylist",
        "RoomID": JSON.stringify(RoomID),
        "ProjectID": JSON.stringify(ProjectID),
        "StartChargeTime": StartChargeTime,
        "EndChargeTime": EndChargeTime,
        "CompanyID": CompanyID,
        "ChargeMans": JSON.stringify(tdChargeMan.combobox("getValues")),
        "ChargeSummarys": JSON.stringify(tdChargeSummary.combobox("getValues")),
        "ChargeTypes": JSON.stringify(tdChargeType.combobox("getValues")),
        "Categories": JSON.stringify(tdCategory.combobox("getValues")),
        "IncludeFooter": true,
        "IsCuiShou": true,
        "ChargeStatus": JSON.stringify(tdChargeStatus.combobox("getValues")),
        "RelationBelongTeam": RelationBelongTeam,
        "source": "ToCuiKuanDetails"
    };
    return options;
}
function do_export() {
    var options = get_options();
    if (options == null) {
        return;
    }
    options.canexport = true;
    options.page = 1;
    options.rows = 10;
    MaskUtil.mask('body', '导出中');
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '../Handler/FeeCenterHandler.ashx',
        data: options,
        success: function (data) {
            MaskUtil.unmask();
            if (data.downloadurl) {
                window.location.href = data.downloadurl;
                return;
            }
            if (data.error) {
                show_message(data.error, 'warning');
                return;
            }
            show_message('系统异常', 'error');
        }
    });
}
function do_export_daikou() {
    var options = get_options();
    if (options == null) {
        return;
    }
    options.canexport = true;
    options.page = 1;
    options.rows = 10;
    options.source = "ToCuiKuanDetailsDaiKou";
    MaskUtil.mask('body', '导出中');
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '../Handler/FeeCenterHandler.ashx',
        data: options,
        success: function (data) {
            MaskUtil.unmask();
            if (data.downloadurl) {
                window.location.href = data.downloadurl;
                return;
            }
            if (data.error) {
                show_message(data.error, 'warning');
                return;
            }
            show_message('系统异常', 'error');
        }
    });
}
//列设置
function openTableSetUp() {
    var iframe = "../SysSeting/TableSetUp.aspx?PageCode=cuikuanfeehistory";
    doOpenWin({
        title: '催收单列表设置',
        url: iframe,
        winParent: false,
        width: '80%',
        height: "80%",
    }, function () {
        $("#tt_table").datagrid("reload");
    });

}
function formatChargeTypeName(value, row) {
    if (Number(row.CategoryID) < 0) {
        return "";
    }
    if (row.CategoryID == 1) {
        return "收入";
    }
    if (row.CategoryID == 2) {
        return "代收";
    }
    if (row.CategoryID == 3) {
        return "押金";
    }
    if (row.CategoryID = 4) {
        return "预收";
    }
}
//function formatPrintNumber(value, row) {
//    return value;
//}
function formatDecimal(value, row) {
    if (value < 0) {
        return 0;
    }
    return value;
}
function formatRealCost(value, row) {
    if (Number(row.ChargeState) == 3) {
        return "-" + value;
    }
    if (value < 0) {
        return 0;
    }
    return value;
}
function formatPrintRealCost(value, row) {
    if (Number(row.ChargeState) == 3) {
        return "-" + value;
    }
    if (value < 0) {
        return 0;
    }
    return value;
}
function doChargeRoomFee() {
    var rows = $('#his_table').datagrid("getSelections");
    if (rows.length == 0) {
        show_message('请选择一条数据，操作取消', 'warning');
        return;
    }
    var IDList = [];
    var isCancel = false;
    var isCharge = false;
    $.each(rows, function (index, row) {
        if (row.ChargeState == 2) {
            isCancel = true;
            return false;
        }
        if (row.ChargeState == 1 || row.ChargeState == 4) {
            isCharge = true;
            return false;
        }
    });
    if (isCancel) {
        show_message('费项已作废单据,禁止收费', 'warning');
        return;
    }
    if (isCharge) {
        show_message('费项已收费,不能重复收费', 'warning');
        return;
    }
    var iframe = "../Analysis/ChargeCuiShou.aspx";
    doOpenWin({
        title: '确认收费',
        url: iframe,
        winParent: false,
        width: '80%',
        height: "80%",
    }, function () {
        $("#tt_table").datagrid("reload");
    });

}
function ReChargeRoomFee() {
    var rows = $('#his_table').datagrid("getSelections");
    if (rows.length == 0) {
        show_message('请选择一条数据，操作取消', 'warning');
        return;
    }
    var IDList = [];
    var isCancel = false;
    $.each(rows, function (index, row) {
        if (row.ChargeState != 1) {
            isCancel = true;
            return false;
        }
        IDList.push(row.HistoryID);
    });
    if (isCancel) {
        show_message('选中的单据包含未收费项', 'warning');
        return;
    }
    top.$.messager.confirm('提示', '确认重新收费', function (r) {
        if (r) {
            MaskUtil.mask('body', '提交中');
            var options = { visit: 're_confirmechargeroomfee', IDs: JSON.stringify(IDList) };
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: '../Handler/FeeCenterHandler.ashx',
                data: options,
                success: function (data) {
                    MaskUtil.unmask();
                    if (data.status) {
                        show_message('重新收费成功', 'success');
                        $('#his_table').datagrid("reload");
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
    })
}
function doCancelRoomFee() {
    var rows = $('#his_table').datagrid("getSelections");
    if (rows.length == 0) {
        show_message('请选择一条数据，操作取消', 'warning');
        return;
    }
    var IDList = [];
    var isCancel = false;
    $.each(rows, function (index, row) {
        if (row.ChargeState == 2) {
            isCancel = true;
            return false;
        }
        IDList.push(row.HistoryID);
    });
    if (isCancel) {
        show_message('不能重复作废单据', 'warning');
        return;
    }
    top.$.messager.confirm('提示', '确认作废', function (r) {
        if (r) {
            MaskUtil.mask('body', '提交中');
            var options = { visit: 'cancelhistoryfee', IDList: JSON.stringify(IDList), AddMan: AddMan };
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: '../Handler/FeeCenterHandler.ashx',
                data: options,
                success: function (data) {
                    MaskUtil.unmask();
                    if (data.status) {
                        show_message('作废成功', 'success');
                        $('#his_table').datagrid("reload");
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
    })
}
function GetSelectedPrintIDList() {
    var IDList = [];
    var rows = $('#his_table').datagrid("getSelections");
    if (rows.length > 0) {
        $.each(rows, function (index, row) {
            IDList.push(row.PrintID);
        });
    }
    return IDList;
}