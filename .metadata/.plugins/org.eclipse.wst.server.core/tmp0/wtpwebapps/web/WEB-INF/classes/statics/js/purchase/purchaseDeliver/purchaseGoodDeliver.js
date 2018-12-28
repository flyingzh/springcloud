var purchaseGoodDeliver = new Vue({
    el: '#purchaseGoodDeliver',
    data() {
        let This = this;
        return {
            //商品明细
            productDetailModal: {
                showModal: false,
                ids: {
                    goodsId: '',
                    commodityId: '',
                    documentType: 'P_APPLY_DELIVER'
                }
            },

            productDetailModal2: {
                showModal: false,
                ids: {
                    goodsId: '',
                    commodityId: '',
                    documentType: 'W_STOCK_IN'
                }
            },

            boeType: 'P_APPLY_DELIVER',

            productTypeList: [],
            productDetailList: [],
            //后台返回的商品list
            purchaseGoodsList: [],
            //业务员
            salesmanList: [],
            salesmanId: null,
            empCode: '',
            salesmanName: '',
            supplierName: '',

            //物流方式
            deliveryType: [],
            logisticsMode: '',

            //按钮控制
            isSaveDisable: false,
            isSubmitDisable: false,
            isAddDisable: true,
            isSourceEdit: false,
            isDelDisable: false,

            isLogisticsModeDisable: false,
            isSalesManDisable: false,

            isDeliverGoodsWeightDisable: false,
            isDeliverGoodsCountDisable: false,
            isRemarkDisable: false,
            isRead: false,
            isSupplierDisable: false,
            isGoodsCodeDisable: true,

            //选择商品类型
            isHint: true,

            //页签
            selectTab: true,
            selectedIndex1: 0,

            //控制供应商弹窗显示隐藏
            showSupplierModal: false,
            //判断数据来自列表还是新增
            isFromList: false,
            //控制弹窗显示
            modalTrigger: false,

            //判断手动新增点击新增行
            unSourceAdd: false,
            modalType: '',

            //选择供应商
            selectSupplier: '',
            showSupplier: false,

            //审批进度条
            steplist: [],
            approvalTableData: [],

            //仓库
            storageList: [],
            wareHouse: [],
            //库位map
            locationMap: [],

            tabVal: "tab1",

            supplierCode: '',//供应商编码

            unitMap: {},

            supplierId2: null,
            supplierName2: null,
            supplierCode2: null,

            reviewedName: '',
            reviewedDate: null,
            goodsTypeName: '',

            //页面数据绑定
            purchase: {
                id: '',
                dataSources: '',//数据来源
                orderStatus: '',//单据状态
                //基本信息-----------
                businessTypeId: '',//业务类型
                orderNo: '',
                purchaseDate: '',
                goodsTypeName: '',//商品类型
                goodsGroupPath: '',//商品类型路径
                organizationId: '',
                salesmanName: '',
                supplierId: '',//供应商ID
                supplierCode: '',//供应商编码
                supplierName: '',//供货方名称
                defaultContact: '',//供货方联系人
                phone: '',//手机
                concreteAddress: '',//地址
                commodityId: '',//商品ID
                //其他----------
                createName: '',
                createTime: '',
                updateName: '',
                updateTime: '',
                auditor: '',
                auditTime: '',
                // 采购数量，采购重量合计
                purchaseCount: '',
                purchaseWeight: '',
                //明细信息----------
                goodList: [],
                delGoodIds: []

            },

            codeTabs: 'tab1',

            //页面数据绑定
            applyOrder: {
                "goodList": [],
                "applyCount": '',
                "applyWeight": '',
                "orderStatus": 1,
                "remark": '',
                "applyUserId": '',
                "delGoodIds": [],
                "organizationId": '',
                "updateId": '',
                "applyDeptId": '',
                "limit": '',
                "startTime": '',
                "id": '',
                "orderNo": '',
                "estimatePurchaseMoney": '',
                "estimatePurchaseDate": '',
                "auditor": '',
                "updateTime": '',
                "updateName": '',
                "version": '',
                "goodsType": '',
                "applyUserName": '',
                "auditorId": '',
                "createTime": '',
                "goodsTypeId": '',
                "applyDeptName": '',
                "auditTime": '',
                "createId": '',
                "endTime": '',
                "applyDate": '',
                "isDel": 1,
                "createName": '',
                "goodsGroupPath": ''

            },
            //页面数据绑定
            purchaseDeliverEntitys: {//采购送料单
                orderStatus: 1, //单据状态是暂存
                orderNo: '',
                goodsBarcodeId: null,
                goodsBarcode: '',
                deliveryName: '', //业务员Name
                deliveryDate: this.getNowDate(),
                supplierId: this.supplierId,
                goodsTypePath: '',
                goodsTypeName: '',
                deliverWeight: 0.0,
                deliverCount: 0.0,
                dataSource: 2,
                delStatus: 1,
                logisticsMode: '',
                reviewedName: '',
                reviewedDate: null,
                createId: null,
                createName: '',
                updateId: null,
                businessType: 1,
                updateName: '',
                createTime: this.getNowDate(),
                updateTime: this.getNowDate(),
                organizationId: window.parent.userInfo.organId,
                isSave: false,
                isSubmit: false,
                isPurchaseDeliverType: false,
                salesmanId: 1,
                salesmanName: '',
                purchaseGoodsList: []
            },
            selectedIndex: 0,//明细信息选中行高亮
            // selectedIndex: 0,

            count2: 0,
            weight2: 0,
            totalWeight: 0.0,
            transferGoodsNum: 0.0,
            testTotalWeight: 0.0,
            testTransferGoodsNum: 0.0,
            remark: '',
            deliveryName: '',
            username: window.parent.userInfo.username,
            deliveryDate: null,
            createTime: null,
            updateTime: null,
            isEdit3: false,
            isSave: true,

            createName: null,
            updateName: null,

            auditor: null,
            auditTime: null,

            typeValue: '',
            isMyTable2: true,
            goodlist: [],
            goodlist2: [],
            configList: [{documentNo: ''}],
            isChangeTransferGoodsNum: false,
            isChangeTotalWeight: false,

            sourceType: {

                "销售出仓": "调拨单-销售出仓",


                "采购退库": "调拨单-采购退库",


                "采购送料": "调拨单-采购送料",


                "采购料结": "调拨单-采购料结",


                "受托加工送料": "调拨单-受托加工送料",


                "受托加工退料": "调拨单-受托加工退料"
            },

            goodsTypeId: {
                "1": "金料",
                "2": "石料",
                "3": "配件",
            },

            supplierId: null,

            /*supplierId:{
                "1":"星光",
                "2":"思达",
                "3":"月亮",
            },*/

            selected: [],
            openTime: '',
            isSearchHide: true, //搜索栏
            isTabulationHide: true, // 列表
            isFirstData: false, //搜索栏
            isLastData: false, //搜索栏
            isHide: true,
            orgName: "",
            selected: [],

            needReload: false,


            //测试
            deliverId: null,
            //保存跳转带过来的id
            deliverId2: '',

            deliverOrderNo: null,
            isShow: false,

            docType: [],
            dataValue: [],
            categoryType: [],
            commodityCategoty: [],
            reload: false,

            testBusinessType: null,
            testSupplierId: null,
            testGoodsTypeId: null,

            deptList: [],//部门
            unitList: [],//单位
            productDetailList: [{options: []}],
            productDetailListTemp: {
                goodsEntities: [],
            },
            productDetailAttr: {
                goldBoms: [],
                stonesBoms: [],
                partBoms: [],
                assistAttrs: [],
                stoneHeader: ['颜色', '净度', '分段', '形状', '切工', '荧光', '奶色', '咖色'],
                goldHeader: [],
                partHeader: [],
                assistAttrsHeader: []
            },
            productDetailAttrTemp: null,
            // selectedIndex: null,//明细信息选中行高亮
            needReload: false,
            //控制商品明细属性显示隐藏
            showProductProperty: false,
            //启用多级审核时单据上的操作——审核
            approveComment: false,
            //启用多级审核时单据上的操作—-驳回
            rejectComment: false,
            //审批数据绑定
            approvement: {
                receiptsId: '',
                approvalResult: '1',
                approvalInfo: '',
            },
            //驳回数据绑定
            rejectement: {
                receiptsId: '',
                approvalResult: '0',
                approvalInfo: '',
            },


            confirmConfig: {
                showConfirm: false,
                title: '提示',
                content: '请点击确认',
                onlySure: true,
                success: true
            },

            /* searchBody:{
                 code:'',
                 name:'',
                 datatypeName:''
             },*/

            body: {

                //first
                goodsTypeId: null,
                documentNo: '',

                //last
                goodsType: '',
                supplierId: null,
                startTime: '',
                endTime: '',
                orderStatus: null,
                orderNo: '',


            },

            //审批信息
            data_config_approval: {
                url: '',
                colNames: ['操作类型', '开始级次', '目的级次', '审批人', '审批意见', '审批时间'],
                colModel: [
                    {
                        name: 'approvalResult', width: 200, align: "left",
                        formatter: function (value, grid, rows, state) {
                            return value == 1 ? "审核" : "驳回";
                        }
                    },
                    {
                        name: 'currentLevel', width: 200, align: "left",
                        formatter: function (value, grid, rows, state) {
                            return value === 0 ? "开始" : value === 1 ? "一级审核" : value === 2 ?
                                "二级审核" : value === 3 ? "三级审核" : value === 4 ?
                                    "四级审核" : value === 5 ? "五级审核" : value === 6 ?
                                        "六级审核" : "结束";
                        }
                    },
                    {
                        name: 'nextLevel', width: 200, align: "left",
                        formatter: function (value, grid, rows, state) {
                            if (rows.approvalResult === -1 || (rows.approvalResult === 0 && rows.nextLevel === undefined)) {
                                return "开始";
                            }
                            return value === "0" ? "开始" : value === "1" ? "一级审核" : value === "2" ?
                                "二级审核" : value === "3" ? "三级审核" : value === "4" ?
                                    "四级审核" : value === "5" ? "五级审核" : value === "6" ?
                                        "六级审核" : "结束";
                        }
                    },
                    {name: 'createName', width: 200, align: "left"},
                    {name: 'approvalInfo', width: 220, align: "left"},
                    {name: 'createTime', width: 250, align: "left"}
                ],
                jsonReader: {
                    root: "data.data"
                },
                multiselect: false
            },
            //审批进度条
            steplist: [],
            stepData: [
                {
                    currentLevel: 0,
                    subtitle: '开始'
                },
                {
                    currentLevel: 1,
                    subtitle: '一级审批'
                },
                {
                    currentLevel: 2,
                    subtitle: '二级审批'
                },
                {
                    currentLevel: 3,
                    subtitle: '三级审批'
                },
                {
                    currentLevel: 4,
                    subtitle: '四级审批'
                },
                {
                    currentLevel: 5,
                    subtitle: '五级审批'
                },
                {
                    currentLevel: 6,
                    subtitle: '六级审批'
                },
                {
                    currentLevel: 7,
                    subtitle: '结束'
                },
            ],
            currentStep: '',
            nextStep: '',

        }
    },

    methods: {

        //此处三个方法是附件组件 只需要直接copy即可
        //附件是编辑还是查看 传入Y表示编辑，传入N表示查看
        // 附件是编辑还是查看 传入Y表示编辑，传入N表示查看,页面初始化的时候就需要调用这个方法
        isEdit: function (isEdit, on) {
            eventHub.$emit('isEdit', isEdit);
        },
        // 保存附件 保存的时候调用
        saveAccess: function (id, type, on) {
            eventHub.$emit('saveFile', id, type);
        },
        // 查找附件 查看的时候调用
        getAccess: function (id, type, on) {
            eventHub.$emit('queryFile', id, type);
        },


        //点击刷新
        refresh() {
            /* this.clear();
             this.search();*/
            window.location.reload();
            /* this.$ztree.getSelectedNodes().length=0;*/
        },

        refresh1() {
            window.location.reload();
        },

        refresh2() {
            window.location.reload();
        },

        refresh3() {
            window.location.reload();

        },


        changeDate(value) {
            this.body.startTime = value[0].replace(/\//g, '-') + ' 00:00:00';
            this.body.endTime = value[1].replace(/\//g, '-') + ' 23:59:59';
        },

        changeDeliveryDate(value) {
            this.body.startTime = value[0].replace(/\//g, '-') + ' 00:00:00';
            this.body.endTime = value[1].replace(/\//g, '-') + ' 23:59:59';
        },

        hideSearch() {
            this.isHide = !this.isHide;
            this.isSearchHide = !this.isSearchHide;
            $(".chevron").css("top", "")
        },
        hidTabulation() {
            this.isHide = !this.isHide;
            this.isTabulationHide = !this.isTabulationHide;
            if (!this.isTabulationHide) {
                $(".chevron").css("top", "83%")
            } else {
                $(".chevron").css("top", "")
            }
        },

        initApproval(value) {
            let This = this;
            $.ajax({
                type: "post",
                // url: './processlevel.json',
                data: {},
                dataType: "json",
                success: function (data) {
                    var process = data.data.list;
                    for (let i = 0; i < process.length; i++) {
                        switch (process[i].processLevel) {
                            case 1:
                                process[i].processLevel = '一级审核';
                                break;
                            case 2:
                                process[i].processLevel = '二级审核';
                                break;
                            case 3:
                                process[i].processLevel = '三级审核';
                                break;
                            case 4:
                                process[i].processLevel = '四级审核';
                                break;
                            case 5:
                                process[i].processLevel = '五级审核';
                                break;
                            case 6:
                                process[i].processLevel = '六级审核';
                                break;
                        }
                    }
                    process.unshift(
                        {
                            processLevel: "开始"
                        }
                    );
                    process.push(
                        {
                            processLevel: "结束"
                        }
                    );
                    This.steplist = process;
                    if (process[1].currentLevel === data.data.levelLength) {
                        for (let i = 0; i < process.length; i++) {
                            process[i].currentLevel = process.length - 1;
                        }
                        return false;
                    }
                    var curr = process[1].currentLevel;
                    for (let i = 0; i < This.stepData.length; i++) {
                        if (curr === This.stepData[i].currentLevel) {
                            This.currentStep = This.stepData[i + 1].subtitle;
                            if (This.stepData[i + 1].currentLevel === data.data.levelLength) {
                                This.nextStep = This.stepData[This.stepData.length - 1].subtitle;
                            } else {
                                This.nextStep = This.stepData[i + 2].subtitle;
                            }
                        }
                    }

                },
                /* error: function () {
                     debugger;
                    layer.alert('服务器出错啦');
                 }*/
            })
        },
        //新增
        add() {

        },

        //保存
        save(type) {
            //点击了保存后保存和提交按钮置灰
            purchaseGoodDeliver.isSubmitDisable = true;
            purchaseGoodDeliver.isSaveDisable = true;

            //保存暂时不校验字段
            let purchaseDeliverEntity = { // 采购送料单
                orderStatus: 1, //单据状态是暂存
                orderNo: '',
                salesmanId: purchaseGoodDeliver.empCode,
                salesmanName: this.getSalesmanByEmpCode(this.empCode), //业务员Name
                deliveryDate: this.getNowDate(),
                supplierId: this.supplierId,
                supplierName: this.supplierName,
                goodsTypePath: '', //商品类型路径
                goodsTypeName: '', //商品类型名称
                deliverWeight: 0.0,
                deliverCount: 0.0,
                dataSource: 2, //2、上游生成
                delStatus: 1,
                businessType: 1,
                logisticsMode: '',
                businessStatus: 1,
                createId: null,
                createName: '',
                createTime: this.getNowDate(),
                updateId: null,
                updateName: '',
                updateTime: this.getNowDate(),
                organizationId: window.parent.userInfo.organId,
                isSave: true,
                isSubmit: false,
                isPurchaseDeliverType: false,

                purchaseGoodsList: []
            };
            let count = 0;
            let weight = 0;
            let goodlist = this.goodlist;
            for (let i = 0; i < goodlist.length; i++) {
                let obj2 = {};
                //计重单位
                obj2.countingUnit = goodlist[i].countingUnit;
                //金重？
                obj2.goldWeight = goodlist[i].goldWeight;
                //条码？
                obj2.goodsBarcode = goodlist[i].goodsBarcode;

                //商品编码
                obj2.goodsCode = goodlist[i].goodsCode;
                //商品名称
                obj2.goodsName = goodlist[i].goodsName;
                //goodsNorm 规格
                obj2.goodsTypeName = goodlist[i].goodsTypeName;
                //organizationId
                // obj2.organizationId = goodlist[i].organizationId;
                //商品图片
                obj2.pictureUrl = goodlist[i].pictureUrl;
                //pricingUnit 计价单位id
                //obj2.goodesName = goodlist[i].pricingUnit;

                //源单id
                obj2.sourceId = goodlist[i].requisitionId;
                //源单编号
                obj2.sourceNo = goodlist[i].transferNo;
                //源单类型
                obj2.sourceType = goodlist[i].sourceType;
                //成本
                //obj2.totalCost = goodlist[i].totalCost;

                //调入库位
                //obj2.transferInPositionId = goodlist[i].transferInPositionId;
                //调出仓库
                //obj2.transferInWarehouse = goodlist[i].transferInWarehouse;

                //库位id
                obj2.reservoirPositionId = goodlist[i].transferOutPositionId;
                //仓库id
                obj2.warehouseId = goodlist[i].transferOutWarehouse;
                //计数单位
                obj2.countingUnit = goodlist[i].unitCost;
                //计重单位
                obj2.weightUnit = goodlist[i].weightUnit;

                //商品主类型
                obj2.goodsMainType = goodlist[i].goodsMainType;

                //三个修改字段
                //备注
                obj2.remark = goodlist[i].remark;
                //送货重量
                obj2.deliverGoodsWeight = (goodlist[i].deliverGoodsWeight) * 1;
                weight += obj2.deliverGoodsWeight;
                //送料数量
                obj2.deliverGoodsCount = (goodlist[i].deliverGoodsCount) * 1;
                count += obj2.deliverGoodsCount;
                //对应商品明细字段
                //石分段
                obj2.stoneSection = '';
                //金料成色
                obj2.goldColor = '';
                //石颜色
                obj2.stoneColor = '';
                //石净度
                obj2.stoneClarity = '';
                //主石重
                obj2.mainStoneWeight = '';
                //副石重
                obj2.viceStoneWeight = '';
                //金重
                obj2.goldWeight = '';
                //商品分录行编号（订单编号+商品分录序号）
                obj2.goodsLineNo = '';
                purchaseDeliverEntity.purchaseGoodsList.push(obj2);

            }

            //源单跳转修改页面保存
            if (purchaseGoodDeliver.isSourceEdit == true) {
                purchaseDeliverEntity = purchaseGoodDeliver.purchaseDeliverEntitys;
                purchaseDeliverEntity.purchaseGoodsList = this.goodlist;
                purchaseDeliverEntity.salesmanId = purchaseGoodDeliver.empCode;
                purchaseDeliverEntity.supplierId = this.supplierId;
                purchaseDeliverEntity.supplierName = this.supplierName;
            }

            //商品类型路径名称
            purchaseDeliverEntity.goodsTypeName = this.goodlist[0].goodsTypeName;

            //商品类型路径
            purchaseDeliverEntity.goodsTypePath = this.goodlist[0].goodsTypePath;

            //物流方式code
            purchaseDeliverEntity.logisticsMode = this.logisticsMode;
            //业务员名称
            purchaseDeliverEntity.salesmanName = this.salesmanName;
            //送料总数量
            purchaseDeliverEntity.deliverCount = count;
            //送料总重量
            purchaseDeliverEntity.deliverWeight = weight;


            $.ajax({
                type: "POST",
                url: "/web/purchaseDeliverController/add",
                contentType: 'application/json',
                data: JSON.stringify(purchaseDeliverEntity),
                success: function (result) {
                    console.log(result.code);
                    if (result.code == "100100") {
                        layer.alert('保存数据成功', {icon: 1});
                        //删除行按钮置灰
                        purchaseGoodDeliver.isDelDisable = true;
                        purchaseGoodDeliver.isEdit('N');
                        Object.assign(purchaseGoodDeliver.purchaseDeliverEntitys, result.data.data.data);
                        let orderNo = purchaseGoodDeliver.purchaseDeliverEntitys.orderNo;
                        purchaseGoodDeliver.updateName = purchaseGoodDeliver.purchaseDeliverEntitys.updateName;
                        purchaseGoodDeliver.updateTime = purchaseGoodDeliver.purchaseDeliverEntitys.updateTime;
                        // 调用方法保存附件
                        purchaseGoodDeliver.saveAccess(purchaseGoodDeliver.purchaseDeliverEntitys.orderNo, purchaseGoodDeliver.boeType);

                    } else {
                        layer.alert('保存数据失败', {icon: 0});
                    }
                },
                error: function (err) {
                    alert(err);
                },
            })
            /*let data = {
                "goodList": [JSON.parse(JSON.stringify(obj))]
            };*/
        },

        //下单点击提交
        submit() {
            let flag = false;
            let purchaseDeliverEntity = { //采购送料单
                orderStatus: 2, //单据状态是待审核
                orderNo: '',
                salesmanId: purchaseGoodDeliver.empCode,
                salesmanName: this.getSalesmanByEmpCode(this.empCode), //业务员Name
                deliveryDate: this.getNowDate(),
                supplierId: this.supplierId,
                supplierName: this.supplierName,
                goodsTypePath: '',
                goodsTypeName: '',
                deliverWeight: 0.0,
                deliverCount: 0.0,
                dataSource: 2,
                delStatus: 1,
                logisticsMode: '',
                businessType: 1,
                businessStatus: 1,
                createId: null,
                createName: '',
                updateId: null,
                updateName: '',
                isSave: false,
                isSubmit: true,
                createTime: null,
                updateTime: null,
                organizationId: window.parent.userInfo.organId,
                purchaseGoodsList: []
            };

            let requisitionGoodsEntity = [];

            let count = 0;
            let weight = 0;

            let count2 = 0;
            let weight2 = 0;

            let goodlist = this.goodlist;

            let requisitionEntityList = [];
            let requisitionGoods = [];

            for (let i = 0; i < goodlist.length; i++) {
                let obj2 = {};
                let obj3 = {};
                let requisitionEntity = {};
                //计重单位
                obj2.countingUnit = goodlist[i].countingUnit;
                //金重？
                obj2.goldWeight = goodlist[i].goldWeight;
                //条码？
                obj2.goodsBarcode = goodlist[i].goodsBarcode;
                //商品编码
                obj2.goodsCode = goodlist[i].goodsCode;
                //商品名称
                obj2.goodsName = goodlist[i].goodsName;
                //goodsNorm 规格
                obj2.goodsTypeName = goodlist[i].goodsTypeName;
                //organizationId
                // obj2.organizationId = goodlist[i].organizationId;
                //商品图片
                obj2.pictureUrl = goodlist[i].pictureUrl;
                //pricingUnit 计价单位id
                //obj2.goodesName = goodlist[i].pricingUnit;
                //源单id
                obj2.sourceId = goodlist[i].requisitionId;
                //源单编号
                obj2.sourceNo = goodlist[i].transferNo;
                //源单类型
                obj2.sourceType = goodlist[i].sourceType;
                //成本
                //obj2.totalCost = goodlist[i].totalCost;

                //调入库位
                //obj2.transferInPositionId = goodlist[i].transferInPositionId;
                //调出仓库
                //obj2.transferInWarehouse = goodlist[i].transferInWarehouse;

                //库位id
                obj2.reservoirPositionId = goodlist[i].transferOutPositionId;
                //仓库id
                obj2.warehouseId = goodlist[i].transferOutWarehouse;
                //计数单位
                obj2.countingUnit = goodlist[i].unitCost;
                //计重单位
                obj2.weightUnit = goodlist[i].weightUnit;

                //商品主类型
                obj2.goodsMainType = goodlist[i].goodsMainType;

                //三个修改字段
                //备注
                obj2.remark = this.remark;
                //送货重量
                obj2.deliverGoodsWeight = (goodlist[i].deliverGoodsWeight) * 1;
                weight += obj2.deliverGoodsWeight;
                //送料数量
                obj2.deliverGoodsCount = (goodlist[i].deliverGoodsCount) * 1;
                count += obj2.deliverGoodsCount;
                //对应商品明细字段
                //石分段
                obj2.stoneSection = '';
                //金料成色
                obj2.goldColor = '';
                //石颜色
                obj2.stoneColor = '';
                //石净度
                obj2.stoneClarity = '';
                //主石重
                obj2.mainStoneWeight = '';
                //副石重
                obj2.viceStoneWeight = '';
                //金重
                obj2.goldWeight = '';
                //商品分录行编号（订单编号+商品分录序号）
                obj2.goodsLineNo = '';

                purchaseDeliverEntity.purchaseGoodsList.push(obj2);

                obj3.transferNo = goodlist[i].transferNo;
                requisitionGoodsEntity.push(obj3);
            }

            //源单跳转修改页面提交
            if (purchaseGoodDeliver.isSourceEdit == true) {
                purchaseDeliverEntity = purchaseGoodDeliver.purchaseDeliverEntitys;
                purchaseDeliverEntity.purchaseGoodsList = this.goodlist;
                purchaseDeliverEntity.salesmanId = purchaseGoodDeliver.empCode;
                purchaseDeliverEntity.supplierId = this.supplierId;
                purchaseDeliverEntity.supplierName = this.supplierName;
                purchaseDeliverEntity.isSubmit = true;
            }

            purchaseDeliverEntity.orderStatus = 2; //单据类型变为待审核

            //商品类型路径名称
            purchaseDeliverEntity.goodsTypeName = this.goodlist[0].goodsTypeName;

            //商品类型路径
            purchaseDeliverEntity.goodsTypePath = this.goodlist[0].goodsTypePath;

            //物流方式code
            purchaseDeliverEntity.logisticsMode = this.logisticsMode;
            //业务员名称
            purchaseDeliverEntity.salesmanName = this.salesmanName;
            //送料总数量
            purchaseDeliverEntity.deliverCount = count;
            //送料总重量
            purchaseDeliverEntity.deliverWeight = weight;

            let goodlist2 = purchaseGoodDeliver.goodlist2;

            let a = null;

            //上游单据需要判断重量和数量
            if (purchaseDeliverEntity.dataSource == 2) {
                for (let i = 0; i < goodlist2.length; i++) {
                    var obj1 = goodlist2[i].goodsBarcode;
                    for (let j = 0; j < goodlist.length; j++) {
                        var obj2 = goodlist[j].goodsBarcode;
                        if (obj1 == obj2) {
                            if (purchaseGoodDeliver.isSourceEdit == false) {
                                this.testTransferGoodsNum = (goodlist2[i].transferGoodsNum) * 1;
                                this.testTotalWeight = (goodlist2[i].totalWeight) * 1;
                            }
                            if (purchaseGoodDeliver.isSourceEdit == true) {
                                this.testTransferGoodsNum = (goodlist2[i].deliverGoodsCount) * 1;
                                this.testTotalWeight = (goodlist2[i].deliverGoodsWeight) * 1;
                            }
                            a = this.goodlist[j];
                            let number = (a.deliverGoodsCount) * 1,
                                //   n = /^[+]?[0-9]+(\.[0-9]+)?$/;
                                n = /^[1-9]\d*$/;
                            if (!n.test(number)) {
                                layer.alert('第' + (j + 1) + '行请正确输入！！');
                                this.isSave = false;
                                return;
                            }
                            if (number > this.testTransferGoodsNum) {
                                layer.alert('第' + (j + 1) + '行送料数量不能大于调拨单原始数量！！');
                                this.isSave = false;
                                return;
                            }

                            let num = (a.deliverGoodsWeight) * 1;

                            n = /^[+]?[0-9]+(\.[0-9]+)?$/;
                            if (!n.test(num)) {
                                layer.alert('第' + (j + 1) + '行请正确输入！！');
                                this.isSave = false;
                                return;
                            }
                            if (num > this.testTotalWeight) {
                                layer.alert('第' + (j + 1) + '行送料数量不能大于调拨单原始重量！！');
                                this.isSave = false;
                                return;
                            }
                        }

                    }
                }
            }

            //提交判断供应商、业务员、物流方式是否已选择
            if (purchaseDeliverEntity.supplierName == null || purchaseDeliverEntity.supplierName == '') {
                layer.alert('供应商未选择!');
                return;
            }

            if (purchaseDeliverEntity.salesmanName == null || purchaseDeliverEntity.salesmanName == '') {
                layer.alert('业务员未选择!');
                return;
            }
            if (purchaseDeliverEntity.logisticsMode == null || purchaseDeliverEntity.logisticsMode == '') {
                layer.alert('物流方式未选择!');
                return;
            }

            if (flag == false) {
                //查询原调拨单作对比看看是否是分批送料
                flag = true;
            }
            if (flag == true) {
                //判断是否分批送料标志
                if (purchaseDeliverEntity.deliverCount == purchaseGoodDeliver.weight2 &&
                    purchaseDeliverEntity.deliverWeight == purchaseGoodDeliver.transferGoodsNum) {
                    purchaseDeliverEntity.isPurchaseDeliverType = true;
                }
                else {
                    purchaseDeliverEntity.isPurchaseDeliverType = false;
                }

                //提交数据
                $.ajax({
                    type: "POST",
                    url: "/web/purchaseDeliverController/submit",
                    contentType: 'application/json',
                    data: JSON.stringify(purchaseDeliverEntity),
                    success: function (result) {
                        console.log(result.code);
                        if (result.code == "100100") {
                            layer.alert('提交数据成功', {icon: 1});
                            //点击了提交后保存和提交按钮置灰
                            purchaseGoodDeliver.isSubmitDisable = true;
                            purchaseGoodDeliver.isSaveDisable = true;
                            purchaseGoodDeliver.isDelDisable = true;
                            purchaseGoodDeliver.isSalesManDisable = true;
                            purchaseGoodDeliver.isLogisticsModeDisable = true;
                            purchaseGoodDeliver.isDeliverGoodsWeightDisable = true;
                            purchaseGoodDeliver.isDeliverGoodsCountDisable = true;
                            purchaseGoodDeliver.isRemarkDisable = true;
                            purchaseGoodDeliver.isEdit('N');

                            // Object.assign(this.purchaseDeliverEntity, {...data.data});
                            Object.assign(purchaseGoodDeliver.purchaseDeliverEntitys, result.data.data.data);
                            let orderNo = purchaseGoodDeliver.purchaseDeliverEntitys.orderNo;
                            purchaseGoodDeliver.updateName = purchaseGoodDeliver.purchaseDeliverEntitys.updateName;
                            purchaseGoodDeliver.updateTime = purchaseGoodDeliver.purchaseDeliverEntitys.updateTime;
                            // 调用方法保存附件
                            purchaseGoodDeliver.saveAccess(purchaseGoodDeliver.purchaseDeliverEntitys.orderNo, purchaseGoodDeliver.boeType);

                        } else {
                            layer.alert('提交数据失败', {icon: 0});
                        }
                    },
                    error: function (err) {
                        alert(err);
                    },
                })
            }
            /*let data = {
                "goodList": [JSON.parse(JSON.stringify(obj))]
            };*/
        },

        //手动新增的单在页面保存
        unSourceSave() {
            let purchaseDeliverEntity = {//采购送料单
                id: purchaseGoodDeliver.deliverId,
                orderStatus: 1, //单据状态是暂存
                orderNo: purchaseGoodDeliver.deliverOrderNo,
                salesmanId: purchaseGoodDeliver.empCode,
                salesmanName: this.getSalesmanByEmpCode(this.empCode), //业务员Name
                deliveryDate: this.getNowDate(),
                supplierId: this.supplierId2,
                supplierName: this.supplierName2,
                goodsTypePath: '',
                goodsTypeName: '',
                deliverWeight: 0.0,
                deliverCount: 0.0,
                dataSource: 1, //手动新增
                delStatus: 1,
                logisticsMode: '',
                businessStatus: 1,
                createId: null,
                createName: window.parent.userInfo.organName,
                createTime: this.getNowDate(),
                updateId: null,
                updateName: '',
                updateTime: this.getNowDate(),
                isPurchaseDeliverType: false,
                organizationId: window.parent.userInfo.organId,
                isSave: false,
                isSubmit: false,
                purchaseGoodsList: []
            };

            let count = 0;
            let weight = 0;
            let goodlist = this.goodlist;
            let handlerDataToPost = this.handlerDataToPost();
            for (let i = 0; i < goodlist.length; i++) {
                let obj2 = {};
                //三个修改字段
                //备注
                let a = this.goodlist[i];
                obj2.remark = goodlist[i].remark;
                //送货重量
                obj2.deliverGoodsWeight = (goodlist[i].deliverGoodsWeight) * 1;
                weight += obj2.deliverGoodsWeight;
                //送料数量
                obj2.deliverGoodsCount = (goodlist[i].deliverGoodsCount) * 1;
                count += obj2.deliverGoodsCount;

                obj2.sourceNo = goodlist[i].sourceNo;

                obj2.warehouseId = goodlist[i].warehouseId;

                obj2.reservoirPositionId = goodlist[i].reservoirPositionId;

                obj2.goodsTypeName = goodlist[i].goodsTypeName;


                obj2.goodsTypeName = this.typeValue;
                //对应商品明细字段
                //石分段
                /*obj2.stoneSection = '';
                //金料成色
                obj2.goldColor = '';
                //石颜色
                obj2.stoneColor = '';
                //石净度
                obj2.stoneClarity = '';
                //主石重
                obj2.mainStoneWeight = '';
                //副石重
                obj2.viceStoneWeight = '';
                //金重
                obj2.goldWeight = '';
                //商品分录行编号（订单编号+商品分录序号）
                obj2.goodsLineNo = '';*/
                purchaseDeliverEntity.purchaseGoodsList = this.goodlist;

            }

            /* //源单跳转修改页面提交
             if(purchaseGoodDeliver.isSourceEdit==true){
                 purchaseDeliverEntity=purchaseGoodDeliver.purchaseDeliverEntitys;
                 purchaseDeliverEntity.purchaseGoodsList = this.goodlist;
                 purchaseDeliverEntity.salesmanId = purchaseGoodDeliver.empCode;
                 purchaseDeliverEntity.supplierId = this.supplierId;
                 purchaseDeliverEntity.supplierName = this.supplierName;
                 purchaseDeliverEntity.isSubmit = true;
             }*/

            if (purchaseDeliverEntity.purchaseGoodsList.length == 0) {
                layer.alert('请先新增商品信息!');
                return;
            }

            //物流方式code
            purchaseDeliverEntity.logisticsMode = this.logisticsMode;
            //业务员名称
            purchaseDeliverEntity.salesmanName = this.salesmanName;
            //送料总数量
            purchaseDeliverEntity.deliverCount = count;
            //送料总重量
            purchaseDeliverEntity.deliverWeight = weight;

            purchaseDeliverEntity.goodsTypeName = this.purchaseDeliverEntitys.goodsTypeName;
            purchaseDeliverEntity.goodsTypePath = this.purchaseDeliverEntitys.goodsTypePath;

            $.ajax({
                type: "POST",
                url: "/web/purchaseDeliverController/add",
                contentType: 'application/json',
                data: JSON.stringify(purchaseDeliverEntity),
                success: function (result) {
                    console.log(result.code);
                    if (result.code == "100100") {
                        layer.alert('保存数据成功', {icon: 1});
                        //点击了提交后保存和提交按钮置灰
                        purchaseGoodDeliver.isSubmitDisable = true;
                        purchaseGoodDeliver.isSaveDisable = true;

                        Object.assign(purchaseGoodDeliver.purchaseDeliverEntitys, result.data.data.data);
                        let orderNo = purchaseGoodDeliver.purchaseDeliverEntitys.orderNo;
                        purchaseGoodDeliver.updateName = purchaseGoodDeliver.purchaseDeliverEntitys.updateName;
                        purchaseGoodDeliver.updateTime = purchaseGoodDeliver.purchaseDeliverEntitys.updateTime;
                        // 调用方法保存附件
                        purchaseGoodDeliver.saveAccess(purchaseGoodDeliver.purchaseDeliverEntitys.orderNo, purchaseGoodDeliver.boeType);
                    } else {
                        layer.alert('保存数据失败', {icon: 0});
                    }
                },
                error: function (err) {
                    alert(err);
                },
            })
        },

        //手动新增的单在页面提交
        unSourceSubmit() {
            let purchaseDeliverEntity = {//采购送料单
                id: purchaseGoodDeliver.deliverId,
                orderStatus: 2, //单据状态是待审核
                orderNo: purchaseGoodDeliver.deliverOrderNo,
                salesmanId: purchaseGoodDeliver.empCode,
                salesmanName: this.getSalesmanByEmpCode(this.empCode), //业务员Name
                deliveryDate: this.getNowDate(),
                supplierId: this.supplierId2,
                supplierName: this.supplierName2,
                goodsTypePath: '',
                goodsTypeName: '',
                deliverWeight: 0.0,
                deliverCount: 0.0,
                dataSource: 1, //手动新增
                delStatus: 1,
                logisticsMode: '',
                businessStatus: 1,
                createId: null,
                createName: window.parent.userInfo.organName,
                createTime: this.getNowDate(),
                updateId: null,
                updateName: '',
                updateTime: this.getNowDate(),
                isPurchaseDeliverType: false,
                organizationId: window.parent.userInfo.organId,
                isSave: false,
                isSubmit: true,
                purchaseGoodsList: []
            };
            let flag = false;
            let count = 0;
            let weight = 0;
            let goodlist = this.goodlist;
            let requisitionGoodsEntity = [];

            for (let i = 0; i < goodlist.length; i++) {
                let obj2 = {};
                //三个修改字段
                //备注
                let a = this.goodlist[i];
                obj2.remark = this.remark;
                //送货重量
                obj2.deliverGoodsWeight = (goodlist[i].deliverGoodsWeight) * 1;
                weight += obj2.deliverGoodsWeight;
                //送料数量
                obj2.deliverGoodsCount = (goodlist[i].deliverGoodsCount) * 1;
                count += obj2.deliverGoodsCount;
                //对应商品明细字段
                //石分段
                /*obj2.stoneSection = '';
                //金料成色
                obj2.goldColor = '';
                //石颜色
                obj2.stoneColor = '';
                //石净度
                obj2.stoneClarity = '';
                //主石重
                obj2.mainStoneWeight = '';
                //副石重
                obj2.viceStoneWeight = '';
                //金重
                obj2.goldWeight = '';
                //商品分录行编号（订单编号+商品分录序号）
                obj2.goodsLineNo = '';*/
                purchaseDeliverEntity.purchaseGoodsList = this.goodlist;

            }
            //源单跳转修改页面提交
            /*if(purchaseGoodDeliver.isSourceEdit==true){
                purchaseDeliverEntity=purchaseGoodDeliver.purchaseDeliverEntitys;
                purchaseDeliverEntity.purchaseGoodsList = this.goodlist;
                purchaseDeliverEntity.salesmanId = purchaseGoodDeliver.empCode;
                purchaseDeliverEntity.supplierId = this.supplierId;
                purchaseDeliverEntity.supplierName = this.supplierName;
                purchaseDeliverEntity.isSubmit = true;
            }*/


            if (purchaseDeliverEntity.purchaseGoodsList.length == 0) {
                layer.alert('请先新增商品信息!');
                return;
            }

            purchaseDeliverEntity.orderStatus = 2; //单据类型变为待审核

            purchaseDeliverEntity.isSubmit = true;
            //物流方式code
            purchaseDeliverEntity.logisticsMode = this.logisticsMode;
            //业务员名称
            purchaseDeliverEntity.salesmanName = this.salesmanName;
            //送料总数量
            purchaseDeliverEntity.deliverCount = count;
            //送料总重量
            purchaseDeliverEntity.deliverWeight = weight;

            //商品类型路径名称
            purchaseDeliverEntity.goodsTypeName = this.purchaseDeliverEntitys.goodsTypeName;
            //商品类型路径
            purchaseDeliverEntity.goodsTypePath = this.purchaseDeliverEntitys.goodsTypePath;


            //提交判断供应商、业务员、物流方式是否已选择
            if (purchaseDeliverEntity.supplierName == null || purchaseDeliverEntity.supplierName == '') {
                layer.alert('供应商未选择!');
                return;
            }

            if (purchaseDeliverEntity.salesmanName == null || purchaseDeliverEntity.salesmanName == '') {
                layer.alert('业务员未选择!');
                return;
            }
            if (purchaseDeliverEntity.logisticsMode == null || purchaseDeliverEntity.logisticsMode == '') {
                layer.alert('物流方式未选择!');
                return;
            }

            $.ajax({
                type: "POST",
                url: "/web/purchaseDeliverController/submit",
                contentType: 'application/json',
                data: JSON.stringify(purchaseDeliverEntity),
                success: function (result) {
                    console.log(result.code);
                    if (result.code == "100100") {
                        layer.alert('提交数据成功', {icon: 1});
                        //点击了提交后保存和提交按钮置灰
                        purchaseGoodDeliver.isSubmitDisable = true;
                        purchaseGoodDeliver.isSaveDisable = true;
                        purchaseGoodDeliver.isSupplierDisable = true;

                        purchaseGoodDeliver.isLogisticsModeDisable = true;
                        purchaseGoodDeliver.isSalesManDisable = true;


                        Object.assign(purchaseGoodDeliver.purchaseDeliverEntitys, result.data.data.data);
                        let orderNo = purchaseGoodDeliver.purchaseDeliverEntitys.orderNo;
                        purchaseGoodDeliver.updateName = purchaseGoodDeliver.purchaseDeliverEntitys.updateName;
                        purchaseGoodDeliver.updateTime = purchaseGoodDeliver.purchaseDeliverEntitys.updateTime;
                        // 调用方法保存附件
                        purchaseGoodDeliver.saveAccess(purchaseGoodDeliver.purchaseDeliverEntitys.orderNo, purchaseGoodDeliver.boeType);
                    } else {
                        layer.alert('提交数据失败', {icon: 0});
                    }
                },
                error: function (err) {
                    alert(err);
                },
            })
            /*let data = {
                "goodList": [JSON.parse(JSON.stringify(obj))]
            };*/
        },

        //保存'提交
        saveClick(param) {
            console.log(param);
        },

        //审核
        approval(value) {
            let This = this;
            if (purchaseGoodDeliver.purchaseDeliverEntitys.orderStatus == 4) {
                purchaseGoodDeliver.$Modal.warning({
                    title: '提示',
                    content: '单据已审核',
                });
                return;
            }
            This.modalType = 'approve';
            This.modalTrigger = !This.modalTrigger;


        },
        //驳回
        reject() {
            let This = this;
            if (purchaseGoodDeliver.purchaseDeliverEntitys.orderStatus == 4) {
                purchaseGoodDeliver.$Modal.warning({
                    title: '提示',
                    content: '已审核的单据不能驳回!',
                });
                return;
            }
            This.modalType = 'reject';
            This.modalTrigger = !This.modalTrigger;
        },

        //审核或者驳回回调
        approvalOrRejectCallBack(res) {

            let _this = this;
            //  purchaseGoodDeliver.purchaseDeliverEntitys.orderStatus = res.result.data;

            if (res.result.code == '100100') {
                let data = res.result.data;
                purchaseGoodDeliver.purchaseDeliverEntitys.orderStatus = data.orderStatus;
                purchaseGoodDeliver.reviewedName = data.reviewedName;
                purchaseGoodDeliver.reviewedDate = data.reviewedDate;
                //    purchaseGoodDeliver.purchaseDeliverEntitys.orderStatus = res.result.data;
            } else {
                this.$Modal.warning({
                    content: res.result.msg,
                    title: '警告'
                })
            }
        },
        cancel() {  //删除行

        },
        //退出
        exit1() {
            window.parent.closeCurrentTab({name: '采购待送料列表', exit: true, openTime: this.openTime})
        },
        exit2() {
            window.parent.closeCurrentTab({name: '采购送料单', exit: true, openTime: this.openTime})
        },
        exit3() {
            window.parent.closeCurrentTab({name: '采购送料单列表', exit: true, openTime: this.openTime})
        },
        //审批意见点击确定
        getApproveInfo() {

        },
        //驳回点击确定
        getRejectInfo() {



        },

        rowClick(type, index) {  //点击选中行
            let a = this.goodlist[this.selectedIndex];
            console.log(a);
            if (type === 'add' && this.validateProduct()) {
                if(purchaseGoodDeliver.typeValue == ''){
                    layer.alert('请先选择商品类型！');
                    return;
                }

                this.goodlist.push({options: []});
                this.productDetailListTemp.goodsEntities.push({options: []});

                //手动新增标志
                purchaseGoodDeliver.unSourceAdd = true;

                this.goodlist.map((item, index) => {
                    //商品分录行赋值
                    Object.assign(this.goodlist[index], {
                        goodsTypeName: this.purchaseDeliverEntitys.goodsTypeName,//?
                        goodsTypePath: this.purchaseDeliverEntitys.goodsTypePath
                    });
                });

            }
            if (type === 'del') {
                this.goodlist.splice(this.selectedIndex, 1)
                $(".tdInfo").eq(this.selectedIndex).removeClass("ht-selected")
                //   this.productDetailList.splice(this.selectedIndex, 1);
            }
        },

        initGoodCategory(type) {
            let result = [];

            type.forEach((item) => {
                let {
                    customCode: value,
                    name: label,
                    cateLists: children,
                    code: code
                } = item;
                if (children) {
                    children = this.initGoodCategory(children)
                }
                result.push({
                    value,
                    label,
                    children,
                    code
                })
            });

            result.forEach((item) => {
                if (!item.children) {
                    delete item.children;
                }
            });

            return result
        },

        getNowDate() {
            var date = new Date();
            var sign1 = "-";
            var sign2 = ":";
            var year = date.getFullYear() // 年
            var month = date.getMonth() + 1; // 月
            var day = date.getDate(); // 日
            var hour = date.getHours(); // 时
            var minutes = date.getMinutes(); // 分
            var seconds = date.getSeconds() //秒
            /*var weekArr = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'];
            var week = weekArr[date.getDay()];*/
            // 给一位数数据前面加 “0”
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (day >= 0 && day <= 9) {
                day = "0" + day;
            }
            if (hour >= 0 && hour <= 9) {
                hour = "0" + hour;
            }
            if (minutes >= 0 && minutes <= 9) {
                minutes = "0" + minutes;
            }
            if (seconds >= 0 && seconds <= 9) {
                seconds = "0" + seconds;
            }
            var currentdate = year + sign1 + month + sign1 + day + " " + hour + sign2 + minutes + sign2 + seconds;
            return currentdate;
        },


        //选中行
        getIndex(index) {
            this.selectedIndex = index;
            $(".tdInfo").eq(this.selectedIndex).addClass("ht-selected").siblings().removeClass("ht-selected")

        },

        //点击商品明细
        showProductDetail2(index) {
            this.selectedIndex = index;
            if (!this.productDetailListTemp.goodsEntities[index].goodsBarcodeId) {
                this.$Modal.error({
                    content: '还未选择商品，请先选择商品，再选择明细！',
                });
                return false;
            }

            //固定开始
            alert("this.goodlist[index].goodsBarcodeId==="+this.goodlist[index].goodsBarcodeId);
            let ids = {
                goodsId: this.goodlist[index].goodsBarcodeId,
                documentType: 'P_APPLY_DELIVER'
            };

            Object.assign(this.productDetailModal2, {
                showModal: true,
                ids: ids
            });

            this.$nextTick(() => {
                this.$refs.modalRef2.getProductDetail();
            });
        },

        //展示商品明细
        showProductDetail(index) { // 点击商品明细
            this.selectedIndex = index;
            if(!this.goodlist[index].commodityId){
                this.$Modal.error({
                    content: '还未选择商品，请先选择商品，再选择明细！',
                });
                return false;
            }

            //固定开始
            let ids = {
                goodsId: this.goodlist[index].goodsId,
                commodityId: this.goodlist[index].commodityId,
                documentType: 'P_APPLY_DELIVER'
            };


           /* let ids2 = {
                goodsId: 184,
                commodityId: 49,
                documentType: 'P_ORDER'
            };*/

            Object.assign(this.productDetailModal, {
                showModal: true,
                ids: ids
            });
            this.$nextTick(() => {
                this.$refs.modalRef.getProductDetail();
            });
            //固定结束
        },
        validateProduct() {//校验是否存在商品明细 and 选择商品bian编码
            let flag = true;
            let This = this;
            $.each(this.goodlist, function (i, item) {
                if (item.goodsId) {
                    return true;
                }
                if (item.goodsMainType == 'attr_ranges_goods') {
                    if (!item.tBaseBomEntity) {
                        flag = false;
                        This.$Modal.error({
                            content: '第' + (i + 1) + '行商品明细未选择，请先选择商品明细！',
                        });
                        return false;
                    }
                } else {
                    //商品编码
                    if (!item.goodsCode) {
                        flag = false;
                        This.$Modal.error({
                            content: '第' + (i + 1) + '行商品编码未选择，请先选择商品编码！',
                        });
                        return false;
                    }

                    if (!item.assistAttrs) {
                        flag = false;
                        This.$Modal.error({
                            content: '第' + (i + 1) + '行商品明细未选择，请先选择商品明细！',
                        });
                        return false;
                    }

                }
            });
            return flag;

        },

        getInitDataById() { //获取分录行数据列表
            let This = this;
            let id = window.parent.params.params.code; //94;//window.parent.params.params.code;
            if (!id) {
                return;
            }
            $.ajax({
                type: "POST",
                url: contextPath + '/tpurchaseapply/info/' + id,
                dataType: "json",
                success: function (data) {
                    if (data.code !== '100100') {
                        this.$Modal.warning({
                            content: '服务器出错',
                        });
                        return
                    }
                    Object.assign(This.applyOrder, {...data.data});
                    This.productDetailList = data.data.goodList;
                },
                error: function () {
                    layer.alert('服务器出错啦');
                }
            })
        },

        handlerDataToPost() { //处理页面数据提交给后台
            let obj = {//商品分录行,根据自己的业务增减字段
                //下面四个数组固定

                stonesParts: [],
                materialParts: [],
                partParts: [],
                goldParts: []
            };

            //可以固定，开始，
            let data = this.applyOrder;
            data.goodList = [JSON.parse(JSON.stringify(obj))];
            console.log(this.goodlist)

            //商品明细数据处理
            htHandlerProductDetail(this.goodlist, data, obj);
            //可以固定，结束

            this.goodlist.map((item, index) => {
                //商品分录行赋值
                if (!data.goodList[index]) {
                    data.goodList[index] = {};
                }
                Object.assign(data.goodList[index], {
                    commodityId: item.id,
                    pictureUrl: item.pictureUrl,
                    goodsNo: item.goodsNo,
                    goodsName: item.goodsName,
                    goodsMainType: item.goodsMainType,
                    goodsSpecifications: item.goodsSpecifications,
                    countingUnit: item.countingUnit,
                    applyCount: item.applyCount,
                    weightUnit: item.weightUnit,
                    mainStoneWeight: item.mainStoneWeight,
                    applyWeight: item.applyWeight,
                    pricingMethod: item.pricingMethod,
                    price: item.price,
                    amount: item.amount,
                    remark: item.remark,
                    goodsId: item.goodsId
                })
            });
            return data;
        },

        modalSure(e) {
            this.productDetailModalClick(e);
        },

        modalSure2(e) {
            this.productDetailModalClick2(e);
        },


        modalCancel(e) {
            this.productDetailModal2.showModal = false;
            this.productDetailModal.showModal = false;
        },

        productDetailModalClick(e) { // 商品详情点击确定跟取消的回调
            //this.productDetailList 分录行数组，
            //this.selectedIndex 选中行索引；
            //写法固定
            if (this.goodlist[this.selectedIndex].goodsMainType === 'attr_ranges_goods') { // 成品
                Object.assign(this.goodlist[this.selectedIndex], {
                    tBaseBomEntity: e,
                    assistAttrs: null,
                    overEdit: true
                });
            } else {
                Object.assign(this.goodlist[this.selectedIndex], { //原料
                    assistAttrs: e,
                    tBaseBomEntity: null,
                    overEdit: true
                })
            }
        },

        productDetailModalClick2(e) {
            //写法固定
            if (this.productDetailListTemp.goodsEntities[this.selectedIndex1].goodsEntity.goodsMainType === 'attr_ranges_goods') {
                Object.assign(this.productDetailListTemp.goodsEntities[this.selectedIndex1].goodsEntity, {
                    tBaseBomEntity: e,
                    assistAttrs: null,
                    overEdit: true
                });
            } else {
                Object.assign(this.productDetailListTemp.goodsEntities[this.selectedIndex1].goodsEntity, {
                    assistAttrs: e,
                    tBaseBomEntity: null,
                    overEdit: true
                })
            }
            this.productDetailModal2.showModal = false;
        },

        //商品简述页签点击事件
        crolMark(tab) {
            this.codeTabs = tab;
            this.productDetailList[this.selectedIndex] = $.extend(true, {}, this.productDetailList[this.selectedIndex], {goodsEntities: this.productDetailListTemp.goodsEntities})
        },


        //根据带出id查询供应商信息
        getSupplierInfo(id) {
            let sid = id;//this.purchase.supplierId;
            let This = this;
            $.ajax({
                type: "POST",
                url: contextPath + '/purchaseDeliverController/getSupplierDetail?supplierId=' + sid,
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    This.purchase.supplierCode = data.data.supplierCode;
                    This.purchase.supplierName = data.data.supplierName;
                    This.purchase.phone = data.data.phone;
                    This.purchase.defaultContact = data.data.defaultContact;
                    This.purchase.concreteAddress = data.data.concreteAddress;
                },
                error: function (err) {
                    layer.alert("服务器出错");
                }
            })
        },

        //根据商品编码
        getSelectedItem(params, index) { // 获取选中的那条数据
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecommodity/getBriefById/' + params.id,
                dataType: "json",
                success: function (data) {
                    // This.order = data.data;
                    let res = data.data;
                    //转换重量, 数量单位,计价单位
                    /* res.countUnitId = res.countUnitId;
                     res.weightUnitId = res.weightUnitId;
                     res.pricingType = This.unitMap[res.pricingType];*/
                    console.log(res);
                    Object.assign(This.goodlist[index], {
                        goodsCode: res.code,//商品编码 ok
                        goodsName: res.name,//商品名称 ok
                        commodityId: res.id,//商品id
                        pictureUrl: res.frontPic && res.frontPic.fdUrl,//图片路径
                        goodsType: res.categoryName,//?
                        goodsTypePath: res.categoryCustomCode,//?
                        //test
                        /*  goodsTypeName: res.categoryCustomCode,//?*/
                        custStyleCode: res.custStyleCode,//?
                        goodsMainType: res.mainType,//?
                        goodsSpecifications: res.specification,//规格 ok
                        countUnit: res.countUnitId,//计数单位
                        weightUnit: res.weightUnitId,//计重单位
                        chargeUnit: res.pricingType, //计价单位 ok
                        pricingMethod: res.pricingType,
                    });
                    if (res.mainType === 'attr_ranges_gold') {
                        This.goodlist[index].goldColor = res.certificateType;
                    }
                    This.$forceUpdate();
                },
                error: function () {
                    layer.alert('服务器出错啦');
                }
            })
        },
        getInputValue(value, index) {//获取商品编码输入框输入的值
            let This = this;
            console.log(value, index, This.purchaseDeliverEntitys.goodsGroupPath);
            let params = {
                categoryCustomCode: This.purchaseDeliverEntitys.goodsGroupPath,
                field: value, //value, A11  AABc009
                limit: ''
            };
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecommodity/findByType',
                data: params,
                dataType: "json",
                success: function (data) {
                    Object.assign(This.goodlist[index], {options: data.data});
                    This.$forceUpdate();
                },
                error: function () {
                    layer.alert('服务器出错啦');
                }
            })
        },
        initUnit() {
            let _this = this;
            $.ajax({
                type: "post",
                url: contextPath + "/tbaseunit/list",
                contentType: 'application/json',
                dataType: "json",
                async: false,
                success: function (r) {
                    if (r.code === "100100") {
                        let data = r.data;
                        data.map(item => {
                            let keyStr = item.id;
                            let value = item.name;
                            _this.unitMap[keyStr] = value;
                        })
                        console.log(_this.unitMap);

                    } else {
                        layer.alert("服务器异常,请联系技术人员！", {icon: 0});
                    }
                },
                error: function (err) {
                    layer.alert("网络异常,请联系技术人员！", {icon: 0});
                },
            });
        },
        //接收供应商信息
        rcv(id, scode, sname) {
            console.log("dayu", id, scode, sname);
            this.purchase.supplierId = id;
            this.supplierId2 = id;
            this.supplierName2 = sname;
            this.purchase.supplierCode = scode;
            this.supplierCode2 = scode;
            this.getSupplierInfo(id);
        },
        closeSupplierModal(a, b, c) {
            console.log(a, b, c)
            this.showSupplierModal = false;
        },

        //获取供应商方法
        closeSupplier() {
            this.showSupplier = false;
            let This = this;
            This.purchaseDeliverEntitys.supplierId = this.selectSupplier.id;
            This.purchaseDeliverEntitys.supplierName = this.selectSupplier.supplierName;
        },


        getSupplierInfo(id) {
            let sid = id;//this.purchase.supplierId;  21
            let This = this;
            $.ajax({
                type: "POST",
                url: contextPath + '/tpurchaseorder/getSupplierDetail?supplierId=' + sid,
                contentType: 'application/json',
                dataType: "json",
                success: function (result) {

                    /* This.purchase.supplierCode = data.data.supplierCode;
                     This.purchase.supplierName = data.data.supplierName;
                     This.purchase.phone = data.data.phone;
                     This.purchase.defaultContact = data.data.defaultContact;
                     This.purchase.concreteAddress = data.data.concreteAddress;*/
                    purchaseGoodDeliver.supplierName = result.data.supplierName;
                },
                error: function (err) {
                    layer.alert("服务器出错");
                }
            })
        },

        selectSupplierModal() {
            this.showSupplierModal = true;
        },

        //获取物流方式
        getLogisticMode() {
            this.deliveryType = getCodeList("jxc_jxc_wlfs");
        },


        //获取业务员
        getSalesman() {
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath + '/entrustMaterialInController/queryAllEmpByOrganId',
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    console.log("业务员", data)
                    //取出业务员list
                    This.salesmanList = data.data;
                },
                error: function () {
                    This.$Message.error('服务器出错啦');
                }
            })
        },

        getSalesmanByEmpCode(empCode) {
            for (let i = 0; i < this.salesmanList.length; i++) {
                if (empCode == this.salesmanList[i].id) {
                    purchaseGoodDeliver.salesmanName = this.salesmanList[i].empName;
                    break;
                }
            }
        },

        loadWarehouses() {
            var That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/rurchaseReturnGoods/queryByWarehouseInfo',
                dataType: "json",
                success: function (r) {
                    if (r.code == "100100") {
                        That.wareHouse = r.data;
                    } else {
                        layer.alert(r.msg, {icon: 0});
                    }
                },
                error: function () {
                    layer.alert('服务器异常，请稍后再试！', {icon: 0});
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
                    That.employees = r.data.employees;
                },
                error: function () {
                    console.log('服务器出错啦');
                }
            })
        },
        // 级联商品类型
        changeProductType(value, selectedData) {
            //清空商品分录行
            this.goodlist = [];
            let tempType = selectedData[selectedData.length - 1];
            this.purchaseDeliverEntitys.goodsTypeName = tempType.label;
            this.purchaseDeliverEntitys.goodsGroupPath = tempType.value;
            this.purchaseDeliverEntitys.goodsTypePath = tempType.label;
        },
        getProductType() {
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecommoditycategory/listByAll?parentId=0',
                dataType: "json",
                success: function (data) {
                    if (data.code === '100100') {
                        This.productTypeList = This.initGoodCategory(data.data.cateLists)
                    } else {
                        this.$Modal.error({
                            content: data.msg,
                        })
                    }
                },
                error: function () {
                    this.$Modal.error({
                        content: "网络异常,请联系技术人员！",
                    })
                }
            })
        },
        isHintShow(status) {
            if (status && this.typeValue && this.isHint && this.goodlist && this.goodlist.length > 0) {
                this.$Modal.warning({
                    content: '温馨提示：改变商品类型将删除所有商品信息!',
                    onOk: () => {
                        this.isHint = false;
                        console.log('温馨提示：改变商品类型将删除所有商品信息！');
                    }
                })
            }
        },

        //获取商品条码选中行
        getGoodsItem(params, index) {
            let This = this;
            var data = {'id': params.id}
            let a = this.goodlist[index];
            $.ajax({
                type: "post",
                url: contextPath + '/goodsController/queryGoodsDetail',
                data: JSON.stringify(data),
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    console.log("明细", data.data);
                    if (data.code === "100100") {
                        Object.assign(This.goodlist[index], {
                            goodsName: data.data[0].goodsName,
                            goodsBarcode: data.data[0].goodsBarcode,
                            goodsBarcodeId: data.data[0].id,
                            goodsBarcodeOptions: data.data,
                            commodityId:data.data[0].commodityId,
                            goodsCode:data.data[0].goodsNo,
                            id: data.data[0].commodityId

                        });
                        Object.assign(This.productDetailListTemp.goodsEntities[index], {
                            goodsName: data.data[0].goodsName,
                            goodsBarcode: data.data[0].goodsBarcode,
                            goodsBarcodeId: data.data[0].id,
                            goodsBarcodeOptions: data.data,
                            commodityId:data.data[0].commodityId,
                            goodsCode:data.data[0].goodsNo,
                            id: data.data[0].commodityId

                        });
                        This.$forceUpdate();

                        purchaseGoodDeliver.getSelectedItem(This.goodlist[index], index);
                    }
                },
                error: function () {
                    layer.alert('服务器出错啦');
                }
            })
        },

        //商品简述页签点击事件
        crolMark(tab) {
            this.tabVal = tab;
         //？？   this.goodlist[this.selectedIndex] = $.extend(true, {}, this.goodlist[this.selectedIndex], {goodsEntities: this.productDetailListTemp.goodsEntities})
        },


        //获取商品条形码
        getGoodsBarcodeValue(value, index) {
            let This = this;
            let params = {
                goodsBarcode: value,
                goodsNo: '',
                commodityId: this.goodlist[index].commodityId,
                //是否在库 0、否 1、是
                isInStock: 1,
                //0、客户料；1、公司料
                //nature: 1,
                stockInNo: '',
                warehouseId: this.goodlist[index].warehouseId,
                reservoirPositionId: this.goodlist[index].reservoirPositionId,
                stockType: '',
                goodsName: '',
                custStyleType: '',
                limit: ''
            };
            $.ajax({
                type: "post",
                url: contextPath + '/goodsController/queryGoodsDetail',
                data: JSON.stringify(params),
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        This.goodlist[index]['goodsBarcodeOptions'] = data.data.map(code => $.extend(true, {}, {
                            code: code.goodsBarcode,
                            name: code.goodsName,
                            id: code.id
                        }));
                       /* This.productDetailListTemp.goodsEntities[index]['options'] = data.data.map(code => $.extend(true, {}, {
                            code: code.goodsBarcode,
                            name: code.goodsName,
                            id: code.id
                        }));*/
                        This.$forceUpdate();
                    }
                },
                error: function () {
                    layer.alert('服务器出错啦');
                }
            })
        },


        typeInit(arr, res, val) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].value == val) {
                    res.push(arr[i].value);
                    return true;
                }
                if (arr[i].children && arr[i].children.length > 0) {
                    if (this.typeInit(arr[i].children, res, val)) {
                        res.push(arr[i].value);
                        return true;
                    }
                }
            }
        },

        locatorChange(e, index) {

            let wId = e;
            if (typeof e === 'object') {
                wId = e.target.value;
            }
            let groupId = '';
            for (let i = 0; i < this.wareHouse.length; i++) {
                if (wId == this.wareHouse[i].id) {
                    groupId = this.wareHouse[i].groupId;
                    break;
                }
            }
            this.$set(this.storageList, index, this.locationMap[groupId])
        },

        openSupplier() {
            if (this.purchaseDeliverEntitys.orderStatus != 1) {
                return;
            }
            this.showSupplier = true;
        },
        repositionDropdown(){
            return repositionDropdownOnSroll('testTableWrap', 'goods');
        },

        //选中条码信息行
        selectProductDetail2(index) {
            this.selectedIndex1 = index;
        },

        //点击明细
        detailAction(index) {
            if (!this.goodlist[index].goodsCode) {
                layer.alert('请先选择商品编码！');
                return;
            }
            if (!this.goodlist[index].deliverGoodsWeight) {
                layer.alert('请先输入送料重量！');
                return;
            }
            if (!this.goodlist[index].deliverGoodsCount) {
                layer.alert('请先输入送料数量！');
                return;
            }
            if (!this.goodlist[index].warehouseId) {
                layer.alert('请先选择仓库！');
                return;
            }
            // if (!this.productDetailList[index].reservoirPositionId) {
            //     this.$Message.info("请先选择库位！");
            //     return;
            // }
            this.codeTabs = "tab2";

            if (this.params.activeType == 'handworkAdd' || this.productDetailList[index].goodsEntities == null || this.productDetailList[index].goodsEntities == []) {
                this.productDetailListTemp = JSON.parse(JSON.stringify(this.productDetailList[index]));
                if (this.productDetailList[index].goodsEntities != undefined && this.productDetailList[index].returnCount < this.productDetailList[index].goodsEntities.length) {
                    var arrIndex = parseInt(this.productDetailList[index].returnCount);
                    var len = parseInt(this.productDetailListTemp.goodsEntities.length) - arrIndex;
                    this.productDetailList[index].goodsEntities = this.productDetailList[index].goodsEntities.splice(arrIndex, len);
                    this.productDetailListTemp.goodsEntities.splice(arrIndex, len);
                } else {
                    var num = Number(this.productDetailList[index].returnCount);
                    this.productDetailListTemp.goodsEntities = new Array(num).fill({
                        goodsEntity: {
                            options: []
                        }
                    });
                }
                null
                this.productDetailListTemp = $.extend(true, {}, this.productDetailListTemp, this.productDetailList[index]);
            } else {
                let This = this;
                This.productDetailListTemp = This.productDetailList[index];
                var ids = [];
                for (var i = 0; i < This.productDetailList[index].goodsEntities.length; i++) {
                    ids.push(This.productDetailList[index].goodsEntities[i].goodsBarcodeId)
                }
                $.ajax({
                    type: "post",
                    url: contextPath + '/goodsController/queryByGoodsOnIds',
                    data: JSON.stringify(ids),
                    contentType: 'application/json',
                    dataType: "json",
                    success: function (data) {
                        console.log("明细", data.data)
                        if (data.code === "100100") {
                            This.productDetailListTemp = This.productDetailList[index];
                            for (var i = 0; i < This.productDetailListTemp.goodsEntities.length; i++) {
                                Object.assign(This.productDetailListTemp.goodsEntities[i], {
                                    goodsEntity: Object.assign({}, data.data[i])
                                });
                            }
                            This.$forceUpdate();
                        }
                    },
                    error: function () {
                        layer.alert('服务器出错啦');
                    }
                })
            }
        },

    },
    watch: {
        applyOrder: {
            handler(newQuestion, oldQuestion) {
                let temp = newQuestion.goodsGroupPath;
                let arr = [];
                this.typeInit(this.productTypeList, arr, temp);
            },
            deep: true
        },
        /* typeValue:{
             this.typeValue = arr.reverse();
         }*/
    },
    created() {
        //  console.log(window.parent.userInfo)
        this.orgName = window.parent.userInfo.orgName;
        this.initUnit();
        this.initApproval();
        this.getProductType();
        let requisitionGoodsEntity = [];
        let purchaseGoodsList = [];
        //  let documentNo = null;

        let list = window.parent.params.params;
        //   documentNo = list[0].documentNo;


        if (list === true || list === undefined) {

        }

        else if (Array.isArray(list)) {  //点击生成采购送料单跳转页面
            for (let i = 0; i < list.length; i++) {
                var a = list[i];

                let obj = {}
                obj.transferNo = a.documentNo;
                requisitionGoodsEntity.push(obj);
            }

            $.ajax({
                type: "POST",
                /* url: contextPath+"/purchaseDeliverController/build?id="+id,*/
                url: "/web/purchaseDeliverController/goodslist",
                contentType: 'application/json',
                data: JSON.stringify(requisitionGoodsEntity),
                success: function (result) {
                    result.data.list.map(item => {
                        Object.assign(item, {}, {
                            sourceNo: item.transferNo,
                            deliverGoodsWeight: item.totalWeight,
                            deliverGoodsCount: item.transferGoodsNum,
                            warehouseId: item.transferOutWarehouse,
                            reservoirPositionId: item.transferOutPositionId
                        })
                    });
                    purchaseGoodDeliver.goodlist = result.data.list;
                    //获取页面上供应商
                    for (let i = 0; i < purchaseGoodDeliver.goodlist.length; i++) {
                        purchaseGoodDeliver.supplierId = purchaseGoodDeliver.goodlist[0].supplierId;
                        purchaseGoodDeliver.supplierName = purchaseGoodDeliver.getSupplierInfo(purchaseGoodDeliver.supplierId);
                        //物流方式
                        purchaseGoodDeliver.logisticsMode = purchaseGoodDeliver.goodlist[0].logisticsMode;
                        //下单日期
                        this.deliveryDate = purchaseGoodDeliver.goodlist[0].createTime;
                        //商品类型名称
                        purchaseGoodDeliver.goodsTypeName = purchaseGoodDeliver.goodlist[0].goodsTypeName;
                        break;
                    }

                    // let goodlist3= purchaseGoodDeliver.goodlist;
                    purchaseGoodDeliver.goodlist.map((item) => {
                        let obj = JSON.parse(JSON.stringify(item));
                        purchaseGoodDeliver.goodlist2.push(obj);
                    })

                },
                error: function (err) {
                    alert(err);
                },
            })
        } else {  //跳转到单据修改页面
            let orderNo = list.orderNo;
            let orderId = list.id;
            let parms = {"orderNo": orderNo};
            $.ajax({
                type: "POST",
                url: "/web/purchaseDeliverController/purchaseDeliverGoodsList",
                // contentType: 'application/json',
                data: parms,
                success: function (result) {
                    console.log("接口请求了2");
                    //源单保存或者修改
                    purchaseGoodDeliver.isSourceEdit = true,
                        purchaseGoodDeliver.goodlist = result.data.purchaseGoodsList;
                    purchaseGoodDeliver.purchaseDeliverEntitys = result.data;
                    //供应商
                    purchaseGoodDeliver.deliverId = purchaseGoodDeliver.purchaseDeliverEntitys.id;
                    purchaseGoodDeliver.deliverOrderNo = purchaseGoodDeliver.purchaseDeliverEntitys.orderNo;
                    purchaseGoodDeliver.supplierId = purchaseGoodDeliver.purchaseDeliverEntitys.supplierId;
                    purchaseGoodDeliver.supplierName = purchaseGoodDeliver.purchaseDeliverEntitys.supplierName;
                    //物流方式
                    purchaseGoodDeliver.logisticsMode = purchaseGoodDeliver.purchaseDeliverEntitys.logisticsMode;

                    //业务员名称
                    purchaseGoodDeliver.empCode = purchaseGoodDeliver.purchaseDeliverEntitys.salesmanId;

                    //purchaseGoodDeliver.logisticsMode ="wlfs_zt";
                    //下单日期
                    this.deliveryDate = purchaseGoodDeliver.purchaseDeliverEntitys.createTime;

                    //创建人id、创建人name、创建日期
                    purchaseGoodDeliver.createId = purchaseGoodDeliver.purchaseDeliverEntitys.createId;
                    purchaseGoodDeliver.username = purchaseGoodDeliver.purchaseDeliverEntitys.createName;
                    purchaseGoodDeliver.createTime = purchaseGoodDeliver.purchaseDeliverEntitys.createTime;

                    //修改人、修改日期
                    purchaseGoodDeliver.updateName = purchaseGoodDeliver.purchaseDeliverEntitys.updateName;
                    purchaseGoodDeliver.updateTime = purchaseGoodDeliver.purchaseDeliverEntitys.updateTime;

                    //审核人、审核日期
                    purchaseGoodDeliver.reviewedName = purchaseGoodDeliver.purchaseDeliverEntitys.reviewedName;
                    purchaseGoodDeliver.reviewedDate = purchaseGoodDeliver.purchaseDeliverEntitys.reviewedDate;
                    purchaseGoodDeliver.goodsTypeName = purchaseGoodDeliver.purchaseDeliverEntitys.goodsTypeName;

                    purchaseGoodDeliver.getAccess(purchaseGoodDeliver.purchaseDeliverEntitys.orderNo, purchaseGoodDeliver.boeType);

                    purchaseGoodDeliver.goodlist.map((item) => {
                        let obj = JSON.parse(JSON.stringify(item));
                        purchaseGoodDeliver.goodlist2.push(obj);
                    })
                    console.log("打印");
                    console.log(purchaseGoodDeliver.goodlist2);
                    if (list.isRead || purchaseGoodDeliver.purchaseDeliverEntitys.orderStatus == 2) {
                        purchaseGoodDeliver.isRead = true;
                        purchaseGoodDeliver.isSaveDisable = true;
                        purchaseGoodDeliver.isSubmitDisable = true;
                        purchaseGoodDeliver.isDelDisable = true;
                        purchaseGoodDeliver.isSalesManDisable = true;
                        purchaseGoodDeliver.isLogisticsModeDisable = true;
                        purchaseGoodDeliver.isDeliverGoodsWeightDisable = true;
                        purchaseGoodDeliver.isDeliverGoodsCountDisable = true;
                        purchaseGoodDeliver.isRemarkDisable = true;
                        purchaseGoodDeliver.isEdit('N');
                    }

                    if (purchaseGoodDeliver.purchaseDeliverEntitys.orderStatus == 2) {
                        purchaseGoodDeliver.isRead = false;
                        purchaseGoodDeliver.isSaveDisable = true;
                        purchaseGoodDeliver.isSubmitDisable = true;
                        purchaseGoodDeliver.isDelDisable = true;
                        purchaseGoodDeliver.isSalesManDisable = true;
                        purchaseGoodDeliver.isLogisticsModeDisable = true;
                        purchaseGoodDeliver.isDeliverGoodsWeightDisable = true;
                        purchaseGoodDeliver.isDeliverGoodsCountDisable = true;
                        purchaseGoodDeliver.isRemarkDisable = true;
                        purchaseGoodDeliver.isEdit('N');
                    }


                    //审核中
                    if (purchaseGoodDeliver.purchaseDeliverEntitys.orderStatus == 3) {
                        purchaseGoodDeliver.isSaveDisable = true;
                        purchaseGoodDeliver.isSubmitDisable = true;
                        purchaseGoodDeliver.isDelDisable = true;
                        purchaseGoodDeliver.isSalesManDisable = true;
                        purchaseGoodDeliver.isLogisticsModeDisable = true;
                        purchaseGoodDeliver.isDeliverGoodsWeightDisable = true;
                        purchaseGoodDeliver.isDeliverGoodsCountDisable = true;
                        purchaseGoodDeliver.isRemarkDisable = true;
                        purchaseGoodDeliver.isEdit('N');
                    }


                },
                error: function (err) {
                    alert(err);
                },
            })
        }

    },
    mounted() {
        this.openTime = window.parent.params.openTime;
        this.orgName = window.parent.userInfo.orgName;

        console.log(window.parent.userInfo);
        this.createTime = new Date().toLocaleDateString();
        this.deliveryDate = new Date().toLocaleDateString();
        console.log("打印");
        console.log(window.parent.userInfo.organId);
        //获取全体员工
        this.getSalesman();
        //获取物流方式
        this.getLogisticMode();

        //先写成可编辑附件
        this.isEdit('Y');


        //加载仓库
        this.loadWarehouses();
        this.loadData();
        this.repositionDropdown();
    },

})
