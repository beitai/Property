var navtype = 1;
var treeType = 4; //0-无左侧菜单 1-资源单选，房间多选（资源管理） 2-资源不可选，房间单选（收费中心） 4-资源和房间都多选（三表登记） 6-资源和房间都单选（新怎客服工单页面）7-公共资源树（公共资源） 11-仓库资源树（入库单） 12-资产部门资源树（资产管理） 13-物品分类资源树（物品管理） 14-仓库类别资源树（库存查询）
var treeID = 'tt';
var isTopMain = true;
$(function () {
    //doSearch();
    if (treeType == 1) {
        $('#labelALL').hide();
    } else {
        $('#labelALL').show();
    }
    $('#btnAll').bind('click', function () {
        var treeObj = $.fn.zTree.getZTreeObj(treeID);
        if ($('#btnAll').prop('checked')) {
            treeObj.checkAllNodes(true);
        }
        else {
            treeObj.checkAllNodes(false);
        }
    })
});
function loadZTree(loadData, isMain) {
    isTopMain = isMain;
    treeID = 'tt_' + treeType;
    if (loadData) {
        loadTree();
    }
    if (treeType == 12 || treeType == 13) {
        $('#tree_opt').show();
    } else {
        $('#tree_opt').hide();
    }
}
function GetSelectedID() {
    var ID = 0;
    var treeObj = $.fn.zTree.getZTreeObj(treeID);
    if (treeType == 11) {
        var r = $('#' + treeID + ' input[type=radio]');
        for (var i = 0; i < r.length; i++) {
            if (r[i].checked) {
                ID = $(r[i]).attr("id");
            }
        }
    }
    else if (treeType == 12 || treeType == 13) {
        var idarry = [];
        var nodes = treeObj.getCheckedNodes(true);
        $.each(nodes, function (index, node) {
            if (Number(node.ID) > 0) {
                idarry.push(node.ID);
            }
        })
        return idarry;
    }
    return ID;
}
function GetSelected() {
    var idarry = [];
    var radioid = GetSelectRadio();
    if (radioid != null && radioid != "") {
        idarry.push(Number(radioid));
    }
    var r = $('#' + treeID + ' input[name="checkbox_0"]');
    for (var i = 0; i < r.length; i++) {
        if (r[i].checked) {
            var checkid = $(r[i]).attr("id");
            idarry.push(Number(checkid));
        }
    }
    return idarry;
}
function GetSelectedIDs(type) {
    var idarry = [];
    var treeObj = $.fn.zTree.getZTreeObj(treeID);
    if (treeType == 14) {
        var nodes = treeObj.getCheckedNodes(true);
        $.each(nodes, function (index, node) {
            if (node.type == type) {
                if (node.ID != 1) {
                    idarry.push(node.ID);
                }
            }
        })
    }
    return idarry;
}
function GetSelectedType() {
    var type = "";
    var treeObj = $.fn.zTree.getZTreeObj(treeID);
    if (treeType == 11) {
        var r = $('#' + treeID + ' input[type=radio]');
        for (var i = 0; i < r.length; i++) {
            if (r[i].checked) {
                type = $(r[i]).attr("ptype");
            }
        }
    }
    return type;
}
function getNodeByParam(id) {
    var treeObj = $.fn.zTree.getZTreeObj(treeID);
    return treeObj.getNodeByParam("id", id, null);
}
function getSelectedNodes() {
    var treeObj = $.fn.zTree.getZTreeObj(treeID);
    return treeObj.getSelectedNodes();
}
function GetALLSelectedProjects() {
    var idarry = [];
    var pidarray = [];
    var treeObj = $.fn.zTree.getZTreeObj(treeID);
    var nodes = treeObj.getCheckedNodes(true);
    $.each(nodes, function (index, node) {
        if (node.isParent && node.type == 'project') {
            idarry.push(node.id);
        }
    });
    return idarry;
}
function GetSelectedProjects() {
    if (treeType == 7) {
        var idarry = [];
        var r = document.getElementsByName('checkbox_0');
        for (var i = 0; i < r.length; i++) {
            if (r[i].checked) {
                var Type = $(r[i]).attr("data-type");
                if (Type == 'xiaoqu') {
                    var ID = $(r[i]).attr("data-id");
                    idarry.push(Number(ID));
                }
            }
        }
        return idarry;
    } else {
        var idarry = [];
        var pidarray = [];
        var treeObj = $.fn.zTree.getZTreeObj(treeID);
        var nodes = treeObj.getCheckedNodes(true);
        $.each(nodes, function (index, node) {
            if (node.isParent && node.type == 'project') {
                idarry.push(node.id);
                if (node.pId && $.inArray(node.pId, pidarray) == -1) {
                    pidarray.push(node.pId);
                }
            }
        });
        var temp = [];
        var temparray = [];
        for (var i = 0; i < pidarray.length; i++) {
            temp[pidarray[i]] = true;
        };
        for (var i = 0; i < idarry.length; i++) {
            if (!temp[idarry[i]]) {
                temparray.push(idarry[i]);
            };
        };
        return temparray;
    }
}
function GetNav7SelectedProjects() {
    var idarry = [];
    var r = $('#' + treeID + ' input[name="checkbox_0"]');
    for (var i = 0; i < r.length; i++) {
        if (r[i].checked) {
            var Type = $(r[i]).attr("data-type");
            if (Type == 'xiaoqu') {
                var ID = $(r[i]).attr("data-id");
                idarry.push(Number(ID));
            }
        }
    }
    return idarry;
}
function GetNav7SelectedPublicProjects() {
    var idarry = [];
    var r = $('#' + treeID + ' input[name="checkbox_0"]');
    for (var i = 0; i < r.length; i++) {
        if (r[i].checked) {
            var Type = $(r[i]).attr("data-type");
            if (Type == 'publicproject') {
                var ID = $(r[i]).attr("data-id");
                idarry.push(Number(ID));
            }
        }
    }
    return idarry;
}
function GetSelectChargeCheck() {
    var idarry = [];
    var r = $('#' + treeID + ' input[name="checkbox_0"]');
    for (var i = 0; i < r.length; i++) {
        if (r[i].checked) {
            var checkid = $(r[i]).attr("id");
            var treeObj = $.fn.zTree.getZTreeObj(treeID);
            var node = treeObj.getNodeByParam("id", checkid, null);
            if (!node.isRoom) {
                idarry.push(Number(checkid));
            }
        }
    }
    return idarry;
}
function getCheckedRadio(radioName) {
    var r = $('#' + treeID + ' input[name="' + radioName + '"]');
    for (var i = 0; i < r.length; i++) {
        if (r[i].checked) {
            return $(r[i]);
        }
    }
    return null;
}
function GetSelectRadio() {
    var radio = $('#' + treeID + ' input[name="radio_0"]:checked ');
    var radioid = $(radio).attr("id");
    if (radioid != null && radioid != "") {
        return Number(radioid);
    }
    return "";
}
function GetSelectedRooms() {
    var idarry = [];
    if (treeType == 1 || treeType == 2) {
        var r = $('#' + treeID + ' input[name="checkbox_0"]');
        for (var i = 0; i < r.length; i++) {
            if (r[i].checked) {
                var checkid = $(r[i]).attr("id");
                idarry.push(Number(checkid));
            }
        }
    } else if (treeType == 6) {
        var zTree = $.fn.zTree.getZTreeObj(treeID);
        var nodes = treeObj.getCheckedNodes(true);
        $.each(nodes, function (index, node) {
            if (!node.isParent) {
                idlist.push(node.id);
            }
        })
    } else {
        var treeObj = $.fn.zTree.getZTreeObj(treeID);
        var nodes = treeObj.getCheckedNodes(true);
        $.each(nodes, function (index, node) {
            if (!node.isParent) {
                idarry.push(node.id);
            }
        })
    }
    return idarry;
}
function GetSelectRoomName() {
    var idarray = GetSelectedRooms();
    if (idarray.length == 0) {
        return "";
    }
    var treeObj = $.fn.zTree.getZTreeObj(treeID);
    var node = treeObj.getNodeByParam("id", idarray[0], null);
    return node.name;
}
function GetSelectedCompanyIDs() {
    var idarry = [];
    var treeObj = $.fn.zTree.getZTreeObj(treeID);
    var nodes = treeObj.getCheckedNodes(true);
    $.each(nodes, function (index, node) {
        if (node.isParent && node.type == 'company') {
            idarry.push(node.id);
        }
    });
    return idarry;
}
function GetSelectProjectID() {
    var radio = $('#' + treeID + ' input[name="radio_0"]:checked ');
    var radioid = $(radio).attr("id");
    var Type = $(radio).attr("data-type");
    if (radioid != null && radioid != "" && Type == 'project') {
        return Number(radioid);
    }
    return "";
}
function GetSelectCompanyID() {
    var radio = $('#' + treeID + ' input[name="radio_0"]:checked ');
    var radioid = $(radio).attr("id");
    var Type = $(radio).attr("data-type");
    if (radioid != null && radioid != "" && Type == 'company') {
        return Number(radioid);
    }
    return "";
}
function GetSelectedPublicProjects() {
    if (treeType == 7) {
        var idarry = [];
        var r = document.getElementsByName('checkbox_0');
        for (var i = 0; i < r.length; i++) {
            if (r[i].checked) {
                var Type = $(r[i]).attr("data-type");
                if (Type == 'publicproject') {
                    var ID = $(r[i]).attr("data-id");
                    idarry.push(Number(ID));
                }
            }
        }
        return idarry;
    } else {
        var idarry = [];
        var pidarray = [];
        var treeObj = $.fn.zTree.getZTreeObj(treeID);
        var nodes = treeObj.getCheckedNodes(true);
        $.each(nodes, function (index, node) {
            if (node.isParent && node.type == 'publicproject') {
                idarry.push(node.ID);
                if (node.ParentID && $.inArray(node.ParentID, pidarray) == -1) {
                    pidarray.push(node.ParentID);
                }
            }
        });
        var temp = [];
        var temparray = [];
        for (var i = 0; i < pidarray.length; i++) {
            temp[pidarray[i]] = true;
        };
        for (var i = 0; i < idarry.length; i++) {
            if (!temp[idarry[i]]) {
                temparray.push(idarry[i]);
            };
        };
        return temparray;
    }
}
function GetNav8SelectRadio() {
    var radio = $('#' + treeID + ' input[name="radio_0"]:checked ');
    var radioid = $(radio).attr("data-id");
    var type = $(radio).attr("data-type");
    if (radioid != null && radioid != "" && type == 'department') {
        return Number(radioid);
    }
    return "";
}
function GetNav8SelectCompanyID() {
    var radio = $('#' + treeID + ' input[name="radio_0"]:checked ');
    var radioid = $(radio).attr("data-id");
    var type = $(radio).attr("data-type");
    if (radioid != null && radioid != "" && type == 'company') {
        return Number(radioid);
    }
    return "";
}
function GetNav8SelectType() {
    var radio = $('#' + treeID + ' input[name="radio_0"]:checked ');
    var type = $(radio).attr("data-type");
    return type;
}
function GetNav8SelectParentID() {
    var radio = $('#' + treeID + ' input[name="radio_0"]:checked ');
    var radioid = $(radio).attr("p_id");
    if (radioid != null && radioid != "") {
        return Number(radioid);
    }
    return "";
}
function getNav8CheckedRadio(radioName) {
    var r = $('#' + treeID + ' input[name="' + radioName + '"]');
    for (var i = 0; i < r.length; i++) {
        if (r[i].checked) {
            return $(r[i]);
        }
    }
    return null;
}
var IDMark_A = "_a";
function getSetting() {
    var setting = {
        async: {
            enable: true,
            url: getUrl,
            dataFilter: filter //异步返回后经过Filter 
        },
        view: {
            showIcon: false
        },
        data: {
            simpleData: {
                enable: true
            },
            keep: {
                parent: true
            }
        },
        check: {
            enable: true
        },
        callback: {
            onClick: onClick,
            onCheck: onCheck,
            beforeExpand: beforeExpand,
            beforeCollapse: beforeCollapse,
            onAsyncSuccess: onAsyncSuccess,
            onAsyncError: onAsyncError
        }
    }
    if (treeType == 1) {
        setting.view = {
            addDiyDom: addDiyDom,
            dblClickExpand: false,
            selectedMulti: true,
            showIcon: false
        };
        setting.check = {
            enable: false
        }
    } else if (treeType == 2) {
        setting.view = {
            addDiyDom: addDiyDom,
            dblClickExpand: true,
            selectedMulti: true,
            showIcon: false
        };
        setting.check = {
            enable: false
        }
    } else if (treeType == 6) {
        setting.view = {
            dblClickExpand: true,
            showIcon: false
        };
        setting.check = {
            enable: true,
            chkStyle: "radio",
            radioType: "all"
        }

    } else if (treeType == 7) {
        setting.view = {
            addDiyDom: addDiyDom,
            dblClickExpand: true,
            selectedMulti: true,
            showIcon: false
        };
        setting.check = {
            enable: false
        }
    } else if (treeType == 11) {
        setting = {
            view: {
                addDiyDom: addDiyDom,
                dblClickExpand: true,
                selectedMulti: true,
                showIcon: false
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            check: {
                enable: false
            },
            callback: {
                onClick: onClick
            }
        };
    } else if (treeType == 12) {
        setting = {
            view: {
                dblClickExpand: true,
                selectedMulti: true,
                showIcon: false
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            check: {
                enable: true,
                chkboxType: { "Y": "s", "N": "s" }
            }
        };
    } else if (treeType == 13) {
        setting = {
            view: {
                dblClickExpand: true,
                selectedMulti: true,
                showIcon: false
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            check: {
                enable: true,
                chkboxType: { "Y": "s", "N": "s" }
            }
        };
    } else if (treeType == 14) {
        setting = {
            view: {
                dblClickExpand: true,
                selectedMulti: true,
                showIcon: false
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            check: {
                enable: true,
                chkboxType: { "Y": "s", "N": "s" }
            },
            callback: {
                onClick: onClick
            }
        }
    }
    else {
        setting.check = {
            enable: true,
            chkboxType: { "Y": "s", "N": "s" }
        }
    }
    setting.view.dblClickExpand = true;
    return setting;
}
function loadTree() {
    doSearch();
}
function filter(treeId, parentNode, childNodes) {
    childNodes = childNodes.list;
    // console.log("===== Start 过滤的方法 =====");
    // console.log(treeId);
    // console.log(parentNode);
    // console.log(childNodes);
    // if (parentNode.TypeDesc == "住宅") {
    //     childNodes = [{ "ID": 2324514, "ParentID": 2324513, "Name": "1栋", "FullName": "碧桂园-住宅-1栋", "IconID": 3, "IsLocked": false, "isParent": true, "OrgnizationID": 0, "RoleID": 0, "OrderNumberID": 0, "MsgID": 0, "TypeDesc": "楼栋", "UserID": 0, "name": "1栋", "id": 2324514, "pId": 2324513, "type": "project", "iconSkin": "Icon_3", "open": true, "isRoom": false, "chkDisabled": false }, { "ID": 2324637, "ParentID": 2324513, "Name": "2栋", "FullName": "碧桂园-住宅-2栋", "IconID": 3, "IsLocked": false, "isParent": true, "OrgnizationID": 0, "RoleID": 0, "OrderNumberID": 0, "MsgID": 0, "TypeDesc": "楼栋", "UserID": 0, "name": "2栋", "id": 2324637, "pId": 2324513, "type": "project", "iconSkin": "Icon_3", "open": true, "isRoom": false, "chkDisabled": false }, { "ID": 2324800, "ParentID": 2324513, "Name": "3栋", "FullName": "碧桂园-住宅-3栋", "IconID": 3, "IsLocked": false, "isParent": true, "OrgnizationID": 0, "RoleID": 0, "OrderNumberID": 0, "MsgID": 0, "TypeDesc": "楼栋", "UserID": 0, "name": "3栋", "id": 2324800, "pId": 2324513, "type": "project", "iconSkin": "Icon_3", "open": true, "isRoom": false, "chkDisabled": false }, { "ID": 2380708, "ParentID": 2324513, "Name": "4栋", "FullName": "碧桂园-住宅-4栋", "IconID": 3, "IsLocked": false, "isParent": true, "OrgnizationID": 0, "RoleID": 0, "OrderNumberID": 0, "MsgID": 0, "TypeDesc": "楼栋", "UserID": 0, "name": "4栋", "id": 2380708, "pId": 2324513, "type": "project", "iconSkin": "Icon_3", "open": true, "isRoom": false, "chkDisabled": false }]
    // } else if (parentNode.TypeDesc == "楼栋") {
    //     childNodes = [{ "ID": 2324515, "ParentID": 2324514, "Name": "1单元", "FullName": "碧桂园-住宅-1栋-1单元", "IconID": 4, "IsLocked": false, "isParent": true, "OrgnizationID": 0, "RoleID": 0, "OrderNumberID": 0, "MsgID": 0, "TypeDesc": "单元", "UserID": 0, "name": "1单元", "id": 2324515, "pId": 2324514, "type": "project", "iconSkin": "Icon_4", "open": true, "isRoom": false, "chkDisabled": false }, { "ID": 2324576, "ParentID": 2324514, "Name": "2单元", "FullName": "碧桂园-住宅-1栋-2单元", "IconID": 4, "IsLocked": false, "isParent": true, "OrgnizationID": 0, "RoleID": 0, "OrderNumberID": 0, "MsgID": 0, "TypeDesc": "单元", "UserID": 0, "name": "2单元", "id": 2324576, "pId": 2324514, "type": "project", "iconSkin": "Icon_4", "open": true, "isRoom": false, "chkDisabled": false }]
    // } else if (parentNode.TypeDesc == "单元") {
    //     childNodes = [{ "ID": 2324516, "ParentID": 2324515, "Name": "1层", "FullName": "碧桂园-住宅-1栋-1单元-1层", "IconID": 5, "IsLocked": false, "isParent": true, "OrgnizationID": 0, "RoleID": 0, "OrderNumberID": 0, "MsgID": 0, "TypeDesc": "楼层", "UserID": 0, "name": "1层", "id": 2324516, "pId": 2324515, "type": "project", "iconSkin": "Icon_5", "open": true, "isRoom": false, "chkDisabled": false }, { "ID": 2324521, "ParentID": 2324515, "Name": "2层", "FullName": "碧桂园-住宅-1栋-1单元-2层", "IconID": 5, "IsLocked": false, "isParent": true, "OrgnizationID": 0, "RoleID": 0, "OrderNumberID": 0, "MsgID": 0, "TypeDesc": "楼层", "UserID": 0, "name": "2层", "id": 2324521, "pId": 2324515, "type": "project", "iconSkin": "Icon_5", "open": true, "isRoom": false, "chkDisabled": false }, { "ID": 2324526, "ParentID": 2324515, "Name": "3层", "FullName": "碧桂园-住宅-1栋-1单元-3层", "IconID": 5, "IsLocked": false, "isParent": true, "OrgnizationID": 0, "RoleID": 0, "OrderNumberID": 0, "MsgID": 0, "TypeDesc": "楼层", "UserID": 0, "name": "3层", "id": 2324526, "pId": 2324515, "type": "project", "iconSkin": "Icon_5", "open": true, "isRoom": false, "chkDisabled": false }, { "ID": 2324531, "ParentID": 2324515, "Name": "4层", "FullName": "碧桂园-住宅-1栋-1单元-4层", "IconID": 5, "IsLocked": false, "isParent": true, "OrgnizationID": 0, "RoleID": 0, "OrderNumberID": 0, "MsgID": 0, "TypeDesc": "楼层", "UserID": 0, "name": "4层", "id": 2324531, "pId": 2324515, "type": "project", "iconSkin": "Icon_5", "open": true, "isRoom": false, "chkDisabled": false }, { "ID": 2324536, "ParentID": 2324515, "Name": "5层", "FullName": "碧桂园-住宅-1栋-1单元-5层", "IconID": 5, "IsLocked": false, "isParent": true, "OrgnizationID": 0, "RoleID": 0, "OrderNumberID": 0, "MsgID": 0, "TypeDesc": "楼层", "UserID": 0, "name": "5层", "id": 2324536, "pId": 2324515, "type": "project", "iconSkin": "Icon_5", "open": true, "isRoom": false, "chkDisabled": false }, { "ID": 2324541, "ParentID": 2324515, "Name": "6层", "FullName": "碧桂园-住宅-1栋-1单元-6层", "IconID": 5, "IsLocked": false, "isParent": true, "OrgnizationID": 0, "RoleID": 0, "OrderNumberID": 0, "MsgID": 0, "TypeDesc": "楼层", "UserID": 0, "name": "6层", "id": 2324541, "pId": 2324515, "type": "project", "iconSkin": "Icon_5", "open": true, "isRoom": false, "chkDisabled": false }, { "ID": 2324546, "ParentID": 2324515, "Name": "7层", "FullName": "碧桂园-住宅-1栋-1单元-7层", "IconID": 5, "IsLocked": false, "isParent": true, "OrgnizationID": 0, "RoleID": 0, "OrderNumberID": 0, "MsgID": 0, "TypeDesc": "楼层", "UserID": 0, "name": "7层", "id": 2324546, "pId": 2324515, "type": "project", "iconSkin": "Icon_5", "open": true, "isRoom": false, "chkDisabled": false }, { "ID": 2324551, "ParentID": 2324515, "Name": "8层", "FullName": "碧桂园-住宅-1栋-1单元-8层", "IconID": 5, "IsLocked": false, "isParent": true, "OrgnizationID": 0, "RoleID": 0, "OrderNumberID": 0, "MsgID": 0, "TypeDesc": "楼层", "UserID": 0, "name": "8层", "id": 2324551, "pId": 2324515, "type": "project", "iconSkin": "Icon_5", "open": true, "isRoom": false, "chkDisabled": false }, { "ID": 2324556, "ParentID": 2324515, "Name": "9层", "FullName": "碧桂园-住宅-1栋-1单元-9层", "IconID": 5, "IsLocked": false, "isParent": true, "OrgnizationID": 0, "RoleID": 0, "OrderNumberID": 0, "MsgID": 0, "TypeDesc": "楼层", "UserID": 0, "name": "9层", "id": 2324556, "pId": 2324515, "type": "project", "iconSkin": "Icon_5", "open": true, "isRoom": false, "chkDisabled": false }, { "ID": 2324561, "ParentID": 2324515, "Name": "10层", "FullName": "碧桂园-住宅-1栋-1单元-10层", "IconID": 5, "IsLocked": false, "isParent": true, "OrgnizationID": 0, "RoleID": 0, "OrderNumberID": 0, "MsgID": 0, "TypeDesc": "楼层", "UserID": 0, "name": "10层", "id": 2324561, "pId": 2324515, "type": "project", "iconSkin": "Icon_5", "open": true, "isRoom": false, "chkDisabled": false }, { "ID": 2324566, "ParentID": 2324515, "Name": "11层", "FullName": "碧桂园-住宅-1栋-1单元-11层", "IconID": 5, "IsLocked": false, "isParent": true, "OrgnizationID": 0, "RoleID": 0, "OrderNumberID": 0, "MsgID": 0, "TypeDesc": "楼层", "UserID": 0, "name": "11层", "id": 2324566, "pId": 2324515, "type": "project", "iconSkin": "Icon_5", "open": true, "isRoom": false, "chkDisabled": false }, { "ID": 2324571, "ParentID": 2324515, "Name": "12层", "FullName": "碧桂园-住宅-1栋-1单元-12层", "IconID": 5, "IsLocked": false, "isParent": true, "OrgnizationID": 0, "RoleID": 0, "OrderNumberID": 0, "MsgID": 0, "TypeDesc": "楼层", "UserID": 0, "name": "12层", "id": 2324571, "pId": 2324515, "type": "project", "iconSkin": "Icon_5", "open": true, "isRoom": false, "chkDisabled": false }]
    // } else if (parentNode.TypeDesc == "楼层") {
    //     childNodes = [{ "ID": 2324517, "ParentID": 2324516, "Name": "1-1-101", "FullName": "碧桂园-住宅-1栋-1单元-1层", "IconID": 6, "IsLocked": false, "isParent": false, "OrgnizationID": 0, "RoleID": 0, "OrderNumberID": 0, "MsgID": 0, "TypeDesc": "房间", "UserID": 0, "name": "1-1-101", "id": 2324517, "pId": 2324516, "type": "project", "iconSkin": "Icon_6", "open": true, "isRoom": true, "chkDisabled": false }, { "ID": 2324518, "ParentID": 2324516, "Name": "1-1-102", "FullName": "碧桂园-住宅-1栋-1单元-1层", "IconID": 6, "IsLocked": false, "isParent": false, "OrgnizationID": 0, "RoleID": 0, "OrderNumberID": 0, "MsgID": 0, "TypeDesc": "房间", "UserID": 0, "name": "1-1-102", "id": 2324518, "pId": 2324516, "type": "project", "iconSkin": "Icon_6", "open": true, "isRoom": true, "chkDisabled": false }, { "ID": 2324519, "ParentID": 2324516, "Name": "1-1-103", "FullName": "碧桂园-住宅-1栋-1单元-1层", "IconID": 6, "IsLocked": false, "isParent": false, "OrgnizationID": 0, "RoleID": 0, "OrderNumberID": 0, "MsgID": 0, "TypeDesc": "房间", "UserID": 0, "name": "1-1-103", "id": 2324519, "pId": 2324516, "type": "project", "iconSkin": "Icon_6", "open": true, "isRoom": true, "chkDisabled": false }, { "ID": 2324520, "ParentID": 2324516, "Name": "1-1-104", "FullName": "碧桂园-住宅-1栋-1单元-1层", "IconID": 6, "IsLocked": false, "isParent": false, "OrgnizationID": 0, "RoleID": 0, "OrderNumberID": 0, "MsgID": 0, "TypeDesc": "房间", "UserID": 0, "name": "1-1-104", "id": 2324520, "pId": 2324516, "type": "project", "iconSkin": "Icon_6", "open": true, "isRoom": true, "chkDisabled": false }]
    // }
    // console.log(childNodes);
    // console.log("===== End =====");
    return childNodes;

}
function getUrl(treeId, treeNode) {
    /*    console.log('getUrl');
       console.log(treeId);
       console.log(treeNode); */
    var param = '';
    if (treeType == 7) {
        var ParentID = 0;
        var ParentProjectID = 0;
        var islastproject = false;
        if (treeNode.Type == 'xiaoqu') {
            ParentID = 0;
            ParentProjectID = treeNode.ID;
            islastproject = treeNode.islastproject;
        }
        if (treeNode.Type == 'publicproject') {
            ParentID = treeNode.ID;
            ParentProjectID = treeNode.ParentProjectID;
        }
        param = "visit=getpublicprojecttree&ParentID=" + ParentID + "&ParentProjectID=" + ParentProjectID + "&islastproject=" + islastproject;
    } else {
        var CompanyID = 0;
        var PublicID = 0;
        var ID = 0;
        var IncludePublic = "false";
        if (treeNode.type == 'company') {
            CompanyID = treeNode.ID;
            ID = 1;
        }
        else {
            if (navtype == 2) {
                IncludePublic = "true";
                if (treeNode.type == 'publicproject') {
                    PublicID = treeNode.ID;
                }
                else {
                    ID = treeNode.id;
                }
            } else {
                ID = treeNode.id;
            }
        }
        param = "visit=getprojectinfo&ID=" + ID + "&IncludePublic=" + IncludePublic + "&PublicID=" + PublicID + '&CompanyID=' + CompanyID + "&sessionId=" + sessionId;
    }
    // var postUrl = "Handler/ProjectHandler.ashx?" + param;
    // var postUrl = "http://demo.saasyy.com/Handler/ProjectHandler.ashx?" + param;
    var postUrl = window.SERVERPATH + "api/getprojectinfo?" + param;
    /* if (isTopMain) {
        postUrl = './' + postUrl;
    } else {
        postUrl = '../' + postUrl;
    } */
    return postUrl;
}
function beforeCollapse(treeId, treeNode) {
    var treeObj = $.fn.zTree.getZTreeObj(treeID);
    treeObj.removeChildNodes(treeNode);
}
function beforeExpand(treeId, treeNode) {
    if (!treeNode.isAjaxing) {
        treeNode.times = 1;
        ajaxGetNodes(treeNode, "refresh");
        return true;
    } else {
        alert("zTree 正在下载数据中，请稍后展开节点。。。");
        return false;
    }
    console.log('22');
}
function onAsyncSuccess(event, treeId, treeNode, msg) {
    /* console.log('调用成功');
    console.log(event);
    console.log(treeId);
    console.log(treeNode);
    console.log(msg);
    console.log($.fn.zTree.getZTreeObj(treeID)); */
   
    if (!msg || msg.length == 0) {
        return;
    }
    var zTree = $.fn.zTree.getZTreeObj(treeID);
    treeNode.icon = ""; 
    zTree.updateNode(treeNode);
    // 展开后默认选中第一个。
    // zTree.selectNode(treeNode.children[0]);
}
function onAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
    var zTree = $.fn.zTree.getZTreeObj(treeID);
    alert("异步获取数据出现异常。");
    treeNode.icon = "";
}
function onClick(event, treeId, treeNode, clickFlag) {
    var zTree = $.fn.zTree.getZTreeObj(treeID);
    //zTree.expandNode(treeNode, null, false, true, true, true);
    // console.log("节点测试");
    // console.log(event);
    // console.log(zTree);
    // console.log(treeNode);
    if (treeType == 1 || treeType == 2) {
        var btn = $('#' + treeID + ' #' + treeNode.id);
        if (btn) {
            btn.click();
        }
    }
    else if (treeType == 6) {
        zTree.checkNode(treeNode, true, false);
        onCheck(event, treeId, treeNode);
    } else if (treeType == 7) {
        zTree.expandNode(treeNode, null, false, true, true, true);
        if (treeNode.hasradio) {
            var btn = $('#' + treeID + ' #' + treeNode.id);
            btn.click();
        }
    } else if (treeType == 11) {
        var type = treeNode.type;
        ID = treeNode.ID;
        btn = $('#' + treeID + ' #' + ID);
        btn.click();
    } else if (treeType == 14) {
        var type = treeNode.type;
        var ID = treeNode.ID;
        var btn = $('#' + treeID + ' #' + type + '_' + ID);
        btn.click();
    }
    else {
        var type = treeNode.type;
        var ID = treeNode.ID;
        var btn = $('#' + treeID + ' #' + type + "_" + ID);
        btn.click();
    }
    if (treeType == 4) {
        zTree.checkNode(treeNode, !treeNode.checked, true);
    }
    if (treeType == 1) {
        try {
            if (treeNode.isParent) {
                return;
            }
            getSubIframe(false).SearchTT();
        } catch (e) {
        }
    }
}
function onCheck(event, treeId, treeNode) {
    if (treeType == 6) {
        if (!treeNode.IsLocked) {
            try {
                pageLoad(treeNode.ID);
            } catch (e) {
            }
            var subIframeTarget = top.getSubIframe(true);
            if (subIframeTarget == null) {
                return;
            }
            try {
                subIframeTarget[0].contentWindow.pageLoad(treeNode.ID);
            } catch (e) {
            }
            try {
                var iframeTarget = subIframeTarget.contents().find('iframe#dialog_frame1');
                iframeTarget[0].contentWindow.pageLoad(treeNode.ID);
            } catch (e) {
            }
            try {
                var iframeTarget = subIframeTarget.contents().find('iframe#dialog_frame2');
                iframeTarget[0].contentWindow.pageLoad(treeNode.ID);
            } catch (e) {
            }
        }
    }
}
function ajaxGetNodes(treeNode, reloadType) {
    var zTree = $.fn.zTree.getZTreeObj(treeID);
    if (reloadType == "refresh") {
        treeNode.icon = "../js/ztree/zTreeStyle/img/loading.gif";
        zTree.updateNode(treeNode);
    }
    zTree.reAsyncChildNodes(treeNode, reloadType, true);
}
function doSearch() {
    var keywords = $("#searchbox").searchbox("getValue");
    var visit = 'getprojectinfo';
    // var postUrl = 'Handler/ProjectHandler.ashx';
    // var postUrl = 'http://demo.saasyy.com/Handler/ProjectHandler.ashx';
    // var postUrl = 'http://192.168.31.25/admin/api/getprojectinfo';
    var postUrl = window.SERVERPATH + 'api/getprojectinfo';
    if (treeType == 7) {
        visit = 'getpublicprojecttree'
    } else if (treeType == 8) {
        visit = 'getdepartmenttree';
        postUrl = 'Handler/SysSettingHandler.ashx';
    } else if (treeType == 11 || treeType == 14) {
        visit = 'loadtree';
        postUrl = 'Handler/CKHandler.ashx';
    } else if (treeType == 12) {
        visit = 'loaddepartmenttree';
        postUrl = 'Handler/CKHandler.ashx';
    } else if (treeType == 13) {
        visit = 'loadproductcategorytree';
        postUrl = 'Handler/CKHandler.ashx';
    }
    // if (isTopMain) {
    //     postUrl = './' + postUrl;
    // } else {
    //     postUrl = '../' + postUrl;
    // }
    MaskUtil.mask('#' + treeID);
    // var options = { visit: visit, Keywords: keywords };
    // param = "visit=getprojectinfo&ID=" + ID + "&IncludePublic=" + IncludePublic + "&PublicID=" + PublicID + '&CompanyID=';
    // var options = { visit: visit, Keywords: keywords, sessionId: sessionId, ID: 1, IncludePublic: false, PublicID: 0, CompanyID: 1 };
    var options = { visit: visit, Keywords: keywords, sessionId: sessionId };
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: postUrl,
        // url: 'http://demo.saasyy.com/Handler/ProjectHandler.ashx?visit=getprojectinfo&ID=2320951&IncludePublic=false&PublicID=0&CompanyID=0',
        data: options,
        success: function (data) {
            MaskUtil.unmask();
            var setting = getSetting();
            data = data.list;
            // console.log('初始化测试');
            // console.log(postUrl);
            // console.log(options);
            // console.log("==112233==");
            // console.log(data);

            // data = [{"ID":"1","FullName":"\u4e91\u7269\u7ba1\u5e73\u53f0","name":"\u4e91\u7269\u7ba1\u5e73\u53f0","PropertyID":0,"IconID":0,"IsLocked":false,"MsgID":0,"OrderNumberID":0,"OrgnizationID":0,"ParentID":0,"RoleID":0,"TypeDesc":"","UserID":0,"chkDisabled":false,"iconSkin":"Icon_0","id":"1","isParent":true,"isRoom":false,"open":true,"pId":0,"type":"company"},{ "ID": "2387793", "FullName": "\u5357\u6eaa\u96c5\u5c45", "name": "\u5357\u6eaa\u96c5\u5c45", "PropertyID": 11, "IconID": 1, "IsLocked": false, "MsgID": 0, "OrderNumberID": 0, "OrgnizationID": 0, "ParentID": 1, "RoleID": 0, "TypeDesc": "\u5c0f\u533a", "UserID": 0, "chkDisabled": false, "iconSkin": "Icon_1", "id": "2387793", "isParent": true, "isRoom": false, "open": true, "pId": 1, "type": "project" }, { "ID": "2388001", "FullName": "\u6d4b\u8bd5\u5c0f\u533a", "name": "\u6d4b\u8bd5\u5c0f\u533a", "PropertyID": 3, "IconID": 1, "IsLocked": false, "MsgID": 0, "OrderNumberID": 0, "OrgnizationID": 0, "ParentID": 1, "RoleID": 0, "TypeDesc": "\u5c0f\u533a", "UserID": 0, "chkDisabled": false, "iconSkin": "Icon_1", "id": "2388001", "isParent": true, "isRoom": false, "open": true, "pId": 1, "type": "project" }, { "ID": "2388611", "FullName": "\u5317\u6eaa\u96c5\u5c45", "name": "\u5317\u6eaa\u96c5\u5c45", "PropertyID": 1, "IconID": 1, "IsLocked": false, "MsgID": 0, "OrderNumberID": 0, "OrgnizationID": 0, "ParentID": 1, "RoleID": 0, "TypeDesc": "\u5c0f\u533a", "UserID": 0, "chkDisabled": false, "iconSkin": "Icon_1", "id": "2388611", "isParent": true, "isRoom": false, "open": true, "pId": 1, "type": "project" }, { "ID": "2389612", "FullName": "\u5199\u65e5\u697c\u6d4b\u8bd5", "name": "\u5199\u65e5\u697c\u6d4b\u8bd5", "PropertyID": 1, "IconID": 1, "IsLocked": false, "MsgID": 0, "OrderNumberID": 0, "OrgnizationID": 0, "ParentID": 1, "RoleID": 0, "TypeDesc": "\u5c0f\u533a", "UserID": 0, "chkDisabled": false, "iconSkin": "Icon_1", "id": "2389612", "isParent": true, "isRoom": false, "open": true, "pId": 1, "type": "project" }, { "ID": "2389640", "FullName": "\u4f4f\u5b85\u6d4b\u8bd5", "name": "\u4f4f\u5b85\u6d4b\u8bd5", "PropertyID": 3, "IconID": 1, "IsLocked": false, "MsgID": 0, "OrderNumberID": 0, "OrgnizationID": 0, "ParentID": 1, "RoleID": 0, "TypeDesc": "\u5c0f\u533a", "UserID": 0, "chkDisabled": false, "iconSkin": "Icon_1", "id": "2389640", "isParent": true, "isRoom": false, "open": true, "pId": 1, "type": "project" }, { "ID": "2389701", "FullName": "\u4f4f\u5b85\u6d4b\u8bd501", "name": "\u4f4f\u5b85\u6d4b\u8bd501", "PropertyID": 3, "IconID": 1, "IsLocked": false, "MsgID": 0, "OrderNumberID": 0, "OrgnizationID": 0, "ParentID": 1, "RoleID": 0, "TypeDesc": "\u5c0f\u533a", "UserID": 0, "chkDisabled": false, "iconSkin": "Icon_1", "id": "2389701", "isParent": true, "isRoom": false, "open": true, "pId": 1, "type": "project" }, { "ID": "2389733", "FullName": "\u4f4f\u5b85\u6d4b\u8bd502", "name": "\u4f4f\u5b85\u6d4b\u8bd502", "PropertyID": 3, "IconID": 1, "IsLocked": false, "MsgID": 0, "OrderNumberID": 0, "OrgnizationID": 0, "ParentID": 1, "RoleID": 0, "TypeDesc": "\u5c0f\u533a", "UserID": 0, "chkDisabled": false, "iconSkin": "Icon_1", "id": "2389733", "isParent": true, "isRoom": false, "open": true, "pId": 1, "type": "project" }, { "ID": "2390219", "FullName": "\u5199\u5b57\u697c\u6d4b\u8bd5", "name": "\u5199\u5b57\u697c\u6d4b\u8bd5", "PropertyID": 1, "IconID": 1, "IsLocked": false, "MsgID": 0, "OrderNumberID": 0, "OrgnizationID": 0, "ParentID": 1, "RoleID": 0, "TypeDesc": "\u5c0f\u533a", "UserID": 0, "chkDisabled": false, "iconSkin": "Icon_1", "id": "2390219", "isParent": true, "isRoom": false, "open": true, "pId": 1, "type": "project" }, { "ID": "2390229", "FullName": "\u8f66\u4f4d\u6d4b\u8bd5", "name": "\u8f66\u4f4d\u6d4b\u8bd5", "PropertyID": 2, "IconID": 1, "IsLocked": false, "MsgID": 0, "OrderNumberID": 0, "OrgnizationID": 0, "ParentID": 1, "RoleID": 0, "TypeDesc": "\u5c0f\u533a", "UserID": 0, "chkDisabled": false, "iconSkin": "Icon_1", "id": "2390229", "isParent": true, "isRoom": false, "open": true, "pId": 1, "type": "project" }, { "ID": "2390864", "FullName": "\u534e\u7f8e\u96c5\u5c45", "name": "\u534e\u7f8e\u96c5\u5c45", "PropertyID": 1, "IconID": 1, "IsLocked": false, "MsgID": 0, "OrderNumberID": 0, "OrgnizationID": 0, "ParentID": 1, "RoleID": 0, "TypeDesc": "\u5c0f\u533a", "UserID": 0, "chkDisabled": false, "iconSkin": "Icon_1", "id": "2390864", "isParent": true, "isRoom": false, "open": true, "pId": 1, "type": "project" }, { "ID": "2390874", "FullName": "\u8f66\u4f4d", "name": "\u8f66\u4f4d", "PropertyID": 2, "IconID": 1, "IsLocked": false, "MsgID": 0, "OrderNumberID": 0, "OrgnizationID": 0, "ParentID": 1, "RoleID": 0, "TypeDesc": "\u5c0f\u533a", "UserID": 0, "chkDisabled": false, "iconSkin": "Icon_1", "id": "2390874", "isParent": true, "isRoom": false, "open": true, "pId": 1, "type": "project" },  { "ID": "2390996", "FullName": "\u5199\u5b57\u697cTF", "name": "\u5199\u5b57\u697cTF", "PropertyID": 1, "IconID": 1, "IsLocked": false, "MsgID": 0, "OrderNumberID": 0, "OrgnizationID": 0, "ParentID": 1, "RoleID": 0, "TypeDesc": "\u5c0f\u533a", "UserID": 0, "chkDisabled": false, "iconSkin": "Icon_1", "id": "2390996", "isParent": true, "isRoom": false, "open": true, "pId": 1, "type": "project" }, { "ID": "2391002", "FullName": "NX\u96c5\u5c45", "name": "NX\u96c5\u5c45", "PropertyID": 1, "IconID": 1, "IsLocked": false, "MsgID": 0, "OrderNumberID": 0, "OrgnizationID": 0, "ParentID": 1, "RoleID": 0, "TypeDesc": "\u5c0f\u533a", "UserID": 0, "chkDisabled": false, "iconSkin": "Icon_1", "id": "2391002", "isParent": true, "isRoom": false, "open": true, "pId": 1, "type": "project" }, { "ID": "2391006", "FullName": "BX\u96c5\u5c45", "name": "BX\u96c5\u5c45", "PropertyID": 1, "IconID": 1, "IsLocked": false, "MsgID": 0, "OrderNumberID": 0, "OrgnizationID": 0, "ParentID": 1, "RoleID": 0, "TypeDesc": "\u5c0f\u533a", "UserID": 0, "chkDisabled": false, "iconSkin": "Icon_1", "id": "2391006", "isParent": true, "isRoom": false, "open": true, "pId": 1, "type": "project" }, { "ID": "2391013", "FullName": "\u65b0\u589e\u6d4b\u8bd5", "name": "\u65b0\u589e\u6d4b\u8bd5", "PropertyID": 1, "IconID": 1, "IsLocked": false, "MsgID": 0, "OrderNumberID": 0, "OrgnizationID": 0, "ParentID": 1, "RoleID": 0, "TypeDesc": "\u5c0f\u533a", "UserID": 0, "chkDisabled": false, "iconSkin": "Icon_1", "id": "2391013", "isParent": true, "isRoom": false, "open": true, "pId": 1, "type": "project" }, { "ID": "2391017", "FullName": "\u65b0\u589e\u6d4b\u8bd51", "name": "\u65b0\u589e\u6d4b\u8bd51", "PropertyID": 1, "IconID": 1, "IsLocked": false, "MsgID": 0, "OrderNumberID": 0, "OrgnizationID": 0, "ParentID": 1, "RoleID": 0, "TypeDesc": "\u5c0f\u533a", "UserID": 0, "chkDisabled": false, "iconSkin": "Icon_1", "id": "2391017", "isParent": true, "isRoom": false, "open": true, "pId": 1, "type": "project" }, { "ID": "2391022", "FullName": "\u65b0\u589e\u6d4b\u8bd52", "name": "\u65b0\u589e\u6d4b\u8bd52", "PropertyID": 1, "IconID": 1, "IsLocked": false, "MsgID": 0, "OrderNumberID": 0, "OrgnizationID": 0, "ParentID": 1, "RoleID": 0, "TypeDesc": "\u5c0f\u533a", "UserID": 0, "chkDisabled": false, "iconSkin": "Icon_1", "id": "2391022", "isParent": true, "isRoom": false, "open": true, "pId": 1, "type": "project" }, { "ID": "2391058", "FullName": "\u5199\u5b57\u697c\u6d4b\u8bd51", "name": "\u5199\u5b57\u697c\u6d4b\u8bd51", "PropertyID": 1, "IconID": 1, "IsLocked": false, "MsgID": 0, "OrderNumberID": 0, "OrgnizationID": 0, "ParentID": 1, "RoleID": 0, "TypeDesc": "\u5c0f\u533a", "UserID": 0, "chkDisabled": false, "iconSkin": "Icon_1", "id": "2391058", "isParent": true, "isRoom": false, "open": true, "pId": 1, "type": "project" }, { "ID": "2391062", "FullName": "JM\u96c5\u5c45", "name": "JM\u96c5\u5c45", "PropertyID": 1, "IconID": 1, "IsLocked": false, "MsgID": 0, "OrderNumberID": 0, "OrgnizationID": 0, "ParentID": 1, "RoleID": 0, "TypeDesc": "\u5c0f\u533a", "UserID": 0, "chkDisabled": false, "iconSkin": "Icon_1", "id": "2391062", "isParent": true, "isRoom": false, "open": true, "pId": 1, "type": "project" }, { "ID": "2391071", "FullName": "\u8f66\u4f4d\u6d4b\u8bd51", "name": "\u8f66\u4f4d\u6d4b\u8bd51", "PropertyID": 2, "IconID": 1, "IsLocked": false, "MsgID": 0, "OrderNumberID": 0, "OrgnizationID": 0, "ParentID": 1, "RoleID": 0, "TypeDesc": "\u5c0f\u533a", "UserID": 0, "chkDisabled": false, "iconSkin": "Icon_1", "id": "2391071", "isParent": true, "isRoom": false, "open": true, "pId": 1, "type": "project" }]
            // data =[{"ID":1,"ParentID":0,"Name":"云物管平台","IconID":0,"IsLocked":false,"isParent":true,"OrgnizationID":0,"RoleID":0,"OrderNumberID":0,"MsgID":0,"UserID":0,"name":"永友软件管理演示系统","id":1,"pId":0,"type":"company","iconSkin":"Icon_0","open":true,"isRoom":false,"chkDisabled":false},{"ID":"2387793","FullName":"\u5357\u6eaa\u96c5\u5c45","name":"\u5357\u6eaa\u96c5\u5c45","PropertyID":11,"IconID":1,"IsLocked":false,"MsgID":0,"OrderNumberID":0,"OrgnizationID":0,"ParentID":1,"RoleID":0,"TypeDesc":"\u5c0f\u533a","UserID":0,"chkDisabled":false,"iconSkin":"Icon_1","id":"2387793","isParent":true,"isRoom":false,"open":true,"pId":1,"type":"project"}];
            // console.log(data);
            // data = [{"ID":1,"ParentID":0,"Name":"云物管平台","IconID":0,"IsLocked":false,"isParent":true,"OrgnizationID":0,"RoleID":0,"OrderNumberID":0,"MsgID":0,"UserID":0,"name":"永友软件管理演示系统","id":1,"pId":0,"type":"company","iconSkin":"Icon_0","open":true,"isRoom":false,"chkDisabled":false},{"ID":2324512,"ParentID":1,"Name":"碧桂园","FullName":"碧桂园","IconID":1,"IsLocked":false,"isParent":true,"OrgnizationID":0,"RoleID":0,"OrderNumberID":0,"MsgID":0,"TypeDesc":"小区","UserID":0,"name":"碧桂园","id":2324512,"pId":1,"type":"project","iconSkin":"Icon_1","open":true,"isRoom":false,"chkDisabled":false}];
            // console.log(data);
            // var data = JSON.parse('{"status":"true","list":[{"ID":"1","name":"\u4e91\u7269\u7ba1\u5e73\u53f0","IconID":0,"IsLocked":"false","MsgID":0,"OrderNumberID":0,"OrgnizationID":0,"ParentID":0,"RoleID":0,"TypeDesc":"","UserID":0,"chkDisabled":"false","iconSkin":"Icon_0","id":"1","isParent":"true","isRoom":"false","open":"true","pId":0,"type":"project"}]}');
            // var data = JSON.parse('[{"ID":1,"ParentID":0,"Name":"云物管平台","IconID":0,"IsLocked":false,"isParent":true,"OrgnizationID":0,"RoleID":0,"OrderNumberID":0,"MsgID":0,"UserID":0,"name":"永友软件管理演示系统","id":1,"pId":0,"type":"company","iconSkin":"Icon_0","open":true,"isRoom":false,"chkDisabled":false},{"ID":2324512,"ParentID":1,"Name":"碧桂园","FullName":"碧桂园","IconID":1,"IsLocked":false,"isParent":true,"OrgnizationID":0,"RoleID":0,"OrderNumberID":0,"MsgID":0,"TypeDesc":"小区","UserID":0,"name":"碧桂园","id":2324512,"pId":1,"type":"project","iconSkin":"Icon_1","open":true,"isRoom":false,"chkDisabled":false},{"ID":2324513,"ParentID":2324512,"Name":"住宅","FullName":"碧桂园-住宅","IconID":2,"IsLocked":false,"isParent":true,"OrgnizationID":0,"RoleID":0,"OrderNumberID":0,"MsgID":0,"TypeDesc":"住宅","UserID":0,"name":"住宅","id":2324513,"pId":2324512,"type":"project","iconSkin":"Icon_2","open":true,"isRoom":false,"chkDisabled":false}]');
            /*data = {"ID":2320951,"ParentID":1,"Name":"Z实施测试","FullName":"Z实施测试","IconID":1,"IsLocked":false,"isParent":true,"OrgnizationID":0,"RoleID":0,"OrderNumberID":0,"MsgID":0,"TypeDesc":"小区","UserID":0,"name":"Z实施测试","id":2320951,"pId":1,"type":"project","iconSkin":"Icon_1","open":true,"isRoom":false,"chkDisabled":false},{"ID":2372549,"ParentID":2320951,"Name":"车位","FullName":"实施测试-车位","IconID":2,"IsLocked":false,"isParent":true,"OrgnizationID":0,"RoleID":0,"OrderNumberID":0,"MsgID":0,"TypeDesc":"车位","UserID":0,"name":"车位","id":2372549,"pId":2320951,"type":"project","iconSkin":"Icon_2","open":true,"isRoom":false,"chkDisabled":false},{"ID":2372552,"ParentID":2320951,"Name":"子公司","FullName":"实施测试-子公司","IconID":2,"IsLocked":false,"isParent":true,"OrgnizationID":0,"RoleID":0,"OrderNumberID":0,"MsgID":0,"TypeDesc":"子公司","UserID":0,"name":"子公司","id":2372552,"pId":2320951,"type":"project","iconSkin":"Icon_2","open":true,"isRoom":false,"chkDisabled":false},{"ID":2372515,"ParentID":2320951,"Name":"写字楼","FullName":"Z实施测试-写字楼","IconID":2,"IsLocked":false,"isParent":true,"OrgnizationID":0,"RoleID":0,"OrderNumberID":0,"MsgID":0,"TypeDesc":"写字楼","UserID":0,"name":"写字楼","id":2372515,"pId":2320951,"type":"project","iconSkin":"Icon_2","open":true,"isRoom":false,"chkDisabled":false},{"ID":2372518,"ParentID":2320951,"Name":"商业","FullName":"实施测试-商业","IconID":2,"IsLocked":false,"isParent":true,"OrgnizationID":0,"RoleID":0,"OrderNumberID":0,"MsgID":0,"TypeDesc":"商业","UserID":0,"name":"商业","id":2372518,"pId":2320951,"type":"project","iconSkin":"Icon_2","open":true,"isRoom":false,"chkDisabled":false} */

            $.fn.zTree.init($("#" + treeID), setting, data);
        }
    });
}
function addDiyDom(treeId, treeNode) {
    var aObj = $("#" + treeNode.tId + IDMark_A);
    if (treeType == 7) {
        if (treeNode.hasradio) {
            var ID = treeNode.ID;
            var Type = treeNode.Type;
            var editStr = "<div class='divRadioChk'><input type='radio' onclick='radioBtn()' name='checkbox_0' id='" + treeNode.id + "' data-id='" + ID + "' data-type='" + Type + "' onfocus='this.blur();'></input><label class='labelRadio' for='" + treeNode.id + "'></label></div>";
            aObj.before(editStr);
        }
    } else if (treeType == 8) {
        var Type = treeNode.type;
        var id = 0;
        if (treeNode.getParentNode() != null) {
            id = treeNode.getParentNode().id;
        }
        var editStr = "<div class='divRadioChk'><input type='radio' onclick='clickRadioBtn()' value='0' class='radioBtn' p_id='" + id + "' id='" + treeNode.id + "' name='radio_0' onfocus='this.blur();' data-id='" + treeNode.ID + "' data-type='" + Type + "'></input><label class='labelRadio' for='" + treeNode.id + "'></label></div>";
        aObj.before(editStr);
        var btn = $('#' + treeID + ' #' + treeNode.id);
        if (btn) {
            btn.bind("click", function () {
                var treeObj = $.fn.zTree.getZTreeObj(treeID);
                if (btn.val() == 1) {
                    $('#' + treeID + ' input[name="radio_0"]').attr("value", "0");
                    btn.attr("value", "0");
                    btn.prop("checked", false);
                    //btn.removeAttr("checked");
                    //treeObj.cancelSelectedNode(treeNode);
                } else {
                    $('#' + treeID + ' input[name="radio_0"]').attr("value", "0");
                    btn.val("1");
                    btn.prop("checked", true);
                    //treeObj.selectNode(treeNode, false);
                }
            });
        }
    }
    else if (treeType == 1) {
        if (treeNode.isParent) {
            var id = 0;
            if (treeNode.getParentNode() != null) {
                id = treeNode.getParentNode().id;
            }
            var editStr = "<div class='divRadioChk'><input type='radio' value='0' class='radioBtn' p_id='" + id + "' id='" + treeNode.id + "' name='radio_0' onfocus='this.blur();' data-id='" + treeNode.ID + "' data-type='" + treeNode.type + "'></input><label class='labelRadio' for='" + treeNode.id + "'></label></div>";
            aObj.before(editStr);
            var btn = $("#" + treeID + " #" + treeNode.id);
            if (btn) {
                btn.bind("click", function () {
                    var treeObj = $.fn.zTree.getZTreeObj(treeID);
                    if (btn.val() == 1) {
                        $('#' + treeID + ' input[name="radio_0"]').attr("value", "0");
                        btn.attr("value", "0");
                        btn.prop("checked", false);
                    } else {
                        $('#' + treeID + ' input[name="radio_0"]').attr("value", "0");
                        btn.val("1");
                        btn.prop("checked", true);
                    }
                });
            }
        } else {
            var editStr = "<div class='divRadioChk'><input type='checkbox' name='checkbox_0' class='checkboxBtn' id='" + treeNode.id + "' onfocus='this.blur();'></input><label class='labelCheckBox' for='" + treeNode.id + "'></label></div>";
            aObj.before(editStr);
        }
    }
    else if (treeType == 2) {
        if (!treeNode.isParent) {
            var editStr = '';
            if (treeNode.IsLocked) {
                editStr = "<div class='divRadioChk'><input type='radio' disabled='disabled' name='checkbox_0' class='radioBtn' id='" + treeNode.id + "' onfocus='this.blur();'></input><label class='labelRadio' for='" + treeNode.id + "'></label></div>";
            }
            else {
                editStr = "<div class='divRadioChk'><input type='radio' onclick='clickRadioBtn()' name='checkbox_0' class='radioBtn' id='" + treeNode.id + "' onfocus='this.blur();'></input><label class='labelRadio' for='" + treeNode.id + "'></label></div>";
            }
            aObj.before(editStr);
            var btn = $('#' + treeID + ' #' + treeNode.id);
            if (btn) {
                //btn.bind("click", function () {
                //    $("#opbtn").click();
                //});
            }
        }
    }
    else if (treeType == 11) {
        var type = treeNode.type;
        var ID = treeNode.ID;
        var editStr = "";
        editStr = "<div class='divRadioChk'><input type='radio' ptype='" + type + "' id='" + ID + "' name='treeNodeRadio' onclick='onClickRaido()' class='radioBtn' onfocus='this.blur();'></input><label class='labelRadio' for='" + treeNode.id + "'></label></div>";
        aObj.before(editStr);
    }
}
function clickRadioBtn() {
    var subIframeTarget = top.getSubIframe(false);
    if (subIframeTarget == null) {
        return;
    }
    try {
        subIframeTarget.clickRadioBtn();
    } catch (e) {
    }
}
function onClickRaido() {
    if (treeType == 11) {
        var subIframeTarget = top.getSubIframe(false);
        if (subIframeTarget == null) {
            return;
        }
        try {
            subIframeTarget.SearchTT();
        } catch (e) {
        }
    }
}
function addTree() {
    var subIframeTarget = top.getSubIframe(false);
    if (subIframeTarget == null) {
        return;
    }
    try {
        subIframeTarget.addTree();
    } catch (e) {
        //alert(e);
    }
}
function editTree() {
    var subIframeTarget = top.getSubIframe(false);
    if (subIframeTarget == null) {
        return;
    }
    try {
        subIframeTarget.editTree();
    } catch (e) {
    }
}
function removeTree() {
    var subIframeTarget = top.getSubIframe(false);
    if (subIframeTarget == null) {
        return;
    }
    try {
        subIframeTarget.removeTree();
    } catch (e) {
    }
}
function getSubTabPageID(topPageID) {
    var topPageID = top.getTopTabPageID();
    var subPageID = 0;
    try {
        subPageID = $('iframe#top_main_frame_' + topPageID)[0].contentWindow.getSubTabPageID();
    } catch (e) {
    }
    return subPageID;
}
function updateSubTab(id) {
    var topIframeTarget = top.getTopIframe(true);
    try {
        topIframeTarget[0].contentWindow.updateSubTab(id);
    } catch (e) {
    }
}
function getTopIframe(getTarget) {
    var topPageID = top.getTopTabPageID();
    var topIframeTarget = $('iframe#top_main_frame_' + topPageID);
    if (topIframeTarget.length > 0) {
        if (getTarget) {
            return topIframeTarget;
        }
        return topIframeTarget[0].contentWindow;
    }
    return null;
}
function getSubIframe(getTarget) {
    var topIframeTarget = top.getTopIframe(true);
    var subIframeTarget = null;
    var subPageID = top.getSubTabPageID();
    if (!subPageID) {
        return null;
    }
    try {
        subIframeTarget = topIframeTarget.contents().find('iframe#sub_main_frame_' + subPageID);
        if (subIframeTarget.length > 0) {
            if (getTarget) {
                return subIframeTarget;
            }
            return subIframeTarget[0].contentWindow;
        }
    } catch (e) {
    }
    return null;
}
function do_search_more() {
    var subIframeTarget = top.getSubIframe(true);
    if (subIframeTarget == null) {
        return;
    }
    try {
        subIframeTarget[0].contentWindow.loadalldata();
    } catch (e) {
        //alert(e);
    }
}
