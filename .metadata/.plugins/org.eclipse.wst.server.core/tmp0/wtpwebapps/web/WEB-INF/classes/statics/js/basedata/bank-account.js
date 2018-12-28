var currencyVm = new Vue({
    el: '#paraLevel',
    data() {
        let This = this;
        return {
            saveDisable:true,//保存按钮禁用
            isSearchHide: true, //搜索栏
            showModal: false,
            openTime: '',
            selectOrginId:[],
            // 配置表头
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '组织名称',
                    key: 'orgName'
                }
            ],
            // 表格内数据,与表头对应
            colContent: [

            ],
            //开户行地址
            area: {},
            areaInit: {
                isInit: false,
                province: '',
                city: '',
                county: '',
                detail: '',
                disabled: false
            },
            isShow: false,
            isLock: false,
            isAdd: false,
            reload: false,
            selected: [],
            offices: [],//部门
            nodeData: [],
            //setting:配置相关
            setting1: {
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "parentId",
                        rootPId: -1
                    }
                },
                //callback内定义事件和回调函数，更多事件请参考官方文档。
                callback: {
                    onClick: this.clickEvent,
                }
            },
            body: {
                order: "",
                code: "",
                status: "",
                name: "",
                headCode: ""

            },
            banks: [],
            status: [
                {
                    value: 1,
                    label: '有效'
                },
                {
                    value: 0,
                    label: '无效'
                }
            ],
            type: [
                {
                    value: 1,
                    label: '供应商'
                },
                {
                    value: 0,
                    label: '客户'
                }
            ],
            add: {},
            data_config: {
                url: contextPath+'/tbankaccount/list',
                colNames: ['编码', '名称', '开户支行', '状态', '备注', '创建人', '创建时间'],
                colModel: [
                    {
                        name: 'code', index: 'code', width: 90, align: "left",
                        formatter: function (value, grid, rows, state) {
                            $(document).off('click', ".detail" + value).on('click', ".detail" + value, function () {
                                This.detailClick({value, grid, rows, state})
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        }
                    },
                    {name: 'name', index: '', width: 90, align: "left"},
                    {name: 'subBank', index: '', width: 90, align: "left"},
                    {
                        name: 'status', index: '', width: 80, align: "left",
                        formatter: function (value, grid, rows, state) {
                            return value == 1 ? "有效" : "无效";
                        }
                    },
                    {name: 'remark', index: '', width: 80, align: "left"},
                    {name: 'createName', index: '', width: 80, align: "left"},
                    {name: 'createTime', index: '', width: 150, align: "left", sortable: false}
                ]
            },
        }
    },
    methods: {
        hideSearch() {
            this.isSearchHide = !this.isSearchHide;
            $(".chevron").css("top","")
        },

        showOrgin(){
            if (this.selected.length == 0) {
                // layer.alert("请选择行!");
                this.$Modal.info({
                    title:'提示信息',
                    content:'请选择行!'
                })
                return;
            }
            this.showModal =true;
        },
        okModel() {
            if (this.selectOrginId.length == 0) {
                this.$Modal.info({
                    title:'提示信息',
                    content:'请选择分配组织!'
                })
                // layer.alert("请选择分配组织!");
                return;
            }
            let param={
                ids:{},
                orginIds:{}
            }
            param.ids=this.selected.join(',');
            param.orginIds =this.selectOrginId.join(',');
            this.cancelModel();
            console.log(param)
            let that = this;
            $.ajax({
                type: "POST",
                url: contextPath+'/tbankaccount/allot',
                traditional:true,
                // contentType: 'application/json',
                datatype : "json",//请求数据返回的类型。可选json,xml,txt
                data: param,
                success: function (result) {
                    if (result.code === "100100") {
                        // layer.alert("分配成功", {icon: 1});
                        that.$Modal.success({
                            title:'提示信息',
                            content:'分配成功!'
                        })
                        that.selectOrginId=[];
                    } else {
                        // layer.alert(result.msg, {icon: 0});
                        that.$Modal.warning({
                            title:'提示信息',
                            content:result.msg
                        })
                    }
                },
                error: function (err) {
                    // layer.alert("服务器出错", {icon: 0});
                    that.$Modal.warning({
                        title:'提示信息',
                        content:'服务器出错!'
                    })
                },
            });
        },
        cancelModel() {
            this.selectOrginId=[];
            this.$refs.test.selectAll(false);
            this.showModal =false;
        },
        changeselect(selection){
            // 获取勾选的行数据
            console.log(selection)
            for(let i =0;i<selection.length;i++){
                this.selectOrginId.push(selection[i].id);
            }
        },
        search() {
            this.reload = !this.reload;
        },
        add_click() {
            let selectedNodes = $.fn.zTree.getZTreeObj("tree").getSelectedNodes();
            if(selectedNodes.length ==0 ){
                this.$Modal.info({
                    title:'提示信息',
                    content:'请先选择开户总行!'
                })
                // layer.alert("请先选择开户总行", {icon: 0});
                return;
            }
            //清空地址绑定
            this.areaInit = {
                isInit: true,
                province: '',
                city: '',
                county: '',
                detail: '',
                disabled: false
            }
            this.add.headCode = this.body.headCode;
            this.isShow = true;
            this.isAdd = true;
        },
        cancel() {
            // 初始化
            this.saveDisable = true;
            this.isShow = false;
            this.isLock = false;
            this.isAdd = false;
            this.initAddBody();
            $("#addForm").validate().resetForm();
            //清空地址绑定
            this.areaInit = {
                isInit: false,
                province: '',
                city: '',
                county: '',
                detail: '',
                disabled: false
            }
        },
        clearItem(name, ref) {
            if (this.$refs[ref]) {
                this.$refs[ref].reset();
            }
            this.$nextTick(() => {
                this.body[name] = '';
            })
        },
        clear() {
            //清空树的选中

            let selectedNodes = $.fn.zTree.getZTreeObj("tree").getSelectedNodes();
            $.fn.zTree.getZTreeObj("tree").cancelSelectedNode(selectedNodes[0]);
            this.body = {
                order: "",
                code: "",
                headCode: "",
                status: "",
                name: "",
                code: "",
            };
        },
        copy() {
            if (this.selected.length !== 1) {
                // layer.alert("只能对单行数据操作!");
                this.$Modal.info({
                    title:'提示信息',
                    content:'只能对单行数据操作!'
                })
                return;
            }
            var id = this.selected[0];
            if (id) {
                this.isAdd = true;
                this.info(id, false,true);
            }
        },
        modify() {
            if (this.selected.length !== 1) {
                this.$Modal.info({
                    title:'提示信息',
                    content:'修改只能对单条数据进行操作!'
                })
                // layer.alert("修改只能对单条数据进行操作", {icon: 0});
                return;
            }
            let id = this.selected[0];
            if (id) {
                this.info(id, false,false);
            }
        },
        save() {

            let url = contextPath+"/tbankaccount/update";
            if (this.add.id === "") {
                url = contextPath+"/tbankaccount/save";
            }
            let This = this;
            if ($('#addForm').valid()) {
                //将area的值拷贝到add
                if (ht.util.hasValue(this.area, 'object')) {
                    Object.assign(this.add, this.area);
                    //或 $.extend(true,this.supplier,this.area)
                }

                //禁用保存按钮
                if(!this.saveDisable){
                    return false;
                }
                this.saveDisable = false;
                let that = this;
                $.ajax({
                    type: "POST",
                    url: url,
                    contentType: 'application/json',
                    async:true,
                    data: JSON.stringify(this.add),
                    dataType: "json",
                    success: function (result) {
                        if (result.code === "100100") {
                            /*
                            layer.alert("保存成功", {icon: 1
                            ,end:function () {
                                    that.saveDisable = true;
                                    that.cancel();
                                    that.reload = !that.reload;
                                }
                            });
                            */
                            that.$Modal.success({
                                title:'提示信息',
                                content:'保存成功！',
                                onOk: () => {
                                    that.saveDisable = true;
                                    that.cancel();
                                    that.reload = !that.reload;
                                }
                            })
                        } else {
                            that.saveDisable = true;
                            // layer.alert(result.msg, {icon: 0});
                            that.$Modal.warning({
                                title:'提示信息',
                                content:result.msg
                            })
                        }
                    },
                    error: function (err) {
                        that.saveDisable = true;
                        that.$Modal.warning({
                            title:'提示信息',
                            content:'网络异常，请重试！'
                        })
                        // layer.alert("网络异常，请重试！", {icon: 0});
                    },
                });

            }
        },
        view() {
            if (this.selected.length !== 1) {
                // layer.alert("查看只能对单条数据进行操作", {icon: 0});
                this.$Modal.info({
                    title:'提示信息',
                    content:'查看只能对单条数据进行操作!'
                })
                return
            }
            let id = this.selected[0];
            if (id) {
                this.info(id, true,false);
            }
        },
        del() {
            if (this.selected.length == 0) {
                this.$Modal.info({
                    title:'提示信息',
                    content:'请选择行!'
                })
                // layer.alert("请选择行!");
                return;
            }
            let that = this;
            this.$Modal.confirm({
                title:'提示信息',
                content:'当前数据有可能被引用，会影响数据准确性，确认是否删除？',
                onOk: () => {
                        $.ajax({
                            type: "POST",
                            url: contextPath+"/tbankaccount/delete",
                            contentType: 'application/json',
                            data: JSON.stringify(currencyVm.selected),
                            dataType: "json",
                            success: function (result) {
                                if (result.code == "100100") {
                                    setTimeout(function(){
                                        that.$Modal.success({
                                            title:'提示信息',
                                            content:'数据删除成功!'
                                        })
                                        that.selected = [];
                                        that.search();
                                    },300)
                                } else {
                                   setTimeout(function(){
                                       that.$Modal.warning({
                                           title:'提示信息',
                                           content:'服务器异常，请重试！'
                                       })
                                   },300)
                                }
                            },
                            error: function (err) {
                                that.$Modal.warning({
                                    title:'提示信息',
                                    content:'服务器异常，请重试！'
                                })
                            },
                      });
                }
            })
            /*
            layer.confirm('当前数据有可能被引用，会影响数据准确性，确认是否删除？', {
                    btn: ['确认', '取消'], btn1: function () {
                        $.ajax({
                            type: "POST",
                            url: contextPath+"/tbankaccount/delete",
                            contentType: 'application/json',
                            data: JSON.stringify(currencyVm.selected),
                            dataType: "json",
                            success: function (result) {
                                if (result.code == "100100") {
                                    that.$Modal.success({
                                        title:'提示信息',
                                        content:'数据删除成功!'
                                    })
                                    // layer.alert('数据删除成功', {icon: 1});
                                    that.selected = [];
                                    that.search();
                                } else {
                                    that.$Modal.warning({
                                        title:'提示信息',
                                        content:'服务器异常，请重试！'
                                    })
                                    // layer.alert('服务器异常，请重试！', {icon: 0});
                                }
                            },
                            error: function (err) {
                                // layer.alert('网络异常，请重试！', {icon: 0});
                                that.$Modal.warning({
                                    title:'提示信息',
                                    content:'服务器异常，请重试！'
                                })
                            },
                        });
                    }
                }
            );
            */
        },
        detailClick(data) {
            var id = data.rows.id;
            if (id) {
                this.info(id, true,false);
            }
        },
        exit() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        },
        //树形点击回掉事件
        clickEvent(event, treeId, treeNode) {
            console.log(treeNode);
            this.body.headCode = treeNode.value;
            this.add.headCode = treeNode.value;
            this.search();
        },
        selectGroup(group) {
            vm.groupId = group.id;
        },
        info(id, isLock,isCopy) {
            let that = this;
            if (id) {
                $.ajax({
                    type: "POST",
                    url: contextPath+"/tbankaccount/info/" + id,
                    contentType: 'application/json',
                    dataType: "json",
                    async: false,
                    success: function (data) {
                        if (data.code === "100100") {
                            currencyVm.add = data.data;
                            if(isCopy){
                                currencyVm.add.id ="";
                                currencyVm.add.code ="";
                                currencyVm.add.name ="";
                                currencyVm.add.createTime =new Date().Format("yyyy-MM-dd hh:mm:ss");
                                currencyVm.add.createName =layui.data('user').username;
                            }
                            currencyVm.isLock = isLock;
                            currencyVm.isShow = true;
                            let _add = currencyVm.add;
                            //地址回显
                            if (_add.province) {
                                currencyVm.areaInit = {
                                    isInit: true,
                                    province: _add.province||'',
                                    city: _add.city||'',
                                    county: _add.county,
                                    detail: _add.detail,
                                    disabled: isLock
                                }
                            }
                        } else {
                            // layer.alert('网络异常', {icon: 0});
                            that.$Modal.warning({
                                title:'提示信息',
                                content:'服务器异常，请重试！'
                            })
                        }
                    },
                    error: function (err) {
                        // layer.alert('网络异常', {icon: 0});
                        that.$Modal.warning({
                            title:'提示信息',
                            content:'服务器异常，请重试！'
                        })
                    },
                });
            }
        },
        initAddBody() {
            this.add = {
                id: "",
                code: "",
                name: "",
                acountNumber: "",
                officeCode: "",
                headCode: "",
                subBank: "",
                address: "",
                status: 1,
                createName: layui.data('user').username,
                createTime: new Date().Format("yyyy-MM-dd hh:mm:ss"),
                updateName: "",
                updateTime: "",
                remark: ''
            }
        },
        initFormValidate() {
            var validateOptions = {
                onfocusout: function (element) {
                    $(element).valid();
                },
                onkeyup: false,
                rules: {
                  /*  code: {
                        isChar: true,
                        required: true,
                        maxlength: 30,
                        remote: {
                            url: contextPath+"/tbankaccount/validateCode",  //后台处理程序
                            type: "post",  //数据发送方式
                            dataType: "json",  //接受数据格式
                            data: {  //要传递的数据
                                id: function () {
                                    return currencyVm.add.id;
                                }
                            },
                            dataFilter: function (data, type) {//判断控制器返回的内容
                                var res = JSON.parse(data);
                                if (res.code === "100100") {
                                    return res.data;
                                } else {
                                    layer.alert(res.msg);//没有弹出对话框
                                    return false;
                                }
                            }

                        }
                    },*/
                    name: {
                        required: true,
                        maxlength: 30,
                        remote: {
                            url: contextPath+"/tbankaccount/validateCode",  //后台处理程序
                            type: "post",  //数据发送方式
                            dataType: "json",  //接受数据格式
                            data: {  //要传递的数据
                                id: function () {
                                    return currencyVm.add.id;
                                }
                            },
                            dataFilter: function (data, type) {//判断控制器返回的内容
                                var res = JSON.parse(data);
                                if (res.code === "100100") {
                                    return res.data;
                                } else {
                                    layer.alert(res.msg);//没有弹出对话框
                                    return false;
                                }
                            }

                        }
                    },
                    acountNumber: {
                        required: true,
                        maxlength: 50
                    },
                  /*  officeCode: {
                        required: true,
                    },*/
                    headCode: {
                        required: true,
                    },
                    subBank: {
                        maxlength: 50
                    },
                    remark: {
                        maxlength: 255
                    },
                },
                messages: {
                    code: {
                        required: "请填写编码!",
                        maxlength: "编码最大长度为30！",
                        remote: "该编码已存在!"
                    },
                    name: {
                        required: "请填写名称!",
                        maxlength: "编码最大长度为30！",
                        remote: "该名称已存在!"
                    },
                    acountNumber: {
                        required: "请填写银行账号!",
                        maxlength: "银行账号最大长度为50!"
                    },
                  /*  officeCode: {
                        required: "请选择对应组织!",
                    },*/
                    headCode: {
                        required: "请选择开户总行!",
                    },
                    subBank: {
                        maxlength: "开户支行最大长度为50!"
                    },
                    remark: {
                        maxlength: "备注最大长度为50!"
                    },
                }
            };
            $("#addForm").validate(validateOptions);
        },
        initBank() {
            this.banks = getCodeList('root_base_banks');
            this.$refs.my_tree.nodeData = this.banks;
            this.$refs.my_tree.loadData();
            /*let _this = this;
            $.ajax({
                type: "GET",
                url: contextPath+"/codeController/getChildNodesByMark?mark=root_base_banks",
                contentType: 'application/json',
                dataType: "json",
                async: false,
                success: function (data) {
                    console.log(data);
                    if (data.code === "100100") {
                        _this.banks = data.data;
                        _this.$refs.my_tree.nodeData = _this.banks;
                        _this.$refs.my_tree.loadData();
                    } else {
                        layer.alert('网络异常', {icon: 0});
                    }
                },
                error: function (err) {
                    layer.alert('网络异常', {icon: 0});
                },
            })*/
        },
        initOrgin(){
            let _this = this;
            $.ajax({
                type: "POST",
                url: contextPath+"/tbankaccount/paramMap",
                contentType: 'application/json',
                dataType: "json",
                async: false,
                success: function (data) {
                    console.log(data);
                    if (data.code === "100100") {
                        let orgnArr = data.data.organList;
                        let organId = data.data.organId;
                        let index =-1;
                        for(let i= 0;i<orgnArr.length;i++){
                            if(organId == orgnArr[i].id){
                                index =i;
                                break;
                            }
                        }
                        orgnArr.splice(index, 1);
                        _this.colContent = orgnArr;

                    } else {
                        // layer.alert('网络异常', {icon: 0});
                        _this.$Modal.warning({
                            title:'提示信息',
                            content:'服务器异常，请重试！'
                        })
                    }
                },
                error: function (err) {
                    // layer.alert('网络异常', {icon: 0});
                    _this.$Modal.warning({
                        title:'提示信息',
                        content:'服务器异常，请重试！'
                    })
                },
            })
        }
    },
    mounted() {
        //初始化组织
        this.initOrgin();

        this.initFormValidate();
        jQuery.validator.addMethod("isChar", function (value, element) {
            var chrnum = /^([a-zA-Z0-9]+)$/;
            return chrnum.test(value);
        }, "编码格式错误!");
        this.initAddBody();//初始化body
        this.initBank();
        this.openTime =window.parent.params.openTime;


    }
})



