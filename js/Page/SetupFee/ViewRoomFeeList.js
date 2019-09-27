var tt_CanLoad = false;
$(function () {
    loadChargeNameCombox();
    //加载
});
function loadtt() {
    $('#tt_table').datagrid({
        // url: 'http://demo.saasyy.com/Handler/FeeCenterHandler.ashx', 
        url: '../mock/FeeCenterHandler-loadroomfeelist.json',
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
        //onClickCell: onClickCell,
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
        onLoadSuccess: function (data) {
            currentcount = data.currentcount || 0;
            var url = 'http://demo.saasyy.com/Handler/FeeCenterHandler.ashx?currentcount=' + currentcount;
            $("#tt_table").datagrid("options").url = url;
        },
        toolbar: '#tb'
    });
    //SearchTT();
}
function loadParams() {

}
function getRoomPropertyList() {
    var RoomPropertyList = [];
    RoomPropertyList.push({ ID: "", Name: "全部" });
    RoomPropertyList.push({ ID: "代扣", Name: "代扣" });
    RoomPropertyList.push({ ID: "自交", Name: "自交" });
    return RoomPropertyList;
}
function SearchTT() {
    var roomids = [];
    var projectid = '';
    try {
        roomids = GetSelectedRooms();
        projectid = GetSelectRadio();
    } catch (e) {
    }
    if (roomids.length == 0 && (projectid == null || projectid == "")) {
        show_message('请在左边导航菜单选择资源范围', 'warning');
        return;
    }
    var projectids = [];
    if (projectid != null && projectid != "") {
        projectids.push(projectid);
    }
    var keywords = KeywordsObj.searchbox("getValue");
    var ChargeSummarys = [];
    try {
        var ChargeID = ChargeIDObj.combobox("getValue");
        if (ChargeID != 0 && ChargeID != '') {
            ChargeSummarys.push(ChargeID);
        }
    } catch (e) {

    }
    var RoomProperty = $("#tdRoomProperty").combobox("getValue");
    var RoomPropertyList = [];
    if (RoomProperty != "") {
        RoomPropertyList.push(RoomProperty);
    }
    var RoomState = $("#tdRoomState").combobox("getValue");
    var RoomStateList = [];
    if (RoomState != "") {
        RoomStateList.push(RoomState);
    }
    var RoomStateList = [];
    if (RoomState != "") {
        RoomStateList.push(RoomState);
    }
    var RoomStateList = [];
    if (RoomState != "") {
        RoomStateList.push(RoomState);
    }
    // var url = 'http://demo.saasyy.com/Handler/FeeCenterHandler.ashx?currentcount=0';
    var url = '../mock/FeeCenterHandler-loadroomfeelist.json';
    $("#tt_table").datagrid("options").url = url;
    tt_CanLoad = true;
    $("#tt_table").datagrid("load", {
        "visit": "loadroomfeelist",
        "RoomID": JSON.stringify(roomids),
        "ProjectID": JSON.stringify(projectids),
        "IsToCharge": false,
        "ChargeSummarys": JSON.stringify(ChargeSummarys),
        "RoomPropertyList": JSON.stringify(RoomPropertyList),
        "keywords": keywords,
        "StartTimeState": $('#tdStartTimeState').combobox('getValue'),
        "StartTime": $('#tdSearchBoxStart').datebox('getValue'),
        "EndTime": $('#tdSearchBoxEnd').datebox('getValue'),
        "IsContractFee": true,
        "RoomStateList": JSON.stringify(RoomStateList)
    });
}
function getOptions() {
    var roomids = [];
    var projectid = '';
    try {
        roomids = GetSelectedRooms();
        projectid = GetSelectRadio();
    } catch (e) {
    }
    if (roomids.length == 0 && (projectid == null || projectid == "")) {
        show_message('请在左边导航菜单选择资源范围', 'warning');
        return null;
    }
    var projectids = [];
    if (projectid != null && projectid != "") {
        projectids.push(projectid);
    }
    var keywords = KeywordsObj.searchbox("getValue");
    var ChargeSummarys = [];
    try {
        var ChargeID = ChargeIDObj.combobox("getValue");
        if (ChargeID != 0 && ChargeID != '') {
            ChargeSummarys.push(ChargeID);
        }
    } catch (e) {

    }
    var RoomProperty = $("#tdRoomProperty").combobox("getValue");
    var RoomPropertyList = [];
    if (RoomProperty != "") {
        RoomPropertyList.push(RoomProperty);
    }
    var RoomState = $("#tdRoomState").combobox("getValue");
    var RoomStateList = [];
    if (RoomState != "") {
        RoomStateList.push(RoomState);
    }
    var RoomStateList = [];
    if (RoomState != "") {
        RoomStateList.push(RoomState);
    }
    var RoomStateList = [];
    if (RoomState != "") {
        RoomStateList.push(RoomState);
    }
    var options = {
        "visit": "loadroomfeelist",
        "RoomID": JSON.stringify(roomids),
        "ProjectID": JSON.stringify(projectids),
        "IsToCharge": false,
        "ChargeSummarys": JSON.stringify(ChargeSummarys),
        "RoomPropertyList": JSON.stringify(RoomPropertyList),
        "keywords": keywords,
        "StartTimeState": $('#tdStartTimeState').combobox('getValue'),
        "StartTime": $('#tdSearchBoxStart').datebox('getValue'),
        "EndTime": $('#tdSearchBoxEnd').datebox('getValue'),
        "IsContractFee": true,
        "RoomStateList": JSON.stringify(RoomStateList)
    };
    return options;
}
function loadChargeNameCombox() {
    var options = { visit: "loadviewroomfeelistparams" };
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: 'http://demo.saasyy.com/Handler/RoomResourceHandler.ashx',
        data: options,
        success: function (data) {

            data.status = true;

            if (data.status) {
                var datalist = [];
                ChargeIDObj.combobox({
                    editable: false,
                    data: data.summaries,
                    valueField: 'ID',
                    textField: 'Name',
                });
                $("#tdRoomProperty").combobox({
                    editable: false,
                    data: data.properties,
                    valueField: 'ID',
                    textField: 'Name'
                });
                $("#tdRoomState").combobox({
                    editable: false,
                    data: data.roomstates,
                    valueField: 'ID',
                    textField: 'Name'
                });
                loadtt();
            }
        }
    });
}
function EditFee() {
    var rows = $('#tt_table').datagrid("getSelections");
    if (rows.length == 0) {
        show_message("请选择一个资源", "warning");
        return;
    }
    if (rows.length > 1) {
        show_message("只能选择一个资源进行修改", "warning");
        return;
    }
    if (Number(rows[0].CuiShouCount) > 0) {
        show_message('此费项催收中，禁止修改', 'warning');
        return;
    }
    if (Number(rows[0].ContractID) > 0) {
        show_message('此费项由合同生成，禁止修改', 'warning');
        return;
    }
    if (rows[0].TotalFinalPayCost > 0) {
        show_message('此费项已部分收款，禁止修改', 'warning');
        return;
    }
    var Name = rows[0].Name;
    doOpenWin({
        title: '修改' + Name + '费项标准',
        url: '../SetupFee/EditRoomSourceFee.aspx?ID=' + rows[0].ID + '&op=edit',
        winParent: false,
        width: '80%',
        height: "80%",
    }, function () {
        $("#tt_table").datagrid("reload");
    });
}
function RemoveFee() {
    var rows = $('#tt_table').datagrid("getSelections");
    if (rows.length == 0) {
        show_message("请选择一个资源", "info");
        return;
    }
    var IDArry = [];
    var RoomIDArry = [];
    var ChargeIDArry = [];
    var is_cuishou = false;
    var is_contract = false;
    var is_charged = false;
    var i = 0;
    $.each(rows, function (index, row) {
        if (Number(row.CuiShouCount) > 0) {
            is_cuishou = true;
            i = index + 1;
            return false;
        }
        if (Number(row.ContractID) > 0) {
            is_contract = true;
            i = index + 1;
            return false;
        }
        if (Number(row.TotalFinalPayCost) > 0) {
            is_charged = true;
            i = index + 1;
            return false;
        }
        IDArry.push(row.ID);
        RoomIDArry.push(row.RoomID);
        ChargeIDArry.push(row.ChargeID);
    });
    if (is_cuishou) {
        show_message('选中的第' + i + '行费项催收中，不能删除', 'info');
        return;
    }
    if (is_contract) {
        show_message('选中的第' + i + '行费项标准由合同生成，不能删除', 'info');
        return;
    }
    if (is_charged) {
        show_message('选中的第' + i + '行费项标准由已部分收款，不能删除', 'info');
        return;
    }
    var options = { visit: "checkresourcehistoryfee", IDList: JSON.stringify(IDArry) };
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: 'http://demo.saasyy.com/Handler/FeeCenterHandler.ashx',
        data: options,
        success: function (data) {
            if (data.status) {
                top.$.messager.confirm("提示", "是否删除选中的资源费用?", function (r) {
                    if (r) {
                        DeleteRoomSourceFee(IDArry)
                    }
                })
                return;
            }
            if (data.error) {
                show_message(data.error, "info");
                return;
            }
            show_message("系统异常", "error");
        }
    });
}
function DeleteRoomSourceFee(IDArry) {
    MaskUtil.mask('body', '提交中');
    var options = { visit: "deleteroomsourcefee", IDList: JSON.stringify(IDArry) };
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: 'http://demo.saasyy.com/Handler/RoomResourceHandler.ashx',
        data: options,
        success: function (data) {
            MaskUtil.unmask();
            if (data.status) {
                show_message('删除成功', 'success', function () {
                    $('#tt_table').datagrid("reload");
                });
            }
            else {
                show_message('系统错误', 'error');
            }
        }
    });
}
function formatDecimal(value, row) {
    if (parseFloat(value) < 0) {
        return 0;
    }
    return value;
}
function formatDefaultChargeManName(value, row) {
    if (row.DefaultChargeManName == '') {
        row.DefaultChargeManName = row.Charge_RelationName;
    }
    return row.DefaultChargeManName;
}
function ImportRoomFeeTime() {
    var keywords = KeywordsObj.searchbox("getValue");
    var ChargeID = ChargeIDObj.combobox("getValue");
    doOpenWin({
        title: '导入费项开始日期',
        url: '../SetupFee/ImportStartTime.html?ChargeID=' + ChargeID + '&Keywords=' + keywords,
        winParent: false,
        width: '80%',
        height: "80%",
    }, function () {
        $("#tt_table").datagrid("reload");
    });
}
function stopFee() {
    //var RoomIDList = GetSelectedRooms();
    //var ProjectID = GetSelectRadio();
    //if (radioid != null && radioid != "") {
    //    idarry.push(Number(radioid));
    //}
    //if (RoomIDList.length == 0 && (ProjectID == null || ProjectID == "")) {
    //    show_message("请选择一个项目");
    //    return;
    //}
    //var ProjectIDList = [];
    //if (ProjectID != null && ProjectID != "") {
    //    ProjectIDList.push(ProjectID);
    //}
    var rows = $('#tt_table').datagrid("getSelections");
    if (rows.length == 0) {
        show_message("请选择一个费项档案", "warning");
        return;
    }
    var is_cuishou = false;
    var is_charged = false;
    var i = 0;
    var feeidarry = [];
    $.each(rows, function (index, item) {
        if (Number(item.CuiShouCount) > 0) {
            is_cuishou = true;
            i = index + 1;
            return false;
        }
        if (Number(item.TotalFinalPayCost) > 0) {
            is_charged = true;
            i = index + 1;
            return false;
        }
        feeidarry.push(item.ID);
    })
    if (is_cuishou) {
        show_message('选中的第' + i + '行费项催收中，禁止停用', 'info');
        return;
    }
    if (is_charged) {
        show_message('选中的第' + i + '行费项已部分收款，禁止停用', 'info');
        return;
    }
    if (feeidarry.length == 0) {
        show_message("请选择一个费项档案", "warning");
        return;
    }
    doOpenWin({
        title: '停用费项标准',
        url: '../SetupFee/StopFee.aspx',
        winParent: false,
        width: '80%',
        height: "80%",
    }, function () {
        $("#tt_table").datagrid("reload");
    });
}
function batchEdit() {
    var rows = $('#tt_table').datagrid("getSelections");
    if (rows.length == 0) {
        show_message("请至少选中一个费项记录", "warning");
        return;
    }
    var is_cuishou = false;
    var is_charged = false;
    var i = 0;
    $.each(rows, function (index, item) {
        if (Number(item.CuiShouCount) > 0) {
            is_cuishou = true;
            i = index + 1;
            return false;
        }
        if (Number(item.TotalFinalPayCost) > 0) {
            is_charged = true;
            i = index + 1;
            return false;
        }
    })
    if (is_cuishou) {
        show_message('选中的第' + i + '行费项催收中，禁止批处理', 'info');
        return;
    }
    if (is_charged) {
        show_message('选中的第' + i + '行费项已部分收款，禁止批处理', 'info');
        return;
    }
    doOpenWin({
        title: '批处理',
        url: '../SetupFee/BatchEdit.aspx',
        winParent: false,
        width: '80%',
        height: "80%",
    }, function () {
        $("#tt_table").datagrid("reload");
    });
}
function formatUnitPrice(value, row) {
    if (row.IsPriceRange) {
        return '<a>阶梯单价</a>';
    }
    return row.CalculateUnitPrice;
}

