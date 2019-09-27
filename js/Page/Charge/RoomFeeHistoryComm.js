function MergeCells(tableID, fldList) {
    var Arr = fldList.split(",");
    var dg = $('#' + tableID);
    var fldName;
    var RowCount = dg.datagrid("getRows").length;
    var span;
    var PerValue = "";
    var CurValue = "";
    var length = Arr.length - 1;
    var list = [];
    for (i = 0; i <= length; i++) {
        fldName = Arr[i];
        PerValue = "";
        span = 1;
        for (row = 0; row <= RowCount; row++) {
            if (row == RowCount) {
                CurValue = "";
            }
            else {
                CurValue = dg.datagrid("getRows")[row]["PrintID"];
            }
            if (PerValue == CurValue) {
                span += 1;
            }
            else {
                var index = row - span;
                list.push({ index: index, fldName: fldName, span: span });
                span = 1;
                PerValue = CurValue;
            }
        }
    }
    if (merge_timeout != null) {
        clearTimeout(merge_timeout);
    }
    do_merge(dg, list, 0);
}
var merge_timeout = null;
function do_merge(dg, list, i) {
    if (i == list.length) {
        return;
    }
    dg.datagrid('mergeCells', {
        index: list[i].index,
        field: list[i].fldName,
        rowspan: list[i].span,
        colspan: null
    });
    merge_timeout = setTimeout(function () {
        do_merge(dg, list, i + 1)
    }, 10);
}
function formatChargeTypeName(value, row) {
    if (Number(row.CategoryID) < 0) {
        return "";
    }
    if (row.CategoryID == 1) {
        return "收入";
    }
    if (row.CategoryID == 2) {
        return "代收";
    }
    if (row.CategoryID == 3) {
        return "押金";
    }
    if (row.CategoryID = 4) {
        return "预收";
    }
}
function formatDecimal(value, row) {
    if (value < 0) {
        return 0;
    }
    return value;
}
function formatPrintNumber(value, row) {
    if (value == '') {
        value = '未设置'
    }
    var PrintID = "'" + row.PrintID + "'";
    var ChargeState = "'" + row.ChargeState + "'";
    var ReturnRoomFeeType = "'" + row.ReturnRoomFeeType + "'";
    var IsChequePrint = row.IsChequePrint;
    return '<a href="javascript:PrintHistoryFee(' + PrintID + ', ' + ChargeState + ',' + ReturnRoomFeeType + ',' + IsChequePrint + ')">' + value + '</a>';
}
function formatRealCost(value, row) {
    if (row.PrintNumber == "总合计") {
        return value;
    }
    if (Number(row.ChargeState) == 3 || Number(row.ChargeState) == 6 || Number(row.ChargeState) == 7) {
        return "-" + value;
    }
    return value;
}
function formatPrintRealCost(value, row) {
    if (row.PrintNumber == "总合计") {
        return value;
    }
    if (Number(row.ChargeState) == 3 || Number(row.ChargeState) == 6) {
        return "-" + value;
    }
    if (value < 0) {
        return 0;
    }
    return value;
}
function onLoadSuccess(data) {
    MergeCells("his_table", "ck,FinalPrintNumber,ChargeStateDesc,ChargeMan,PrintNumber,RoomName,ChargeTypeName,ChargeTime,FormatSumRealCost,RelationIDCard,FullName,OneCardNumber,RelationName,RelatePhoneNumber,ChargeForMan");
}

