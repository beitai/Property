var tt_CanLoad = false;
$(function () {
    loadFeeType();
    $(document).click(function (e) {
        var target = $(e.target);
        if (target.closest(".datagrid-btable,.calendar-noborder").length == 0) {
            endTTEditing();
        }
    });
});
function loadTT(auto_search) {
    tt_CanLoad = false;
    var ChargeID = FeeType.combobox("getValue");
    var options = { visit: 'loadtablecolumn', pagecode: 'roomfeesource', ChargeID: ChargeID };
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: 'http://demo.saasyy.com/Handler/RoomResourceHandler.ashx',
        data: options,
        success: function (message) {

            message = {"status":true,"columns":"[[{field: 'ck', checkbox: true},{field: 'FullName', title: '房源信息', width: 260},{field: 'ImportBiaoCategory', editor:{type:'textbox'},title: '表种类', width: 80},{field: 'Name', title: '房间号', width: 80},{field: 'ImportBiaoName', editor:{type:'textbox'},title: '表名称', width: 80},{field: 'ChargeID',formatter:function(value,row){                            \r\n\t\t\t\t\t\t\treturn row.ChargeName;\r\n\t\t\t\t\t\t},editor:{\r\n\t\t\t\t\t\t\ttype:'combobox',\r\n\t\t\t\t\t\t\toptions:{\r\n\t\t\t\t\t\t\t\tvalueField:'ID',\r\n\t\t\t\t\t\t\t\ttextField:'Name',\r\n                            data:ChargeSummaryList\r\n                    },onSelect: function(record){\r\n                           var value = $(this).combobox('getValue');\r\n                    }},title: '收费项目', width: 100},{field: 'StartPoint',editor:{type:'numberbox',options:{precision:2}}, title: '上次读数', width: 80},{field: 'EndPoint',editor:{type:'numberbox',options:{precision:2}}, title: '本次读数', width: 80},{field: 'RealTotalPoint',editor:{type:'numberbox',options:{precision:2}}, title: '用量', width: 80},{field: 'ImportRate', title: '倍率', formatter: formatImportRate, editor:{type:'textbox'}, width: 100},{field: 'FinalUnitPrice',formatter: formatUnitPrice,editor:{type:'numberbox',options:{precision:4}}, title: '单价', width: 80},{field: 'FinalImportCoefficient',editor:{type:'numberbox',options:{precision:4}}, title: '系数', width: 80},{field: 'FinalTotalPrice',editor:{type:'numberbox',options:{precision:2}}, title: '金额', width: 80},{field: 'StatusDesc', title: '收费状态', width: 80},{field: 'WriteDate',formatter: formatTime,editor:{type:'datebox'}, title: '账单日期', width: 100},{field: 'StartTime',formatter: formatTime,editor:{type:'datebox'}, title: '计费开始日期', width: 100},{field: 'EndTime',formatter: formatTime,editor:{type:'datebox'}, title: '计费结束日期', width: 100},{field: 'ChargeMan', title: '收款人', width: 100},{field: 'ChargeTime', formatter: formatDateTime, title: '收款日期', width: 120},{field: 'Remark', title: '备注', width: 100},{field: 'PrintNumber', title: '收款单号', width: 150},{field: 'RelationName', title: '默认联系人', width: 100},{field: 'AddTime', formatter: formatDateTime, title: '添加时间', width: 120},{field: 'ImportChargeRoomNo', title: '缴费户号', width: 100}]]"}

            if (message.status) {
                var finalcolumn = [];
                finalcolumn = eval(message.columns);
                //加载
                $('#tt_table').datagrid({
                    // url: 'http://demo.saasyy.com/Handler/ImportFeeHandler.ashx',
                    url: 'http://demo.saasyy.com/Handler/ImportFeeHandler.ashx',
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
                    onClickRow: onClickTTRow,
                    onDblClickCell: onDblClickCell,
                    columns: finalcolumn,
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
                if (auto_search) {
                    SearchTT();
                }
                return;
            }
            show_message('系统错误', 'error');
        }
    });
}
function loadFeeType() {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: 'http://demo.saasyy.com/Handler/FeeCenterHandler.ashx?visit=getchargesummarylist&CompanyID=' + CompanyID + '&IsAllowImport=true',
        success: function (data) {
            
            data = [{"ChargeTypeDesc":"","EndTypeDesc":"按计费开始日期","EndNumberDesc":"四舍五入","FeeTypeDesc":"临时费用","ID":736,"Name":"测试用物业费","AddTime":"2019-07-13T12:00:24.64","CompanyID":1,"FeeType":4,"TypeID":0,"OrderBy":0,"CategoryID":33,"RuleID":1,"EndTypeID":2,"EndNumber":3,"SummaryUnitPrice":1.0000,"Unit":"","Coefficient":-79228162514264337593543950335.0,"Remark":"","IsReading":false,"EndNumberCount":0,"IsAllowImport":true,"SummaryStartTime":"0001-01-01T00:00:00","SummaryEndStartTime":"0001-01-01T00:00:00","SummaryChargeTypeCount":1,"EndNumberType":1,"AutoToMonthEnd":true,"BiaoCategory":"","BiaoName":"","TimeAuto":true,"IsOrderFeeOn":true,"WeiYuePercent":0.0000,"RelateCharges":"","ChargeWeiYueType":1,"DayGunLi":false,"WeiYueStartDate":"starttime","WeiYueBefore":"before","WeiYueDays":0,"CalculateAreaType":"","WeiYueActiveStartDate":"starttime","WeiYueActiveBeforeAfter":"before","WeiYueActiveCount":0,"WeiYueActiveDayMonth":"day","WeiYueEndDate":"currentdate","StartPriceRange":false,"DisableDefaultImportFee":false,"PriceRangeStartTime":"0001-01-01T00:00:00","ChargeFeeType":1,"IsNew":false,"IsDirty":false,"IsDeleted":false,"IsValid":true,"ValidationErrors":[],"JsonIgnoreFields":null,"IsSaveRequired":false},{"ChargeTypeDesc":"定额(月度)","EndTypeDesc":"","EndNumberDesc":"四舍五入","FeeTypeDesc":"临时费用","ID":737,"Name":"测试空调费","AddTime":"2019-07-13T12:10:30.923","CompanyID":1,"FeeType":4,"TypeID":2,"OrderBy":0,"CategoryID":33,"RuleID":1,"EndTypeID":0,"EndNumber":3,"SummaryUnitPrice":2.5000,"Unit":"","Coefficient":-79228162514264337593543950335.0,"Remark":"","IsReading":false,"EndNumberCount":0,"IsAllowImport":true,"SummaryStartTime":"0001-01-01T00:00:00","SummaryEndStartTime":"0001-01-01T00:00:00","SummaryChargeTypeCount":0,"EndNumberType":1,"AutoToMonthEnd":true,"BiaoCategory":"","BiaoName":"","TimeAuto":true,"IsOrderFeeOn":true,"WeiYuePercent":0.0000,"RelateCharges":"","ChargeWeiYueType":1,"DayGunLi":false,"WeiYueStartDate":"starttime","WeiYueBefore":"before","WeiYueDays":0,"CalculateAreaType":"jifei","WeiYueActiveStartDate":"starttime","WeiYueActiveBeforeAfter":"before","WeiYueActiveCount":0,"WeiYueActiveDayMonth":"day","WeiYueEndDate":"currentdate","StartPriceRange":false,"DisableDefaultImportFee":false,"PriceRangeStartTime":"0001-01-01T00:00:00","ChargeFeeType":0,"IsNew":false,"IsDirty":false,"IsDeleted":false,"IsValid":true,"ValidationErrors":[],"JsonIgnoreFields":null,"IsSaveRequired":false},{"ChargeTypeDesc":"","EndTypeDesc":"","EndNumberDesc":"四舍五入","FeeTypeDesc":"临时费用","ID":738,"Name":"预收水电三百","AddTime":"2019-07-15T09:01:01.127","CompanyID":1,"FeeType":4,"TypeID":0,"OrderBy":0,"CategoryID":4,"RuleID":1,"EndTypeID":0,"EndNumber":3,"SummaryUnitPrice":300.0000,"Unit":"","Coefficient":-79228162514264337593543950335.0,"Remark":"","IsReading":false,"EndNumberCount":0,"IsAllowImport":true,"SummaryStartTime":"0001-01-01T00:00:00","SummaryEndStartTime":"0001-01-01T00:00:00","SummaryChargeTypeCount":0,"EndNumberType":1,"AutoToMonthEnd":true,"BiaoCategory":"","BiaoName":"","TimeAuto":false,"IsOrderFeeOn":true,"WeiYuePercent":0.0000,"RelateCharges":"","ChargeWeiYueType":1,"DayGunLi":false,"WeiYueStartDate":"starttime","WeiYueBefore":"before","WeiYueDays":0,"CalculateAreaType":"","WeiYueActiveStartDate":"starttime","WeiYueActiveBeforeAfter":"before","WeiYueActiveCount":0,"WeiYueActiveDayMonth":"day","WeiYueEndDate":"currentdate","StartPriceRange":false,"DisableDefaultImportFee":false,"PriceRangeStartTime":"0001-01-01T00:00:00","ChargeFeeType":0,"IsNew":false,"IsDirty":false,"IsDeleted":false,"IsValid":true,"ValidationErrors":[],"JsonIgnoreFields":null,"IsSaveRequired":false},{"ChargeTypeDesc":"单价*计费面积/用量(一次性)","EndTypeDesc":"按当前自然日期","EndNumberDesc":"四舍五入","FeeTypeDesc":"临时费用","ID":743,"Name":"自来水费","AddTime":"2019-07-16T15:21:11.33","CompanyID":1,"FeeType":4,"TypeID":6,"OrderBy":0,"CategoryID":2,"RuleID":1,"EndTypeID":1,"EndNumber":3,"SummaryUnitPrice":3.3000,"Unit":"","Coefficient":-79228162514264337593543950335.0,"Remark":"","IsReading":true,"EndNumberCount":0,"IsAllowImport":true,"SummaryStartTime":"0001-01-01T00:00:00","SummaryEndStartTime":"0001-01-01T00:00:00","SummaryChargeTypeCount":0,"EndNumberType":1,"AutoToMonthEnd":true,"BiaoCategory":"水表","BiaoName":"","TimeAuto":true,"IsOrderFeeOn":true,"WeiYuePercent":0.0000,"RelateCharges":"","ChargeWeiYueType":1,"DayGunLi":false,"WeiYueStartDate":"starttime","WeiYueBefore":"before","WeiYueDays":0,"CalculateAreaType":"","WeiYueActiveStartDate":"starttime","WeiYueActiveBeforeAfter":"before","WeiYueActiveCount":0,"WeiYueActiveDayMonth":"day","WeiYueEndDate":"currentdate","StartPriceRange":false,"DisableDefaultImportFee":false,"PriceRangeStartTime":"0001-01-01T00:00:00","ChargeFeeType":0,"IsNew":false,"IsDirty":false,"IsDeleted":false,"IsValid":true,"ValidationErrors":[],"JsonIgnoreFields":null,"IsSaveRequired":false},{"ChargeTypeDesc":"单价*计费面积/用量(一次性)","EndTypeDesc":"","EndNumberDesc":"四舍五入","FeeTypeDesc":"临时费用","ID":745,"Name":"买房居民自来水费","AddTime":"2019-07-16T16:46:00.253","CompanyID":1,"FeeType":4,"TypeID":6,"OrderBy":0,"CategoryID":2,"RuleID":1,"EndTypeID":0,"EndNumber":3,"SummaryUnitPrice":3.8000,"Unit":"","Coefficient":-79228162514264337593543950335.0,"Remark":"","IsReading":true,"EndNumberCount":0,"IsAllowImport":true,"SummaryStartTime":"0001-01-01T00:00:00","SummaryEndStartTime":"0001-01-01T00:00:00","SummaryChargeTypeCount":0,"EndNumberType":1,"AutoToMonthEnd":true,"BiaoCategory":"水表","BiaoName":"","TimeAuto":false,"IsOrderFeeOn":true,"WeiYuePercent":0.0000,"RelateCharges":"","ChargeWeiYueType":1,"DayGunLi":false,"WeiYueStartDate":"starttime","WeiYueBefore":"before","WeiYueDays":0,"CalculateAreaType":"","WeiYueActiveStartDate":"starttime","WeiYueActiveBeforeAfter":"before","WeiYueActiveCount":0,"WeiYueActiveDayMonth":"day","WeiYueEndDate":"currentdate","StartPriceRange":false,"DisableDefaultImportFee":false,"PriceRangeStartTime":"0001-01-01T00:00:00","ChargeFeeType":0,"IsNew":false,"IsDirty":false,"IsDeleted":false,"IsValid":true,"ValidationErrors":[],"JsonIgnoreFields":null,"IsSaveRequired":false},{"ChargeTypeDesc":"","EndTypeDesc":"","EndNumberDesc":"四舍五入","FeeTypeDesc":"临时费用","ID":746,"Name":"本村居民自来水费","AddTime":"2019-07-17T11:57:29.72","CompanyID":1,"FeeType":4,"TypeID":0,"OrderBy":0,"CategoryID":2,"RuleID":1,"EndTypeID":0,"EndNumber":3,"SummaryUnitPrice":3.5000,"Unit":"","Coefficient":-79228162514264337593543950335.0,"Remark":"","IsReading":true,"EndNumberCount":0,"IsAllowImport":true,"SummaryStartTime":"0001-01-01T00:00:00","SummaryEndStartTime":"0001-01-01T00:00:00","SummaryChargeTypeCount":0,"EndNumberType":1,"AutoToMonthEnd":true,"BiaoCategory":"水表","BiaoName":"","TimeAuto":false,"IsOrderFeeOn":true,"WeiYuePercent":0.0000,"RelateCharges":"","ChargeWeiYueType":1,"DayGunLi":false,"WeiYueStartDate":"starttime","WeiYueBefore":"before","WeiYueDays":0,"CalculateAreaType":"","WeiYueActiveStartDate":"starttime","WeiYueActiveBeforeAfter":"before","WeiYueActiveCount":0,"WeiYueActiveDayMonth":"day","WeiYueEndDate":"currentdate","StartPriceRange":false,"DisableDefaultImportFee":false,"PriceRangeStartTime":"0001-01-01T00:00:00","ChargeFeeType":0,"IsNew":false,"IsDirty":false,"IsDeleted":false,"IsValid":true,"ValidationErrors":[],"JsonIgnoreFields":null,"IsSaveRequired":false},{"ChargeTypeDesc":"","EndTypeDesc":"","EndNumberDesc":"四舍五入","FeeTypeDesc":"临时费用","ID":748,"Name":"本村自来水费","AddTime":"2019-07-18T16:04:25.67","CompanyID":1,"FeeType":4,"TypeID":0,"OrderBy":0,"CategoryID":1,"RuleID":1,"EndTypeID":0,"EndNumber":3,"SummaryUnitPrice":3.3000,"Unit":"方","Coefficient":-79228162514264337593543950335.0,"Remark":"","IsReading":true,"EndNumberCount":0,"IsAllowImport":true,"SummaryStartTime":"0001-01-01T00:00:00","SummaryEndStartTime":"0001-01-01T00:00:00","SummaryChargeTypeCount":3,"EndNumberType":1,"AutoToMonthEnd":true,"BiaoCategory":"水表","BiaoName":"","TimeAuto":false,"IsOrderFeeOn":true,"WeiYuePercent":0.0000,"RelateCharges":"","ChargeWeiYueType":1,"DayGunLi":false,"WeiYueStartDate":"starttime","WeiYueBefore":"before","WeiYueDays":0,"CalculateAreaType":"","WeiYueActiveStartDate":"starttime","WeiYueActiveBeforeAfter":"before","WeiYueActiveCount":0,"WeiYueActiveDayMonth":"day","WeiYueEndDate":"currentdate","StartPriceRange":false,"DisableDefaultImportFee":false,"PriceRangeStartTime":"0001-01-01T00:00:00","ChargeFeeType":1,"IsNew":false,"IsDirty":false,"IsDeleted":false,"IsValid":true,"ValidationErrors":[],"JsonIgnoreFields":null,"IsSaveRequired":false},{"ChargeTypeDesc":"","EndTypeDesc":"","EndNumberDesc":"四舍五入","FeeTypeDesc":"临时费用","ID":750,"Name":"电梯卡费","AddTime":"2019-07-18T17:26:54.743","CompanyID":1,"FeeType":4,"TypeID":0,"OrderBy":0,"CategoryID":1,"RuleID":1,"EndTypeID":0,"EndNumber":3,"SummaryUnitPrice":0.0000,"Unit":"","Coefficient":-79228162514264337593543950335.0,"Remark":"","IsReading":false,"EndNumberCount":0,"IsAllowImport":true,"SummaryStartTime":"0001-01-01T00:00:00","SummaryEndStartTime":"0001-01-01T00:00:00","SummaryChargeTypeCount":0,"EndNumberType":1,"AutoToMonthEnd":true,"BiaoCategory":"","BiaoName":"","TimeAuto":false,"IsOrderFeeOn":true,"WeiYuePercent":0.0000,"RelateCharges":"","ChargeWeiYueType":1,"DayGunLi":false,"WeiYueStartDate":"starttime","WeiYueBefore":"before","WeiYueDays":0,"CalculateAreaType":"","WeiYueActiveStartDate":"starttime","WeiYueActiveBeforeAfter":"before","WeiYueActiveCount":0,"WeiYueActiveDayMonth":"day","WeiYueEndDate":"currentdate","StartPriceRange":false,"DisableDefaultImportFee":false,"PriceRangeStartTime":"0001-01-01T00:00:00","ChargeFeeType":0,"IsNew":false,"IsDirty":false,"IsDeleted":false,"IsValid":true,"ValidationErrors":[],"JsonIgnoreFields":null,"IsSaveRequired":false},{"ChargeTypeDesc":"","EndTypeDesc":"","EndNumberDesc":"四舍五入","FeeTypeDesc":"临时费用","ID":751,"Name":"租房押金","AddTime":"2019-07-19T09:45:53.46","CompanyID":1,"FeeType":4,"TypeID":0,"OrderBy":0,"CategoryID":3,"RuleID":1,"EndTypeID":0,"EndNumber":3,"SummaryUnitPrice":0.0000,"Unit":"","Coefficient":-79228162514264337593543950335.0,"Remark":"","IsReading":false,"EndNumberCount":0,"IsAllowImport":true,"SummaryStartTime":"0001-01-01T00:00:00","SummaryEndStartTime":"0001-01-01T00:00:00","SummaryChargeTypeCount":0,"EndNumberType":1,"AutoToMonthEnd":true,"BiaoCategory":"","BiaoName":"","TimeAuto":false,"IsOrderFeeOn":true,"WeiYuePercent":0.0000,"RelateCharges":"","ChargeWeiYueType":1,"DayGunLi":false,"WeiYueStartDate":"starttime","WeiYueBefore":"before","WeiYueDays":0,"CalculateAreaType":"","WeiYueActiveStartDate":"starttime","WeiYueActiveBeforeAfter":"before","WeiYueActiveCount":0,"WeiYueActiveDayMonth":"day","WeiYueEndDate":"currentdate","StartPriceRange":false,"DisableDefaultImportFee":false,"PriceRangeStartTime":"0001-01-01T00:00:00","ChargeFeeType":0,"IsNew":false,"IsDirty":false,"IsDeleted":false,"IsValid":true,"ValidationErrors":[],"JsonIgnoreFields":null,"IsSaveRequired":false},{"ChargeTypeDesc":"单价*计费面积/用量(一次性)","EndTypeDesc":"","EndNumberDesc":"四舍五入","FeeTypeDesc":"临时费用","ID":753,"Name":"补交押金","AddTime":"2019-07-19T16:36:54.323","CompanyID":1,"FeeType":4,"TypeID":6,"OrderBy":0,"CategoryID":3,"RuleID":1,"EndTypeID":0,"EndNumber":3,"SummaryUnitPrice":0.0000,"Unit":"","Coefficient":-79228162514264337593543950335.0,"Remark":"","IsReading":false,"EndNumberCount":0,"IsAllowImport":true,"SummaryStartTime":"0001-01-01T00:00:00","SummaryEndStartTime":"0001-01-01T00:00:00","SummaryChargeTypeCount":0,"EndNumberType":1,"AutoToMonthEnd":true,"BiaoCategory":"","BiaoName":"","TimeAuto":false,"IsOrderFeeOn":true,"WeiYuePercent":0.0000,"RelateCharges":"","ChargeWeiYueType":1,"DayGunLi":false,"WeiYueStartDate":"starttime","WeiYueBefore":"before","WeiYueDays":0,"CalculateAreaType":"","WeiYueActiveStartDate":"starttime","WeiYueActiveBeforeAfter":"before","WeiYueActiveCount":0,"WeiYueActiveDayMonth":"day","WeiYueEndDate":"currentdate","StartPriceRange":false,"DisableDefaultImportFee":false,"PriceRangeStartTime":"0001-01-01T00:00:00","ChargeFeeType":0,"IsNew":false,"IsDirty":false,"IsDeleted":false,"IsValid":true,"ValidationErrors":[],"JsonIgnoreFields":null,"IsSaveRequired":false},{"ChargeTypeDesc":"单价*计费面积/用量(一次性)","EndTypeDesc":"","EndNumberDesc":"四舍五入","FeeTypeDesc":"临时费用","ID":756,"Name":"服务费","AddTime":"2019-07-19T17:35:54.173","CompanyID":1,"FeeType":4,"TypeID":6,"OrderBy":0,"CategoryID":2,"RuleID":1,"EndTypeID":0,"EndNumber":3,"SummaryUnitPrice":0.3600,"Unit":"","Coefficient":-79228162514264337593543950335.0,"Remark":"","IsReading":true,"EndNumberCount":0,"IsAllowImport":true,"SummaryStartTime":"0001-01-01T00:00:00","SummaryEndStartTime":"0001-01-01T00:00:00","SummaryChargeTypeCount":0,"EndNumberType":1,"AutoToMonthEnd":true,"BiaoCategory":"电表","BiaoName":"","TimeAuto":false,"IsOrderFeeOn":true,"WeiYuePercent":0.0000,"RelateCharges":"","ChargeWeiYueType":1,"DayGunLi":false,"WeiYueStartDate":"starttime","WeiYueBefore":"before","WeiYueDays":0,"CalculateAreaType":"","WeiYueActiveStartDate":"starttime","WeiYueActiveBeforeAfter":"before","WeiYueActiveCount":0,"WeiYueActiveDayMonth":"day","WeiYueEndDate":"currentdate","StartPriceRange":false,"DisableDefaultImportFee":false,"PriceRangeStartTime":"0001-01-01T00:00:00","ChargeFeeType":0,"IsNew":false,"IsDirty":false,"IsDeleted":false,"IsValid":true,"ValidationErrors":[],"JsonIgnoreFields":null,"IsSaveRequired":false},{"ChargeTypeDesc":"单价*计费面积/用量(一次性)","EndTypeDesc":"按当前自然日期","EndNumberDesc":"四舍五入","FeeTypeDesc":"临时费用","ID":534,"Name":"小套房卫生费111","AddTime":"2018-11-27T16:06:16.17","CompanyID":1,"FeeType":4,"TypeID":6,"OrderBy":0,"CategoryID":1,"RuleID":1,"EndTypeID":1,"EndNumber":3,"SummaryUnitPrice":0.3500,"Unit":"","Coefficient":-79228162514264337593543950335.0,"Remark":"","IsReading":false,"EndNumberCount":0,"IsAllowImport":true,"SummaryStartTime":"0001-01-01T00:00:00","SummaryEndStartTime":"0001-01-01T00:00:00","SummaryChargeTypeCount":0,"EndNumberType":1,"AutoToMonthEnd":true,"BiaoCategory":"","BiaoName":"","TimeAuto":true,"IsOrderFeeOn":false,"WeiYuePercent":0.0000,"RelateCharges":"","ChargeWeiYueType":1,"DayGunLi":false,"WeiYueStartDate":"starttime","WeiYueBefore":"before","WeiYueDays":0,"CalculateAreaType":"jifei","WeiYueActiveStartDate":"starttime","WeiYueActiveBeforeAfter":"before","WeiYueActiveCount":0,"WeiYueActiveDayMonth":"day","WeiYueEndDate":"currentdate","StartPriceRange":false,"DisableDefaultImportFee":false,"PriceRangeStartTime":"0001-01-01T00:00:00","ChargeFeeType":0,"IsNew":false,"IsDirty":false,"IsDeleted":false,"IsValid":true,"ValidationErrors":[],"JsonIgnoreFields":null,"IsSaveRequired":false},{"ChargeTypeDesc":"","EndTypeDesc":"","EndNumberDesc":"四舍五入","FeeTypeDesc":"临时费用","ID":536,"Name":"水费","AddTime":"2018-11-28T10:36:19.513","CompanyID":1,"FeeType":4,"TypeID":0,"OrderBy":0,"CategoryID":2,"RuleID":1,"EndTypeID":0,"EndNumber":3,"SummaryUnitPrice":3.3100,"Unit":"","Coefficient":-79228162514264337593543950335.0,"Remark":"谁321","IsReading":true,"EndNumberCount":1,"IsAllowImport":true,"SummaryStartTime":"0001-01-01T00:00:00","SummaryEndStartTime":"0001-01-01T00:00:00","SummaryChargeTypeCount":0,"EndNumberType":1,"AutoToMonthEnd":true,"BiaoCategory":"水表","BiaoName":"","TimeAuto":true,"IsOrderFeeOn":true,"WeiYuePercent":0.0000,"RelateCharges":"","ChargeWeiYueType":1,"DayGunLi":false,"WeiYueStartDate":"starttime","WeiYueBefore":"before","WeiYueDays":0,"CalculateAreaType":"","WeiYueActiveStartDate":"starttime","WeiYueActiveBeforeAfter":"before","WeiYueActiveCount":0,"WeiYueActiveDayMonth":"day","WeiYueEndDate":"currentdate","StartPriceRange":false,"DisableDefaultImportFee":false,"PriceRangeStartTime":"0001-01-01T00:00:00","ChargeFeeType":0,"IsNew":false,"IsDirty":false,"IsDeleted":false,"IsValid":true,"ValidationErrors":[],"JsonIgnoreFields":null,"IsSaveRequired":false},{"ChargeTypeDesc":"","EndTypeDesc":"","EndNumberDesc":"四舍五入","FeeTypeDesc":"临时费用","ID":548,"Name":"11111","AddTime":"2018-12-05T11:17:19.97","CompanyID":1,"FeeType":4,"TypeID":0,"OrderBy":0,"CategoryID":5,"RuleID":1,"EndTypeID":0,"EndNumber":3,"SummaryUnitPrice":0.0000,"Unit":"","Coefficient":-79228162514264337593543950335.0,"Remark":"","IsReading":true,"EndNumberCount":0,"IsAllowImport":true,"SummaryStartTime":"0001-01-01T00:00:00","SummaryEndStartTime":"0001-01-01T00:00:00","SummaryChargeTypeCount":0,"EndNumberType":1,"AutoToMonthEnd":true,"BiaoCategory":"水表","BiaoName":"","TimeAuto":false,"IsOrderFeeOn":true,"WeiYuePercent":0.0000,"RelateCharges":"","ChargeWeiYueType":1,"DayGunLi":false,"WeiYueStartDate":"starttime","WeiYueBefore":"before","WeiYueDays":0,"CalculateAreaType":"","WeiYueActiveStartDate":"starttime","WeiYueActiveBeforeAfter":"before","WeiYueActiveCount":0,"WeiYueActiveDayMonth":"day","WeiYueEndDate":"currentdate","StartPriceRange":false,"DisableDefaultImportFee":false,"PriceRangeStartTime":"0001-01-01T00:00:00","ChargeFeeType":0,"IsNew":false,"IsDirty":false,"IsDeleted":false,"IsValid":true,"ValidationErrors":[],"JsonIgnoreFields":null,"IsSaveRequired":false},{"ChargeTypeDesc":"","EndTypeDesc":"","EndNumberDesc":"四舍五入","FeeTypeDesc":"临时费用","ID":549,"Name":"公摊电费124124","AddTime":"2018-12-05T11:49:21.253","CompanyID":1,"FeeType":4,"TypeID":0,"OrderBy":0,"CategoryID":5,"RuleID":1,"EndTypeID":0,"EndNumber":3,"SummaryUnitPrice":1.0000,"Unit":"","Coefficient":-79228162514264337593543950335.0,"Remark":"","IsReading":true,"EndNumberCount":0,"IsAllowImport":true,"SummaryStartTime":"0001-01-01T00:00:00","SummaryEndStartTime":"0001-01-01T00:00:00","SummaryChargeTypeCount":0,"EndNumberType":1,"AutoToMonthEnd":true,"BiaoCategory":"公摊电表","BiaoName":"","TimeAuto":false,"IsOrderFeeOn":true,"WeiYuePercent":0.0000,"RelateCharges":"","ChargeWeiYueType":1,"DayGunLi":false,"WeiYueStartDate":"starttime","WeiYueBefore":"before","WeiYueDays":0,"CalculateAreaType":"","WeiYueActiveStartDate":"starttime","WeiYueActiveBeforeAfter":"before","WeiYueActiveCount":0,"WeiYueActiveDayMonth":"day","WeiYueEndDate":"currentdate","StartPriceRange":false,"DisableDefaultImportFee":false,"PriceRangeStartTime":"0001-01-01T00:00:00","ChargeFeeType":0,"IsNew":false,"IsDirty":false,"IsDeleted":false,"IsValid":true,"ValidationErrors":[],"JsonIgnoreFields":null,"IsSaveRequired":false},{"ChargeTypeDesc":"","EndTypeDesc":"","EndNumberDesc":"四舍五入","FeeTypeDesc":"临时费用","ID":525,"Name":"装修押金","AddTime":"2018-11-23T17:48:45.833","CompanyID":1,"FeeType":4,"TypeID":0,"OrderBy":0,"CategoryID":3,"RuleID":1,"EndTypeID":0,"EndNumber":3,"SummaryUnitPrice":2000.0000,"Unit":"","Coefficient":-79228162514264337593543950335.0,"Remark":"","IsReading":false,"EndNumberCount":0,"IsAllowImport":true,"SummaryStartTime":"0001-01-01T00:00:00","SummaryEndStartTime":"0001-01-01T00:00:00","SummaryChargeTypeCount":0,"EndNumberType":1,"AutoToMonthEnd":true,"BiaoCategory":"","BiaoName":"","TimeAuto":false,"IsOrderFeeOn":true,"WeiYuePercent":0.0000,"RelateCharges":"","ChargeWeiYueType":1,"DayGunLi":false,"WeiYueStartDate":"starttime","WeiYueBefore":"before","WeiYueDays":0,"CalculateAreaType":"","WeiYueActiveStartDate":"starttime","WeiYueActiveBeforeAfter":"before","WeiYueActiveCount":0,"WeiYueActiveDayMonth":"day","WeiYueEndDate":"currentdate","StartPriceRange":false,"DisableDefaultImportFee":false,"PriceRangeStartTime":"0001-01-01T00:00:00","ChargeFeeType":0,"IsNew":false,"IsDirty":false,"IsDeleted":false,"IsValid":true,"ValidationErrors":[],"JsonIgnoreFields":null,"IsSaveRequired":false},{"ChargeTypeDesc":"","EndTypeDesc":"","EndNumberDesc":"四舍五入","FeeTypeDesc":"临时费用","ID":770,"Name":"21","AddTime":"2019-07-29T12:11:32.127","CompanyID":1,"FeeType":4,"TypeID":0,"OrderBy":0,"CategoryID":1,"RuleID":1,"EndTypeID":0,"EndNumber":3,"SummaryUnitPrice":0.0000,"Unit":"","Coefficient":-79228162514264337593543950335.0,"Remark":"","IsReading":false,"EndNumberCount":2,"IsAllowImport":true,"SummaryStartTime":"0001-01-01T00:00:00","SummaryEndStartTime":"0001-01-01T00:00:00","SummaryChargeTypeCount":0,"EndNumberType":1,"AutoToMonthEnd":true,"BiaoCategory":"","BiaoName":"","TimeAuto":false,"IsOrderFeeOn":true,"WeiYuePercent":0.0000,"RelateCharges":"","ChargeWeiYueType":1,"DayGunLi":false,"WeiYueStartDate":"starttime","WeiYueBefore":"before","WeiYueDays":0,"CalculateAreaType":"","WeiYueActiveStartDate":"starttime","WeiYueActiveBeforeAfter":"before","WeiYueActiveCount":0,"WeiYueActiveDayMonth":"day","WeiYueEndDate":"currentdate","StartPriceRange":false,"DisableDefaultImportFee":false,"PriceRangeStartTime":"0001-01-01T00:00:00","ChargeFeeType":0,"IsNew":false,"IsDirty":false,"IsDeleted":false,"IsValid":true,"ValidationErrors":[],"JsonIgnoreFields":null,"IsSaveRequired":false},{"ChargeTypeDesc":"","EndTypeDesc":"","EndNumberDesc":"四舍五入","FeeTypeDesc":"临时费用","ID":778,"Name":"临时123","AddTime":"2019-08-02T09:06:13.88","CompanyID":1,"FeeType":4,"TypeID":0,"OrderBy":0,"CategoryID":1,"RuleID":1,"EndTypeID":0,"EndNumber":3,"SummaryUnitPrice":0.0000,"Unit":"","Coefficient":-79228162514264337593543950335.0,"Remark":"","IsReading":false,"EndNumberCount":0,"IsAllowImport":true,"SummaryStartTime":"0001-01-01T00:00:00","SummaryEndStartTime":"0001-01-01T00:00:00","SummaryChargeTypeCount":0,"EndNumberType":1,"AutoToMonthEnd":true,"BiaoCategory":"","BiaoName":"","TimeAuto":false,"IsOrderFeeOn":true,"WeiYuePercent":0.0000,"RelateCharges":"","ChargeWeiYueType":1,"DayGunLi":false,"WeiYueStartDate":"starttime","WeiYueBefore":"before","WeiYueDays":0,"CalculateAreaType":"","WeiYueActiveStartDate":"starttime","WeiYueActiveBeforeAfter":"before","WeiYueActiveCount":0,"WeiYueActiveDayMonth":"day","WeiYueEndDate":"currentdate","StartPriceRange":false,"DisableDefaultImportFee":false,"PriceRangeStartTime":"0001-01-01T00:00:00","ChargeFeeType":0,"IsNew":false,"IsDirty":false,"IsDeleted":false,"IsValid":true,"ValidationErrors":[],"JsonIgnoreFields":null,"IsSaveRequired":false},{"ChargeTypeDesc":"单价*计费面积/用量(一次性)","EndTypeDesc":"","EndNumberDesc":"四舍五入","FeeTypeDesc":"临时费用","ID":780,"Name":"面积单价","AddTime":"2019-08-02T15:23:34.3","CompanyID":1,"FeeType":4,"TypeID":6,"OrderBy":0,"CategoryID":1,"RuleID":1,"EndTypeID":0,"EndNumber":3,"SummaryUnitPrice":0.0000,"Unit":"","Coefficient":-79228162514264337593543950335.0,"Remark":"","IsReading":false,"EndNumberCount":0,"IsAllowImport":true,"SummaryStartTime":"0001-01-01T00:00:00","SummaryEndStartTime":"0001-01-01T00:00:00","SummaryChargeTypeCount":0,"EndNumberType":1,"AutoToMonthEnd":true,"BiaoCategory":"","BiaoName":"","TimeAuto":false,"IsOrderFeeOn":true,"WeiYuePercent":0.0000,"RelateCharges":"","ChargeWeiYueType":1,"DayGunLi":false,"WeiYueStartDate":"starttime","WeiYueBefore":"before","WeiYueDays":0,"CalculateAreaType":"jifei","WeiYueActiveStartDate":"starttime","WeiYueActiveBeforeAfter":"before","WeiYueActiveCount":0,"WeiYueActiveDayMonth":"day","WeiYueEndDate":"currentdate","StartPriceRange":false,"DisableDefaultImportFee":false,"PriceRangeStartTime":"0001-01-01T00:00:00","ChargeFeeType":0,"IsNew":false,"IsDirty":false,"IsDeleted":false,"IsValid":true,"ValidationErrors":[],"JsonIgnoreFields":null,"IsSaveRequired":false},{"ChargeTypeDesc":"单价*计费面积/用量(一次性)","EndTypeDesc":"","EndNumberDesc":"四舍五入","FeeTypeDesc":"临时费用","ID":781,"Name":"税金（租）","AddTime":"2019-08-07T11:16:04.657","CompanyID":1,"FeeType":4,"TypeID":6,"OrderBy":0,"CategoryID":1,"RuleID":1,"EndTypeID":0,"EndNumber":3,"SummaryUnitPrice":0.0900,"Unit":"","Coefficient":-79228162514264337593543950335.0,"Remark":"","IsReading":false,"EndNumberCount":2,"IsAllowImport":true,"SummaryStartTime":"0001-01-01T00:00:00","SummaryEndStartTime":"0001-01-01T00:00:00","SummaryChargeTypeCount":0,"EndNumberType":1,"AutoToMonthEnd":true,"BiaoCategory":"","BiaoName":"","TimeAuto":false,"IsOrderFeeOn":true,"WeiYuePercent":0.0000,"RelateCharges":"","ChargeWeiYueType":1,"DayGunLi":false,"WeiYueStartDate":"starttime","WeiYueBefore":"before","WeiYueDays":0,"CalculateAreaType":"jifei","WeiYueActiveStartDate":"starttime","WeiYueActiveBeforeAfter":"before","WeiYueActiveCount":0,"WeiYueActiveDayMonth":"day","WeiYueEndDate":"currentdate","StartPriceRange":false,"DisableDefaultImportFee":false,"PriceRangeStartTime":"0001-01-01T00:00:00","ChargeFeeType":0,"IsNew":false,"IsDirty":false,"IsDeleted":false,"IsValid":true,"ValidationErrors":[],"JsonIgnoreFields":null,"IsSaveRequired":false},{"ChargeTypeDesc":"单价*计费面积/用量(一次性)","EndTypeDesc":"","EndNumberDesc":"四舍五入","FeeTypeDesc":"临时费用","ID":785,"Name":"税金（水）","AddTime":"2019-08-09T15:10:43.46","CompanyID":1,"FeeType":4,"TypeID":6,"OrderBy":0,"CategoryID":1,"RuleID":1,"EndTypeID":0,"EndNumber":3,"SummaryUnitPrice":0.0900,"Unit":"","Coefficient":-79228162514264337593543950335.0,"Remark":"","IsReading":false,"EndNumberCount":2,"IsAllowImport":true,"SummaryStartTime":"0001-01-01T00:00:00","SummaryEndStartTime":"0001-01-01T00:00:00","SummaryChargeTypeCount":0,"EndNumberType":1,"AutoToMonthEnd":true,"BiaoCategory":"","BiaoName":"","TimeAuto":false,"IsOrderFeeOn":true,"WeiYuePercent":0.0000,"RelateCharges":"","ChargeWeiYueType":1,"DayGunLi":false,"WeiYueStartDate":"starttime","WeiYueBefore":"before","WeiYueDays":0,"CalculateAreaType":"jifei","WeiYueActiveStartDate":"starttime","WeiYueActiveBeforeAfter":"before","WeiYueActiveCount":0,"WeiYueActiveDayMonth":"day","WeiYueEndDate":"currentdate","StartPriceRange":false,"DisableDefaultImportFee":false,"PriceRangeStartTime":"0001-01-01T00:00:00","ChargeFeeType":0,"IsNew":false,"IsDirty":false,"IsDeleted":false,"IsValid":true,"ValidationErrors":[],"JsonIgnoreFields":null,"IsSaveRequired":false},{"ChargeTypeDesc":"单价*计费面积/用量(一次性)","EndTypeDesc":"","EndNumberDesc":"四舍五入","FeeTypeDesc":"临时费用","ID":786,"Name":"税金（电）","AddTime":"2019-08-09T15:11:14.07","CompanyID":1,"FeeType":4,"TypeID":6,"OrderBy":0,"CategoryID":1,"RuleID":1,"EndTypeID":0,"EndNumber":3,"SummaryUnitPrice":0.1300,"Unit":"","Coefficient":-79228162514264337593543950335.0,"Remark":"","IsReading":false,"EndNumberCount":2,"IsAllowImport":true,"SummaryStartTime":"0001-01-01T00:00:00","SummaryEndStartTime":"0001-01-01T00:00:00","SummaryChargeTypeCount":0,"EndNumberType":1,"AutoToMonthEnd":true,"BiaoCategory":"","BiaoName":"","TimeAuto":false,"IsOrderFeeOn":true,"WeiYuePercent":0.0000,"RelateCharges":"","ChargeWeiYueType":1,"DayGunLi":false,"WeiYueStartDate":"starttime","WeiYueBefore":"before","WeiYueDays":0,"CalculateAreaType":"jifei","WeiYueActiveStartDate":"starttime","WeiYueActiveBeforeAfter":"before","WeiYueActiveCount":0,"WeiYueActiveDayMonth":"day","WeiYueEndDate":"currentdate","StartPriceRange":false,"DisableDefaultImportFee":false,"PriceRangeStartTime":"0001-01-01T00:00:00","ChargeFeeType":0,"IsNew":false,"IsDirty":false,"IsDeleted":false,"IsValid":true,"ValidationErrors":[],"JsonIgnoreFields":null,"IsSaveRequired":false},{"ChargeTypeDesc":"单价*计费面积/用量(一次性)","EndTypeDesc":"","EndNumberDesc":"四舍五入","FeeTypeDesc":"临时费用","ID":787,"Name":"卫生费","AddTime":"2019-08-13T16:18:21.57","CompanyID":1,"FeeType":4,"TypeID":6,"OrderBy":0,"CategoryID":1,"RuleID":1,"EndTypeID":0,"EndNumber":3,"SummaryUnitPrice":1.0000,"Unit":"","Coefficient":-79228162514264337593543950335.0,"Remark":"","IsReading":false,"EndNumberCount":0,"IsAllowImport":true,"SummaryStartTime":"0001-01-01T00:00:00","SummaryEndStartTime":"0001-01-01T00:00:00","SummaryChargeTypeCount":0,"EndNumberType":1,"AutoToMonthEnd":true,"BiaoCategory":"","BiaoName":"","TimeAuto":false,"IsOrderFeeOn":true,"WeiYuePercent":0.0000,"RelateCharges":"","ChargeWeiYueType":1,"DayGunLi":false,"WeiYueStartDate":"starttime","WeiYueBefore":"before","WeiYueDays":0,"CalculateAreaType":"","WeiYueActiveStartDate":"starttime","WeiYueActiveBeforeAfter":"before","WeiYueActiveCount":0,"WeiYueActiveDayMonth":"day","WeiYueEndDate":"currentdate","StartPriceRange":false,"DisableDefaultImportFee":false,"PriceRangeStartTime":"0001-01-01T00:00:00","ChargeFeeType":0,"IsNew":false,"IsDirty":false,"IsDeleted":false,"IsValid":true,"ValidationErrors":[],"JsonIgnoreFields":null,"IsSaveRequired":false},{"ChargeTypeDesc":"","EndTypeDesc":"","EndNumberDesc":"四舍五入","FeeTypeDesc":"临时费用","ID":791,"Name":"摊位费","AddTime":"2019-08-14T14:10:30.393","CompanyID":1,"FeeType":4,"TypeID":0,"OrderBy":0,"CategoryID":1,"RuleID":1,"EndTypeID":0,"EndNumber":3,"SummaryUnitPrice":0.0000,"Unit":"","Coefficient":-79228162514264337593543950335.0,"Remark":"","IsReading":false,"EndNumberCount":0,"IsAllowImport":true,"SummaryStartTime":"0001-01-01T00:00:00","SummaryEndStartTime":"0001-01-01T00:00:00","SummaryChargeTypeCount":0,"EndNumberType":1,"AutoToMonthEnd":true,"BiaoCategory":"","BiaoName":"","TimeAuto":false,"IsOrderFeeOn":true,"WeiYuePercent":0.0000,"RelateCharges":"","ChargeWeiYueType":1,"DayGunLi":false,"WeiYueStartDate":"starttime","WeiYueBefore":"before","WeiYueDays":0,"CalculateAreaType":"","WeiYueActiveStartDate":"starttime","WeiYueActiveBeforeAfter":"before","WeiYueActiveCount":0,"WeiYueActiveDayMonth":"day","WeiYueEndDate":"currentdate","StartPriceRange":false,"DisableDefaultImportFee":false,"PriceRangeStartTime":"0001-01-01T00:00:00","ChargeFeeType":0,"IsNew":false,"IsDirty":false,"IsDeleted":false,"IsValid":true,"ValidationErrors":[],"JsonIgnoreFields":null,"IsSaveRequired":false},{"ChargeTypeDesc":"","EndTypeDesc":"","EndNumberDesc":"四舍五入","FeeTypeDesc":"临时费用","ID":793,"Name":"电费000","AddTime":"2019-08-15T10:04:22.587","CompanyID":1,"FeeType":4,"TypeID":0,"OrderBy":0,"CategoryID":2,"RuleID":1,"EndTypeID":0,"EndNumber":3,"SummaryUnitPrice":5.0000,"Unit":"","Coefficient":-79228162514264337593543950335.0,"Remark":"","IsReading":true,"EndNumberCount":0,"IsAllowImport":true,"SummaryStartTime":"0001-01-01T00:00:00","SummaryEndStartTime":"0001-01-01T00:00:00","SummaryChargeTypeCount":0,"EndNumberType":1,"AutoToMonthEnd":true,"BiaoCategory":"水表","BiaoName":"","TimeAuto":false,"IsOrderFeeOn":true,"WeiYuePercent":0.0000,"RelateCharges":"","ChargeWeiYueType":1,"DayGunLi":false,"WeiYueStartDate":"starttime","WeiYueBefore":"before","WeiYueDays":0,"CalculateAreaType":"","WeiYueActiveStartDate":"starttime","WeiYueActiveBeforeAfter":"before","WeiYueActiveCount":0,"WeiYueActiveDayMonth":"day","WeiYueEndDate":"currentdate","StartPriceRange":false,"DisableDefaultImportFee":false,"PriceRangeStartTime":"0001-01-01T00:00:00","ChargeFeeType":0,"IsNew":false,"IsDirty":false,"IsDeleted":false,"IsValid":true,"ValidationErrors":[],"JsonIgnoreFields":null,"IsSaveRequired":false},{"ChargeTypeDesc":"","EndTypeDesc":"","EndNumberDesc":"四舍五入","FeeTypeDesc":"临时费用","ID":796,"Name":"干鲜果水费","AddTime":"2019-08-18T10:43:18.127","CompanyID":1,"FeeType":4,"TypeID":0,"OrderBy":0,"CategoryID":1,"RuleID":1,"EndTypeID":0,"EndNumber":3,"SummaryUnitPrice":0.0000,"Unit":"","Coefficient":-79228162514264337593543950335.0,"Remark":"","IsReading":true,"EndNumberCount":0,"IsAllowImport":true,"SummaryStartTime":"0001-01-01T00:00:00","SummaryEndStartTime":"0001-01-01T00:00:00","SummaryChargeTypeCount":0,"EndNumberType":1,"AutoToMonthEnd":true,"BiaoCategory":"水表","BiaoName":"","TimeAuto":false,"IsOrderFeeOn":true,"WeiYuePercent":0.0000,"RelateCharges":"","ChargeWeiYueType":1,"DayGunLi":false,"WeiYueStartDate":"starttime","WeiYueBefore":"before","WeiYueDays":0,"CalculateAreaType":"jifei","WeiYueActiveStartDate":"starttime","WeiYueActiveBeforeAfter":"before","WeiYueActiveCount":0,"WeiYueActiveDayMonth":"day","WeiYueEndDate":"currentdate","StartPriceRange":false,"DisableDefaultImportFee":false,"PriceRangeStartTime":"0001-01-01T00:00:00","ChargeFeeType":0,"IsNew":false,"IsDirty":false,"IsDeleted":false,"IsValid":true,"ValidationErrors":[],"JsonIgnoreFields":null,"IsSaveRequired":false},{"ChargeTypeDesc":"单价*计费面积*公摊系数(月度)","EndTypeDesc":"","EndNumberDesc":"四舍五入","FeeTypeDesc":"临时费用","ID":802,"Name":"阶梯电梯费","AddTime":"2019-08-27T15:20:17.757","CompanyID":1,"FeeType":4,"TypeID":3,"OrderBy":0,"CategoryID":2,"RuleID":1,"EndTypeID":0,"EndNumber":3,"SummaryUnitPrice":0.0000,"Unit":"","Coefficient":-79228162514264337593543950335.0,"Remark":"","IsReading":false,"EndNumberCount":0,"IsAllowImport":true,"SummaryStartTime":"0001-01-01T00:00:00","SummaryEndStartTime":"0001-01-01T00:00:00","SummaryChargeTypeCount":0,"EndNumberType":1,"AutoToMonthEnd":true,"BiaoCategory":"","BiaoName":"","TimeAuto":false,"IsOrderFeeOn":true,"WeiYuePercent":0.0000,"RelateCharges":"","ChargeWeiYueType":1,"DayGunLi":false,"WeiYueStartDate":"starttime","WeiYueBefore":"before","WeiYueDays":0,"CalculateAreaType":"","WeiYueActiveStartDate":"starttime","WeiYueActiveBeforeAfter":"before","WeiYueActiveCount":0,"WeiYueActiveDayMonth":"day","WeiYueEndDate":"currentdate","StartPriceRange":true,"DisableDefaultImportFee":false,"PriceRangeStartTime":"0001-01-01T00:00:00","ChargeFeeType":0,"IsNew":false,"IsDirty":false,"IsDeleted":false,"IsValid":true,"ValidationErrors":[],"JsonIgnoreFields":null,"IsSaveRequired":false},{"ChargeTypeDesc":"","EndTypeDesc":"","EndNumberDesc":"四舍五入","FeeTypeDesc":"临时费用","ID":803,"Name":"公摊电费","AddTime":"2019-08-27T17:27:28.623","CompanyID":1,"FeeType":4,"TypeID":0,"OrderBy":0,"CategoryID":2,"RuleID":1,"EndTypeID":0,"EndNumber":3,"SummaryUnitPrice":0.0000,"Unit":"","Coefficient":-79228162514264337593543950335.0,"Remark":"","IsReading":true,"EndNumberCount":2,"IsAllowImport":true,"SummaryStartTime":"0001-01-01T00:00:00","SummaryEndStartTime":"0001-01-01T00:00:00","SummaryChargeTypeCount":0,"EndNumberType":1,"AutoToMonthEnd":true,"BiaoCategory":"公摊电表","BiaoName":"","TimeAuto":false,"IsOrderFeeOn":true,"WeiYuePercent":0.0000,"RelateCharges":"","ChargeWeiYueType":1,"DayGunLi":false,"WeiYueStartDate":"starttime","WeiYueBefore":"before","WeiYueDays":0,"CalculateAreaType":"","WeiYueActiveStartDate":"starttime","WeiYueActiveBeforeAfter":"before","WeiYueActiveCount":0,"WeiYueActiveDayMonth":"day","WeiYueEndDate":"currentdate","StartPriceRange":false,"DisableDefaultImportFee":false,"PriceRangeStartTime":"0001-01-01T00:00:00","ChargeFeeType":0,"IsNew":false,"IsDirty":false,"IsDeleted":false,"IsValid":true,"ValidationErrors":[],"JsonIgnoreFields":null,"IsSaveRequired":false},{"ChargeTypeDesc":"","EndTypeDesc":"","EndNumberDesc":"四舍五入","FeeTypeDesc":"临时费用","ID":804,"Name":"公摊水费","AddTime":"2019-08-28T15:34:26.16","CompanyID":1,"FeeType":4,"TypeID":0,"OrderBy":0,"CategoryID":2,"RuleID":1,"EndTypeID":0,"EndNumber":3,"SummaryUnitPrice":0.0000,"Unit":"","Coefficient":-79228162514264337593543950335.0,"Remark":"","IsReading":true,"EndNumberCount":0,"IsAllowImport":true,"SummaryStartTime":"0001-01-01T00:00:00","SummaryEndStartTime":"0001-01-01T00:00:00","SummaryChargeTypeCount":0,"EndNumberType":1,"AutoToMonthEnd":true,"BiaoCategory":"水表","BiaoName":"","TimeAuto":false,"IsOrderFeeOn":true,"WeiYuePercent":0.0000,"RelateCharges":"","ChargeWeiYueType":1,"DayGunLi":false,"WeiYueStartDate":"starttime","WeiYueBefore":"before","WeiYueDays":0,"CalculateAreaType":"","WeiYueActiveStartDate":"starttime","WeiYueActiveBeforeAfter":"before","WeiYueActiveCount":0,"WeiYueActiveDayMonth":"day","WeiYueEndDate":"currentdate","StartPriceRange":false,"DisableDefaultImportFee":false,"PriceRangeStartTime":"0001-01-01T00:00:00","ChargeFeeType":0,"IsNew":false,"IsDirty":false,"IsDeleted":false,"IsValid":true,"ValidationErrors":[],"JsonIgnoreFields":null,"IsSaveRequired":false},{"ChargeTypeDesc":"","EndTypeDesc":"","EndNumberDesc":"四舍五入","FeeTypeDesc":"临时费用","ID":795,"Name":"水电","AddTime":"2019-08-16T18:31:00.503","CompanyID":1,"FeeType":4,"TypeID":0,"OrderBy":1,"CategoryID":1,"RuleID":1,"EndTypeID":0,"EndNumber":3,"SummaryUnitPrice":15.0000,"Unit":"","Coefficient":-79228162514264337593543950335.0,"Remark":"","IsReading":true,"EndNumberCount":0,"IsAllowImport":true,"SummaryStartTime":"0001-01-01T00:00:00","SummaryEndStartTime":"0001-01-01T00:00:00","SummaryChargeTypeCount":0,"EndNumberType":1,"AutoToMonthEnd":true,"BiaoCategory":"水表","BiaoName":"","TimeAuto":false,"IsOrderFeeOn":true,"WeiYuePercent":0.0000,"RelateCharges":"","ChargeWeiYueType":1,"DayGunLi":false,"WeiYueStartDate":"starttime","WeiYueBefore":"before","WeiYueDays":0,"CalculateAreaType":"","WeiYueActiveStartDate":"starttime","WeiYueActiveBeforeAfter":"before","WeiYueActiveCount":0,"WeiYueActiveDayMonth":"day","WeiYueEndDate":"currentdate","StartPriceRange":false,"DisableDefaultImportFee":false,"PriceRangeStartTime":"0001-01-01T00:00:00","ChargeFeeType":0,"IsNew":false,"IsDirty":false,"IsDeleted":false,"IsValid":true,"ValidationErrors":[],"JsonIgnoreFields":null,"IsSaveRequired":false},{"ChargeTypeDesc":"","EndTypeDesc":"按计费开始日期","EndNumberDesc":"四舍五入","FeeTypeDesc":"临时费用","ID":529,"Name":"电费","AddTime":"2018-11-26T10:27:09.767","CompanyID":1,"FeeType":4,"TypeID":0,"OrderBy":1,"CategoryID":2,"RuleID":1,"EndTypeID":2,"EndNumber":3,"SummaryUnitPrice":0.8645,"Unit":"","Coefficient":-79228162514264337593543950335.0,"Remark":"","IsReading":true,"EndNumberCount":0,"IsAllowImport":true,"SummaryStartTime":"0001-01-01T00:00:00","SummaryEndStartTime":"0001-01-01T00:00:00","SummaryChargeTypeCount":1,"EndNumberType":1,"AutoToMonthEnd":true,"BiaoCategory":"电表","BiaoName":"","TimeAuto":false,"IsOrderFeeOn":true,"WeiYuePercent":0.0000,"RelateCharges":"","ChargeWeiYueType":1,"DayGunLi":false,"WeiYueStartDate":"starttime","WeiYueBefore":"before","WeiYueDays":0,"CalculateAreaType":"","WeiYueActiveStartDate":"starttime","WeiYueActiveBeforeAfter":"before","WeiYueActiveCount":0,"WeiYueActiveDayMonth":"day","WeiYueEndDate":"currentdate","StartPriceRange":false,"DisableDefaultImportFee":false,"PriceRangeStartTime":"0001-01-01T00:00:00","ChargeFeeType":0,"IsNew":false,"IsDirty":false,"IsDeleted":false,"IsValid":true,"ValidationErrors":[],"JsonIgnoreFields":null,"IsSaveRequired":false},{"ChargeTypeDesc":"","EndTypeDesc":"","EndNumberDesc":"四舍五入","FeeTypeDesc":"临时费用","ID":574,"Name":"月公摊费","AddTime":"2018-12-27T15:05:42.21","CompanyID":1,"FeeType":4,"TypeID":0,"OrderBy":1,"CategoryID":2,"RuleID":1,"EndTypeID":0,"EndNumber":3,"SummaryUnitPrice":0.0000,"Unit":"","Coefficient":-79228162514264337593543950335.0,"Remark":"","IsReading":true,"EndNumberCount":0,"IsAllowImport":true,"SummaryStartTime":"0001-01-01T00:00:00","SummaryEndStartTime":"0001-01-01T00:00:00","SummaryChargeTypeCount":0,"EndNumberType":1,"AutoToMonthEnd":true,"BiaoCategory":"公摊电表","BiaoName":"","TimeAuto":false,"IsOrderFeeOn":true,"WeiYuePercent":0.0000,"RelateCharges":"","ChargeWeiYueType":1,"DayGunLi":false,"WeiYueStartDate":"starttime","WeiYueBefore":"before","WeiYueDays":0,"CalculateAreaType":"","WeiYueActiveStartDate":"starttime","WeiYueActiveBeforeAfter":"before","WeiYueActiveCount":0,"WeiYueActiveDayMonth":"day","WeiYueEndDate":"currentdate","StartPriceRange":false,"DisableDefaultImportFee":false,"PriceRangeStartTime":"0001-01-01T00:00:00","ChargeFeeType":0,"IsNew":false,"IsDirty":false,"IsDeleted":false,"IsValid":true,"ValidationErrors":[],"JsonIgnoreFields":null,"IsSaveRequired":false},{"ChargeTypeDesc":"","EndTypeDesc":"","EndNumberDesc":"四舍五入","FeeTypeDesc":"临时费用","ID":761,"Name":"科技馆押金","AddTime":"2019-07-23T17:25:20.027","CompanyID":1,"FeeType":4,"TypeID":0,"OrderBy":1,"CategoryID":3,"RuleID":1,"EndTypeID":0,"EndNumber":3,"SummaryUnitPrice":23000.0000,"Unit":"","Coefficient":-79228162514264337593543950335.0,"Remark":"","IsReading":false,"EndNumberCount":0,"IsAllowImport":true,"SummaryStartTime":"0001-01-01T00:00:00","SummaryEndStartTime":"0001-01-01T00:00:00","SummaryChargeTypeCount":0,"EndNumberType":1,"AutoToMonthEnd":true,"BiaoCategory":"","BiaoName":"","TimeAuto":false,"IsOrderFeeOn":true,"WeiYuePercent":0.0000,"RelateCharges":"","ChargeWeiYueType":1,"DayGunLi":false,"WeiYueStartDate":"starttime","WeiYueBefore":"before","WeiYueDays":0,"CalculateAreaType":"","WeiYueActiveStartDate":"starttime","WeiYueActiveBeforeAfter":"before","WeiYueActiveCount":0,"WeiYueActiveDayMonth":"day","WeiYueEndDate":"currentdate","StartPriceRange":false,"DisableDefaultImportFee":false,"PriceRangeStartTime":"0001-01-01T00:00:00","ChargeFeeType":0,"IsNew":false,"IsDirty":false,"IsDeleted":false,"IsValid":true,"ValidationErrors":[],"JsonIgnoreFields":null,"IsSaveRequired":false},{"ChargeTypeDesc":"单价*计费面积/用量(一次性)","EndTypeDesc":"","EndNumberDesc":"四舍五入","FeeTypeDesc":"临时费用","ID":762,"Name":"预收三个月租金","AddTime":"2019-07-23T17:25:59.213","CompanyID":1,"FeeType":4,"TypeID":6,"OrderBy":1,"CategoryID":4,"RuleID":1,"EndTypeID":0,"EndNumber":3,"SummaryUnitPrice":3000.0000,"Unit":"","Coefficient":-79228162514264337593543950335.0,"Remark":"","IsReading":false,"EndNumberCount":0,"IsAllowImport":true,"SummaryStartTime":"0001-01-01T00:00:00","SummaryEndStartTime":"0001-01-01T00:00:00","SummaryChargeTypeCount":0,"EndNumberType":1,"AutoToMonthEnd":true,"BiaoCategory":"","BiaoName":"","TimeAuto":false,"IsOrderFeeOn":true,"WeiYuePercent":0.0000,"RelateCharges":"","ChargeWeiYueType":1,"DayGunLi":false,"WeiYueStartDate":"starttime","WeiYueBefore":"before","WeiYueDays":0,"CalculateAreaType":"","WeiYueActiveStartDate":"starttime","WeiYueActiveBeforeAfter":"before","WeiYueActiveCount":0,"WeiYueActiveDayMonth":"day","WeiYueEndDate":"currentdate","StartPriceRange":false,"DisableDefaultImportFee":false,"PriceRangeStartTime":"0001-01-01T00:00:00","ChargeFeeType":0,"IsNew":false,"IsDirty":false,"IsDeleted":false,"IsValid":true,"ValidationErrors":[],"JsonIgnoreFields":null,"IsSaveRequired":false},{"ChargeTypeDesc":"单价*计费面积/用量(一次性)","EndTypeDesc":"按计费开始日期","EndNumberDesc":"四舍五入","FeeTypeDesc":"临时费用","ID":772,"Name":"恒大水费","AddTime":"2019-07-29T16:19:51.89","CompanyID":1,"FeeType":4,"TypeID":6,"OrderBy":24,"CategoryID":1,"RuleID":1,"EndTypeID":2,"EndNumber":3,"SummaryUnitPrice":3.3000,"Unit":"","Coefficient":-79228162514264337593543950335.0,"Remark":"","IsReading":true,"EndNumberCount":0,"IsAllowImport":true,"SummaryStartTime":"0001-01-01T00:00:00","SummaryEndStartTime":"0001-01-01T00:00:00","SummaryChargeTypeCount":1,"EndNumberType":1,"AutoToMonthEnd":true,"BiaoCategory":"水表","BiaoName":"","TimeAuto":true,"IsOrderFeeOn":true,"WeiYuePercent":0.0000,"RelateCharges":"","ChargeWeiYueType":1,"DayGunLi":false,"WeiYueStartDate":"starttime","WeiYueBefore":"before","WeiYueDays":0,"CalculateAreaType":"","WeiYueActiveStartDate":"starttime","WeiYueActiveBeforeAfter":"before","WeiYueActiveCount":0,"WeiYueActiveDayMonth":"day","WeiYueEndDate":"currentdate","StartPriceRange":false,"DisableDefaultImportFee":false,"PriceRangeStartTime":"0001-01-01T00:00:00","ChargeFeeType":0,"IsNew":false,"IsDirty":false,"IsDeleted":false,"IsValid":true,"ValidationErrors":[],"JsonIgnoreFields":null,"IsSaveRequired":false}]

            var list = [];
            list.push({ ID: 0, Name: "不限" });
            $.each(data, function (index, item) {
                list.push({ ID: item.ID, Name: item.Name });
            })
            FeeType.combobox({
                editable: false,
                data: list,
                valueField: 'ID',
                textField: 'Name',
            });
            ChargeSummaryList = data;
            loadTT(false);
        }
    });
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
    var StartTime = StartWriteDate.datebox("getValue");
    var EndTime = EndWriteDate.datebox("getValue");
    if (StartTime != '' && EndTime != '') {
        if (stringToDate(StartTime).valueOf() > stringToDate(EndTime).valueOf()) {
            show_message('开始日期不能大于结束日期', 'warning');
            return null;
        }
    }
    var roomids = [];
    var projectids = [];
    try {
        roomids = GetSelectedRooms();
        projectids = GetSelectedProjects();
    } catch (e) {

    }
    if (roomids.length == 0 && projectids.length == 0) {
        show_message('请选择一个资源', 'warning');
        return null;
    }
    tt_CanLoad = true;
    var options = {
        "visit": "loaddaishouimport",
        "RoomIDs": JSON.stringify(roomids),
        "ProjectIDs": JSON.stringify(projectids),
        "ChargeID": FeeType.combobox("getValue"),
        "FeeStatus": FeeStatus.combobox("getValue"),
        "StartWriteDate": StartTime,
        "EndWriteDate": EndTime,
        "Keywords": tdKeyword.searchbox("getValue"),
        "ShowFooter": true
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
        url: 'http://demo.saasyy.com/Handler/ImportFeeHandler.ashx',
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

var tt_editIndex = undefined;
function endTTEditing() {
    if (tt_editIndex == undefined) {
        return true;
    }
    $('#tt_table').datagrid('endEdit', tt_editIndex);
    saveFee();
    tt_editIndex = undefined;
    return true;
}
function onDblClickCell(index, field, value) {
    //if (row.FinalChargeStatus == 1) {
    //    return;
    //}
    var rows = $('#tt_table').datagrid('getRows');
    var row = rows[index];
    if (endTTEditing()) {
        var col = $('#tt_table').datagrid('getColumnOption', field);
        if (!col.editor) {
            field = 'RealTotalPoint';
        }
        editTTRoomFee(row, index, field);
        tt_editIndex = index;
    } else {
        setTimeout(function () {
            $('#tt_table').datagrid('selectRow', tt_editIndex);
        }, 100);
    }
}
function onClickTTRow(index, row) {
    if (tt_editIndex != index) {
        endTTEditing();
        return;
    }
    setTimeout(function () {
        $('#tt_table').datagrid('selectRow', index);
    }, 100);
}
function editTTRoomFee(row, rowIndex, fieldName) {
    if (Number(row.CuiShouCount) > 0) {
        show_message('账单催收中，操作取消', 'warning');
        return;
    }
    if (Number(row.FinalChargeStatus) == 1) {
        show_message('账单已收费，操作取消', 'warning');
        return;
    }
    if (Number(row.FinalChargeStatus) == 0 && row.IsCharged) {
        show_message('账单已部分收费，操作取消', 'warning');
        return;
    }
    $('#tt_table').datagrid('selectRow', rowIndex).datagrid('beginEdit', rowIndex);
    var TotalPointObj = $('#tt_table').datagrid('getEditor', { index: rowIndex, field: 'RealTotalPoint' });
    if (TotalPointObj) {
        var totalpoint = row.CalcualteTotalPoint;
        if (Number(totalpoint) > 0) {
            TotalPointObj.target.numberbox('disable', true);
        }
    }
    if (Number(row.ProjectBiaoID) > 0) {
        TotalPointObj.target.numberbox('disable', true);
    }
    var TotalPriceObj = $('#tt_table').datagrid('getEditor', { index: rowIndex, field: 'FinalTotalPrice' });
    if (TotalPriceObj) {
        var totalprice = row.CalculateTotalPrice;
        if (Number(totalprice) > 0) {
            TotalPriceObj.target.numberbox('disable', true);
        }
    }
    var UnitPriceObj = $('#tt_table').datagrid('getEditor', { index: rowIndex, field: 'FinalUnitPrice' });
    if (UnitPriceObj) {
        if (Number(row.FinalUnitPrice) <= 0) {
            UnitPriceObj.target.numberbox("setValue", 0);
        }
        if (row.IsPriceRange) {
            UnitPriceObj.target.numberbox("disable", true);
        }
    }
    var ImportCoefficientObj = $('#tt_table').datagrid('getEditor', { index: rowIndex, field: 'FinalImportCoefficient' });
    if (row.FinalImportCoefficient <= 0 && ImportCoefficientObj) {
        var ImportCoefficient = row.FinalImportCoefficient;
        ImportCoefficientObj.target.numberbox("setValue", ImportCoefficient);
    }
    var WriteDateObj = $('#tt_table').datagrid('getEditor', { index: rowIndex, field: 'WriteDate' });
    if (WriteDateObj) {
        WriteDateObj.target.datebox("setValue", Format_DateTime(row.WriteDate));
    }
    var StartTimeObj = $('#tt_table').datagrid('getEditor', { index: rowIndex, field: 'StartTime' });
    if (StartTimeObj) {
        StartTimeObj.target.datebox("setValue", Format_DateTime(row.StartTime));
    }
    var EndTimeObj = $('#tt_table').datagrid('getEditor', { index: rowIndex, field: 'EndTime' });
    if (EndTimeObj) {
        EndTimeObj.target.datebox("setValue", Format_DateTime(row.EndTime));
    }
    if (row.ImportBiaoGuiGe == '总表') {
        var $FinalReducePoint = $('#tt_table').datagrid('getEditor', { index: rowIndex, field: 'FinalReducePoint' });
        if ($FinalReducePoint) {
            $FinalReducePoint.target.textbox('disable', true);
        }
    }
    if (parseFloat(row.ImportRate) < 0) {
        var $ImportRate = $('#tt_table').datagrid('getEditor', { index: rowIndex, field: 'ImportRate' });
        if ($ImportRate) {
            $ImportRate.target.textbox('setValue', '0');
        }
    }
    if (row.FinalChargeStatus == 1) {
        var ChargeID_Obj = $('#tt_table').datagrid('getEditor', { index: rowIndex, field: 'ChargeID' });
        if (ChargeID_Obj) {
            ChargeID_Obj.target.combobox('disable', true);
        }
        var StartPoint_Obj = $('#tt_table').datagrid('getEditor', { index: rowIndex, field: 'StartPoint' });
        if (StartPoint_Obj) {
            StartPoint_Obj.target.numberbox('disable', true);
        }
        var EndPoint_Obj = $('#tt_table').datagrid('getEditor', { index: rowIndex, field: 'EndPoint' });
        if (EndPoint_Obj) {
            EndPoint_Obj.target.numberbox('disable', true);
        }
        var TotalPoint_Obj = $('#tt_table').datagrid('getEditor', { index: rowIndex, field: 'TotalPoint' });
        if (TotalPoint_Obj) {
            TotalPoint_Obj.target.numberbox('disable', true);
        }
        var UnitPrice_Obj = $('#tt_table').datagrid('getEditor', { index: rowIndex, field: 'UnitPrice' });
        if (UnitPrice_Obj) {
            UnitPrice_Obj.target.numberbox('disable', true);
        }
        var ImportCoefficient_Obj = $('#tt_table').datagrid('getEditor', { index: rowIndex, field: 'ImportCoefficient' });
        if (ImportCoefficient_Obj) {
            ImportCoefficient_Obj.target.numberbox('disable', true);
        }
        var TotalPrice_Obj = $('#tt_table').datagrid('getEditor', { index: rowIndex, field: 'TotalPrice' });
        if (TotalPrice_Obj) {
            TotalPrice_Obj.target.numberbox('disable', true);
        }
        var WriteDate_Obj = $('#tt_table').datagrid('getEditor', { index: rowIndex, field: 'WriteDate' });
        if (WriteDate_Obj) {
            WriteDate_Obj.target.datebox('disable', true);
        }
        var ImportBiaoCategory_Obj = $('#tt_table').datagrid('getEditor', { index: rowIndex, field: 'ImportBiaoCategory' });
        if (ImportBiaoCategory_Obj) {
            ImportBiaoCategory_Obj.target.textbox('disable', true);
        }
        var ImportBiaoName_Obj = $('#tt_table').datagrid('getEditor', { index: rowIndex, field: 'ImportBiaoName' });
        if (ImportBiaoName_Obj) {
            ImportBiaoName_Obj.target.textbox('disable', true);
        }
        var ImportRate_Obj = $('#tt_table').datagrid('getEditor', { index: rowIndex, field: 'ImportRate' });
        if (ImportRate_Obj) {
            ImportRate_Obj.target.textbox('disable', true);
        }
        var FinalReducePoint_Obj = $('#tt_table').datagrid('getEditor', { index: rowIndex, field: 'FinalReducePoint' });
        if (FinalReducePoint_Obj) {
            FinalReducePoint_Obj.target.textbox('disable', true);
        }
    }
    if (fieldName) {
        $('#tt_table').datagrid('getEditor', { index: rowIndex, field: fieldName }).target.next('span').find('input').focus();
    }
}
function Format_DateTime(datetime) {
    if (datetime == undefined || datetime == null) {
        return "";
    }
    var result = datetime.substring(0, 16).split("T")[0];
    if (result == '0001-01-01' || result == '1900-01-01' || result == '1901-01-01') {
        return "";
    }
    return result;
}
function xround(x, num) {
    if (x <= 0) {
        return x;
    }
    return Math.round(x * Math.pow(10, num)) / Math.pow(10, num);
}
function formatUnitPrice(value, row) {
    if (row.IsPriceRange) {
        return '<a>阶梯单价</a>';
    }
    return row.FinalUnitPrice;
}
function formatDecimal(value, row) {
    if (parseFloat(value) <= 0 || value == '') {
        return 0;
    }
    return value;
}
function formatImportRate(value, row) {
    if (parseFloat(row.ImportRate) <= 0 || row.ImportRate == '') {
        row.ImportRate = 1;
    }
    return row.ImportRate;
}
function openImport() {
    doOpenWin({
        title: '导入账单',
        url: '../GongTan/ImportFee.html',
        winParent: false,
        width: '50%',
        height: "50%",
    }, function () {
        $('#tt_table').datagrid('reload');
    });
}
function editFee() {
    var rows = $('#tt_table').datagrid("getSelections");
    if (rows.length != 1) {
        show_message('请选择一条数据进行操作,操作取消', 'warning');
        return;
    }
    if (rows[0].FinalChargeStatus == 1) {
        return;
    }
    var rowIndex = $('#tt_table').datagrid('getRowIndex', rows[0]);
    setTimeout(function () {
        tt_editIndex = rowIndex;
    }, 1000);
    editTTRoomFee(rows[0], rowIndex, 'RealTotalPoint');
    return;
}
function saveFeeAsync(async) {
    var ImportFeeList = [];
    var CostIsNull = false;
    var CalculateCostError = false;
    var WriteDateError = false;
    var rows = $('#tt_table').datagrid("getSelections");
    $.each(rows, function (index, row) {
        row.StartPoint = formatDecimal(row.StartPoint, row);
        row.EndPoint = formatDecimal(row.EndPoint, row);
        row.TotalPoint = formatDecimal(row.RealTotalPoint, row);
        row.TotalPrice = formatDecimal(row.FinalTotalPrice, row);
        row.UnitPrice = formatDecimal(row.FinalUnitPrice, row);
        row.ImportCoefficient = formatDecimal(row.FinalImportCoefficient, row);
        row.ImportRate = formatImportRate(row.ImportRate, row);
        row.ImportReducePoint = formatDecimal(row.FinalReducePoint, row);
        row.StartTime = formatTime(row.StartTime, row);
        row.EndTime = formatTime(row.EndTime, row);
        row.WriteDate = formatTime(row.WriteDate, row);
        if (row.TotalPrice <= 0) {
            CostIsNull = true;
        }
        if (row.StartPoint > row.EndPoint) {
            CalculateCostError = true;
        }
        if (row.StartTime == null || row.StartTime == "" || row.StartTime == "--") {
            row.StartTime = "0001-01-01";
        }
        if (row.EndTime == null || row.EndTime == "" || row.EndTime == "--") {
            row.EndTime = "0001-01-01";
        }
        if (row.WriteDate == null || row.WriteDate == "" || row.WriteDate == "--") {
            WriteDateError = true;
            return false;
        }
        ImportFeeList.push(row);
    });
    if (WriteDateError) {
        show_message('账单日期不能为空，操作取消', 'warning');
        return;
    }
    if (ImportFeeList.length == 0) {
        return;
    }
    if (async) {
        //if (CostIsNull) {
        //    top.$.messager.confirm("提示", "部分账单金额为0，是否继续保存?", function (r) {
        //        if (r) {
        //            SaveImportFee(ImportFeeList, async);
        //        }
        //    });
        //    return;
        //}
        if (CalculateCostError) {
            top.$.messager.confirm("提示", "上次读数大于本次读数,是否继续保存?", function (r) {
                if (r) {
                    SaveImportFee(ImportFeeList, async);
                }
            });
            return;
        }
    }
    SaveImportFee(ImportFeeList, async);
}
function saveFee() {
    saveFeeAsync(true);
}
function SaveImportFee(ImportFeeList, async) {
    var options = { visit: 'saveimportfee', ImportFeeList: JSON.stringify(ImportFeeList) };
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: 'http://demo.saasyy.com/Handler/ImportFeeHandler.ashx',
        data: options,
        async: async,
        success: function (message) {
            if (async) {
                if (message.status == 1) {
                    show_message('修改成功', 'success');
                    $('#tt_table').datagrid("reload");
                }
                else {
                    show_message('系统错误', 'error');
                }
            }
        }
    });
}
function removeFee() {
    var rows = $('#tt_table').datagrid("getSelections");
    if (rows.length == 0) {
        show_message('请至少选择一条数据，操作取消', 'warning');
        return;
    }
    var IDList = [];
    var candel = true;
    $.each(rows, function (index, row) {
        if (row.FinalChargeStatus == 1) {
            candel = false;
            return false;
        }
        IDList.push(row.ID);
    });
    if (!candel) {
        show_message('删除行中包含已收费项目，操作取消', 'warning');
        return;
    }
    top.$.messager.confirm("提示", "确认删除?", function (r) {
        if (r) {
            var options = { visit: 'deleteimportfee', IDList: JSON.stringify(IDList) };
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: 'http://demo.saasyy.com/Handler/ImportFeeHandler.ashx',
                data: options,
                success: function (message) {
                    if (message.status) {
                        show_message('删除成功', 'success');
                        $('#tt_table').datagrid("reload");
                    }
                    else if (message.error) {
                        show_message(message.error, 'error');
                    }
                    else {
                        show_message('系统错误', 'error');
                    }
                }
            });
        }
    });
}
//账单生成
var chooseWriteDate, chooseChargeID;
function createFee() {
    chooseWriteDate = '';
    chooseChargeID = '';
    doOpenWin({
        title: '账单生成',
        url: '../GongTan/CreateFee.html',
        winParent: false,
        width: '80%',
        height: "80%",
    }, function () {
        create_fee_complete();
    });
}
function create_fee_complete() {
    if (chooseWriteDate != '') {
        StartWriteDate.datebox("setValue", chooseWriteDate);
        EndWriteDate.datebox("setValue", chooseWriteDate);
    }
    if (chooseChargeID != '') {
        FeeType.combobox("setValue", chooseChargeID);
    }
    FeeStatus.combobox("setValue", 2);
    $('#tt_table').datagrid("reload");
}
//账单生效
function activeFee() {
    var rows = $('#tt_table').datagrid("getSelections");
    if (rows.length == 0) {
        show_message('请至少选择一条数据，操作取消', 'warning');
        return;
    }
    var IDList = [];
    var candel = true;
    var includezero = false;
    $.each(rows, function (index, row) {
        if (row.FinalChargeStatus != 2) {
            candel = false;
            return false;
        }
        var TotalPrice = row.FinalTotalPrice;
        if (TotalPrice <= 0) {
            includezero = true;
        }
        IDList.push(row.ID);
    });
    if (!candel) {
        show_message('选中账单中包含已生效的项目，操作取消', 'warning');
        return;
    }
    if (includezero) {
        top.$.messager.confirm("提示", "选中账单中包含金额为0账单账单，是否继续?", function (r) {
            if (r) {
                SaveActiveFee(IDList);
                return;
            }
        });
        return;
    }
    top.$.messager.confirm("提示", "确认生效选中的账单?", function (r) {
        if (r) {
            SaveActiveFee(IDList);
            return;
        }
    });
}
function SaveActiveFee(IDList) {
    saveFeeAsync(false);
    var options = { visit: 'activefee', IDList: JSON.stringify(IDList) };
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: 'http://demo.saasyy.com/Handler/ImportFeeHandler.ashx',
        data: options,
        async: false,
        success: function (message) {
            if (message.status) {
                if (message.msg) {
                    show_message(message.msg, 'success');
                    return;
                }
                show_message('操作成功', 'success');
                $('#tt_table').datagrid("reload");
            }
            else {
                show_message('系统错误', 'error');
            }
        }
    });
}
//列设置
function openTableSetUp() {
    console.log('openTableSetUp');
    doOpenWin({
        title: '账单列表设置',
        url: '../SysSeting/TableSetUp.html?PageCode=roomfeesource',
        winParent: false,
        width: '80%',
        height: "80%",
    }, function () {
        loadTT(true);
    });
}
//批处理
function batchEditTime() {
    var rows = $('#tt_table').datagrid("getSelections");
    if (rows.length == 0) {
        show_message('请至少选择一条数据，操作取消', 'warning');
        return;
    }
    var tostop = false;
    $.each(rows, function (index, row) {
        if (row.FinalChargeStatus == 1) {
            tostop = true;
            return false;
        }
    })
    if (tostop) {
        show_message('选择的数据中包含已收费的账单,操作取消', 'warning');
        return;
    }
    doOpenWin({
        title: '批处理',
        url: '../GongTan/BatchEditTime.html',
        winParent: false,
        width: '80%',
        height: "80%",
    }, function () {
        $('#tt_table').datagrid("reload");
    });
}
//抄表登记
function batchEditPoint() {
    var rows = $('#tt_table').datagrid("getSelections");
    if (rows.length == 0) {
        show_message('请至少选择一条数据,操作取消', 'warning');
        return;
    }
    var tostop = false;
    $.each(rows, function (index, row) {
        if (row.FinalChargeStatus == 1) {
            tostop = true;
            return false;
        }
    })
    if (tostop) {
        show_message('选择的资源中包含已收费的账单,操作取消', 'warning');
        return;
    }
    doOpenWin({
        title: '抄表登记',
        url: '../GongTan/BatchEditCount.html',
        width: '80%',
        height: "80%",
    }, function () {
        $('#tt_table').datagrid("reload");
    });
}
//公摊处理
function addTool() {
    var rows = $('#tt_table').datagrid("getSelections");
    if (rows.length == 0) {
        show_message('请至少选择一条数据,操作取消', 'warning');
        return;
    }
    var tostop = false;
    $.each(rows, function (index, row) {
        if (row.FinalChargeStatus == 1) {
            tostop = true;
            return false;
        }
    })
    if (tostop) {
        show_message('选择的资源中包含已收费的账单,操作取消', 'warning');
        return;
    }
    doOpenWin({
        title: '公摊工具',
        url: '../GongTan/GongTanTool.html',
        winParent: false,
        width: '80%',
        height: "80%",
    }, function () {
        $('#tt_table').datagrid("reload");
    });
}
//期初收款
function transferQiChu() {
    var rows = $('#tt_table').datagrid("getSelections");
    if (rows.length == 0) {
        show_message('请至少选择一条数据,操作取消', 'warning');
        return;
    }
    doOpenWin({
        title: '收款登记',
        url: '../GongTan/TransferQiChu.html',
        winParent: false,
        width: '80%',
        height: "80%",
    }, function () {
        $('#tt_table').datagrid("reload");
    });
}
//表台帐
function viewTaiZhang() {
    doOpenWin({
        title: '三表台帐',
        url: '../GongTan/TaiZhangMgr.html',
        winParent: false,
        width: '80%',
        height: "80%",
    });
}
//作废单据
function doCancelRoomFee() {
    var rows = $('#tt_table').datagrid("getSelections");
    if (rows.length == 0) {
        show_message('请至少选择一条数据,操作取消', 'warning');
        return;
    }
    var IDList = [];
    var is_noshoufei = false;
    var is_jiaoban = false;
    var is_cancel = false;
    $.each(rows, function (index, row) {
        if (row.HistoryID <= 0) {
            is_noshoufei = true;
            return false;
        }
        if (row.RoomFeeOrderID > 0) {
            is_jiaoban = true;
            return false;
        }
        IDList.push(row.HistoryID);
    });
    if (is_noshoufei) {
        show_message('不能作废未收费的账单,操作取消', 'warning');
        return;
    }
    if (is_jiaoban) {
        show_message('不能作废已交班的账单,操作取消', 'warning');
        return;
    }
    top.$.messager.confirm('提示', '确认作废', function (r) {
        if (r) {
            MaskUtil.mask('body', '提交中');
            var options = { visit: 'cancelhistoryfee', IDList: JSON.stringify(IDList) };
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: 'http://demo.saasyy.com/Handler/FeeCenterHandler.ashx',
                data: options,
                success: function (data) {
                    MaskUtil.unmask();
                    if (data.status) {
                        show_message('作废成功', 'success');
                        $('#tt_table').datagrid("reload");
                    }
                    else if (data.msg) {
                        show_message(data.msg, 'error');
                    }
                    else {
                        show_message('系统错误', 'error');
                    }
                }
            });
        }
    })
}

