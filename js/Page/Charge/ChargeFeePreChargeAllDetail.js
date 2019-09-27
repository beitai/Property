$(function () {
    getcomboboxparams();
    loadprechargeList();
})
function get_options() {
    var RoomIDs = parent.GetSelectedRooms();
    var ProjectIDs = parent.GetSelectedProjects();
    PreChargeID = $('#tdPreChargeSummary').combobox('getValue');
    if (PreChargeID == '') {
        show_message("请选择一个预收项目", "warning");
        return null;
    }
    var ChargeSummarys = $('#tdChargeSummary').combobox('getValues');
    var StartTime = $('#tdStartTime').datebox("getValue");
    var EndTime = $('#tdEndTime').datebox("getValue");
    var url = '../Handler/FeeCenterHandler.ashx?currentcount=0';
    $("#tt_table").datagrid("options").url = url;
    var options = {
        "visit": "loadroomfeelist",
        "RoomID": JSON.stringify(RoomIDs),
        "ProjectID": JSON.stringify(ProjectIDs),
        "ChargeSummarys": JSON.stringify(ChargeSummarys),
        "PreChargeID": PreChargeID,
        "StartTime": StartTime,
        "EndTime": EndTime
    };
    return options;
}
function getcomboboxparams() {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        data: { 'visit': 'getchargeprechargeallparams' },
        url: '../Handler/FeeCenterHandler.ashx',
        success: function (data) {
            $('#tdChargeSummary').combobox({
                editable: false,
                data: data.chargelist,
                valueField: 'ID',
                textField: 'Name',
                multiple: true
            });
            $('#tdPreChargeSummary').combobox({
                editable: false,
                data: data.prechargelist,
                valueField: 'ID',
                textField: 'Name'
            });
        }
    });
}
function chargechongdiroomfee() {
    var PreChargeID = $('#tdPreChargeSummary').combobox('getValue');
    dochargechongdiroomfee(PreChargeID, 1);
}