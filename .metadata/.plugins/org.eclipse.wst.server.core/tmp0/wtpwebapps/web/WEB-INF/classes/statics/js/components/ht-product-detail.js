Vue.component('product-detail', {
    props: {
        showModal: {// 是否显示商品详情的弹窗
            type: String,
            default() {
                return true;
            }
        },
        dataSourceType: { //是否来自上游
            type: Boolean,
            default() {
                return false;
            }
        },
        dataSource: {//上游数据
            type: Object,
            default() {
                return null;
            }
        },
        isOrderBom: {//是否是订单bom
            type: Boolean,
            default() {
                return false;
            }
        },
        specialAttr: {//显示特殊字段
            type: Object,
            default() {
                return {
                    gold: [/*{
                        name: '名称',
                        code: 'commodityCode',
                        edit: false
                    }*/],
                    stone: [/*{
                          name: '名称',
                          code: 'commodityCode',
                          edit: true
                    }*/],
                    part: [/*{
                        name: '名称',
                        code: 'code',
                        edit: true
                    }*/],
                }
            }
        },
        isImport: { //是否是导入
            type: Boolean,
            default() {
                return false;
            }
        },
        isStock: { //是否是入库
            type: Boolean,
            default() {
                return false;
            }
        },
        importData: {//导入的数据
            type: Object,
            default() {
                return {
                    tBaseBomEntity: {},
                    goldParts: [],
                    stoneParts: [],
                    partParts: []
                }
            }
        },
        ids: {// goodId跟commodityId 对象
            default() {
                return {
                    goodsId: '',
                    commodityId: '', //45
                };
            }
        },
        overEdit: {// 是否接口请求过初始数据
            type: Boolean,
            default() {
                return false;
            }
        },
        orderStatus: {//单据状态，number类型， 1 为可编辑状态
            default() {
                return null;
            }
        },
        goodsMainType: {//商品主类型
            default() {
                return 'attr_ranges_goods';
            }
        },
        tBaseBomEntity: {//成品缓存的对象

        },
        myAssistAttrs: {//原料缓存的对象
            type: Object,
            default() {
                return {};
            }
        },
        weightUnitId: {//计重方式id，如果有的话则请求单位转化率
            default() {
                return '';
            }
        }
    },
    data() {
        return {
            productDetailAttr: {
                goldBoms: [],
                stonesBoms: [],
                partBoms: [],
                assistAttrs: [],
                stoneHeader: [],
                goldHeader: [],
                partHeader: [],
                assistAttrsHeader: []
            },
            productDetailAttrTemp: null,
            typeName: {
                goldBoms: '金料',
                partBoms: '配件',
                stonesBoms: '石料',
                assistAttrs: '配件'
            },
            unitObj: {},
            rate: null
        }
    },
    methods: {
        goldCheckedChange(e, index) {//只能单选
            this.productDetailAttr.goldBoms.map(item => {
                item.checked = false;
            });
            setTimeout(() => {
                this.productDetailAttr.goldBoms[index].checked = true;
                this.$forceUpdate();
            })
        },
        getProductDetail() {//点击商品明细
            let This = this;
            let goodsId = this.ids.goodsId;
            let commodityId = this.ids.commodityId;
            let params = {
                id: goodsId,
                documentType: this.ids.documentType
            };

            if (!goodsId && !commodityId) {
                This.$Modal.warning({
                    content: '请先选择商品！',
                });
                this.$emit('cancel');
                return;
            }
            this.clearProductDetailAttr();

            if (this.isImport) { //如果是导入则不发任何请求
                if (This.overEdit) {
                    let data = JSON.parse(JSON.stringify(this.tBaseBomEntity));
                    Object.assign(this.productDetailAttr, {
                        goldBoms: data.goldBoms,
                        goldHeader: data.goldHeader || [],
                        stonesBoms: data.stonesBoms,
                        stoneHeader: data.stoneHeader || [],
                        partBoms: data.partBoms,
                        partHeader: data.partHeader || [],
                        goodsMainType: This.goodsMainType
                    });
                    This.productDetailAttrTemp = JSON.parse(JSON.stringify(This.productDetailAttr));
                    return;
                }

                This.tBaseBomEntity = JSON.parse(JSON.stringify(this.importData.tBaseBomEntity));
                let dataTemp = This.tBaseBomEntity;
                Object.assign(This.productDetailAttr, {
                    goldBoms: dataTemp.goldBoms,
                    goldHeader: dataTemp.goldHeader || [],
                    stonesBoms: dataTemp.stonesBoms,
                    stoneHeader: dataTemp.stoneHeader || [],
                    partBoms: dataTemp.partBoms,
                    partHeader: dataTemp.partHeader || [],
                    goodsMainType: This.goodsMainType
                });

                This.handlerBoms('stonesBoms', 'stoneHeader');
                This.handlerBoms('goldBoms', 'goldHeader');
                This.handlerBoms('partBoms', 'partHeader');

                Object.assign(This.tBaseBomEntity, {
                    goldHeader: This.productDetailAttr.goldHeader,
                    stoneHeader: This.productDetailAttr.stoneHeader,
                    partHeader: This.productDetailAttr.partHeader
                });

                This.handlerExcelImportAttrs(this.importData.goldParts, 'goldBoms');//处理boms数
                This.handlerExcelImportAttrs(this.importData.stonesParts, 'stonesBoms');
                This.handlerExcelImportAttrs(this.importData.partParts, 'partBoms');
                This.handlerExcelLoss(this.importData);//给重量、损耗赋值
                This.handlerEditSpecialAttr(this.importData); //特殊字段处理

                This.productDetailAttrTemp = JSON.parse(JSON.stringify(This.productDetailAttr));
                This.$forceUpdate();
                return;
            }

            if (this.dataSource) {//上游数据只能查看
                let data = {
                    goldParts: this.dataSource.goldParts,
                    stonesParts: this.dataSource.stonesParts,
                    partParts: this.dataSource.partParts,
                    materialParts: this.dataSource.materialParts
                };
                this.handlerLook(data);
                return;
            }
            //商品分录行id存在 发送请求
            if (goodsId) {
                //发送请求 查询商品明细
                if (this.orderStatus != 1 || this.isOrderBom || this.dataSourceType) {//查看
                    $.ajax({//请求商品详情的选中数据
                            type: "post",
                            url: contextPath + '/tgoodsPart/getParts',
                            dataType: "json",
                            data: params,
                            success: function (res) {
                                if (res.code !== '100100') {
                                    This.$Modal.warning({
                                        content: '服务器出错',
                                    });
                                    return
                                }
                                let data = res.data;
                                This.handlerLook(data);
                            },
                            error: function () {
                                This.$Modal.error({
                                    content: '服务器出错,请联系技术人员'
                                });
                            }
                        }
                    );
                    return
                }
                if (this.goodsMainType === 'attr_ranges_goods') {//修改成品
                    if (This.overEdit) {
                        let data = JSON.parse(JSON.stringify(this.tBaseBomEntity));
                        Object.assign(this.productDetailAttr, {
                            goldBoms: data.goldBoms,
                            goldHeader: data.goldHeader || [],
                            stonesBoms: data.stonesBoms,
                            stoneHeader: data.stoneHeader || [],
                            partBoms: data.partBoms,
                            partHeader: data.partHeader || [],
                            goodsMainType: This.goodsMainType
                        });
                        This.productDetailAttrTemp = JSON.parse(JSON.stringify(This.productDetailAttr));
                        return;
                    }

                    $.ajax({//请求bom数据
                        type: "post",
                        url: contextPath + '/tbasecommodity/getBomOrAttr/' + commodityId,
                        dataType: "json",
                        success: function (data) {
                            if (data.code !== '100100') {
                                This.$Modal.warning({
                                    content: '服务器出错',
                                });
                                return
                            }
                            let res = data.data;
                            if (!res.tBaseBomEntity) {
                                This.$Modal.warning({
                                    content: '该商品未设置Bom，请先设置商品Bom资料！',
                                });
                                return;
                            }

                            This.tBaseBomEntity = res.tBaseBomEntity;
                            let dataTemp = This.tBaseBomEntity;
                            Object.assign(This.productDetailAttr, {
                                goldBoms: dataTemp.goldBoms,
                                goldHeader: dataTemp.goldHeader || [],
                                stonesBoms: dataTemp.stonesBoms,
                                stoneHeader: dataTemp.stoneHeader || [],
                                partBoms: dataTemp.partBoms,
                                partHeader: dataTemp.partHeader || [],
                                goodsMainType: This.goodsMainType
                            });

                            This.handlerBoms('stonesBoms', 'stoneHeader');
                            This.handlerBoms('goldBoms', 'goldHeader');
                            This.handlerBoms('partBoms', 'partHeader');

                            Object.assign(This.tBaseBomEntity, {
                                goldHeader: This.productDetailAttr.goldHeader,
                                stoneHeader: This.productDetailAttr.stoneHeader,
                                partHeader: This.productDetailAttr.partHeader
                            });

                            $.ajax({//请求商品详情的选中数据
                                type: "post",
                                url: contextPath + '/tgoodsPart/getParts',
                                dataType: "json",
                                data: params,
                                success: function (attrData) {
                                    if (attrData.code !== '100100') {
                                        This.$Modal.warning({
                                            content: '服务器出错',
                                        });
                                        return
                                    }
                                    This.handlerPartAttrs(attrData.data.goldParts, 'goldBoms');//处理boms数
                                    This.handlerPartAttrs(attrData.data.stonesParts, 'stonesBoms');
                                    This.handlerPartAttrs(attrData.data.partParts, 'partBoms');
                                    This.handlerLoss(attrData.data);//给重量、损耗赋值
                                    This.handlerEditSpecialAttr(attrData.data); //特殊字段处理

                                    This.productDetailAttrTemp = JSON.parse(JSON.stringify(This.productDetailAttr));
                                    This.$forceUpdate();
                                },
                                error: function () {
                                    This.$Modal.error({
                                        content: '服务器出错,请联系技术人员'
                                    });
                                }
                            });
                        },
                        error: function () {
                            This.$Modal.error({
                                content: '服务器出错,请联系技术人员'
                            });
                        }
                    });
                } else {//非成品
                    if (This.overEdit) {
                        let data = this.myAssistAttrs;
                        Object.assign(this.productDetailAttr, {
                            assistAttrsHeader: data.assistAttrsHeader,
                            assistAttrs: data.assistAttrs,
                            goodsMainType: This.goodsMainType
                        });
                        This.productDetailAttrTemp = JSON.parse(JSON.stringify(This.productDetailAttr));
                        return;
                    }

                    $.ajax({//请求原料数据
                        type: "post",
                        url: contextPath + '/tbasecommodity/getBomOrAttr/' + commodityId,
                        dataType: "json",
                        success: function (result) {
                            let res = result.data;
                            This.assistAttrs = res.assistAttrs;
                            Object.assign(This.productDetailAttr, {
                                assistAttrs: res.assistAttrs
                            });

                            $.ajax({//请求商品详情的选中数据
                                type: "post",
                                url: contextPath + '/tgoodsPart/getParts',
                                dataType: "json",
                                data: params,
                                success: function (attrData) {
                                    if (attrData.code !== '100100') {
                                        This.$Modal.warning({
                                            content: '服务器出错',
                                        });
                                        return
                                    }
                                    This.handlerAssist();
                                    attrData.data.materialParts[0].partAttrs.map(item => {//循环赋值；
                                        This.productDetailAttr.assistAttrs.map(list => {
                                            list.attr.map(attr => {
                                                if (item.attr === attr.name) {
                                                    attr.model = item.attrValue;
                                                }
                                            })
                                        })
                                    });
                                    This.productDetailAttrTemp = JSON.parse(JSON.stringify(This.productDetailAttr));
                                    This.$forceUpdate();
                                },
                                error: function () {
                                    This.$Modal.error({
                                        content: '服务器出错,请联系技术人员'
                                    });
                                }
                            });
                        },
                        error: function () {
                            This.$Modal.error({
                                content: '服务器出错,请联系技术人员'
                            });
                        }
                    });
                }
            } else {
                //商品分录行id不存在
                if (this.goodsMainType === 'attr_ranges_goods') {
                    //成品 根据BOM信息初始化商品明细
                    if (this.overEdit) {
                        let data = JSON.parse(JSON.stringify(this.tBaseBomEntity || {}));
                        this.handlerAllBomData(data);
                    } else {
                        $.ajax({//请求商品详情的选中数据
                            type: "post",
                            url: contextPath + '/tbasecommodity/getBomOrAttr/' + commodityId,
                            dataType: "json",
                            data: params,
                            success: function (res) {
                                if (res.code !== '100100') {
                                    This.$Modal.warning({
                                        content: '服务器出错',
                                    });
                                    return
                                }
                                if (!res.data.tBaseBomEntity) {
                                    This.$Modal.warning({
                                        content: '该商品未设置Bom，请先设置商品Bom资料！',
                                    });
                                    return;
                                }
                                This.handlerAllBomData(res.data.tBaseBomEntity);
                            },
                            error: function () {
                                This.$Modal.error({
                                    content: '服务器出错,请联系技术人员'
                                });
                            }
                        });
                    }
                } else {
                    //原料
                    if (this.myAssistAttrs && this.myAssistAttrs.assistAttrs && this.overEdit) {
                        this.handlerAllPartData(this.myAssistAttrs);
                    } else {
                        $.ajax({//请求商品详情的选中数据
                            type: "post",
                            url: contextPath + '/tbasecommodity/getBomOrAttr/' + commodityId,
                            dataType: "json",
                            success: function (res) {

                                Object.assign(This.myAssistAttrs, {
                                    assistAttrs: res.data.assistAttrs,
                                    assistAttrsHeader: []
                                });
                                This.handlerAllPartData(This.myAssistAttrs);
                            },
                            error: function () {
                                This.$Modal.error({
                                    content: '服务器出错,请联系技术人员'
                                });
                            }
                        });
                    }
                }
            }
            if(this.goodsMainType === 'attr_ranges_goods' && this.weightUnitId.toString().length > 0){
                this.getRate();
            }
        },
        getRate(){
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tbaseunit/findListByGroupIdAndUnitId',
                data: {unitId: this.weightUnitId},
                dataType: "json",
                success: function (data) {
                    if(data.code === '100100'){
                        This.rate = data.data;
                    }else {
                        This.$Modal.warning({
                            content: '获取单位转化率失败'
                        });
                    }
                },
                error: function () {
                    This.$Modal.error({
                        content: "网络异常,请联系技术人员！",
                    })
                }
            })
        },
        handlerLook(data) {//查看数据时方法
            let This = this;
            if (This.goodsMainType === 'attr_ranges_goods') {
                This.handlerDetailHeader(data.goldParts, 'goldHeader');//金料头部
                This.handlerDetailHeader(data.stonesParts, 'stoneHeader');//石料头部
                This.handlerDetailHeader(data.partParts, 'partHeader');//配件头部

                //处理特殊情况下特殊字段
                let specialStone = [];
                let specialGold = [];
                let specialPart = [];

                let specialStoneObj = {};
                let specialGoldObj = {};
                let specialPartObj = {};

                This.specialAttr.stone.map(item => {
                    specialStone.push(item.code);
                });
                This.specialAttr.gold.map(item => {
                    specialGold.push(item.code);
                });
                This.specialAttr.part.map(item => {
                    specialPart.push(item.code);
                });
                if (This.productDetailAttr.goldHeader.length > 0) {
                    This.productDetailAttr.goldHeader.map(headerName => {//整理金料头部对应的数据
                        data.goldParts.map((item, y) => {
                            if (!This.productDetailAttr.goldBoms[y]) {
                                specialGold.map(key => {
                                    specialGoldObj[key] = item[key];
                                });
                                Object.assign(item, {
                                    attr: [],
                                    commodityId: item.commodityId,
                                    commodityCode: item.goodsCode,
                                    commodityName: item.name,
                                    condition: item.goldColor,
                                    weightUnitId: item.weightUnit,
                                    weightUnitName: item.weightUnit,
                                    weightReference: item.weight,
                                    weight: This.isStock ? item.weight : '',
                                    lose: item.goldLoss
                                }, (specialStoneObj || {}));

                                This.productDetailAttr.goldBoms.push(item);
                            }
                            let haveValue = false;
                            item.partAttrs.map(list => {
                                if (headerName === list.attr) {
                                    haveValue = true;
                                    This.productDetailAttr.goldBoms[y].attr.push(list);
                                }
                            });
                            if (!haveValue) {
                                This.productDetailAttr.goldBoms[y].attr.push({});
                            }
                        });
                    });
                } else {
                    data.goldParts.map((item, y) => {
                        if (!This.productDetailAttr.goldBoms[y]) {
                            specialGold.map(key => {
                                specialGoldObj[key] = item[key];
                            });
                            Object.assign(item, {
                                attr: [],
                                commodityId: item.commodityId,
                                commodityCode: item.goodsCode,
                                commodityName: item.name,
                                condition: item.goldColor,
                                weightUnitId: item.weightUnit,
                                weightUnitName: item.weightUnit,
                                weightReference: item.weight,
                                weight: This.isStock ? item.weight : '',
                                lose: item.goldLoss
                            }, (specialStoneObj || {}));

                            This.productDetailAttr.goldBoms.push(item);
                        }
                    });
                }

                if (This.productDetailAttr.stoneHeader.length > 0) {
                    This.productDetailAttr.stoneHeader.map(headerName => {//整理石料头部对应的数据
                        data.stonesParts.map((item, y) => {
                            specialStone.map(key => {
                                specialStoneObj[key] = item[key];
                            });
                            if (!This.productDetailAttr.stonesBoms[y]) {
                                Object.assign(item, {
                                    attr: [],
                                    commodityId: item.commodityId,
                                    commodityCode: item.goodsCode,
                                    commodityName: item.name,
                                    weightUnitId: item.weightUnit,
                                    countUnitId: item.countingUnit,
                                    weightUnitName: item.weightUnit,
                                    countUnitName: item.countingUnit,
                                    weightReference: item.weight,
                                    count: item.num,
                                    partName: item.stoneName,
                                    lose: item.stoneLoss,
                                    weight: This.isStock ? item.weight : '',
                                }, (specialStoneObj || {}));
                                This.productDetailAttr.stonesBoms.push(item);
                            }
                            let haveValue = false;
                            item.partAttrs.map(list => {
                                if (headerName === list.attr) {
                                    haveValue = true;
                                    This.productDetailAttr.stonesBoms[y].attr.push(list);
                                }
                            });
                            if (!haveValue) {
                                This.productDetailAttr.stonesBoms[y].attr.push({});
                            }
                        });
                    });
                } else {
                    data.stonesParts.map((item, y) => {
                        specialStone.map(key => {
                            specialStoneObj[key] = item[key];
                        });
                        if (!This.productDetailAttr.stonesBoms[y]) {
                            Object.assign(item, {
                                attr: [],
                                commodityId: item.commodityId,
                                commodityCode: item.goodsCode,
                                commodityName: item.name,
                                weightUnitId: item.weightUnit,
                                countUnitId: item.countingUnit,
                                weightReference: item.weight,
                                weightUnitName: item.weightUnit,
                                countUnitName: item.countingUnit,
                                weight: This.isStock ? item.weight : '',
                                count: item.num,
                                partName: item.stoneName,
                                lose: item.stoneLoss
                            }, (specialStoneObj || {}));
                            This.productDetailAttr.stonesBoms.push(item);
                        }
                    });
                }

                if (This.productDetailAttr.partHeader.length > 0) {
                    This.productDetailAttr.partHeader.map(headerName => {//整理配件头部对应的数据
                        data.partParts.map((item, y) => {
                            specialPart.map(key => {
                                specialPartObj[key] = item[key];
                            });
                            if (!This.productDetailAttr.partBoms[y]) {
                                Object.assign(item, {
                                    attr: [],
                                    commodityId: item.commodityId,
                                    commodityCode: item.goodsCode,
                                    commodityName: item.name,
                                    weightUnitId: item.weightUnit,
                                    countUnitId: item.countingUnit,
                                    countUnitName: item.countingUnit,
                                    weightReference: item.weight,
                                    count: item.num
                                }, (specialPartObj || {}));
                                This.productDetailAttr.partBoms.push(item);
                            }
                            let haveValue = false;
                            item.partAttrs.map(list => {
                                if (headerName === list.attr) {
                                    haveValue = true;
                                    This.productDetailAttr.partBoms[y].attr.push(list);
                                }
                            });
                            if (!haveValue) {
                                This.productDetailAttr.partBoms[y].attr.push({});
                            }
                        });
                    });
                } else {
                    data.partParts.map((item, y) => {
                        specialPart.map(key => {
                            specialPartObj[key] = item[key];
                        });
                        if (!This.productDetailAttr.partBoms[y]) {
                            Object.assign(item, {
                                attr: [],
                                commodityId: item.commodityId,
                                commodityCode: item.goodsCode,
                                commodityName: item.name,
                                weightUnitId: item.weightUnit,
                                countUnitId: item.countingUnit,
                                countUnitName: item.countingUnit,
                                weightReference: item.weight,
                                count: item.num
                            }, (specialPartObj || {}));
                            This.productDetailAttr.partBoms.push(item);
                        }
                    });
                }

                this.productDetailAttr.goldBoms.map((item, k) => {
                    item.weightUnitId = this.unitObj[item.weightUnitId && item.weightUnitId.toString()] || item.weightUnitId;
                });
                this.productDetailAttr.stonesBoms.map((item, k) => {
                    item.weightUnitId = this.unitObj[item.weightUnitId && item.weightUnitId.toString()] || item.weightUnitId;
                    item.countUnitId = this.unitObj[item.countUnitId && item.countUnitId.toString()] || item.countUnitId;
                });
                this.productDetailAttr.partBoms.map((item, k) => {
                    item.countUnitId = this.unitObj[item.countUnitId && item.countUnitId.toString()] || item.countUnitId;
                });
            } else {
                data.materialParts.map(item => {//整理原料
                    item.partAttrs.map(list => {
                        This.productDetailAttr.assistAttrsHeader.push(list.attr);
                        This.productDetailAttr.assistAttrs.push(list);
                    });
                });
            }
        },

        handlerDetailHeader(dataSource, type) {//处理查看情况下金料石料配件的头部；
            this.productDetailAttr[type] = [];
            dataSource.map((item) => {//整理石料并集头部
                item.partAttrs.map(list => {
                    if (this.productDetailAttr[type].indexOf(list.attr) === -1) {
                        this.productDetailAttr[type].push(list.attr);
                    }
                });
            });
        }
        ,
        handlerAllBomData(data) {//处理新增成品时需要的数据
            Object.assign(this.productDetailAttr, {
                goldBoms: data.goldBoms,
                goldHeader: data.goldHeader || [],
                stonesBoms: data.stonesBoms,
                stoneHeader: data.stoneHeader || [],
                partBoms: data.partBoms,
                partHeader: data.partHeader || []
            });

            if (this.overEdit) {
                this.productDetailAttrTemp = JSON.parse(JSON.stringify(this.productDetailAttr));
                return; //如果编辑过，不用走下面的方法
            }
            this.handlerBoms('stonesBoms', 'stoneHeader');
            this.handlerBoms('goldBoms', 'goldHeader');
            this.handlerBoms('partBoms', 'partHeader');

            if (!this.tBaseBomEntity) {
                this.tBaseBomEntity = {};
            }
            Object.assign(this.tBaseBomEntity, {
                goldHeader: this.productDetailAttr.goldHeader,
                stoneHeader: this.productDetailAttr.stoneHeader,
                partHeader: this.productDetailAttr.partHeader
            });

            this.productDetailAttrTemp = JSON.parse(JSON.stringify(this.productDetailAttr));
        }
        ,
        handlerAllPartData(d) {//处理新增非成品时需要的数据
            let data = JSON.parse(JSON.stringify(d));
            Object.assign(this.productDetailAttr, {
                goodsMainType: this.goodsMainType,
                assistAttrs: data.assistAttrs,
                assistAttrsHeader: data.assistAttrsHeader || []
            });
            if (this.overEdit) {
                this.productDetailAttrTemp = JSON.parse(JSON.stringify(this.productDetailAttr));
                return; //如果编辑过，不用走下面的方法
            }

            this.handlerAssist();

            this.productDetailAttrTemp = JSON.parse(JSON.stringify(this.productDetailAttr));
        }
        ,
        handlerAssist() { //处理原料属性
            this.productDetailAttr.assistAttrs.map(item => {
                if (!item.attr) {
                    item.attr = [];
                }
                this.productDetailAttr.assistAttrsHeader.push(item.name);
                item.attr.push({
                    name: item.name,
                    options: item.tBaseAssistAttrValuess,
                    model: item.tBaseAssistAttrValuess.length === 1 ? item.tBaseAssistAttrValuess[0].value : ''
                });
            });
            Object.assign(this.myAssistAttrs, {
                assistAttrs: this.productDetailAttr.assistAttrs,
                assistAttrsHeader: this.productDetailAttr.assistAttrsHeader
            })
        }
        ,
        handlerBoms(bomsType, headerType) {//处理boms数据
            this.productDetailAttr[bomsType].map((item) => {//取头部并集
                item.assistAttrList.map((list, y) => {
                    if (this.productDetailAttr[headerType].indexOf(list.name) === -1) {
                        this.productDetailAttr[headerType].push(list.name);
                    }
                });
            });

            this.productDetailAttr[headerType].map((name, i) => {//将头部跟下拉选项一一对应起来
                this.productDetailAttr[bomsType].map((item, k) => {
                    if (!item.attr) {
                        item.attr = [];
                    }
                    let length = item.assistAttrList.length;
                    let haveValue = false;
                    for (let x = 0; x < length; x++) {
                        if (name === item.assistAttrList[x].name) {
                            let model = item.assistAttrList[x].tBaseAssistAttrValuess.length === 1 ? item.assistAttrList[x].tBaseAssistAttrValuess[0].value : '';
                            item.attr.push({
                                options: item.assistAttrList[x].tBaseAssistAttrValuess,
                                name: name,
                                model: model
                            });
                            haveValue = true;
                        }
                    }
                    if (!haveValue) {
                        item.attr.push([]);
                    }
                });
            });
            this.productDetailAttr[bomsType].map((item, k) => {
                if (bomsType === 'partBoms') {//单位转换
                    item.countUnitName = item.countUnitId && this.unitObj[item.countUnitId.toString()]
                } else if (bomsType === 'stonesBoms') {
                    item.weightUnitName = item.weightUnitId && this.unitObj[item.weightUnitId.toString()];
                    item.countUnitName = item.countUnitId && this.unitObj[item.countUnitId.toString()];
                } else if (bomsType === 'goldBoms') {
                    item.weightUnitName = item.weightUnitId && this.unitObj[item.weightUnitId.toString()];
                }
            })
        }
        ,
        handlerPartAttrs(myBoms, sourceBoms) {//处理后台返回的boms数据
            myBoms.map((item, index) => {
                item.partAttrs.map(list => {
                    if (!this.productDetailAttr[sourceBoms][index]) {
                        return;
                    }
                    this.productDetailAttr[sourceBoms].map((bom, y) => {//找到对应单据
                        if (bom.commodityCode === item.goodsCode) {
                            bom.attr.map((option) => {
                                if (list.attr === option.name) {
                                    option.model = list.attrValue;
                                }
                            });
                            if (sourceBoms === 'goldBoms' && bom.commodityCode === item.goodsCode) {//金料勾上选中那条
                                bom.checked = true;
                            }
                        }
                    })
                })
            });
        }
        ,
        handlerExcelImportAttrs(myBoms, sourceBoms) {//处理excel导入返回的boms数据
            let orginBoms = this.productDetailAttr[sourceBoms] || [];

            if (sourceBoms === 'partBoms') {
                return;
            } else if (sourceBoms == 'goldBoms') {
                if (Array.isArray(myBoms) && myBoms.length > 0) {
                    let goldBom = myBoms[0];
                    $.each(orginBoms, function (idx, bom) {
                        if (bom.commodityCode === goldBom.goodsCode) {
                            bom.checked = true;
                            bom.weight = goldBom.weight;
                            return;
                        }
                    });
                } else {
                    return;
                }
            } else if (sourceBoms == 'stonesBoms') {
                if (Array.isArray(myBoms) && myBoms.length > 0) {
                    $.each(orginBoms, function (idx, bom) {
                        $.each(myBoms, function (_idx, _bom) {
                            if (bom.id === _bom.id) {
                                bom.weight = _bom.weight;
                                $.each(bom.attr || [], function (idx, option) {
                                    $.each(_bom.partAttrs || [], function (idx, attr) {
                                        if (attr.attr === option.name) {
                                            option.model = attr.attrValue;
                                        }
                                    });
                                });
                            }
                        });
                    });
                } else {
                    return;
                }
            }

        }
        ,
        handlerLoss(data) { //处理修改状态下损耗的值；
            this.productDetailAttr.stonesBoms.map((item, index) => {
                if (data.stonesParts.length > 0) {
                    item.lose = data.stonesParts[index].stoneLoss === null ? item.lose : data.stonesParts[index].stoneLoss;
                    item.weightReference = data.stonesParts[index].weight === null ? item.weightReference : data.stonesParts[index].weight;
                    item.weight = this.isStock ? data.stonesParts[index].weight : '';
                }
            });

            this.productDetailAttr.goldBoms.map((item, index) => {
                if (data.goldParts.length > 0) {
                    let goodsCode = data.goldParts[0].goodsCode;
                    if (item.commodityCode === goodsCode) {
                        item.lose = data.goldParts[0].goldLoss === null ? item.lose : data.goldParts[0].goldLoss;
                        item.weightReference = data.goldParts[0].weight === null ? item.weightReference : data.goldParts[0].weight;
                        item.weight = this.isStock ? data.goldParts[0].weight : '';
                    }
                }
            });

            this.productDetailAttr.partBoms.map((item, index) => {
                if (data.partParts.length > 0) {
                    item.weightReference = data.partParts[index].weight === null ? item.weightReference : data.partParts[index].weight;
                }
            });

        },
        handlerExcelLoss(data) { //处理导入状态下损耗的值；
            this.productDetailAttr.stonesBoms.map((item) => {
                if (data.stonesParts.length > 0) {
                    data.stonesParts.map((stone) => {
                        if (item.id === stone.id) {
                            item.lose = stone.stoneLoss === null ? item.lose : stone.stoneLoss;
                            item.weightReference = stone.weight === null ? item.weightReference : stone.weight;
                            item.weight = this.isStock ? stone.weight : '';
                        }
                    });
                }
            });

            this.productDetailAttr.goldBoms.map((item, index) => {
                if (data.goldParts.length > 0) {
                    let goodsCode = data.goldParts[0].goodsCode;
                    if (item.commodityCode === goodsCode) {
                        item.lose = data.goldParts[0].goldLoss === null ? item.lose : data.goldParts[0].goldLoss;
                        item.weightReference = data.goldParts[0].weight === null ? item.weightReference : data.goldParts[0].weight;
                        item.weight = this.isStock ? data.goldParts[0].weight : '';
                    }
                }
            });

            //配件的赋值好像暂时不用先不改
            this.productDetailAttr.partBoms.map((item, index) => {
                if (data.partParts.length > 0) {
                    item.weightReference = data.partParts[index].weight === null ? item.weightReference : data.partParts[index].weight;
                }
            });

        },
        handlerEditSpecialAttr(data) { //处理特殊字段的值
            let This = this;
            //处理特殊情况下特殊字段
            let specialStone = [];
            let specialGold = [];
            let specialPart = [];

            This.specialAttr.stone.map(item => {
                specialStone.push(item.code);
            });
            This.specialAttr.gold.map(item => {
                specialGold.push(item.code);
            });
            This.specialAttr.part.map(item => {
                specialPart.push(item.code);
            });

            specialGold.map((key, y) => {
                this.productDetailAttr.goldBoms.map((item, index) => {
                    if (data.goldParts.length > 0) {
                        data.goldParts.map((gold, idx) => {
                            if (item.commodityCode == gold.goodsCode) {
                                item[key] = gold[key];
                            }
                        });
                    }
                });
            });
            specialStone.map((key, y) => {
                this.productDetailAttr.stonesBoms.map((item, index) => {
                    if (data.stonesParts.length > 0) {
                        data.stonesParts.map((stone, idx) => {
                            if (item.commodityCode == stone.goodsCode) {
                                item[key] = stone[key];
                            }
                        });
                    }
                });
            });
            specialPart.map((key, y) => {
                this.productDetailAttr.partBoms.map((item, index) => {
                    if (data.partParts.length > 0) {
                        data.partParts.map((part, idx) => {
                            if (item.commodityCode == part.goodsCode) {
                                item[key] = part[key];
                            }
                        });
                    }
                });
            });
        },
        validateOne(bomType) {//验证必填,金料有且只有一条
            let count = 0;
            if (this.orderStatus != 1 || this.dataSourceType || this.isOrderBom) {
                return false;
            }
            if (bomType === 'goldBoms' && this.productDetailAttr[bomType].length > 0) {
                this.productDetailAttr[bomType].map((item, index) => {
                    if (item.checked) {
                        count += 1;
                    }
                });
                if (!count) {
                    this.$Modal.error({
                        content: '金料有且只能选一条'
                    });
                    return true;
                }
            }
            return this.productDetailAttr[bomType].filter(item => item.attr).some((item, index) => {
                if (bomType === 'stonesBoms' && item.weightWay == 1) {
                    if (Number(item.weightReference) > item.weightUpper || Number(item.weightReference) < item.weightFloor) {
                        this.$Modal.info({
                            content: `石料第${index + 1}行重量输入有误，适用范围${item.weightFloor}--${item.weightReference}`
                        });
                        return true;
                    }
                }
                //采购入库单 字段校验 --- chenjian  2018-9-30 18:12:34
                if (this.isStock && bomType === 'stonesBoms') {
                    if (!item.weight) {
                        this.$Modal.info({
                            content: `请输入石料第${index + 1}行重量`
                        });
                        return true;
                    }
                    if (!item.price) {
                        this.$Modal.info({
                            content: `请输入石料第${index + 1}行单价`
                        });
                        return true;
                    }
                    if (!item.inPrice) {
                        this.$Modal.info({
                            content: `请输入石料第${index + 1}行进价`
                        });
                        return true;
                    }
                }
                if (this.isStock && bomType === 'partBoms') {
                    if (!item.price) {
                        this.$Modal.info({
                            content: `请输入配件第${index + 1}行单价`
                        });
                        return true;
                    }
                    if (!item.inPrice) {
                        this.$Modal.info({
                            content: `请输入配件第${index + 1}行进价`
                        });
                        return true;
                    }
                }
                if (this.isStock && bomType === 'goldBoms') {
                    if (item.checked && !item.weight) {
                        this.$Modal.info({
                            content: `请输入金料第${index + 1}行重量`
                        });
                        return true;
                    }
                    if (item.checked && !item.lose) {
                        this.$Modal.info({
                            content: `请输入金料第${index + 1}行金耗`
                        });
                        return true;
                    }
                }
                return item.attr.some((list, k) => {//下拉选项存在，没有选值，验证不通过；
                    let row = index + 1, col = k + 1, name = this.typeName[bomType];
                    if ((bomType !== 'goldBoms' && (list.options && !list.model)) || (bomType === 'goldBoms' && item.checked && (list.options && !list.model))) {
                        let mess = bomType === 'assistAttrs' ? `${name}的${list.name}必选` : `${name}第${row}行的${list.name}必选`
                        this.$Modal.info({
                            content: mess
                        });
                        return true;
                    }
                })
            })

        }
        ,
        validateAttrAndPart() {//验证原料或辅助属性是否都有填,成功为true
            if (this.goodsMainType === 'attr_ranges_goods') {
                return !this.validateOne('goldBoms') && !this.validateOne('stonesBoms') && !this.validateOne('partBoms');
            } else {
                return !this.validateOne('assistAttrs');
            }
        }
        ,
        modalOk() {
            if (this.orderStatus != 1 || this.isOrderBom) {
                this.$root.productDetailModal.showModal = false;
                this.showModal = false;
                this.$emit('no');
                return;
            }
            if (!this.validateAttrAndPart()) {//验证必填项
                return;
            }
            this.$root.productDetailModal.showModal = false;
            this.$emit('ok', JSON.parse(JSON.stringify(this.productDetailAttr)));

            //通过 判断 rate这个属性是否为null 决定是否需要进行单位换算
            if(this.rate !== null && this.goodsMainType === 'attr_ranges_goods'){
                this.calcTotal();
            }
        }
        ,
        modalCancel() {
            this.$emit('cancel');
            if (this.orderStatus != 1 || this.isOrderBom) {
                this.showModal = false;
                this.$root.productDetailModal.showModal = false;
                return;
            }
            let data = JSON.parse(JSON.stringify(this.productDetailAttrTemp));
            if (data) {
                this.tBaseBomEntity = data;
                this.myAssistAttrs = data;
                this.productDetailAttr = data;
            }
            this.$forceUpdate();
            this.$root.productDetailModal.showModal = false;
        }
        ,
        calcTotal() {
            const rate = 10000;
            let goldWeight = 0;
            let viceStoneWeight = 0;
            let mainStoneWeight = 0;
            let partWeight = 0;
            let totalWeight = 0;
            this.productDetailAttr.goldBoms.map(gold => {
                if (gold.checked) {
                    goldWeight += (Number(this.rate[gold.weightUnitId].conversionRateStr || 0) * rate * ((this.isStock ? gold.weight : gold.weightReference) || 0));
                }
            });
            this.productDetailAttr.stonesBoms.map(stone => {
                if (stone.partName == 1) {//主石
                    mainStoneWeight += (Number(this.rate[stone.weightUnitId].conversionRateStr || 0) * rate * ((this.isStock ? stone.weight :stone.weightReference) || 0)) * stone.count;
                } else {//副石
                    viceStoneWeight += (Number(this.rate[stone.weightUnitId].conversionRateStr || 0) * rate * ((this.isStock ? stone.weight :stone.weightReference) || 0)) * stone.count;
                }
            });
            this.productDetailAttr.partBoms.map(part => {
                partWeight += (Number(this.rate[part.weightUnitId].conversionRateStr || 0) * rate * (part.weightReference || 0)) * part.count;
            });

            totalWeight = goldWeight + viceStoneWeight + mainStoneWeight + partWeight;
            this.$emit('weight', {
                goldWeight: goldWeight / rate,
                viceStoneWeight: viceStoneWeight / rate,
                mainStoneWeight: mainStoneWeight / rate,
                partWeight: partWeight / rate,
                totalWeight: totalWeight / rate
            })

        },
        clearProductDetailAttr() {
            this.productDetailAttr = JSON.parse(JSON.stringify({
                goldBoms: [],
                stonesBoms: [],
                partBoms: [],
                assistAttrs: [],
                stoneHeader: [],
                goldHeader: [],
                partHeader: [],
                assistAttrsHeader: [],
            }))
        },
        initUnit() {
            let This = this;
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
                            let keyStr = item.id.toString();
                            let value = item.name;
                            This.unitObj[keyStr] = value;
                        })
                    } else {
                        This.$Modal.info(
                            {content: "网络异常,请联系技术人员！"}
                        );
                    }
                },
                error: function (err) {
                    This.$Modal.info(
                        {content: "网络异常,请联系技术人员！"}
                    );
                },
            });
        },
        onlyNumber(item, attr, floor, test) {//floor表示保留几位小数，test表示是否需要验证
            if (test === false) {//不需要验证
                return;
            }
            return htInputNumber(item, attr, floor);
        }
    },
    created() {
        this.initUnit();
    },
    watch: {},
    template: `<i-form label-width="120">
    <modal v-model="showModal" @on-cancel="modalCancel" :scrollable="true" @on-ok="modalOk" title="商品明细属性" 
    :mask-closable = "false"
                   width="90%">
                  <div class="productProperty"
                    style="overflow-x: scroll; overflow-y: visible;"
                     v-if="goodsMainType === 'attr_ranges_goods'">
                    <div class="ht-subtitle">
                        <div>金料</div>
                    </div>
                    <table class="edit-table">
                        <thead>
                        <th v-if="orderStatus ==1 && !isOrderBom"></th>
                        <th>商品编码</th>
                        <th>商品名称</th>
                        <th>成色</th>
                        <th>计重单位</th>
                        <th>重量</th>
                        <th>金耗</th>
                        <th v-for="item of specialAttr.gold" :key="item.code">{{item.name}}</th>
                        <th v-for="(item, index) in productDetailAttr.goldHeader" :key="index">{{item}}</th>
                        </thead>
                        <tbody>
                        <tr v-for="(item, index) in productDetailAttr.goldBoms" :key="index">
                            <td v-if="orderStatus ==1 && !isOrderBom"><Checkbox @on-change="goldCheckedChange($event, index)" v-model="item.checked" :disabled="item.checked"></Checkbox></td>
                            <td>{{item.commodityCode}}</td>
                            <td>{{item.commodityName}}</td>
                            <td>{{item.condition}}</td>
                            <td>{{item.weightUnitName}}</td>
                            <td>
                                <span v-if="!isStock">{{item.weightReference}}</span>
                                <input 
                                    class="ivu-input"
                                    v-if="isStock" 
                                    v-model="item.weight"
                                    @input="onlyNumber(item, 'weight', 2)"
                                    />
                            </td>
                            
                            <td>
                                <span v-if="!(orderStatus ==1 && !isOrderBom)">{{item.lose}}</span>
                                <input 
                                    class="ivu-input"
                                    v-if="orderStatus ==1 && !isOrderBom"  
                                    v-model="item.lose"
                                    @input="onlyNumber(item, 'lose', 2)"
                                    />
                              
                            </td>
                            <td v-for="key of specialAttr.gold" :key="key.code">
                                <span v-if="!key.edit">{{item[key.code]}}</span>
                                <i-input v-if="key.edit"  v-model="item[key.code]"></i-input>
                            </td>
                            <td v-for="(list, i) in item.attr" :key="i" v-if="orderStatus ==1 && !dataSourceType && !isOrderBom">
                                <i-select :disabled="!item.checked || !list.options" class="ht-width-input" v-model="list.model" transfer>
                                    <i-option v-for="(option, y) in list.options" :value="option.value" :key="y">
                                        {{option.value}}
                                    </i-option>
                                </i-select>
                            </td>
                            <td v-for="(list, i) in item.attr" :key="i" v-if="orderStatus !=1 || dataSourceType || isOrderBom">
                                {{list.attrValue}}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div class="ht-subtitle">
                        <div>石料</div>
                    </div>
                    <table class="edit-table">
                        <thead>
                        <!--固定项-->
                        <th>组成项</th>
                        <th>商品编码</th>
                        <th>商品名称</th>
                        <th>计数单位</th>
                        <th>数量</th>
                        <th>计重单位</th>
                        <th>重量</th>
                        <th>损耗</th>
                        <th v-for="item of specialAttr.stone" :key="item.code">{{item.name}}</th>
                        <th v-for="(item, index) in productDetailAttr.stoneHeader" :key="index">{{item}}</th>
                        </thead>
                        <tbody>
                        <tr v-for="(item, index) in productDetailAttr.stonesBoms" :key="index">
                            <td>{{item.partName == 1 ? '主石': '副石'}}</td>
                            <td>{{item.commodityCode}}</td>
                            <td>{{item.commodityName}}</td>
                            <td>{{item.countUnitName}}</td>
                            <td>{{item.count}}</td>
                            <td>{{item.weightUnitName}}</td>
                            <td>
                                <input 
                                    class="ivu-input"
                                    v-if="!isStock && item.weightWay == 1" 
                                    v-model="item.weightReference"
                                    :placeholder="item.weightFloor + '--' + item.weightUpper"
                                    @input="onlyNumber(item, 'weightReference', 2)"
                                />
                                <span v-if="!isStock && item.weightWay !=1">{{item.weightReference}}</span>
                                <input 
                                    class="ivu-input"
                                    v-if="isStock" 
                                    v-model="item.weight"
                                    @input="onlyNumber(item, 'weight', 2)"
                                />
                            </td>
                            <td>
                                <input 
                                    class="ivu-input"
                                    v-if="orderStatus ==1 && !isOrderBom" 
                                    v-model="item.lose" 
                                    @input="onlyNumber(item, 'lose', 2)"
                                    />
                                <span v-if="!(orderStatus ==1 && !isOrderBom)">{{item.lose}}</span>
                            </td>
                            <td v-for="key of specialAttr.stone" :key="key.code">
                                <input 
                                    class="ivu-input"
                                    v-if="key.edit"  
                                    v-model="item[key.code]" 
                                    @input="onlyNumber(item, key.code, 2, key.test)"
                                   />
                                <span v-if="!key.edit">{{item[key.code]}}</span>
                               
                            </td>
                            <td v-for="(list, i) in item.attr" :key="i" v-if="orderStatus ==1 && !dataSourceType && !isOrderBom">
                                <i-select class="ht-width-input" :disabled="!list.options" v-model="list.model" transfer>
                                    <i-option v-for="(option, y) in list.options" :value="option.value" :key="y">
                                        {{option.value}}
                                    </i-option>
                                </i-select>
                            </td>
                            <td v-for="(list, i) in item.attr" :key="i" v-if="orderStatus !=1 || dataSourceType || isOrderBom">
                                {{list.attrValue}}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div class="ht-subtitle">
                        <div>配件（其他）</div>
                    </div>
                    <table class="edit-table">
                        <thead>
                        <th>商品编码</th>
                        <th>商品名称</th>
                        <th>计数单位</th>
                        <th>数量</th>
                        <th>重量</th>
                        <th v-for="item of specialAttr.part" :key="item.code">{{item.name}}</th>
                        <th v-for="(item, index) in productDetailAttr.partHeader" :key="index">{{item}}</th>
                        </thead>
                        <tbody>
                        <tr v-for="(item, index) in productDetailAttr.partBoms" :key="index">
                            <td>{{item.commodityCode}}</td>
                            <td>{{item.commodityName}}</td>
                            <td>{{item.countUnitName}}</td>
                            <td>{{item.count}}</td>
                            <td>{{item.weightReference}}</td>
                            <td v-for="key of specialAttr.part" :key="key.code">
                                <input 
                                    class="ivu-input"
                                    v-if="key.edit"  
                                    v-model="item[key.code]"
                                    @input="onlyNumber(item, key.code, 2)"
                                    />
                                <span v-if="!key.edit">{{item[key.code]}}</span>
                               
                            </td>
                            <td v-for="(list, i) in item.attr" :key="i"  v-if="orderStatus ==1 && !dataSourceType && !isOrderBom">
                                <i-select class="ht-width-input" :disabled="!list.options" v-model="list.model" transfer>
                                    <i-option v-for="(option, y) in list.options" :value="option.value" :key="y">
                                        {{option.value}}
                                    </i-option>
                                </i-select>
                            </td>
                            <td v-for="(list, i) in item.attr" :key="i" v-if="orderStatus !=1 || dataSourceType || isOrderBom">
                                {{list.attrValue}}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="productProperty_material"
                     v-if="goodsMainType !== 'attr_ranges_goods'">
                    <table class="edit-table">
                        <thead>
                        <th v-for="(item, index) in productDetailAttr.assistAttrsHeader" :key="index">{{item}}</th>
                        </thead>
                        <tbody>
                        <tr v-if="orderStatus ==1 && !dataSourceType && !isOrderBom">
                         
                            <td v-for="(item, index) in productDetailAttr.assistAttrs" :key="index">
                                <div style="display: inline-block; width:140px;" >
                                    <div style="display: inline-block" v-for="(list, i) in item.attr" :key="i">
                                        <i-select class="ht-width-input" v-model="list.model" transfer>
                                            <i-option v-for="(option, y) in list.options" :value="option.value" :key="y">
                                                {{option.value}}
                                            </i-option>
                                        </i-select>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="orderStatus !=1 || dataSourceType || isOrderBom">
                        <td v-for="(item, index) in productDetailAttr.assistAttrs" :key="index">
                                <div style="display: inline-block;" >
                                <div style="display: inline-block; width: 140px; height:40px;box-sizing: border-box; border: 1px solid #C9C9C9; padding: 0 6px; line-height: 40px">
                                    {{item.attrValue}}
                                </div>
                            </div>
                        </td>
                        </tr>
                        </tbody>
                    </table>
                    
                </div>
                <div slot="footer">
                    <i-button type="text" size="large" @click="modalCancel">取消</i-button>
                    <i-button type="primary" size="large" @click="modalOk">确定</i-button>
                </div>
            </modal>
        </i-form>`
})