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
    },
    view: {
        fontCss: {
            'color': 'blue',
            'font-family': '微软雅黑',
            "font-size": "16px"
        }
    }
};
var RoleGroupVM = new Vue({
    el: "#roleGroup-info",
    data() {
        let This = this;
        return {
            isShow: false,
            isEdit: false,
            reload: false,
            isStatus: false,
            ishide: true,
            islook: false,
            selected: [],
            selectRole: [],
            Constant: {
                SUCCESS_CODE: '100100'
            },
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
            },
            addBody: {
                id: '',
                code: '',
                name: '',
                remark: '',
                status: '',
                roleList: ''
            },
            data_config: {
                url: contextPath+'/sysRoleGroup/roleGroupListPage',
                colNames: ['角色组编号', '角色组名称', '状态'],
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
        search() {//点击'搜索'按钮
            this.reload = !this.reload;
        },
        clear() {//点击'清空'按钮
            this.body = {
                name: ''
            }
            this.reload = !this.reload;
        },
        view() {//点击'查看'按钮
            this.isShow = true;
            this.ishide = false;
            if (this.selected.length !== 1) {
                alert('查看只能对单条数据进行操作');
                return;
            }
        },
        add() {//点击'新增'按钮
            this.isShow = true;
            this.initRoleTree();

        },
        initRoleTree() {//初始化角色树
            $.get(contextPath+"/role/queryRoleTree?type=1", function (r) {
                ztree = $.fn.zTree.init($("#roleTree"), setting, r.data);
            });
        },
        save() {//点击'保存'按钮
            if ($('form').valid()) {
                var params = RoleGroupVM.addBody;
                var selectRoles = ztree.getCheckedNodes();
                var roleList = [];
                for (var i  in selectRoles) {
                    var role = {};
                    role.id = selectRoles[i].id;
                    roleList.push(role);
                }
                params.roleList = roleList;
                var id = String(params.id);
                if (!id || id=='undefined') {
                    this.saveRoleGroup(params);
                } else {
                    this.update(params);
                }
            }
        },
        saveRoleGroup(params) {//保存角色组
            $.ajax({
                method: 'post',
                url: contextPath+'/sysRoleGroup/add',
                dataType: 'json',
                data: JSON.stringify(params),
                contentType: "application/json;charset=utf-8",
                success: function (res) {
                    if (res.code == RoleGroupVM.Constant.SUCCESS_CODE) {
                        layer.alert("添加角色组成功");
                        //添加成功后初始化,清空输入内容
                        RoleGroupVM.cancel();
                        RoleGroupVM.reload = !RoleGroupVM.reload;
                    } else {
                        layer.alert(res.msg);
                    }
                },
                error: function () {

                }

            });
        },
        modify(type) {//点击'修改',显示修改页面

            //根据类型  禁止保存按钮
            if(type && type == 'search'){
                //置灰保存按钮
                this.isEdit = true
            }
            if (!ht.util.hasValue(this.selected, "array")) {
                layer.alert("请先选择一条记录!");
                return false;
            } else if (this.selected.length > 1) {
                layer.alert("最多只能选择一条记录!");
                return false;
            }
            var id = String(this.selected[0]);
            if (!$.isEmptyObject(id)) {
                RoleGroupVM.isShow = true;
                RoleGroupVM.initRoleTree();
                this.modifyInfo(id);
            }
        },
        modifyInfo(id) {
            $.ajax({//回显
                url: contextPath+'/sysRoleGroup/roleGroupInfo/' + id,
                type: 'post',
                dataType: "json",
                data: '',
                success: function (res) {
                    if (res.code === RoleGroupVM.Constant.SUCCESS_CODE) {
                        var object = res.data;
                        RoleGroupVM.addBody = object;
                        var roleList = object.roleList;
                        RoleGroupVM.setRoleChecked(roleList);
                    } else {

                    }
                },
                error: function (res) {

                }
            });
        },
        setRoleChecked(list) {
            if (list != undefined && list.length > 0) {
                var treeObj = $.fn.zTree.getZTreeObj("roleTree");
                var treeNode = ztree.getNodes();
                list.map((item)=>{
                    console.log(item)
                    //遍历自己选中的数据
                    treeNode.map((obj)=>{
                        if(obj.id == item.id){
                            treeObj.checkNode(obj, true, false);
                        }
                    })
                })
            }
        },
        update(params) {//修改页面,点击'保存'
            this.isShow = false;
            $.ajax({
                type: "POST",
                url: contextPath+'/sysRoleGroup/updateRoleGroup',
                data: JSON.stringify(params),
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                success: function (res) {
                    if (res.code === RoleGroupVM.Constant.SUCCESS_CODE) {
                        layer.alert("修改角色组成功");
                        //添加成功后初始化,清空输入内容

                        RoleGroupVM.cancel();
                        RoleGroupVM.addBody.id = "";
                        RoleGroupVM.reload = !RoleGroupVM.reload;
                    } else {
                        layer.alert(res.msg);
                    }
                },
                error: function (err) {
                    conssole.log("服务器出错");
                },
            });

        },
        del() { //点击'删除'按钮
            if (!ht.util.hasValue(this.selected, "array")) {
                layer.alert("请先选择一条记录!");
                return false;
            }
            var ids = new Array();
            for (var i = 0; i < this.selected.length; i++) {
                ids[i] = this.selected[i];
            }
            $.ajax({
                type: 'post',
                async: true,
                traditional: true,
                data:{ids:ids},
                url: contextPath+'/sysRoleGroup/delRoleGroupById',
                success: function (res) {
                    if (res.code === RoleGroupVM.Constant.SUCCESS_CODE) {
                        layer.alert(res.data);
                        //添加成功后初始化,清空输入内容
                        RoleGroupVM.cancel();
                        RoleGroupVM.reload = !RoleGroupVM.reload;
                    } else {
                        layer.alert(res.msg);
                    }
                },
                error: function (err) {
                    conssole.log("服务器出错");
                },
            });
        },
        detailClick(data) {

        },
        cancel() {//点击'退出'按钮
            this.clearAddBody();
            this.isShow = false;
            //显示保存按钮
            this.isEdit = false;
        },
        clearAddBody() {
            RoleGroupVM.addBody = {
                code: '',
                name: '',
                remark: '',
                status: '',
                roleList: ''
            };
        },
        initFormValidate() {//参数验证
            var validateOptions = {
                onfocusout: function (element) {
                    $(element).valid();
                },
                onkeyup: false,
                rules: {
                    znumber: {
                        znumber: true,
                        required: true,
                    }
                },
                messages: {
                    znumber: {
                        // maxlength: '登录名最多50个字符',
                        // minlength: '登录名最少6个字符'
                        required: '请输入角色编号'
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
            $("#form").validate(validateOptions);
        }
    },
    mounted() {
        this.initFormValidate();
        jQuery.validator.addMethod("znumber", function (value, element) {
            var znumber = /^[a-zA-Z0-9]+$/;
            return znumber.test(value);
        }, "请使用英文和数字");
    }
});