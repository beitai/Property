var tt_CanLoad = false, clickbinded = false, clickbinded2 = false, funclist = [];
$(function () {
})
function loaddata(init) {
    if (init) {
        funclist = [loadwaringdata, loadsummary, loadsfkb, loadqfkb, loadzckb];
    }
    var cb = arguments.callee;
    if (funclist.length > 0) {
        var fun = funclist.shift();
        fun.call(this, cb);
    }
}
function loadalldata() {
    //loadsummary();
    loaddata(true);
}
function loadsearchparams() {
    $.post('../Handler/AnalysisHandler.ashx', { visit: 'loadsummarysearchparams' }, function (data) {
        var SummaryList = [];
        SummaryList.push({ ID: "0", Name: "不限" });
        $.each(data.SummaryList, function (index, item) {
            SummaryList.push({ ID: item.ID, Name: item.Name });
        })
        $("#tdShouKuanChargeSummary").combobox({
            editable: false,
            data: SummaryList,
            valueField: 'ID',
            textField: 'Name',
            multiple: true,
        });
        $("#tdQianFeiChargeSummary").combobox({
            editable: false,
            data: SummaryList,
            valueField: 'ID',
            textField: 'Name',
            multiple: true,
        });
        var TypeList = [];
        TypeList.push({ ID: "-1", Name: "不限" });
        $.each(data.TypeList, function (index, item) {
            TypeList.push({ ID: item.ChargeTypeID, Name: item.ChargeTypeName });
        })
        $("#tdShouKuanChargeType").combobox({
            editable: false,
            data: TypeList,
            valueField: 'ID',
            textField: 'Name',
            multiple: true,
        });
    }, 'json')
}
function resetbox() {
    $("#tdfirst .first").html("￥0.00");
    $("#tdsecond .second").html("￥0.00");
    $("#tdthrid .thrid").html("0.00%");
    $("#tdfourth .fourth").html("￥0.00");
    $("#tdfirst .firsttitle").html("加载中");
    $("#tdsecond .secondtitle").html("加载中");
    $("#tdthrid .thridtitle").html("加载中");
    $("#tdfourth .fourthtitle").html("加载中");
}
function loadsummary(cb) {
    var RoomIDs = [];
    var ProjectIDs = [];
    var allprojectids = [];
    try {
        RoomIDs = GetSelectedRooms();
        ProjectIDs = GetSelectedProjects();
        allprojectids = GetALLSelectedProjects();

    } catch (e) {

    }
    //if (RoomIDs.length == 0 && ProjectIDs.length == 0) {
    //    show_message('请选择资源', 'warning');
    //    return;
    //}
    resetbox();
    $.post('../Handler/AnalysisHandler.ashx', { visit: 'loadanalysissummary', RoomIDs: JSON.stringify(RoomIDs), ProjectIDs: JSON.stringify(ProjectIDs), UserID: UserID, "ALLProjectIDs": JSON.stringify(allprojectids) }, function (data) {
        if (!data.status) {
            if (data.error) {
                show_message(data.error, 'warning');
                return;
            }
            show_message('内部异常', 'warning');
            return;
        }
        $("#tdfirst .first").html("￥" + toThousands(data.todayFee));
        $("#tdsecond .second").html("￥" + toThousands(data.totalOwnFee));
        $("#tdthrid .thrid").html(data.shouFeiPercent + "%");
        $("#tdfourth .fourth").html("￥" + toThousands(data.OwnCount));
        $("#tdfirst .firsttitle").html(data.Title1);
        $("#tdsecond .secondtitle").html(data.Title2);
        $("#tdthrid .thridtitle").html(data.Title3);
        $("#tdfourth .fourthtitle").html(data.Title4);
        try {
            cb && cb();
        }
        catch (e) { }
        if (clickbinded) {
            return;
        }
        clickbinded = true;
        bindClick(data.Title1, data.Title2, data.Title3, data.Title4);
    }, 'json')
}
function loadwaringdata(cb) {
    var RoomIDs = [];
    var ProjectIDs = [];
    var allprojectids = [];
    try {
        RoomIDs = GetSelectedRooms();
        ProjectIDs = GetSelectedProjects();
        allprojectids = GetALLSelectedProjects();
    } catch (e) {

    }
    //if (RoomIDs.length == 0 && ProjectIDs.length == 0) {
    //    show_message('请选择资源', 'warning');
    //    return;
    //}
    MaskUtil.mask('body');
    $.post('../Handler/AnalysisHandler.ashx', { visit: 'loadwarninginfo', RoomIDs: JSON.stringify(RoomIDs), ProjectIDs: JSON.stringify(ProjectIDs), ALLProjectIDs: JSON.stringify(allprojectids) }, function (data) {
        MaskUtil.unmask();
        if (!data.status) {
            if (data.error) {
                show_message(data.error, 'warning');
                return;
            }
            show_message('内部异常', 'error');
            return;
        }
        $("#tdfirst0 .first").html(data.contractcount);
        $("#tdsecond0 .second").html("￥" + toThousands(data.contractamount));
        $("#tdthrid0 .thrid").html(data.servicecount);
        $("#tdfourth0 .fourth").html(data.delaycount);
        try {
            cb && cb();
        }
        catch (e) { }
        if (clickbinded2) {
            return;
        }
        clickbinded2 = true;
        bindClick2();
    }, 'json')
}
function bindClick(Title1, Title2, Title3, Title4) {
    $("#tdfirst").bind('click', function () {
        var iframe = "../Analysis/RealCostAnalysisDetailsStatics.aspx?op=view";
        doOpenWin({
            title: Title1,
            url: iframe,
            width: '80%',
            height: "80%",
        });
    })
    $("#tdsecond").bind('click', function () {
        var iframe = "../Analysis/ToChargeAnalysisDetailsStatisc.aspx?op=view";
        doOpenWin({
            title: Title2,
            url: iframe,
            width: '80%',
            height: "80%",
        });
    })
}
function bindClick2() {
    $("#tdfirst0").bind('click', function () {
        var iframe = "../Contract/ContractSummary.aspx?expired=1&op=view&navtype=4";
        doOpenWin({
            title: '合同到期',
            url: iframe,
            width: '80%',
            height: "80%",
        });
    })
    $("#tdsecond0").bind('click', function () {
        var iframe = "../Contract/ContractFeeSummaryAnalysis.aspx?op=view&navtype=4";
        doOpenWin({
            title: '合同收费',
            url: iframe,
            width: '80%',
            height: "80%",
        });
    })
    $("#tdthrid0").bind('click', function () {
        var iframe = "../CustomerService/ServiceMgr.aspx?status=100&op=view";
        doOpenWin({
            title: '报事报修',
            url: iframe,
            width: '80%',
            height: "80%",
        });
    })
}
function loadsfkb(cb) {
    var RoomIDs = [];
    var ProjectIDs = [];
    try {
        RoomIDs = GetSelectedRooms();
        ProjectIDs = GetSelectedProjects();
    } catch (e) {

    }
    //if (RoomIDs.length == 0 && ProjectIDs.length == 0) {
    //    show_message('请选择资源', 'warning');
    //    return;
    //}
    var TypeList = $("#tdShouKuanChargeType").combobox('getValues');
    var SummaryList = $("#tdShouKuanChargeSummary").combobox('getValues');
    var options = { visit: 'loadskkbsummary', TimeRange: $("#tdShouKuanTimeRange").combobox('getValue'), StartTime: $("#tdShouKuanStartTime").datebox('getValue'), EndTime: $("#tdShouKuanEndTime").datebox('getValue'), ChargeSummaryIDList: JSON.stringify(SummaryList), ChargeTypeIDList: JSON.stringify(TypeList), RoomIDs: JSON.stringify(RoomIDs), ProjectIDs: JSON.stringify(ProjectIDs) };
    $.post('../Handler/AnalysisHandler.ashx', options, function (data) {
        var summarylist = [];
        $.each(data.ShouKuanSummaryList, function (index, item) {
            if (index == 0) {
                summarylist.push({ name: item.Name, y: item.RealCost, sliced: true, selected: true });
            }
            else {
                summarylist.push({ name: item.Name, y: item.RealCost, sliced: false, selected: false });
            }
        })
        var typelist = [];
        $.each(data.ShouKuanTypeList, function (index, item) {
            if (index == 0) {
                typelist.push({ name: item.ChargeTypeName, y: item.RealCost, sliced: true, selected: true });
            }
            else {
                typelist.push({ name: item.ChargeTypeName, y: item.RealCost, sliced: false, selected: false });
            }
        })
        var titlepart = $("#tdShouKuanTimeRange").combobox("getText");
        var start = $("#tdShouKuanStartTime").datebox('getValue');
        var end = $("#tdShouKuanEndTime").datebox('getValue');
        if (start != '' || end != '') {
            titlepart = '';
        }
        titlepart = data.Title;
        if (showSFXM == 'skkb_sfxm') {
            if (summarylist.length > 0) {
                var titletext = titlepart + '收款统计(收费项目)';
                $("#summary_container").css("height", "350px");
                loadPie('summary_container', summarylist, titletext)
            }
            else {
                $("#summary_container").css("height", "50px");
                $("#summary_container").html("暂无相关数据");
            }
        }
        else {
            if (typelist.length > 0) {
                var titletext = titlepart + '收款统计(收款方式)';
                $("#type_container").css("height", "350px");
                loadPie('type_container', typelist, titletext)
            }
            else {
                $("#type_container").css("height", "50px");
                $("#type_container").html("暂无相关数据");
            }
        }
        try {
            cb && cb();
        }
        catch (e) { }
    }, 'json')
};
function loadPie(id, list, titletext) {
    $('#' + id).highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        credits: {
            enabled: false
        },
        title: {
            text: titletext,
            align: 'left'
        },
        exporting: {
            enabled: false
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.y}({point.percentage:.1f}%)</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '{point.y}<br>{point.name}',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                        fontWeight: "normal"
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            name: '总收款(元)',
            data: list
        }]
    });
}
function loadqfkb(cb) {
    var RoomIDs = [];
    var ProjectIDs = [];
    try {
        RoomIDs = GetSelectedRooms();
        ProjectIDs = GetSelectedProjects();
    } catch (e) {

    }
    //if (RoomIDs.length == 0 && ProjectIDs.length == 0) {
    //    show_message('请选择资源', 'warning');
    //    return;
    //}
    var SummaryList = $("#tdShouKuanChargeSummary").combobox('getValues');
    var options = {
        visit: 'loadqfkbsummary', TimeRange: $("#tdShouKuanTimeRange").combobox('getValue'), StartTime: $("#tdShouKuanStartTime").datebox('getValue'), EndTime: $("#tdShouKuanEndTime").datebox('getValue'), ChargeSummaryIDList: JSON.stringify(SummaryList), CompanyID: CompanyID, RoomIDs: JSON.stringify(RoomIDs), ProjectIDs: JSON.stringify(ProjectIDs)
    };
    $.post('../Handler/AnalysisHandler.ashx', options, function (data) {
        var summarylist = [];
        $.each(data.QianFeiSummaryList, function (index, item) {
            if (index == 0) {
                summarylist.push({ name: item.Name, y: item.RealCost, sliced: true, selected: true });
            }
            else {
                summarylist.push({ name: item.Name, y: item.RealCost, sliced: false, selected: false });
            }
        })
        var titlepart = $("#tdShouKuanTimeRange").combobox("getText");
        var start = $("#tdShouKuanStartTime").datebox('getValue');
        var end = $("#tdShouKuanEndTime").datebox('getValue');
        if (start != '' || end != '') {
            titlepart = '';
        }
        titlepart = data.Title;
        if (summarylist.length > 0) {
            var titletext = titlepart + '欠费统计(收费项目)';
            $("#qianfei_container").css("height", "350px");
            loadPie('qianfei_container', summarylist, titletext)
        }
        else {
            $("#qianfei_container").css("height", "50px");
            $("#qianfei_container").html("暂无相关数据");
        }
        try {
            cb && cb();
        }
        catch (e) { }
    }, 'json')
}
function loadzckb(cb) {
    var RoomIDs = [];
    var ProjectIDs = [];
    try {
        RoomIDs = GetSelectedRooms();
        ProjectIDs = GetSelectedProjects();
    } catch (e) {

    }
    //if (RoomIDs.length == 0 && ProjectIDs.length == 0) {
    //    show_message('请选择资源', 'warning');
    //    return;
    //}
    var options = {
        visit: 'loadzckbsummary', UserID: UserID, RoomIDs: JSON.stringify(RoomIDs), ProjectIDs: JSON.stringify(ProjectIDs)
    };
    $.post('../Handler/AnalysisHandler.ashx', options, function (data) {
        var summarylist = [];
        $.each(data.ZCKBSummaryList, function (index, item) {
            if (index == 0) {
                summarylist.push({ name: item.PayName, y: item.TotalMoney, sliced: true, selected: true });
            }
            else {
                summarylist.push({ name: item.PayName, y: item.TotalMoney, sliced: false, selected: false });
            }
        })
        if (summarylist.length > 0) {
            var titletext = data.Title;
            $("#zhichu_container").css("height", "350px");
            loadPie('zhichu_container', summarylist, titletext)
        }
        else {
            $("#zhichu_container").css("height", "50px");
            $("#zhichu_container").html("暂无相关数据");
        }
        try {
            cb && cb();
        }
        catch (e) { }
    }, 'json')
}