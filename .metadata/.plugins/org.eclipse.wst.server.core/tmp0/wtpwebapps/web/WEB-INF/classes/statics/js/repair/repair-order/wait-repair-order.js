let vm = new Vue({
    el: "#wait-order",
    data() {
        let This = this;
        return {
            isHideSearch: true,
            isHideList: true,
            openTime: "",
            categoryType: [],
            //所选的客户对象
            selectCustomerObj: null,
            parentPramas: {},
            jumpParam: {},
            body: {
                sourceType: "",
                goodsTypeName: "",
                goodsType: "",
                documentNo: "",
                //开始时间
                startDate: "",
                //结束时间
                endDate: "",
                custName: "",
            },
            //列表
            data_user_list: {
                //列表页数据
                url: contextPath + '/repairOrderWaitController/list',
                colNames:
                    ['源单类型', '源单编号', '日期', '质检状态', '客户', '供应商', '商品类型', '商品编码',
                        '商品名称', '计重单位', '总重', '计数单位', '数量', '分录行号','商品分类编码',
                        '源单类型','源单id','源单编号','客户id','客户编码',
                        '商品分录行id','金重','主石重','副石重','销售退货通知单商品id','库存退货商品id','证书类型',
                        '证书编号','商品规格','备注','商品主类型','款式id','款式code','款式名称','计数id','计重id'],
                colModel:
                    [
                        {
                            name: 'sourceType', index: 'sourceType', width: 200, align: "left",
                            formatter: function (value) {
                                if (value == 1) {
                                    return "维修登记单"
                                } else if (value == 2) {
                                    return "销售退货通知单"
                                } else if (value == 3) {
                                    return "库存退库单"
                                } else {
                                    return ""
                                }
                            }
                        },
                        {
                            name: 'documentNo', index: 'documentNo', width: 250, align: "left",
                            formatter: function (value, grid, rows, state) {
                                $(document).off('click', ".detail" + value).on('click', ".detail" + value, function () {
                                    This.detailClick({value, grid, rows, state})
                                });
                                let myCode = `<a class="detail${value}">${value}</a>`;
                                return myCode;
                            }
                        },
                        {name: 'orderDate', index: 'orderDate', width: 200, align: "left"},
                        {name: "qualityTestStatus", index: "qualityTestStatus", width: 200, align: "left"},
                        {name: 'custName', index: 'custName', width: 200, align: "left"},
                        {name: "supplierName", index: "supplierName", width: 200, align: "left"},
                        {name: "goodsTypeName", index: "goodsTypeName", width: 200, align: "left"},
                        {name: 'goodsCode', index: 'goodsCode', width: 200, align: "left"},
                        {name: "goodsName", index: "goodsName", width: 200, align: "left"},
                        {name: "weightUnit", index: "weightUnit", width: 200, align: "left"},
                        {name: 'totalWeight', index: 'totalWeight', width: 200, align: "right"},
                        {name: "countingUnit", index: "countingUnit", width: 200, align: "left"},
                        {name: "goodsNum", index: "goodsNum", width: 200, align: "right"},
                        {name: "goodsLineNo", index: "goodsLineNo", width: 200, align: "left", hidden: true},
                        {name: "goodsType", index: "goodsType", width: 200, align: "left", hidden: true},
                        {name: "sourceType", index: "sourceType", width: 200, align: "left", hidden: true},
                        {name: "sourceId", index: "sourceId", width: 200, align: "left", hidden: true},
                        {name: "documentNo", index: "documentNo", width: 200, align: "left", hidden: true},
                        {name: "custId", index: "custId", width: 200, align: "left", hidden: true},
                        {name: "custNo", index: "custNo", width: 200, align: "left", hidden: true},
                        {name: "goodsId", index: "goodsId", width: 200, align: "left", hidden: true},
                        {name: "goldWeight", index: "goldWeight", width: 200, align: "left", hidden: true},
                        {name: "mainStoneWeight", index: "mainStoneWeight", width: 200, align: "left", hidden: true},
                        {name: "viceStoneWeight", index: "viceStoneWeight", width: 200, align: "left", hidden: true},
                        {name: "saleReturnGoodsId", index: "saleReturnGoodsId", width: 200, align: "left", hidden: true},
                        {name: "stockReturnGoodsId", index: "stockReturnGoodsId", width: 200, align: "left", hidden: true},
                        {name: "certificateType", index: "certificateType", width: 200, align: "left", hidden: true},
                        {name: "certificateNo", index: "certificateNo", width: 200, align: "left", hidden: true},
                        {name: "goodsNorm", index: "goodsNorm", width: 200, align: "left", hidden: true},
                        {name: "remark", index: "remark", width: 200, align: "left", hidden: true},
                        {name: "goodsMainType", index: "goodsMainType", width: 200, align: "left", hidden: true},
                        {name: "styleCategoryId", index: "styleCategoryId", width: 200, align: "left", hidden: true},
                        {name: "styleCustomCode", index: "styleCustomCode", width: 200, align: "left", hidden: true},
                        {name: "styleName", index: "styleName", width: 200, align: "left", hidden: true},
                        {name: "countingUnitId", index: "countingUnitId", width: 200, align: "left", hidden: true},
                        {name: "weightUnitId", index: "weightUnitId", width: 200, align: "left", hidden: true},
                    ],
            },
            reload: true,
            selected: [],
            dateArr: [],
        }
    },
    methods: {
        //生成维修退货单
        orderMerger() {
            let This = this
            let goods = This.selected
            let temp = true;
            //数据检验
            if (goods) {
                let goodOne = goods[0]
                goods.map(a => {
                    if (a.sourceType != goodOne.sourceType) {
                        This.$Modal.error({title: '提示', content: '合并商品的源单类型必须一致!'});
                        temp = false;
                        return false
                    }
                    if (a.goodsType != goodOne.goodsType) {
                        This.$Modal.error({title: '提示', content: '合并商品的商品类型必须一致!'})
                        temp = false;
                        return false
                    }
                    if (a.sourceType == '库存退库单') {
                        if (a.custId != goodOne.custId) {
                            This.$Modal.error({title: '提示', content: '合并商品的源单为库存退库单时，客户必须一致!'})
                            temp = false;
                            return false
                        }
                        if (a.supplierId != goodOne.supperId) {
                            This.$Modal.error({title: '提示', content: '合并商品的源单为库存退库单时，供应商必须一致!'})
                            temp = false;
                            return false
                        }
                    }
                })
            }
            if (temp) {
                $.ajax({
                    url: contextPath + '/repairOrderWaitController/orderMerger',
                    type: 'POST',
                    data: JSON.stringify(This.selected),
                    contentType: 'application/json',
                    success: function (result) {
                        console.log(result)
                        vm.jump(result.data, 'wait')
                    },
                    error: function (err) {

                    }
                })
            }

        },
        //刷新
        refresh() {
            this.clean()
            this.reload = !this.reload
        },
        //退出
        exit() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        },
        //改变日期
        changeDate(value) {
            this.body.startDate = value[0] == "" ? "" : (value[0].replace(/\//g, '-') + ' 00:00:00');
            this.body.endDate = value[1] == "" ? "" : (value[1].replace(/\//g, '-') + ' 23:59:59');
        },
        //跳转到维修订单
        jump(data, jumpFlag) {
            console.log(data)
            console.log(jumpFlag)
            window.parent.activeEvent({
                name: '维修订单-新增',
                url: contextPath + '/repair/repair-order/repair-order-add.html',
                params: {
                    type: jumpFlag,
                    data: data
                }
            });
        },
        //获取商品类型
        changeCategory(e) {
            console.log(e);
            this.body.goodsType = e[e.length - 1];
        },
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
                },
            })
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

        //查询库存退库单接口
        selectByOrderDetail(id,businessType){
            let This = this;
            $.ajax({
                url:contextPath + '/rurchaseReturnGoods/queryByOrderInfo/'+id+"/"+businessType,
                method:'post',
                dataType:'json',
                success:function(data){
                    if(data.code == '100100'){
                        window.parent.activeEvent({
                            name: '采购退库单-查看',
                            url: contextPath + '/purchase/returngoods/returngoods-add.html',
                            params: {type: 'detail',goodsData:data.data,activeType:'detail'}
                        });
                    }else{
                        layer.alert(data.msg, {icon: 0});
                    }
                },
                error:function(){
                    layer.alert('服务器异常，请稍后再试！', {icon: 0});
                }
            });
        },
        // 选择商品类型
        changeProductType(e) {
            this.body.goodsType = e.value;
            this.body.goodsTypeName = e.label;
        },
        //点击查询
        detailClick(data) {
            console.log("这是查询跳转。。。")
            console.log(data.value)
            console.log(data.rows)
            let result = data.rows
            let code = result.documentNo
            if(result.sourceType == 1){
                //维修订单
                console.log("维修订单-查看.......")
                window.parent.activeEvent({
                    name: '维修登记单-查看',
                    url: contextPath + '/repair/registration/registration-form.html',
                    params: { type: 'view',repairRegisterNo:code}
                });
            }else if(result.sourceType == 2){
                //销售退货通知单
                console.log("销售退货通知单-查看.......")
                window.parent.activeEvent({
                    name: '销售退货通知单-查看',
                    url: contextPath + '/sale/return-notice/sale-reject-add.html',
                    params: {documentNo: code, type: 'query'}
                });
            }else{
                //库存退库单
                this.selectByOrderDetail(result.sourceId,'W_STOCK_RETURN')
            }
        },

        //搜索
        search() {
            // if (this.dateArr.length > 0) {
            //     this.body.startDate = this.dateArr[0] ?
            //         this.dateArr[0].format("yyyy-MM-dd HH:mm:ss") : '';
            //     this.body.endDate = this.dateArr[1] ?
            //         this.dateArr[1].format("yyyy-MM-dd HH:mm:ss") : '';
            // }
            this.reload = !this.reload;
        },
        closeCustomer() {
            if (this.selectCustomerObj) {
                this.body.custName = this.selectCustomerObj.name;
            }
        },
        //重置
        clean() {
            this.$refs.payWay.reset()
            this.$nextTick(function () {
                this.body.sourceType = '';
            });
            this.body = {
                goodsTypeName: "",
                goodsType: "",
                documentNo: "",
                //开始时间
                startDate: "",
                //结束时间
                endDate: "",
                custName: "",
            };
            this.$refs.gtype.body.typeValue = '';
            this.$refs.customerRef.clear();
            this.dateArr = [];
        },
        //清空按钮
        clearType(){
            this.$refs.payWay.reset();
            this.$nextTick(function () {
                this.body.sourceType = '';
            });
        },
    },
    created() {
        this.loadProductType();
    },
    mounted() {
        this.openTime = window.parent.params.openTime;
        this.$refs.customerRef.loadCustomerList('', '');
    },
})