var parvm = new Vue({
    el: '#paraLevel',
    data() {
        let This = this;
        return {
            isShow: false,
            isView: false,
            reload: false,
            codeFlag:false,
            disabledFlag: false,
            parentNameFlag: true,
            buttonFlag:true,
            openTime:"",
            selected: [],
            treeName: '',
            //setting:配置相关
            setting1: {
                //注意：如果使用如上简单Json数据，以下data.simpleData.enable必须设置为true。
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "parentId",
                    },
                    key: {
                        name: 'styleName'
                    }
                },
                //callback内定义事件和回调函数，更多事件请参考官方文档。
                callback: {
                    onClick: this.clickEvent,
                }
            },
            treeUrl:contextPath+"/tbasestylecategory/list?ktcStatus=0",
            tree: {
                id: "",
                name: "",
                customCode: "",
                parentId:""
            },
            body: {
                id: "",
                styleName: "",
                styleCode: "",
                codingCodeRules: "",
                parentId: "",
                parentName:"",
                status: 1,
                isDel: "",
                remark: "",
                organizationId: "",
                customCode: ""
            }
        }
    },
    methods: {
        clickEvent(event, treeId, treeNode) {
            $("#my_from").validate().resetForm();
            this.tree.id = treeNode.id;
            this.tree.parentId = treeNode.parentId;
            this.tree.name = treeNode.styleName;
            this.tree.customCode = treeNode.customCode;
            if (treeNode.parentId == 0 || treeNode.parentId == null) {
                this.isShow =false;
                return;
            }
            parvm.queryStyle(true);
        },
        queryStyle(disabledFlag) {
            $.ajax({
                type: 'POST',
                url: contextPath+'/tbasestylecategory/info',
                data: {id: this.tree.id},
                success: function (result) {
                    parvm.body = result.data;
                    parvm.tree.customCode = result.data.customCode;
                    parvm.isShow = true;
                    parvm.codeFlag = true
                    parvm.disabledFlag = disabledFlag;
                }
            })
        },
        addStyle() {
            if (!this.tree.id) {
                this.$Modal.info({
                    title:'提示信息',
                    content:"请先选择一条款式类别!"
                })
                return
            }
            parvm.codeFlag = false
            parvm.disabledFlag = false;
            parvm.clear();
            parvm.buttonFlag = true
            parvm.body.parentName = this.tree.name;
            parvm.isShow = true;
        },
        modifyStyle() {
            if (!this.tree.id) {
                this.$Modal.info({
                    title:'提示信息',
                    content:"请先选择一条款式类别!"
                })
                return
            }
            if (this.tree.parentId == 0 || this.tree.parentId == null) {
                return;
            }
            this.queryStyle(false);
            parvm.buttonFlag = true
        },
        save() {
            let This = this
            let msg = '';
            var treeObj = $.fn.zTree.getZTreeObj("tree");
            var nodes = treeObj.getSelectedNodes();
            if (nodes.length==0) {
                return;
            }
            if (!$('form').valid()) {
                return;
            }
            var url = contextPath+"/tbasestylecategory/update";
            msg = '修改'
            if (!parvm.body.id) {
                 url = contextPath+"/tbasestylecategory/save";
                parvm.body.parentId = parvm.tree.id;
                parvm.body.id = parvm.tree.id;
                parvm.body.customCode = parvm.tree.customCode;
                msg = '保存'
            }
            This.buttonFlag = false
            $.ajax({
                type: "POST",
                url:url,
                contentType: 'application/json',
                data: JSON.stringify(parvm.body),
                success: function (data) {
                    This.buttonFlag = true
                    if (data.code === "100100") {
                        This.$Modal.success({
                            title:'提示信息',
                            content: msg+"成功!",
                        });
                        if (parvm.body.id) {
                           This.$refs.myTree.loadData();

                        } else {
                            This.$refs.myTree.loadData();
                            parvm.clear();
                            parvm.isShow = false;
                        }
                    } else {
                        This.$Modal.warning({
                            title:'提示信息',
                            content: data.msg
                        });
                    }
                }
            })

        },
        del() {
            console.log("这是删除。。。")
            let This = this
            let orders = This.selected;
            var ids = []
            orders.forEach(item => {
                ids.push(item.id)
            })
            console.log(ids)
            this.$Modal.confirm({
                title:'提示信息',
                content: '<p>删除的摘要将不能恢复，请确认是否删除？</p>',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    This.deleteOrder(ids)
                },
            })
        },

        delStyle() {
            let This = this
            let id = this.tree.id
            if (!this.tree.id) {
                this.$Modal.info({
                    title:'提示信息',
                    content:"请选择款式类别!"
                })
                return
            }
            var treeObj = $.fn.zTree.getZTreeObj("tree");
            var nodes = treeObj.getSelectedNodes();
            if ( nodes.length==0 || nodes[0].parentId == 0 || nodes[0].parentId == null) {
                return;
            }
            var childrens = nodes[0].children;
            if( childrens != undefined && childrens.length>0){
                this.$Modal.info({
                    title:'提示信息',
                    content:"该类别下存在子类别，不能被删除!!"
                })
                return;
            }

            this.$Modal.confirm({
                title:'提示信息',
                content: '<p>删除的摘要将不能恢复，请确认是否删除？</p>',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    // This.deleteTmp(id)
                    $.ajax({
                        type: "POST",
                        url: contextPath+"/tbasestylecategory/delete",
                        data: {id: id},
                        success: function (data) {
                            if (data.code == "100100") {
                                This.$Modal.success({
                                    title:'提示信息',
                                    content: "删除成功!",
                                });
                                treeObj.removeNode(nodes[0]);
                                parvm.isShow = false;
                                parvm.clear();
                                parvm.tree.id = ''
                            } else {
                                This.$Modal.warning({
                                    title:'提示信息',
                                    content: "系统出现异常,请联系管理人员!"
                                });
                            }

                        },
                        error: function (err) {
                            console.log("error");
                        },

                    })
                },
            })
        },
        // deleteTmp(id){
        //     let This = this
        //     $.ajax({
        //         type: "POST",
        //         url: contextPath+"/tbasestylecategory/delete",
        //         data: {id: id},
        //         success: function (data) {
        //             if (data.code == "100100") {
        //                 This.$Modal.success({
        //                     content: "删除成功!",
        //                 });
        //                 This.treeObj.removeNode(nodes[0]);
        //                 parvm.isShow = false;
        //                 parvm.clear();
        //                 parvm.tree.id = ''
        //             } else {
        //                 This.$Modal.error({
        //                     content: "系统出现异常,请联系管理人员!"
        //                 });
        //             }
        //
        //         },
        //         error: function (err) {
        //             console.log("error");
        //         },
        //
        //     })
        // },
        clear() {
            this.body = {
                id: "",
                styleName: "",
                styleCode: "",
                codingCodeRules: "",
                parentId: "",
                parentName:"",
                status: 1,
                isDel: "",
                remark: "",
                organizationId: ""
            }
        },
        initFormValidate() {
            var validateOptions = {
                onfocusout: function (element) {
                    $(element).valid();
                },
                onkeyup: false,
                rules: {
                    styleCode: {
                        // isNumOrChar:true,
                        required: true,
                        remote: {
                            url: contextPath+"/tbasestylecategory/infoByCodeAndNameAndRule",  //后台处理程序
                            type: "post",  //数据发送方式
                            dataType: "json",  //接受数据格式
                            data: {  //要传递的数据
                                id: function () {
                                    return parvm.body.id == undefined ? "" : parvm.body.id;
                                }
                            },
                            dataFilter: function (data, type) {//判断控制器返回的内容
                                var res = JSON.parse(data);
                                if (res.code === "100100") {
                                    return true;
                                }
                                else {
                                    // layer.alert(res.msg);//没有弹出对话框
                                    return false;
                                }
                            }
                        }
                    },
                    styleName: {
                        required: true,
                        remote: {
                            url: contextPath+"/tbasestylecategory/infoByCodeAndNameAndRule",  //后台处理程序
                            type: "post",  //数据发送方式
                            dataType: "json",  //接受数据格式
                            data: {  //要传递的数据
                                id: function () {
                                    return parvm.body.id == undefined ? "" : parvm.tree.id ;
                                }
                            },
                            dataFilter: function (data, type) {//判断控制器返回的内容
                                var res = JSON.parse(data);
                                if (res.code === "100100") {
                                    return true;
                                }
                                else {
                                    // layer.alert(res.msg);//没有弹出对话框
                                    return false;
                                }
                            }
                        }
                    },
                    codingCodeRules: {
                        isChar: true,
                        required: true,
                        remote: {
                            url: contextPath+"/tbasestylecategory/infoByCodeAndNameAndRule",  //后台处理程序
                            type: "post",  //数据发送方式
                            dataType: "json",  //接受数据格式
                            data: {  //要传递的数据
                                parentId: function () {
                                    return parvm.tree.id
                                }
                            },
                            dataFilter: function (data, type) {//判断控制器返回的内容
                                var res = JSON.parse(data);
                                if (res.code === "100100") {
                                    return true;
                                }
                                else {
                                    // layer.alert(res.msg);//没有弹出对话框
                                    return false;
                                }
                            }
                        }
                    }

                },
                messages: {
                    styleCode: {
                        required: "请填写编码!",
                        remote: "款式类别代码已存在!"
                    },
                    styleName: {
                        required: "请填写名称!",
                        remote: "款式类别名称已存在!"
                    },
                    codingCodeRules: {
                        required: "请填写编码取码规则!",
                        remote: "款式类别编码规则取码已存在!"
                    }
                }
            };
            $("#my_from").validate(validateOptions);
        },
        getUser(){
            $.ajax({
                type: 'POST',
                url: contextPath+'/tbaseunit/findUser',
                success: function (result) {
                    console.log(result)
                    // parvm.unitInfo.createName = result.data.username
                    // parvm.unitInfo.createId = result.data.createId
                }
            })
        },
        copy(){
            console.log("进复制了。。。。")
            if (!this.tree.id) {
                this.$Modal.info({
                    content:"请先选择一条款式类别!"
                })
                return
            }
            parvm.buttonFlag = true
            parvm.clear();
            $.ajax({
                type: 'POST',
                url: contextPath+'/tbasestylecategory/info',
                data: {id: this.tree.id},
                success: function (result) {
                    console.log(result)
                    // parvm.body = result.data;
                    parvm.body.customCode = result.data.parentCustonCode
                    parvm.body.parentName = result.data.parentName
                    parvm.body.status = result.data.status
                    parvm.body.remark = result.data.remark
                    parvm.body.parentId = result.data.parentId

                }

            })
            parvm.codeFlag = false
            parvm.disabledFlag = false;
        },
        exit() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        },

    },
    created(){
        // this.getUser()
    },
    mounted() {
        this.initFormValidate();

        jQuery.validator.addMethod("isChar", function (value, element) {
            var chrnum = /^\w$/;
            return chrnum.test(value);
        }, "编码格式错误!");
        jQuery.validator.addMethod("isNumOrChar", function (value, element) {
            var chrnum = /^([a-zA-Z0-9]+)$/;
            return chrnum.test(value);
        }, "编码格式错误!");
        this.openTime=window.parent.params.openTime;
    }

})