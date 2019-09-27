
function getChargeDiscountList(ChargeDiscountList, ChargeID) {
    var list = [];
    $.each(ChargeDiscountList, function (index, item) {
        if (item.ChargeSummaryIDs != "") {
            var ChargeSummaryIDs = "," + item.ChargeSummaryIDs + ",";
            if (ChargeSummaryIDs.indexOf(",0,") > -1) {
                list.push(item);
                return true;
            }
            if (ChargeSummaryIDs.indexOf("," + ChargeID + ",") > -1) {
                list.push(item);
                return true;
            }
        }
    })
    return list;
}
function formatDiscount(value, row) {
    var discount = calculateFinalDiscount(row);
    return discount;
}
function formatDecimal(value, row) {
    if (parseFloat(value) < 0) {
        return 0;
    }
    return value;
}
function formatUnitPrice(value, row) {
    if (row.IsPriceRange) {
        //var UnitPrice = calculateJieTiUnitPrice(row);
        return '<a>阶梯单价</a>';
    }
    return calculateUnitPrice(row);
}
function formatUseCount(value, row) {
    return calculateUseCount(row);
}
function formatStartTime(value, row) {
    row.CalculateStartTime = value;
    if (row.CalculateStartTime) {
        row.StartTime = row.CalculateStartTime;
    }

    row.CalculateStartTime = checktime(row.CalculateStartTime);
    return row.CalculateStartTime;
}
function formatEndTime(value, row) {
    row.CalculateEndTime = calculateEndTIme(row);
    return row.CalculateEndTime;
}
function formatNewEndTime(value, row) {
    row.NewEndTime = calculateNewEndTime(row);
    return row.NewEndTime;
}
function formatCost(value, row) {
    var usecount = calculateUseCount(row);
    var unitprice = calculateUnitPrice(row);
    var cost = calculateCost(row, usecount, unitprice);
    if (row.TotalCost != cost) {
        row.TotalCost = cost;
        row.PayCost = calculatePayCost(row);
    }
    return row.TotalCost;
}
function formatTotalRealCost(value, row) {
    if (Number(value) < 0)
        return 0;
    return value;
}
function formatOutDays(value, row) {
    var rows = $('#tt_table').datagrid('getRows');
    var requiredoutdays = false;
    $.each(rows, function (rowindex, rowitem) {
        if (Number(rowitem.RelatedFeeID) == row.ID) {
            requiredoutdays = true;
            return false;
        }
    })
    if (!requiredoutdays) {
        row.OutDays = 0;
        return "--";
    }
    if (row.CalculateStartTime) {
        row.StartTime = row.CalculateStartTime;
    }
    var outdays = calculateOutDays(row.StartTime);
    row.OutDays = outdays;

    return row.OutDays + "天";
}
function formatRemark(value, row) {
    if (row.RemarkNote == '') {
        row.RemarkNote = row.Remark;
    }
    if (row.RemarkNote.length > 10) {
        return value.substring(0, 10) + "...";
    }
    return row.RemarkNote;
}
function formatRestCost(value, row) {
    var totalcost = formatCost(row.TotalCost, row);
    totalcost = (parseFloat(totalcost) > 0 ? totalcost : 0);
    var totalrealcost = row.TotalFinalPayCost;
    totalrealcost = (parseFloat(totalrealcost) > 0 ? totalrealcost : 0);
    var discount = calculateFinalDiscount(row);
    discount = (parseFloat(discount) > 0 ? discount : 0);
    row.TotalFinalDiscountCost = (parseFloat(row.TotalFinalDiscountCost) > 0 ? row.TotalFinalDiscountCost : 0);
    var restcost = parseFloat(totalcost) - parseFloat(totalrealcost) - parseFloat(discount) - parseFloat(row.TotalFinalDiscountCost);
    restcost = (restcost > 0 ? restcost : 0);
    var realcost = formatPayCost(row.PayCost, row);
    if (restcost == realcost) {
        return restcost;
    }
    var result = ((restcost - parseFloat(realcost)) > 0 ? (restcost - parseFloat(realcost)) : 0);
    return xround(result, 2);
}
function calculateFinalDiscount(row) {
    row.EndNumberCount = row.EndNumberCount || 0;
    row.EndNumberCount = Number(row.EndNumberCount) < 0 ? 2 : row.EndNumberCount;
    var discount = 0;
    var CalcualteDiscount = (row.CalcualteDiscount || 0);
    if (!row.DiscountType && !row.DiscountValue) {
        discount = (row.Discount < 0 ? 0 : row.Discount) + CalcualteDiscount;
        return xround(parseFloat(discount), 2);
    }
    var usecount = calculateUseCount(row);
    var unitprice = calculateUnitPrice(row);
    var totalCost = calculateCost(row, usecount, unitprice);
    discount = calculateDiscountValue(row.Discount, row.DiscountType, row.DiscountValue, totalCost, row);
    discount = discount + CalcualteDiscount;
    return xround(parseFloat(discount), row.EndNumberCount);
}
function calculateUseCount(row) {
    if (Number(row.CalculateUseCount) > 0) {
        return row.CalculateUseCount;
    }
    return 0;
}
function calculateUnitPrice(row) {
    if (row.IsPriceRange) {
        var UnitPrice = calculateJieTiUnitPrice(row);
        if (UnitPrice > 0) {
            return UnitPrice;
        }
        return 0;
    }
    if (Number(row.CalculateUnitPrice) > 0) {
        return Number(row.CalculateUnitPrice);
    }
    return 0;
}
function calculateJieTiUnitPrice(row) {
    var PriceRangeValue = hdPriceRangeList.val();
    var UnitPrice = 0;
    if (PriceRangeValue != '') {
        var TotalPoint = calculateUseCount(row);
        var PriceRangeList = eval('(' + (PriceRangeValue) + ')');
        var my_pricerange = get_my_pricerange(PriceRangeList, row.ChargeID, row.ID);
        $.each(my_pricerange, function (index, item) {
            if (item.SummaryID == row.ChargeID) {
                if (TotalPoint >= Number(item.MinValue) && TotalPoint < Number(item.MaxValue)) {
                    UnitPrice = item.BasePrice;
                    return false;
                }
            }
        });
    }
    return UnitPrice;
}
function calculateCost(row, count, unit) {
    var cost = calculateTrueCost(row, count, unit);
    row.EndNumberCount = row.EndNumberCount || 0;
    row.EndNumberCount = (Number(row.EndNumberCount) < 0 ? 2 : row.EndNumberCount);
    return xround(cost, row.EndNumberCount);
}
function xround(x, num) {
    if (x <= 0) {
        return x;
    }
    return Math.round(x * Math.pow(10, num)) / Math.pow(10, num);
}
var ratecostlist = [];
function calculateRateCost(CalculateUnitPrice, startnumber, weiyuedays, WeiYuePercent) {
    if (startnumber == 0) {
        ratecostlist = [];
    }
    startnumber++;
    if (startnumber > weiyuedays) {
        return;
    }
    var totalcost = CalculateUnitPrice * (1 + (WeiYuePercent / 100)).toFixed(2);
    ratecostlist.push(totalcost);
    calculateRateCost(totalcost, startnumber, weiyuedays, WeiYuePercent);
}
function calculateTrueCost(row, count, unit) {
    if (row.CalculateStartTime) {
        row.StartTime = row.CalculateStartTime;
    }
    if (row.CalculateEndTime) {
        row.EndTime = row.CalculateEndTime;
    }
    var totalcost = calculateTrueCostByTime(row, count, unit, '', '');
    if (row.ActiveTimeRange.length == 0) {
        return totalcost;
    }
    var reduce_cost = 0;
    $.each(row.ActiveTimeRange, function (index, item) {
        var _FreeType = Number(item.FreeType);
        if (_FreeType == 1) {
            reduce_cost += calculateTrueCostByTime(row, count, unit, item.StartTime, item.EndTime);
        }
    })
    var totoal = totalcost - reduce_cost;
    return (totoal > 0 ? totoal : 0);
}
function calculateTrueCostByTime(row, count, unit, _starttime, _endtime) {
    var cost = 0;
    _starttime = _starttime || row.CalculateStartTime;
    _endtime = _endtime || row.CalculateEndTime;

    var options = { visit: 'calculatetotalcostbytime', StartTime: row.StartTime, EndTime: row.EndTime, EndNumberCount: row.EndNumberCount, IsAnalysisQuery: row.IsAnalysisQuery, ContractID: row.ContractID, ID: row.ID, ContractDivideID: row.ContractDivideID, IsPriceRange: row.IsPriceRange, ChargeID: row.ChargeID, TotalUseCount: row.TotalUseCount, CalculateUseCount: count, ImportCoefficient: row.ImportCoefficient, ImportFeeID: row.ImportFeeID, IsMeterFee: row.IsMeterFee, CalculateUnitPrice: unit, CalculateCoefficient: row.CalculateCoefficient, Cost: row.Cost, CalculateStartTime: _starttime, CalculateEndTime: _endtime, FeeType: row.FeeType, ChargeWeiYueType: row.ChargeWeiYueType, WeiYuePercent: row.WeiYuePercent, RelatedFeeID: row.RelatedFeeID, DayGunLi: row.DayGunLi, TypeID: row.TypeID, FenTanCoefficient: row.FenTanCoefficient };
    $.ajax({
        type: 'POST',
        async: false,
        dataType: 'json',
        url: '../Handler/FeeCenterHandler.ashx',
        data: options,
        success: function (data) {
            cost = data.cost;
        }
    });
    return cost;
}
function get_my_pricerange(PriceRangeList, ChargeID, ID) {
    var list = [];
    $.each(PriceRangeList, function (index, item) {
        if (item.SummaryID == ChargeID && item.RoomFeeID == ID) {
            list.push(item);
        }
    })
    return list;
}
function calculateJieTiTotalPrice(row) {
    var totalPrice = 0;
    var PriceRangeValue = hdPriceRangeList.val()
    if (PriceRangeValue != '' && row.IsPriceRange) {
        var TotalPoint = calculateUseCount(row);
        var ImportCoefficient = row.ImportCoefficient;
        var PriceRangeList = eval('(' + (PriceRangeValue) + ')');
        var LastMaxValue = 0;
        var my_pricerange = get_my_pricerange(PriceRangeList, row.ChargeID, row.ID);
        for (var i = 0; i < my_pricerange.length; i++) {
            var pricerange = my_pricerange[i];
            if (pricerange.SummaryID == row.ChargeID) {
                var MinValue = Number(pricerange.MinValue);
                var MaxValue = Number(pricerange.MaxValue);
                var NianTotal = 0;
                if (pricerange.BaseType == "qnyl") {
                    NianTotal = (Number(row.TotalUseCount) > 0 ? Number(row.TotalUseCount) : 0);
                }
                if ((NianTotal + Number(TotalPoint)) >= MinValue && (NianTotal + Number(TotalPoint)) < MaxValue) {
                    if (NianTotal > MinValue) {
                        totalPrice += Number(TotalPoint) * pricerange.BasePrice * (ImportCoefficient > 0 ? ImportCoefficient : 1);
                    }
                    else {
                        totalPrice += (NianTotal + Number(TotalPoint) - MinValue) * pricerange.BasePrice * (ImportCoefficient > 0 ? ImportCoefficient : 1);
                    }
                    break;
                }
                if ((NianTotal + Number(TotalPoint)) >= MaxValue) {
                    if (i == my_pricerange.length - 1) {
                        totalPrice += (NianTotal + Number(TotalPoint) - MinValue) * pricerange.BasePrice * (ImportCoefficient > 0 ? ImportCoefficient : 1);
                        break;
                    }
                    if (pricerange.BaseType == "qnyl") {
                        if (MaxValue > NianTotal) {
                            MinValue = (NianTotal > MinValue ? NianTotal : MinValue);
                            totalPrice += (MaxValue - MinValue) * pricerange.BasePrice * (ImportCoefficient > 0 ? ImportCoefficient : 1);
                        }
                    }
                    else {
                        totalPrice += (MaxValue - MinValue) * pricerange.BasePrice * (ImportCoefficient > 0 ? ImportCoefficient : 1);
                    }
                }
            }
        }
    }
    return totalPrice;
}
function calculateAllDays(starttime, endtime) {
    var startdate, enddate, date, time;
    startdate = new Date(starttime.replace(/-/g, "/"));
    enddate = new Date(endtime.replace(/-/g, "/"));
    if (startdate > enddate) {
        return 0;
    }
    date = enddate.getTime() - startdate.getTime();
    time = Math.floor(date / (1000 * 60 * 60 * 24));
    return time + 1;
}
function calculatemonth(starttime, endtime) {
    var result = null;
    $.ajax({
        type: 'POST',
        async: false,
        dataType: 'json',
        url: '../Handler/FeeCenterHandler.ashx',
        data: { visit: 'calculatemonth', StartTime: starttime, EndTime: endtime },
        success: function (data) {
            result = data;
        }
    });
    return result;
}
function checktime(time) {
    if (time == undefined || time == "" || time == null || time == '0001-01-01T00:00:00.0000000' || time == '0001-01-01T00:00:00' || time == '1900-01-01T00:00:00.0000000' || time == '1900-01-01T00:00:00') {
        return "";
    }
    return time.substring(0, 16).split("T")[0];
}
function calculateEndTIme(row) {
    if (row.CalculateStartTime) {
        row.StartTime = row.CalculateStartTime;
    }
    if (row.CalculateEndTime) {
        row.EndTime = row.CalculateEndTime;
    }
    var start = checktime(row.CalculateStartTime);
    var end = checktime(row.CalculateEndTime);
    var newend = calculateNewEndTime(row);
    if (start != "" && end != "") {
        if (ConvertToDate(start) > ConvertToDate(end)) {
            return "";
        }
    }
    if (end != "" && newend != "") {
        if (ConvertToDate(end) > ConvertToDate(newend)) {
            return newend;
        }
    }
    return end;
}
function calculateNewEndTime(row) {
    if (row.CalculateStartTime) {
        row.StartTime = row.CalculateStartTime;
    }
    if (row.CalculateEndTime) {
        row.EndTime = row.CalculateEndTime;
    }
    var start = checktime(row.CalculateStartTime);
    var newend = checktime(row.NewEndTime);
    if (start != "" && newend != "") {
        if (ConvertToDate(start) > ConvertToDate(newend)) {
            return "";
        }
    }
    return newend;
}
function calculateOutDays(datetime) {
    var start = checktime(datetime);
    if (start == "") {
        return 0;
    }
    var startdatestr = datetime.substring(0, 16).split("T")[0].replace(/-/g, "/");
    var date1 = new Date(startdatestr);  //计算开始日期
    var date2 = new Date();    //计算结束日期
    var date3 = date2.getTime() - date1.getTime()  //时间差的毫秒数
    var days = Math.floor(date3 / (24 * 3600 * 1000));
    if (days < 0) {
        return 0;
    }
    return days;
}
function calculatePayCost(row) {
    //var totalrealcost = formatTotalRealCost(row.TotalRealCost, row);
    var totalrealcost = row.TotalFinalPayCost;
    var discount = calculateFinalDiscount(row);
    var restcost = Number(row.TotalCost) - Number(totalrealcost) - Number(discount) - Number(row.TotalFinalDiscountCost);
    return (restcost > 0 ? restcost : 0).toFixed(2);
}
function ConvertToDate(time) {
    time = time.replace(/-/g, "/").replace("T", " ");
    var date = new Date(time);
    return date;
}
function calculateDiscountValue(WriteDiscount, DiscountType, DiscountValue, totalCost, row) {
    var Value = 0;
    if (DiscountType == "percent") {
        Value = (totalCost * DiscountValue / 100).toFixed(2);
    }
    else if (DiscountType == "fixedamount") {
        Value = DiscountValue;
    }
    else if (DiscountType == "allfree") {
        Value = totalCost;
    }
    else if (DiscountType == "permonth") {
        var month_price = calculatemonthcost(row);
        Value = month_price * DiscountValue;
    }
    else {
        return (WriteDiscount < 0 ? 0 : WriteDiscount);
    }
    return Value;
}
function formatPayCost(value, row) {
    var cal_pay_cost = calculatePayCost(row);
    if (parseFloat(row.PayCost) <= 0) {
        row.PayCost = cal_pay_cost;
    }
    else if (parseFloat(row.PayCost) > cal_pay_cost) {
        row.PayCost = cal_pay_cost;
    }
    return row.PayCost;
}
function calculatemonthcost(row) {
    var count = calculateUseCount(row);
    var unit = calculateUnitPrice(row);
    //单价*计费面积(月度)
    var finalcost = 0;
    if (row.TypeID == 1) {
        finalcost = unit * count;
        return finalcost;
    }
    //定额(月度)
    if (row.TypeID == 2) {
        finalcost = unit;
    }
    //单价*计费面积*公摊系数(月度)
    if (row.TypeID == 3) {
        Coefficient = Number(row.FenTanCoefficient) > 0 ? Number(row.FenTanCoefficient) : 0;
        finalcost = unit * count * Coefficient;
    }
    //单价*计费面积(月度进位)
    if (row.TypeID == 7) {
        finalcost = xround(parseFloat(unit * count), 0);
        return finalcost;
    }
    return finalcost;
}
function timeToString(newDate) {
    var yyyy = newDate.getFullYear().toString();
    var MM = (Number(newDate.getMonth() + 1) < 10 ? "0" + (newDate.getMonth() + 1).toString() : (newDate.getMonth() + 1).toString());
    var dd = (Number(newDate.getDate()) < 10 ? "0" + newDate.getDate().toString() : newDate.getDate().toString());
    var HH = (Number(newDate.getHours()) < 10 ? "0" + newDate.getHours().toString() : newDate.getHours().toString());
    var mm = (Number(newDate.getMinutes()) < 10 ? "0" + newDate.getMinutes().toString() : newDate.getMinutes().toString());
    var ss = (Number(newDate.getSeconds()) < 10 ? "0" + newDate.getSeconds().toString() : newDate.getSeconds().toString());
    return yyyy + "-" + MM + "-" + dd + " " + HH + ":" + mm + ":" + ss;
}