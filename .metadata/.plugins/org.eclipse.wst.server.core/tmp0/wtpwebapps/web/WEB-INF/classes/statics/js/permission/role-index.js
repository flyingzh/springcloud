var ztree;
var setting = {
    data: {
        simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "parentId",
            rootPId: 0,
            type: "type"
        },
        key: {
            url: "nourl"
        }
    },
    check: {
        enable: true
        //nocheckInherit: true
    },
    view: {
        fontCss: {
            'color': 'blue',
            'font-family': '微软雅黑',
            "font-size": "16px"
        }
    }
    /*callback: {
        onClick: zTreeOnClick
    }*/
};
// var validateOptions = {
//     rules: {
//         name: {
//             required: true,
//             remote: {
//                 url: ''
//             }
//         }
//     },
//     messages: {
//         name: {
//             required: "请填写角色组名称",
//
//         }
//     }
// };

function zTreeOnClick(event, treeId, treeNode) {
    var url = "../../menu/queryMenuTree" + treeNode.id;
    $.get(url, function (result) {
        vm.role = result.data;
    })
};
var RoleVM = new Vue({
    el: "#role-info",
    data() {
        let This = this;
        return {
            isShow: false,
            isEdit: false,
            isView: false,
            reload: false,
            menus: {
                id: '',
                parentId: '',
                name: '',
                status: '',
                type: ''
            },
            treeNode: [],
            Constant: {
                SUCCESS_CODE: '100100'
            },
            selected: [],
            confirmConfig: {
                showConfirm: false,
                title: '提示',
                content: '请点击确认',
                onlySure: true,
                success: true
            },
            status: [
                {
                    label: '有效',
                    value: 1
                },
                {
                    label: '无效',
                    value: 0
                }
            ],
            body: {
                name: '',
                status: ''
            },
            addBody: {
                id: '',
                code: '',
                name: '',
                remark: '',
                status: '',
                menuTreeList: '',
                roleButtonList: '',
                menuList: ''
            },
            viewMenuData: new Map(),
            viewButtonData: new Map(),
            data_config: {
                url: contextPath+'/role/roleListPage',
                colNames: ['序号', '角色名称', '角色状态'],
                colModel: [
                    {name: 'id', index: 'id', width: 200, align: "center"},
                    {name: 'name', index: 'name', width: 200, align: "center"},
                    {
                        name: 'status', index: 'status', width: 80, align: "center",
                        formatter: function (value, grid, rows, state) {
                            return value === 1 ? "有效" : "无效";
                        }
                    }
                ]
            }
        }
    },
    methods: {
        search() {
            this.reload = !this.reload;
        },
        clear() {
            this.$refs.roleStatus.reset();
            this.$nextTick(function () {
                this.body.status = '';
            });
            this.body = {
                id: '',
                code: '',
                name: '',
                remark: '',
                status: '',
                menuTreeList: '',
                selected: []
            };
        },
        view() {//查看
            if (!ht.util.hasValue(this.selected, "array")) {
                layer.alert("请先选择一条记录!");
                return false;
            } else if (this.selected.length > 1) {
                layer.alert("最多只能选择一条记录!");
                return false;
            }
            var id = this.selected[0];
            var id = String(this.selected[0]);
            if (!$.isEmptyObject(id)) {
                RoleVM.isShow = true;
                //初始化菜单树
                this.modifyTree(id);
            }
        },
        viewData(id) {
            $.ajax({
                type: "POST",
                url: contextPath+"/role/roleInfo/" + id,
                data: '',
                dataType: "json",
                success: function (res) {
                    if (res.code === RoleVM.Constant.SUCCESS_CODE) {
                        var role = res.data;
                        RoleVM.addBody = role;
                        var menues = role.menuList;
                        if (menues != null && menues.length > 0) {
                            //处理角色菜单
                            RoleVM.menuSelectInit(menues);
                        }
                        RoleVM.isShow = true;
                        RoleVM.isEdit = true;
                    }
                },
                error: function (err) {
                    console.log("服务器出错");
                },
            });
        },
        add() {//新增
            console.log("新增");
            console.log(this.selected);
            if (this.selected.length > 0) {
                layer.alert("新增不需要选择记录!");
                return false;
            }
            this.isShow = true;
            //初始化菜单树
            this.initTree();

        },
        initTree() {//初始化菜单树
            $.get(contextPath+"/menu/queryAllMenuTree", function (r) {
                ztree = $.fn.zTree.init($("#menuTree"), setting, r.data);
            });
        },
        modifyTree(id) {
            $.get(contextPath+"/menu/queryAllMenuTree", function (r) {
                RoleVM.treeNode = r.data;
                ztree = $.fn.zTree.init($("#menuTree"), setting, RoleVM.treeNode);
                if (r.code === RoleVM.Constant.SUCCESS_CODE) {
                    RoleVM.modifyInfo(id);
                }
            });
        },
        viewTree(id) {
            $.get(contextPath+"/menu/queryAllMenuTree", function (r) {
                RoleVM.treeNode = r.data;
                ztree = $.fn.zTree.init($("#menuTree"), setting, RoleVM.treeNode);
                if (r.code === RoleVM.Constant.SUCCESS_CODE) {
                    RoleVM.viewData(id);
                }
            });
        },
        save() {//保存校验
            if (!$('form').valid()) {
                return false;
            }
            var params = RoleVM.addBody;
            var menuTeeList = [];
            var checkMenus = ztree.getCheckedNodes();
            for (var i  in checkMenus) {
                var menu = checkMenus[i];
                var menuTee = {};
                menuTee.id = menu.id;
                menuTee.parentId = menu.parentId;
                menuTee.type = menu.type;
                menuTeeList.push(menuTee);
            }
            //选中的菜单树
            params.menuTreeList = menuTeeList;
            if ($.isEmptyObject(String(params.id))) {
                this.addInstance(params);
            } else {
                this.update(params);
            }
        },
        modify() {//修改获取数据
            if (!ht.util.hasValue(this.selected, "array")) {
                layer.alert("请先选择一条记录!");
                return false;
            } else if (this.selected.length > 1) {
                layer.alert("最多只能选择一条记录!");
                return false;
            }
            console.log("修改选取的id", this.selected);
            var id = String(this.selected[0]);
            if (!$.isEmptyObject(id)) {
                RoleVM.isShow = true;
                //初始化菜单树
                this.modifyTree(id);
            }
        }
        ,
        modifyInfo(id) {
            $.ajax({
                type: "POST",
                url: contextPath+'/role/roleInfo/' + id,
                data: '',
                dataType: "json",
                success: function (res) {
                    if (res.code === RoleVM.Constant.SUCCESS_CODE) {
                        var role = res.data;
                        var menues = role.menuList;
                        if (menues != null && menues.length > 0) {
                            //处理角色菜单
                            RoleVM.menuSelectInit(menues);
                        }
                        RoleVM.addBody = role;
                    }
                }, error: function () {

                }
            });
        },
        menuSelectInit(list) {//角色菜单选中
            var treeNode = ztree.getNodes();
            var nodes = ztree.transformToArray(treeNode);
            for (var i in  list) {
                var obejct = list[i];
                var id = obejct.id;
                for (var n in nodes) {
                    var nObject = nodes[n];
                    var nid = nObject.id;
                    if (String(id) === nid) {
                        ztree.checkNode(nObject, true, false);
                        RoleVM.viewMenuData.set(id, obejct);
                    }
                }
                var buttonList = obejct.buttonList
                if (buttonList != null && buttonList.length > 0) {
                    this.buttonSelectInit(buttonList, nodes, id);
                }

            }
        },
        buttonSelectInit(list, nodes, menuId) {//菜单按钮选中
            for (var i in  list) {
                var obejct = list[i];
                var id = obejct.buttonId;
                for (var n in nodes) {
                    var nObject = nodes[n];
                    var nid = nObject.id;
                    var pid = nObject.parentId
                    if (String("B" + id) === nid && String(menuId) === pid) {
                        ztree.checkNode(nObject, true, false);
                        RoleVM.viewButtonData.set(String("M" + menuId + "B" + id), obejct);
                    }
                }
            }
        },
        update(params) {//修改角色
            this.isShow = false;
            $.ajax({
                type: "POST",
                url: contextPath+'/role/updateRole',
                data: JSON.stringify(params),
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                success: function (res) {
                    if (res.code === RoleVM.Constant.SUCCESS_CODE) {
                        layer.alert("修改角色成功");
                        //添加成功后初始化,清空输入内容
                        RoleVM.cancel();
                        RoleVM.reload = !RoleVM.reload;
                    } else {
                        //输出错误提示
                        layer.alert(res.msg);
                    }
                },
                error: function (result) {
                    console.log("服务器出错");
                },
            });

        },
        addInstance(params) {//添加角色
            this.isShow = false;
            $.ajax({
                type: "POST",
                url: contextPath+'/role/addRole',
                data: JSON.stringify(params),
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                success: function (res) {
                    if (res.code === RoleVM.Constant.SUCCESS_CODE) {
                        layer.alert("添加角色成功");
                        //添加成功后初始化,清空输入内容
                        RoleVM.cancel();
                        RoleVM.reload = !RoleVM.reload;
                    } else {
                        //输出错误提示
                        layer.alert(res.msg);
                    }
                },
                error: function (err) {
                    console.log("服务器出错");
                },
            });

        },
        del() {//点击'删除'
            if (this.selected.length === 0) {
                layer.alert("请选择一条记录进行删除");
                return;
            }
            if (this.selected.length > 1) {
                layer.alert("只能选择一条记录进行删除");
                return;
            }
            var id = this.selected[0];
            $.ajax({
                url: contextPath+'/role/delRoleById/' + id,
                method: 'post',
                dataType: "json",
                data: '',
                contentType: 'application/json;charset=utf-8',
                success: function (res) {
                    if (res.code === RoleVM.Constant.SUCCESS_CODE) {
                        layer.alert("删除成功");
                        RoleVM.reload = !RoleVM.reload;
                    } else {
                        console.log(res.msg);
                    }
                },
                error: function (e) {
                    console.log(e);
                }
            });
        },
        cancel(){

            this.isShow = false;
            this.isEdit = false;
            this.selected.length = 0;
            this.clear();
        },
        paramsValidate() {

        },
        initFormValidate() {//参数验证
            var validateOptions = {
                onfocusout: function (element) {
                    $(element).valid();
                },
                onkeyup: false,
                rules: {
                    znumber: {
                        isnumber: true,
                        required: true,
                    },
                    code: {
                        iscode: true,
                        required: true,
                    },
                    // loginName: {
                    //     maxlength: 20,
                    //     minlength: 6
                    // },
                    // username: {
                    //     required: true,
                    //     // maxlength: 50,
                    //     isChar : true
                    // },
                    // password: {
                    //     required: true,
                    //     minlength: 5
                    // },
                    // repassword: {
                    //     required: true,
                    //     minlength: 5,
                    //     equalTo: "#password"
                    // },
                },
                messages: {
                    znumber: {
                        // maxlength: '登录名最多50个字符',
                        // minlength: '登录名最少6个字符'
                        required: '请输入角色编号'
                    },
                    code: {
                        // maxlength: '登录名最多50个字符',
                        // minlength: '登录名最少6个字符'
                        required: '请输入角色名称'
                    },
                    // loginName: {
                    //     maxlength: '登录名最多50个字符',
                    //     minlength: '登录名最少6个字符'
                    // },
                    // username: {
                    //     required: "请输入账号",
                    //     maxlength: '姓名不能超过50个字符',
                    // },
                }
            };
            //return validateOptions;
            $("#form").validate(validateOptions);
        }
    },
    mounted() {
        // $('form').validate(validateOptions);
        this.initFormValidate();
        jQuery.validator.addMethod("isnumber", function (value, element) {
            var isnumber = /^[a-zA-Z0-9]+$/;
            return isnumber.test(value);
        }, "请使用英文和数字");
        jQuery.validator.addMethod("iscode", function (value, element) {
            var iscode = /^[\u4e00-\u9fa5]+$/;
            return iscode.test(value);
        }, "请使用中文");
    }
});