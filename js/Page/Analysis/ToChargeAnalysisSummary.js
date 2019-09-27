var fee_CanLoad = false;
var type_CanLoad = false;
$(function () {
    loadParams();
    setTimeout(function () {
        loadFeedg();
    }, 1000);
})
function loadParams() {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '../Handler/AnalysisHandler.ashx?visit=gettochargesearch',
        success: function (data) {
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
        }
    });
}
function loadFeedg() {
    $('#fee_table').datagrid({
        // url: '../Handler/AnalysisHandler.ashx',
        url: 'http://demo.saasyy.com/Handler/AnalysisHandler.ashx',
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
        showFooter: true,
        pageSize: global_variable.pageSize,
        pageList: global_variable.pageList,
        onBeforeLoad: function (data) {
            if (!fee_CanLoad) {
                $('#fee_table').datagrid("loadData", {
                    total: 0,
                    rows: []
                });
            }
            return fee_CanLoad;
        },
        onLoadError: function (data) {
            //alert("有错");
            $('#fee_table').datagrid("loadData", {
                total: 0,
                rows: []
            });
        },
        columns: [[
            { field: 'Name', title: '收费项目', width: 200 },
            { field: 'FormatTotalCost', title: '应收金额', width: 100 },
            { field: 'FormatPayCost', title: '已收金额', width: 100 },
            { field: 'FormatRestCost', title: '应收欠费', width: 100 },
        ]],
        toolbar: '#tbfee'
    });
    SearchFee();
}
function SearchFee() {
    var options = get_options();
    if (options == null) {
        return;
    }
    fee_CanLoad = true;
    $("#fee_table").datagrid("load", options);
}
function get_options() {
    var StartTime = tdStartTime.datebox("getValue");
    var EndTime = tdEndTime.datebox("getValue");
    if (StartTime != '' && EndTime != '') {
        if (stringToDate(StartTime).valueOf() > stringToDate(EndTime).valueOf()) {
            show_message('开始日期不能大于结束日期', 'warning');
            return null;
        }
    }
    var RoomID = parent.GetSelectedRooms();
    var ProjectID = parent.GetSelectedProjects();
    if (RoomID.length == 0 && ProjectID.length == 0) {
        return null;
    }
    var ChargeSummarys = tdChargeSummary.combobox("getValues");
    var options = {
        "visit": "loadtochargesummarybychargenamev2",
        "RoomID": JSON.stringify(RoomID),
        "ProjectID": JSON.stringify(ProjectID),
        "StartTime": StartTime,
        "EndTime": EndTime,
        "CompanyID": CompanyID,
        "ChargeSummarys": JSON.stringify(ChargeSummarys)
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
        url: '../Handler/AnalysisHandler.ashx',
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