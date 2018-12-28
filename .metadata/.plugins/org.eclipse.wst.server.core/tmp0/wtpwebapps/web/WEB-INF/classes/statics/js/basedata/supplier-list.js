var validateOptions = {
    rules: {
        supplierName: {
            required: true,
            remote: {
                url: contextPath + "/supplier/validate",  //后台处理程序
                type: "post",  //数据发送方式
                dataType: "json",  //接受数据格式
                data: {  //要传递的数据
                    supplierName: function () {
                        return $("#supplierName").val();
                    },
                    id: function () {
                        return $("#id").val();
                    }
                },
                dataFilter: function (data, type) {//判断控制器返回的内容
                    // console.log(data,JSON.parse(data))
                    var res = JSON.parse(data);
                    if (res.code === "100100") {
                        return true;
                    } else {
                        return false;
                    }
                }

            }
        },
        siShortName: {
            required: true,
            remote: {
                url: contextPath + "/supplier/validate",  //后台处理程序
                type: "post",  //数据发送方式
                dataType: "json",  //接受数据格式
                data: {  //要传递的数据
                    siShortName: function () {
                        return $("#siShortName").val();
                    },
                    id: function () {
                        return $("#id").val();
                    }
                },
                dataFilter: function (data, type) {//判断控制器返回的内容
                    // console.log(data,JSON.parse(data))
                    var res = JSON.parse(data);
                    if (res.code === "100100") {
                        return true;
                    } else {
                        return false;
                    }
                }

            }
        },
        supplierLevelId: {
            required: true
        },
        mainProds: {
            required: true
        },
        prodType: {
            required: true
        },
        supplierType: {
            required: true
        },
        payWay: {
            required: true
        },
        billingCurrencyId: {
            required: true
        },
        billingWay: {
            required: true
        },
        status: {
            required: true
        },
        prodTypeName: {
            required: true
        }
    },
    messages: {
        supplierName: {
            required: "请填写公司名称!",
            remote: "公司名称已存在,请确认你的输入!"
        },
        siShortName: {
            required: "请填写简称!",
            remote: "公司简称已存在,请确认你的输入!"
        },
        supplierLevelId: {
            required: "请选择等级分类!"
        },
        mainProds: {
            required: "请选择主营商品!"
        },
        prodType: {
            required: "请选择供应商产品类型!"
        },
        supplierType: {
            required: "请选择供应商所属类别!"
        },
        payWay: {
            required: "请选择付款方式!"
        },
        billingCurrencyId: {
            required: "请选择结算币种!"
        },
        billingWay: {
            required: "请选择结算方式!"
        },
        status: {
            required: "请选择有效状态!"
        },
        prodTypeName: {
            required: "请输入供应商产品类型!"
        }
    }
};
function tip(type,msg,options) {
    let config = Object.assign({title:'提示信息',content:msg},options || {});
    switch (type){
        case 'info':
            supplierVm.$Modal.info(config);
            break;
        case 'warning':
            supplierVm.$Modal.warning(config);
            break;
        case 'success':
            supplierVm.$Modal.success(config);
            break;
    }
}
var supplierVm = new Vue({
    el: '#supplier-info',
    data() {
        return {
            isSearchHide: true, //搜索栏
            isTabulationHide: true, // 列表
            isHide: true,
            showModal: false,
            selectOrginId: [],
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
            logUrl: '',
            logConfig: {
                multiselect: false,
                jsonReader: {
                    root: "data.list",
                    total: "data.totalPage",
                    records: "data.totalCount",
                    cell: "list",
                },
                prmNames: {
                    page: "page",
                    rows: "limit",
                    order: "order"
                },
                mtype: "POST",//向后台请求数据的ajax的类型。可选post,get
                // url:contextPath+'/supplierlog/list',
                contentType: 'application/json',
                datatype: "json",//请求数据返回的类型。可选json,xml,txt
                styleUI: 'Bootstrap',
                rownumbers: true,
                multiselectWidth: 50,
                viewrecords: true,
                pager: '#changeLogPager',
                rowNum: 10,
                rowList: [10, 20, 30, 40],
                colNames: ['变更信息', '变更前', '变更后', '变更日期', '变更人'],//jqGrid的列显示名字
                colModel: [ //jqGrid每一列的配置信息。包括名字，索引，宽度,对齐方式.....
                    {
                        name: 'changeInfo', index: 'changeInfo', width: 180,
                    },
                    {
                        name: 'operationBefore', index: 'operationBefore', width: 180,
                        formatter: function (value, options, row) {

                            if (row.changeInfo == '信用额度') {
                                return Math.floor(value * 100) / 100;
                            } else if (row.changeInfo == '有效状态') {
                                return value == supplierVm.const.STATUS_YES ? '有效' : '无效';
                            } else if (row.changeInfo == '付款方式') {
                                let res = "";
                                for (let m of supplierVm.payMethod) {
                                    if (value === m.code) {
                                        res = m.name;
                                    }
                                }
                                return res;
                            } else if (row.changeInfo == '税分类') {
                                switch (value) {
                                    case "":
                                        return "";
                                    case "xgmnsr":
                                        return "小规模纳税人";
                                    case "ybnsr":
                                        return "一般纳税人";
                                    case "public_taxtype_1":
                                        return "小规模纳税人";
                                    case "public_taxtype_2":
                                        return "一般纳税人";

                                }
                            } else if (!value) {
                                return "";
                            }
                            return value;
                        }
                    },
                    {
                        name: 'operationAfter',
                        index: 'operationAfter',
                        width: 180,
                        formatter: function (value, options, row) {
                            if (row.changeInfo == '信用额度') {
                                return Math.floor(value * 100) / 100;
                            } else if (row.changeInfo == '有效状态') {
                                return value == supplierVm.const.STATUS_YES ? '有效' : '无效';
                            } else if (row.changeInfo == '付款方式') {
                                let res = "";
                                for (let m of supplierVm.payMethod) {
                                    if (value === m.code) {
                                        res = m.name;
                                    }
                                }
                                return res;
                            } else if (row.changeInfo == '税分类') {
                                switch (value) {
                                    case "":
                                        return "";
                                    case "xgmnsr":
                                        return "小规模纳税人";
                                    case "ybnsr":
                                        return "一般纳税人";
                                    case "public_taxtype_1":
                                        return "小规模纳税人";
                                    case "public_taxtype_2":
                                        return "一般纳税人";

                                }
                            }
                            return value;
                        }
                    },
                    {
                        name: 'operationTime',
                        index: 'operationTime',
                        width: 150,
                        align: "center",
                        formatter: function (value, options, row) {
                            return new Date(value).format('yyyy-MM-dd hh:mm:ss');
                        }
                    },
                    { name: 'userName', index: 'userName', width: 80, align: "center" }],
            },
            //控制显示隐藏
            isEdit: false,
            mpisEdit: false,
            stisEdit: false,
            reload: false,
            selected: [],
            isSave: true,
            isInfo: false,
            confirmConfig: {
                showConfirm: false,
                title: '提示',
                content: '这是内容',
                onlySure: true,
                success: true
            },
            const: {
                STATUS_YES: 1,
                STATUS_NO: 0,
                IS_DEL_YES: 0,
                IS_DEL_NO: 1,
                IS_DEFAULT_YES: 1,
                IS_DEFAULT_NO: 0,
                SUCCESS_CODE: '100100'
            },
            //以下数据均为模拟

            //供应商等级
            suppLevel: [

            ],
            //主营商品
            mainProduct: [

            ],
            //供应商产品类型
            productType: [
            ],
            //供应商所属类别
            suppCategory: [
                {
                    name: '战略型',
                    code: 1
                },
                {
                    name: '重点型',
                    code: 2
                },
                {
                    name: '常规型',
                    code: 3
                },
                {
                    name: '一般型',
                    code: 4
                }
            ],
            //供应商地址
            area: {},

            //菜单打开时间
            openTime: "",
            //付款方式
            payMethod: [
                {
                    name: '预付',
                    code: 'yf'
                },
                {
                    name: '按结算日结算',
                    code: 'ajsrjs'
                },
                {
                    name: '到货付',
                    code: 'dhf'
                }
            ],
            // 结算币种,单选
            currency: [
            ],
            // 结算方式，多选
            billing: [
                {
                    name: '现金',
                    code: 'public_billing_method_1'
                },
                {
                    name: '用料',
                    code: 'public_billing_method_2'
                },
                {
                    name: '电汇',
                    code: 'public_billing_method_3'
                },
                {
                    name: '信汇',
                    code: 'public_billing_method_4'
                },
                {
                    name: '商业汇票',
                    code: 'public_billing_method_5'
                },
                {
                    name: '银行汇票',
                    code: 'public_billing_method_6'
                },
                {
                    name: '信用证',
                    code: 'public_billing_method_7'
                },
                {
                    name: '支票',
                    code: 'public_billing_method_8'
                },
                {
                    name: '票据结算',
                    code: 'public_billing_method_9'
                }
            ],
            //税分类
            taxType: [
                {
                    name: '一般纳税人',
                    code: 'public_taxtype_1'
                },
                {
                    name: '小规模纳税人',
                    code: 'public_taxtype_2'
                }
            ],
            // 有效无效状态
            suppStatus: [
                {
                    name: '有效',
                    code: 1
                },
                {
                    name: '无效',
                    code: 0
                }
            ],
            //tab2联系人信息列表
            contacts: [
            ],
            //tab3银行卡信息
            bankAccount: [
            ],
            //tab4上传文件信息
            uploadedFiles: [

            ],

            mainProdArr: [],
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
            suppMainPro: [
            ],
            //以上为模拟数据
            body: {
                supplierName: '',
                supplierCode: '',
                contact: '',
                status: '',
                supplierLevel: '',
                supplierType: '',
                mainProd: ''
            },
            supplierLevel: '',
            supplierType: '',
            mainProd: '',
            prodType: '',
            supplier: {
                id: '',
                status: '1',
                contacts: [],
                sysFile: {
                    fileId: '',
                    fileType: 3,
                    fileDetails: []
                },
                bankCardInfos: [],
                supplierProds: []
            },
            data_config: {
                url: contextPath + '/supplier/list',
                colNames: ['操作', '供应商编码', '供应商名称', '类型', '等级', '主营商品', '地址', '默认联系人', '默认联系方式', '免息天数', '日利率', '有效状态', '最后修改人', '最后修改时间'],//jqGrid的列显示名字
                colModel: [ //jqGrid每一列的配置信息。包括名字，索引，宽度,对齐方式.....
                    {
                        name: 'id', index: 'supplierId', width: 55,
                        formatter: function (value, grid, rows, state) {
                            $(document).off("click", ".edit" + value).on("click", ".edit" + value, function () {

                            });
                            let btns = `<button class="edit${value}">编辑</button>`;
                            return btns
                        }, hidden: true
                    },
                    {
                        name: 'supplierCode', index: 'supplierCode', width: 130,
                        align: 'left',
                        formatter: function (value, grid, rows, state) {
                            $(document).off("click", ".detail" + value).on("click", ".detail" + value, function () {
                                //This.detailClick({value, grid, rows, state})
                                supplierVm.selected = [rows.id];
                                supplierVm.view()
                            });
                            let btns = `<a class="detail${value}">${value}</a>`;
                            return btns
                        }
                    },
                    {
                        name: 'supplierName', index: 'supplierName', width: 200,
                        align: 'left',
                    },
                    {
                        name: 'supplierType',
                        index: 'supplierType',
                        align: "left",
                        width: 80,
                        formatter: function (value, options, row) {
                            switch (value) {
                                case 1:
                                    return '战略型';
                                    break;
                                case 2:
                                    return '重点型';
                                    break;
                                case 3:
                                    return '常规型';
                                    break;
                                case 4:
                                    return '一般型';
                                    break;
                                default:
                                    return ''
                            }
                        }
                    },
                    { name: 'name', index: 'name', width: 100, align: 'left', },
                    { name: 'mainProd', index: 'mainProd', width: 250, align: 'left', },
                    { name: 'concreteAddress', index: 'concreteAddress', width: 300, align: 'left', },
                    { name: 'defaultContact', index: 'defaultContact', width: 100, align: 'left', },
                    { name: 'phone', index: 'phone', width: 100, align: "left" },
                    { name: 'freeInterestDay', index: 'freeInterestDay', width: 100, align: "right" },
                    { name: 'daliyRatio', index: 'daliyRatio', width: 100, align: "right" },
                    {
                        name: 'status',
                        index: 'status',
                        width: 100,
                        align: "left",
                        formatter: function (value, options, row) {
                            if (value == supplierVm.const.STATUS_YES) {
                                return '有效'
                            } else if (value == supplierVm.const.STATUS_NO) {
                                return '无效'
                            } else {
                                return '';
                            }
                        }
                    },
                    { name: 'updateName', index: 'updateName', width: 100, align: 'left', },
                    {
                        name: 'updateTime',
                        index: 'updateTime',
                        width: 200,
                        align: "center",
                        formatter: function (value, options, row) {
                            return new Date(value).format('yyyy-MM-dd hh:mm:ss');
                        }
                    }
                ],
                shrinkToFit: false,
            },
            option: [{ label: 'aaaa', value: 'bbbb' }],
            areaInit: {
                isInit: false,
                province: '',
                city: '',
                county: '',
                detail: '',
                disabled: false,

            },
            //是否展示上传控件
            showUpload: false,
            //是否显示商品类型弹窗
            showTypeTree: false,
            goodsTypeTreeSetting: {

            },
            beginValid: false,
        }

    },
    created() {
        this.goodsTypeTreeSetting = {
            check: {
                enable: true
            },
            data: {
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "parentId",
                    rootPId: 0
                },
                callback: {
                    onCheck: this.goodsTypezTree
                }
            }
        };
        this.loadSupplierLevels();
        this.loadCurrency();
        this.loadMainProducts();
        //加载数据字典数据-结算方式
        this.loadDictDataBilling("base_billing_method");
        //加载数据字典数据-付款方式
        this.loadDictDataPayMethod("base_pay_method");
        //加载数据字典数据-税分类
        this.loadDictDataTaxType("base_tax_type");
        //-供应商产品类型
        // this.loadSupplierProductType();
        //初始化组织
        this.initOrgin();
    },
    methods: {
        initCheckTypeNode(ids) {
            let idArr = ids.split(',').map(item => -Number(item));
            let ztree = $.fn.zTree.getZTreeObj("tree2");
            for (let j = 0; j < idArr.length; j++) {
                let id = idArr[j];
                let node = ztree.getNodeByParam("id", id);
                let parent = node.getParentNode();
                if (!parent.open) {
                    ztree.expandNode(parent, true, true);
                }
                ztree.checkNode(node, true, true);
            }
        },
        goodsTypeClick() {
            let _this = this;
            let selectTypes = _this.goodsTypezTree();
            let existNoInfo =  ((selectTypes.ids && selectTypes.ids.split(','))||[]).map(i=>Number(i)).some(id=>id > 0);
            if(existNoInfo){
                tip('info','请选择商品类型明细!');
                return;
            }
            _this.supplier.prodTypeName = selectTypes.names;
            _this.supplier.prodType = selectTypes.ids ? '' :selectTypes.ids.split(',').map(i=> Math.abs(Number(i))).join(',');
        },
        //商品类型
        goodsTypezTree(e, treeId, treeNode) {
            let treeObj = $.fn.zTree.getZTreeObj("tree2"),
                nodes = treeObj.getCheckedNodes(true);
            console.log(nodes);
            return Object.assign({}, {
                'names':
                    nodes.filter(node => !node.children).map(item => item.name).join(','),
                'ids':
                    nodes.filter(node => !node.children).map(item => Number(item.id)).join(',')            });
        },
        validate() {
            if (!this.supplier.supplierName) {
                this.alertMessege('供应商名称为空!');
                return false;
            }
            if (!this.supplier.siShortName) {
                this.alertMessege('供应商简称为空!');
                return false;
            }
            if (!this.supplier.supplierLevelId) {
                this.alertMessege('供应商等级为空!');
                return false;
            }
            if (!this.supplier.prodTypeName && !this.supplier.prodType) {
                this.alertMessege('供应商产品类型为空!');
                return false;
            }
            if (!this.supplier.supplierType) {
                this.alertMessege('供应商类型为空!');
                return false;
            }
            if (!this.supplier.payWay) {
                this.alertMessege('付款方式为空!');
                return false;
            }
            if (!this.supplier.billingCurrencyId) {
                this.alertMessege('结算币种为空!');
                return false;
            }
            if (!this.supplier.billingWay) {
                this.alertMessege('结算方式为空!');
                return false;
            }
            let ztree = $.fn.zTree.getZTreeObj("tree2");
            let checkedNodes = ztree.getCheckedNodes();
            if (checkedNodes.length === 0) {
                this.alertMessege('请点击供应商产品类型弹窗选取商品类型!');
                return false;
            }
            return true;

        },
        alertMessege(msg) {
            supplierVm.$Message.error({
                content: msg,
                duration: 3,
                closable: true
            });
        },
        handleSuccess(res, file) {
            if (res.code === supplierVm.const.SUCCESS_CODE) {
                supplierVm.addAttachment(file, res.data[0]);
            } else {
                tip('warning','上传失败!');
            }
        },
        handleFormatError(file) {
            this.$Notice.warning({
                title: '文件格式异常!',
                desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
            });
        },
        handleMaxSize(file) {
            this.$Notice.warning({
                title: '文件大小超出限制!',
                desc: '【' + file.name + '】的大小超过2M'
            });
        },
        handleBeforeUpload(file) {

        },
        modalOk() {
            this.showUpload = false;
        },
        modalCancel() {

        },
        initOrgin() {
            let _this = this;
            $.ajax({
                type: "POST",
                url: contextPath + "/supplier/paramMap",
                contentType: 'application/json',
                dataType: "json",
                async: false,
                success: function (data) {
                    if (data.code === "100100") {
                        let orgnArr = data.data.organList;
                        let organId = data.data.organId;
                        let index = -1;
                        for (let i = 0; i < orgnArr.length; i++) {
                            if (organId === orgnArr[i].id) {
                                index = i;
                                break;
                            }
                        }
                        orgnArr.splice(index, 1);
                        _this.colContent = orgnArr;

                    } else {
                        tip('warning',data.msg);
                    }
                },
                error: function (err) {
                    tip('warning','网络异常!');
                },
            })
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
                $(".chevron").css("top", "84%")
            } else {
                $(".chevron").css("top", "")
            }
        },
        showOrgin() {
            if (this.selected.length === 0) {
                tip('info','请选择行!');
                return;
            }
            this.showModal = true;
        },
        okModel() {
            if (this.selectOrginId.length === 0) {
                tip('info','请选择分配组织!');
                return;
            }
            let param = {
                ids: {},
                orginIds: {}
            }
            param.ids = this.selected.join(',');
            param.organIds = this.selectOrginId.join(',');
            this.cancelModel();
            let that = this;
            $.ajax({
                type: "POST",
                url: contextPath + '/supplier/allot',
                traditional: true,
                datatype: "json",//请求数据返回的类型。可选json,xml,txt
                data: param,
                success: function (result) {
                    if (result.code === "100100") {
                        tip('success','分配成功!');
                        that.selectOrginId = [];
                    } else {
                        tip('warning',result.msg);
                    }
                },
                error: function (err) {
                    tip('warning','服务器出错!');
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
        clearItem(name, ref) {
            if (this.$refs[ref]) {
                this.$refs[ref].reset();
            }
            this.$nextTick(() => {
                this.body[name] = '';
            })
        },
        search() {
            this.body.supplierLevel = this.supplierLevel === '' ? null : this.supplierLevel.join(',');
            this.body.supplierType = this.supplierType === '' ? null : this.supplierType.join(',');
            this.body.mainProd = this.mainProd === '' ? null : this.mainProd.join(',');
            
            this.reload = !this.reload;
        },
        clear() {
            //清空多选下拉框
            this.$refs.mainProd.selectMore = [];
            this.$refs.supplierLevel.selectMore = [];
            this.$refs.supplierType.selectMore = [];

            this.body = {
                supplierName: '',
                supplierCode: '',
                contact: '',
                status: '',
                supplierLevel: '',
                supplierType: '',
                mainProd: ''
            };
            this.tmpStatus = "all";
            this.supplierLevel = '';
            this.supplierType = '';
            this.mainProd = '';
            this.reload = !this.reload;
        },
        reload() {

        },
        loadSupplierLevels() {
            $.ajax({
                url: contextPath + '/tclientlevel/listForApply?apply=1&ktcStatus=0',
                dataType: 'json',
                method: 'post',
                data: {},
                success: function (res) {
                    supplierVm.suppLevel = [];
                    if (res.code === supplierVm.const.SUCCESS_CODE && res.data.length > 0) {
                        supplierVm.suppLevel = res.data;
                    }
                },
                error: function (e) {
                    console.log(e)
                }
            })
        },
        loadCurrency() {
            $.ajax({
                url: contextPath + '/currency/queryAll',
                dataType: 'json',
                method: 'post',
                data: {},
                success: function (res) {
                    if (res.code === supplierVm.const.SUCCESS_CODE && res.data.length > 0) {
                        supplierVm.currency = res.data;
                    }
                },
                error: function (e) {
                    console.log(e)
                }
            })
        },
        loadMainProducts: function () {
            $.ajax({
                url: contextPath + '/tmainproductcategory/queryall',
                dataType: 'json',
                method: 'post',
                data: {ktcStatus:0},
                success: function (res) {
                    supplierVm.suppMainPro = [];
                    supplierVm.mainProduct = [];
                    if (res.code === supplierVm.const.SUCCESS_CODE && res.data.length > 0) {
                        supplierVm.mainProduct = res.data;
                    }
                },
                error: function (e) {
                    console.log(e)
                }
            })
        },
        //加载数据字典数据-结算方式
        loadDictDataBilling(mark) {
            let _this = this;
            let billingList = getCodeList(mark);
            _this.billing = [];
            for (let item of billingList) {
                _this.billing.push(Object.assign({}, { name: item.name, code: item.value }));
            }
        },
        //加载数据字典数据-付款方式
        loadDictDataPayMethod(mark) {
            let _this = this;
            let payMethods = getCodeList(mark);
            _this.payMethod = [];
            for (let item of payMethods) {
                _this.payMethod.push(Object.assign({}, { name: item.name, code: item.value }));
            }
        },
        //加载数据字典数据-税分类
        loadDictDataTaxType(mark) {
            let _this = this;
            let taxTypes = getCodeList(mark);
            _this.taxType = [];
            for (let item of taxTypes) {
                _this.taxType.push(Object.assign({}, { name: item.name, code: item.value }));
            }
        },
        //加载数据字典数据-供应商产品类型 -not used
        loadSupplierProductType() {
            $.ajax({
                url: contextPath + '/tbasecommoditycategotyinfo/list',
                dataType: 'json',
                method: 'post',
                data: { customCode: '0.' },
                success: function (res) {
                    if (res.code === supplierVm.const.SUCCESS_CODE && res.data.length > 0) {
                        supplierVm.productType = [];
                        supplierVm.productType = res.data;
                    }
                },
                error: function (e) {
                    console.log(e)
                }
            })
        },
        //加载供应商产
        //点击保存时
        save() {
            this.mpisEdit = (this.mainProdArr === "");
            if (this.mpisEdit) {
                return false;
            }
            //校验表单先
            let contacts = supplierVm.supplier.contacts;
            var emailIsVaild = true;
            var phoneIsVaild = true;
            var nameOrPhoneFlag = true;
            var containDefaultContact = false;
            const  reg = /^[a-z0-9]+([._\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
            console.log(contacts);
            if (contacts.length > 0) {
                $.each(contacts, function (i, o) {
                    if (o.isDel == 1 && (!ht.util.hasValue(o.name, 'string') || !ht.util.hasValue(o.phone, 'string'))) {
                        nameOrPhoneFlag = false;
                    }
                    if ((o.isDel == supplierVm.const.IS_DEL_NO && o.isDefault == supplierVm.const.IS_DEFAULT_YES)) {
                        containDefaultContact = true;
                    }
                    if (ht.util.hasValue(o.email) && o.isDel == supplierVm.const.IS_DEL_NO) {
                        if (!reg.test(o.email)) {
                            emailIsVaild = false;
                        }
                    }
                    if (ht.util.hasValue(o.phone) && o.isDel == supplierVm.const.IS_DEL_NO) {
                        if (!(/^1[34578]\d{9}$/.test(o.phone))) {
                            phoneIsVaild = false;
                        }
                    }
                });
            }
            if (!emailIsVaild) {
                tip('info','请输入正确的邮箱或邮箱格式!');
                return false;
            }
            if (!phoneIsVaild) {
                tip('info','请输入正确的手机或手机格式!');
                return false;
            }
            if (!nameOrPhoneFlag) {
                tip('info','请补全联系人信息!');
                return false;
            }
            if (!containDefaultContact) {
                tip('info','请勾选默认联系人!');
                return false;
            }
            //组装主营商品数据到后台,先清空原有的
            supplierVm.supplier.supplierProds = [];
            $.each(this.mainProdArr, function (i, o) {
                supplierVm.supplier.supplierProds.push(Object.assign({}, { prodId: o, supplierId: null }));
            });
            // console.log(supplierVm.area)
            if ($('form').valid() && this.validate()) {
                window.top.home.loading('show', { text: '保存中，请稍后!' });
                //获取省市区地址信息
                if (ht.util.hasValue(supplierVm.area, 'object')) {
                    Object.assign(supplierVm.supplier, supplierVm.area);
                }
                console.log(JSON.stringify(this.supplier));
                let sendUrl = this.supplier.id ? contextPath + "/supplier/update" : contextPath + "/supplier/save";
                $.ajax({
                    url: sendUrl,
                    dataType: 'json',
                    data: JSON.stringify(this.supplier),
                    contentType: 'application/json;charset=utf-8',
                    method: 'post',
                    success: function (res) {
                        if (res.code === supplierVm.const.SUCCESS_CODE) {
                            supplierVm.supplier.supplierCode = res.data;
                            tip('success',res.msg);
                            //操作成功后清空所有
                            supplierVm.supplier = {
                                contacts: [],
                                sysFile: {
                                    fileId: '',
                                    fileType: 3,
                                    fileDetails: []
                                },
                                bankCardInfos: [],
                                supplierProds: [],
                                status: '1',
                            };
                            supplierVm.mainProdArr = [];
                            //关闭编辑页面重新加载数据
                            supplierVm.isEdit = !supplierVm.isEdit;
                            supplierVm.body = {};
                            supplierVm.reload = !supplierVm.reload;
                        } else {
                            tip('warning',res.msg);
                        }
                        window.top.home.loading('hide');
                    },
                    error: function (e) {
                        console.log(e);
                        window.top.home.loading('hide');
                    }

                });
            }
        },
        //点击修改时
        modify() {
            //修改tab页标题
            this.isSave = false;
            if (!ht.util.hasValue(this.selected, "array")) {
                tip('info','请先选择一条记录!');
                return false;
            } else if (this.selected.length > 1) {
                tip('info','最多只能选择一条记录!');
                return false;
            }
            //id 取值没有问题后 开始修改
            $.ajax({
                url: contextPath + '/supplier/info',
                method: 'post',
                dataType: "json",
                data: { supplierId: this.selected[0] },
                success: function (res) {
                    if (res.code === supplierVm.const.SUCCESS_CODE) {
                        //把供应商的id存在 表单隐藏域中 方便实现校验逻辑
                        $("#id").val(res.data.id);
                        if (!res.data.sysFile) {
                            let emptyFileObj = Object.assign({}, {
                                sysFile: {
                                    fileId: '',
                                    fileType: 3,
                                    fileDetails: []
                                }
                            });
                            supplierVm.supplier = Object.assign({}, res.data, emptyFileObj);
                        } else {
                            supplierVm.supplier = Object.assign({}, res.data);
                        }
                        console.log(supplierVm.supplier)
                        supplierVm.mainProdArr = [];
                        //回显主营商品
                        $.each(res.data.supplierProds, function (i, o) {
                            supplierVm.mainProdArr.push(o.prodId)
                        });
                        supplierVm.$refs.mainProdArr.selectMore = supplierVm.mainProdArr;

                        //回显注册时间
                        if (res.data.regTime) {
                            supplierVm.$refs.regTime.date = res.data.regTime.substr(0, 10);
                        }
                        //回显省市区
                        //先清空组件引用
                        if (res.data.province) {
                            supplierVm.areaInit = {
                                isInit: true,
                                province: res.data.province,
                                city: res.data.city,
                                county: res.data.county,
                                detail: res.data.detail,
                                disabled: false,
                            }
                        }
                        if (res.data.prodType) {
                            supplierVm.initCheckTypeNode(res.data.prodType);
                        }

                    }
                    supplierVm.isEdit = true;
                },
                error: function (res) {
                    supplierVm.isEdit = true;
                }
            });

            let $li = $("#tab1 li");
            $li.siblings().removeClass("layui-this");
            $li.eq(0).click();

        },
        //点击查看时
        view(selected) {
            let id = selected;

            if (!id) {
                let ids = this.selected;
                if (!ht.util.hasValue(ids, "array")) {
                    tip('info','请先选择一条记录!');
                    return false;
                } else if (ids.length > 1) {
                    tip('info','最多只能选择一条记录!');
                    return false;
                } else {
                    id = ids[0];
                }
            }

            this.pageGridInit(id);
            $.ajax({
                url: contextPath + '/supplier/info',
                method: 'post',
                dataType: "json",
                data: { supplierId: id },
                success: function (res) {
                    if (res.code === supplierVm.const.SUCCESS_CODE) {
                        //把供应商的id存在 表单隐藏域中 方便实现校验逻辑
                        $("#id").val(res.data.id);
                        if (!res.data.sysFile) {
                            let emptyFileObj = Object.assign({}, {
                                sysFile: {
                                    fileId: '',
                                    fileType: 3,
                                    fileDetails: []
                                }
                            });
                            supplierVm.supplier = Object.assign({}, res.data, emptyFileObj);
                        } else {
                            supplierVm.supplier = Object.assign({}, res.data);
                        }
                        console.log(supplierVm.supplier)
                        supplierVm.mainProdArr = [];
                        //回显主营商品
                        let prodNames = [];//supplierVm.mainProduct
                        $.each(supplierVm.mainProducts, function (i, o) {
                            let mainP = o;
                            $.each(res.data.supplierProds, function (i, o) {
                                if (mainP.code === o.prodId) {
                                    prodNames.unshift(mainP.name);
                                }
                            });
                        });
                        $("#mainProdInfo").val(prodNames.join(','));

                        if (res.data.province) {
                            supplierVm.areaInit = {
                                isInit: true,
                                province: res.data.province,
                                city: res.data.city,
                                county: res.data.county,
                                detail: res.data.detail,
                                disabled: true,
                            }
                        }
                    }
                    supplierVm.isInfo = true;
                },
                error: function (res) {
                    supplierVm.isInfo = true;
                }
            });
            let $li = $("#tab1 li");
            $li.siblings().removeClass("layui-this");
            $li.eq(0).click();


            $('#supplier2 .ivu-select').addClass("ivu-select-disabled");
        },
        //点击删除时
        del() {
            let ids = supplierVm.selected;
            if (!ht.util.hasValue(ids, "array")) {
                tip('info','请先选择一条记录!');
                return false;
            }
            supplierVm.$Modal.confirm({
                title: '提示信息',
                content: '当前数据有可能被引用，会影响数据准确性，确认是否删除？',
                onOk: function () {
                    $.ajax({
                        url: contextPath + '/supplier/delete',
                        method: 'post',
                        dataType: "json",
                        data: JSON.stringify(ids),
                        contentType: 'application/json;charset=utf-8',
                        success: function (res) {
                            if (res.code === supplierVm.const.SUCCESS_CODE) {
                                setTimeout(() => {
                                    tip('success','删除成功!');
                                    //重新加载表单页
                                    supplierVm.selected = [];
                                    supplierVm.reload = !supplierVm.reload;
                                }, 300);

                            } else {
                                tip('warning',res.msg);
                            }
                        },
                        error: function (e) {
                            console.log(e);
                        }
                    });
                }
            });
        },
        //提示弹窗
        alertMsg(msg, onlySure) {
            this.confirmConfig = {
                showConfirm: true,
                title: '提示',
                content: msg,
                onlySure: onlySure,
                success: true
            }
        },
        //点击增加时
        add() {
            //省市区下拉框初始化
            supplierVm.areaInit = {
                isInit: false,
                province: '',
                city: '',
                county: '',
                detail: '',
                disabled: false
            };

            //显示新增页面标题
            this.isSave = true;

            $("#tab2 li").siblings().removeClass("layui-this");
            // $(".layui-tab-title li").eq(0).addClass("layui-this");
            $("#tab2 li").eq(0).click();
            //显示新增/修改页 隐藏列表页
            this.isEdit = true;

            //清空主营商品多选框
            this.$refs.mainProdArr.selectMore = [];
            //清空供应商主营商品多选框
            // this.$refs.prodType.selectMore = [];
            //清空注册日期
            this.$refs.regTime.date = '';
            //把表单 id隐藏域的值置空
            $("#id").val(null);
        },
        //点击退出时
        exitTab() {
            //清空上传文件列表
            this.$refs.upload.clearFiles();
            //选项卡默认为选中第一个
            $("#tab2").siblings().removeClass("layui-this");
            // $(".layui-tab-title li").eq(0).addClass("layui-this");
            $("#tab2").eq(0).click();


            //退出时 置空 供应商信息
            supplierVm.supplier = {
                contacts: [],
                sysFile: {
                    fileId: '',
                    fileType: 3,
                    fileDetails: []
                },
                bankCardInfos: [],
                supplierProds: [],
                status: '1',
            };
            this.isEdit = false;
            $("form").validate().resetForm();
        },
        //tab2添加联系人
        addContacts() {
            let contact = {
                name: '',
                phone: '',
                landline: '',
                wechat: '',
                isDefault: '0',
                email: '',
                isDel: '1'
            };
            supplierVm.supplier.contacts.push(contact);
        },
        //点击默认联系人
        clickContacts(index) {
            $.each(supplierVm.supplier.contacts, function (i, o) {
                if (index === i) {
                    o.isDefault = supplierVm.const.IS_DEFAULT_YES;
                } else {
                    o.isDefault = supplierVm.const.IS_DEFAULT_NO;
                }
            });
        },
        //点击银行卡信息
        clickAccount(index) {
            $.each(supplierVm.supplier.bankCardInfos, function (i, o) {
                if (index === i) {
                    o.isDefault = supplierVm.const.IS_DEFAULT_YES;
                } else {
                    o.isDefault = supplierVm.const.IS_DEFAULT_NO;
                }
            });
        },
        //tab3添加银行卡信息
        addBankAccount() {
            let bankAccount = {
                name: '',
                holder: '',
                isDefault: supplierVm.const.IS_DEFAULT_NO,
                account: '',
                isDel: supplierVm.const.IS_DEL_NO
            };
            supplierVm.supplier.bankCardInfos.push(bankAccount);
        },
        //tab2删除单个联系人
        delContact: function (item, idx) {
            supplierVm.$Modal.confirm({
                title: '提示信息',
                content: '是否要删除这条信息?',
                onOk: function () {
                    if (!item.name || !item.phone || !item.wechat || !item.email || !item.landline) {
                        supplierVm.supplier.contacts.splice(idx, 1);
                    } else {
                        item.isDel = '0';
                    }
                    tip('success','删除成功!');
                }
            });
        },
        //tab3删除单个银行卡信息
        delAccount: function (item, idx) {
            supplierVm.$Modal.confirm({
                title: '提示信息',
                content: '是否要删除这条信息?',
                onOk: function () {
                    if (!item.account || !item.holder || !item.name) {
                        supplierVm.supplier.bankCardInfos.splice(idx, 1);
                    } else {
                        item.isDel = '0';
                    }
                    tip('success','删除成功!');
                }
            });
        },
        //tab4删除单个文件信息
        delFile(item) {
            supplierVm.$Modal.confirm({
                title: '提示信息',
                content: '是否要删除这条信息?',
                onOk: function () {
                    // 这里先根据数据有没有id 来判断是原有的还是新增的
                    item.del = true;
                }
            });
        },
        addAttachment: function (file, res) {
            let attachment = {
                fdName: file.name,
                fdSize: (file.size / 1024).toFixed(2) + "kb",
                uploadTime: res.uploadTime,
                uploadUser: res.uploadUser,
                fdUrl: res.fdUrl,
                fdType: 3,
                del: false,
            };
            supplierVm.supplier.sysFile.fileDetails.push(attachment);
        },
        //下载附件
        download(item) {
            if (!item.fdUrl) {
                tip('info','文件地址为空!请先上传文件!');
                return false;
            }
            let paramsArray = [];
            Object.keys(item).forEach(key => paramsArray.push(key + '=' + item[key]));
            let url = contextPath + '/supplier/download?' + paramsArray.join('&');
            location.href = encodeURI(url);
        },
        uploadfile() {
            this.showUpload = true;
        },
        goBack() {
            this.isInfo = false;
            //选项卡默认为选中第一个

            this.supplier = {
                contacts: [],

                bankCardInfos: [],
                supplierProds: [],
                status: '1',
                sysFile: {
                    fileId: '',
                    fileType: 3,
                    fileDetails: []
                }
            };
        },
        confirmSure() {
            this.confirmConfig.showConfirm = false;
        },
        confirmCancel() {
            this.confirmConfig.showConfirm = false;
        },
        pageGridInit(id) {
            this.logUrl = contextPath + "/supplierlog/list?nd=" + new Date().getTime() + "&supplierId=" + id;
        },
        exit() {
            window.parent.closeCurrentTab({ exit: true, openTime: this.openTime });
        },
        copy() {
            //修改tab页标题
            this.isSave = false;
            if (!ht.util.hasValue(this.selected, "array")) {
                tip('info', '请先选择一条记录!' );
                return false;
            } else if (this.selected.length > 1) {
                tip('info', '最多只能选择一条记录!' );
                return false;
            }
            //id 取值没有问题后 开始修改
            $.ajax({
                url: contextPath + '/supplier/info',
                method: 'post',
                dataType: "json",
                async: false,
                data: { supplierId: this.selected[0] },
                success: function (res) {
                    if (res.code === supplierVm.const.SUCCESS_CODE) {
                        //把供应商的id存在 表单隐藏域中 方便实现校验逻辑
                        $("#id").val(res.data.id);
                        if (!res.data.sysFile) {
                            let emptyFileObj = Object.assign({}, {
                                sysFile: {
                                    fileId: '',
                                    fileType: 3,
                                    fileDetails: []
                                }
                            });
                            supplierVm.supplier = Object.assign({}, res.data, emptyFileObj);
                        } else {
                            supplierVm.supplier = Object.assign({}, res.data);
                        }
                        //清空id supplierName,siShortName,supplierCode
                        supplierVm.supplier.id = null;
                        supplierVm.supplier.supplierCode = '';
                        supplierVm.supplier.siShortName = '';
                        supplierVm.supplier.supplierName = '';

                        supplierVm.mainProdArr = [];
                        //回显主营商品
                        $.each(res.data.supplierProds, function (i, o) {
                            supplierVm.mainProdArr.push(o.prodId)
                        });
                        supplierVm.$refs.mainProdArr.selectMore = supplierVm.mainProdArr;
                        //回显注册时间
                        if (res.data.regTime) {
                            supplierVm.$refs.regTime.date = res.data.regTime.substr(0, 10);
                        }
                        //回显省市区
                        //先清空组件引用
                        if (res.data.province) {
                            supplierVm.areaInit = {
                                isInit: true,
                                province: res.data.province,
                                city: res.data.city,
                                county: res.data.county,
                                detail: res.data.detail,
                                disabled: false,
                            }
                        }
                        if (res.data.prodType) {
                            supplierVm.initCheckTypeNode(res.data.prodType);
                        }
                    }
                    supplierVm.isEdit = true;
                },
                error: function (res) {
                    supplierVm.isEdit = true;
                }
            });

        }

    },
    computed: {
        mainProducts() {
            let _this = this;
            let _arr = [];
            this.mainProduct.map((item) => {
                if (item.status === 1 && item.isDel === 1) {
                    _arr.push(Object.assign({}, { code: item.id, name: item.name }));
                }
                if (_this.mainProdArr && _this.mainProdArr.length > 0) {
                    for (let pro of _this.mainProdArr) {
                        if (item.id === pro.prodId) {
                            _arr.push(Object.assign({}, { code: item.id, name: item.name }));
                        }
                    }
                }
            }
            );
            let hash = {};
            return _arr.length === 0 ? [] : _arr.reduce(function (item, next) {
                hash[next.code] ? '' : hash[next.code] = true && item.push(next);
                return item;
            }, []);
        },
    },
    watch() {

    },
    mounted() {
        //validate start
        $.validator.addMethod("pattern", function (value, element, params) {

            if (!params.test(value)) {
                return false;
            }
            return true;
        });
        $.validator.addMethod("isPositiveInteger", function (value, element) {
            var isPositiveInteger = /^([0-9]*[1-9][0-9]*)$/;
            return this.optional(element) || isPositiveInteger.test(value);
        }, "请输入正整数");
        $.validator.addMethod("isDecimal", function (value, element) {
            var isDecimal = /^(\d{1,2}(\.\d{1,2})?|100)$/;
            return this.optional(element) || isDecimal.test(value);
        }, "0-100之间的数据，支持2位小数!");
        $.validator.addMethod("onlyDecimal", function (value, element) {
            var onlyDecimal = /(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2}))$/;
            return this.optional(element) || onlyDecimal.test(value);
        }, "只能填写小数,不能超过2位小数!");
        $.validator.addMethod("isBlank", function (value, element) {
            var isBlank = /^\s+$/;
            return this.optional(element) || isBlank.test(value);
        }, "请输入正确的值，禁止全部空格!");


        $('form').validate(validateOptions);
        this.openTime = window.parent.params.openTime;

        let params = window.parent.params.params;
        if (params && params.type === 'query' && params.id) {
            this.view(params.id);
        }
    }
});