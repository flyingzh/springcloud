let UserAddVm = new Vue({
    el: "#user-add",
    data() {
        let This = this;
        return {
            SUCCESS_CODE: "100100",
            //是否显示密码输入框
            isShowPasswordInput: true,
            //是否可编辑
            isEdit: false,
            operType: '',
            zTree: "zTree",
            employees: [],
            addUser: {
                id: '',
                username: '',
                loginName: '',
                password: '',
                //重复密码
                copyPass: "",
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
            //检验数据
            ruleValidate: {
                loginName: [
                    {required: true}
                ],
                password: [
                    {required: true}
                ],
                copyPass: [
                    {required: true}
                ],
                empCode: [
                    {required: true}
                ],
                phone: [
                    {required: true}
                ],
                copyPass: [
                    {required: true}
                ],
                email: [
                    {required: true}
                ]
            },
            roleZtree: {
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
                },
                callback: {
                    onCheck: this.zTreeOnCheck,
                    beforeCheck: this.beforeCheck
                }
            },
            organZtree: {
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
                },
                callback: {
                    onCheck: this.zTreeOnCheck,
                    beforeCheck: this.beforeCheck
                }
            }
        }

    },
    methods: {
        //校验登录账号
        clearNum() {
            if (this.addUser.loginName !== null && this.addUser.loginName !== undefined) {
                let val = "";
                val = this.addUser.loginName.toString().replace(/[^\da-zA-Z]/g, "");  //清除“数字”和“字母”以外的字符
                this.$nextTick(() => {
                    this.addUser.loginName = val;
                })
            }
        },
        //校验密码
        clearPass() {
            if (this.addUser.password !== null && this.addUser.password !== undefined) {
                let val = "";
                val = this.addUser.password.toString().replace(/[\u4e00-\u9fa5]/g, "");  //清除汉字
                this.$nextTick(() => {
                    this.addUser.password = val;
                })
            }
        },
        //校验重复密码
        clearCopy() {
            //判断是否输入密码
            if (this.addUser.password == null || this.addUser.password == "") {
                this.$Modal.warning({
                    scrollable: true,
                    content: "请先输入密码"
                })
                return;
            }
            if (this.addUser.copyPass !== null && this.addUser.copyPass !== undefined) {
                let val = "";
                val = this.addUser.copyPass.toString().replace(/[\u4e00-\u9fa5]/g, "");  //清除汉字
                this.$nextTick(() => {
                    this.addUser.copyPass = val;
                })
            }
        },
        //检验是否一致
        checkCopy() {
            //判断是否一致
            if (this.addUser.copyPass !== this.addUser.password) {
                this.$Modal.warning({
                    scrollable: true,
                    content: "密码不一致"
                });
                this.addUser.copyPass = "";
            }
        },
        //检验手机号
        clearPhone() {
            if (this.addUser.phone !== null && this.addUser.phone !== undefined) {
                let val = "";
                val = this.addUser.phone.toString().replace(/[^\d]/g, "");  //清除非数字
                this.$nextTick(() => {
                    this.addUser.phone = val;
                })
            }
        },
        //检验邮箱
        checkEmail() {
            if (this.addUser.email !== null && this.addUser.email !== undefined) {
                let val = "";
                val = this.addUser.email.toString().replace(/[\u4e00-\u9fa5]/g, "");  //清除汉字
                this.$nextTick(() => {
                    this.addUser.email = val;
                })
            }
        },
        //邮箱测试
        regEmail() {
            if (this.addUser.email !== null && this.addUser.email !== undefined) {
                var filter = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
                if (!filter.test(this.addUser.email)) {
                    //不符合
                    this.addUser.email = "";
                    console.log("不符合");
                }
            }
        },
        // 获取员工
        changeSaleEmp(e) {
            if (e != undefined) {
                this.addUser.empCode = e.value;
                var le = e.label;
                this.addUser.username = le.substring(le.lastIndexOf("-") + 1, le.length);
            }
        },
        //保存按钮
        save() {
            //获取分配的角色
            var roles = this.getCheckRoles();
            //获取分配的组织机构
            var organs = this.getCheckOrgans();
            //用户对象
            var params = this.addUser;
            params.roleList = roles;
            params.userOrganList = organs;
            var id = params.id;

            //检验是否填写数据
            let temp = true;
            this.$refs.formValidate.validate((valid) => {
                if (valid == false) {
                    temp = false;
                }
            })
            if (!temp) return;
            var operType = this.operType;
            if (($.isEmptyObject(String(id)) || id === undefined) && operType === 'add') {
                this.saveUser(params);
            } else if (operType === 'updatepassword') {
                this.updateUserPassword(params);
            } else {
                this.update(params);
            }
        },
        //保存请求
        saveUser(param) {
            var This = this;
            $.ajax({
                type: "POST",
                url: contextPath + "/user/save",
                data: JSON.stringify(param),
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                success: function (res) {
                    if (res.code === This.SUCCESS_CODE) {
                        This.messageTip('info', "添加用户成功");
                    } else {
                        This.messageTip('error', res.msg);
                    }
                },
                error: function (err) {
                    console.log("服务器出错");
                },
            });
        },
        //修改
        updateUser(param) {
            var This = this;
            $.ajax({
                type: "POST",
                url: contextPath + "/user/updateUser",
                data: JSON.stringify(param),
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                success: function (res) {
                    if (res.code === This.SUCCESS_CODE) {
                        This.messageTip('info', "修改用户成功");
                    } else {
                        This.messageTip('error', res.msg);
                    }
                },
                error: function (err) {
                    console.log("服务器出错");
                },
            });
        },
        //修改用户密码
        updateUserPassword(param) {
            var This = this;
            $.ajax({
                type: "POST",
                url: contextPath + "/user/updateUserPassword",
                data: JSON.stringify(param),
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                success: function (res) {
                    if (res.code === This.SUCCESS_CODE) {
                        This.messageTip('info', "修改用户成功");
                    } else {
                        This.messageTip('error', res.msg);
                    }
                },
                error: function (err) {
                    console.log("服务器出错");
                },
            });
        },
        //获取分配的角色
        getCheckRoles() {
            var roleList = new Array();
            //根据tid获取选中数据
            var selectRoleList = $.fn.zTree.getZTreeObj(this.zTree).getCheckedNodes();
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
                //角色
                if (type === '2') {
                    role.id = roleObject.id;
                    role.name = roleObject.name;
                    role.code = roleObject.code;
                    role.status = '0';
                    roleList.push(role);
                }
            }
            return roleList;
        },
        //获取分配的所管组织机构
        getCheckOrgans() {
            var userOrganList = new Array();
            //根据tid获取选中数据
            var checkedOrganTree = $.fn.zTree.getZTreeObj('oriTree').getCheckedNodes();
            for (var i in checkedOrganTree) {
                var treeObjct = checkedOrganTree[i];
                var userOrgan = {};
                userOrgan.organId = treeObjct.id;
                userOrganList.push(userOrgan);
            }
            return userOrganList;
        },
        //获取用户信息
        getUserInfo(id) {
            var This = this;
            $.ajax({
                type: 'POST',
                url: contextPath + '/user/getUserRoleInfo/' + id,
                data: '',
                dataType: 'json',
                success: function (res) {
                    if (res.code === This.SUCCESS_CODE) {
                        var user = res.data;
                        This.addUser = user;
                        var roleList = user.roleList;
                        This.processSelectRole(roleList);
                        var organList = user.userOrganList;
                        This.processSelectOrgan(organList);
                    } else {
                        This.messageTip('error', res.msg);
                    }
                },
                error: function (res) {

                }
            });
        },
        //获取职员信息
        getEmployeeInfo() {
            var This = this;
            $.ajax({
                type: "post",
                async: false,
                url: contextPath + '/requisition/queryallempbyorganid',
                dataType: "json",
                success: function (res) {
                    if (res.code === This.SUCCESS_CODE) {
                        //加载当前公司下面所有的员工
                        This.employees = res.data;
                    }
                },
                error: function () {
                    console.log('服务器出错啦');
                }
            })
        },
        //处理选中的角色
        processSelectRole(list) {
            var ztree = $.fn.zTree.getZTreeObj(this.zTree);
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
        //处理选中的所管组织
        processSelectOrgan(organList) {
            var organTree = $.fn.zTree.getZTreeObj('oriTree');
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
        //提示框
        messageTip(type, message) {
            if (type === 'warning') {
                this.$Modal.warning({
                    title: "提示",
                    okText: "确定",
                    content: message
                });
            }
            if (type === 'error') {
                this.$Modal.error({
                    title: "提示",
                    okText: "确定",
                    content: message
                });
            }
            if (type === 'info') {
                this.$Modal.error({
                    title: "提示",
                    okText: "确定",
                    content: message
                });
            }
        }
    },
    mounted() {
        let param = window.parent.params.params;
        //获取职员信息
        this.getEmployeeInfo();
        var type = param.type;
        this.operType = type;
        if (type === "add") {
        }
        //修改与查看时获取用户信息
        if (type === "update" || type === "view") {
            this.isShowPasswordInput = false;
            let id = param.id;
            this.getUserInfo(id);
        }
        if (type === "updatepassword") {
            this.isShowPasswordInput = true;
            this.isEdit = true;
            let id = param.id;
            this.getUserInfo(id);
        }
    }
});