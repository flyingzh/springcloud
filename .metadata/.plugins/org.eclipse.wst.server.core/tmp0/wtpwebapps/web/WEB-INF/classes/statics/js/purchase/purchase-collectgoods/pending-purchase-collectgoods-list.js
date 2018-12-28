var pendingList = new Vue({
    el: '#pendingReceivingList',
    data() {
        let This = this;
        return {
            openTime: '',
            isSearchHide: true, //搜索栏
            isTabulationHide: true, // 列表
            isShow: false,
            isHide: true,
            isEdit: false,
            reload: false,
            selected: [],
            categoryType: [],
            empList: [],
            commodityCategoty: [],
            dateArr: [],
            employees: [],
            suppliers: [],
            body: {
                businessType: '',
                goodsTypePath: '',
                salesmanName: '',
                supplierId: '',
                orderNo: '',
                startTime: '',
                endTime: ''
            },
            businessTypes: [
                {
                    value: "P_ORDER_01",
                    name: "采购订单一标准采购"
                },
                {
                    value: "P_ORDER_02",
                    name: "采购订单一受托加工采购"
                },
                {
                    value: "S_CUST_MATERIAL",
                    name: "客户来料单"
                }
            ]

            ,
            data_config: {
                url: contextPath + '/tpurchasecollectgoods/findByPendVo',
                colNames: ['源单类型', '单据编号', 'id', '日期', '供应商', '客户', '业务员', '商品类型', '采购重量', "已收货重量", '待收货重量', '采购数量', '已收货数量', '待收货数量', '处理中'],
                colModel: [
                    {
                        name: 'businessType', index: 'documentType', align: "left", width: 200,
                        formatter: function (value, grid, rows, state) {
                            if (rows.businessType == 'P_ORDER_01') {
                                return '采购订单一标准采购';
                            } else if (rows.businessType == 'P_ORDER_02') {
                                return '采购订单一受托加工采购';
                            } else if (rows.businessType == "S_CUST_MATERIAL") {
                                return '客户来料单';
                            } else {
                                return "";
                            }
                        }
                    },
                    {
                        name: 'orderNo', index: 'orderNo', width: 200, align: "left",
                        formatter: function (value, grid, rows, state) {
                            $(document).off('click', ".detail" + value).on('click', ".detail" + value, function () {
                                This.testOrderDetailClick({value, grid, rows, state})
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        }
                    },
                    {name: 'goodsId', hidden: true},
                    {
                        name: 'createTime', index: 'createTime', width: 140, align: "center", align: "left",
                        formatter: function (value, grid, rows, state) {
                            if (value) {
                                return new Date(value).format("yyyy-MM-dd");
                            } else {
                                return "";
                            }
                        }
                    },
                    {
                        name: 'supplierName', index: 'supplierName', align: "left", width: 150,
                    },
                    {
                        name: 'customerName', index: 'customerName', align: "left", width: 150,
                    },
                    {name: 'salesmanName', index: 'salesmanName', align: "left", width: 80},
                    {name: 'goodsTypeName', index: 'goodsTypeName', width: 80, align: "left"},
                    {name: 'weight', index: 'weight', width: 80, align: "right"},
                    {name: 'alreadyWeight', index: 'alreadyWeight', width: 80, align: "right"},
                    {
                        name: 'notWeight', index: 'notWeight', width: 80, align: "right",
                        formatter: function (value, grid, rows, state) {
                                return rows.weight - rows.alreadyWeight;
                        }
                    },
                    {name: 'count', index: 'count', align: "right", width: 80},
                    {name: 'alreadyCount', index: 'alreadyCount', align: "right", width: 80},
                    {
                        name: 'notCount',
                        index: 'notCount',
                        align: "right",
                        width: 80,
                        formatter: function (value, grid, rows, state) {
                                return rows.count - rows.alreadyCount;
                        }
                    },
                    {name: 'processingNum', index: 'alreadyWeight', width: 80, align: "right"}
                ],
                shrinkToFit: false
            },
        }
    },
    methods: {
        //根据单据编号查详情
        testOrderDetailClick(data) {
            let code = data.rows.orderNo;
            let basic = data.rows;
            let type = data.rows.businessType;
            if(type === 'S_CUST_MATERIAL'){
                this.updateDetailClick(code);
            }else{
                if (code) {
                    this.queryOrderByOrderNo(code, true, basic);
                }
            }
        },
        queryOrderByOrderNo(code, isEdit, basic) {
            window.parent.activeEvent({
                name: '查看采购订单',
                url: contextPath + '/purchase/purchase-order/purchase-order.html',
                params: {
                    docCode: code,
                    type: 'query',
                    basicInfo: basic
                }
            });
        },
        //根据单据编号进入新增页面
        updateDetailClick(data) {
            let This = this;
            $.ajax({
                type: "POST",
                url: contextPath + "/tsaleMaterialOrder/quaryAllInformation",
                //dataType:"json",
                data: {"materialOrderNo": data},
                success: function (data) {
                    console.log(data)
                    window.parent.activeEvent({
                        name: '客户来料单-详情',
                        url: contextPath + '/sale/material-order/sale-material-add.html',
                        params: {allInfo: data, type: 'query'}
                    });
                },
                error() {
                    console.log("请求失败")
                }
            })
        },
        loadData() {
            var That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tpurchasecollectgoods/data',
                dataType: "json",
                success: function (r) {
                    That.employees = r.data.employees; //加载当前公司下面所有的员工
                },
                error: function () {
                    That.$Modal.info({
                        scrollable: true,
                        content: "系统异常,请联系技术人员！",
                    })
                }
            })
        },
        //搜索清空按钮
        search() {
            if (!this.body.businessType) {
                this.body.businessType = "";
            }
            if (!this.body.supplierId) {
                this.body.supplierId = "";
            }
            if (!this.body.salesmanName) {
                this.body.salesmanName = "";
            }
            if (!this.body.goodsTypePath) {
                this.body.goodsTypePath = '';
            }
            if (this.dateArr.length > 0) {
                this.body.startTime = this.dateArr[0] ?
                    this.dateArr[0].format("yyyy-MM-dd HH:mm:ss") : '';
                this.body.endTime = this.dateArr[1] ?
                    this.dateArr[1].format("yyyy-MM-dd" + ' 23:59:59') : '';
            }
            this.reload = !this.reload;
        },
        refresh() {
            this.clear();
            this.search();
        },

        clear() {
            this.$refs.saleName.reset();
            this.$refs.supplier.clear();
            this.$nextTick(function () {
                this.body.salesmanName = '';
                this.body.supplierId = '';
            });
            this.body = {
                businessType: '',
                goodsTypePath: '',
                salesmanName: '',
                supplierId: '',
                orderNo: '',
                startTime: '',
                endTime: ''
            };

            this.commodityCategoty = [];
            this.dateArr = [];

        },
        generateReport() {
            var That = this;

            if (That.selected.length > 0) {
                var arr = [];
                if (That.selected.length > 1) {
                    var collect = That.selected[0];
                    for (var i = 0; i < That.selected.length; i++) {
                        arr.push(That.selected[i].goodsId);
                        var collect1 = That.selected[i];
                        if (i == 0) {
                            continue;
                        }
                        if (collect.businessType != collect1.businessType) {
                            That.$Modal.info(
                                {
                                    scrollable: true,
                                    content: "请选择相同的源单类型生成收货订单"
                                });
                            return;
                        }
                        if (collect1.businessType == 'S_CUST_MATERIAL') {
                            if (collect.customerName != collect1.customerName) {
                                That.$Modal.info({
                                    scrollable: true,
                                    content: "请选择相同的客户生成收货订单"
                                });
                                return;
                            }
                        } else {
                            if (collect.supplierName != collect1.supplierName) {
                                That.$Modal.info({
                                    scrollable: true,
                                    content: "请选择相同的供应商生成收货订单"
                                });
                                return;
                            }
                        }
                        if (collect.goodsTypeName != collect1.goodsTypeName) {
                            That.$Modal.info({
                                scrollable: true,
                                content: "请选择相同的商品类型生成收货订单"
                            });
                            return;
                        }

                    }
                }else{
                    arr.push(That.selected[0].goodsId);
                }
                let type;
                if (That.selected[0].businessType == 'S_CUST_MATERIAL') {
                    type = 1;
                } else {
                    type = 2;
                }
               arr = arr.join(',');
                $.ajax({
                    type: "post",
                    url: contextPath + '/tpurchasecollectgoods/findByCustomerIds',
                    data: {"ids":arr, "type":type},
                    success: function (r) {
                        if (r.code == "100100") {
                            That.goPurchaseAdd(r.data);
                        }

                    },
                    error: function () {
                        That.$Modal.info({
                            scrollable: true,
                            content: "系统出现异常,请联系管理人员"
                        });
                    }
                })
            } else {
                That.$Modal.info({
                    scrollable: true,
                    content: "请选择数据生成收货订单"
                });
            }

        },
        goPurchaseAdd(data) {
            window.parent.activeEvent({
                name: '采购收货单-新增',
                url: contextPath + '/purchase/purchase-collectgoods/purchase-collectgoods-add.html',
                params: data,
                type: 1
            });
        },
        cancel() {

        },
        //加载商品类型
        loadProductType() {
            var That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/documentController/getCategory?parentId=0',
                contentType: 'application/json',
                dataType: "json",
                success: function (res) {
                    That.categoryType = That.initGoodCategory(res.data.cateLists)
                },
                error: function (err) {
                    That.$Modal.info({
                        scrollable: true,
                        content: "系统出现异常,请联系管理人员"
                    });
                },
            })
        },
        //加载供应商
        closeSupplier(id, code, name) {
            let This = this;
            This.body.supplierId = id;
        },
        changeCategory(e) {
            this.body.goodsTypePath = e[e.length - 1];
        },
        initGoodCategory(type) {
            let result = [];
            type.forEach((item) => {
                let {
                    customCode: value,
                    name: label,
                    cateLists: children
                } = item

                if (children) {
                    children = this.initGoodCategory(children)
                }
                result.push({
                    value,
                    label,
                    children
                })
            })
            result.forEach((item) => {
                if (!item.children) {
                    delete item.children;
                }
            })
            return result
        },
        //加载业务员信息
        loadEmplist() {
            var That = this;
            $.ajax({
                type: "post",
                // url: contextPath + '',
                url: './empList.json',
                dataType: "json",
                success: function (data) {
                    purchaseOrderList.empList = data.data;
                },
                error: function () {
                    That.$Modal.info({
                        scrollable: true,
                        content: "系统出现异常,请联系管理人员"
                    });
                }
            })
        },
        exit() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime})
        },
        //加载单据状态
        // loadDocumentStatus(){
        //     $.ajax({
        //         type: "post",
        //         // url: contextPath + '',
        //         url:'./documentStatus.json',
        //         dataType: "json",
        //         success: function (data) {
        //             purchaseOrderList.documentStatusList = data.data;
        //         },
        //         error: function () {
        //             alert('服务器出错啦');
        //         }
        //     })
        // }


    },
    created() {
        this.loadProductType();
        this.loadData();
        // this.loadEmplist();
        // this.loadDocumentStatus();
    },
    mounted() {
        this.openTime = window.parent.params.openTime;
    },
})
