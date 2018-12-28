Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
var currencyVm = new Vue({
    el: '#currency-info',
    data() {
        let This = this;
        return {
            openTime:"",
            isAdd: false,
            isSearchHide: true, //搜索栏
            isLook: false,
            selected: [],
            isShow: false,
            buttonFlag:true,
            currency: {
                id:"",
                codes: "",
                currencyName: "",
                exchangeRate: "",
                precisions: 4,
                status: 1,
                remark: "",
                createName: "",
                createTime:'',
                createId: ""
            },
            body: {
                id: ""
            }
            ,
            reload: false,
            precision: "",
            status: [
                {
                    value: '',
                    label: '全部'
                },
                {
                    value: 1,
                    label: '有效'
                },
                {
                    value: 0,
                    label: '无效'
                }
            ],
            state: [
                {
                    value: 1,
                    label: '有效'
                },
                {
                    value: 0,
                    label: '无效'
                }
            ],
            statusCode: 0,
            body: {
                codes: '',
                currencyName: '',
                status: ''
            },
            currencyName: '',
            currencySymbol: '',
            data_config: {
                url: contextPath+'/currency/list',
                colNames: [ '编码', '币种名称', '有效状态', '备注', '创建人', '创建时间'],
                colModel: [
                    {
                        name: 'codes', index: 'invdate', width: 200, align : "left",
                        formatter: function (value, grid, rows, state) {
                            $(document).off('click', ".detail" + value).on("click", ".detail" + value, function () {
                                //This.detailClick({value, grid, rows, state})
                                This.selected=[rows.id];
                                This.view()
                            });
                            let btns = `<a class="detail${value}">${value}</a>`;
                            return btns
                        }
                    },
                    {name: 'currencyName', index: 'currencyName asc, invdate', width: 200, align : "left"},
                    {
                        name: 'status', index: 'status', width: 100, align : "left", formatter: function (value) {
                        return value == 1 ? "有效" : "无效";
                    }
                    },
                    {name: 'remark', index: 'remark', width: 300, align : "left", sortable: false},
                    {name: 'createName', index: 'createName', width: 230, align : "left"},
                    {
                        name: 'createTime', index: 'createTime', width: 230, sortable: false, align : "left",
                        formatter: function (value) {
                            return new Date(value).Format('yyyy-MM-dd hh:mm:ss');
                        }
                    }
                ]
            }
        }
    },
    methods: {
        hideSearch() {
            this.isSearchHide = !this.isSearchHide;
            $(".chevron").css("top","")
        },
        initAddBody() {
            this.currency = {
                id:'',
                codes: "",
                currencyName: "",
                exchangeRate: "",
                precisions: 4,
                status: 1,
                remark: "",
                createName: "",
                createId: ""
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
        search() {
            console.log('搜索')
            this.reload = !this.reload;
            console.log(JSON.stringify(this.body))
        },
        clear() {
            console.log('清空')
            this.body.status = '';
            this.body.currencyName = '';
            this.body.codes = '';
            this.reload = !this.reload;
        },
        currencyClear(){
            this.currency.codes = '';
            this.currency.currencyName = '';
            this.currency.exchangeRate = '';
            this.currency.remark = '';
        },
        save() {
            console.log(currencyVm.currency.id)
            let This = this
            if ($("#my_from").valid()) {
                This.buttonFlag = false
            if (currencyVm.currency.id) {
                // currencyVm.isAdd = true;
                console.log("修改");
                this.update();
            } else {
                let This = this;
                console.log("增加");
                if ($('form').valid()) {
                    console.log(11111);
                    // currencyVm.isLook = false;
                    $.ajax({
                        type: "POST",
                        url: contextPath+"/currency/addCurrency",
                        contentType: 'application/json',
                        data: JSON.stringify(currencyVm.currency),
                        dataType: "json",
                        success: function (result) {
                            if(result.code == "100100"){
                                This.$Modal.success({
                                    title:'提示',
                                    content:result.msg,
                                });

                                currencyVm.initAddBody()
                                This.isShow = false
                                This.buttonFlag = true
                                This.reload = !This.reload

                            }else{
                                This.$Modal.warning({
                                    title:'提示',
                                    content:result.msg,
                                });
                            }

                        },
                        error: function (err) {
                            This.$Modal.warning({
                                title:'提示',
                                content:'服务器出错!',
                            });
                        },
                    })
                }
            }
            }
            // this.cancel();
        },
        cancel() {
            // 初始化
            $("#my_from").validate().resetForm();
            this.isShow = false;
            this.currencyClear()
            this.selected = []
            this.buttonFlag = true
            this.reload = !this.reload;
        },
        add() {
            console.log('add')
            this.isShow = true;
            this.currency.id = ""
            this.isAdd = false;
            this.buttonFlag = true
            this.isLook = false
            this.currency.createTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
        },
        del() {
            console.log('del')
            console.log(JSON.stringify(this.selected))
            let This = this;

            if(This.selected.length<1){
                This.$Modal.info({
                    title:'提示',
                    content:'请选择一条数据',
                });
                return;
            }
            else {
                this.$Modal.confirm({
                    title: '提示',
                    content: '当前数据有可能被引用，会影响数据准确性，确认是否删除？',
                    onOk: function () {
                        $.ajax({
                            type: "POST",
                            url: contextPath + "/currency/delete",
                            contentType: 'application/json',
                            data: JSON.stringify(currencyVm.selected),
                            dataType: "json",
                            success: function (result) {
                                if (result.code == "100100") {
                                    setTimeout(function(){
                                        currencyVm.$Modal.success({
                                            content: result.data,
                                        });
                                    },300)
                                    currencyVm.selected = []
                                    currencyVm.reload = !currencyVm.reload;
                                } else {
                                    currencyVm.$Modal.warning({
                                        content: result.msg,
                                    });
                                }
                            },
                            error: function (err) {
                                This.$Modal.warning({
                                    content: '服务器出错!',
                                });
                            },
                        })
                    },
                    onCancel() {
                        return;
                    }
                });
            }

        },
        detailClick(data) {
            let {rows} = data;
            this.isShow = true;
            this.currency = rows;
            currencyVm.isLook = true;
        },
        modify() {
            this.currency.createTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
            console.log('modify操作');
            this.buttonFlag = true
            let id = this.selected[0]
            let This = this;
            this.currency.id=id
            console.log(id)
            if (this.selected.length != 1) {
                This.$Modal.info({
                    title:'提示',
                    content:'修改只能对单条数据进行操作',
                });
            } else {
                this.isShow = true;
                this.isAdd = true
                if ($('form').valid()) {
                    currencyVm.isLook = false;
                    $.ajax({
                        type: "POST",
                        url: contextPath+"/currency/info/"+id,
                        contentType: 'application/json',
                        data: JSON.stringify(this.selected[0]),
                        dataType: "json",
                        success: function (result) {
                            if(result.code == "100100"){
                                console.log(result)
                                currencyVm.currency = result.data
                            }else{
                                This.$Modal.warning({
                                    title:'提示',
                                    content:result.msg,
                                });
                            }

                        },
                        error: function (err) {
                            This.$Modal.warning({
                                title:'提示',
                                content:'服务器出错!',
                            });
                        }
                    })
                }
            }
        },
        update() {
            console.log(JSON.stringify(currencyVm.currency))
            let This = this
            $.ajax({
                type: "POST",
                url: contextPath+"/currency/updateCurreny",
                contentType: 'application/json',
                data: JSON.stringify(currencyVm.currency),
                dataType: "json",
                success: function (result) {
                    if (result.code === "100100") {

                        This.$Modal.success({
                            title:'提示',
                            content:result.msg,
                        });

                        currencyVm.contentType = result.data;
                        This.isShow = false
                        currencyVm.initAddBody()
                        This.buttonFlag = true
                        This.reload = !This.reload
                    } else {
                        This.$Modal.warning({
                            title:'提示',
                            content:result.msg,
                        });
                    }

                },
                error: function (err) {
                    This.$Modal.warning({
                        title:'提示',
                        content:'服务器出错!',
                    });
                },
            })
        },
        view() {
            let This = this;
            if (this.selected.length > 1) {
                // layer.alert('查看只能对单条数据进行操作');
                This.$Modal.info({
                    title:'提示',
                    content:'查看只能对单条数据进行操作',
                });
                return;
            }else if (this.selected.length < 1){
                This.$Modal.info({
                    title:'提示',
                    content:'请选择操作数据',
                });
                return;
            }
            this.buttonFlag = false
            if ($('form').valid()) {
                currencyVm.isLook = false;
                let id = this.selected[0]
                $.ajax({
                    type: "POST",
                    url: contextPath+"/currency/info/"+id,
                    contentType: 'application/json',
                    data: JSON.stringify(this.selected[0]),
                    dataType: "json",
                    success: function (result) {
                        console.log(result)
                        currencyVm.currency = result.data
                        currencyVm.isShow = true;
                        currencyVm.isLook=true;
                        currencyVm.isAdd = true;
                    },
                    error: function (err) {
                        This.$Modal.warning({
                            title:'提示',
                            content:'服务器出错!',
                        });
                    }
                })
            }
        },
        exit() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        },
        copy(){
            console.log("进复制了。。。")
            if(this.selected.length != 1){
                this.$Modal.info({
                    title:'提示',
                    content:'请选择操作数据',
                });
                return false;
            }
            this.buttonFlag = true
            $.ajax({
                type: "POST",
                url: contextPath+"/currency/info/" + this.selected[0],
                contentType: 'application/json',
                dataType: "json",
                success: function (result) {
                    console.log(result)
                    currencyVm.currency.exchangeRate = result.data.exchangeRate
                    currencyVm.currency.precisions = result.data.precisions
                    currencyVm.currency.status = result.data.status
                    currencyVm.currency.remark = result.data.remark
                    currencyVm.currency.createName = result.data.createName
                },
                error: function (err) {
                    currencyVm.$Modal.warning({
                        title:'提示',
                        content:'服务器出错!',
                    });
                }
            })
            this.isShow = true;
            currencyVm.isAdd = false;
            currencyVm.isLook = false;
        },
        getUser(){
            let This = this
            $.ajax({
                type: 'POST',
                url: contextPath+'/tbaseunit/findUser',
                success: function (result) {
                    console.log(result)
                    This.currency.createName = result.data.username
                    This.currency.createId = result.data.createId
                }
            })
        },
        initFormValidate(){
            var validateOptions = {
                onfocusout: function (element) {
                    $(element).valid();
                },
                onkeyup: false,
                rules: {
                    codes: {
                        required: true,
                        remote: {
                            url: contextPath+"/currency/validateCode",  //后台处理程序
                            type: "post",  //数据发送方式
                            dataType: "json",  //接受数据格式
                            data: {  //要传递的数据
                                codes: function () {
                                    return currencyVm.currency.codes;
                                },
                                id: function () {
                                    return currencyVm.currency.id;
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
                    name: {
                        required: true,
                        remote: {
                            url: contextPath+"/currency/validateCode",  //后台处理程序
                            type: "post",  //数据发送方式
                            dataType: "json",  //接受数据格式
                            data: {  //要传递的数据
                                name: function () {
                                    return currencyVm.currency.currencyName;
                                },
                                id: function () {
                                    return currencyVm.currency.id;
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
                },
                messages: {
                    codes: {
                        required: "请填写币种代码!",
                        remote: "该编码已存在!"
                    },
                    name: {
                        required: "请填写币种名称!",
                        remote: "该币种名称已存在!"
                    },
                }
            };
            $("#my_from").validate(validateOptions);
        }
    },
    created: function () {
        this.getUser()
    }
    ,
    mounted() {

        this.initFormValidate();
        this.openTime=window.parent.params.openTime;
    }
})