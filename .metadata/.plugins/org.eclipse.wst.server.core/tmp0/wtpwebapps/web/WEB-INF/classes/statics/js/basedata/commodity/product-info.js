var vmCommodity = new Vue({
    el: '#product-info',
    data() {
        let This = this;
        return {
            tempId: '',
            saveDisable: true,//保存按钮禁用
            isSearchHide: true, //搜索栏
            openTime: "",
            showName: false,
            showModal: false,
            selectOrginId: [],
            styleOnes: [],
            goldCondition: [],
            certificateType: [],//金料成色
            // 配置表头
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '组织名称',
                    key: 'orgName'
                }
            ],
            // 表格内数据,与表头对应
            colContent: [],
            showAttribate: true,
            showOn: true,
            showIsDefault: false,
            showIsType: false,
            user: {},
            logUrl: contextPath + "/tbasecustomer/changeLog?type=commodity&id=-1",
            off: false,
            isAdd: false,
            reload: false,
            reload_list: false,
            showSupplier: false,
            showStyleList: true,
            categoryName1: "",
            styleName1: "",
            organizationName: "",
            supplierUrl: "",
            unitWeightGroup: [],
            unitCountGroup: [],
            unitWeight: [],
            unitCount: [],
            selected: [],
            url: '',
            newStatus: [],
            newSeries: [],
            newCustomCode: [],
            selected_list: [],
            isShowMaterial: false,
            showDepartmentModal: false,
            department_selected: [],
            dataValue: [],
            body: {
                name: "",
                code: "",
                beforetime: "",
                aftertime: "",
                styleCode: "",
                customCode: "",
                series: [],
            },
            commodityseries: [],
            categoryList: [],
            //setting:配置相关
            setting1: {
                //注意：如果使用如上简单Json数据，以下data.simpleData.enable必须设置为true。
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "parentId",

                    },
                    key: {
                        name: 'name'
                    }
                },
                //callback内定义事件和回调函数，更多事件请参考官方文档。
                callback: {
                    onClick: this.clickEvent,
                }

            },
            setting2: {
                //注意：如果使用如上简单Json数据，以下data.simpleData.enable必须设置为true。
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "parentId",

                    },
                    key: {
                        name: 'depName'
                    }
                },
                //callback内定义事件和回调函数，更多事件请参考官方文档。
                callback: {
                    beforeClick(treeId, treeNode, clickFlag) {
                        return !treeNode.isParent; //当单击父节点，返回false，不让选取
                    },
                    beforeDblClick(treeId, treeNode) {
                        return !treeNode.isParent; //当双击父节点，返回false，不让选取
                    },
                    onClick: this.clickEvent1,
                }
            },
            tree: {
                id: "",
                name: "",
                customCode: ""

            },
            suppliernames: "",
            supplierReload: false,
            supplySearch: {
                supplierType: [],
                supplierLevel: [],
                mainProd: [],
                siShortName: "",
                commodityCategoryId: ""
            },
            mainProduct: [],
            supplierLevel: [],
            supplier_selected: [],

            supplierType: "",
            formType: [
                {
                    name: '副石',
                    value: "0",
                }, {
                    name: '主石',
                    value: "1",
                }
            ],
            weightWayArr: [
                {
                    name: '固定值',
                    value: 0,
                }, {
                    name: '范围值',
                    value: 1,
                }
            ],
            suppType: [
                {
                    name: '战略型',
                    code: '1'
                },
                {
                    name: '重点型',
                    value: '2'
                },
                {
                    name: '常规型',
                    code: '3'
                },
                {
                    name: '一般型',
                    code: '4'
                }
            ],
            mainType1: "",
            showMainType: true,
            commodityCategoty: [],
            commodity: {
                id: "",
                code: "",
                name: "",
                mainType: '',
                createOrganizationId: "",//创建组织
                commodityCategotyInfoId: "",//商品类型
                styleCategoryId: "",//款式类别
                specification: "",
                series: "",
                status: "",
                supplierId: "",
                weight: "",
                pricingType: "",
                weightGroupId: "",//计重单位组id
                weightUnitId: "",//计重单位id
                countGroupId: "",
                countUnitId: "",
                certificateType: "",
                remark: "",
                buyDepartment: "",
                buyer: "",
                accuracy: "",
                priceMethod: "",
                warehouseInfoId: "",//默认仓库
                repertoryPositionId: "",//默认库位
                isDefBatch: "",  //是否启用批次号0：未启用1：启用
                isDefStock: "",//是否库存管理0：未启用1：启用
                materiaMethod: "qj",//来料质检方式
                salesBackMethod: "qj",//退货质检方式
                stockMethod: "qj",//库存质检方式
                shipMethod: "qj",//发货质检方式
                maintainMethod: "qj",//维修质检方式
                otherMethod: "qj",//其他质检方式
                costPrice: "",//成本价
                lablePrice: "",//商品标签价格
                sellingPrice: "",
                certificatePrice: "",
                laborCharges: "",
                otherFee: "",
                salesRate: "",
                pictureId: "",
                isDel: 1,
                categoryCustomCode: "",//商品类型自定义code
                styleCustomCode: "",//款式类别自定义code
                organizationId: "",
                assistAttrs: [],
                tBaseBomEntity: {
                    countUnitId: '',
                    code: '',
                    createOrganizationId: '',
                    updateTime: '',
                    commodityId: '',
                    goldBoms: '',
                    partBoms: '',
                    type: '',
                    checkStatus: '',
                    createTime: '',
                    createId: '',
                    commodityCode: '',
                    id: '',
                    stonesBoms: '',
                    isDel: '',
                    commodityName: '',
                    goldBoms: [],
                    partBoms: [],
                    stonesBoms: []
                },
                frontPic: {},
                sidePic: {},
                downPic: {},
                tryPics: [],
                threeDPics: [],
                videos: [],
                delFiles: []
            },
            frontData: {
                type: 3 //这里改变一定的值
            },
            sideData: {
                type: 4 //这里改变一定的值
            },
            topData: {
                type: 5 //这里改变一定的值
            },
            tryData: {
                type: 6 //这里改变一定的值
            },
            threeDData: {
                type: 7 //这里改变一定的值
            },
            videoData: {
                type: 8 //这里改变一定的值
            },
            supplier_list: {
                url: contextPath + "/tbasecommodity/findBySupplier?ktcStatus=0",
                colNames: ['id', '编码', '简称', '主营商品', '商品名称'],
                colModel: [
                    { name: 'id', index: '', width: 0, align: "left", hidden: true },
                    { name: 'supplierCode', index: '', width: 130, align: "left" },
                    { name: 'siShortName', index: '', width: 200, align: "left" },
                    { name: 'mainProd', index: '', width: 250, align: "left" },
                    { name: 'supplierName', index: '', width: 0, align: "left", hidden: true },
                ],
            },
            change_log: {
                colNames: ['变更信息', '变更前', '变更后', '变更日期', '变更人'],
                colModel: [
                    { name: 'changeInfo', index: '', width: 150, align: "left" },
                    { name: 'operationBefore', index: '', width: 150, align: "left" },
                    { name: 'operationAfter', index: '', width: 150, align: "left" },
                    { name: 'operationTime', index: '', width: 150, align: "left" },
                    { name: 'userName', index: '', width: 150, align: "left" },
                ],
            },
            type: [
                {
                    value: 1,
                    label: '原料'
                },
                {
                    value: 'attr_ranges_goods',
                    label: '成品'
                },
                {
                    value: 'attr_ranges_other',
                    label: '其他'
                },
                {
                    value: 'attr_ranges_assets',
                    label: '资产'
                }
            ],
            mainType: "",
            materialType: [
                {
                    value: 'attr_ranges_gold',
                    label: '金料'
                },
                {
                    value: 'attr_ranges_stone',
                    label: '石料'
                },
                {
                    value: 'attr_ranges_part',
                    label: '配件'
                }
            ],
            buyers: [],
            treeNode1: "",
            buyDepartment: "",
            value1: 0,
            // 基本资料部分
            styleListData: [],
            productType: [],
            categoryType: [],
            //   将数据push到此数组中
            styleList: [],
            weightUnit: [],
            weightDetail: [],
            quantityUnit: [
                {
                    name: '数量组',
                    value: 11,
                    children: [
                        {
                            value: 1,
                            label: '个'
                        },
                        {
                            value: 2,
                            label: '件'
                        }
                    ]
                },
                {
                    name: '重量组',
                    value: 12,
                    children: [
                        {
                            value: 1,
                            label: '克'
                        },
                        {
                            value: 2,
                            label: '克拉'
                        }
                    ]
                },
            ],
            quantityDetail: [],
            isWeightUnit: false,
            isQuantityUnit: false,
            baseBody: {
                productType: '',
                styleType: '',
                spec: '',
                productSet: '',
                productStatus: '',
                supplier: '',
                weight: '',
                weightUnit: '',
                weightDetail: '',
                quantityUnit: '',
                quantityDetail: '',
                remark: ''
            },
            // 质检资料
            qualityCheckBody: {
                incoming: '',
                stock: '',
                maintain: '',
                returnGoods: '',
                delivery: '',
                other: '',
            },
            qualityCheckWays: [],
            // 财务材料
            financeBody: {
                costPrice: '',
                salePrice: '',
                tagPrice: '',
                certificationFee: ''
            },
            // 辅助属性
            natureTable: [
                {
                    title: '编号',
                    key: 'code',
                    align: 'center'
                },
                {
                    title: '辅助属性',
                    key: 'name',
                    align: 'center'
                },
                {
                    title: '启用',
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
            ],
            natureTableCol: [],
            detailsNatureData: [],
            targetDetailsNature: [],
            //bom资料
            inputcontent: '',
            isCheckedAll: false,
            isCheckedAllStone: false,
            isCheckedAllPart: false,
            loadingItem: false,
            checkGold: [],
            checkStone: [],
            checkPart: [],
            goldTableHeader: [],
            stonesTableHeader: [],
            partTableHeader: [],
            itemList: [],
            itemStoneList: [],
            itemPartList: [],
            goldBoms: [],
            goldRow: {
                isPush: '',
                commodityCode: '',
                commodityName: '',
                weightUnitId: '',
                weightReference: '',
                weightFloor: '',
                weightUpper: '',
                lose: '',
                processCost: '',
                pureWeight: '',
                assistAttrList: []
            },
            goldAssistAttr: [],
            goldAssistAttrAll: [],
            stonesAssistAttr: [],
            stonesAssistAttrAll: [],
            stonesBoms: [],
            stonesRow: {
                isPush: '',
                partName: '',
                commodityCode: '',
                commodityName: '',
                countUnitId: '',
                count: '',
                weightWay: '',
                weightUnitId: '',
                weightReference: '',
                weightFloor: '',
                weightUpper: '',
                lose: '',
                assistAttrList: []
            },
            partAssistAttr: [],
            partAssistAttrAll: [],
            partBoms: [],
            partRow: {
                id: '',
                bomId: '',
                organizationId: '',
                commodityCode: '',
                commodityName: '',
                commodityId: '',
                weightGroupId: '',
                countGroupId: '',
                countUnitId: '',
                weightUnitId: '',
                weightReference: '',
                count: '',
                assistAttrList: []
            },
            partAssistAttr: [],
            partAssistAttrAll: [],
            data_config_list: {
                url: contextPath + '/tbasecommodity/list?ktcStatus=0',
                colNames: ['图片', '商品编码', '商品名称', '商品类型', '款式类别', '金大祥编码', '规格', '状态'],
                colModel: [
                    {
                        name: 'url', index: 'remark', width: 200, align: "center",
                        formatter: function (ellvalue, options, rowObject) {
                            $(".list-area").off('mouseout', '.can').on('mouseout', '.can', function (e) {
                                $(`.bigimg`).css({
                                    left: -99999 + 'px'
                                }).attr("src", "").hide();
                            });
                            $(".list-area").off('mouseover', '.can img').on('mouseover', '.can img', function (e) {
                                let $this = $(e.target);
                                let scrolltop = $(window).scrollTop();
                                let left = $this.offset().left + 100 + "px";
                                let top = $this.offset().top - scrolltop + 'px';
                                let url = $this.attr("src");
                                $(`.bigimg`).css({
                                    top: top,
                                    left: left
                                }).attr("src", url).show()
                            })
                            let url = "";
                            if (rowObject.frontPic) {
                                url = rowObject.frontPic.fdUrl;
                            }
                            if (!url && rowObject.downPic) {
                                url = rowObject.downPic.fdUrl;
                            }
                            if (!url && rowObject.downPic) {
                                url = rowObject.downPic.fdUrl;
                            }
                            let noPicUrl = 'http://' + window.location.host + contextPath + '/images/no_pic.png'
                            if (url) {
                                return `<div class="select${rowObject.id} can">
                                    <img height="50px" width="50px" src="${url}"/>
                                </div>`;
                            } else {
                                return `<div class="select${rowObject.id} can"><img height="50px" width="50px" src="${noPicUrl}"/></div>`;
                            }
                        }
                    },
                    {
                        name: 'code',
                        index: 'invdate',
                        width: 150,
                        align: "left",
                        formatter: function (value, grid, rows, state) {
                            console.log(value);
                            let val = rows.code;
                            var cssClass = ".detail" + value;
                            $(document).off('click', cssClass).on('click', cssClass, function () {
                                vmCommodity.view(rows);
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        }
                    },
                    { name: 'name', index: 'name', width: 150, align: "left" },
                    { name: 'categoryName', index: 'exchangeRate', width: 200, align: "left" },
                    { name: 'styleName', index: 'status', width: 200, align: "left" },
                    { name: 'jdxCode', index: 'jdxCode', width: 200, align: "left" },
                    { name: 'specification', index: 'precisions', width: 200, align: "left" },
                    {
                        name: 'status', index: 'remark', width: 250, sortable: false, align: "left",
                        formatter: function (ellvalue, options, rowObject) {
                            let vl = "";
                            for (var i = 0; i < vmCommodity.newStatus.length; i++) {
                                if (rowObject.status == vmCommodity.newStatus[i].value) {
                                    vl = vmCommodity.newStatus[i].name;
                                    break;
                                }
                            }
                            return vl;
                        }
                    },
                ]
            },
            treeSetting: {
                callback: {
                    onClick: this.treeClick,
                }
            },
            // 物流资料
            costMethod: [],
            locatorList: [],
            locatorList1: [],
            storageList: [],
            logisticsBody: {
                purchaseDep: '',
                purchaseAgent: '',
                precision: '',
                locator: '',
                costMethod: '',
                storage: '',
                isBatch: '',
                storageAge: ''
            },
            /* itemPhoto: {
                 imgUrl: this.imgExample.imgUrl,
                 imgName: this.imgExample.imgName,
             },
             imgofurl: '',
             photoName: '',
             visible: false*/
        }
    },
    created() {
        this.init();
        this.loadSytleCategory();
        this.loadCommodityCategory();
        this.loadStyleList();
        this.loadData();
        this.loadCategoryList();
    },
    methods: {
        isSkip() {

            //从其他页面跳转到详情页
            let param = window.parent.params.params;
            if (param && param.type == "skip" && param.id) {
                this.view(param, 1);
            }
        },
        handleFormatError(file) {
            this.$Modal.error({
                content: '文件格式不正确,请重新选择',
            });
        },
        handleMaxSize(file) {
            this.$Modal.error({
                content: '文件过大,请重新选择',
            });
        },
        hideSearch() {
            this.isSearchHide = !this.isSearchHide;
            $(".chevron").css("top", "")
        },
        showOrgin() {
            if (this.selected.length == 0) {
                this.$Modal.info({
                    title:'提示信息',
                    content:"请选择行!"
                })
                return;
            }
            if (!this.$refs.baseDataListRef.jdxCodeTip()) {
                return;
            }
            this.showModal = true;
        },
        okModel() {
            if (this.selectOrginId.length == 0) {
                this.$Modal.info({
                    title:'提示信息',
                    content:"请选择分配组织!"
                })
                return;
            }
            let param = {
                ids: {},
                orginIds: {}
            }
            param.ids = this.selected.join(',');
            param.orginIds = this.selectOrginId.join(',');
            this.cancelModel();
            let that = this;
            $.ajax({
                type: "POST",
                url: contextPath + '/tbasecommodity/allot',
                traditional: true,
                // contentType: 'application/json',
                datatype: "json",//请求数据返回的类型。可选json,xml,txt
                data: param,
                success: function (result) {
                    if (result.code === "100100") {
                        that.$Modal.success({
                            title:'提示信息',
                            content:"分配成功!"
                        })
                        that.selectOrginId = [];
                    } else {
                        that.$Modal.info({
                            title:'提示信息',
                            content:result.msg
                        })
                    }
                },
                error: function (err) {
                    that.$Modal.error({
                        title:'提示信息',
                        content:"服务器出错"
                    })
                },
            });
        },
        cancelModel() {
            this.selectOrginId = [];
            this.$refs.test.selectAll(false);
            this.showModal = false;
        },
        changeselect(selection) {
            // 获取勾选的行数据
            for (let i = 0; i < selection.length; i++) {
                this.selectOrginId.push(selection[i].id);
            }
        },
        // 动态列select的option值的生成
        initBom(bomdata, header, attrAll) {
            for (let i = 0; i < bomdata.length; i++) {
                let arr = bomdata[i].assistAttrList;
                let length = arr.length;
                attrAll.push(arr);
                for (let k = 0; k < header.length; k++) {
                    header[k].data[i] == [];
                    for (let j = 0; j < length; j++) {
                        if (arr[j].id === header[k].id) {
                            header[k].data.splice(i, 1, arr[j].tBaseAssistAttrValuess)
                        }
                    }
                }
            }
        },
        // 所有的动态双向绑定
        allTable(header, attr, bom) {
            bom.map((el, i) => {
                this.initTableData(header, attr)
            })
        },
        // 双向数据绑定回显内容
        showSelectOption(bom, attr) {
            bom.map((el, i) => {
                el.assistAttrList.map((val, idx) => {
                    attr[i].map((value, index) => {
                        if (value.id === val.id) {
                            value.attrValueIds = val.attrValueIds;
                        }
                    })
                })
            })
        },

        // 生成list
        itemGoldList(bom, list) {
            bom.map((el, i) => {
                let {
                    commodityCode: code,
                    commodityName: name,
                    commodityId: id
                } = el;
                list.push([{
                    code,
                    name,
                    id
                }])
            })
        },
        // 生成石料list
        itemListStone(bom, list) {
            bom.map((el, i) => {
                let {
                    commodityCode: code,
                    commodityName: name,
                    commodityId: id
                } = el;
                list.push([{
                    code,
                    name,
                    id
                }])
            })
        },
        frontHandleSuccess(result) {
            if (result.code === "100100") {
                this.commodity.frontPic = result.data;
            }

        },
        sideHandleSuccess(result) {
            if (result.code === "100100") {
                this.commodity.sidePic = result.data;
            }

        },
        topHandleSuccess(result) {
            if (result.code === "100100") {
                this.commodity.downPic = result.data;
            }

        },
        tryHandleSuccess(result) {
            if (result.code === "100100") {
                this.commodity.tryPics.push(result.data);

            }

        },
        threeDHandleSuccess(result) {
            if (result.code === "100100") {
                this.commodity.threeDPics.push(result.data);

            }

        },
        videoHandleSuccess(result) {
            if (result.code === "100100") {
                this.commodity.videos.push(result.data);
            }

        },
        delFile(type, fileArr) {
            if (!this.commodity.delFiles) {
                this.commodity.delFiles = [];
            }

            if (fileArr == null) {
                let fileTemp = {};
                if (type == 3) {
                    fileTemp = this.commodity.frontPic;
                    this.commodity.frontPic = {};
                } else if (type == 4) {
                    fileTemp = this.commodity.sidePic;
                    this.commodity.sidePic = {};
                } else if (type == 5) {
                    fileTemp = this.commodity.downPic;
                    this.commodity.downPic = {};
                }
                this.commodity.delFiles.push(fileTemp);
            } else {
                let fileTemp = fileArr[type];
                fileArr.splice(type, 1);
                this.commodity.delFiles.push(fileTemp);
            }
        },
        //金料bom校验
        validateGoldBoms() {
            let This = this;
            let goldBomsTemp = this.goldBoms;
            if (goldBomsTemp.length == 0) {
                return true;
            }
            let weightGroupId = this.commodity.weightGroupId;
            let weightUnitId = this.commodity.weightUnitId;
            let flag = true;
            $.each(goldBomsTemp, function (i, item) {
                if (!item.commodityId) {
                    This.$Modal.info({
                        title:'提示信息',
                        content:'金料bom第' + (i + 1) + '行数据未选择商品'
                    })
                    flag = false;
                    return false;
                }
                if (!item.weightGroupId && !item.weightUnitId) {
                    This.$Modal.info({
                        title:'提示信息',
                        content:'金料bom第' + (i + 1) + '行计量单位未选择'
                    })
                    flag = false;
                    return false;
                }
                if (weightGroupId != item.weightGroupId) {
                    This.$Modal.info({
                        title:'提示信息',
                        content:'金料bom第' + (i + 1) + '行重量组单位和商品不一致，请重新选择！'
                    })
                    flag = false;
                    return false;
                }
                if (!item.weightReference) {
                    This.$Modal.info({
                        title:'提示信息',
                        content:'金料bom第' + (i + 1) + '行数据重量参考值不能为空'
                    })
                    flag = false;
                    return false;
                }

                if (item.lose && (isNaN(item.lose) || item.lose < 0 || item.lose > 100)) {
                    This.$Modal.info({
                        title:'提示信息',
                        content:'金料bom第' + (i + 1) + '行的损耗值不合法 ，必须在0-100之间'
                    })
                    flag = false;
                    return false;
                }
            })
            return flag;
        },
        //金料bom校验
        validateStoneBoms() {
            let This = this;
            let stonesBomsTemp = this.stonesBoms;
            if (stonesBomsTemp.length == 0) {
                return true;
            }
            let weightGroupId = this.commodity.weightGroupId;
            let flag = true;
            let num = 0;
            $.each(stonesBomsTemp, function (i, item) {
                num = num + eval(item.partName);
                if (num > 1) {
                    This.$Modal.info({
                        title:'提示信息',
                        content:"石料bom只能存在一个主石!"
                    })
                    flag = false;
                    return false;
                }
                if (!item.commodityId) {
                    This.$Modal.info({
                        title:'提示信息',
                        content:'石料bom第' + (i + 1) + '行数据未选择商品'
                    })
                    flag = false;
                    return false;
                }
                if (!item.weightGroupId && !item.weightUnitId) {
                    This.$Modal.info({
                        title:'提示信息',
                        content:'石料bom第' + (i + 1) + '行【计重单位】未选择'
                    })
                    flag = false;
                    return false;
                }
                if (weightGroupId != item.weightGroupId) {
                    This.$Modal.info({
                        title:'提示信息',
                        content:'石料bom第' + (i + 1) + '行重量组单位和商品不一致，请重新选择！'
                    })
                    flag = false;
                    return false;
                }
                if (!item.countGroupId && !item.countUnitId) {
                    This.$Modal.info({
                        title:'提示信息',
                        content:'石料bom第' + (i + 1) + '行【计数单位】未选择'
                    })
                    flag = false;
                    return false;
                }
                if (item.weightWay === 0 && !item.weightReference) {
                    This.$Modal.info({
                        title:'提示信息',
                        content:'石料bom第' + (i + 1) + '行数 【重量参考值】不能为空'
                    })
                    flag = false;
                    return false;
                }
                if (item.weightWay === 1 && !item.weightUpper && !item.weightUpper) {
                    This.$Modal.info({
                        title:'提示信息',
                        content:'石料bom第' + (i + 1) + '行数【重量上下限】不能为空'
                    })
                    flag = false;
                    return false;
                }
                if (!item.count) {
                    This.$Modal.info({
                        title:'提示信息',
                        content:'石料bom第' + (i + 1) + '行数【数量】不能为空'
                    })
                    flag = false;
                    return false;
                }
                if (item.lose && (isNaN(item.lose) || item.lose < 0 || item.lose > 100)) {
                    This.$Modal.info({
                        title:'提示信息',
                        content:'石料bom第' + (i + 1) + '行的损耗值不合法 ，必须在0-100之间'
                    })
                    flag = false;
                    return false;
                }
            })
            return flag;
        },
        //配件bom校验
        validatePartBoms() {
            let This = this;
            let weightGroupId = this.commodity.weightGroupId;
            let partBomsTemp = this.partBoms;
            if (partBomsTemp.length == 0) {
                return true;
            }
            let flag = true;
            $.each(partBomsTemp, function (i, item) {
                if (!item.commodityId) {
                    This.$Modal.info({
                        title:'提示信息',
                        content:'配件bom第' + (i + 1) + '行数据未选择商品'
                    })
                    flag = false;
                    return false;
                }
                /*    if (!item.countGroupId && !item.countUnitId) {
                        layer.alert('配件bom第' + (i + 1) + '行【计数单位】未选择', {icon: 0});
                        flag = false;
                        return false;
                    }*/
                if (item.weightWay === 0 && !item.weightReference) {
                    This.$Modal.info({
                        title:'提示信息',
                        content:'配件bom第' + (i + 1) + '行数 【重量参考值】不能为空'
                    })
                    flag = false;
                    return false;
                }
                if (!item.count) {
                    This.$Modal.info({
                        title:'提示信息',
                        content:'配件bom第' + (i + 1) + '行数据【数量】不能为空'
                    })
                    flag = false;
                    return false;
                }
                if (!item.weightGroupId && !item.weightUnitId) {
                    This.$Modal.info({
                        title:'提示信息',
                        content:'配件bom第' + (i + 1) + '行数据【计重单位】不能为空'
                    })
                    flag = false;
                    return false;
                }
                if (weightGroupId != item.weightGroupId) {
                    This.$Modal.info({
                        title:'提示信息',
                        content:'配件bom第' + (i + 1) + '行重量组单位和商品不一致，请重新选择！'
                    })
                    flag = false;
                    return false;
                }
            })
            return flag;
        },
        loadData() {
            var That = this;
            // That.certificateType = getCodeList("base_certificate_type");//加载证书类型
            That.certificateType = getCodeList("base_Condition");//加载金料成色
            That.costMethod = getCodeList("root_base_priceType");//加载计价方式
            let ways = getCodeList("zj_zjfs");//加载质检方式
            $.each(ways, function (i, o) {
                That.qualityCheckWays.unshift(o);
            });
            That.newStatus = getCodeList("root_base_goodsState");//加载商品状态
            That.newSeries = getCodeList("root_base_goodsSeries");//加载商品系列


            $.ajax({
                url: contextPath + '/tbasecommodity/data',
                type: 'POST',
                dataType: "json",
                success(r) {
                    if (r.code == 100100) {
                        That.mainProduct = r.data.mainProduct;
                        That.supplierLevel = r.data.supplierLevel;
                        That.locatorList = r.data.locatorList;
                        That.locatorList1 = r.data.locatorList1;
                        That.organizationName = r.data.orgName;
                        That.commodity.organizationId = r.data.organId;
                        let orgnArr = r.data.organList;
                        let organId = r.data.organId;
                        let index = -1;
                        for (let i = 0; i < orgnArr.length; i++) {
                            if (organId == orgnArr[i].id) {
                                index = i;
                                break;
                            }
                        }
                        orgnArr.splice(index, 1);
                        That.colContent = orgnArr;
                    }
                },
                error() {
                    that.$Modal.error({
                        title:'提示信息',
                        content:"服务器出错"
                    })
                }
            });
        },
        initStyleListData() {
            this.styleListData.push({
                data: ''
            })
        },
        loadStyleList() {
            var That = this;
            $.ajax({
                url: contextPath + '/tbasestylecategory/list?parentId=1&ktcStatus=0',
                type: 'POST',
                dataType: "json",
                success(r) {
                    That.styleOnes = r.data;
                    That.styleList.push(r.data);
                    That.initStyleListData()
                },
                error() {
                    that.$Modal.error({
                        title:'提示信息',
                        content:"服务器出错"
                    })
                }
            });
        },
        getStaff() {
            //console.log("我改变了");
        },
        loadCategoryList() {
            var That = this;
            $.ajax({
                url: contextPath + '/tbasecommoditycategory/queryAllList',
                type: 'POST',
                dataType: "json",
                success(r) {
                    That.categoryList = r.data;
                    That.$refs.my_tree.nodeData = That.categoryList;
                    That.$refs.my_tree.loadData();
                },
                error() {
                    that.$Modal.error({
                        title:'提示信息',
                        content:"服务器出错"
                    })
                }
            });
        },
        loadCommodityCategory() {
            var That = this;
            $.ajax({
                url: contextPath + '/tbasecommoditycategory/listByAll?parentId=0',
                type: 'POST',
                dataType: "json",
                success(r) {
                    That.categoryType = That.initGoodCategory(r.data.cateLists)
                },
                error() {
                    that.$Modal.error({
                        title:'提示信息',
                        content:"服务器出错"
                    })
                }
            });
        },
        loadSytleCategory() {
            var That = this;
            $.ajax({
                url: contextPath + '/tbasestylecategory/listByAll?customCode=0.&ktcStatus=0',
                type: 'POST',
                dataType: "json",
                success(r) {
                    if (r.code === '100100') {
                        That.productType = That.initGoodStyle(r.data.styles)
                    }
                },
                error() {
                    that.$Modal.error({
                        title:'提示信息',
                        content:"服务器出错"
                    })
                }
            });
        },
        getTreeData(test) {
            //console.log(test)
        },
        searchSupplier() {
            var This = this;
            var arr1 = [].concat(This.supplySearch.supplierLevel);
            var arr2 = [].concat(This.supplySearch.supplierType);
            var arr3 = [].concat(This.supplySearch.mainProd);
            this.supplySearch.supplierType = this.supplySearch.supplierType.length > 0 ? this.supplySearch.supplierType.join(",") : "";
            this.supplySearch.supplierLevel = this.supplySearch.supplierLevel.length > 0 ? this.supplySearch.supplierLevel.join(",") : "";
            this.supplySearch.mainProd = this.supplySearch.mainProd.length > 0 ? this.supplySearch.mainProd.join(",") : "";
            if (This.commodity.commodityCategotyInfoId) {
                this.supplySearch.commodityCategoryId = This.commodity.commodityCategotyInfoId;
            }
            this.supplierReload = !this.supplierReload;
            setTimeout(function () {
                This.supplySearch.supplierLevel = arr1;
                This.supplySearch.supplierType = arr2;
                This.supplySearch.mainProd = arr3;
            }, 10);
        },
        clearSupplier() {
            this.supplySearch = {
                supplierType: [],
                supplierLevel: [],
                mainProd: [],
                siShortName: "",
                commodityCategoryId: ""
            };
        },
        openSupplier() {
            if (!this.showIsDefault) {
                this.clearSupplier();
                if (this.commodity.commodityCategotyInfoId) {
                    this.supplySearch.commodityCategoryId = this.commodity.commodityCategotyInfoId;
                }
                this.supplierReload = !this.supplierReload;
                this.showSupplier = true;
            }
        },
        ok() {
            let ids = [];
            let names = [];
            for (var i = 0; i < this.supplier_selected.length; i++) {
                if ($.type(this.supplier_selected[i]) === 'string') {
                    var supplier = JSON.parse(this.supplier_selected[i]);
                    ids.push(supplier.id);
                    names.push(supplier.supplierName)
                } else if ($.type(this.supplier_selected[i]) === 'object') {
                    ids.push(this.supplier_selected[i].id);
                    names.push(this.supplier_selected[i].supplierName)
                }

            }
            this.commodity.supplierId = ids.length > 0 ? JSON.stringify(ids) : "";
            this.suppliernames = names.length > 0 ? names.join(",") : "";
        },
        ok1() {
            let That = this;
            That.commodity.buyer = "";
            let tree = this.treeNode1;
            if (tree != null) {
                this.buyDepartment = tree.depName;
                let id = tree.id;
                this.commodity.buyDepartment = id;
                That.getbuyers(id);
            }
        },
        getbuyers(id) {
            let _this = this;
            $.ajax({
                type: "post",
                url: contextPath + "/tbasecommodity/queryAllEmpByDeptId?id=" + id,
                contentType: 'application/json',
                dataType: "json",
                async: false,
                success: function (r) {
                    if (r.code === "100100") {
                        let arr = r.data;
                        _this.buyers = r.data;
                    } else {
                        _this.$Modal.error({
                            title:'提示信息',
                            content:"服务器出错"
                        })
                    }
                },
                error: function (err) {
                    _this.$Modal.error({
                        title:'提示信息',
                        content:"服务器出错"
                    })
                },
            });

        },
        cancel() {

        },
        changeStyleList(e, index) {
            if (!e) {
                return;
            }
            var That = this;
            if (That.commodity.mainType == "attr_ranges_goods") {
                if (That.styleList.length > 0) {
                    //获取第一个编码
                    for (var i = 0; i < That.styleList[0].length; i++) {
                        if (That.styleList[0][i].id == e) {
                            var arr = That.commodity.name.split(" ");
                            That.commodity.name = arr[0] + " " + That.styleList[0][i].styleName;
                        }
                    }
                    if (index < 3) {
                        if (That.styleList[index].length > 0) {
                            for (var i = 0; i < That.styleList[index].length; i++) {
                                if (That.styleList[index][i].id == e) {
                                    That.styleList[index][i].codingCodeRules;
                                    if (index == 0) {
                                        var v1 = That.commodity.code.substring(0, 1);
                                        That.commodity.code = v1 + That.styleList[index][i].codingCodeRules;
                                        var v1 = That.commodity.code.substring(0, 1);
                                    } else if (index == 1) {
                                        var v2 = That.commodity.code.substring(0, 2);
                                        That.commodity.code = v2 + That.styleList[index][i].codingCodeRules;
                                    } else if (index == 2) {
                                        var v3 = That.commodity.code.substring(0, 3);
                                        That.commodity.code = v3 + That.styleList[index][i].codingCodeRules;
                                    }

                                }
                            }
                        }
                    }
                }
            }
            let tmp = this.styleList.length - 1;
            That.styleList.splice(index + 1, tmp)
            That.styleListData.splice(index + 1, tmp)
            $.ajax({
                url: contextPath + '/tbasestylecategory/list?ktcStatus=0&parentId=' + e,
                type: 'POST',
                async: false,
                dataType: "json",
                success(r) {
                    if (r.data != null) {
                        if (r.data.length > 0) {
                            That.styleList.push(r.data);
                            That.initStyleListData()
                        } else {
                            for (var i = 0; i < That.styleList[index].length; i++) {
                                if (That.styleList[index][i].id == e) {
                                    That.commodity.styleCategoryId = That.styleList[index][i].id;
                                    That.commodity.styleCustomCode = That.styleList[index][i].customCode;
                                    if (That.commodity.mainType == "attr_ranges_goods") {
                                        That.getCode(That.commodity.code);
                                    }

                                }
                            }
                        }
                    }
                },
                error() {
                    That.$Modal.error({
                        title:'提示信息',
                        content:"服务器出错"
                    })
                }
            });
        },
        getCode(code) {
            var That = this;
            if (!code || code.length != 4) {
                That.commodity.styleCategoryId = "";
                That.commodity.styleCustomCode = "";
                That.$Modal.info({
                    title:'提示信息',
                    content:"商品款式类别必须选择三级!"
                })
                return;
            }
            //发送ajax请求编码
            $.ajax({
                url: contextPath + '/tbasecommodity/getCode',
                type: 'POST',
                dataType: "json",
                data: { "code": code, "mainType": That.commodity.mainType },
                success(r) {
                    if (r.data != null) {
                        That.commodity.code = r.data;
                    }
                },
                error() {
                    that.$Modal.error({
                        title: '提示信息',
                        content: "服务器出错"
                    })
                }
            });

        },
        changeDate(value) {
            this.body.beforetime = value[0] == "" ? "" : (value[0].replace(/\//g, '-') + ' 00:00:00');
            this.body.aftertime = value[1] == "" ? "" : (value[1].replace(/\//g, '-') + ' 23:59:59');
        },
        search() {
            var This = this;
            if (This.newCustomCode.length > 0) {
                This.body.styleCode = This.newCustomCode[this.newCustomCode.length - 1];
            } else {
                This.body.styleCode = "";
            }
            var arr = [].concat(This.body.series);
            This.body.series = This.body.series.length > 0 ? This.body.series.join(",") : "";
            This.reload = !this.reload;
            setTimeout(function () {
                This.body.series = arr;
            }, 10);
        },
        clickEvent(event, treeId, treeNode) {
            vmCommodity.body.customCode = treeNode.customCode;
            vmCommodity.search();
        },
        clickEvent1(event, treeId, treeNode) {
            this.treeNode1 = treeNode;

        },
        //点击事件，把值赋值给商品系列
        changeSeries() {
            vmCommodity.commodity.series = JSON.stringify(vmCommodity.commodityseries);
        },
        init() {
            let that = this;
            //初始化单位组
            $.ajax({
                type: 'POST',
                url: contextPath + '/tbaseunitgroup/listByNoPage',
                success: function (result) {
                    if (result.code == "100100") {
                        vmCommodity.weightUnit = result.data;
                        vmCommodity.quantityUnit = result.data;
                    }
                    else {
                        that.$Modal.error({
                            title:'提示信息',
                            content:result.message
                        })
                    }
                }
            })

            // 初始化表头
            $.ajax({
                url: contextPath + '/tBaseAssistAttr/queryAll?rangeUse=attr_ranges_gold&ktcStatus=0',
                type: 'POST',
                dataType: "json",
                success(data) {
                    that.goldTableHeader = that.sortTabalHeader(data.data);
                },
                error() {
                    that.$Modal.error({
                        title:'提示信息',
                        content:"服务器出错"
                    })
                }
            })
            $.ajax({
                url: contextPath + '/tBaseAssistAttr/queryAll?rangeUse=attr_ranges_stone&ktcStatus=0',
                type: 'POST',
                dataType: "json",
                success(data) {
                    that.stonesTableHeader = that.sortTabalHeader(data.data);
                },
                error() {
                    that.$Modal.error({
                        title:'提示信息',
                        content:"服务器出错"
                    })
                }
            })
            $.ajax({
                url: contextPath + '/tBaseAssistAttr/queryAll?rangeUse=attr_ranges_part&ktcStatus=0',
                type: 'POST',
                dataType: "json",
                success(data) {
                    that.partTableHeader = that.sortTabalHeader(data.data);
                },
                error() {
                    that.$Modal.error({
                        title:'提示信息',
                        content:"服务器出错"
                    })
                }
            })

        },
        // 处理
        getNextOption(value) {
            // 调用接口获取下一级数据
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
        initGoodStyle(type) {
            let result = [];

            type.forEach((item) => {
                let {
                    customCode: value,
                    styleName: label,
                    styles: children
                } = item

                if (children) {
                    children = this.initGoodStyle(children)
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
        del() {
            var That = this;
            if (That.selected.length < 1) {
                That.$Modal.info({
                    title:'提示信息',
                    content:"请至少选择一条数据"
                })
                return;
            }

            if (!this.$refs.baseDataListRef.jdxCodeTip()) {
                return;
            }

            this.$Modal.confirm({
                title:'提示信息',
                content:'当前数据有可能被引用，会影响数据准确性，确认是否删除？',
                onOk:() => {
                    $.ajax({
                        type: "post",
                        url: contextPath + "/tbasecommodity/delete",
                        data: JSON.stringify(That.selected),
                        contentType: 'application/json',
                        success: function (r) {
                            That.selected = [];
                            if (r.code == "100100") {
                                setTimeout(function(){
                                    That.$Modal.success({
                                        title:'提示信息',
                                        content:"删除成功！"
                                    })
                                    That.selected = [];
                                    That.reload = !That.reload;
                                },300)
                            } else {
                                setTimeout(function(){
                                    that.$Modal.error({
                                        title:'提示信息',
                                        content:r.msg
                                    })
                                },300)
                            }
                        }
                    });
                }
            })

            /*
            layer.confirm('当前数据有可能被引用，会影响数据准确性，确认是否删除？', {
                btn: ['确定', '取消'], btn1: function (index) {
                    if (That.selected.length > 0) {
                        $.ajax({
                            type: "post",
                            url: contextPath + "/tbasecommodity/delete",
                            data: JSON.stringify(That.selected),
                            contentType: 'application/json',
                            success: function (r) {
                                That.selected = [];
                                if (r.code == "100100") {
                                    That.$Modal.success({
                                        title:'提示信息',
                                        content:"删除成功!"
                                    })
                                    That.selected = [];
                                    That.reload = !That.reload;
                                } else {
                                    that.$Modal.error({
                                        title:'提示信息',
                                        content:r.msg
                                    })
                                }
                            }
                        });
                    }
                    layer.close(index);
                },
                btn2: function (index) {
                    layer.close(index);
                }
            });
            */
        },
        update() {

        },
        changeType(e) {
            var _t = e;
            let tmp = this.styleList.length - 1;
            if (e == "attr_ranges_goods") {
                this.mainType = "";
                this.showName = true;
                this.showAttribate = false;
                this.showMainType = true;
                this.isShowMaterial = false;
                this.commodity.mainType = _t;
                this.commodity.name = "";
                this.commodity.code = "";
                this.commodityCategoty = [];
                this.styleListData.splice(1, tmp)
                this.styleList.splice(1, tmp)
                this.styleListData[0] = { data: "" }
                /*this.styleList = [];
                this.styleList.push(this.styleOnes);*/
            } else {
                this.mainType = '';
                this.showAttribate = true;
                this.showName = false;
                this.commodity.code = "";
                this.commodity.name = "";
                if (e == 1) {
                    this.commodity.mainType = "";
                    this.isShowMaterial = true;
                } else {
                    this.isShowMaterial = false;
                    this.commodity.mainType = _t;
                }
                this.showMainType = false;

            }
        },
        changeCategory(e) {
            let That = this;
            That.showStyleList = true;
            That.commodity.categoryCustomCode = e[e.length - 1];
            $.ajax({
                type: "POST",
                url: contextPath + "/tbasecommoditycategotyinfo/infoByCustomCode?customCode=" + That.commodity.categoryCustomCode,
                dataType: "json",
                async: false,
                success: function (r) {
                    if (r.code === "100100") {
                        if (r.data != null) {
                            That.$nextTick(function () {
                                if (!r.data.codingCodeRules) {
                                    That.commodityCategoty = [];
                                    That.$Modal.info({
                                        title:'提示信息',
                                        content:"请选择商品类型明细!"
                                    })
                                    return;
                                }
                                if (That.commodity.mainType == "attr_ranges_goods") {

                                    if (That.commodity.code) {
                                        let categortCode = That.commodity.code.substring(1);
                                        if (r.data.codingCodeRules) {
                                            That.commodity.code = r.data.codingCodeRules + categortCode;
                                        } else {
                                            That.commodity.code = "";
                                            That.commodity.name = "";
                                            That.commodityCategoty = [];
                                            let tmp = That.styleList.length - 1;
                                            That.styleListData.splice(1, tmp);
                                            That.styleList.splice(1, tmp);
                                            That.styleListData[0] = { data: "" };
                                            That.$Modal.info({
                                                title:'提示信息',
                                                content:"请选择商品类型明细!"
                                            })
                                            return;
                                        }
                                    } else {
                                        if (r.data.codingCodeRules) {
                                            That.commodity.code = r.data.codingCodeRules;
                                        } else {
                                            That.commodityCategoty = [];
                                            That.commodity.name = "";
                                            That.$Modal.info({
                                                title:'提示信息',
                                                content:"请选择商品类型明细!"
                                            })
                                            return;
                                        }
                                    }
                                    if (That.commodity.name) {
                                        var arr = That.commodity.name.split(" ");
                                        if (arr[1]) {
                                            That.commodity.name = r.data.name + arr[1];
                                        } else {
                                            That.commodity.name = r.data.name;
                                        }
                                    } else {
                                        That.commodity.name = r.data.name;
                                    }
                                } else {
                                    if (!r.data.codingCodeRules) {
                                        That.commodityCategoty = [];
                                        That.$Modal.info({
                                            title:'提示信息',
                                            content:"请选择商品类型明细!"
                                        })
                                    }

                                }
                                console.log(r.data);
                                That.commodity.pricingType = r.data.pricingType;
                                That.commodity.categoryCustomCode = r.data.customCode;
                                That.commodity.commodityCategotyInfoId = r.data.id;
                                if (r.data.weightGroupId) {
                                    That.commodity.weightGroupId = r.data.weightGroupId;
                                    That.chooseUnit(That.commodity.weightGroupId);
                                    That.commodity.weightUnitId = r.data.weightUnitId;
                                }
                                if (r.data.countGroupId) {
                                    That.commodity.countGroupId = r.data.countGroupId;
                                    That.chooseQuantityUnit(That.commodity.countGroupId);
                                    That.commodity.countUnitId = r.data.countUnitId;
                                }

                            })

                        } else {
                            That.commodityCategoty = [];
                            That.$Modal.info({
                                title:'提示信息',
                                content:"请选择商品类型明细!"
                            })
                            return;

                        }
                    } else {
                        That.$Modal.error({
                            title:'提示信息',
                            content:"服务器出错"
                        })
                    }
                },
                error: function (err) {
                    That.$Modal.error({
                        title:'提示信息',
                        content:"服务器出错"
                    })
                },
            });
        },
        chooseUnit(key) {
            var that = this;
            that.commodity.weightUnitId = ''
            for (let i = 0; i < that.weightUnit.length; i++) {
                if (that.weightUnit[i].id === key) {
                    that.weightDetail = that.weightUnit[i].tBaseUnits;
                    break;
                }
            }

        },
        chooseQuantityUnit(key) {
            var that = this;
            that.commodity.countUnitId = '';
            for (let i = 0; i < that.quantityUnit.length; i++) {
                if (that.quantityUnit[i].id === key) {
                    that.quantityDetail = that.quantityUnit[i].tBaseUnits;
                    break;
                }
            }

        },
       
       
        valdateCommodityId(arr, index, id) {
            let that = this;
            for (let i = 0; i < arr.length; i++) {
                if (i == index) continue;
                if (arr[i].commodityId == id) {
                    that.$Modal.info({
                        title:'提示信息',
                        content:"该商品已存在，请重新选择!"
                    })
                    return false;
                }
            }
            return true;
        },
        getGoldItem(data, index) {
            let res = data.data;
            this.goldBoms[index].commodityId = res.id;
            this.goldBoms[index].weightGroupId = res.weightGroupId;
            this.goldBoms[index].weightUnitId = res.weightUnitId;
            this.goldBoms[index].commodityCode = res.code;
            this.goldBoms[index].commodityName = res.name;
            this.goldBoms[index].condition = res.certificateType;
            
            this.initOneBom(res.assistAttrs, this.goldTableHeader, this.goldAssistAttrAll, index, this.goldAssistAttr)
        },
        getPartItem(data, index) {
            let res = data.data;
            this.partBoms[index].weightGroupId = res.weightGroupId;
            this.partBoms[index].weightUnitId = res.weightUnitId;
            this.partBoms[index].countGroupId = res.countGroupId;
            this.partBoms[index].countUnitId = res.countUnitId;
            this.partBoms[index].commodityId = res.id;
            this.partBoms[index].commodityCode = res.code;
            this.partBoms[index].commodityName = res.name;

            this.initOneBom(res.assistAttrs, this.partTableHeader, this.partAssistAttrAll, index, this.partAssistAttr)
        },
        getStoneItem(data, index) {
            let res = data.data;
            this.stonesBoms[index].weightGroupId = res.weightGroupId;
            this.stonesBoms[index].weightUnitId = res.weightUnitId;
            this.stonesBoms[index].countGroupId = res.countGroupId;
            this.stonesBoms[index].countUnitId = res.countUnitId;
            this.stonesBoms[index].commodityId = res.id;
            this.stonesBoms[index].commodityCode = res.code;
            this.stonesBoms[index].commodityName = res.name;

            this.initOneBom(res.assistAttrs, this.stonesTableHeader, this.stonesAssistAttrAll, index, this.stonesAssistAttr)
        },
        initBomBack(commodity) {
            let data = commodity.tBaseBomEntity;
            if (!data) {
                return;
            }

            let that = this;
            that.itemList = [];
            that.goldBoms = [];

            that.itemStoneList = [];
            that.stonesBoms = [];

            that.itemPartList = [];
            that.partBoms = [];

            that.goldBoms = data.goldBoms
            that.allTable(that.goldTableHeader, that.goldAssistAttr, that.goldBoms)
            that.itemGoldList(that.goldBoms, that.itemList)
            that.showSelectOption(that.goldBoms, that.goldAssistAttr)
            that.initBom(that.goldBoms, that.goldTableHeader, that.goldAssistAttrAll)

            that.backPush(that.goldBoms, that.goldTableHeader);

            that.stonesBoms = data.stonesBoms
            that.allTable(that.stonesTableHeader, that.stonesAssistAttr, that.stonesBoms)
            that.itemListStone(that.stonesBoms, that.itemStoneList)
            that.showSelectOption(that.stonesBoms, that.stonesAssistAttr)
            that.initBom(that.stonesBoms, that.stonesTableHeader, that.stonesAssistAttrAll)
            that.backPush(that.stonesBoms, that.stonesTableHeader);

            that.partBoms = data.partBoms
            that.allTable(that.partTableHeader, that.partAssistAttr, that.partBoms)
            that.itemGoldList(that.partBoms, that.itemPartList)
            that.showSelectOption(that.partBoms, that.partAssistAttr)
            that.initBom(that.partBoms, that.partTableHeader, that.partAssistAttrAll)
            that.backPush(that.partBoms, that.partTableHeader);


        },
        backPush(bomList, header) {
            if (bomList && header) {
                for (let i = 0; i < header.length; i++) {
                    for (let j = 0; j < bomList.length; j++) {
                        let flag = false;
                        for (let k = 0; k < bomList[j].assistAttrList.length; k++) {
                            if (header[i].id === bomList[j].assistAttrList[k].id) {
                                if (bomList[j].assistAttrList[k].isPush === 1) {
                                    header[i].isPush = true;
                                    flag = true;//终止两层循环
                                    break;
                                }
                            }
                        }
                        if (flag) {
                            break;
                        }
                    }
                }
            }
        },
        view(rows) {
            var That = this;
            That.showIsDefault = true;
            That.showMainType = true;
            That.showIsType = true;
            That.saveDisable = false;
            That.isAdd = true;
            That.showName = true;
            That.infoById(rows.id, 1);
        },
        modify(obj) {
            let That = this;
            if (!this.$refs.baseDataListRef.jdxCodeTip()) {
                return;
            }
            if (That.selected.length == 1) {
                That.showIsDefault = false;
                That.showMainType = true;
                this.showIsType = true;
                That.isAdd = true;
                That.infoById(That.selected[0], 2)
            } else {
                That.$Modal.info({
                    title:'提示信息',
                    content:"请选择一条数据!"
                })
            }
        },
        infoById(id, obj) {
            let That = this;
            That.logUrl = contextPath + "/tbasecustomer/changeLog?type=commodity&id=" + id + "&nd=" + new Date().getTime();
            $.ajax({
                type: "post",
                url: contextPath + "/tbasecommodity/info/" + id,
                contentType: 'application/json',
                success: function (r) {
                    if (r.code == "100100") {
                        if (r.data.mainType == "attr_ranges_goods") {
                            That.initBomBack(r.data);
                        } else {
                            That.initAttr(r.data.mainType);
                            let assistAttrs = r.data.assistAttrs;
                            let temp = [];
                            if (assistAttrs) {
                                assistAttrs.map((item) => {
                                    That.natureTableCol.map(val => {
                                        if (item.id === val.id) {
                                            val._checked = true;
                                        }
                                    })
                                    if (item && item.attrValueIds) {
                                        let attrId = item.id;
                                        item.attrValueIds.map((node) => {
                                            let ids = attrId + "-" + node;
                                            temp.push(ids);
                                        })
                                    }
                                })
                            }
                            That.targetDetailsNature = temp;
                        }


                        if (r.data.mainType != "attr_ranges_goods") {
                            if (r.data.mainType == "attr_ranges_gold" || r.data.mainType == "attr_ranges_stone" || r.data.mainType == "attr_ranges_part") {
                                That.mainType1 = 1;
                                That.mainType = r.data.mainType;
                                That.isShowMaterial = true;
                                if (obj != 1) {
                                    That.showName = false;
                                }

                            } else {
                                That.mainType1 = r.data.mainType;
                                That.isShowMaterial = false;
                                if (obj != 1) {
                                    That.showName = false;
                                }
                            }
                        } else {
                            That.mainType1 = r.data.mainType;
                            That.isShowMaterial = false;
                            That.showName = true;
                        }
                        That.showMainType = true;
                        That.showIsType = true;
                        if (r.data.departmentName) {
                            That.buyDepartment = r.data.buyDepartment;
                            That.getbuyers(r.data.buyDepartment);
                        }
                        That.categoryName1 = r.data.categoryName;
                        That.styleName1 = r.data.styleName;
                        if (r.data.series) {
                            let se = JSON.parse(r.data.series);
                            That.commodityseries = se;
                        }
                        if (r.data.supplierName) {
                            That.suppliernames = r.data.supplierName;
                        }
                        if (r.data.warehouseInfoId) {
                            That.commodity.warehouseInfoId = r.data.warehouseInfoId;
                        }
                        if (r.data.repertoryPositionId) {
                            That.commodity.repertoryPositionId = r.data.repertoryPositionId;
                        }
                        if (r.data.weightGroupId) {
                            That.chooseUnit(r.data.weightGroupId);
                        }
                        if (r.data.countGroupId) {
                            That.chooseQuantityUnit(r.data.countGroupId);
                        }

                        That.commodity = r.data;
                        if (r.data.buyer) {
                            let by1 = r.data.buyer.replace("[", "").replace("]", "");
                            if (by1) {
                                let by3 = by1.replace('/"', "").split(",");
                                let by2 = [];
                                for (var i = 0; i < by3.length; i++) {
                                    if (parseInt(by3[i])) {
                                        by2.push(parseInt(by3[i]));
                                    }
                                }
                                if (by2.length > 0) {
                                    That.commodity.buyer = by2;
                                }
                            }
                        }
                    }
                }
            });
        },

        copy() {
            let That = this;

            if (!this.$refs.baseDataListRef.jdxCodeTip()) {
                return;
            }

            That.showIsDefault = false;
            if (That.selected.length == 1) {
                That.showMainType = false;
                That.showIsType = false;
                That.showIsDefault = false;
                That.isAdd = true;
                $.ajax({
                    type: "post",
                    url: contextPath + "/tbasecommodity/info/" + That.selected[0],
                    contentType: 'application/json',
                    success: function (r) {
                        if (r.code == "100100") {

                            if (r.data.mainType == "attr_ranges_goods") {
                                That.initBomBack(r.data);
                            } else {
                                That.initAttr();
                                let assistAttrs = r.data.assistAttrs;
                                let temp = [];
                                if (assistAttrs) {
                                    assistAttrs.map((item) => {
                                        if (item && item.attrValueIds) {
                                            let attrId = item.id;
                                            item.attrValueIds.map((node) => {
                                                let ids = attrId + "-" + node;
                                                temp.push(ids);
                                            })
                                        }
                                    })
                                }
                                That.targetDetailsNature = temp;
                            }

                            if (r.data.mainType != "attr_ranges_goods") {
                                if (r.data.mainType == "attr_ranges_gold" || r.data.mainType == "attr_ranges_stone" || r.data.mainType == "attr_ranges_part") {
                                    That.mainType1 = 1;
                                    That.mainType = r.data.mainType;
                                    That.isShowMaterial = true;
                                    That.showName = false;
                                } else {
                                    That.mainType1 = r.data.mainType;
                                    That.isShowMaterial = false;
                                    That.showName = false;
                                }
                            } else {
                                That.mainType1 = r.data.mainType;
                                That.showMainType = true;
                                That.isShowMaterial = false;
                                That.showName = true;
                            }
                            console.log(r.data);
                            That.buyDepartment = r.data.buyDepartment;
                            if(That.buyDepartment){
                                That.getbuyers(r.data.buyDepartment);
                            }
                            That.categoryName1 = r.data.categoryName;
                            That.styleName1 = r.data.styleName;
                            if (r.data.series) {
                                let se = JSON.parse(r.data.series);
                                That.commodityseries = se;
                            }
                            if (r.data.supplierName) {
                                That.suppliernames = r.data.supplierName;
                            }
                            if (r.data.warehouseInfoId) {
                                That.commodity.warehouseInfoId = r.data.warehouseInfoId;
                            }
                            if (r.data.repertoryPositionId) {
                                That.commodity.repertoryPositionId = r.data.repertoryPositionId;
                            }
                            if (r.data.weightGroupId) {
                                That.chooseUnit(r.data.weightGroupId);
                            }
                            if (r.data.countGroupId) {
                                That.chooseQuantityUnit(r.data.countGroupId);
                            }
                            That.commodity = r.data;
                            That.commodity.styleCustomCode = "";
                            That.commodity.styleCategoryId = "";
                            That.commodity.categoryCustomCode = "";
                            That.commodity.commodityCategotyInfoId = "";
                            That.commodity.id = "";
                            That.commodity.name = "";
                            That.commodity.code = "";

                            //清空图片
                            That.commodity.frontPic = {},
                                That.commodity.sidePic = {},
                                That.commodity.downPic = {},
                                That.commodity.tryPics = [],
                                That.commodity.threeDPics = [],
                                That.commodity.videos = [],
                                That.commodity.delFiles = []
                            if (r.data.buyer) {
                                if (r.data.buyer) {
                                    let by1 = r.data.buyer.replace("[", "").replace("]", "");
                                    if (by1) {
                                        let by3 = by1.replace('/"', "").split(",");
                                        let by2 = [];
                                        for (var i = 0; i < by3.length; i++) {
                                            if (parseInt(by3[i])) {
                                                by2.push(parseInt(by3[i]));
                                            }
                                        }
                                        if (by2.length > 0) {
                                            That.commodity.buyer = by2;
                                        }
                                    }
                                }

                            }

                            //清空附件绑定
                            if (That.commodity.pictureId) {

                                That.commodity.pictureId = '';
                                if (That.commodity.frontPic) {
                                    That.commodity.frontPic.fdId = '';
                                }
                                if (That.commodity.sidePic) {
                                    That.commodity.sidePic.fdId = '';
                                }
                                if (That.commodity.downPic) {
                                    That.commodity.downPic.fdId = '';
                                }
                                if (That.commodity.tryPics && That.commodity.tryPics.length > 0) {
                                    for (let item in That.commodity.tryPics) {
                                        if (item) {
                                            item.fdId = '';
                                        }
                                    }
                                }
                                if (That.commodity.threeDPics && That.commodity.threeDPics.length > 0) {
                                    for (let item in That.commodity.tryPics) {
                                        if (item) {
                                            item.fdId = '';
                                        }
                                    }
                                }
                                if (That.commodity.videos && That.commodity.videos.length > 0) {
                                    for (let item in That.commodity.tryPics) {
                                        if (item) {
                                            item.fdId = '';
                                        }
                                    }
                                }

                            }
                        }
                    }
                });
            } else {
                That.$Modal.info({
                    title:'提示信息',
                    content:"请选择一条数据进行复制!"
                })
            }
        },

        searchItemCode(query) {
            this.inputcontent = query;
        },
        clearSelect(list, i) {
            list[i].length = 0;
        },
        // 为动态表头数据添加属性，用于动态列值的对应
        sortTabalHeader(header) {
            header.map((item) => {
                item["data"] = [];
                item["isPush"] = false;
            })
            return header;
        },
        // 动态生成动态数据的select双向数据绑定list
       
        initTableData(header, attr) {
            let arr = [];
            for (let i = 0; i < header.length; i++) {
                arr.push({
                    attrValueIds: '',
                    id: header[i].id,
                    isPush: ''
                })
            }
            attr.push(arr);
        },
        // 此方法用于对应动态列select的option值的生成

        initOneBom(bomdata, header, attrAll, index, attr) {
            for (let k = 0; k < header.length; k++) {
                // 初始化挂空
                header[k].data[index] = [];
                for (let i = 0; i < bomdata.length; i++) {
                    // “所有”情况预存
                    attrAll[index] = bomdata;
                    if (bomdata[i].id === header[k].id) {
                        attr[index][k].attrValueIds = ["-1"]
                        header[k].data.splice(index, 1, bomdata[i].tBaseAssistAttrValuess)
                    }
                }
            }
        },
        // 返回数据处理
        backBom(bomlist, attr, attrAll, header) {
            for (let i = 0; i < attr.length; i++) {
                let arr = attr[i];
                bomlist[i].assistAttrList = [];// 修改时先清空 后添加
                // bomlist[i].isPush = bomlist[i].isPush ? 1 : 0;
                for (let j = 0; j < arr.length; j++) {
                    if (arr[j].attrValueIds.indexOf("-1") > -1) {
                        for (let k = 0; k < attrAll[i].length; k++) {
                            if (attrAll[i][k].id === arr[j].id) {
                                bomlist[i].assistAttrList.push(attrAll[i][k])
                            }
                        }
                    } else {
                        bomlist[i].assistAttrList.push(arr[j])
                    }
                }
            }
            // 剪枝
            bomlist.map((el, i) => {
                for (let i = el.assistAttrList.length - 1; i >= 0; i--) {
                    if (el.assistAttrList[i].attrValueIds === '') {
                        el.assistAttrList.splice(i, 1)
                    }
                }
            })

            // 推送前端判定
            header.map((el, i) => {
                bomlist.map((val, idx) => {
                    val.assistAttrList.map((value, index) => {
                        if (el.id === value.id) {
                            value.isPush = el.isPush ? 1 : 0;
                        }
                    })
                })
            })

        },

        addGoldRow() {
            if (!this.validateGoldBoms()) {
                return;
            }
            ;
            this.goldBoms.push(
                {
                    isPush: '',
                    commodityCode: '',
                    condition: '',
                    commodityName: '',
                    commodityId: '',
                    weightUnitId: '',
                    weightReference: '',
                    weightFloor: '',
                    weightUpper: '',
                    lose: '',
                    processCost: '',
                    pureWeight: '',
                    assistAttrList: []
                }
            );
            this.itemList.push([]);
            this.initTableData(this.goldTableHeader, this.goldAssistAttr)
            // this.getOption(this.itemList.length - 1, 1);
        },
        delGoldRow() {
            let arr = this.checkGold.sort().reverse();
            arr.map((el, i) => {
                this.goldBoms.splice(el, 1);
                this.goldAssistAttr.splice(el, 1);
                this.goldTableHeader.map((value, i) => {
                    value.data.splice(el, 1);
                })
                this.itemList.splice(el, 1)
            })
            this.checkGold = [];
        },
        delStoneRow() {
            let arr = this.checkStone.sort().reverse();
            arr.map((el, i) => {
                this.stonesBoms.splice(el, 1);
                this.stonesAssistAttr.splice(el, 1);
                this.stonesTableHeader.map((value, i) => {
                    value.data.splice(el, 1);
                })
                this.itemStoneList.splice(el, 1)
            })
            this.checkStone = [];
        },
        delPartRow() {
            let arr = this.checkPart.sort().reverse();
            arr.map((el, i) => {
                this.partBoms.splice(el, 1);
                this.partAssistAttr.splice(el, 1);
                this.partTableHeader.map((value, i) => {
                    value.data.splice(el, 1);
                })
                this.itemPartList.splice(el, 1)
            })
            this.checkPart = [];
        },
        addStoneRow() {
            if (!this.validateStoneBoms()) {
                return;
            }
            this.itemStoneList.push([]);
            this.stonesBoms.push(
                {
                    bomId: '',
                    isPush: '',
                    partName: 0,
                    commodityCode: '',
                    commodityName: '',
                    countUnitId: '',
                    countGroupId: '',
                    weightGroupId: '',
                    count: '',
                    weightWay: 0,
                    weightUnitId: '',
                    weightReference: '',
                    weightFloor: '',
                    weightUpper: '',
                    lose: '',
                    assistAttrList: []
                }
            );
            this.initTableData(this.stonesTableHeader, this.stonesAssistAttr);
            // this.getOption(this.itemStoneList.length - 1, 2);
        },
        cancle() {
            window.parent.closeCurrentTab({ exit: true, openTime: this.openTime })
        },
        addPartRow() {
            if (!this.validatePartBoms()) {
                return;
            }
            this.itemPartList.push([]);
            this.partBoms.push(
                {
                    id: '',
                    bomId: '',
                    organizationId: '',
                    commodityCode: '',
                    commodityName: '',
                    commodityId: '',
                    weightGroupId: '',
                    countGroupId: '',
                    countUnitId: '',
                    weightUnitId: '',
                    weightReference: '',
                    count: '',
                    assistAttrList: []
                }
            );
            this.initTableData(this.partTableHeader, this.partAssistAttr);
            // this.getOption(this.itemPartList.length - 1, 3);
        },
        test() {
            let that = this;
            // bom部分的内容，需要更改触发位置
            $.ajax({
                url: '',
                type: 'POST',
                dataType: "json",
                success(data) {
                    that.initBom(data.data.goldBoms, that.goldTableHeader, that.goldAssistAttrAll)
                    that.initBom(data.data.stonesBoms, that.stonesTableHeader, that.stonesAssistAttrAll)

                },
                error() {
                    that.$Modal.info({
                        title:'提示信息',
                        content:"网络异常，请重试！!"
                    })
                }
            })
        },
        changeMainType() {
            if (this.mainType) {
                this.commodity.mainType = this.mainType;
            }
            if (this.commodity.mainType == "attr_ranges_gold"
                || this.commodity.mainType == "attr_ranges_stone"
                || this.commodity.mainType == "attr_ranges_part"
                || this.commodity.mainType == "attr_ranges_other"
            ) {
                this.initAttr();
            }
        },
        initAttr(mainType) {
            let that = this;
            //清空辅助属性
            that.assistAttr = [];
            let mainTypeTemp = this.commodity.mainType || mainType;
            // 初始化辅助属性
            $.ajax({
                url: contextPath + '/tBaseAssistAttr/queryAll?ktcStatus=0&rangeUse=' + mainTypeTemp,
                type: 'POST',
                dataType: "json",
                async: false,
                success(data) {
                    let tempData = data.data;
                    tempData.map(val => {
                        val._checked = false;
                        val._disabled = true;
                    })
                    that.natureTableCol = tempData;
                },
                error() {
                    that.$Modal.info({
                        title:'提示信息',
                        content:"网络异常，请重试！!"
                    })
                }
            })
        },
        clickOne(index) {
            if (this.checkGold.indexOf(index) > -1) {
                let i = this.checkGold.indexOf(index)
                this.checkGold.splice(i, 1)
            } else {
                this.checkGold.push(index);
            }

            if (this.goldBoms.length === this.checkGold.length) {
                this.isCheckedAll = true;
            } else {
                this.isCheckedAll = false;
            }
        },
        clickOneStone(index) {
            if (this.checkStone.indexOf(index) > -1) {
                let i = this.checkStone.indexOf(index)
                this.checkStone.splice(i, 1)
            } else {
                this.checkStone.push(index);
            }

            if (this.stonesBoms.length === this.checkStone.length) {
                this.isCheckedAllStone = true;
            } else {
                this.isCheckedAllStone = false;
            }
        },
        clickOnePart(index) {
            if (this.checkPart.indexOf(index) > -1) {
                let i = this.checkPart.indexOf(index)
                this.checkPart.splice(i, 1)
            } else {
                this.checkPart.push(index);
            }

            if (this.partBoms.length === this.checkPart.length) {
                this.isCheckedAllPart = true;
            } else {
                this.isCheckedAllPart = false;
            }
        },
        checkAllGold() {
            // this.isCheckedAll = !this.isCheckedAll;
            if (!this.isCheckedAll) {
                this.checkGold = []
                this.goldBoms.forEach((el, i) => {
                    this.checkGold.push(i)
                })
            } else {
                this.checkGold = []
            }
        },
        checkAllStone() {
            if (!this.isCheckedAllStone) {
                this.checkStone = []
                this.stonesBoms.forEach((el, i) => {
                    this.checkStone.push(i)
                })
            } else {
                this.checkStone = []
            }
        },
        checkAllPart() {
            if (!this.isCheckedAllPart) {
                this.checkPart = []
                this.partBoms.forEach((el, i) => {
                    this.checkPart.push(i)
                })
            } else {
                this.checkPart = []
            }
        },
        vWeight() {
            if (this.commodity.weight) {
                let val = this.commodity.weight;
                this.vDouble(val);
            }
        },
        vCostPrice() {
            if (this.commodity.costPrice) {
                let val = this.commodity.costPrice;
                this.vDouble(val);
            }
        },
        vSelling() {
            if (this.commodity.sellingPrice) {
                let val = this.commodity.sellingPrice;
                this.vDouble(val);
            }
        },
        vLablePrice() {
            if (this.commodity.lablePrice) {
                let val = this.commodity.lablePrice;
                this.vDouble(val);
            }
        },
        vCertificate() {
            if (this.commodity.certificatePrice) {
                let val = this.commodity.certificatePrice;
                this.vDouble(val);
            }

        },
        votherFee() {
            if (this.commodity.otherFee) {
                let val = this.commodity.otherFee;
                this.vDouble(val);
            }
        },
        vlaborCharges() {
            if (this.commodity.laborCharges) {
                let val = this.commodity.laborCharges;
                this.vDouble(val);
            }
        },
        vsalesRate() {
            if (this.commodity.salesRate) {
                let val = this.commodity.salesRate;
                this.vDouble(val);
            }
        },
        vDouble(val) {
            var reg = /^[0-9]+([.]{1}[0-9]+){0,1}$/;
            if (!reg.test(val)) {
                this.$Modal.info({
                    title:'提示信息',
                    content:"请输入正确的数字!"
                })
                return;
            }
        },
        vInteger() {
            var reg = /^-?\d+$/;
            var val = this.commodity.accuracy;
            if (val) {
                if (!reg.test(val)) {
                    this.$Modal.info({
                        title:'提示信息',
                        content:"请输入整数!"
                    })
                    return;
                }
            }
        },
        /* locatorChange(e) {
             let _this = this;
             _this.commodity.repertoryPositionId = "";
             $.ajax({
                 type: "POST",
                 url: contextPath + "/tbasecommodity/queryByWareHouse?id=" + e,
                 contentType: 'application/json',
                 dataType: "json",
                 async: false,
                 success: function (r) {
                     if (r.code === "100100") {
                         _this.storageList = r.data;
                     } else {
                         layer.alert("服务层错误,请联系技术人员！", { icon: 0 });
                     }
                 },
                 error: function (err) {
                     layer.alert("服务层错误,请联系技术人员！", { icon: 0 });
                 },
             });
         },*/
        vCode() {
            let _this = this;
            let flag = true;
            $.ajax({
                type: "POST",
                url: contextPath + "/tbasecommodity/validateCode?code=" + _this.commodity.code,
                contentType: 'application/json',
                dataType: "json",
                async: false,
                success: function (r) {
                    if (r.code === "100100") {
                        _this.$Modal.info({
                            title:'提示信息',
                            content:"商品编码重复，请重新填写!"
                        })
                        flag = true;
                    } else {
                        flag = false;
                    }
                },
                error: function (err) {
                    _this.$Modal.error({
                        title:'提示信息',
                        content:"服务器出错"
                    })
                },
            });
            return flag;
        },
        keyDown() {

        },
        clearbody() {
            this.newCustomCode = [];
            // this.$refs.start.date = '';
            // this.$refs.end.date = '';
            this.dataValue = [];
            this.body = {
                name: "",
                code: "",
                beforetime: "",
                aftertime: "",
                styleCode: "",
                customCode: "",
                series: [],
            };
        },
        // view(){
        //     this.isAdd = true;
        //     //先查询数据，再进行修改
        //     var that = this;
        //     if(this.selected.length==1){
        //         this.isEdit = true;
        //         this.isView = false;
        //         this.is_lock = false;
        //         $.ajax({
        //             type:"post",
        //             url:contextPath+"/tbasecommodity/info/"+that.selected[0],
        //             contentType: 'application/json',
        //             success: function (r) {
        //                 if(r.code=="100100"){
        //                     that.commodity = r.data;
        //
        //                 }
        //             }
        //         });
        //     }else{
        //         layer.alert("请选择一条数据进行更新");
        //     }
        // },
        clearNoNum(item, type) {
            item[type] = item[type].replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
            item[type] = item[type].replace(/^\./g, "");  //验证第一个字符是数字而不是.
            item[type] = item[type].replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的.
            item[type] = item[type].replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
            this.$forceUpdate();

        },
        validateGoldType() {

            if (this.commodity.mainType == "attr_ranges_gold") {
                if (!this.commodity.certificateType) {
                    this.$Modal.info({
                        title:'提示信息',
                        content:"未选择金料成色，请选择!"
                    })
                    return false;
                }
            }
            return true;
        },
        save() {
            if (!this.validateGoldBoms() || !this.validateStoneBoms() || !this.validatePartBoms()) {
                return false;
            }
            if (!this.validateGoldType()) {
                return false;
            }

            if (this.commodity.mainType == "attr_ranges_goods") {
                this.backBom(this.goldBoms, this.goldAssistAttr, this.goldAssistAttrAll, this.goldTableHeader);
                this.backBom(this.stonesBoms, this.stonesAssistAttr, this.stonesAssistAttrAll, this.stonesTableHeader);
                this.backBom(this.partBoms, this.partAssistAttr, this.partAssistAttrAll, this.partTableHeader);

                if (!this.commodity.tBaseBomEntity &&
                    (
                        this.goldBoms.length > 0 || this.stonesBoms.length > 0 || this.partBoms.length > 0
                    )
                ) {
                    this.commodity.tBaseBomEntity = {
                        goldBoms: [],
                        partBoms: [],
                        stonesBoms: []
                    };
                }

                if (this.commodity.tBaseBomEntity) {
                    this.commodity.tBaseBomEntity.goldBoms = this.goldBoms;
                    this.commodity.tBaseBomEntity.partBoms = this.partBoms;
                    this.commodity.tBaseBomEntity.stonesBoms = this.stonesBoms;
                }
            }



            // 处理辅助属性
            let arr = [];
            this.targetDetailsNature.map((el, i) => {
                let array = el.split("-")
                let obj = {};
                if (i === 0) {
                    obj['id'] = array[0];
                    obj['attrValueIds'] = [array[1]]
                    arr.push(obj);
                } else {
                    let tmp = true;
                    arr.map((value, index) => {
                        if (value.id == array[0]) {
                            value.attrValueIds.push(array[1])
                            tmp = false
                        }
                    })
                    if (tmp) {
                        obj['id'] = array[0];
                        obj['attrValueIds'] = [array[1]]
                        arr.push(obj);
                    }
                }
            })
            let That = this;
            That.commodity.assistAttrs = arr;
            if (That.commodity.isDefBatch) {
                That.commodity.isDefBatch = 1;
            } else {
                That.commodity.isDefBatch = 0;
            }
            if (That.commodity.isDefStock) {
                That.commodity.isDefStock = 1;
            } else {
                That.commodity.isDefStock = 0;
            }
            //校验
            if (!That.commodity.code) {
                That.$Modal.info({
                    title:'提示信息',
                    content:"请填写商品编码!"
                })
                return;
            } else if (!That.commodity.id) {
                if (That.vCode()) {
                    return;
                }
            } else {
            }

            if(That.commodity.code){
                var reg = /^[0-9a-zA-Z]+$/;
                if(!reg.test(That.commodity.code)){
                    That.$Modal.info({
                        title:'提示信息',
                        content:"请输入正确的商品编码！"
                    })
                    return;
                }
            }

            if (!That.mainType1) {
                That.$Modal.info({
                    title:'提示信息',
                    content:"请选择主类型!"
                })
                return;
            } else {
                if (That.mainType1 == 1) {
                    if (!That.mainType) {
                        That.$Modal.info({
                            title:'提示信息',
                            content:"请选择主类型!"
                        })
                        return;
                    }
                }
                if (That.commodity.mainType == "attr_ranges_goods") {
                    if (!That.commodity.styleCategoryId) {
                        That.$Modal.info({
                            title:'提示信息',
                            content:"请选择款式类别!"
                        })
                        return;
                    }
                    if (That.commodity.code.length != 7) {
                        That.$Modal.info({
                            title:'提示信息',
                            content:"请选择最底层的款式类别来生成所对应的成品编码!"
                        })
                        return;
                    }
                }
                if (That.commodity.mainType == "attr_ranges_gold") {
                    if (That.commodity.pricingType != 1) {
                        That.$Modal.info({
                            title:'提示信息',
                            content:"商品主类型是金料,请选择按重量计价!"
                        })
                        return;
                    }
                } else {
                    if (!That.commodity.countGroupId) {
                        That.$Modal.info({
                            title:'提示信息',
                            content:"请选择计数组"
                        })
                        return;
                    } else {
                        if (!That.commodity.countUnitId) {
                            That.$Modal.info({
                                title:'提示信息',
                                content:"请选择计数单位"
                            })
                            return;
                        }
                    }
                }
            }

            if (!That.commodity.weightGroupId) {
                That.$Modal.info({
                    title:'提示信息',
                    content:"请选择计重组"
                })
                return;
            } else {
                if (!That.commodity.weightUnitId) {
                    That.$Modal.info({
                        title:'提示信息',
                        content:"请选择计重单位"
                    })
                    return;
                }
            }

            if (!That.commodity.commodityCategotyInfoId) {
                That.$Modal.info({
                    title:'提示信息',
                    content:"请填写商品类型"
                })
                return;
            }

            if (!That.commodity.name) {
                That.$Modal.info({
                    title:'提示信息',
                    content:"请填写商品名称"
                })
                return;
            }

            if (!That.commodity.pricingType) {
                That.$Modal.info({
                    title:'提示信息',
                    content:"请选择计价方式"
                })
                return;
            } else {
                if (That.commodity.pricingType == 1) {
                    if (!That.commodity.weightGroupId) {
                        That.$Modal.info({
                            title:'提示信息',
                            content:"请选择计重组"
                        })
                        return;
                    } else {
                        if (!That.commodity.weightUnitId) {
                            That.$Modal.info({
                                title:'提示信息',
                                content:"请选择计重单位"
                            })
                            return;
                        }
                    }
                } else {
                    if (!That.commodity.countGroupId) {
                        That.$Modal.info({
                            title:'提示信息',
                            content:"请选择计数组"
                        })
                        return;
                    } else {
                        if (!That.commodity.countUnitId) {
                            That.$Modal.info({
                                title:'提示信息',
                                content:"请选择计数单位"
                            })
                            return;
                        }
                    }
                }
            }

            if (!That.commodity.priceMethod) {
                That.$Modal.info({
                    title:'提示信息',
                    content:"请选择计价方法"
                })
                return;
            }

            var reg = /^[0-9]+([.]{1}[0-9]+){0,1}$/;

            let val1 = this.commodity.weight;
            if (val1) {
                if (!reg.test(val1)) {
                    That.$Modal.info({
                        title:'提示信息',
                        content:"请输入正确的参考重量"
                    })
                    return;
                }
            }
            var reg1 = /^-?\d+$/;
            let val10 = That.commodity.accuracy;
            if (val10) {
                if (!reg1.test(val10)) {
                    That.$Modal.info({
                        title:'提示信息',
                        content:"请输入正确单价精度"
                    })
                    return;
                }
            }
            let val2 = this.commodity.costPrice;
            if (val2) {
                if (!reg.test(val2)) {
                    That.$Modal.info({
                        title:'提示信息',
                        content:"请输入正确的成本价格"
                    })
                    return;
                }
            }

            let val3 = this.commodity.sellingPrice;
            if (val3) {
                if (!reg.test(val3)) {
                    That.$Modal.info({
                        title:'提示信息',
                        content:"请输入正确的标签价格"
                    })
                    return;
                }
            }

            let val4 = this.commodity.lablePrice;
            if (val4) {
                if (!reg.test(val4)) {
                    That.$Modal.info({
                        title:'提示信息',
                        content:"请输入正确的销售价格"
                    })
                    return;
                }
            }
            let val5 = this.commodity.certificatePrice;
            if (val5) {
                if (!reg.test(val5)) {
                    That.$Modal.info({
                        title:'提示信息',
                        content:"请输入正确的证书费"
                    })
                    return;
                }
            }
            let val6 = this.commodity.laborCharges;
            if (val6) {
                if (!reg.test(val6)) {
                    That.$Modal.info({
                        title:'提示信息',
                        content:"请输入正确的工费"
                    })
                    return;
                }
            }
            let val7 = this.commodity.otherFee;
            if (val7) {
                if (!reg.test(val7)) {
                    That.$Modal.info({
                        title:'提示信息',
                        content:"请输入正确的其他费用"
                    })
                    return;
                }
            }
            let val8 = this.commodity.salesRate;
            if (val8) {
                if (!reg.test(val8)) {
                    That.$Modal.info({
                        title:'提示信息',
                        content:"请输入正确的销售倍率"
                    })
                    return;
                }
            }
            let url = "";
            if (That.commodity.id != '') {
                url = contextPath + "/tbasecommodity/update"
            } else {
                url = contextPath + "/tbasecommodity/save"
            }
            //禁用保存按钮
            if (!this.saveDisable) {
                return false;
            }
            this.saveDisable = false;
            $.ajax({
                type: "post",
                url: url,
                data: JSON.stringify(That.commodity),
                contentType: 'application/json',
                success: function (r) {
                    if (r.code == "100100") {
                        That.$Modal.success({
                            title:'提示信息',
                            content:r.data,

                            onOk: () => {
                                That.saveDisable = true;
                                That.quit();
                                That.search();
                            }
                        })

                    } else {
                        That.saveDisable = true;
                        That.$Modal.error({
                            title:'提示信息',
                            content:r.msg
                        })
                    }
                },
                error: function (err) {
                    That.saveDisable = true;
                    That.$Modal.error({
                        title:'提示信息',
                        content:"服务器出错"
                    })
                },
            });
        },
        tableDbClick(col, index) {
            let tmp = col.tBaseAssistAttrValuess
            let arr = [];
            for (let i = 0; i < tmp.length; i++) {
                let obj = {};
                obj['key'] = col.id + "-" + tmp[i].id;
                obj['label'] = tmp[i].value;
                obj['code'] = tmp[i].code;
                arr.push(obj);
            }
            this.detailsNatureData = arr;
        },
        // 控制穿梭窗显示内容
        renderTranferContent(item) {
            return item.code + " - " + item.label;
        },
        // 控制穿梭窗
        handleTranfer(newTargetKeys, direction, moveKeys) {

            this.targetDetailsNature = newTargetKeys;
        },
        // 弹窗组件
        iconPopup() {
            this.showDepartmentModal = true;
        },
        getWrapperHeight(val) {
            if (val === 'bom') {
                let windH = $(window).height()
                setTimeout(() => {
                    $('#wrapper').height(windH - $('#wrapper').offset().top - 20);
                }, 200);
            }
        },
        add() {

            this.isAdd = true;
            this.showIsDefault = false;
            this.showMainType = false;
            this.showIsType = false;
        },
        quit() {
            // 需要将表单所有内容初始化
            this.saveDisable = true;
            this.isAdd = false;
            this.saveDisable = true;
            //this.logUrl=contextPath+"/tbasecustomer/changeLog?type=commodity&id=-1",
            this.clear();
        },
        clear() {
            //清除bom和辅助属性
            this.showMainType = false;
            this.selected = [];
            this.itemList = [];
            this.goldBoms = [];
            this.goldAssistAttr = [];
            this.showName = false;
            this.itemStoneList = [];
            this.stonesBoms = [];
            this.stonesAssistAttr = [];
            this.suppliernames = "";
            this.itemPartList = [];
            this.partBoms = [];
            this.partAssistAttr = [];

            //清空辅助属性
            this.assistAttr = [];
            this.natureTableCol = [];
            this.detailsNatureData = [];
            this.targetDetailsNature = [];
            let tmp = this.styleList.length - 1;
            this.styleListData.splice(1, tmp);
            this.styleList.splice(1, tmp);
            this.styleListData[0] = { data: "" };
            this.commodityCategoty = [];
            this.buyers = [];
            this.commodityseries = [];
            this.buyDepartment = "";
            this.mainType1 = "";
            this.mainType = "";
            this.commodity = {
                id: "",
                code: "",
                name: "",
                mainType: '',
                createOrganizationId: "",//创建组织
                commodityCategotyInfoId: "",//商品类型
                styleCategoryId: "",//款式类别
                specification: "",
                series: "",
                status: "",
                supplierId: "",
                weight: "",
                pricingType: "",
                weightGroupId: "",//计重单位组id
                weightUnitId: "",//计重单位id
                countGroupId: "",
                countUnitId: "",
                remark: "",
                buyDepartment: "",
                buyer: [],
                accuracy: "",
                priceMethod: "",
                warehouseInfoId: "",//默认仓库
                repertoryPositionId: "",//默认库位
                isDefBatch: "",  //是否启用批次号0：未启用1：启用
                isDefStock: "",//是否库存管理0：未启用1：启用
                materiaMethod: "qj",//来料质检方式
                salesBackMethod: "qj",//退货质检方式
                stockMethod: "qj",//库存质检方式
                shipMethod: "qj",//发货质检方式
                maintainMethod: "qj",//维修质检方式
                otherMethod: "qj",//其他质检方式
                costPrice: "",//成本价
                lablePrice: "",//商品标签价格
                sellingPrice: "",
                certificatePrice: "",
                laborCharges: "",
                otherFee: "",
                salesRate: "",
                pictureId: "",
                isDel: 1,
                categoryCustomCode: "",//商品类型自定义code
                styleCustomCode: "",//款式类别自定义code
                organizationId: "",
                assistAttrs: [],
                tBaseBomEntity: {},
                frontPic: {},
                sidePic: {},
                downPic: {},
                tryPics: [],
                threeDPics: [],
                videos: [],
                delFiles: []
            };
        },
        departmentOk() {
            this.showDepartmentModal = false;
        },
        getUnitWeightByGroupId() {
            let that = this;
            $.ajax({
                type: 'POST',
                url: contextPath + '/tbaseunit/list',
                data: { groupId: that.commodity.weightGroupId },
                success: function (result) {
                    that.commodity.weightUnitId = "";
                    that.unitWeight = [];
                    that.unitWeight = result.data;
                }
            })
        },

        //获取数量单位
        getUnitCountByGroupId() {
            let that = this;
            $.ajax({
                type: 'POST',
                url: contextPath + '/tbaseunit/list',
                data: { groupId: that.commodity.countGroupId },
                success: function (result) {
                    that.commodity.countUnitId = "";
                    that.unitCount = [];
                    that.unitCount = result.data;
                }
            })
        },

        /* vaildateFrom(){
             $.validator.addMethod("pattern", function (value, element, params) {

                 if (!params.test(value)) {
                     return false;
                 }
                 return true;
             });

             $.validator.addMethod("isPositiveDouble", function (value, element) {
                 var isPositiveInteger = /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/;
                 return this.optional(element) || isPositiveInteger.test(value);
             }, "请输入数字");
             $.validator.addMethod("isPositiveInteger", function (value, element) {
                 var isPositiveInteger = /^([0-9]*[1-9][0-9]*)$/;
                 return this.optional(element) || isPositiveInteger.test(value);
             }, "请输入正整数");
         },*/
    },
    mounted() {
        this.init();
        this.openTime = window.parent.params.openTime;
        this.isSkip();
    },
    computed: {
        carouselList: function () {
            let tempList = [];
            if (this.commodity.frontPic && this.commodity.frontPic.fdUrl) {
                // tempList.push(this.commodity.frontPic.fdUrl);
                tempList.push({ url: this.commodity.frontPic.fdUrl, name: "正面图" });
            }
            if (this.commodity.sidePic && this.commodity.sidePic.fdUrl) {
                // tempList.push(this.commodity.sidePic.fdUrl);
                tempList.push({ url: this.commodity.sidePic.fdUrl, name: "侧面图" });
            }
            if (this.commodity.downPic && this.commodity.downPic.fdUrl) {
                // tempList.push(this.commodity.downPic.fdUrl);
                tempList.push({ url: this.commodity.downPic.fdUrl, name: "俯视图" });
            }

            return tempList;
        }
    },
    updated() {

    },
    watch: {
        targetDetailsNature: function (newQuestion, oldQuestion) {
            let that = this;
            /*  newQuestion.map(item =>{
                  let id = item.split(',')[0];
                  that.natureTableCol.map(val =>{
                      if(val.id == id ){
                          natureTableCol._checked = true;
                      }
               });
              });*/
            that.natureTableCol.map(val => {
                let flag = false;
                newQuestion.map(item => {
                    let id = item.split('-')[0];
                    if (val.id == id) {
                        val._checked = true;
                        flag = true;
                        return;
                    }

                });
                if (!flag) {
                    val._checked = false;
                }
            });
        }
    }

});




