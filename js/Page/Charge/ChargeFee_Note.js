
$(function () {
    getAllNotes();
})
function saveNote() {
    var idarry = parent.GetRoomIDList();
    if (idarry.length == 0) {
        show_message('请选择房间', 'warning');
        return;
    }
    var Title = "";
    var Remark = $('#noteDesc').textbox('getValue');
    if (Remark == "") {
        show_message('内容不能为空', 'warning');
        return;
    }
    $('#ff').form('submit', {
        url: '../Handler/FeeCenterHandler.ashx',
        onSubmit: function (param) {
            param.visit = 'saveroomfeenote';
            param.RoomID = idarry[0];
            param.Title = Title;
            param.Remark = Remark;
        },
        success: function (data) {
            var dataObj = eval("(" + data + ")");
            if (dataObj.status) {
                show_message('添加成功', 'success', function () {
                    $('#noteDesc').textbox('setValue', '');
                    $('#attachfile').filebox('setValue', '');
                    getAllNotes();
                });
            }
            else {
                show_message('系统错误', 'error');
            }
        }
    });
}
function getAllNotes() {
    var idarry = parent.GetRoomIDList();
    if (idarry.length == 0) {
        show_message('请选择房间', 'warning');
        return;
    }
    var options = { visit: 'getallnotes', RoomID: idarry[0] };
    $.ajax({
        type: 'POST',
        dataType: 'html',
        url: '../Handler/FeeCenterHandler.ashx',
        data: options,
        success: function (message) {
            message = message.replace(/\r\n/g, "<BR>")
            message = message.replace(/\n/g, "<BR>");
            var data = eval("(" + message + ")");
            if (data.status) {
                $('#noteContent').html('');
                $.each(data.list, function (index, item) {
                    var $html = '<table class="noteitem">';
                    $html += '<tr>';
                    $html += '<td style="width:20px">';
                    $html += '<input type="checkbox" name="notelist" nid="' + item.ID + '">';
                    $html += '</td>';
                    $html += '<td style="width:100px">';
                    $html += item.AddMan;
                    $html += '</td>';
                    $html += '<td style="width:200px">';
                    $html += checkdatetime(item.AddTime);
                    $html += '</td>';
                    $html += '<td style="padding-right:10px;">';
                    $html += '内容: ' + item.Remark;
                    $html += '</td>';
                    if (item.FilePath != '') {
                        $html += '<td style="width:350px">';
                        $html += '附件: <a target="_blank" href="' + item.FullFilePath + '">' + item.OriFileName + ' 下载</a>';
                        $html += '</td>';
                    }
                    $html += '</tr>';
                    $html += '</table>';
                    $($html).appendTo('#noteContent');
                })
            }
            else {
                show_message('系统错误', 'error');
            }
        }
    });
}
function checkdatetime(time) {
    if (time == undefined || time == "" || time == null || time == '0001-01-01T00:00:00.0000000' || time == '0001-01-01T00:00:00' || time == '1900-01-01T00:00:00.0000000' || time == '1900-01-01T00:00:00') {
        return "";
    }
    return time.substring(0, 19).replace("T", " ");
}
function deleteNotes() {
    var idlist = [];
    $.each($('input:checkbox[name="notelist"]'), function () {
        if (this.checked) {
            var id = $(this).attr('nid');
            idlist.push(id);
        }
    });
    if (idlist.length == 0) {
        show_message('请选择一个备忘录', 'warning');
        return;
    }
    top.$.messager.confirm('提示', '确认删除?', function (r) {
        if (r) {
            var options = { visit: 'deletenotes', ids: JSON.stringify(idlist) };
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: '../Handler/FeeCenterHandler.ashx',
                data: options,
                success: function (message) {
                    if (message.status) {
                        show_message('删除成功', 'success', function () {
                            getAllNotes();
                        });
                    }
                    else {
                        show_message('系统错误', 'error');
                    }
                }
            });
        }
    })
}