var vm = new Vue({
    el: '#sale-settlement',
    data() {
        let This = this;
        return {
            htHaveChange:false,
            ruleValidate: {
                returnDate: [
                    {required: true, message: "日期不能为空"}
                ],
                goodsType: [
                    {required: true, message: "商品类型不能为空"}
                ],
                businessType: [
                    {required: true, message: "业务类型不能为空"}
                ],
            },
            //所选的客户对象
            selectCustomerObj: null,
            //已选条码
            codesUsed: {},
            options: [],
            isSaveDisable: false,
            isSubmitDisable: false,
            isQualityDisable: true,
            updateFlag: 2, //商品明细 1 可修改， 其他不可修改
            productDetailModal: {
                showModal: false,
                ids: {
                    goodsId: '',
                    commodityId: '',
                    documentType: 'W_STOCK_IN'
                },
                overEdit: false,
            },
            isHint: true,
            isBusType: true,
            showProductDetails: false,//控制商品明细弹窗
            selectedIndex: 0,//明细信息选中行高亮
            //控制弹窗显示
            modalTrigger: false,
            modalType: '',
            documentType: "S_RETURN",//单据类型
            //审批进度条
            stepList: [],
            approvalTableData: [],
            //当前组织下所有的员工
            employees: [],
            //退货客户弹窗
            isShow: false,
            qualityShow: true,
            isDisable: true,
            isSearchHide: true,
            isView: false,
            otherDisable: true,
            productTypeList: [],
            selectedRow: "",
            unitList: [],
            unitListObj: {},
            emp: {
                businessManId: "",//业务员id
                businessManName: "",//业务员
            },
            returnGoodsType: [
                {
                    value: "S_RETURN_TOWSALE",
                    label: "二次销售"
                },
                {
                    value: "S_RETURN_REPAIR",
                    label: "维修"
                },
                {
                    value: "S_RETURN_OLD_MATERIAL",
                    label: "旧料处理"
                }
            ],
            qualityWay: [
                {
                    value: "S_RETURN_QUALITY_PASS",
                    label: "放行"
                },
                {
                    value: "S_RETURN_QUALITY_NO_PASS",
                    label: "检查结果不符"
                }
            ],
            //条形码输入框数据
            markOrder: "",
            //销售出库单弹窗
            saleOrderShow: false,
            //单据编号搜索框
            orderSearchNum: {
                outStockNo: ""
            },
            openName: '',
            openTime: '',
            jumpParam: {},
            parentPramas: {},
            //退货搜索框
            customer: {
                //客户名称
                name: "",
                //客户编码
                custNo: ""
            },
            user: {
                userId: '',
                username: '',
                createName: '',
                organizationId: '',
                organizationName: '',//所属组织名
            },
            //地址
            area: {},
            areaInit: {
                isInit: false,
                province: '',
                city: '',
                county: '',
                detail: '',
                disabled: false
            },
            //基本信息表数据
            addBody: {
                id: "",//单据id
                // custId: "",//客户id
                documentNo: "",//单据编号
                documentStatus: 1,//单据状态（1,2,3,4,5--暂存,待审核,审核中,已审核,驳回）
                businessStatus: 0,//业务状态(0,默认的初始状态,1,待质检判定,2,已质检判定)
                organizationId: "",//所属组织
                organizationName: "",//所属组织名称
                customerId: "",//客户id
                custNo: "",//退货客户编号
                custName: "",//退货客户名称
                returnDate: "",//退货日期
                businessType: "",//业务类型
                reason: "",//退货原因
                saleOutStockNo: "",//销售出库单号
                businessManId: "",//业务员id
                businessManName: "",//业务员
                goodsType: "", //商品类型  *
                goodsTypeName: "", // todo 商品类型名称
                groupPath: "",      // todo 分类路径 （存放商品类型三级value，用-连接）
                totalNum: 0,//总数量
                totalWeight: 0,//总重量
                //其他信息
                createName: "",//创建人
                createTime: "",//创建日期
                updateName: "",//修改人
                updateTime: "",//修改日期
                auditId: "",//审核id
                auditName: "",//审核人
                auditTime: "",//审核时间
                //客户信息表数据
                saleCustInfoEntity: {
                    //   id: "",
                    // documentType: "S_RETURN",  //单据类型
                    // documentNo: "", //单据编号
                    custNo: "",  //客户编号 *
                    name: "",  //联系人 *
                    phone: "",//联系方式 *
                    email: "",//邮箱 *
                    weChatNo: "", //微信号 *
                    zipCode: "",//邮编
                    detail: "",  //详细地址
                    concreteAddress: "",  //全地址
                    area: "",  //区域编码
                    province: "", //省份编码
                    city: "",//城市编码
                    county: "" //区级编码
                },
                //列表信息
                goodList: []
            },
            //新增行数据
            oneinfo:
                {
                    id: "",//自增长id
                    inpTrue: "true",
                    organizationId: "",//组织id
                    goodsId: "",//商品信息id
                    goodsBarcode: "",//条形码
                    pictureUrl: "",//商品图片
                    goodsCode: "",//商品编码
                    goodsType: "",//商品类型
                    goodsTypeName: "",//商品类型名称
                    groupPath: "",//分类路径
                    goodsMainType: "",//商品主类型
                    commodityId: "",//商品编码id
                    goodsNo: "",//商品编码
                    goodsName: "",//商品名称
                    goodsInfo: "",//商品明细
                    goodsNorm: "",//规格
                    goodsLineNo: "",//商品分录行
                    batchNum: "",//批号
                    countingUnit: "",//计数单位
                    countingUnitId: "",//计数单位id
                    num: "",//数量
                    weightUnit: "",//计重单位
                    weightUnitId: "",//计重单位id
                    weight: "",//重量
                    goldWeight: "",//金重
                    mainStoneWeight: "",//主石重
                    viceStoneWeight: "",//副石重
                    certificateType: "",//证书类型
                    certificateNo: "",//证书编号
                    returnDate: "",//退货日期
                    amount: "",//金额
                    documentType: "",//出库单源单类型
                    sourceType: "",//源单类型
                    sourceNo: "",//源单单号
                    reProcessMethod: "",//退货处理方式
                    qualityResult: "",//质检判定
                    genDataMark: "",//生成下游数据标志(1 待生成；2  已生成)
                    detailMark: "",//商品明细标识 1,有 ,2 无
                    styleCategoryId: '',//款式id
                    styleCustomCode: '',//款式code
                    styleName: '',//款式名称
                },
            goodList: [],
            //业务类型
            businessTypeList: [
                {
                    value: 'S_CUST_ORDER_01',
                    label: "普通销售退货"
                },
                {
                    value: 'S_CUST_ORDER_02',
                    label: "受托加工销售退货"
                }
            ],

            return_goods_list: {
                //列表页数据
                url: contextPath + '/tbasecustomer/list',
                colNames: ["操作", "客户名称", "客户编码"],
                colModel:
                    [// {name:"id",hidden:true},
                        {
                            name: 'id',
                            index: 'invdate',
                            width: 80,
                            align: "center",
                            formatter: function (value, grid, rows, state) {
                                $(document).off("click", ".select" + rows.id).on("click", ".select" + rows.id, function () {
                                    This.confirm(value, grid, rows, state)
                                });
                                let btns = `<a type="primary" class="select${rows.id}">选取</a>`;
                                return btns
                            }
                        },
                        {name: "name", index: "name", width: 300, align: "center"},
                        {name: "code", index: "code", width: 300, align: "center"}
                    ],
                multiselect: false,
                //   multiboxonly: true,
            },
            returnReload: false,
            returnCutId: "returnCutId",
            returnSelected: [],
            custShow: true,
            orderShow: false,
            wordShow: "商品明细",
            //销售出库单列表配置信息
            data_order_list: {
                //列表页数据
                url: contextPath + '/tSaleReturnNotice/getOutStockGoods',
                datatype: "json",
                colNames: ["条形码", "商品编码", "商品名称", "商品明细", "批号", "计数单位", "计数单位id", "数量", "计重单位", "计重单位id", "重量", "金重", "主石重(ct)",
                    "副石重(ct)", "标配证书类型", "证书编号", "销售金额", "goodsId", "图片", "商品分录", "商品规格", "源单类型", "出库单源单类型", "源单编号",
                    "商品编码id", "商品主类型", "商品类型", "商品类型名称", "款式id", "款式code", "款式名称", "商品标识"],
                colModel:
                    [
                        {name: "goodsBarcode", index: "goodsBarcode", width: 110, align: "center"},
                        {name: "goodsCode", index: "goodsCode", width: 110, align: "center"},
                        {name: "goodsName", index: "goodsName", width: 110, align: "center"},
                        {
                            name: "goodsInfo", index: "goodsInfo", width: 110, align: "center",
                            formatter: function (value, grid, rows, state) {
                                $(document).off("click", ".select" + rows.id).on("click", ".select" + rows.id, function () {
                                    This.showProduct(value, grid, rows, state)
                                });
                                let btns = `<a type="primary" class="select${rows.id}">商品明细</a>`;
                                return btns
                            }
                        },
                        {name: "batchNum", index: "batchNum", width: 110, align: "center"},
                        {name: "countingUnit", index: "countingUnit", width: 110, align: "center"},
                        {name: "countingUnitId", index: "countingUnitId", hidden: "true"},
                        {
                            name: "num", index: "num", width: 110, align: "center",
                            formatter: function (value, grid, rows, state) {
                                return 1;
                            }
                        },
                        {name: "weightUnit", index: "weightUnit", width: 110, align: "center"},
                        {name: "weightUnitId", index: "weightUnitId", hidden: "true"},
                        {name: "weight", index: "weight", width: 110, align: "center"},
                        {name: "goldWeight", index: "goldWeight", width: 110, align: "center"},
                        {name: "mainStoneWeight", index: "mainStoneWeight", width: 110, align: "center"},
                        {name: "viceStoneWeight", index: "viceStoneWeight", width: 110, align: "center"},
                        {name: "certificateType", index: "certificateType", width: 110, align: "center"},
                        {name: "certificateNo", index: "certificateNo", width: 110, align: "center"},
                        {name: "amount", index: "amount", width: 110, align: "center"},
                        {name: "goodsId", index: "goodsId", hidden: "true"},
                        {name: "pictureUrl", index: "pictureUrl", hidden: "true"},
                        {name: "goodsLineNo", index: "goodsLineNo", hidden: "true"},
                        {name: "goodsNorm", index: "goodsNorm", hidden: "true"},
                        {name: "sourceType", index: "sourceType", hidden: "true"},
                        {name: "documentType", index: "documentType", hidden: "true"},
                        {name: "sourceNo", index: "sourceNo", hidden: "true"},
                        {name: "commodityId", index: "commodityId", hidden: "true"},
                        {name: "goodsMainType", index: "goodsMainType", hidden: "true"},
                        {name: "goodsType", index: "goodsType", hidden: "true"},
                        {name: "goodsTypeName", index: "goodsTypeName", hidden: "true"},
                        {name: "styleCategoryId", index: "styleCategoryId", hidden: "true"},
                        {name: "styleCustomCode", index: "styleCustomCode", hidden: "true"},
                        {name: "styleName", index: "styleName", hidden: "true"},
                        {name: "detailMark", index: "detailMark", hidden: "true"},

                    ],
            },
            //客户表名
            tabId: "customerTab",
            selected: [],
            selectIndex: "",
            reload: false,
            orderId: "orderId",
            treeSetting: {
                view: {
                    showLine: true,
                    selectedMulti: false,
                    dblClickExpand: false
                },
                callback: {
                    onClick: this.treeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
        }
    },

    methods: {
        //客户
        closeCustomer() {
            let rows = this.selectCustomerObj;
            if (rows) {
                this.addBody.customerId = rows.id;
                this.addBody.custNo = rows.code;
                this.addBody.custName = rows.name;
                this.addBody.saleCustInfoEntity.custNo = rows.code;
                this.addBody.saleCustInfoEntity.name = rows.name;
                this.addBody.saleCustInfoEntity.zipCode = rows.zipCode;
                this.addBody.saleCustInfoEntity.email = rows.email;
                this.addBody.saleCustInfoEntity.name = rows.contactName;
                this.addBody.saleCustInfoEntity.phone = rows.contactPhone;
                this.addBody.saleCustInfoEntity.weChatNo = rows.wechat;
                if (rows.province) {
                    this.areaInit = {
                        isInit: true,
                        province: rows.province || '',
                        city: rows.city || '',
                        county: rows.county,
                        detail: rows.detail
                        /* disabled: isLock*/
                    };
                }
                this.getBarcodeList();
            }
        },
        //弹框商品明细
        showProduct(value, grid, rows, state) {
            //固定开始
            let ids = {
                goodsId: rows.goodsId,
                documentType: 'W_STOCK_IN'
            };
            Object.assign(this.productDetailModal, {
                showModal: true,
                ids: ids
            });
            this.$nextTick(() => {
                this.$refs.modalRef.getProductDetail();
            });
        },
        // 校验微信号
        checkWeChat() {
            let weChat = this.addBody.saleCustInfoEntity.weChatNo;
            if (!weChat) {
                return;
            }
            var reg = /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/;
            if (!reg.test(weChat)) {
                this.$Modal.warning({
                    title: "提示",
                    okText: "确定",
                    content: "格式不正确,请重新输入!"
                });
                this.addBody.saleCustInfoEntity.weChatNo = "";
            }
        },
        // 校验手机号码
        checkPhone() {
            let phone = this.addBody.saleCustInfoEntity.phone;
            if (!phone) {
                return;
            }
            var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
            if (!reg.test(phone)) {
                this.$Modal.warning({
                    title: "提示",
                    okText: "确定",
                    content: "格式不正确,请重新输入!"
                });
                this.addBody.saleCustInfoEntity.phone = "";
            }
        },
        // 校验邮箱有效性
        checkEmail() {
            let email = this.addBody.saleCustInfoEntity.email;
            if (!email) {
                return;
            }
            var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
            if (!reg.test(email)) {
                this.$Modal.warning({
                    title: "提示",
                    okText: "确定",
                    content: "格式不正确,请重新输入!"
                });
                this.addBody.saleCustInfoEntity.email = "";
            }
        },
        clearNum(item, type, floor) {
            console.log(item, type, floor)
            return htInputNumber(item, type, floor)
        },
        cancelModal() {
            this.orderShow = false
        },
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
        //行选中
        selectedTr(index) {
            this.selectIndex = index;
            console.log(this.selected)
        },
        //分录行删除
        delInfo(list, selected) {
            console.log(selected);
            if (selected === '') {
                this.$Modal.warning({
                    title: "提示",
                    content: '请选中一行数据！'
                });
                return;
            }
            list.splice(selected, 1)
            this.htTestChange();
            this.selected = ""

        },
        //新增行
        addInfo(list, obj) {
            if (this.addBody.documentStatus == 1) {
                if (!this.addBody.goodsType) {
                    this.$Modal.warning({
                        title: "提示",
                        okText: "确定",
                        content: "请选择商品类型!"
                    });
                    return;
                }
                if (!this.addBody.custName) {
                    this.$Modal.warning({
                        title: "提示",
                        okText: "确定",
                        content: "请选择客户!"
                    });
                    return;
                }
                if (!this.addBody.businessType) {
                    this.$Modal.warning({
                        title: "提示",
                        okText: "确定",
                        content: "请选择业务类型!"
                    });
                    return;
                }
                if (list.length > 0) {
                    if (list[list.length - 1].goodsBarcode === "" || list[list.length - 1].goodsCode === "") {
                        this.$Modal.warning({
                            title: "提示",
                            content: "不能连续新增多条"
                        })
                        return
                    }
                }
                list.push(Object.assign({}, obj))
                this.htTestChange();
                this.allbarCode();
            }
        },
        hideSearch() {
            this.isSearchHide = !this.isSearchHide
        },
        //触发销售出库单弹窗
        saleOrder() {
            this.saleOrderShow = true
        },
        // 切换客户
        changeCustm(val) {
            if (val.custNo === "") {
                return;
            }
            let This = this;
            this.$Modal.confirm({
                content: "修改客户将会清空分录行，是否修改客户？",
                onOk: () => {
                    val.custNo = "";
                    this.isShow = true;
                    this.goodList = [];
                }
            })

        },
        //退货客户
        returnCut() {
            if (this.isView) {
                return
            }
            if (this.addBody.custNo == '') {
                this.isShow = true;
            } else {
                this.changeCustm(this.addBody);
            }
        },
        orderSearch() {
            //判断是否选择了退货客户
            if (this.addBody.custNo && this.addBody.goodsType && this.addBody.businessType) {
                //获取单据编号
                let config = {
                    postData:
                        {
                            outStockNo: this.orderSearchNum.outStockNo,
                            custNo: this.addBody.custNo,
                            goodsType: this.addBody.goodsType,
                            businessType: this.addBody.businessType
                        }
                }
                console.log(config)
                //根据单号请求数据
                $("#" + this.orderId).jqGrid('setGridParam', config).trigger("reloadGrid");
                this.orderShow = true;
            } else if (!this.addBody.custNo) {
                this.$Modal.warning({
                    title: "提示",
                    content: "请选择退货客户"
                })
            } else if (!this.addBody.businessType) {
                this.$Modal.warning({
                    title: "提示",
                    content: "请选择业务类型"
                })
            } else if (!this.addBody.goodsType) {
                this.$Modal.warning({
                    title: "提示",
                    content: "请选择商品类型"
                })
            }
        },
        // 业务员
        changeEmp(e) {
            console.log(e)
            this.addBody.businessManId = e.value;
            var le = e.label;
            this.addBody.businessManName = le.substring(le.lastIndexOf("-") + 1, le.length);
        },
        //选单操作
        returnOrder() {
            let arr = [];
            for (var i = 0; i < this.selected.length; i++) {
                var rowData = $("#" + this.orderId).jqGrid('getRowData', this.selected[i]);
                console.log(rowData)
                rowData.organizationId = this.addBody.organizationId;
                rowData.groupPath = this.addBody.groupPath;
                rowData.returnDate = new Date().format('yyyy-MM-dd HH:mm:ss');
                rowData.goodsId = Number(rowData.goodsId);
                rowData.commodityId = Number(rowData.commodityId);
                rowData.countingUnitId = Number(rowData.countingUnitId);
                rowData.weightUnitId = Number(rowData.weightUnitId);
                rowData.detailMark = Number(rowData.detailMark);
                arr.push(rowData)
            }
            //获取到将要填入的数据
            console.log(arr)
            //判断是否已插入数据
            this.goodList.map((item) => {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].goodsBarcode == item.goodsBarcode) {
                        //已插入的数据
                        arr.splice(i, 1)
                    }
                }
            })
            arr.map((item) => {
                this.goodList.push(item)
            })
            this.addBody.goodList = this.goodList;
            console.log(this.goodList)
            this.orderShow = false
            this.saleOrderShow = false
            this.reload = !this.reload;
            this.selected = [];
            this.htHaveChange = true;
        },
        exitOrder() {
            this.orderShow = false
            this.saleOrderShow = false
        },
        //获取到选择的退货客户信息
        //获取退货客户信息
        confirm(value, grid, rows, state) {
            console.log(value);
            console.log(rows);
            this.addBody.customerId = rows.id;
            this.addBody.custNo = rows.code;
            this.addBody.custName = rows.name;
            this.addBody.saleCustInfoEntity.zipCode = rows.zipCode
            this.addBody.saleCustInfoEntity.custNo = rows.code;
            let contact = (rows.contacts && rows.contacts.length > 0) ? rows.contacts[0] : {};
            this.addBody.saleCustInfoEntity.email = contact.email;
            this.addBody.saleCustInfoEntity.name = contact.name;
            this.addBody.saleCustInfoEntity.phone = contact.phone;
            this.addBody.saleCustInfoEntity.weChatNo = contact.wechat;
            this.isShow = false;
            this.getBarcodeList();
        },

        //返回到列表
        jump() {
            window.parent.activeEvent({
                name: '销售退货通知单列表',
                url: contextPath + '/sale/return-notice/sale-reject-list.html'
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
        htTestChange(){
            this.htHaveChange = true;
            console.log(333)
        },
        //显示商品明细
        showProductDetail(index) {
            this.selectedIndex = index;
            if (this.goodList[index].goodsCode == null || this.goodList[index].goodsCode == "") {
                return
            }
            //固定开始
            let ids = {
                goodsId: this.goodList[index].goodsId,
                documentType: 'W_STOCK_IN'
            };
            Object.assign(this.productDetailModal, {
                showModal: true,
                ids: ids
            });
            this.$nextTick(() => {
                this.$refs.modalRef.getProductDetail();
            });
            //固定结束
        },
        modalSure(e) {
        },
        modalCancel(e) {
        },
        isHintShow() {
            if (this.addBody.goodsType && this.isHint && this.goodList && this.goodList.length > 0) {

                this.$Modal.warning({
                    content: '温馨提示：改变商品类型将删除所有商品信息!',
                    onOk: () => {
                        this.isHint = false;
                    }
                })
            }
        },
        //业务类型
        changeBusType(value) {
            console.log(value)
            if (this.addBody.businessType && this.isBusType && this.goodList && this.goodList.length > 0) {
                this.$Modal.warning({
                    content: '温馨提示：改变类业务类型将删除所有商品信息!',
                    onOk: () => {
                        this.isBusType = false;

                    }
                })
            }
            this.goodList = [];
            this.getBarcodeList();
        },
        getBarcodeList() {
            let This = this;
            let params = {
                custNo: this.addBody.custNo,
                goodsType: this.addBody.goodsType,
                goodsBarcode: "",
                businessType: this.addBody.businessType,
                limit: 10,
                page: 1,
            };
            $.ajax({
                type: "post",
                url: contextPath + '/tSaleReturnNotice/getOutStockGoods',
                data: params,
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        //获取到所有options
                        This.options = data.data.list.map(code => $.extend(true, {}, {
                            code: code.goodsBarcode,
                            name: code.goodsName,
                            id: code.id
                        }));
                        console.log(This.options);
                    }
                },
                error: function () {
                    This.$Modal.warning({
                        title: "提示",
                        content: "服务器出错!"
                    });
                }
            })
        },
        // 级联商品类型
        changeProductType(value, selectedData) {
            if (value == this.typeValue) {
                return false;
            }
            //判断商品类型发生改变  清空商品分录行
            let This = this
            this.goodList = [];
            let e = selectedData[selectedData.length - 1];
            console.log(e.value);
            this.addBody.goodsType = e.value;
            this.addBody.goodsTypeName = e.label
            this.addBody.groupPath = value.join('-');

            this.oneinfo.groupPath = value.join('-');
            this.oneinfo.goodsTypeName = e.label;
            this.htHaveChange = true;
            This.getBarcodeList();
        },
        //发送ajax请求
        sendAjax(url, msg) {
            let This = this;
            this.handleGoodList();
            this.sumBodyTotal();//计算总数量和总重量
            if (ht.util.hasValue(this.area, 'object')) {
                Object.assign(this.addBody.saleCustInfoEntity, this.area);
            }
            console.log(this.addBody)
            $.ajax({
                type: 'post',
                async: false,
                url: contextPath + url,
                contentType: 'application/json',
                data: JSON.stringify(this.addBody),
                dataType: "json",
                success: function (result) {
                    if (result.code === "100100") {
                        vm.$Modal.success({
                            title: "提示",
                            okText: "确定",
                            content: msg + "成功",
                            onOk: function () {
                                console.log(result)
                                //待审核状态置灰
                                if (vm.addBody.documentStatus > 1) {
                                    vm.isView = true
                                }
                                This.copyList(result.data);

                                if (result.data.documentStatus == 2) {
                                    vm.isSaveDisable = true;
                                    vm.isSubmitDisable = true;
                                    vm.qualityShow = true;
                                    vm.isEdit('N');
                                }
                            },
                        });
                        This.htHaveChange = false;
                        This.saveAccess(result.data.documentNo, This.documentType)
                    } else {
                        vm.$Modal.error({
                            title: "提示",
                            okText: "确定",
                            content: result.msg,
                            onOk: function () {
                                This.addBody.documentStatus = 1;
                            }
                        });
                    }
                },
                error: function (err) {
                    console.log("服务器出错");
                    This.addBody.documentStatus = 1;
                },
            })
        },
        //保存
        save() {
            // todo 校验
            let This = this
            if (This.addBody.documentStatus > 2) {
                this.$Modal.warning({
                    title: "提示",
                    content: "该单据不能更新操作操作!"
                });
                return false;
            }
            var url = "/tSaleReturnNotice/save";
            if (this.addBody.id) {
                url = "/tSaleReturnNotice/update"
            }
            this.sendAjax(url, "保存");
        },
        // //数据校验
        // checkArray(arr,temp){
        //  arr.map((item)=>{
        //      this.$refs.formValidate.validateField(item,(rest) => {
        //          this.showMessage[item] = rest;
        //      })
        //  })
        // },
        submit() {//（校验必填字段）

            let temp = true;
            let isCustomerPass = false;
            this.$refs.formValidate.validate((valid) => {
                if (valid == false) {
                    temp = false;
                }
            })
            isCustomerPass = this.$refs.customerRef.submit();

            if (!temp || !isCustomerPass) {
                return;
            }

            // todo 校验
            let This = this
            //1.校验单据状态
            if (This.addBody.documentStatus != 1) {
                this.$Modal.warning({
                    title: "提示",
                    content: "该单据之前已经提交过了,不能再提交!"
                });
                return false;
            }
            //2.校验基本信息
            var msg = This.checkParam();
            if (msg != '') {
                return false;
            }
            let url = "/tSaleReturnNotice/save";
            if (this.addBody.id) {
                url = "/tSaleReturnNotice/update";
            }
            this.addBody.documentStatus = 2;
            this.sendAjax(url, "提交");
        },
        //剔除条码为空的商品信息数据
        handleGoodList() {
            let This = this
            var flag = false;
            if (This.goodList.length > 0) {
                This.goodList.map((item, index) => {
                    if (item.goodsBarcode === "") {
                        This.goodList.splice(index, 1)
                    }
                    if (item.qualityResult == "" || null == item.qualityResult) {
                        flag = true
                    }
                });
                if (flag && This.addBody.documentStatus == 2) {
                    This.addBody.businessStatus = 1;//待质检判定
                } else if (!flag && This.addBody.documentStatus == 2) {
                    This.addBody.businessStatus = 2;//已质检判定
                }
            }
            This.addBody.goodList = This.goodList;
        },
        // 计算总数量和总重量
        sumBodyTotal() {
            this.addBody.totalNum = this.sum(this.goodList, "num");
            this.addBody.totalWeight = this.sum(this.goodList, "weight");
        },
        // 计算列合计
        sum(list, key) {
            return list.reduce((total, el) => {
                if (el[key] === '' || el[key] === null || el[key] == undefined) {
                    return 0 + total;
                }
                ;
                if (isNaN(el[key])) {
                    this.$Modal.warning({
                        title: "提示",
                        content: '请输入数字'
                    })
                    el[key] = ''
                    return 0 + total;
                }
                return parseFloat(el[key]) + total;
            }, 0)
        },
        checkParam() {

            var msg = '';
            let flag = false;
            //1.校验基本信息
            if (this.addBody.documentNo === '') {
                msg = "请输入单据编号"
            }
            if (this.addBody.organizationId === '') {
                msg = "请输入组织id"
            }
            if (this.addBody.custNo === '') {
                msg = "请输入客户"
            }
            if (this.addBody.businessType === '') {
                msg = "请输入业务类型"
            }
            if (this.goodList.length == 0) {
                msg = "请输入商品分录信息"
            }
            if (this.goodList.length > 0) {
                this.goodList.map((item) => {
                    if (item.reProcessMethod == '' || item.reProcessMethod == null) {
                        flag = true;
                        return
                    }
                });
                if (flag) {
                    msg = "请输入完退货处理方式"
                }
            }
            this.$Modal.warning({
                title: "提示",
                content: msg
            });
            return msg

        },
        quality() {
            if (this.addBody.documentStatus == 2 && this.addBody.businessStatus == 1) {
                this.qualityShow = false;
                this.isSaveDisable = false;
            }
        },
        chcekQuality(list) {
            let flag = false;
            list.map((item) => {
                if (item.qualityResult == "" || null == item.qualityResult) {
                    flag = true
                }
            });
            return flag;
        },
        //审核
        approve(value) {
            let This = this
            if (This.addBody.documentStatus == 1) {
                This.$Modal.warning({
                    title: "提示",
                    content: "请先提交单据！"
                })
            } else if (This.addBody.documentStatus == 2) {
                $.ajax({
                    type: 'POST',
                    url: contextPath + '/tSaleReturnNotice/info',
                    data: {documentNo: This.addBody.documentNo},
                    success: function (result) {
                        console.log(result);
                        if (result.code == '100100') {
                            var flag = This.chcekQuality(result.data.goodList);
                            if (flag) {
                                This.$Modal.warning({
                                    title: "提示",
                                    content: "请完成质检判定保存后再审核单据！"
                                })
                            } else {
                                This.modalType = 'approve';
                                This.modalTrigger = !This.modalTrigger;
                                This.qualityShow = true
                            }
                        } else {
                            This.$Modal.error({
                                title: "提示",
                                content: result.msg
                            })
                        }
                    }
                });
            } else {
                This.modalType = 'approve';
                This.modalTrigger = !This.modalTrigger;
                This.qualityShow = true
            }
        },
        //驳回
        reject(value) {
            let This = this;
            This.modalType = 'reject';
            This.modalTrigger = !This.modalTrigger;
        },
        //审核或者驳回回调
        approvalOrRejectCallBack(res) {
            let _this = this;
            //判断是否是暂存 暂存可修改
            if (res.result.data.documentStatus == 1) {
                _this.isView = false
                vm.areaInit.disabled = false;
                _this.isSaveDisable = false;
                _this.isSubmitDisable = false;
                _this.isEdit('Y');
            }
            if (res.result.code == '100515') {
                if (_this.modalType == 'approve') _this.ajaxUpdateDocStatusById(_this.addBody.id, 4);
                if (_this.modalType == 'reject') _this.ajaxUpdateDocStatusById(_this.addBody.id, 1);
            }
            if (res.result.code == '100100') {
                _this.addBody.documentStatus = res.result.data.documentStatus;
                _this.addBody.auditId = res.result.data.auditId;
                _this.addBody.auditName = res.result.data.auditName;
                _this.addBody.auditTime = res.result.data.auditTime;
                if (_this.addBody.documentStatus == 1) {
                    _this.goodList.map((item) => {
                        item.qualityResult = '';
                    });
                }
                console.log(_this.goodList);
            }
        },
        ajaxUpdateDocStatusById(id, status) {
            let _this = this;
            $.ajax({
                url: contextPath + '/tSaleReturnNotice/update',
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify({id: id, documentStatus: status}),
                success: function (data) {

                    if (data.code == '100100') {
                        _this.addBody.documentStatus = status;
                    }
                }
            });
        },
        // 退出
        exit(close) {
            if (close === true) {
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
                return;
            }
            if (this.handlerClose()) {
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
            }
        },
        handlerClose() {
            if ((!this.addBody.documentStatus || this.addBody.documentStatus == 1)&&this.htHaveChange) {
                this.$nextTick(() => {
                    this.$refs.closeModalRef.showCloseModal();
                });
                return false;
            }
            return true;
        },
        closeModal(type) {
            if (type === 'yes') {//提交数据
                this.save();
                this.exit(true);
            } else if (type === 'no') {//关闭页面
                this.exit(true);
            }
        },
        copyList(data) {
            console.log(data)
            let This = this
            this.addBody = Object.assign({}, data);
            //判断单据状态
            //待审核状态置灰
            if (this.addBody.documentStatus > 1) {
                this.isView = true
                this.areaInit.disabled = true;
            }
            let tempAdress = this.addBody.saleCustInfoEntity;
            if (tempAdress.province) {
                this.areaInit = {
                    isInit: true,
                    province: tempAdress.province || '',
                    city: tempAdress.city || '',
                    county: tempAdress.county,
                    detail: tempAdress.detail,
                    disabled: This.isView
                }
            }
            this.goodList = data.goodList.concat();
            this.$refs.customerRef.loadCustomerList(this.addBody.custName, this.addBody.customerId);
        },

        //加载商品类型数据
        loadProductType() {
            var That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecommoditycategory/listByAll?parentId=0',
                contentType: 'application/json',
                dataType: "json",
                success: function (res) {
                    console.log(res);
                    That.productTypeList = That.initGoodCategory(res.data.cateLists)
                },
                error: function (err) {
                    console.log("服务器出错");
                },
            })
        },
        //格式化商品类型数据
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
        //获取职员信息
        getData() {
            var This = this;
            $.ajax({
                type: "post",
                async: false,
                url: contextPath + '/tpurchasecollectgoods/data',
                dataType: "json",
                success: function (r) {
                    This.user.organizationId = r.data.orgId;//加载当前组织id
                    This.user.organizationName = r.data.orgName; //加载当前组织姓名
                    This.addBody.organizationId = r.data.orgId;
                    This.addBody.organizationName = r.data.orgName;
                    This.employees = r.data.employees; //加载当前公司下面所有的员工
                },
                error: function () {
                    console.log('服务器出错啦');
                }
            })
        },
        //获取组织
        getUserInfo() {
            // this.addBody.organizationId = window.parent.userInfo.organId;
            // this.addBody.organizationName = window.parent.userInfo.orgName;
        },
        //请求编码
        getDocumentNo() {
            let This = this
            $.ajax({
                type: 'POST',
                url: contextPath + '/tSaleReturnNotice/getFieldCode',
                success: function (result) {
                    let documentNo = result.data
                    This.addBody.documentNo = documentNo
                    This.addBody.saleCustInfoEntity.documentNo = documentNo
                }
            })
        },
        searchCut() {
            let This = this
            let config = {
                postData:
                    {
                        code: This.customer.custNo,
                        name: This.customer.name
                    }
            }
            console.log(config)
            //根据单号请求数据
            $("#" + this.returnCutId).jqGrid('setGridParam', config).trigger("reloadGrid");
            this.custShow = true;
        },
        //获取商品明细选中行
        getGoodsItem(params, index) {
            console.log(params, index);
            var flag;
            //判断是否是同一分录行操作
            if(params.code == this.goodList[index].goodsBarcode){
                flag = true;
            }else{
                //判断是否已有条码
                let goodArr = this.goodList;
                flag = true;
                goodArr.map((item) => {
                    if (item.goodsBarcode == params.code) {
                        //清除这一行
                        this.$Modal.warning({
                            title: "提示",
                            content: "请输入不同条码号"
                        })
                        flag = false;
                        this.goodList.splice(index, 1)
                        return;
                    }
                })
            }

            if (flag) {
                //获取到条码号
                let This = this;
                var data = {
                    id: params.id,
                    limit: 1,
                    page: 1,
                }
                $.ajax({
                    type: "post",
                    url: contextPath + '/tSaleReturnNotice/getOutStockGoods',
                    data: data,
                    dataType: "json",
                    success: function (data) {
                        console.log("明细", data)
                        if (data.code === "100100") {
                            console.log(data.data);
                            //初始化商品分录行默认设置
                            data.data.list[0].id = "";
                            data.data.list[0].returnDate = new Date().format('yyyy-MM-dd HH:mm:ss');
                            data.data.list[0].num = 1;
                            data.data.list[0].groupPath = This.addBody.groupPath;
                            console.log(This.goodList);
                            This.$set(This.goodList, index, data.data.list[0]);
                            This.htHaveChange = true;
                            console.log(This.goodList);
                        }
                    },
                    error: function () {
                        This.$Modal.warning({
                            title: "提示",
                            content: "服务器出错!"
                        });
                    }
                })
            }

        },
        //获取商品条形码
        getGoodsBarcodeValue(value, index) {
            let This = this;
            let params = {
                custNo: this.addBody.custNo,
                goodsType: this.addBody.goodsType,
                goodsBarcode: value,
                businessType: this.addBody.businessType,
                limit: 10,
                page: 1,
            };
            $.ajax({
                type: "post",
                url: contextPath + '/tSaleReturnNotice/getOutStockGoods',
                data: params,
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        console.log(data)
                        This.options = data.data.list.map(code => $.extend(true, {}, {
                            code: code.goodsBarcode,
                            name: code.goodsName,
                            id: code.id
                        }));
                        This.$forceUpdate();
                    }
                },
                error: function () {
                    This.$Modal.warning({
                        title: "提示",
                        content: "服务器出错!"
                    });
                }
            })
        },
        //获取到所有商品条码
        allbarCode() {
            let This = this;
            let params = {
                custNo: this.addBody.custNo,
                goodsType: this.addBody.goodsType,
                goodsBarcode: "",
                businessType: this.addBody.businessType,
                limit: 10,
                page: 1,
            };
            $.ajax({
                type: "post",
                url: contextPath + '/tSaleReturnNotice/getOutStockGoods',
                data: params,
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        console.log(data)
                        This.options = data.data.list.map(code => $.extend(true, {}, {
                            code: code.goodsBarcode,
                            name: code.goodsName,
                            id: code.id
                        }));
                        This.$forceUpdate();
                    }
                },
                error: function () {
                    This.$Modal.warning({
                        title: "提示",
                        content: "服务器出错!"
                    });
                }
            })
        },
        //接收传入的参数
        getJumpParams() {
            this.jumpParam = window.parent.params.params;
            this.openName = window.parent.params.name;
            this.openTime = window.parent.params.openTime;
        },
        //获取数据
        getReturnInfo() {
            let This = this
            console.log("这是查询。。。")
            $.ajax({
                type: 'POST',
                async: false,
                url: contextPath + '/tSaleReturnNotice/info',
                data: {documentNo: This.jumpParam.documentNo},
                dataType: "json",
                success: function (result) {
                    if (result.code == '100100') {
                        This.copyList(result.data);
                    } else {
                        This.$Modal.warning({
                            title: "提示",
                            content: "系统异常,请稍后再试!"
                        });
                    }
                }
            })
        },

    },
    computed: {
        typeValue: function () {
            let temp = this.addBody.goodsType;
            let arr = [];
            console.log(this.productTypeList, arr, temp)
            this.typeInit(this.productTypeList, arr, temp);
            return arr.reverse();
        }
    },
    created() {
        window.handlerClose = this.handlerClose;
    },
    watch: {},
    mounted() {
        //接收传入的参数
        this.getJumpParams();
        this.getData();
        this.loadProductType();
        if (this.jumpParam.type === 'query') {
            //获取数据
            this.getReturnInfo();
            if (this.addBody.documentStatus != 1) {
                this.isView = true;
                this.isSaveDisable = true;
                this.isSubmitDisable = true;
            }
            //查找附件
            this.isEdit(this.addBody.documentStatus == 1 ? 'Y' : 'N');
            this.getAccess(this.addBody.documentNo, this.documentType);
        } else if (this.jumpParam.type === 'add') {
            this.getDocumentNo();
            //创建日期设置
            this.addBody.returnDate = new Date();
            this.isEdit('Y');
            this.$refs.customerRef.loadCustomerList('', '');
        } else if (this.jumpParam.type === 'other') {
            //其他页面跳转
            this.getReturnInfo(this.jumpParam.data);
            if (this.addBody.documentStatus != 1) {
                this.isView = true;
                this.isSaveDisable = true;
                this.isSubmitDisable = true;
            }
        }
    }
})