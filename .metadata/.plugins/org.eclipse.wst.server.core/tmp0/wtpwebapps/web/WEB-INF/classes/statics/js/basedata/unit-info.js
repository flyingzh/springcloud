var parvm = new Vue({
    el: '#unit-info',
    data() {
        let This = this;
        return {
            isShow: false,
            reload: false,
            isLook: false,
            isBubbling: true,
            codeFlag: false,
            buttonFlag: true,
            isSearchHide: true, //搜索栏
            openAddUnitGroup: false,
            openModifyUnitGroup: false,
            selected: [],
            nodeData: [
                // { id: 1, pId: 0, name: "单位组1", open: true },//一级科目，默认展开
                // { id: 2, pId: 0, name: "单位组2", open: true },//一级科目
            ],
            unitGroup: [],
            user: {
                id: '',
                username: ''
            },
            //setting:配置相关
            setting1: {
                //注意：如果使用如上简单Json数据，以下data.simpleData.enable必须设置为true。
                data: {
                    simpleData: {
                        idKey: "id",
                        enable: true
                    },
                    key: {
                        name: 'name'
                    }
                },
                //callback内定义事件和回调函数，更多事件请参考官方文档。
                callback: {
                    onClick: this.clickEvent,
                }

            },
            tmpUnit: '',
            tmpGroupId: '',
            unitGroupName: '',
            openTime: "",
            unitGroupBody: {
                id: '',
                code: '',
                name: ''
            },
            ruleUnitPopup:{
                code:[
                    {required:true}
                ],
                name:[
                    {required:true}
                ],
            },
            body: {
                name: '',
                code: '',
                groupId: '',
            },
            unitInfo: {
                id: '',
                code: '',
                name: '',
                groupId: '',
                conversionRate: '',
                isDefault: false,
                createTime: '',
                createName: '',
                createId: ''
            },
            data_config: {
                url: contextPath + '/tbaseunit/list',
                colNames: ['代码', '单位名称', '换算率', '是否默认', '创建人', '创建时间', '单位组'],
                colModel: [
                    {
                        name: 'code', align: "left", width: 120,
                        formatter: function (value, grid, rows, state) {

                            console.log(rows)
                            $(document).off('click', ".detail" + rows.id).on('click', ".detail" + rows.id,
                                function () {
                                    This.detailClick({ value, grid, rows, state })
                                });
                            let myCode = `<a class="detail${rows.id}">${value}</a>`;
                            return myCode;
                        }
                    },

                    { name: 'name', index: '', width: 120, align: "left" },
                    { name: 'conversionRate', index: 'amount', width: 80, align: "right" },
                    {
                        name: 'isDefault', index: 'tax', width: 80, align: "left", formatter: function (value) {
                            if (value == 1) {
                                return "是"
                            }
                            return "否";
                        }
                    },

                    { name: 'createName', index: 'total', width: 120, align: "left" },
                    { name: 'createTime', index: 'note', width: 120, sortable: false },
                    { name: 'groupId', index: 'note', width: 120, sortable: false, hidden: true }
                ]
            },
            treeUrl: contextPath + '/tbaseunitgroup/list',
        }
    },
    methods: {
        hideSearch() {
            this.isSearchHide = !this.isSearchHide;
            $(".chevron").css("top", "")
        },
        // 新增单位组
        addUnitGroup(){
           
            this.openAddUnitGroup = true;
        },
        addSure(name){
            let pass = false;
            this.$refs[name].validate((valid) => {
                if (valid) {
                    pass = true;
                } else {
                    pass = false;
                }
            })
            if(!pass) return;
            let This = this;
            $.ajax({
                type: "POST",
                url: contextPath + "/tbaseunitgroup/save?name=",
                contentType: 'application/json',
                data: JSON.stringify(This.unitGroupBody.name),
                success: function (data) {
                    console.log(data)
                    if (data.code === "100100") {
                        This.$Modal.success({
                            title:'提示信息',
                            content: "保存成功！",
                        });
                        location.reload()

                    } else {
                        This.$Modal.error({
                            title:'提示信息',
                            content: "保存失败！",
                        });
                    }
                }
            })
        },
        addCancel(){
            this.unitGroupBody.code = '';
            this.unitGroupBody.name = '';
            this.openAddUnitGroup = false;
        },
        // addUnitGroup() {
        //     let This = this;
        //     this.unitGroupName = ''
        //     let index = layer.open({
        //         type: 1,
        //         title: '新增单位组',
        //         content: $("#addUnitGroup"),
        //         btn: ['保存', '取消'],
        //         area: '400px',
        //         btn1() {
        //             if ($('#groupFrom').valid()) {
        //                 $.ajax({
        //                     type: "POST",
        //                     url: contextPath + "/tbaseunitgroup/save?name=",
        //                     contentType: 'application/json',
        //                     data: JSON.stringify(This.unitGroupBody.name),
        //                     success: function (data) {
        //                         console.log(data)
        //                         layer.close(index)
        //                         if (data.code === "100100") {

        //                             This.$Modal.success({
        //                                 content: "保存成功！",
        //                             });
        //                             location.reload()

        //                         } else {
        //                             This.$Modal.error({
        //                                 content: "保存失败！",
        //                             });
        //                         }
        //                     }
        //                 })
        //             }


        //         },
        //         btn2: function (index, layero) {
        //             $("#groupFrom").validate().resetForm();
        //             layer.close(index)
        //         }
        //     })
        // },
        // 修改单位组
        modifyUnitGroup() {
            if (parvm.tmpGroupId == '') {
                this.$Modal.info({
                    title:'提示信息',
                    content: '请先选择单位组!'
                })
                return;
            }
            this.unitGroupBody.id = this.tmpUnit
            this.unitGroupBody.name = this.unitGroupName
            this.queryUnitGroup(this.unitGroupBody.id)
            this.openModifyUnitGroup = true;
        },
        modifySure(name) {
            let pass = false;
            this.$refs[name].validate((valid) => {
                if (valid) {
                    pass = true;
                } else {
                    pass = false;
                }
            })
            if(!pass) return;
          
            let This = this;
            $.ajax({
                type: "POST",
                url: contextPath + "/tbaseunitgroup/update",
                contentType: 'application/json',
                data: JSON.stringify(This.unitGroupBody),
                success: function (data) {
                    if (data.code === "100100") {
                        This.$Modal.success({
                            title:'提示信息',
                            content: "更新成功！",
                        });
                        location.reload()
                    } else {
                        This.$Modal.error({
                            title:'提示信息',
                            content: "更新失败！",
                        });
                    }
                }
            })
        },
        modifyCancel(){
            this.openModifyUnitGroup = false;
        },
        // modifyUnitGroup() {
        //     let This = this;
        //     if (parvm.tmpGroupId == '' ) {
        //         this.$Modal.info({
        //             content:'请先选择单位组!'
        //         })
        //         return;
        //     }
        //     This.unitGroupBody.id = This.tmpUnit
        //     This.unitGroupBody.name = This.unitGroupName
        //     this.queryUnitGroup(This.unitGroupBody.id)
        //     let index = layer.open({
        //         type: 1,
        //         title: '修改单位组',
        //         content: $("#modifyUnitGroup"),
        //         btn: ['保存', '取消'],
        //         area: '400px',
        //         btn1() {
        //             console.log('调用了修改按钮函数')

        //             $.ajax({
        //                 type: "POST",
        //                 url: contextPath+"/tbaseunitgroup/update",
        //                 contentType: 'application/json',
        //                 data: JSON.stringify(This.unitGroupBody),
        //                 success: function (data) {
        //                     if (data.code === "100100") {
        //                         This.$Modal.success({
        //                             content: "更新成功！",
        //                         });
        //                         location.reload()
        //                         // layer.alert(data.msg,{icon: 1, end:function () {
        //                         //     location.reload()
        //                         // }})
        //                     }else{
        //                         This.$Modal.error({
        //                             content: "更新失败！",
        //                         });
        //                     }
        //                 }
        //             })
        //             layer.close(index)
        //         },
        //         btn2: function(index, layero){
        //             $("#groupFrom").validate().resetForm();
        //             layer.close(index)
        //         }
        //     })
        // },
        clickEvent(event, treeId, treeNode) {
            //可以调用ztree原生方法，更多方法请参考官方文档。
            let selnode = this.$ztree.getSelectedNodes();
            console.log(treeNode)
            parvm.body.groupId = treeNode.id
            parvm.tmpGroupId = treeNode.id
            parvm.tmpUnit = treeNode.id
            parvm.unitGroupName = treeNode.name
            console.log(selnode);
            this.reload = !this.reload
        },
        initAddBody() {
            this.body = {
                name: '',
                code: '',
                groupId: '',
            }
        },
        search() {
            console.log('搜索');
            this.reload = !this.reload;
        },

        delUnitGroup() {
            console.log("这是删除。。。")
            let This = this
            let groupId = This.tmpUnit
            console.log(groupId)
            if (groupId.length == 0) {
                this.$Modal.warning({
                    title:'提示信息',
                    content: "请先选择单位组！"
                })
                return;
            }
            this.$Modal.confirm({
                title: '提示',
                content: '<p>删除的摘要将不能恢复，请确认是否删除？</p>',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    This.delTmp(groupId)
                },
            })

        },

        delTmp(groupId) {
            let This = this;
            console.log(groupId)

            $.ajax({
                type: "POST",
                url: contextPath + "/tbaseunitgroup/delete?id=" + groupId,
                dataType: "json",
                success: function (data) {
                    if (data.code == "100100") {
                        This.$Modal.success({
                            title:'提示信息',
                            content: "删除成功！",
                        });
                        location.reload()
                        This.tmpUnit = ''
                    } else {
                        This.$Modal.error({
                            title:'提示信息',
                            content: "系统出现异常,请联系管理人员！"
                        });
                    }

                },
                error: function (err) {
                    console.log("error");
                },

            })
        },
        clear() {
            this.body = {
                name: '',
                code: ''
            }
            console.log('清空');
            this.reload = !this.reload;

        },
        clearUnitInfo() {
            this.unitInfo = {
                id: '',
                code: '',
                name: '',
                groupId: '',
                conversionRate: '',
                isDefault: false,
                createTime: '',
                createId: ''
            }
        },
        add() {
            console.log('这是新增')
            if (parvm.tmpUnit === '') {
                this.$Modal.info({
                    title:'提示信息',
                    content: '请选择单位组'
                })
                return;
            }
            parvm.clearUnitInfo()
            this.unitInfo.createName = this.user.username

            parvm.codeFlag = false
            this.isLook = false;
            this.isShow = true;
            parvm.unitInfo.createTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
        },
        queryUnitGroup(id) {
            $.ajax({
                type: 'POST',
                url: contextPath + '/tbaseunitgroup/info',
                data: { id: id },
                success: function (result) {
                    console.log(result)
                    parvm.unitGroupBody.name = result.data.name
                    parvm.unitGroupBody.code = result.data.code
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
                title: '提示',
                content: '<p>删除的摘要将不能恢复，请确认是否删除？</p>',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    This.deleteOrder(ids)
                },
            })
        },

        del() {
            console.log('这是删除')
            let This = this;
            let ids = This.selected
            console.log(This.selected)
            if (!ht.util.hasValue(ids, "array")) {
                this.$Modal.info({
                    title:'提示信息',
                    content: '请先选择一条删除记录!'
                })
                return false;
            }
            this.$Modal.confirm({
                title: '提示',
                content: '<p>删除的摘要将不能恢复，请确认是否删除？</p>',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    This.deleteUnit(ids)
                },
            })
        },

        deleteUnit(ids) {
            let This = this;
            $.ajax({
                type: "POST",
                url: contextPath + "/tbaseunit/delete",
                contentType: 'application/json',
                data: JSON.stringify(This.selected),
                dataType: "json",
                success: function (data) {
                    if (data.code == "100100") {
                        This.$Modal.success({
                            title:'提示信息',
                            content: data.data,
                        });
                        This.reload = !This.reload;
                        This.selected = []
                    } else {
                        This.$Modal.error({
                            title:'提示信息',
                            content: "系统出现异常,请联系管理人员!"
                        });
                    }
                }
            })
        },
        modify() {
            if (this.selected.length > 1) {
                this.$Modal.info({
                    title:'提示信息',
                    content: '修改只能对单条数据进行操作！'
                })
            } else {
                this.unitGroupBody.id = this.selected[0];
                parvm.buttonFlag = true;
                console.log(this.selected[0])
                let ids = parvm.selected
                if (!ht.util.hasValue(ids, "array")) {
                    this.$Modal.info({
                        title:'提示信息',
                        content: '请选择单位！'
                    })
                    return false;
                }
                this.unitInfo.createName = this.user.username
                parvm.codeFlag = true
                $.ajax({
                    type: 'POST',
                    url: contextPath + '/tbaseunit/infoUnitById',
                    data: { id: parvm.unitGroupBody.id },
                    success: function (data) {
                        parvm.unitInfo = data.data
                        console.log(parvm.unitInfo)
                        parvm.unitGroupBody.id = parvm.unitInfo.groupId;
                    }
                })
                this.isShow = true;
            }
        },
        detailClick(rows) {
            parvm.codeFlag = true
            // let { rows } = data;
            let code = rows.value
            console.log(code)
            $.ajax({
                type: 'POST',
                url: contextPath + '/tbaseunit/infoUnitByCode',
                data: { code: code },
                success: function (result) {
                    console.log(result)
                    parvm.unitInfo = result.data
                }

            })
            this.isShow = true;
            // this.unitInfo = rows;
            this.isLook = true;
        },
        type() {
            this.isShow = true;
            this.isLook = true;
        },
        save() {
            console.log('这是保存')
            let This = this;
            if (!This.unitInfo.isDefault && !This.unitInfo.conversionRate) {
                this.$Modal.info({
                    title:'提示信息',
                    content: '该单位为非默认单位，请输入换算率！'
                })
                return
            }

            console.log($("#my_from").valid())
            if ($("#my_from").valid()) {
                This.buttonFlag = false
                if (this.unitInfo.id == '') {
                    // console.log("金保存了。。。")
                    parvm.unitInfo.groupId = parvm.tmpUnit
                    $.ajax({
                        type: "POST",
                        url: contextPath + "/tbaseunit/save",
                        contentType: 'application/json',
                        data: JSON.stringify(parvm.unitInfo),
                        success: function (data) {
                            This.buttonFlag = true
                            console.log(data)
                            if (data.code == '100100') {
                                // console.log(data)
                                // parvm.clearUnitInfo()
                                parvm.unitInfo.createName = parvm.user.username
                                This.$Modal.success({
                                    title:'提示信息',
                                    content: "保存成功!",
                                });
                                This.isShow = false

                                This.clearUnitInfo()
                                This.reload = !This.reload
                            } else {
                                This.$Modal.error({
                                    title:'提示信息',
                                    content: data.msg,
                                });
                            }
                        },
                        error: function (error) {
                            This.$Modal.error({
                                title:'提示信息',
                                content: "系统出现异常,请联系管理人员!"
                            });
                        }
                    })
                } else {

                    parvm.unitInfo.groupId = parvm.tmpUnit
                    parvm.unitInfo.groupId = parvm.unitGroupBody.id
                    console.log(JSON.stringify(parvm.unitInfo))
                    $.ajax({
                        type: "POST",
                        url: contextPath + "/tbaseunit/update",
                        contentType: 'application/json',
                        data: JSON.stringify(parvm.unitInfo),
                        success: function (result) {
                            This.buttonFlag = true
                            if (result.code == '100100') {
                                // parvm.clearUnitInfo()
                                parvm.unitInfo.createName = parvm.user.username
                                This.$Modal.success({
                                    title:'提示信息',
                                    content: "更新成功!",
                                });
                                This.isShow = false

                                This.clearUnitInfo()
                                This.reload = !This.reload
                            } else {
                                This.$Modal.error({
                                    title:'提示信息',
                                    content: result.msg,
                                });
                            }
                        },
                        error: function (err) {
                            console.log("error");
                        },

                    })
                }
            }

        },
        cancel() {
            console.log('这是取消');
            this.unitGroupName = ''
            this.tmpUnit = ''
            this.initAddBody();
            this.isShow = false;
            this.selected = [];
            this.isEdit = false;
            this.isLook = false;
            this.buttonFlag = true
            $("form").validate().resetForm();
            this.isBubbling = true;
        },
        exit() {
            window.parent.closeCurrentTab({ exit: true, openTime: this.openTime });
        },
        copy() {
            let This = this
            parvm.buttonFlag = true;
            console.log("经复制了。。。")
            var rowData = jQuery("#mytable").jqGrid('getRowData', this.selected[0]);
            console.log(rowData)
            this.unitInfo.groupId = rowData.groupId
            let ids = This.selected
            if (!ht.util.hasValue(ids, "array")) {
                this.$Modal.info({
                    title:'提示信息',
                    content: '请先选择一条单位！'
                })
                return false;
            }
            parvm.codeFlag = false
            parvm.queryUnit()
            parvm.unitInfo.code = ''
            this.isLook = false;
            this.isShow = true;

        },
        queryUnit() {
            $.ajax({
                type: 'POST',
                url: contextPath + '/tbaseunit/infoUnitById',
                data: { id: this.selected[0] },
                success: function (result) {
                    console.log(result)
                    parvm.unitInfo.createTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
                    parvm.unitInfo.conversionRate = result.data.conversionRate
                    parvm.unitInfo.createName = result.data.createName
                    parvm.unitInfo.isDefault = result.data.isDefault
                    console.log(parvm.unitInfo)
                }
            })
        },

        getUser() {
            $.ajax({
                type: 'POST',
                url: contextPath + '/tbaseunit/findUser',
                success: function (result) {
                    console.log(result)
                    parvm.unitInfo.createName = result.data.username
                    parvm.unitInfo.createId = result.data.createId
                    parvm.user.username = result.data.username
                }
            })
        },
        initFormValidate() {
            var validateOptions = {
                onfocusout: function (element) {
                    $(element).valid();
                },
                onkeyup: false,
                rules: {
                    code: {
                        required: true,
                        remote: {
                            url: contextPath + "/tbaseunit/infoUnitByCode",  //后台处理程序
                            type: "post",  //数据发送方式
                            dataType: "json",  //接受数据格式
                            data: {  //要传递的数据
                                code: function () {
                                    return parvm.unitInfo.code;
                                },
                                id: function () {
                                    return parvm.unitInfo.id;
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
                    unitName: {
                        required: true,
                        remote: {
                            url: contextPath + "/tbaseunit/infoUnitByName",  //后台处理程序
                            type: "post",  //数据发送方式
                            dataType: "json",  //接受数据格式
                            data: {  //要传递的数据
                                name: function () {
                                    return parvm.unitInfo.name;
                                },
                                id: function () {
                                    return parvm.unitInfo.id;
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
                    unitGroupName: {
                        required: true,
                        remote: {
                            url: contextPath + "/tbaseunitgroup/info",  //后台处理程序
                            type: "post",  //数据发送方式
                            dataType: "json",  //接受数据格式
                            data: {  //要传递的数据
                                name: function () {
                                    return parvm.unitGroupName;
                                }
                            },
                            dataFilter: function (data, type) {//判断控制器返回的内容
                                var res = JSON.parse(data);
                                if (res.code === "100100") {
                                    return false;
                                }
                                else {
                                    // layer.alert(res.msg);//没有弹出对话框
                                    return true;
                                }
                            }

                        }
                    },
                    remark: {
                        maxlength: 255
                    },
                },
                messages: {
                    code: {
                        required: "请填写编码!",
                        remote: "该编码已存在!"
                    },
                    unitName: {
                        required: "请填写单位名称!",
                        remote: "该单位名称已存在!"
                    },
                    unitGroupName: {
                        required: "请填写单位组名称!",
                        remote: "该单位组名称已存在!"
                    },
                    remark: {
                        maxlength: "备注最大长度为50!"
                    },
                }
            };
            $("#groupFrom").validate(validateOptions);
            $("#my_from").validate(validateOptions);

        }

    },
    created: function () {
        this.getUser()
    }
    ,
    mounted() {

        this.initFormValidate();
        // $('form').validate();
        /*jQuery.validator.addMethod("isChar", function (value, element) {
            var chrnum = /^([a-zA-Z0-9]+)$/;
            return chrnum.test(value);
        }, "编码格式错误!");
        this.unitGroup.forEach(item => {
            this.$set(item, 'isCheck', false)
        });*/
        this.openTime = window.parent.params.openTime;
    }

})