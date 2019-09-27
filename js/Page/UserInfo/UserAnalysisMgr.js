var idList = "";
$(document).ready(function () {
    //加载权限列表
    loadoperationTree(0);
    //init();
});
var IDMark_A = "_a";
var setting = {
    check: {
        enable: true,
        chkStyle: "radio",
        radioType: "level"
    },
    view: {
        showIcon: false
    },
    data: {
        simpleData: {
            enable: true
        }
    }
};

function loadoperationTree() {
    var options = { visit: 'getanalysistree', CompanyID: CompanyID };
    $.ajax({
        type: 'POST',
        dataType: 'json',
        // url: '../Handler/AuthMgrHandler.ashx',
        url: 'http://demo.saasyy.com/Handler/AuthMgrHandler.ashx',
        data: options,
        success: function (data) {
            data = [{ "UserID": 0, "ID": 1, "PID": 0, "AnalysisName": "收款", "AnalysisCode": "jrsk", "name": "收款", "id": 1, "pId": 0, "nocheck": true, "open": true, "checked": false }, { "UserID": 0, "ID": 2, "PID": 1, "AnalysisName": "今日", "AnalysisCode": "jrsk_jr", "name": "今日", "id": 2, "pId": 1, "nocheck": false, "open": true, "checked": false }, { "UserID": 0, "ID": 3, "PID": 1, "AnalysisName": "昨日", "AnalysisCode": "jrsk_zr", "name": "昨日", "id": 3, "pId": 1, "nocheck": false, "open": true, "checked": false }, { "UserID": 0, "ID": 4, "PID": 1, "AnalysisName": "本周", "AnalysisCode": "jrsk_bz", "name": "本周", "id": 4, "pId": 1, "nocheck": false, "open": true, "checked": false }, { "UserID": 0, "ID": 5, "PID": 1, "AnalysisName": "本月", "AnalysisCode": "jrsk_byd", "name": "本月", "id": 5, "pId": 1, "nocheck": false, "open": true, "checked": false }, { "UserID": 0, "ID": 6, "PID": 1, "AnalysisName": "本季度", "AnalysisCode": "jrsk_bjd", "name": "本季度", "id": 6, "pId": 1, "nocheck": false, "open": true, "checked": false }, { "UserID": 215, "ID": 7, "PID": 1, "AnalysisName": "本年度", "AnalysisCode": "jrsk_bnd", "name": "本年度", "id": 7, "pId": 1, "nocheck": false, "open": true, "checked": true }, { "UserID": 0, "ID": 8, "PID": 0, "AnalysisName": "欠费", "AnalysisCode": "ljqf", "name": "欠费", "id": 8, "pId": 0, "nocheck": true, "open": true, "checked": false }, { "UserID": 0, "ID": 9, "PID": 8, "AnalysisName": "截止今日", "AnalysisCode": "ljqf_jzjr", "name": "截止今日", "id": 9, "pId": 8, "nocheck": false, "open": true, "checked": false }, { "UserID": 0, "ID": 10, "PID": 8, "AnalysisName": "本月度", "AnalysisCode": "ljqf_byd", "name": "本月度", "id": 10, "pId": 8, "nocheck": false, "open": true, "checked": false }, { "UserID": 0, "ID": 11, "PID": 8, "AnalysisName": "本年度", "AnalysisCode": "ljqf_bnd", "name": "本年度", "id": 11, "pId": 8, "nocheck": false, "open": true, "checked": false }, { "UserID": 215, "ID": 12, "PID": 8, "AnalysisName": "历史累计（往年欠费）", "AnalysisCode": "ljqf_lslj", "name": "历史累计（往年欠费）", "id": 12, "pId": 8, "nocheck": false, "open": true, "checked": true }, { "UserID": 0, "ID": 13, "PID": 0, "AnalysisName": "收费率", "AnalysisCode": "bysfl", "name": "收费率", "id": 13, "pId": 0, "nocheck": true, "open": true, "checked": false }, { "UserID": 0, "ID": 14, "PID": 13, "AnalysisName": "本月度", "AnalysisCode": "bysfl_byd", "name": "本月度", "id": 14, "pId": 13, "nocheck": false, "open": true, "checked": false }, { "UserID": 0, "ID": 15, "PID": 13, "AnalysisName": "本季度", "AnalysisCode": "bysfl_bjd", "name": "本季度", "id": 15, "pId": 13, "nocheck": false, "open": true, "checked": false }, { "UserID": 0, "ID": 16, "PID": 13, "AnalysisName": "本年度", "AnalysisCode": "bysfl_bnd", "name": "本年度", "id": 16, "pId": 13, "nocheck": false, "open": true, "checked": false }, { "UserID": 215, "ID": 17, "PID": 13, "AnalysisName": "历史累计", "AnalysisCode": "bysfl_lslj", "name": "历史累计", "id": 17, "pId": 13, "nocheck": false, "open": true, "checked": true }, { "UserID": 0, "ID": 18, "PID": 0, "AnalysisName": "欠费户数", "AnalysisCode": "bysfl_qfhs", "name": "欠费户数", "id": 18, "pId": 0, "nocheck": true, "open": true, "checked": false }, { "UserID": 215, "ID": 19, "PID": 18, "AnalysisName": "跟累计欠费挂钩", "AnalysisCode": "bysfl_gg", "name": "跟累计欠费挂钩", "id": 19, "pId": 18, "nocheck": false, "open": true, "checked": true }, { "UserID": 0, "ID": 20, "PID": 0, "AnalysisName": "收款看板", "AnalysisCode": "skkb", "name": "收款看板", "id": 20, "pId": 0, "nocheck": true, "open": true, "checked": false }, { "UserID": 215, "ID": 21, "PID": 20, "AnalysisName": "按收费项目统计", "AnalysisCode": "skkb_sfxm", "name": "按收费项目统计", "id": 21, "pId": 20, "nocheck": false, "open": true, "checked": true }, { "UserID": 0, "ID": 22, "PID": 20, "AnalysisName": "按收费方式统计", "AnalysisCode": "skkb_sffs", "name": "按收费方式统计", "id": 22, "pId": 20, "nocheck": false, "open": true, "checked": false }, { "UserID": 0, "ID": 23, "PID": 0, "AnalysisName": "支出看板", "AnalysisCode": "zckb", "name": "支出看板", "id": 23, "pId": 0, "nocheck": true, "open": true, "checked": false }, { "UserID": 0, "ID": 24, "PID": 23, "AnalysisName": "本周", "AnalysisCode": "zckb_bz", "name": "本周", "id": 24, "pId": 23, "nocheck": false, "open": true, "checked": false }, { "UserID": 0, "ID": 25, "PID": 23, "AnalysisName": "本月度", "AnalysisCode": "zckb_byd", "name": "本月度", "id": 25, "pId": 23, "nocheck": false, "open": true, "checked": false }, { "UserID": 0, "ID": 26, "PID": 23, "AnalysisName": "本季度", "AnalysisCode": "zckb_bjd", "name": "本季度", "id": 26, "pId": 23, "nocheck": false, "open": true, "checked": false }, { "UserID": 0, "ID": 27, "PID": 23, "AnalysisName": "本年度", "AnalysisCode": "zckb_bnd", "name": "本年度", "id": 27, "pId": 23, "nocheck": false, "open": true, "checked": false }, { "UserID": 215, "ID": 28, "PID": 23, "AnalysisName": "历史累计", "AnalysisCode": "zckb_lslj", "name": "历史累计", "id": 28, "pId": 23, "nocheck": false, "open": true, "checked": true }, { "name": "永有软件管理演示系统", "id": 0, "pId": -1, "open": true, "nocheck": true }]
            $.fn.zTree.init($("#tt"), setting, data);
        }
    });
}
//获取选中的结点
function getSelected() {
    var idarry = [];
    var treeObj = $.fn.zTree.getZTreeObj("tt");
    var nodes = treeObj.getCheckedNodes(true);
    $.each(nodes, function (index, node) {
        idarry.push(node.id);
    });
    return idarry;
}
/*****保存权限*****/
function doSave() {
    var idarry = getSelected();
    var options = { visit: 'saveanalysisuser', IdList: JSON.stringify(idarry) };
    $.ajax({
        type: 'POST',
        dataType: 'json',
        data: options,
        // url: "../Handler/AuthMgrHandler.ashx",
        url: 'http://demo.saasyy.com/Handler/AuthMgrHandler.ashx',
        success: function (data) {
            data.status = true;
            if (data.status) {
                show_message('保存成功', 'success');
                return;
            }
            if (data.error) {
                show_message(data.error, 'warning');
                return;
            }
            show_message('系统错误', 'error');
        }
    });
}