var checked_id = 0;
var unchecked_id = 0;
function onCheck(index, data) {
    if (checked_id > 0) {
        return;
    }
    checked_id = data.HistoryID;
    var rows = $("#his_table").datagrid("getRows");
    $.each(rows, function (i, row) {
        if (i == rows.length - 1) {
            checked_id = 0;
        }
        if (row.PrintID == data.PrintID) {
            if (!isChecked(row)) {
                var rowIndex = $('#his_table').datagrid('getRowIndex', row);
                if (rowIndex != index) {
                    $('#his_table').datagrid('selectRow', rowIndex);
                }
            }
        }
    })
}
function isChecked(row) {
    var allRows = $("#his_table").datagrid('getChecked');
    for (var i = 0; i < allRows.length; i++) {
        if (row.HistoryID == allRows[i].HistoryID) {
            return true;
        }
    }
    return false;
}
function onUncheck(index, data) {
    if (unchecked_id > 0) {
        return;
    }
    unchecked_id = data.HistoryID;
    var rows = $("#his_table").datagrid("getRows");
    $.each(rows, function (i, row) {
        if (i == rows.length - 1) {
            unchecked_id = 0;
        }
        if (row.PrintID == data.PrintID) {
            if (isChecked(row)) {
                var rowIndex = $('#his_table').datagrid('getRowIndex', row);
                if (rowIndex != index) {
                    $('#his_table').datagrid('unselectRow', rowIndex);
                }
            }
        }
    })
}
function printHistoryChargeFee(PrintID) {
    if (!PrintID) {
        var rows = $('#his_table').datagrid("getSelections");
        if (rows.length == 0) {
            show_message('请选择一条数据，操作取消', 'warning');
            return;
        }
        var SamePrintID = true;
        var canContinue = true;
        var PrintIDList = [];
        $.each(rows, function (index, row) {
            if (row.ChargeState == 2) {
                canContinue = false;
                return false;
            }
            if (index == 0) {
                PrintIDList.push(row.PrintID);
                return true;
            }
            if ($.inArray(row.PrintID, PrintIDList) == -1) {
                SamePrintID = false;
                return false;
            }
        });
        PrintID = rows[0].PrintID;
        if (!canContinue) {
            show_message("选中的账单已取消", "warning");
            return;
        }
        if (!SamePrintID) {
            show_message("请同一个单号进行打印", "warning");
            return;
        }
    }
    saveOperationLog(PrintID);
    var pageWidth = 210;
    var pageHeight = 99;
    MaskUtil.mask('body', '打印中');
    var options = { visit: 'getprinthistorypagesize', PrintID: PrintID };
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '../Handler/PrintHandler.ashx',
        data: options,
        success: function (data) {
            if (!data.status) {
                show_message("服务器内部异常", "warning");
                return;
            }
            var ChargeState = data.ChargeState;//收款状态 1-已收费 2-已作废 3-退保证金 4-冲抵收费 5-催收中 6-退预收款 7-已退款
            var ReturnRoomFeeType = data.ReturnRoomFeeType;//1-退押金 2-退预收款 3-支出登记付款 4-退收款
            pageHeight = data.page_height;
            pageWidth = data.page_width;
            var iframe = document.getElementById("myframe");
            var url = "../PrintPage/printchargefeeview.aspx?PrintID=" + PrintID;
            if (ChargeState == 3 || ReturnRoomFeeType == 1) {
                url = "../PrintPage/printchargebackguaranteefeeview.aspx?PrintID=" + PrintID;
            }
            else if (ChargeState == 4) {
                url = "../PrintPage/printoffsetchargefeeview.aspx?PrintID=" + PrintID;
            }
            else if (ChargeState == 6 || ReturnRoomFeeType == 2) {
                url = "../PrintPage/printchargebackprefeeview.aspx?PrintID=" + PrintID;
            }
            else if (ChargeState == 7) {
                if (ReturnRoomFeeType == 3) {
                    url = "../PrintPage/printchargepayserviceview.aspx?PrintID=" + PrintID;
                }
                else if (ReturnRoomFeeType == 4) {
                    url = "../PrintPage/printchargepayserviceview.aspx?PrintID=" + PrintID;
                }
            }
            url = url + "&PageWidth=" + pageWidth + "&PageHeight=" + pageHeight;
            iframe.src = url;
            if (iframe.attachEvent) {
                iframe.attachEvent("onload", function () {
                    MaskUtil.unmask();
                    setTimeout(function () {
                        var strHtml = iframe.contentWindow.document.documentElement.innerHTML;
                        LODOPPrint(strHtml, pageWidth, pageHeight);
                    }, 1000);
                });
            } else {
                iframe.onload = function () {
                    MaskUtil.unmask();
                    setTimeout(function () {
                        var strHtml = iframe.contentWindow.document.documentElement.innerHTML;
                        LODOPPrint(strHtml, pageWidth, pageHeight);
                    }, 1000);
                };
            }
        }
    });
}
function LODOPPrint(strHtml, pageWidth, pageHeight) {
    var LODOP = null;
    try {
        LODOP = getLodop();
        if ((LODOP != null) && (typeof (LODOP.VERSION) != "undefined")) {
            LODOP.PRINT_INIT("打印单据_收款单");
            LODOP.SET_PRINT_PAGESIZE(1, pageWidth + 'mm', pageHeight + 'mm', '')
            LODOP.ADD_PRINT_TABLE(0, '3%', '94%', '100%', strHtml);
            LODOP.PREVIEW();
        }
        else {
            show_message("Error:该浏览器不支持打印插件!", "warning");
        }
    } catch (err) {
        show_message("Error:本机未安装或需要升级!" + err, "warning");
    }
}
function PrintHistoryFee(PrintID, ChargeState, ReturnRoomFeeType, IsChequePrint) {
    if (!IsChequePrint) {
        PrintHistoryFeeInvoice(PrintID, ChargeState, ReturnRoomFeeType);
        return;
    }
    var options = { visit: 'checkprintchequestatus', PrintID: PrintID };
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '../Handler/PrintHandler.ashx',
        data: options,
        success: function (data) {
            if (data.status && data.pdfurl) {
                top.window.location.href = data.pdfurl;
            }
            else if (data.reprint) {
                top.$.messager.confirm('提示', '电子发票尚未创建，是否立即创建?', function (r) {
                    if (r) {
                        var iframe = "../PrintPage/PrintChequeView.aspx?PrintID=" + PrintID;
                        do_open_dialog('打印发票', iframe);
                    }
                })
                return;
            }
            else if (data.error) {
                show_message(data.error, 'warning');
            }
            else {
                show_message('系统错误', 'error');
            }
        }
    });
}
function PrintHistoryFeeInvoice(PrintID, ChargeState, ReturnRoomFeeType) {
    var title = "打印收款收据";
    var iframe = "../PrintPage/printchargefeeview.aspx?PrintID=" + PrintID + "&op=view";
    if (ChargeState == 3 || ReturnRoomFeeType == 1) {
        title = "打印退款单据";
        iframe = "../PrintPage/printchargebackguaranteefeeview.aspx?PrintID=" + PrintID + "&op=view";
    }
    else if (ChargeState == 4) {
        title = "打印冲抵单据";
        iframe = "../PrintPage/printoffsetchargefeeview.aspx?PrintID=" + PrintID + "&op=view";
    }
    else if (ChargeState == 6 || ReturnRoomFeeType == 2) {
        title = "打印退款单据";
        iframe = "../PrintPage/printchargebackprefeeview.aspx?PrintID=" + PrintID + "&op=view";
    }
    else if (ChargeState == 7) {
        if (ReturnRoomFeeType == 3) {
            title = "打印付款单据";
            iframe = "../PrintPage/printchargepayserviceview.aspx?PrintID=" + PrintID + "&op=view";
        }
        else if (ReturnRoomFeeType == 4) {
            title = "打印退款单据";
            iframe = "../PrintPage/printchargepayserviceview.aspx?PrintID=" + PrintID + "&op=view";
        }
    }
    doOpenWin({
        title: title,
        url: iframe,
        winParent: false,
        width: '80%',
        height: "80%"
    });
}
function saveOperationLog(PrintID) {
    var options = { visit: 'saveoperationlog', PrintID: PrintID, op: 'HistoryPrint' };
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '../Handler/CommHandler.ashx',
        data: options,
        success: function (data) {
        }
    });
}
function do_charge_back() {
    var rows = $('#his_table').datagrid("getSelections");
    if (rows.length == 0) {
        show_message('请选择一条数据，操作取消', 'warning');
        return;
    }
    var PrintID = rows[0].PrintID;
    if (rows[0].ChargeState != 1) {
        show_message('请选择收款单据进行此操作，操作取消', 'warning');
        return;
    }
    var options = { visit: 'checkroomfeehistorystatus', PrintID: PrintID };
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '../Handler/PrintHandler.ashx',
        data: options,
        success: function (data) {
            if (data.status) {
                doOpenWin({
                    title: '退款单据',
                    url: '../Charge/ChargeFeeReturn.aspx?PrintID=' + PrintID,
                    width: '80%',
                    height: "80%",
                }, function () {
                    $('#his_table').datagrid("reload");
                });
            }
            else if (data.error) {
                show_message(data.error, 'warning');
            }
            else {
                show_message('系统错误', 'error');
            }
        }
    });

}