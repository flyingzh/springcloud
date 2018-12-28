//jqGrid的配置信息
// $.jgrid.defaults.width = 1000;
// $.jgrid.defaults.responsive = true;

if ($.jgrid) {
    $.jgrid.defaults.styleUI = 'Bootstrap';
    $.jgrid.defaults.onSortCol = function () {
        return 'stop'
    };
}

//工具集合Tools
window.T = {};

// 获取请求参数
// 使用示例
// location.href = http://localhost:8080/index.html?id=123
// T.p('id') --> 123;
var url = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
};
T.p = url;

//全局配置
$.ajaxSetup({
    complete: function (XMLHttpRequest, textStatus) {
        // 如果请求返回的不是 json 数据，而是 login.html 页面的源代码
        if (XMLHttpRequest.responseText.indexOf('login-page') > -1) {
            window.location.href = '/' + window.location.pathname.split('/')[1] + '/login.html';
        }

        var result = XMLHttpRequest.responseJSON;
        if (result && (result.code == -999 || result.code == -1000)) {
            alert(result.message);
        }
    },
    cache: false
});


//选择一条记录
function getSelectedRow (id) {
    var newId = (typeof (id) == 'undefined' || !!id == false) ? 'jqGrid' : id;
    var grid = $("#" + newId);
    var rowKey = grid.getGridParam("selrow");
    if (!rowKey) {
        alert("请选择一条记录");
        return;
    }

    var selectedIDs = grid.getGridParam("selarrrow");
    if (selectedIDs.length > 1) {
        alert("只能选择一条记录");
        return;
    }
    return selectedIDs[0];
}

/**
 * 获取选中行attrName 列的值
 * @param attrName
 */
function getSelectedRowId (id, attrName) {
    var newId = (typeof (id) == 'undefined' || !!id == false) ? 'jqGrid' : id;
    var grid = $("#" + newId);
    var rowKey = grid.getGridParam("selrow");
    if (!rowKey) {
        alert("请选择一条记录");
        return;
    }

    var selectedIDs = grid.getGridParam("selarrrow");
    if (selectedIDs.length > 1) {
        alert("只能选择一条记录");
        return;
    }
    var selectRow = grid.jqGrid('getRowData', rowKey);
    return selectRow[attrName];
}

//选择多条记录
function getSelectedRows (id) {
    var newId = (typeof (id) == 'undefined' || !!id == false) ? 'jqGrid' : id;
    var grid = $("#" + newId);
    var rowKey = grid.getGridParam("selrow");
    if (!rowKey) {
        alert("请选择一条记录");
        return;
    }
    return grid.getGridParam("selarrrow");
}

/**
 *  获取zTree 节点下的所有节点
 * @param treeNode
 * @param childs
 */
function getAllNodes (treeNode, childs) {
    var childNodes = treeNode.children;
    if (childNodes) {
        for (var i = 0; i < childNodes.length; i++) {
            childs += "," + childNodes[i].id;
            if (childNodes) {
                childs = getAllNodes(childNodes[i], childs);
            }
        }
    }
    return childs;
}