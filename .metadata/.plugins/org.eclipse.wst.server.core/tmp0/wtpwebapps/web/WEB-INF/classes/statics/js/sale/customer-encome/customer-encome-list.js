let custList = new Vue({
    el:"#cust-list",
    data(){
        return {
            stockPriceNo: "",
            status: "",
            //控制弹窗显示
            modalTrigger: false,
            modalType: '',
            //审批进度条
            stepList: [],
            approvalTableData: [],
            dateArr:"",
            customerModel:null,
            isHideSearch: true,
            isHideList: true,
            reload: false,
            isTabulationHide: true,
            selected: [],
            myTable:"myTable",
            body:{
                //单据编号
                custPayOrderNo: "",
                //客户名称
                custName:"",
                // //下单日期
                // orderDate: "",
                //业务类型(1、预付款；2、锁价)
                businessType: "",
                //业务员名称
                saleMenName: "",
                //备注
                remark:"",
            },
            businessTypeList:[
                {
                    value:"1",
                    label:"预付款"
                },
                {
                    value:"2",
                    label:"锁价"
                },
            ],
            data_user_list: {
                //列表页数据
                url: contextPath + '/saleCustPayOrder/listPage',
                colNames:
                    ['日期', '单据编号', '单据状态', '客户', '关联客户订单', '来款性质', '来款金额','业务员','备注'],
                colModel:
                    [
                        {
                            name: 'createTime',
                            index: 'createTime',
                            width: 200,
                            align: "center",
                            formatter :function (value, grid, rows, state) {
                                return new Date(value).format("yyyy-MM-dd");
                            }
                        },
                        {
                            name: 'custPayOrderNo', index: 'custPayOrderNo', width: 200, align: "left",
                            formatter: function (value, grid, rows, state) {
                                $(document).off("click", ".updateDetail" + value).on("click", ".updateDetail" + value, function () {
                                    custList.updateDetail({value, grid, rows, state})
                                });
                                let btns = `<a class="updateDetail${value}">${value}</a>`;
                                return btns;
                            }
                        },
                        {
                            name: 'status', index: 'status', width: 200, align: "left",
                            formatter: function (value, grid, rows, state) {
                                if (value == 1) {
                                    console.log(1)
                                    return "暂存";
                                } else if (value == 2) {
                                    console.log(1)
                                    return "待审核";
                                }
                                else if (value == 3) {
                                    console.log(1)
                                    return "审核中";
                                }
                                else if (value == 4) {
                                    console.log(1)
                                    return "已审核";
                                } else if (value == 5) {
                                    return "驳回";
                                }
                            }
                        },
                        {name: 'custName', index: 'custName', width: 200, align: "left"},
                        {
                            name: 'saleOrderNo',
                            index: 'saleOrderNo',
                            width: 200,
                            align: "left",
                            formatter: function (value, grid, rows, state) {
                                if (value != null) {
                                    $(document).off("click", ".gotoSaleOrder" + value).on("click", ".gotoSaleOrder" + value, function () {
                                        custList.gotoSaleOrder({value, grid, rows, state})
                                    });
                                    let btns = `<a class="gotoSaleOrder${value}">${value}</a>`;
                                    return btns;
                                } else {
                                    return value="";
                                }


                            }
                        },
                        {
                            name: 'businessType',
                            index: 'businessType',
                            width: 200,
                            align: "left",
                            formatter: function (value, grid, rows, state) {
                                if (value == 1) {
                                    return "预付款";
                                } else if (value == 2) {
                                    return "锁价";
                                }else{
                                    return ""
                                }
                            }
                        },
                        {name: "payAmount", index: "payAmount", width: 200, align: "right",
                            formatter: function (value, grid, rows, state) {
                                if (value != null) {
                                    return value.toFixed(2);
                                } else {
                                    var a = 0;
                                    return a.toFixed(2);
                                }
                            }
                        },
                        {name: "saleMenName", index: "saleMenName", width: 200, align: "center"},
                        {name: "remark", index: "remark", width: 200, align: "left"}
                    ],
            }
        }
    },
    methods:{
        //客户
        closeCustomer() {
            if(this.customerModel){
                this.body.custName = this.customerModel.name;
            }
        },
        //审核
        approval() {
            if (this.selected.length !== 1) {
                this.$Modal.info({
                    title: "提示",
                    okText: "确定",
                    content: "只能对单条数据操作!"
                });
                return;
            }
            this.stockPriceNo = this.selected[0].custPayOrderNo;
            this.status = this.selected[0].status;
            console.log(this.stockPriceNo,this.status)
            let This = this;
            This.modalType = 'approve';
            This.modalTrigger = !This.modalTrigger;
        },
        //驳回
        reject() {
            if (this.selected.length !== 1) {
                this.$Modal.info({
                    title: "提示",
                    okText: "确定",
                    content: "只能对单条数据操作!"
                });
                return;
            }
            this.stockPriceNo = this.selected[0].custPayOrderNo;
            this.status = this.selected[0].status;
            let This = this;
            This.modalType = 'reject';
            This.modalTrigger = !This.modalTrigger;
        },
        //审核或者驳回回调
        approvalOrRejectCallBack(res) {
            let _this = this;
            //判断是否是暂存 暂存可修改
            if (res.result.code == '100515') {
                var id = _this.selected[0].id;
                if (_this.modalType == 'approve') _this.ajaxUpdateDocStatusById(id, 4);
                if (_this.modalType == 'reject') _this.ajaxUpdateDocStatusById(id, 1);
            }
            _this.refresh();
        },
        ajaxUpdateDocStatusById(id, status) {
            let _this = this;
            $.ajax({
                url: contextPath + '/tSaleStockPrice/save',
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify({id: id, status: status}),
                success: function (data) {
                    if (data.code == '100100') {
                        _this.status = status;
                    }
                }
            });
        },
        //刷新
        refresh(){
            this.$refs.mType.reset();
            this.$nextTick(function () {
                this.body.businessType = '';
            });
            this.body={
                custPayOrderNo: "",
                custName:"",
                businessType: "",
                saleMenName: "",
                //开始时间
                searchCreateTime: "",
                //结束时间
                searchEndTime: "",
                remark:"",
            };
            this.$refs.customerRef.clear();
            this.dateArr = "";
            this.selected = []
            this.reload = !this.reload
        },
        //清空按钮
        clearType(){
            this.$refs.mType.reset();
            this.$nextTick(function () {
                this.body.businessType = '';
            });
        },
        //搜索
        search(){
            this.reload = !this.reload
        },
        //清空
        clean(){
            this.refresh()
        },
        //点击单据编号
        updateDetail({rows}){
            let pId = rows.id
            window.parent.activeEvent({
                name: '客户来款-查看',
                url: contextPath + '/sale/customer-encome/customer-encome-add.html',
                params: {allInfo: pId, type: 'query'}
            });
        },
        /** 点击客户订单编号跳转至客户订单详情页*/
        gotoSaleOrder({rows}) {
            console.log(rows.saleOrderNo);
            if (rows.saleOrderNo != null) {
                window.parent.activeEvent({
                    name: '客户订单',
                    url: contextPath + '/sale/customer-order/customer-order-add.html',
                    params: {type: 'view', saleOrderNo: rows.saleOrderNo}
                });
            }
        },
        //删除
        del(){
            let This = this;
            let temp = true;
            //判断是否选择数据
            if(this.selected.length<1){
                this.$Modal.info({
                    content:"请选择数据"
                })
                return;
            }
            //判断是否是暂存状态
            this.selected.map((item)=>{
                if(item.status != 1){
                    this.$Modal.info({
                        content:"非暂存状态无法删除"
                    })
                    temp = false;
                }
                return;
            })

            if(temp){
                //获取到删除行数据
                console.log(this.selected)
                var arr = new Array();
                for (var i = 0; i < this.selected.length; i++) {
                    arr[i] = this.selected[i].id;
                }

                //弹框提示是否删除
                this.$Modal.confirm({
                    title: '提示信息',
                    content:'是否删除',
                    onOk(){
                        $.ajax({
                            type: 'post',
                            async: true,
                            traditional: true,
                            data: {ids: arr},
                            url: contextPath + '/saleCustPayOrder/delete',
                            success: function (d) {
                                if (d.code == "100100") {
                                    setTimeout(()=>{
                                        This.$Modal.success({
                                            title: '提示信息',
                                            okText:'确定',
                                            content: '删除成功'
                                        });
                                        This.reload = !This.reload
                                    },300)

                                } else {
                                    setTimeout(()=>{
                                        This.$Modal.error({
                                            title: '提示信息',
                                            okText:'确定',
                                            content: '删除失败'
                                        });
                                    },300)
                                }

                            },
                            error: function (e) {
                                console.log(e);
                            }
                        });
                    }
                })



            }
        },
        //新增
        add(){
           window.parent.activeEvent({
                name: '客户来款单-新增',
                url: contextPath + '/sale/customer-encome/customer-encome-add.html',
                params: {allInfo: null, type: 'add'}
            });


        },
        //修改
        modifyOrSubmit(rec){
            let temp = true;
            //判断是否选择数据
            if(this.selected.length<1){
                this.$Modal.info({
                    content:"请选择数据"
                })
                return;
            };
            if(this.selected.length>1){
                this.$Modal.info({
                    content:"请选择一条数据"
                })
                return;
            };
            //判断是否是暂存状态
             this.selected.map((item)=>{
                 if(item.status != 1){
                    var msg;
                    if(rec==1){
                          msg="该单据之前已经提交过了，不能再提交!";
                        this.$Modal.warning({
                            content:msg
                        })
                        temp = false;
                    }
               }
                 return;
             })

            if(temp){
                if(rec==0){
                    window.parent.activeEvent({
                        name: '客户来款单-修改',
                        url: contextPath + '/sale/customer-encome/customer-encome-add.html',
                        params: {allInfo: this.selected[0].id, type: 'modify'}
                    });
                }
                if(rec==1){
                    $.ajax({
                        type: 'post',
                        async: true,
                        traditional: true,
                        data: {id: this.selected[0].id},
                        url: contextPath + '/saleCustPayOrder/listSubmit',
                        success: function (d) {
                            console.log(d)
                            if (d.code == "100100") {
                                custList.$Modal.info({
                                    content:"提交成功"
                                })
                            }else if(d.code=='-1'){
                                if(d.data.OrderDate!=null){
                                    custList.$Modal.warning({
                                        title: '提示信息',
                                        content:"下单日期未选择！"
                                    });
                                }
                                if(d.data.BusinessType!=null){
                                    custList.$Modal.warning({
                                        title: '提示信息',
                                        content:d.data.BusinessType
                                    });
                                }
                                if(d.data.CustName!=null){
                                    custList.$Modal.warning({
                                        title: '提示信息',
                                        content:d.data.CustName
                                    });
                                }
                                if(d.data.GoldColor!=null){
                                    custList.$Modal.warning({
                                        title: '提示信息',
                                        content:d.data.GoldColor
                                    });
                                }
                                if(d.data.PayAmount!=null){
                                    custList.$Modal.warning({
                                        title: '提示信息',
                                        content:d.data.PayAmount
                                    });
                                }
                            }
                            custList.reload = !custList.reload
                        },
                        error: function (e) {
                            console.log(e);
                        }
                    });
                }
            }

        },
        //退出
        exit(){
            window.parent.closeCurrentTab({name: this.openName,exit:true, openTime:this.openTime})
        },
        //获取日期
        changeDate(value) {
            this.body.searchCreateTime = value[0]=="" ? "" : (value[0].replace(/\//g, '-') + ' 00:00:00');
            this.body.searchEndTime = value[1]=="" ? "" : (value[1].replace(/\//g, '-') + ' 23:59:59');
        },

    },
    mounted: function() {
        this.openTime = window.parent.params.openTime;
        this.openName = window.parent.params.name;
        this.$refs.customerRef.loadCustomerList('');
    }


})