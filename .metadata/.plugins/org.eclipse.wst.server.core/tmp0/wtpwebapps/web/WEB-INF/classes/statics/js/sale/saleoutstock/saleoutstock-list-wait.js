var vm = new Vue({
    el: "#customer-order-wait-list",
    data() {
        let This = this;
        return {
            isHideSearch: true,
            isHideList: true,
            selected: [],
            categoryType: [],
            commodityCategoty: [],
            goldPriceList:[],
            wareHouseList:[],
            areaInit:[],
            openTime: "",
            reload: false,
            addBody: {
                id: '',
                // 基本信息
                outStockNo: '',
                outStockTime: '',
                goodsType: '',
                goodsMainType: '',
                organizationId: '',
                status: 1,//'单据状态 1 暂存，2 待审核，3 审核中，4 已审核，5 驳回',
                businessType: '',
                shipMethod: '',
                saleMenId: '',
                saleMenName: '',
                remark: '',
                operationFlag: '',//操作标识 0 扭转 1 手动新增
                // 客户信息
                saleCustInfoEntity: {
                    custNo: '',
                    email: '',
                    area: '',
                    name: '',
                    zipCode: '',
                    detail: '',
                    phone: '',
                    weChatNo: '',
                },
                // 财务信息
                pricingMethod: '',
                totalCost: '',
                totalSaleAmount: '',
                totalActualAmount: '',
                goldAmount: '',
                stoneAmount: '',
                accessoryAmount: '',
                totalLaborCost: '',
                totalCertificateAmount: '',
                totalOtherAmount: '',
                // 审批信息
                // 其他
                createId: '',
                createId: '',
                createName: '',
                createTime: '',
                updateId: '',
                updateName: '',
                updateTime: '',
                auditName: '',
                auditTime: '',
                goodList: []

            },
            body: {
                saleOrderNo: '',
                goodsType: '',
                goodsCode: '',
                goodsName: ''
            },
            businessStatusLabel: [
                {
                    label: '待收定金',
                    value: '10'
                }
            ],
            saveReqList: [],
            data_config: {

                url: contextPath + '/tsaleoutstockwait/list',
                colNames: ['源单类型', '客户订单编号', '客户', '商品类型', '质检状态', '图片', '商品编码', '商品名称',
                    '计数单位', '订单数量', '待出库数量', '发货检验合格数量', '特殊放行数量', '累计出库数量', '交货日期',
                    '分录行号', '客户编号', '邮箱', '所属区域', '联系人', '邮编', '地址', '联系方式', '微信号', 'id',
                    '计价方式','客户id','库位id','仓库','主类型','分录行id','业务类型','金价','总重','计重id','计数id',
                    '计价','市','区','省','详细地址','条码id','调拨单单号','款式id','款式code','款式名称','商品明细标志','出库中数量'],
                colModel: [
                    { name: 'documentType', index: 'documentType', width: 180, align: "left", sortable: false  ,
                        formatter: function (value, grid, rows, state) {
                        if(value == 'S_CUST_ORDER'){
                            return '客户订单';
                        }else{
                            return ''
                        }

                    }},
                    { name: 'saleOrderNo', index: 'custNo', width: 150, align: "left" ,
                        formatter: function (value, grid, rows, state) {
                            $(document).off('click', ".detail" + value).on('click', ".detail" + value, function () {
                                This.detailClick({value, grid, rows, state})
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        }},
                    { name: 'custName', index: 'goodsType', width: 180, align: "left", sortable: false },
                    { name: 'goodsTypeName', index: 'goodsTypeName', width: 180, align: "left", sortable: false },
                    { name: 'qualityInspectionStatus', index: 'qualityInspectionStatus', width: 150, align: "left", sortable: false },
                    {
                        name: 'pictureUrl', index: 'pictureUrl', width: 180, align: "left", formatter: function (value, grid, rows, state) {
                            return `<img height=40px width=40px src=${value}>`
                        }
                    },
                    { name: 'goodsCode', index: 'goodsCode', width: 180, sortable: false, align: "left" ,
                        formatter: function (value, grid, rows, state) {
                            $(document).off('click', ".detail" + value).on('click', ".detail" + value, function () {
                                This.commodityDetailClick(rows)
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        }},
                    { name: 'goodsName', index: 'goodsName', width: 180, sortable: false, align: "left" },
                    { name: 'countingUnit', index: 'countingUnit', width: 180, sortable: false, align: "left" },
                    { name: 'num', index: 'num', width: 180, sortable: false, align: "right" },
                    { name: 'waitOutStockAmount', index: 'waitOutStockAmount', width: 180, sortable: false, align: "right" },
                    { name: 'shipCheckPassNum', index: 'shipCheckPassNum', width: 180, sortable: false, align: "right" },
                    { name: 'shipCheckReleaseNum', index: 'shipCheckReleaseNum', width: 180, sortable: false, align: "right" },
                    { name: 'totalOutStockNum', index: 'totalOutStockNum', width: 180, sortable: false, align: "right" },
                    { name: 'deliveryDate', index: 'deliveryDate', width: 180, sortable: false, align: "left" },
                    { name: 'goodsLineNo', index: 'goodsLineNo', width: 180, sortable: false, align: "left", hidden: true},
                    { name: 'custNo', index: 'custNo', width: 180, sortable: false, align: "left", hidden: true },
                    { name: 'email', index: 'email', width: 180, sortable: false, align: "left", hidden: true },
                    { name: 'county', index: 'county', width: 180, sortable: false, align: "left", hidden: true },
                    { name: 'name', index: 'name', width: 180, sortable: false, align: "left", hidden: true },
                    { name: 'zipCode', index: 'zipCode', width: 180, sortable: false, align: "left", hidden: true },
                    { name: 'detail', index: 'detail', width: 180, sortable: false, align: "left", hidden: true },
                    { name: 'phone', index: 'phone', width: 180, sortable: false, align: "left", hidden: true },
                    { name: 'weChatNo', index: 'weChatNo', width: 180, sortable: false, align: "left", hidden: true },
                    { name: 'id', index: 'id', width: 180, sortable: false, align: "left", hidden: true },
                    { name: 'pricingMethod', index: 'pricingMethod', width: 180, sortable: false, align: "left", hidden: true },
                    { name: 'custId', index: 'custId', width: 180, sortable: false, align: "left", hidden: true },
                    { name: 'locationId', index: 'locationId', width: 180, sortable: false, align: "left", hidden: true },
                    { name: 'warehouseId', index: 'warehouseId', width: 180, sortable: false, align: "left", hidden: true },
                    { name: 'goodsMainType', index: 'goodsMainType', width: 180, sortable: false, align: "left", hidden: true },
                    { name: 'goodsLineNoId', index: 'goodsLineNoId', width: 180, sortable: false, align: "left", hidden: true },
                    { name: 'businessType', index: 'businessType', width: 180, sortable: false, align: "left", hidden: true },
                    { name: 'goldPrice', index: 'goldPrice', width: 180, sortable: false, align: "left", hidden: true },
                    { name: 'totalWeight', index: 'totalWeight', width: 180, sortable: false, align: "left", hidden: true },
                    { name: 'weightUnitId', index: 'weightUnitId', width: 180, sortable: false, align: "left", hidden: true },
                    { name: 'countingUnitId', index: 'countingUnitId', width: 180, sortable: false, align: "left", hidden: true },
                    { name: 'pricingUnitId', index: 'pricingUnitId', width: 180, sortable: false, align: "left", hidden: true },
                    { name: 'city', index: 'city', width: 180, sortable: false, align: "left", hidden: true },
                    { name: 'area', index: 'area', width: 180, sortable: false, align: "left", hidden: true },
                    { name: 'province', index: 'province', width: 180, sortable: false, align: "left", hidden: true },
                    { name: 'concreteAddress', index: 'concreteAddress', width: 180, sortable: false, align: "left", hidden: true },
                    { name: 'goodsId', index: 'goodsId', width: 180, sortable: false, align: "left", hidden: true },
                    { name: 'transferNo', index: 'transferNo', width: 180, sortable: false, align: "left", hidden: true },
                    { name: 'styleCategoryId', index: 'styleCategoryId', width: 180, sortable: false, align: "left", hidden: true },
                    { name: 'styleCustomCode', index: 'styleCustomCode', width: 180, sortable: false, align: "left", hidden: true },
                    { name: 'styleName', index: 'styleName', width: 180, sortable: false, align: "left", hidden: true },
                    { name: 'detailMark', index: 'detailMark', width: 180, sortable: false, align: "left", hidden: true },
                    { name: 'outingStockNum', index: 'outingStockNum', width: 180, sortable: false, align: "left", hidden: true },
                ]
            },
        }
    },
    methods: {
        detailClick(data) {
            console.log("这是跳转客户订单页面。。。")
            console.log(data.value)

            window.parent.activeEvent({
                name: '客户订单-查看',
                url: contextPath + '/sale/customer-order/customer-order-add.html',
                params: {type: 'view', saleOrderNo: data.value}
            });
        },
        commodityDetailClick(data) {
            console.log("这是跳转商品查看页面。。。")
            console.log(data)

            window.parent.activeEvent({
                name: '商品',
                url: contextPath + '/base-data/commodity/commodity-info.html',
                params: {type: 'skip', id: data.commodityId}
            });
        },
        initGoldPrice(type) {
            let that = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tbasetodygoldprice/queryPrice',
                data: {"type": type},
                dataType: "json",
                success(data) {
                    that.goldPriceList = data.data;
                },
                error() {
                    that.$Message.warning('服务器报错')
                }

            })
        },
        initWareHoust(){
            let This = this
            $.ajax({
                url: contextPath + '/wareHouse/listByTypeAndOrganizationId?type=1',
                type: 'POST',
                dataType: 'json',
                success: function (result) {
                    console.log(result)
                    This.wareHouseList = result.data
                },
                error: function (err) {
                    This.$Modal.error({
                        content: "系统出现异常,请联系管理人员"
                    });
                },
            })
        },
        search() {
            this.reload = !this.reload;
        },
        clear() {
            this.body = {
                saleOrderNo: '',
                goodsType: '',
                goodsCode: '',
                goodsName: ''
            }
        },
        exit() {
            window.parent.closeCurrentTab({ exit: true, openTime: this.openTime });
        },

        jump(result, jumpFlag) {
            this.initGoldPrice(1)
            this.initWareHoust()
            let order = this.selected[0]
            this.areaInit = {
                isInit: true,
                province: order.province,
                city: order.city,
                county: order.county,
                detail: order.concreteAddress,
                disabled:false
            }
            Object.assign(result,{goldPriceList:this.goldPriceList},
                {wareHouseList:this.wareHouseList},{areaInit:this.areaInit})
            window.parent.activeEvent({
                name: '销售出库单-新增',
                url: contextPath + '/sale/saleoutstock/saleoutstock-add.html',
                params: {
                    type: jumpFlag,
                    data: result
                }
            });
        },
        save() {
            console.log("进保存了。。。")
            let This = this
            let orders = This.selected;
            if (orders.length == 0) {
                This.$Modal.warning({
                    content: "请选择一条记录！"
                })
                return
            }
            if (orders.length > 0) {
                for (let item in orders) {
                    if (orders[0].custId != orders[item].custId) {
                        This.$Modal.warning({
                            content: "请选择相同客户生成销售出库单！"
                        })
                        break
                    } else {
                        if (orders[0].goodsType != orders[item].goodsType) {
                            This.$Modal.warning({
                                content: "请选择相同商品类型生成销售出库单！"
                            })
                            break
                        }
                    }
                }
            }
            $.ajax({
                type: 'POST',
                url: contextPath + '/tsaleoutstockwait/save',
                data: JSON.stringify(This.selected),
                contentType: 'application/json',
                success: function (result) {
                    console.log(result);
                    if (result.code == '100100') {
                        // This.conversionData(result.data)
                       // let data =  Object.assign(result.data,This.goldPriceList,This.wareHouseList, This.areaInit)
                        vm.jump(result.data, 'wait')
                    } else {
                        This.$Modal.warning({
                            content: result.msg
                        })
                    }
                },
                error: function (err) {
                    This.$Modal.error({
                        content: "系统出现异常,请联系管理人员"
                    });
                },
            })
        },
        conversionData(data){
           //循环 商品分录行list
            data.map(item =>{
                //计算总金额

                //循环商品分录行的明细list
                let deailList = item.tSaleBarcodeGoodsEntityVoList;
                if(deailList.length > 0){
                    deailList.map(d=>{
                        let goodsEntity = {
                                countingUnitId:d.countingUnitId,
                                goodsNo: d.goodsNo,
                                goodsName:d.goodsName,
                                batchNum: d.batchNum,
                                countingUnitName: d.countingUnitName,
                                num: '1',
                                weightUnitName: d.weightUnitName,
                                totalWeight:d.totalWeight,
                                netGoldWeight: d.netGoldWeight,
                                mainStoneWeight: d.mainStoneWeight,
                                certificateNo: d.certificateNo,
                                certificateType: d.certificateType,
                                purchaseCost: d.purchaseCost,
                                detailMark: d.detailMark

                        }
                        d['goodsEntity'] = goodsEntity;
                    })
                }
            })


        },
        refresh() {
            console.log("进刷新了。。。")
            this.reload = !this.reload
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
        changeCategory(e) {
            console.log(e);
            this.body.goodsType = e[e.length - 1];
        },
    },
    created() {
        this.loadProductType();
    },
    mounted() {
        this.openTime = window.parent.params.openTime;
    },


})