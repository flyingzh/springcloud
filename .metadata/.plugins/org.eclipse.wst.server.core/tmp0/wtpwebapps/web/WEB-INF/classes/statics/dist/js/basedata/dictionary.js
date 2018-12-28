"use strict";
var ztree, setting = {
    data: {simpleData: {enable: !0, idKey: "id", pIdKey: "parentId", rootPId: -1}, key: {url: "nourl"}},
    check: {nocheckInherit: !0},
    callback: {onClick: zTreeOnClick}
};

function zTreeOnClick(e, t, n) {
    $("#codeValue").attr("readonly", "readonly");
    var a = contextPath + "/codeController/info?id=" + n.id;
    $.get(a, function (e) {
        vm.organ = e.data, vm.showInfo = !0, vm.title = "修改字典"
    })
}

function initTree() {
    $.get(contextPath + "/codeController/query", function (e) {
        ztree = $.fn.zTree.init($("#allorganTree"), setting, e.data)
    })
}

var vm = new Vue({
    el: "#rrapp",
    data: {
        showInfo: !1,
        title: null,
        organ: {
            parentName: null,
            parentId: 0,
            sort: "0",
            value: "",
            mark: "",
            remark: "",
            type: "1",
            open: "true",
            name: "",
            id: "",
            searchContent: ""
        }
    },
    created: function () {
        initTree()
    },
    methods: {
        search: function () {
            $.get(contextPath + "/codeController/search?name=" + vm.organ.searchContent, function (e) {
                ztree = $.fn.zTree.init($("#allorganTree"), setting, e.data)
            })
        }, add: function () {
            $("#codeValue").removeAttr("readonly");
            var e = ztree.getSelectedNodes();
            e.length <= 0 ? layer.alert("请选择父级菜单") : (vm.showInfo = !0, vm.title = "新增字典", vm.organ.parentId = e[0].id, vm.organ.name = "", vm.organ.value = "", vm.organ.sort = "", vm.organ.mark = "", vm.organ.remark = "", vm.organ.type = "1", vm.organ.parentName = e[0].name, vm.organ.id = "", vm.organ.searchContent = "")
        }, del: function (e) {
            var t = ztree.getSelectedNodes();
            t.length <= 0 && layer.alert("请选择要删除的组织"), !$.isEmptyObject(t[0].children) && 0 < t[0].children.length ? alert("存在子节点，无法删除") : confirm("确定要删除【" + t[0].name + "】节点吗？", function () {
                var e = contextPath + "/codeController/delete?id=" + t[0].id;
                $.post(e, function (e) {
                    100100 == e.code ? toast(e.msg, function () {
                        ztree.removeNode(t[0])
                    }) : alert(e.msg)
                })
            })
        }, saveOrUpdate: function (e) {
            if (/^[0-9]*$/.test(vm.organ.sort)) if ($.isEmptyObject(vm.organ.value)) alert("请填写码值"); else if ($.isEmptyObject(vm.organ.name)) alert("请填写码值名"); else if (vm.organ.sort) {
                if (/^[\u4E00-\u9FA5]{1,6}$/.test(vm.organ.value)) alert("跟你说过不要写中文了！"); else {
                    var t = $.isEmptyObject(vm.organ.id) ? contextPath + "/codeController/save" : contextPath + "/codeController/update";
                    $.ajax({
                        type: "POST",
                        url: t,
                        data: JSON.stringify(vm.organ),
                        contentType: "application/json",
                        success: function (e) {
                            if (100100 == e.code) {
                                var t = e.data, n = ztree.getSelectedNodes();
                                null == vm.organ.id || "" == vm.organ.id ? toast(e.msg, function () {
                                    ztree.addNodes(n[0], {id: t.id, parentId: t.parentId, name: t.name, icon: ""})
                                }) : toast(e.msg, function () {
                                    n[0].name = t.name, n[0].icon = "", ztree.updateNode(n[0])
                                }), vm.showInfo = !1
                            } else layer.alert(e.msg)
                        }
                    })
                }
            } else alert("请填写序号"); else alert("请传入有效的序号")
        }, reload: function (e) {
            $("#organFrom")[0].reset()
        }
    }
});