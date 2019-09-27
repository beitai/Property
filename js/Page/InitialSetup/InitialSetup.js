
var tt_CanLoad = false;
var isFirstLoad = true;
$(function () {
    loadTT();
});
function loadTT() {
    // == 不同业态之间的不同显示列
    /*v ar PropertyID = GetProjectPropertyID();
    isFirstLoad = false;
    if (!PropertyID) {
        return;
    }
    var options = { visit: 'loadtablecolumn', pagecode: 'roomsource', TableName: 'RoomBasic', PropertyID: PropertyID }; 
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: 'http://demo.saasyy.com/Handler/RoomResourceHandler.ashx',
        data: options,
        success: function (message) {
            message = {
                "status": true,
                "columns": "[[{field: 'ck', checkbox: true},{field: 'FullName', title: '资源位置', width: 260},{field: 'RelationName', title: '住户姓名', width: 80},{field: 'RelationIDCard', title: '证件号码', width: 200},{field: 'RelatePhoneNumber', title: '联系方式', width: 80},{field: 'RoomPropertyName', title: '房源属性', width: 100},{field: 'IDCardTypeDesc', title: '证件类型', width: 100},{field: 'BuildingArea', formatter: formatNumber, title: '计费面积', width: 80},{field: 'MoveInTime', formatter: formatTime, title: '入住日期', width: 80},{field: 'ZxStartTime', formatter: formatTime, title: '装修开始时间', width: 100},{field: 'ZxEndTime', formatter: formatTime, title: '装修验收时间', width: 100},{field: 'BuildOutArea', formatter: formatNumber, title: '建筑面积', width: 80},{field: 'IsChargeFeeDesc', title: '缴费人员', width: 150},{field: 'RoomBasicRemark', title: '资源备注', width: 150},{field: 'RoomPhoneRelationRemark', title: '客户备注', width: 150}]]"
            };
            if (message.status) {
                var finalcolumn = [];
                finalcolumn = eval(message.columns);
                //loadDataGrid(, '#tt_table');
                loadDataGrid({
                    url: '../Handler/RoomResourceHandler.ashx',
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
                    onDblClickRow: onDblClickRow,
                    columns: finalcolumn,
                    pageSize: global_variable.pageSize,
                    pageList: global_variable.pageList,
                    toolbar: '#tb'
                }, '#tt_table');
                SearchTT();
                return;
            }
            show_message('系统错误', 'error');
        }
    }); */


    var options = { visit: 'loadtablecolumn', pagecode: 'roomsource', TableName: 'RoomBasic', sessionId: sessionId };
    $.ajax({
        type: 'POST',
        dataType: 'json',
        // url: '../Handler/RoomResourceHandler.ashx',
        // url: 'http://demo.saasyy.com/Handler/RoomResourceHandler.ashx',
        url: window.SERVERPATH + "api/loadtablecolumn",
        data: options,
        success: function (message) {
            if (message.status) {
                var finalcolumn = [];

                // == 添加字符串格式话，还有去掉formatter方法的字符串
                var columns = JSON.stringify(message.columns);
                columns = columns.replace(/"formatNumber"/g, "formatNumber");
                columns = columns.replace(/"formatTime"/g, "formatTime");
                message.columns = columns;
                // ==

                finalcolumn = eval(message.columns);
                //loadDataGrid(, '#tt_table');
                loadDataGrid({
                    //    url: '../Handler/RoomResourceHandler.ashx',
                    //    url: '../mock/RoomResourceHandler-loadroomresourcelist.json',
                    url: window.SERVERPATH + 'api/loadroomresourcelist',
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
                    onDblClickRow: onDblClickRow,
                    columns: finalcolumn,
                    pageSize: global_variable.pageSize,
                    pageList: global_variable.pageList,
                    toolbar: '#tb'
                }, '#tt_table');
                return;
            }
            show_message('系统错误', 'error');
        }
    });
    /* $.ajax({
        type: 'POST',
        dataType: 'json',
        // url: '../Handler/RoomResourceHandler.ashx',
        url: 'http://demo.saasyy.com/Handler/RoomResourceHandler.ashx',
        data: options,
        success: function (message) {
            // ==== start 
            // message.status = true
            message = {
                "status": true,
                "columns": "[[{field: 'ck', checkbox: true},{field: 'FullName', title: '资源位置', width: 260},{field: 'RelationName', title: '住户姓名', width: 80},{field: 'RelationIDCard', title: '证件号码', width: 200},{field: 'RelatePhoneNumber', title: '联系方式', width: 80},{field: 'RoomPropertyName', title: '房源属性', width: 100},{field: 'IDCardTypeDesc', title: '证件类型', width: 100},{field: 'BuildingArea', formatter: formatNumber, title: '计费面积', width: 80},{field: 'MoveInTime', formatter: formatTime, title: '入住日期', width: 80},{field: 'ZxStartTime', formatter: formatTime, title: '装修开始时间', width: 100},{field: 'ZxEndTime', formatter: formatTime, title: '装修验收时间', width: 100},{field: 'BuildOutArea', formatter: formatNumber, title: '建筑面积', width: 80},{field: 'IsChargeFeeDesc', title: '缴费人员', width: 150},{field: 'RoomBasicRemark', title: '资源备注', width: 150},{field: 'RoomPhoneRelationRemark', title: '客户备注', width: 150}]]"
            };
            // console.log(message); 
            // console.log('==message==');
            // console.log(message);
            if (message.status) {
                var finalcolumn = [];
                finalcolumn = eval(message.columns);
                //loadDataGrid(, '#tt_table');
                loadDataGrid({
                    //    url: '../Handler/RoomResourceHandler.ashx',
                    //    url: '../mock/RoomResourceHandler-loadroomresourcelist.json',
                    url: window.SERVERPATH + 'api/loadroomresourcelist',
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
                    onDblClickRow: onDblClickRow,
                    columns: finalcolumn,
                    pageSize: global_variable.pageSize,
                    pageList: global_variable.pageList,
                    toolbar: '#tb'
                }, '#tt_table');
                return;
            }
            show_message('系统错误', 'error');
        }
    }); */
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
    var roomids = GetSelectedRooms();
    var projectid = GetSelectRadio();
    if (roomids.length == 0 && (projectid == null || projectid == "")) {
        show_message('请选择左侧资源', 'warning');
        return;
    }
    var projectids = [];
    if (projectid != null && projectid != "") {
        projectids.push(projectid);
    }
    hdRoomIDs.val(JSON.stringify(roomids));
    hdProjectID.val(JSON.stringify(projectids));
    var options = {
        "visit": "loadroomresourcelist",
        "RoomID": hdRoomIDs.val(),
        "ProjectID": hdProjectID.val(),
        "SearchAreas": hdSearchAreas.val(),
        "OwnerName": null,
        "OwnerPhoneNumber": null,
        "Keywords": tdKeyword.searchbox("getValue"),
        "sessionId": sessionId
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
        // url: '../Handler/RoomResourceHandler.ashx',
        url: 'http://demo.saasyy.com/Handler/RoomResourceHandler.ashx',
        data: options,
        success: function (data) {

            data = { "status": true, "downloadurl": "http://demo.saasyy.com/upload/ExcelExport/ExportFee/资源信息_20190828163722_导出.xlsx", "error": "" }

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
function onDblClickRow(index, row) {
    editRoomSource(row.RoomID, row.Name)
}
function do_dialog_comm_close(loadtree) {
    do_close_dialog();
    $("#tt_table").datagrid("reload");
    if (loadtree) {
        doSearch();
    }
}
function editRoomSource(RoomID, Name) {
    doOpenWin({
        title: '修改' + Name + '信息',
        // url: '../RoomResource/EditRoomResource.html?RoomID=' + RoomID
        url: '../RoomResource/EditRoomResource.html?RoomID=' + RoomID
    }, function () {
        $("#tt_table").datagrid("reload");
    });
}
function formatNumber(value, row) {
    if (value < 0) {
        return 0;
    }
    return value;
}
function formatMonth(value, row) {
    if (value == undefined || value == null || value == '0001-01-01T00:00:00.0000000' || value == '0001-01-01T00:00:00' || value == '1900-01-01T00:00:00.0000000' || value == '1900-01-01T00:00:00') {
        return "--";
    }
    return value.substring(0, 7);
}
function openImport() {
    doOpenWin({
        title: '导入房间信息',
        // url: '../RoomResource/ImportSource.html',
        url: '../RoomResource/ImportSource.html',
        width: '80%',
        height: "80%",
    }, function () {
        $("#tt_table").datagrid("reload");
    });
}
function editProject() {
    var iframe, Name;
    var rows = $("#tt_table").datagrid("getSelections");
    var fn;
    
    console.log('修改测试');
    console.log(rows);
    var projectid = GetSelectRadio();
    console.log(top.getNodeByParam(projectid));

    if (rows.length > 0) {
        Name = rows[0].Name;
        iframe = '../RoomResource/EditRoomResource.html?RoomID=' + rows[0].RoomID;
        fn = function () {
            $("#tt_table").datagrid("reload");
        };
    }
    else {
        var roomids = GetSelectedRooms();
        var winWidth = '80%';
        var winHeight = '80%';
        if (roomids.length == 0) {
            var projectid = GetSelectRadio();
            if (projectid == null || projectid == "") {
                show_message("请选择一个资源", "warning");
                return;
            }
            if (projectid == 1) {
                show_message("请选择一个资源", "warning");
                return;
            }
            var node = top.getNodeByParam(projectid);
            Name = node.name;
            // iframe = "../RoomResource/EditRoomName.html?ID=" + node.id;
            iframe = "./RoomResource/EditRoomName.html?ID=" + node.id;
            winWidth = '60%';
            winHeight = '80%';
            fn = function () {
                top.doSearch();
            };
        }
        else {
            var node = top.getNodeByParam(roomids[0]);
            Name = node.name;
            if (node.PName == "车位" || node.PName == "车辆" || node.PName == "地下室") {
                iframe = "../RoomResource/EditRoomName.html?ID=" + node.id;
                winWidth = '60%';
                winHeight = '80%';
                fn = function () {
                    top.doSearch();
                };
            }
            else {
                iframe = "../RoomResource/EditRoomResource.html?RoomID=" + node.id;
                fn = function () {
                    $("#tt_table").datagrid("reload");
                };
            }
        }
    }
    doOpenWin({
        title: '修改' + Name + '信息',
        url: iframe,
        width: winWidth,
        height: winHeight
    }, fn);
}
function saveFee() {
    var ImportFeeList = [];
    var rows = $('#tt_table').datagrid("getSelections");
    $.each(rows, function (index, row) {
        if (row.ChargeStatus == 1) {
            return true;
        }
        var rowIndex = $('#tt_table').datagrid('getRowIndex', row);
        $('#tt_table').datagrid('endEdit', rowIndex);
        ImportFeeList.push(row);
    });
    var options = { visit: 'saveimportfee', FeeType: 2, ImportFeeList: JSON.stringify(ImportFeeList) };
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '../Handler/ImportFeeHandler.ashx',
        data: options,
        success: function (message) {
            if (message.status) {
                show_message("修改成功", "success");
                $('#tt_table').datagrid("reload");
            }
            else {
                show_message('系统错误', 'error');
            }
        }
    });
}

// function GetProjectPropertyID() {
//     var PropertyID = 0;
//     var projectid = GetSelectRadio();
//     console.log('23333')
//     console.log(projectid);
//     if (projectid == null || projectid == "") {
//         if (isFirstLoad) {
//             return;
//         }
//         show_message("请选择一个业态", "warning");
//         return;
//     }
//     if (projectid == 1) {
//         if (isFirstLoad) {
//             return;
//         }
//         show_message("请选择一个业态", "warning");
//         return 0;
//     }
//     var node = top.getNodeByParam(projectid);
//     if (node.ParentID == 1 || node.ID == 1) {
//         if (isFirstLoad) {
//             return;
//         }
//         show_message("请选择一个业态", "warning");
//         return;
//     }
//     PropertyID = node.PropertyID;
//     // if (node.id == 1 || node.ID == 1) {
//     //     if (isFirstLoad) {
//     //         return;
//     //     }
//     //     show_message("请选择一个业态", "warning");
//     //     return;
//     // }
//     // PropertyID = node.id;
//     console.log('node');
//     console.log(node);
//     console.log(PropertyID);
//     return PropertyID;
// }
// function openTableSetUp() {
//     var PropertyID = GetProjectPropertyID();
//     console.log('id的数据测试');
//     console.log(PropertyID);
//     if (!PropertyID) {
//         return;
//     }
//     doOpenWin({
//         title: '资源档案列表设置',
//         url: '../SysSeting/TableSetUp.html?PageCode=roomsource&&TableName=RoomBasic&PropertyID=' + PropertyID,
//         width: '80%',
//         height: "80%",
//     }, function () {
//         loadTT();
//     });
// }

function openTableSetUp() {
    var iframe = "../SysSeting/TableSetUp.html?PageCode=roomsource&&TableName=RoomBasic";
    doOpenWin({
        title: '资源档案列表设置',
        url: '../SysSeting/TableSetUp.html?PageCode=roomsource&&TableName=RoomBasic',
        width: '80%',
        height: "80%",
    }, function () {
        loadTT();
    });
}

function openFieldSetUp() {
    doOpenWin({
        title: '参数设置',
        // url: '../InitialSetup/EditColumns.html',
        url: '../InitialSetup/EditColumns.html',
        width: '80%',
        height: "80%",
    });
}
function do_connection() {
    var RoomIDs = [];
    var rows = $("#tt_table").datagrid("getSelections");
    if (rows.length > 0) {
        $.each(rows, function (index, row) {
            RoomIDs.push(row.RoomID);
        })
    }
    if (RoomIDs.length <= 1) {
        show_message('请至少选择两个房间资源', 'info');
        return;
    }
    top.$.messager.confirm("提示", "确认关联选中的房源", function (r) {
        if (r) {
            var options = { visit: 'connectproject', RoomIDs: JSON.stringify(RoomIDs) };
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: '../Handler/ProjectHandler.ashx',
                data: options,
                success: function (message) {
                    if (message.status == 1) {
                        show_message('添加成功', 'success');
                        $("#tt_table").datagrid("reload");
                    }
                    else if (message.status == 2) {
                        show_message("选中房源已关联", "info");
                    }
                    else {
                        show_message('系统错误', 'error');
                    }
                }
            });
        }
    })
}
function do_approve() {
    var RoomIDs = [];
    var rows = $("#tt_table").datagrid("getSelections");
    if (rows.length > 0) {
        $.each(rows, function (index, row) {
            RoomIDs.push(row.RoomID);
        })
    }
    if (RoomIDs.length <= 0) {
        show_message('请至少选择一个房间资源', 'info');
        return;
    }
    top.$.messager.confirm("提示", "确认生效选中的房间修改信息？", function (r) {
        if (r) {
            var options = { visit: 'doapproveroombasicinfo', RoomIDs: JSON.stringify(RoomIDs) };
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: '../Handler/RoomResourceHandler.ashx',
                data: options,
                success: function (message) {
                    if (message.status == 1) {
                        show_message('操作成功', 'success');
                        $("#tt_table").datagrid("reload");
                    }
                    else if (message.error) {
                        show_message(message.error, "warning");
                    }
                    else {
                        show_message('系统错误', 'error');
                    }
                }
            });
        }
    })
}

