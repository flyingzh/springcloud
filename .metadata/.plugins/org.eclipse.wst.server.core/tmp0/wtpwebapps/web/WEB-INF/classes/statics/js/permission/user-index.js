var ztree;
var organTree;
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
var organSetting = {
    data: {
        simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "parentId",
            rootPId: 0,
            type: "type"
        },
        key: {
            name: "orgName"
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
var UserVM = new Vue({
    el: "#user-index",
    data: {
        isShow: false,
        isEdit: false,
        reload: false,
        selectRole: [],
        selected: [],
        radioData: '',
        Constant: {
            SUCCESS_CODE: '100100'
        },
        organList: [],
        body: {
            username: '',
            loginName: '',
            email: '',
            empCode: ''
        },
        addUser: {
            id: '',
            username: '',
            loginName: '',
            password: '',
            phone: '',
            email: '',
            status: null,
            empCode: '',
            photo: null,
            userCode: '',
            roleList: '',
            organId: '',
            userOrganList: ''
        },
        data_user_list: {//页表页数据
            url: contextPath+'/user/list',
            colNames:
                ['操作', '账号', '用户名', '员工编号', '邮箱账号', '状态'],
            colModel:
                [
                    {name: 'id', index: 'id', width: 200, align: "center"},
                    {name: 'loginName', index: 'loginName', width: 200, align: "center"},
                    {name: 'username', index: 'username', width: 200, align: "center"},
                    {name: 'userCode', index: 'userCode', width: 200, align: "center"},
                    {name: 'email', index: 'email', width: 200, align: "center"},
                    {
                        name: 'status',
                        index: 'status',
                        width: 200,
                        align: "center",
                        formatter: function (value, grid, rows, state) {
                            return value == 1 ? "正常" : "禁用";
                        }
                    }
                ]
        }
    },
    methods: {
        cancel() {//点击'退出',显示列表页
            this.isShow = false;
            this.selected = [];
            this.initAddBody();
        },
        search() {
            this.reload = !this.reload;
        },
        add() {//点击'新增',显示新增页
            this.isShow = true;
            this.initAddBody();
            this.initRoleTree();
            //获取所有组织机构
            this.queryAllOrgan();
            this.initOrganTree();
        },
        initAddBody() {//清空新增页内容
            this.addUser = {
                username: '',
                loginName: '',
                password: '',
                phone: '',
                email: '',
                status: null,
                empCode: '',
                photo: null,
                userCode: '',
                organId: '',
                roleList: '',
                userOrganList: ''
            };
            this.selected = [];
        },
        queryAllOrgan() {//查询所有组织机构
            $.ajax({
                type: "POST",
                url: contextPath+"/user/queryAllOrgan",
                data: '',
                dataType: "json",
                success: function (res) {
                    //返回成功标识
                    if (res.code === UserVM.Constant.SUCCESS_CODE) {
                        //获取组织机构数据
                        UserVM.organList = res.data;

                        UserVM.initOrganTree();
                    } else {

                    }

                }, error: function () {

                }
            });
        },
        initOrganTree() {
            organTree = $.fn.zTree.init($("#organTree"), organSetting, this.organList);
        },
        initRoleTree() {//初始化角色树
            $.get(contextPath+"/role/queryRoleTree?type=2", function (r) {
                ztree = $.fn.zTree.init($("#roleTree"), setting, r.data);
            });
        },
        save() {//点击'保存按钮'
            let This = this;
            if (!$('form').valid()) {
                return;
            }
            //获取分配的角色
            var roles = this.getCheckRoles();
            //获取分配的组织机构
            var organs = this.getCheckOrgans();
            //用户对象
            var params = this.addUser;
            params.roleList = roles;
            params.userOrganList = organs;
            var id = params.id;
            if ($.isEmptyObject(String(id)) || id === undefined) {
                this.saveUser(params);
            } else {
                this.updateUser(params);
            }
        },
        getCheckRoles() { //获取分配的角色
            var roleList = new Array();
            var selectRoleList = ztree.getCheckedNodes();
            var roleMap = new Map();
            for (var i in selectRoleList) {
                var roleObject = selectRoleList[i];
                var id = roleObject.id;
                var type = roleObject.type;
                if (type === '2') {
                    roleMap.set(roleObject.id, roleObject);
                }
            }
            var roleList = new Array();
            for (var [key, value]  of roleMap) {
                var roleObject = value;
                var role = {};
                var type = roleObject.type;
                if (type === '2') {//角色
                    role.id = roleObject.id;
                    role.name = roleObject.name;
                    role.code = roleObject.code;
                    role.status = '0';
                    roleList.push(role);
                }
            }
            /* $.map(roleMap, function (k, v) {
                 var role = {};
                 var type = v.type;
                 if (type === '2') {//角色
                     role.id = v.id;
                     role.name = v.name;
                     role.code = v.code;
                     role.status = '0';
                     roleList.push(role);
                 }

             });*/
            return roleList;
        },
        getCheckOrgans() {//获取分配的所管组织机构
            var userOrganList = new Array();
            var checkedOrganTree = organTree.getCheckedNodes();

            for (var i in checkedOrganTree) {
                var treeObjct = checkedOrganTree[i];
                var userOrgan = {};
                userOrgan.organId = treeObjct.id;
                userOrganList.push(userOrgan);
            }
            return userOrganList;
        },
        updateUser(params) {
            $.ajax({
                type: "POST",
                url: contextPath+"/user/updateUser",
                data: JSON.stringify(params),
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                success: function (res) {
                    if (res.code === UserVM.Constant.SUCCESS_CODE) {
                        layer.alert("修改用户成功");
                        //添加成功后初始化,清空输入内容
                        UserVM.cancel();
                        UserVM.reload = !UserVM.reload;
                    } else {
                        layer.alert(res.msg);
                    }
                },
                error: function (err) {
                    console.log("服务器出错");
                },
            });
        },
        saveUser(params) {//添加用户
            $.ajax({
                type: "POST",
                url: contextPath+"/user/save",
                data: JSON.stringify(params),
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                success: function (res) {
                    if (res.code === UserVM.Constant.SUCCESS_CODE) {
                        layer.alert("添加用户成功");
                        //添加成功后初始化,清空输入内容
                        UserVM.cancel();
                        UserVM.reload = !UserVM.reload;
                    } else {
                        layer.alert(res.msg);
                    }
                },
                error: function (err) {
                    console.log("服务器出错");
                },
            });
        },
        modify() {
            if (this.selected.length === 0) {
                layer.alert("请选择一条记录进行修改");
                return false;
            }
            if (this.selected.length > 1) {
                layer.alert("只能选择一条记录进行修改");
                return false;
            }
            var id = this.selected[0];
            if (!$.isEmptyObject(String(id))) {
                UserVM.isShow = true;
                UserVM.queryAllOrgan();
                this.modifyInfo(id);
            }
        },
        modifyInfo(id) {
            $.ajax({
                type: 'POST',
                url: contextPath+'/user/getUserRoleInfo/' + id,
                data: '',
                dataType: 'json',
                success: function (res) {
                    console.log("执行了")
                    if (res.code === UserVM.Constant.SUCCESS_CODE) {
                        var user = res.data;
                        UserVM.addUser = user;
                        var roleList = user.roleList;
                        UserVM.initUserRoleTree(roleList);
                        UserVM.addUser.organId = user.organId;
                        var organList = user.userOrganList;
                        UserVM.setOrganChecked(organList);
                        /* var roleList = user.roleList;
                         UserVM.setRoleChecked(roleList);*/

                    } else {
                        layer.alert(res.msg);
                    }
                },
                error: function (res) {

                }
            });
        },
        setRoleChecked(list) {
            var treeNode = ztree.getNodes();
            var nodes = ztree.transformToArray(treeNode);
            for (var i in  list) {
                var obejct = list[i];
                var id = obejct.id;
                for (var n in nodes) {
                    var nObject = nodes[n];
                    var nid = nObject.id;
                    if (String(nid) === String(id)) {
                        ztree.checkNode(nObject, true, false);
                    }
                }
            }
        },
        setOrganChecked(organList) {
            var treeNode = organTree.getNodes();
            var nodes = organTree.transformToArray(treeNode);
            for (var i in  organList) {
                var obejct = organList[i];
                var id = obejct.id;
                for (var n in nodes) {
                    var nObject = nodes[n];
                    var nid = nObject.id;
                    if (String(nid) === String(id)) {
                        organTree.checkNode(nObject, true, false);
                    }
                }
            }
        },
        view() {

            if (this.selected.length === 0) {
                layer.alert("请选择一条记录进行查看");
                return false;
            }
            if (this.selected.length > 1) {
                layer.alert("只能选择一条记录进行查看");
                return false;
            }
            var id = this.selected[0];
            if (!$.isEmptyObject(id) && id !== undefined) {

                this.viewInfo(id);
            }
        },
        viewInfo(id) {
            $.ajax({
                type: 'POST',
                url: contextPath+'/user/getUserRoleInfo/' + id,
                data: '',
                dataType: 'json',
                success: function (res) {
                    console.log(res)
                    if (res.code === UserVM.Constant.SUCCESS_CODE) {
                        var user = res.data;
                        UserVM.addUser = user;
                        UserVM.isShow = true;
                        var roleList = user.roleList;
                        UserVM.initUserRoleTree(roleList);
                    } else {
                        layer.alert(res.msg);
                    }
                },
                error: function (res) {

                }
            });
        },
        initUserRoleTree(roleList) {
            $.get(contextPath+"/role/queryRoleTree?type=2", function (r) {
                ztree = $.fn.zTree.init($("#roleTree"), setting, r.data);
                UserVM.processSelectRole(roleList);
            });
        },
        processSelectRole(list) {
            var treeNode = ztree.getNodes();
            var nodes = ztree.transformToArray(treeNode);

            for (var i in  list) {

                var obejct = list[i];
                var id = obejct.id;
                for (var n in nodes) {
                    var nObject = nodes[n];
                    var nid = nObject.id;
                    if (String(id) === nid) {
                        ztree.checkNode(nObject, true, true);
                    }
                }
            }
        },
        del() {//点击'删除'按钮,删除用户信息
            if (!ht.util.hasValue(this.selected, "array")) {
                layer.alert("请选择一条记录!");
                return false;
            }
            $.ajax({
                type: 'POST',
                url: contextPath+'/user/delete',
                contentType: 'application/json',
                data: JSON.stringify(UserVM.selected),
                dataType: '',
                success: function (res) {
                    if (res.code === UserVM.Constant.SUCCESS_CODE) {
                        layer.alert("删除用户成功");
                        UserVM.cancel();
                        UserVM.reload = !UserVM.reload;
                    } else {
                        layer.alert(res.msg);
                    }
                },
                error: function (res) {

                }
            });
        },
        initFormValidate() {//参数验证
            var validateOptions = {
                onfocusout: function (element) {
                    $(element).valid();
                },
                onkeyup: false,
                rules: {
                    loginName: {
                        maxlength: 20,
                        minlength: 6
                    },
                    username: {
                        required: true,
                        // maxlength: 50,
                        isChar: true
                    },
                    password: {
                        required: true,
                        minlength: 5
                    },
                    repassword: {
                        required: true,
                        minlength: 5,
                        equalTo: "#password"
                    },
                    empCode: {
                        required: true,
                        isempCode: true,
                        // maxlength: 20,
                        // minlength: 6
                    },
                    yname: {
                        required: true,
                        iscode: true,
                        // maxlength: 20,
                        // minlength: 6
                    },
                    phone: {
                        required: true,
                        isphone: true,
                        // minlength: 11,
                        // maxlength: 11

                    },
                    email: {
                        email: true,
                        maxlength: 100
                    }
                },
                messages: {
                    loginName: {
                        maxlength: '登录名最多50个字符',
                        minlength: '登录名最少6个字符'
                    },
                    username: {
                        required: "请输入账号",
                        maxlength: '姓名不能超过50个字符',
                    },
                    password: {
                        required: "请输入密码",
                        minlength: "密码长度不能小于 5 个字母"
                    },
                    repassword: {
                        required: "请输入确认密码",
                        minlength: "密码长度不能小于 5 个字母",
                        equalTo: "两次密码输入不一致"
                    },
                    empCode: {
                        required: "请输入员工编号",
                        // minlength: "编号长度不能小于 6 个字母"
                    },
                    yname: {
                        required: "请输入姓名",
                        // minlength: "姓名不能小于 6 个字符"
                    },
                    phone: {
                        required: "请输入手机号",
                        minlength: "确认手机不能小于11个字符",
                    },
                    email: {
                        email: "请输入正确的邮箱",
                        maxlength: "邮箱长度不能超过50 个字符"
                    }
                }
            };
            $("#form").validate(validateOptions);
        }
    },
    mounted() {
        this.initFormValidate();
        jQuery.validator.addMethod("isChar", function (value, element) {
            var isChar = /^\w{2,10}$/;
            return isChar.test(value);
        }, "只允许英文字母、数字和下画线，长度为2-10位!");

        jQuery.validator.addMethod("iscode", function (value, element) {
            var iscode = /^[\u4e00-\u9fa5]+$/;
            return iscode.test(value);
        }, "只允许使用中文");

        jQuery.validator.addMethod("isempCode", function (value, element) {
            var isempCode = /^[a-zA-Z0-9]+$/;
            return isempCode.test(value);
        }, "请使用英文和数字");
        jQuery.validator.addMethod("isphone", function (value, element) {
            var isphone = /^[1][3,4,5,7,8][0-9]{9}$/;
            return isphone.test(value);
        }, "请使用正确的手机号码");
        //初始化body
        this.initAddBody();
    }
});