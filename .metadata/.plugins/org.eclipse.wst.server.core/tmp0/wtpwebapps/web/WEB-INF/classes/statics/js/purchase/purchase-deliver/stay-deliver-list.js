var pendingDeliverList = new Vue({
    el: '#pendingDeliverList',
    data() {
        let This = this;
        return {
            openTime: '',
            isSearchHide: true, //搜索栏
            isTabulationHide: true, // 列表
            isShow: false,
            isHide: true,
            reload: false,
            selected: [],
            categoryType: [],
            commodityCategoty: [],
            suppliers:[],
            dateArr: [],
            body: {
                supplierId: '',
                goodsTypePath: '',
                documentNo: '',
                startTime: '',
                endTime: ''
            },
            data_config: {
                url: contextPath + "/purchaseDeliverController/firstlist",
                colNames: ['源单类型', '日期', '单据编号','供应商', '商品类型', '送料重量', '送料数量'],
                colModel: [
                    {name: 'businessType', index: 'businessType', align: "left", width: 330,
                        formatter: function (value) {
                            return "调拨单-"+"采购送料";
                        }
                    },
                    {name: 'transferTime', index: 'transferTime', width: 250, align: "left",
                        formatter: function (value, grid, rows, state) {
                        if(value == null || value == ''){
                            return '';
                        }
                         return value.substring(0,10);
                        }
                    },
                  //  {name: 'documentNo', index: 'documentNo', align: "left", width: 450},
                    {name: 'documentNo', index: 'documentNo', width: 450, align: "left",
                        formatter: function (value, grid, rows, state) {
                            $(document).off('click',".detail"+ value).on('click',".detail"+ value,function(){
                                This.testOrderDetailClick({value, grid, rows, state})
                            });
                            let myCode =  `<a class="detail${value}">${value}</a>`;
                            return  myCode;
                        }
                    },
                    {name: 'supplierName', index: 'supplierName', align: "left", width: 360},
                    {name: 'goodsTypeName', index: 'goodsTypeName', width: 280, align: "left"},
                    {name: 'totalTransferWeigh', index: 'totalTransferWeigh', width: 280, align: "right"},
                    {name: 'totalTransferNum', index: 'totalTransferNum', width: 280, align: "right"},
                ],
            },
        }
    },
    methods: {
        closeSupplier(id, code, name){
            console.log(id, code, name);
            this.body.supplierId = id;
        },

        //根据单据编号查详情
        testOrderDetailClick(data) {
            console.log(data);
          //  let code = data.rows.documentNo;
            let code = data.rows.documentNo;
            let basic = data.rows;
            if (code) {
                this.queryRequisitionByDocumentNo(code, true, basic);
            }
        },
        queryRequisitionByDocumentNo(code, isEdit, basic) {
            //携带id跳转至新增页
            window.parent.activeEvent({
                name: "查看调拨单",
                url: contextPath+'/warehouse/requisition/requisition-info.html',
                params: {activeType: "listQuery",documentNo:code}
            });

        },

        //加载供应商
        loadSuppliers(){
            var That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tpurchasecollectgoods/findSupplierByOrgId',
                dataType: "json",
                success: function (r) {
                    That.suppliers =  r.data;
                },
                error: function () {
                    That.$Modal.error({
                        context:"系统出现异常,请联系管理人员"
                    });
                }
            })
        },
        //搜索清空按钮
        search() {
            if (this.commodityCategoty.length > 0) {
                this.body.goodsTypeName = this.commodityCategoty[this.commodityCategoty.length - 1];
            } else {
                this.body.goodsTypeName = '';
            }
            if (this.dateArr.length > 0 && this.dateArr[0] && this.dateArr[1]) {
                this.body.startTime = this.dateArr[0].format("yyyy-MM-dd") + " 00:00:00";
                this.body.endTime = this.dateArr[1].format("yyyy-MM-dd") + " 23:00:00";
            } else {
                this.body.startTime = '';
                this.body.endTime = '';
            }
            this.reload = !this.reload;
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
                    console.log("服务器出错");
                }
            })
        },
        // 级联商品类型
        changeProductType(value, selectedData) {
            let tempType = selectedData[selectedData.length - 1];
            this.body.goodsTypePath = tempType.value;

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
        clear() {
            this.$refs.supplier.clear();
            this.dateArr = [];
            this.body.supplierId = '';
            this.body.goodsTypePath = '';
            this.body.documentNo = '';
            this.body.startTime = '';
            this.body.endTime = '';
        },
        //顶部菜单栏按钮
        refresh() {
            this.clear();
            this.selected = [];
            this.reload = !this.reload;
        },
        generateReport() {
            let flag = true;
            if (this.selected.length < 1) {
                this.$Modal.warning({
                    title: '提示信息',
                    content: '请先选择至少一条数据！'
                });
                return;
            }
            outLoop:
                for (let obj in this.selected) {
                    for (let v in this.selected) {
                        if (this.selected[obj].sourceType != this.selected[v].sourceType) {
                            this.$Modal.warning({
                                title: '提示信息',
                                content: '源单类型不一致，请重新选择！'
                            });
                            flag = false;
                            break outLoop;
                        }
                        if (this.selected[obj].supplierName != this.selected[v].supplierName) {
                            this.$Modal.warning({
                                title: '提示信息',
                                content: '供应商不一致，请重新选择！'
                            });
                            flag = false;
                            break outLoop;
                        }
                        if (this.selected[obj].goodsTypeName != this.selected[v].goodsTypeName) {
                            this.$Modal.warning({
                                title: '提示信息',
                                content: '商品类型不一致，请重新选择！'
                            });
                            flag = false;
                            break outLoop;
                        }
                    }
                }
            var params ={
                ids:{},
            };
            var ids = [];
            for (let index in this.selected) {
                ids.push(this.selected[index].id)
            }
            params.ids = ids.join(',');
            let orders = this.selected;
            if (flag) {
                $.ajax({
                    url: contextPath + '/purchaseDeliverController/generateDeliverOrder',
                    method: 'post',
                    dataType: "json",
                    data: params,
                    success: function (data) {
                        if (data.code === '100100') {
                            data.data.supplierName = orders[0].supplierName;
                            data.data.supplierCode = orders[0].supplierCode;
                            window.parent.activeEvent({
                                name: '新增采购送料单',
                                url: contextPath + '/purchase/purchase-deliver/deliver-add.html',
                                params: {type: 'generate', goodsData: data.data}
                            });
                        } else {
                            layer.alert(data.msg, {icon: 0});
                        }
                    },
                    error: function (e) {
                        layer.alert('生成采购送料单失败！', {icon: 0});
                    }
                });

            }
        },
        changeCategory(e) {
            console.log(e);
            console.log(e[e.length - 1]);
        },
        cancel() {
            window.parent.closeCurrentTab({name: '', openTime: this.openTime, exit: true});
        },
    },
    created() {
        this.loadProductType();
        this.loadSuppliers();
    },
    watch: {},
    mounted() {
        this.openTime = window.parent.params.openTime;
    },
})
