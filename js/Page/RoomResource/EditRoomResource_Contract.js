var home_CanLoad = false;
$(function () {
    loadHome();
});
function loadHome() {
    $('#tt_table').datagrid({
        url: '../Handler/RoomResourceHandler.ashx',
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
        pageSize: global_variable.pageSize,
        pageList: global_variable.pageList,
        columns: [[
            { field: 'ck', checkbox: true },
            { field: 'ContractNo', title: '合同编号', width: 100 },
            { field: 'ContractName', title: '合同名称', width: 100 },
            { field: 'RelationPropertyDesc', title: '租户类型', width: 100 },
            { field: 'RelationName', title: '租户名称', width: 100 },
            { field: 'RelatePhoneNumber', title: '联系电话', width: 100 },
            { field: 'RelationIDCardDesc', title: '证件类别', width: 100 },
            { field: 'IDCardTypeDesc', title: '证件号码', width: 100 },
            { field: 'CompanyInChargeMan', title: '法人代表', width: 100 },
            { field: 'BusinessLicense', title: '营业执照', width: 100 },
            { field: 'SellerProduct', title: '经营品类', width: 100 },
        ]],
        onBeforeLoad: function (data) {
            if (!home_CanLoad) {
                $('#tt_table').datagrid("loadData", {
                    total: 0,
                    rows: []
                });
            }
            return home_CanLoad;
        },
        onLoadError: function (data) {
            //alert("有错");
            $('#tt_table').datagrid("loadData", {
                total: 0,
                rows: []
            });
        },
        toolbar: '#tt_mm'
    });
    SearchTT()
}
function SearchTT() {
    home_CanLoad = true;
    $("#tt_table").datagrid("load", {
        "visit": "loadlrelatefamily",
        "RoomID": RoomID,
        "IsContractUser": true
    });
}
function do_view() {
    var row = $('#tt_table').datagrid('getSelected');
    if (row == null) {
        show_message("只能选择一个用户数据", "info");
        return;
    }
    var iframe = "../Contract/ContractUserEdit.aspx?ID=" + row.ID + "&op=view";
    do_open_dialog('合同用户修改', iframe);
}
