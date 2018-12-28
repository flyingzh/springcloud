var pendingReturnList = new Vue({
    el: '#pendingReturnList',
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
                sourceType: 'P_RECEIPT_02',
                supplierId: '',
                goodsTypePath: '',
                orderNo: '',
                salesmanName: '',
                startTime: '',
                endTime: ''
            },
            orderStatusMap: {
                "1": "暂存",
                "2": "待审核",
                "3": "审核中",
                "4": "已审核",
                "5": "驳回"

            },
            qualityStatusMap: {
                "1": "待质检",
                "2": "不合格",
                "3": "合格",
                "4": "特别放行",
            },
            sourceTypeMap: {
                "P_RECEIPT_02": "收货单一标准采购收货",
            },
            data_config: {
                url: contextPath + "/rurchaseReturnGoods/stayReturnGoodsPageInfo",
                colNames: ['源单类型', 'id', '单据编号', '日期', '供应商', '质检状态', '商品类型', '退货数量', '收货数量', '入库数量'],
                colModel: [
                    {
                        name: 'sourceType', index: 'sourceType', align: "left", width: 220,
                        formatter: function (value, grid, rows, state) {
                            return pendingReturnList.sourceTypeMap[value];
                        }
                    },
                    {name: 'id', hidden: true},
                    {
                        name: 'orderNo', index: 'orderNo', width: 270, align: "left",key:true,
                        formatter: function (value, grid, rows, state) {
                            $(document).off('click', ".detail" + value).on('click', ".detail" + value, function () {
                                console.log({value, grid, rows, state});
                                This.view(rows.id);
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        },
                        unformat: function (value, grid, rows) {
                            return value.replace(/(<\/?a.*?>)/g, '');
                        }
                    },
                    {
                        name: 'createTime', index: 'createTime', width: 170, align: "center", align: "left",
                        formatter: function (value, grid, rows, state) {
                            return new Date(value).format("yyyy-MM-dd");
                        }
                    },
                    {
                        name: 'supplierName', index: 'supplierName', align: "left", width: 220,

                    },
                    {
                        name: 'qualityStatus', index: 'qualityStatus', align: "left", width: 170,
                        formatter: function (value, grid, rows, state) {
                            return pendingReturnList.qualityStatusMap[value]
                        }
                    },
                    {
                        name: 'goodsTypeName', index: 'goodsTypeName', align: "left", width: 170,
                    },
                    {name: 'returnCount', index: 'returnCount', align: "right", width: 170},
                    {name: 'takeDeliveryCount', index: 'takeDeliveryCount', width: 170, align: "right"},
                    {name: 'inStorageCount', index: 'inStorageCount', align: "right", width: 170}
                ],
            },
        }
    },
    methods: {
        view(id){
            var That = this;
            $.ajax({
                type:"post",
                url: contextPath + '/tpurchasecollectgoods/info?id='+id,
                dataType:"json",
                success:function (r) {
                    if(r.code == '100100'){
                        window.parent.activeEvent({
                            name: '采购收货单-查看',
                            url: contextPath+'/purchase/purchase-collectgoods/purchase-collectgoods-add.html', params: r.data,type:4});
                    };
                },
                error:function (r) {
                    That.$Modal.error({
                        scrollable:true,
                        content:"系统异常,请联系技术人员！",
                    })
                }
            });
        },
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
            this.$refs.supplier.reset();
            this.$nextTick(function(){
                this.body.supplierId='';
            });
            this.commodityCategoty = [];
            this.dateArr = [];
            this.body.sourceType = 'P_RECEIPT_02';
            this.body.goodsTypePath = '';
            this.body.orderNo = '';
            this.body.salesmanName = '';
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
                businessType:'P_RECEIPT_02'
            };
            var ids = [];
            for (let index in this.selected) {
                ids.push(this.selected[index].id)
                params.businessType = this.selected[index].sourceType;
            }
            params.ids = ids.join(',');
            let orders = this.selected;
            if (flag) {
                $.ajax({
                    url: contextPath + '/rurchaseReturnGoods/generateByReturnOrder',
                    method: 'post',
                    dataType: "json",
                    data: params,
                    success: function (data) {
                        if (data.code === '100100') {
                            data.data.supplierName = orders[0].supplierName;
                            data.data.supplierCode = orders[0].supplierCode;
                            window.parent.activeEvent({
                                name: '生成采购退货单',
                                url: contextPath + '/purchase/returngoods/returngoods-add.html',
                                params: {type: 'generate', goodsData: data.data}
                            });
                        } else {
                            layer.alert(data.msg, {icon: 0});
                        }
                    },
                    error: function (e) {
                        layer.alert('生成采购退货单失败！', {icon: 0});
                    }
                });

            }
        },
        changeCategory(e) {
            console.log(e);
            console.log(e[e.length - 1]);
        },
        cancel() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        },
    },
    created() {
        this.loadProductType();
        this.loadSuppliers();
    },
    watch: {},
    mounted(){
        this.openTime = window.parent.params.openTime;
    },
})
