var tt_CanLoad = false, isUpdate = false;
$(function () {
    loadtt();
});
function loadtt() {
    $('#tt_table').datagrid({
        // url: '../Handler/RoomResourceHandler.ashx',
        // url: 'http://demo.saasyy.com/Handler/RoomResourceHandler.ashx',
        // url: '../mock/RoomResourceHandler.json',
        url:window.SERVERPATH+"roomResource/loadlrelatefamily",
        loadMsg: '正在加载',
        border: true,
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
        onBeforeLoad: function (data) {
            /* data = JSON.parse('{"rows":[{"FullName":"Z实施测试-车位","RoomName":"1数量","ContractName":null,"ContractNo":null,"ID":32582,"RoomID":2372550,"RelatePhoneNumber":"","RelationName":"测试住户","RelationIDCard":"","IsDefault":true,"AddTime":"0001-01-01T00:00:00","RelationType":"homefamily","IDCardType":1,"Birthday":"0001-01-01T00:00:00","EmailAddress":"","HomeAddress":"","OfficeAddress":"","BankName":"","BankAccountName":"","BankAccountNo":"","CustomOne":"","CustomTwo":"","CustomThree":"","CustomFour":"","Remark":"","ContractStartTime":"0001-01-01T00:00:00","ContractEndTime":"0001-01-01T00:00:00","BrandInfo":"","ContractNote":"","RelationProperty":"geren","IsChargeFee":false,"HeadImg":"","Interesting":"","ConsumeMore":"","BelongTeam":"","OneCardNumber":"","ChargeForMan":"","IsChargeMan":false,"CompanyName":"","ContractID":-2147483648,"UserID":-2147483648,"TaxpayerNumber":"","CompanyInChargeMan":"","BusinessLicense":"","SellerProduct":"","IDCardAddress":"","IsDefaultDesc":"是","IsChargeFeeDesc":"否","IsChargeManDesc":"否","RelationTypeDesc":"业主","RelationPropertyDesc":"个人","IDCardTypeDesc":"身份证","BirthdayDesc":"","IsNew":false,"IsDirty":false,"IsDeleted":false,"IsValid":true,"ValidationErrors":[],"JsonIgnoreFields":null,"IsSaveRequired":false}],"total":1,"page":500,"dataTable":null,"footer":null}');
 */
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
        columns: [[
            { field: 'ck', checkbox: true },
            { field: 'FullName', title: '资源位置', width: 200 },
            { field: 'RoomName', title: '资源名称', width: 100 },
            { field: 'RelationPropertyDesc', title: '住户类别', width: 100 },
            { field: 'RelationTypeDesc', title: '住户标签', width: 100 },
            { field: 'RelateName', title: '住户姓名', width: 100 },
            { field: 'RelatePhoneNumber', title: '联系方式', width: 150 },
            { field: 'IsDefaultDesc', title: '默认联系人', width: 150 },
            { field: 'IsChargeManDesc', title: '缴费对象', width: 150 },
            { field: 'IsChargeFeeDesc', title: '缴费人员', width: 150 },
            { field: 'IDCardTypeDesc', title: '证件类别', width: 150 },
            { field: 'RelateIDCard', title: '证件号码', width: 150 },
        ]],
        toolbar: '#tt_mm'
    });
    SearchTT();
}
function SearchTT() {
    tt_CanLoad = true;
    var RoomIDs = [];
    var ProjectIDs = [];
    try {
        RoomIDs = GetSelectedRooms();
        ProjectIDs = GetSelectedProjects();
    } catch (e) {
    }
    $("#tt_table").datagrid("load", {
        "visit": "loadlrelatefamily",
        "keywords": $('#tdKeyword').searchbox('getValue'),
        "ProjectIDs": JSON.stringify(ProjectIDs),
        "RoomIDs": JSON.stringify(RoomIDs),
        "IsProjectUser": true,
        "sessionId":sessionId
    });
}
function do_choose() {
    var list = [];
    var row = $('#tt_table').datagrid('getSelected');
    if (row == null) {
        show_message('请选择用户', 'warning');
        return;
    }
    var UserID = (row.UserID > 0 ? row.UserID : 0);
    parent.hdUserID.val(UserID);
    parent.hdRelationID.val(row.ID);
    var userName = row.RelationName + "\r\n" + row.RelatePhoneNumber + "\r\n" + row.FullName + "-" + row.RoomName;
    parent.tdUserName.textbox('setValue', userName);
    try {
        parent.hdMemberLevelName.val(row.UserLevelName);
    } catch (e) {
    }
    do_close();
}
function do_close() {
    parent.do_close_dialog()
}