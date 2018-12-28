var ve = new Vue({
    el: "#wait-order",
    data() {
        return {
            //客户信息
            selectCustomerObj:null,
            isHideSearch: true,
            isHideList: true,
            openTime: "",
            isSearchHide: true,
            reload: false,
            selected: [],
            tabId: "tabList",
            body: {
                searchDepositNo: "",
                searchSaleOrderNo: "",
                searchCustName:"",
                searchPayWay: "",
                //开始时间
                searchCreateTime: "",
                //结束时间
                searchEndTime: "",
                page: "",
                limit: "",
            },
            dateArr: "",
            data_user_list: {
                //页表页数据
                url: contextPath + '/deposit/findSaleCustOrderVoPage',
                colNames:
                    ['源单类型', '下单日期', '单据编号', '业务状态', '客户id','客户','客户编码', '定金方式', '订单金额', '定金比例(%)', '应收定金', '已收定金'],
                colModel:
                    [
                        {
                            name: 'sourceType', index: 'sourceType', width: 220, align: "left",
                            formatter: function (value, grid, rows, state) {
                                return value = "客户订单";
                            }
                        },
                        {name: 'createTime', index: 'createTime', width: 220, align: "left",
                            formatter :function (value, grid, rows, state) {
                                return new Date(value).format("yyyy-MM-dd");
                            }},
                        {
                            name: 'orderNo', index: 'orderNo', width: 220, align: "left",
                            formatter: function (value, grid, rows, state) {
                                $(document).off("click", ".updateDetail" + value).on("click", ".updateDetail" + value, function () {
                                    ve.updateDetail({value, grid, rows, state})
                                });
                                let btns = `<a class="updateDetail${value}">${value}</a>`;
                                return btns;
                            }
                        },
                        {
                            name: 'businessStatus', index: 'businessStatus', width: 220, align: "left",
                            formatter: function (value, grid, rows, state) {
                                if (value == 10) {
                                    return "待收定金";
                                }
                            }
                        },
                        {name: 'custId', index: 'custId', width: 220, align: "left",hidden:true},
                        {name: 'custName', index: 'custName', width: 220, align: "left"},
                        {name: 'custNo', index: 'custNo', width: 220, align: "left",hidden:true},
                        {
                            name: 'depositMethod', index: 'depositMethod', width: 220, align: "left",
                            formatter: function (value, grid, rows, state) {
                                if (value === 0) {
                                    return "预付定金";
                                }else{
                                    return '';
                                }
                            }
                        },
                        {
                            name: "totalRealSaleAmount", index: "totalRealSaleAmount", width: 220, align: "right",
                            formatter: function (value, grid, rows, state) {
                                if (value != null) {
                                    return value.toFixed(2);
                                } else {
                                    var a = 0;
                                    return a.toFixed(2);
                                }
                            }
                        },
                        {name: "depositScale", index: "deposit_scale", width: 220, align: "right"},
                        {
                            name: "receviableDeposit", index: "receviableDeposit", width: 200, align: "right",
                            formatter: function (value, grid, rows, state) {
                                if (value != null) {
                                    return value.toFixed(2);
                                } else {
                                    var a = 0;
                                    return a.toFixed(2);
                                }
                            }
                        },
                        {
                            name: "paidDeposit", index: "paidDeposit", width: 200, align: "right",
                            formatter: function (value, grid, rows, state) {
                                if (value != null) {
                                    return value.toFixed(2);
                                } else {
                                    var a = 0;
                                    return a.toFixed(2);
                                }
                            }
                        }
                    ],
            }
        }
    },
    methods: {
        changeDate(value) {
            this.body.searchCreateTime = value[0]=="" ? "" : (value[0].replace(/\//g, '-') + ' 00:00:00');
            this.body.searchEndTime = value[1]=="" ? "" : (value[1].replace(/\//g, '-') + ' 23:59:59');
        },
        //客户
        closeCustomer() {
            if(this.selectCustomerObj){
                this.body.searchCustName = this.selectCustomerObj.name;
            }
        },
        /** 刷新 */
        refresh() {
            ve.reload = !ve.reload;
        },

        /** 点击客户订单编号跳转至客户订单详情页*/
        updateDetail({rows}) {
            console.log(rows.orderNo);
            if (rows.orderNo != null) {
                window.parent.activeEvent({
                    name: '客户订单',
                    url: contextPath + '/sale/customer-order/customer-order-add.html',
                    params: {type: 'view', saleOrderNo: rows.orderNo}
                });
            }
        },


        /** 搜索按钮*/
        search() {
            let config = {
                postData: this.body,
            }
            //根据单号请求数据
            $("#" + this.tabId).jqGrid('setGridParam', config).trigger("reloadGrid");
        },



        /** 生成销售定金单*/
        produce() {
            let id = this.selected
            var list = [];
            var temp = true;
            if (id.length <= 0) {
                ve.$Modal.info({
                    content: "请选择客户订单"
                })
            } else {
                for (var i = 0; i < id.length; i++) {
                    //生成销售定金单的数据
                    var obj = {};
                    var tabObj = $("#" + this.tabId).jqGrid('getRowData', id[i])
                    obj.orderNo = tabObj.orderNo.replace(/<.*?>+/g, "")
                    obj.custName = tabObj.custName.replace(/<.*?>+/g, "")
                    obj.custNo = tabObj.custNo;
                    obj.custId = tabObj.custId;
                    list.push(obj)
                }
                console.log(list)
                var listStore = list[0].custNo
                //判断客户订单不一致
                for (var k = 1; k < list.length; k++) {
                    if (listStore != list[k].custNo) {
                        temp = false;
                        ve.$Modal.info({
                            content: "客户不一致"
                        })
                        break;
                    }
                }

                if(temp){
                    //客户名称
                    var custNo = list[0].custNo
                    var custName=list[0].custName
                    var custId=list[0].custId
                    console.log(list)
                    //状态
                    var flag = 1;
                    //接收单据编号
                    var arr = [];
                    list.map((item) => {
                        arr.push(item.orderNo)
                    })
                    let allInfo = [];
                    allInfo.push(flag)
                    allInfo.push(custNo)
                    allInfo.push(custName)
                    allInfo.push(custId)
                    allInfo.push(arr)
                    window.parent.activeEvent({
                        name: '销售定金单-新增',
                        url: contextPath + '/sale/deposit/sale-order-add.html',
                        params: {allInfo: allInfo, type: 'query'}
                    });
                }
            }
        },

        /** 清空*/
        clean() {
            this.body = {
                searchDepositNo: "",
                searchSaleOrderNo: "",
                searchCustName: "",
                searchPayWay: "",
                //开始时间
                searchCreateTime: "",
                //结束时间
                searchEndTime: "",
            }
            this.dateArr=[];
            this.$refs.customerRef.clear();
            this.reload = !this.reload;
        },


        /** 退出*/
        exit() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        }
    },
    mounted() {
        this.openTime = window.parent.params.openTime;
        this.$refs.customerRef.loadCustomerList('', '');
    }
})