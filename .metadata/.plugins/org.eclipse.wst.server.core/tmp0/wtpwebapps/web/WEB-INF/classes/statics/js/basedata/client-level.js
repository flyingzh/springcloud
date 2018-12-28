var currencyVm = new Vue({
    el: '#paraLevel',
    data() {
        let This = this;
        return {
            saveDisable:true,//保存按钮禁用
            username :'',
            isSearchHide: true, //搜索栏
            isShow: false,
            isLock: false,
            isAdd: false,
            reload: false,
            selected: [],
            openTime: '',
            dataValue:[],
            body: {
                order: "",
                code: "",
                status: "",
                name: "",
                createName: "",
                createTimeStart: "",
                createTimeEnd: "",
                ktcStatus: 0,
            },
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
                url: contextPath+'/tclientlevel/list',
                colNames: ['等级类型', '应用类型', '编码', '状态', '备注', '创建人', '创建时间'],
                colModel: [
                    {
                        name: 'name', index: 'name', width: 90, align: "left",
                        formatter: function (value, grid, rows, state) {
                            $(document).off('click', ".detail" + value).on('click', ".detail" + value, function () {
                                This.detailClick({value, grid, rows, state})
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        }
                    },
                    {
                        name: 'apply', index: '', width: 90, align: "left",
                        formatter: function (value, grid, rows, state) {
                            return value == 1 ? "供应商" : "客户";
                        }
                    },
                    {name: 'code', index: '', width: 100, align: "left"},
                    {
                        name: 'status', index: '', width: 80, align: "left",
                        formatter: function (value, grid, rows, state) {
                            return value == 1 ? "有效" : "无效";
                        }
                    },
                    {name: 'remark', index: '', width: 80, align: "left"},
                    {name: 'createName', index: '', width: 80, align: "left"},
                    {name: 'createTime', index: '', width: 150, align: "left",sortable: false}
                ]
            },
        }
    },
    methods: {
        hideSearch() {
            this.isSearchHide = !this.isSearchHide;
            $(".chevron").css("top","")
        },
        search() {
            this.reload = !this.reload;
        },
        add_click() {
            this.isShow = true;
            this.isAdd = true;
            this.isLock = false;
        },
        copy(){
            if (this.selected.length !== 1) {
                this.$Modal.info({
                    titel:'提示信息',
                    content:'只能对单行数据操作！'
                })
                // layer.alert("只能对单行数据操作!");
                return;
            }
            var id = this.selected[0];
            if (id) {
                this.info(id,false,true);
            }
        },
        cancel() {
            // 初始化
            this.saveDisable = true;
            this.isShow = false;
            this.isLock = false;
            this.isAdd = false;
            this.initAddBody();
            $("#detailForm").validate().resetForm();
        },
        changeDate(value) {
            this.body.createTimeStart = value[0]=="" ? "" : (value[0].replace(/\//g, '-') + ' 00:00:00');
            this.body.createTimeEnd = value[1]=="" ? "" : (value[1].replace(/\//g, '-') + ' 23:59:59');
        },
        clearItem(name, ref){
            if(this.$refs[ref]){
                this.$refs[ref].reset();
            }
            this.$nextTick(()=>{
                this.body[name] = '';
            })
          },
        clear() {
            // this.$refs.start.date = '';
            // this.$refs.end.date = '';
            this.dataValue=[];
            this.body = {
                order: "",
                code: "",
                status: "",
                name: "",
                createName: "",
                createTimeStart: "",
                createTimeEnd: "",
                ktcStatus:0,
            };
        },
        modify() {
            if (this.selected.length !== 1) {
                // layer.alert("只能对单行数据操作!");
                this.$Modal.info({
                    titel:'提示信息',
                    content:'只能对单行数据操作！'
                })
                return
            }
            let id = this.selected[0];
            if (id) {
                this.info(id, false,false);
            }
        },
        save() {
            let url = contextPath+"/tclientlevel/save";
            if (this.add.id) {
                url = contextPath+"/tclientlevel/update";
            }
            let This = this;
            if ($('#detailForm').valid()) {
                // This.$Spin.show();
                if(!this.saveDisable){
                    return false ;
                }
                this.saveDisable = false;
                let that = this;

                $.ajax({
                    type: "POST",
                    url: url,
                    contentType: 'application/json',
                    data: JSON.stringify(this.add),
                    dataType: "json",
                    success: function (data) {
                        // This.$Spin.hide();
                        if (data.code === "100100") {
                            /*
                            layer.alert('操作成功', {icon: 1
                                ,end:function () {
                                    that.saveDisable = true;
                                    that.cancel();
                                    that.reload = !that.reload;
                                }
                           });
                           */
                            that.$Modal.success({
                                title:'提示信息',
                                content:'操作成功！',
                                onOk:() => {
                                    that.saveDisable = true;
                                    that.cancel();
                                    that.reload = !that.reload;
                                }
                            })
                        } else {
                            // This.$Spin.hide();
                            that.saveDisable = true;
                            that.$Modal.warning({
                                titel:'提示信息',
                                content:data.msg
                            })
                            // layer.alert(data.msg, {icon: 0});
                        }
                    },
                    error: function (err) {
                        that.saveDisable = true;
                        // This.$Spin.hide();
                        that.$Modal.warning({
                            titel:'提示信息',
                            content:"网络异常，请稍后重试！"
                        })
                        // layer.alert("网络异常，请稍后重试！", {icon: 0});
                    },
                });
            }
        },
        exit() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        },
        del() {
            if (this.selected.length == 0) {
                this.$Modal.info({
                    titel:'提示信息',
                    content:"请选择行！"
                })
                // layer.alert("请选择行!");
                return
            }
            this.$Modal.confirm({
                titel:'提示信息',
                content:"当前数据有可能被引用，会影响数据准确性，确认是否删除？",
                onOk:() => {
                    $.ajax({
                        type: "POST",
                        url: contextPath+"/tclientlevel/delete",
                        contentType: 'application/json',
                        data: JSON.stringify(currencyVm.selected),
                        dataType: "json",
                        success: function (result) {
                            if (result.code == "100100") {
                                setTimeout(function(){
                                    currencyVm.$Modal.success({
                                        titel:'提示信息',
                                        content:result.data
                                    })
                                    currencyVm.selected = [];
                                    currencyVm.reload = !currencyVm.reload;
                                },300)
                            } else {
                               setTimeout(function(){
                                   currencyVm.$Modal.warning({
                                       titel:'提示信息',
                                       content:result.data
                                   })
                               },300)
                            }
                        },
                        error: function (err) {
                            currencyVm.$Modal.warning({
                                titel:'提示信息',
                                content:'网络异常，请重试！'
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
                            url: contextPath+"/tclientlevel/delete",
                            contentType: 'application/json',
                            data: JSON.stringify(currencyVm.selected),
                            dataType: "json",
                            success: function (result) {
                                if (result.code == "100100") {
                                    // layer.alert(result.data, {icon: 1});
                                    currencyVm.$Modal.success({
                                        titel:'提示信息',
                                        content:result.data
                                    })
                                    currencyVm.selected = [];
                                    currencyVm.reload = !currencyVm.reload;
                                } else {
                                    currencyVm.$Modal.warning({
                                        titel:'提示信息',
                                        content:result.data
                                    })
                                    // layer.alert(result.msg, {icon: 0});
                                }
                            },
                            error: function (err) {
                                // layer.alert('网络异常，请重试！', {icon: 0});
                                currencyVm.$Modal.warning({
                                    titel:'提示信息',
                                    content:'网络异常，请重试！'
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
        info(id, isLock,isCopy) {
            if (id) {
                $.ajax({
                    type: "POST",
                    url: contextPath+"/tclientlevel/info/" + id,
                    contentType: 'application/json',
                    dataType: "json",
                    async: false,
                    success: function (data) {
                        if (data.code === "100100") {
                            var data =data.data;
                            if(isCopy){
                                currencyVm.add.status = data.status;
                                currencyVm.add.remark = data.remark;
                                currencyVm.add.apply= data.apply;
                                currencyVm.add.createTime =new Date().Format("yyyy-MM-dd hh:mm:ss");
                                currencyVm.isAdd = true;
                            }else{
                                currencyVm.add = data;
                            }
                            currencyVm.isLock = isLock;
                            currencyVm.isShow = true;
                        } else {
                            // layer.alert('操作失败', {icon: 0});
                            currencyVm.$Modal.warning({
                                titel:'提示信息',
                                content:'操作失败'
                            })
                        }
                    },
                    error: function (err) {
                        // layer.alert('操作失败', {icon: 0});
                        currencyVm.$Modal.warning({
                            titel:'提示信息',
                            content:'操作失败'
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
                apply: 1,
                status: 1,
                createName: '',
                createTime: new Date().Format("yyyy-MM-dd hh:mm:ss"),
                updateName: "",
                updateTime: "",
                remark: ''
            }
            this.add.createName =this.username;
        },
        initFormValidate() {
            var validateOptions = {
                onfocusout: function (element) {
                    $(element).valid();
                },
                onkeyup: false,
                rules: {
                   /* code: {
                        isChar:true,
                        required: true,
                        maxlength: 30,
                        remote: {
                            url: contextPath+"/tclientlevel/validateCode",  //后台处理程序
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
                            url: contextPath+"/tclientlevel/validateCode",  //后台处理程序
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
                    remark: {
                        maxlength: "备注最大长度为255!"
                    },
                }
            };
            $("#detailForm").validate(validateOptions);
        }
    },
    mounted() {

        this.initFormValidate();
        this.username =layui.data('user').username;
        this.initAddBody();//初始化body
        jQuery.validator.addMethod("isChar", function (value, element) {
            var chrnum = /^([a-zA-Z0-9]+)$/;
            return chrnum.test(value);
        }, "编码格式错误!");

        this.openTime = window.parent.params.openTime;
    }
})





