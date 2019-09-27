var ChargeDiscountList = [];
var SelectedContractID = 0;
$(function () {
    //加载
    var options = { visit: 'getroomstate' };
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: 'http://demo.saasyy.com/Handler/RoomResourceHandler.ashx',
        data: options,
        success: function (result) {
            result = { "status": true, "list": [{ "ID": 2, "Name": "已租", "BackColor": "#338156" }, { "ID": 7, "Name": "空置", "BackColor": "#66ACFF" }, { "ID": 18, "Name": "内部", "BackColor": "#00FFFF" }, { "ID": 19, "Name": "已住", "BackColor": "#662BFF" }, { "ID": 22, "Name": "装修中", "BackColor": "#FFFF56" }, { "ID": 23, "Name": "其他", "BackColor": "#660081" }, { "ID": 24, "Name": "招租", "BackColor": "#99ACFF" }, { "ID": 25, "Name": "已售", "BackColor": "#335681" }, { "ID": 26, "Name": "出租", "BackColor": "#CC2B56" }] }
            if (result.status) {
                $("#tbRoomStateDesc").combobox({
                    data: result.list,
                    valueField: 'ID',
                    textField: 'Name',
                    editable: false
                });
            }
            viewRoomFeeList();
        }
    });
});
function GetRoomIDList() {
    var roomids = GetSelectedRooms();
    if (Number(RoomID) > 0 && roomids.length == 0) {
        roomids.push(Number(RoomID));
    }
    return roomids;
}
function viewRoomFeeList() {
    var roomids = GetRoomIDList();
    if (roomids.length == 0) {
        return;
    }
    loadRoomObj();
    setTimeout(function () {
        checkWeiYueFuc();
    }, 500);
}
function checkWeiYueFuc() {
    var roomids = GetRoomIDList();
    if (roomids.length == 0) {
        return;
    }
    var options = { visit: 'checkweiyuestatus', RoomIDs: JSON.stringify(roomids) };
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '../Handler/ContractHandler.ashx',
        data: options,
        success: function (data) {
            SelectedContractID = 0;
            var currentiframe = $('#ChargeFrame');
            var iframesrc = "../Charge/ChargeFee_Bill.html";
            currentiframe.attr("src", iframesrc);
            var $height = $(window).height();
            //currentiframe.css("height", ($height - 90) + "px");
            setTimeout(function () {
                getContractTitleList(0);
            }, 500);
            setTimeout(function () {
                getPreChargeTitleList(0);
            }, 1000);
        }
    });
}
function viewRoomFeeHistoryList() {
    SelectedContractID = 0;
    var currentiframe = $('#ChargeFrame');
    var iframesrc = "../Charge/ChargeFee_History.html";
    currentiframe.attr("src", iframesrc);
    var $height = $(window).height();
    //currentiframe.css("height", ($height - 90) + "px");
}
function viewGuaranteeFeeList() {
    SelectedContractID = 0;
    var currentiframe = $('#ChargeFrame');
    var iframesrc = "../Charge/ChargeFee_Guarantee.html";
    currentiframe.attr("src", iframesrc);
    var $height = $(window).height();
    //currentiframe.css("height", ($height - 90) + "px");
}
function viewRoomFeeNote() {
    SelectedContractID = 0;
    var currentiframe = $('#ChargeFrame');
    var iframesrc = "../Charge/ChargeFee_Note.html";
    currentiframe.attr("src", iframesrc);
    var $height = $(window).height();
    //currentiframe.css("height", ($height - 90) + "px");
}
function viewContractFeeBill(ContractID) {
    var roomids = GetRoomIDList();
    if (roomids.length == 0) {
        return;
    }
    var options = { visit: 'checkweiyuestatus', RoomIDs: JSON.stringify(roomids) };
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '../Handler/ContractHandler.ashx',
        data: options,
        success: function (data) {
            SelectedContractID = ContractID;
            var currentiframe = $('#ChargeFrame');
            var iframesrc = "../Charge/ChargeFee_ContractBill.html?ContractID=" + ContractID;
            currentiframe.attr("src", iframesrc);
            var $height = $(window).height();
            //currentiframe.css("height", ($height - 90) + "px");
            loadRoomObj();
        }
    });
}
function viewPreFeeBill(ChargeID) {
    var currentiframe = $('#ChargeFrame');
    var iframesrc = "../Charge/ChargeFee_PreCharge.html?ChargeID=" + ChargeID;
    currentiframe.attr("src", iframesrc);
    var $height = $(window).height();
    //currentiframe.css("height", ($height - 90) + "px");
    GetBalance(ChargeID);
}
function GetBalance(ChargeID) {
    var roomids = GetRoomIDList();
    if (roomids.length == 0) {
        return;
    }
    var options = { visit: 'viewroombalance', RoomIDs: JSON.stringify(roomids), ChargeID: ChargeID };
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '../Handler/FeeCenterHandler.ashx',
        data: options,
        success: function (data) {
            if (data.status) {
                $("#BalanceFee_" + ChargeID).html(data.balance.toFixed(2));
            }
            else {
                $("#BalanceFee_" + ChargeID).html(0);
            }
        }
    });
}
function loadRoomObj() {
    var idarry = GetRoomIDList();
    if (idarry.length == 0) {
        return;
    }
    var options = { visit: 'loadroomresourceobj', RoomID: idarry[0], ContractID: SelectedContractID };
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '../Handler/RoomResourceHandler.ashx',
        data: options,
        success: function (message) {
            if (message.status) {
                if (message.notecount > 0) {
                    $('#note_img').show();
                }
                else {
                    $('#note_img').hide();
                }
                loadRoomBaiscInfo(message.data);
            }
        }
    });
}
function loadRoomBaiscInfo(data) {
    $("#tbRoomName").textbox("setValue", data.Name);
    $("#tbRoomOwner").combobox({
        data: data.RelationNameList,
        valueField: 'ID',
        textField: 'RelationName',
        onSelect: function (ret) {
            $("#tbOwnerPhone").textbox("setValue", ret.RelatePhoneNumber);
            $("#tdOwnerTitle").html((ret.RelationTypeDesc == "" ? "业主" : ret.RelationTypeDesc) + "：");
        }
    });
    if (data.RelationNameID > 0) {
        $("#tbRoomOwner").combobox("setValue", data.RelationNameID);
    }
    else {
        $("#tbRoomOwner").combobox("setValue", "");
    }
    $("#tbOwnerPhone").textbox("setValue", data.RelatePhoneNumber);
    $("#tdOwnerTitle").html((data.RelationTypeDesc == "" ? "业主" : data.RelationTypeDesc) + "：");
    $("#tbBuildingArea").textbox("setValue", (Number(data.BuildingArea) < 0 ? 0 : data.BuildingArea));
    if (data.RoomStateID > 0) {
        $("#tbRoomStateDesc").combobox("setValue", data.RoomStateID);
    }
    else {
        $("#tbRoomStateDesc").combobox("setValue", "");
    }
}
function saveRoomSource() {
    var RoomID = GetRoomIDList();
    if (RoomID.length == 0) {
        show_message("请选择一个资源", "warning");
        return;
    }
    var RoomName = $("#tbRoomName").textbox("getValue");
    var RoomOwner = $("#tbRoomOwner").combobox("getText");
    var OwnerPhone = $("#tbOwnerPhone").textbox("getValue");
    var BuildingArea = $("#tbBuildingArea").textbox("getValue");
    var RoomStateID = $("#tbRoomStateDesc").combobox("getValue");
    var RoomState = $("#tbRoomStateDesc").combobox("getText");
    if (RoomName == "") {
        show_message("资源编号不能为空", "warning");
        return;
    }
    var options = { visit: 'saveroombasicsource', RoomID: RoomID[0], RoomName: RoomName, RoomOwner: RoomOwner, OwnerPhone: OwnerPhone, BuildingArea: BuildingArea, RoomStateID: RoomStateID, RoomState: RoomState, ContractID: SelectedContractID };
    $.ajax({
        type: 'POST',
        dataType: 'Json',
        url: '../Handler/ProjectHandler.ashx',
        data: options,
        success: function (message) {
            if (message.status) {
                show_message("保存成功", "success");
                viewRoomFeeList();
                return;
            }
            show_message("保存失败", "error");
        }
    });
}
function EditSource() {
    var RoomID = GetRoomIDList();
    if (RoomID.length == 0) {
        show_message("请选择一个资源", "warning");
        return;
    }
    doOpenWin({
        title: '修改房间信息',
        url: '../RoomResource/EditRoomResource.html?RoomID=' + RoomID
    }, function () {
        loadRoomObj();
    });
}
function getContractTitleList(ContractID) {
    var hasContract = false;
    var $html = '';
    $('#contractfeelable').html($html);
    var roomids = GetRoomIDList();
    if (roomids.length == 0) {
        return;
    }
    var options = { visit: 'getcontractfeetitle', RoomIDs: JSON.stringify(roomids) };
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '../Handler/ContractHandler.ashx',
        data: options,
        success: function (data) {
            if (!data.status) {
                return;
            }
            $.each(data.list, function (index, item) {
                if (item.ContractID == ContractID) {
                    hasContract = true;
                }
                $html += '<a id="contract_' + item.ContractID + '" href="javascript:void(0)" onclick="viewContractFeeBill(' + item.ContractID + ')" class="opbtn easyui-linkbutton btntoolbar linebar" data-options="plain:true,iconCls:\'icon-hetong\'">合同收费(' + item.ContractName + ')</a>';
            })
            $('#contractfeelable').html($html);
            $.parser.parse($('#contractfeelable'));
            $(".opbtn").click(function () {
                var $this = $(this);
                var r = $(".opbtn");
                for (var i = 0; i < r.length; i++) {
                    if (!$(r[i]).hasClass("btn-white")) {
                        $(r[i]).addClass("btn-white");
                    }
                    $(r[i]).removeClass("btn-blue");
                }
                $this.removeClass("btn-white");
                $this.addClass("btn-blue");
            })
            if (hasContract) {
                $('#contract_' + ContractID).click();
            }
        }
    });
}
function getPreChargeTitleList(ChargeID) {
    var hasCharge = false;
    var $html = '';
    $('#prefeelable').html($html);
    var roomids = GetRoomIDList();
    if (roomids.length == 0) {
        return;
    }
    var options = { visit: 'getroomprechargebalancetitle', RoomIDs: JSON.stringify(roomids) };
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '../Handler/FeeCenterHandler.ashx',
        data: options,
        success: function (data) {
            if (!data.status) {
                return;
            }
            $.each(data.list, function (index, item) {
                if (item.ChargeID == ChargeID) {
                    hasCharge = true;
                }
                $html += ' <a id="charge_' + item.ChargeID + '" href="javascript:void(0)" onclick="viewPreFeeBill(' + item.ChargeID + ')" class="opbtn easyui-linkbutton btntoolbar linebar" data-options="plain:true,iconCls:\'icon-yushoukuan\'">预收款(' + item.ChargeName + ': <span id="BalanceFee_' + item.ChargeID + '">' + item.balance + '</span>)</a>';
            })
            $('#prefeelable').html($html);
            $.parser.parse($('#prefeelable'));
            $(".opbtn").click(function () {
                var $this = $(this);
                var r = $(".opbtn");
                for (var i = 0; i < r.length; i++) {
                    if (!$(r[i]).hasClass("btn-white")) {
                        $(r[i]).addClass("btn-white");
                    }
                    $(r[i]).removeClass("btn-blue");
                }
                $this.removeClass("btn-white");
                $this.addClass("btn-blue");
            })
            if (hasCharge) {
                $('#charge_' + ChargeID).click();
            }
        }
    });
}
function getBalanceFee(ChargeID) {
    return $('#BalanceFee_' + ChargeID).text();
}
