var vm = new Vue({
    el: "#app",
    data: {
        htHaveChange:false,
        ruleValidate: {
            goodsTypeName: [
                { required: true }
            ],
            businessType: [
                { required: true}
            ],
            stockTime: [
                { required: true}
            ],
            recMaterialDepartmentName: [
                { required: true}
            ],
            supplierId: [
                { required: false}
            ]
        },
        codesUsed:{},
        showRows:true,
        // supplierDisabled:true,
        goodsListTotalWeight:0,
        totalDetailPurchaseCost:0,
        totalDetailMarketCost:0,
        totalPurPriceCost:0,
        totalSalePrice:0,
        showTemp:true,
        one:true,
        isShow: false,
        reload: false,
        isSearchHide: true,
        isTabulationHide: true,
        isClearable:true,
        businessType:"",
        // showProduct:false,
        // barCodeDetail:true,
        //审核进度条
        stepList: [],
        //商品明细弹框石料进货价格
        // totalStonePurchasePrice:[],
        //商品明细弹框石料销售价格
        // totalStonePrice:[],
        psiDocTypes:[
            {label:'采购入库',value:'W_PURCHASE_STOCK_IN_01'},
            {label:'供应商退料入库',value:'W_PURCHASE_STOCK_IN_02'},
            // {label:'客户送料入库',value:'W_PURCHASE_STOCK_IN_03'},
        ],
        //当前组织名 显示用
        currOrgName:'',
        psiForm:{
            //业务类型
            businessType: '',
            //单据编号
            stockNo: '',
            //采购部门id
            purDepartmentId: '',
            //采购部门名称
            purDepartmentName:'',
            //收料部门id
            recMaterialDepartmentId:'',
            //收料部门名称
            recMaterialDepartmentName:'',
            //采购人id
            buyerId:'',
            //采购员名称
            buyerName:'',
            //入库日期
            stockTime:new Date(),
            //仓管员id
            stockKeeperId:'',
            //仓管员名称
            stockKeeper:'',
            //客户名称
            custName:'',
            //客户编码
            custCode:'',
            //客户id
            custId:'',
            //供应商名称
            supplierName:'',
            //供应商编码
            supplierCode:'',
            //供应商id
            supplierId:'',
            //源单类型
            sourceDocType:'',
            //id
            id:'',
            //商品类型id
            goodsTypeId:'',
            //商品类型名称
            goodsTypeName:'',
            // 0:代表上游生成 1:代表手动新增
            dataSource:'',
            docStatus:1
        },
        purchaseStockDetails:[],
        delPurchaseStockDetails:[],
        goodList:[],
        categoryType:[],
        goodsTypes:[],
        treeSetting: {},
        showDepartment:false,
        customers:[],
        suppliers:[],
        isSelectAll:'',
        goodsTypesArr:[],
        selectedIndex:'',
        units:[],
        currentTab:'purchaseDetail',
        warehouses:[],
        warehousePositions:[],
        modalTrigger:false,
        modalType:'',
        goldColors:[],
        certifiTypes:[],
        approvalTableData:[],
        //明细弹窗相关
        detailSelectedIdx:'',
        productDetailModal: {
            showModal: false,
            ids: {
                goodsId: '',
                commodityId: '',
                documentType: 'W_STOCK_IN'
            }
        },
        goldDetailModal:{
            showModal: false,
            ids: {
                goodsId: '',
                commodityId: '',
                documentType: 'W_STOCK_IN_GOLD'
            }
        },
        importExcelType:'',
        excelFile:'',
        documentType: 'W_PURCHASE_STOCK_IN',
        excelParam:'',
        specialAttr:{},
        submitValid:true,
        // canBeEdited:true,
        openTime:'',
        isHideDivided:false,
        employees:[],
        openType:'',
        //每次新增行时 给商品编码下拉框 赋的初始 option
        rawOptionData:[],
        unitConvertObj:{}
    },
    created(){
        this.specialAttr ={
            stone: [{
                name:'条码号',
                code:'stoneNo',
                edit:true,
                test: false
            },
                {
                    name:'进价',
                    code:'inPrice',
                    edit:true
                },
                {
                    name:'单价',
                    code:'price',
                    edit:true
                },
            ],
            gold:[],
            part:[ {
                name:'进价',
                code:'inPrice',
                edit:true
            },
                {
                    name:'单价',
                    code:'price',
                    edit:true
                }],
        };
        this.loadCategories();
        this.treeSetting = {
            callback: {
                onClick: this.treeClickCallBack,
                beforeClick: this.treeBeforeClick
            },
            check: {
                enable: true,
                chkStyle: "radio",  //单选框
                radioType: "all"   //对所有节点设置单选
            },
        };
        // this.loadCustomers();
        this.loadSuppliers();
        this.loadUnits();
        this.loadWarehouses();
        this.ajaxGetWareHousePositions();
        this.loadEmployees();
        this.goldColors = getCodeList('base_Condition');
        this.certifiTypes = getCodeList('base_certificate_type');
        this.openTime = window.parent.params.openTime;
        window.handlerClose = this.handlerClose;
    },
    methods: {
        htTestChange(){
            this.htHaveChange = true;
            console.log(333)
        },
        //条码明细弹窗 点击确定 自动计算(计重单位换算) 总件重
        // PS:只有成品需要
        handleCalcWeight(e){
            console.log(e);
            let _this = this;
            let selectedGoods = _this.goodList[_this.detailSelectedIdx];
            //只有成品才需要计算总重
            if(selectedGoods.goodsMainType !== 'attr_ranges_goods'){
               return;
            }
            selectedGoods.totalWeight = e.totalWeight || 0.000;
            selectedGoods.viceStoneWeight = e.viceStoneWeight || 0.000;
            _this.$set(_this.goodList,_this.detailSelectedIdx,selectedGoods);
        },
        // 初始化供应商组件
        initSupplier(id){
            let _this = this;
            if(id){
                let fetchSupplierName = (id) =>{
                    let _r =  _this.suppliers.find(item=>item.value === id) ;
                    return _r ? _r.supplierName : '';
                };
                let supplierName = fetchSupplierName(id);
                _this.$refs.selectSupplier.haveInitValue(supplierName,'');
            }
        },
        //供应商组件关闭 赋值 校验操作
        closeSupplier(id,code,name){
            this.psiForm.supplierId = id;
            this.psiForm.supplierCode = code;
            this.psiForm.supplierName = name;
            if(this.$refs.formValidate){
                this.$refs.formValidate.validateField('supplierId')
            }

        },
        // 更新当前页面中 已经选中的条码
        // 将它们从 ht-code-select 组件的下拉选项中 剔除
        updateCodesUsed(value, index){
            let vm = this;
            let codesUsed = {};
            let codesUsedMain = {};
            let codesUsedDetail = {};
            let goodsEntities = vm.goodList || [];

            // 如果 ht-code-select 内的条形码有改动（即：原来输入的条码长度有改变），清空对应下标的原条形码
            if (typeof value !== 'undefined' && typeof index !== 'undefined') {
                if (String(value).length !== 8) {
                    goodsEntities[index].goodsBarcode = '';
                }
            }

            // 获取主列表内占用的条形码
            $.each(vm.purchaseStockDetails, function(idx, ele){
                if($.isArray(ele.goodList) && ele.goodList.length > 0){
                    $.each(ele.goodList, function(i, e){
                        codesUsedMain[Number(e.goodsBarcode)] = ''; // 空串即可，只使用 key 占位
                    });
                }
            });

            // 获取明细列表中占用的条形码
            if($.isArray(goodsEntities) && goodsEntities.length > 0){
                $.each(goodsEntities, function(idx, ele){
                    codesUsedDetail[Number(ele.goodsBarcode)] = ''; // 空串即可，只使用 key 占位
                });
            }

            // 汇总当前页内已被选中的条形码（在所有选条形码的 ht-code-select 的下拉选项中排除）
            codesUsed = $.extend(true, {}, codesUsedMain, codesUsedDetail);

            vm.codesUsed = codesUsed;
        },
        //当商品类型的下拉框 change 的时候 拉取 商品编码 options
        getRawOptionData(commodityCode){
            let _this = this;
            $.post(contextPath+'/tbasecommodity/findByType',{categoryCustomCode:commodityCode,field:'',limit:''},(res)=>{
                if(res.code === '100100' ){
                    _this.rawOptionData = res.data || [];
                }
            },'json');
        },
        loadEmployees(){
            let _this = this;
            $.ajax({
                url:contextPath + '/purchasestock/queryStockKeepers',
                method:'post',
                data:{},
                success:function (res) {
                    if(res.code === '100100'){
                        _this.employees = res.data;
                    }else {
                        _this.$Modal.warning({content:res.msg,title:'提示信息'});
                    }
                }
            });
        },
        //表格模糊搜索下拉错位的问题
        getSelect(parent, child){
            return repositionDropdownOnSroll(parent,child);
        },
        //批量填充列
        fillColumn(){
            return this.getAmount(this.detailSelectedIdx)
        },
        getAmount(index) {
            if(index >= 0 ){
                var totalWeight = document.getElementById("totalWeight"+index).value;
                var purchaseGoldPrice = document.getElementById("purchaseGoldPrice"+index).value;
                var goldPrice = document.getElementById("goldPrice"+index).value;
                var goldPurchase = document.getElementById("goldPurchase"+index).value;
                var purchaseLaborCharge = document.getElementById("purchaseLaborCharge"+index).value;
                var processingFee = document.getElementById("processingFee"+index).value;
                var purCertificateFee = document.getElementById("purCertificateFee"+index).value;
                var certificateFee = document.getElementById("certificateFee"+index).value;
                var marketCost = document.getElementById("marketCost"+index).value;
                var saleRate = document.getElementById("saleRate"+index).value;
                this.$nextTick(()=> {
                    this.goodList.map(item => {
                        item.totalWeight = totalWeight;
                        item.marketCost = marketCost;
                        item.purchaseGoldPrice = purchaseGoldPrice;
                        item.goldPrice = goldPrice;
                        item.goldPurchase = goldPurchase;
                        item.purchaseLaborCharge = purchaseLaborCharge;
                        item.processingFee = processingFee;
                        item.purCertificateFee = purCertificateFee;
                        item.certificateFee = certificateFee;
                        item.saleRate = saleRate;
                    })
                })
            }
        },
        //隐藏已分称
        hideDivided(){
            let _this = this;
            if(_this.purchaseStockDetails.length === 0) return;
            //v-if="item.divisionStatus == 1 ? showRows : 'true'"
            // showRows 的默认值为 true,
            _this.showRows = !_this.showRows;
        },
        exit(close) {
            if(close === true){
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
                return;
            }
            if(this.handlerClose()){
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
            }
        },
        handlerClose(){
            if((!this.psiForm.docStatus || this.psiForm.docStatus === 1) && (this.htHaveChange || accessVm.htHaveChange)){
                this.$nextTick(()=>{
                    this.$refs.closeModalRef.showCloseModal();
                });

                return false;
            }

            return true;
        },
        closeModal(type){
            if(type === 'yes'){//提交数据
                if(this.openType !== 'query' && (!this.psiForm.docStatus || this.psiForm.docStatus === 1)){
                    this.save('tmp_save', 'formValidate');
                }
                this.exit(true);
            }else if(type === 'no'){//关闭页面
                this.exit(true);
            }
        },
        //计算商品明细中售价成本*销售倍率
        salePriceAction(index){
            if(this.detailSelectedIdx === index){
                if(this.goodList[this.detailSelectedIdx].saleRate && this.goodList[this.detailSelectedIdx].purPriceCost){
                    var price = Number(this.goodList[this.detailSelectedIdx].saleRate) * Number(this.goodList[this.detailSelectedIdx].purPriceCost);
                    this.goodList[this.detailSelectedIdx].salePrice = price.toFixed(2);
                    this.$forceUpdate();
                }
            }

        },
        //表格内输入小数
        clearNoNumber(item,type,floor){
            return htInputNumber(item,type,floor)
        },
        //验证表格内容是否为空
        tableValidate(){
            let This = this;
            if(This.psiForm.businessType === 'W_PURCHASE_STOCK_IN_02' ) {
                let validate = {
                    goodsBarcode:{
                        name: '条码号',
                        type: 'string'
                    },
                    certificateType:{
                        name: '证书类型',
                        type: 'string'
                    },
                    // certificateNo:{
                    //     name: '证书编号',
                    //     type: 'string'
                    // },
                    totalWeight:{
                        name: '总件重',
                        type: 'number',
                        floor:3
                    },
                    netGoldWeight:{
                        name: '净金重',
                        type: 'number',
                        floor:3
                    },
                    mainStoneWeight:{
                        name: '主石重',
                        type: 'number',
                        floor:3,
                    },
                    purchaseGoldLose:{
                        name: '进货金耗',
                        type: 'number',
                        floor:2
                    },
                    goldPurchase:{
                        name: '金耗',
                        type: 'number',
                        floor:2
                    },
                    // purchaseLaborCharge:{
                    //     name: '进货工费',
                    //     type: 'number',
                    //     floor:2
                    // },
                    // processingFee:{
                    //     name: '销售工费',
                    //     type: 'number',
                    //     floor:2
                    // },
                    purchaseCost:{
                        name: '进货成本',
                        type: 'number',
                        floor:2
                    },
                    // marketCost:{
                    //     name: '市场成本',
                    //     type: 'number',
                    //     floor:2
                    // },
                    purPriceCost:{
                        name: '销售成本',
                        type: 'number',
                        floor:2
                    },
                    saleRate:{
                        name: '销售倍率',
                        type: 'number',
                        floor:2
                    },
                };
                return goodsValidateRow(this.purchaseStockDetails, validate,true,"商品明细");
            }else {
                let validate1 = {
                    certificateType:{
                        name: '证书类型',
                        type: 'string'
                    },
                    // certificateNo:{
                    //     name: '证书编号',
                    //     type: 'string'
                    // },
                    totalWeight:{
                        name: '总件重',
                        type: 'number',
                        floor:3
                    },
                    netGoldWeight:{
                        name: '净金重',
                        type: 'number',
                        floor:3
                    },
                    mainStoneWeight:{
                        name: '主石重',
                        type: 'number',
                        floor:3
                    },
                    // purchaseGoldLose:{
                    //     name: '进货金耗',
                    //     type: 'number',
                    //     floor:2
                    // },
                    // goldPurchase:{
                    //     name: '金耗',
                    //     type: 'number',
                    //     floor:2
                    // },
                    purchaseCost:{
                        name: '进货成本',
                        type: 'number',
                        floor:2
                    },
                    // marketCost:{
                    //     name: '市场成本',
                    //     type: 'number',
                    //     floor:2
                    // },
                    purPriceCost:{
                        name: '销售成本',
                        type: 'number',
                        floor:2
                    },
                    saleRate:{
                        name: '销售倍率',
                        type: 'number',
                        floor:2
                    },
                };
                return goodsValidateRow(this.purchaseStockDetails, validate1,true,"商品明细");
            }
        },
        // '列表'按钮 绑定事件
        goBackList(){
            window.parent.activeEvent(
                {name: '采购入库列表',
                    url: contextPath+'/warehouse/purchase-stock-in/purchase-stock-in-list.html',
                    params: {}
                });
        },
        //'审核'按钮 绑定事件
        approval(){
            let _this = this;
            if(_this.docStatus === 1 || !this.psiForm.stockNo){
                _this.$Modal.info({
                    title: "提示信息",
                    content: "请先提交入库单!"
                });
                return false;
            }
            _this.modalType = 'approve';
            _this.modalTrigger = !_this.modalTrigger;

        },
        //'驳回'按钮 绑定事件
        reject(){
            let _this = this;
            if(_this.docStatus === 1 || !this.psiForm.stockNo){
                _this.$Modal.info({
                    title: "提示信息",
                    content: "请先提交入库单!"
                });
                return false;
            }
            _this.modalType = 'reject';
            _this.modalTrigger = !_this.modalTrigger;

        },
        // 'ht-approval-reject' 组件内 审核或驳回 操作后 回调函数
        approvalOrRejectCallBack(res){
            let _this = this;
            if(res.result.code === '100100'){
                _this.psiForm.docStatus = Number(res.result.data);
            }
        },
        // 'ht-approval-reject' 组件内 没有配置审批流 自动审核时 回调函数
        autoSubmitOrReject(result){
            let _this = this;
            $.ajax({
                url:contextPath + '/purchasestock/submitapproval?submitType=1',
                method:'post',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify({
                    receiptsId:_this.psiForm.stockNo,
                    approvalResult:(_this.modalType === 'reject'? 1 : 0),
                }),
                success:function (res) {
                    if(res.code === '100100'){
                        _this.psiForm.docStatus = Number(res.data);
                    }else {
                        _this.$Modal.info({content:res.msg,title:"提示信息"});
                    }
                }
            });
        },
        // 弃用
        ajaxUpdateDocStatusById(id,docStatus){
            let _this = this;
            $.ajax({
                url:contextPath+ '/purchasestock/updateDocStatusById',
                method:'POST',
                dataType:'json',
                data:{id:id,docStatus:docStatus},
                success:function (data) {
                    if(data.code === '100100'){
                        _this.psiForm.docStatus = docStatus;
                    }
                }
            });
        },
        // 弃用
        ajaxGetWareHousePositions(){
            let _this = this;
            $.ajax({
                url:contextPath+ '/purchasestock/queryAllReposition',
                method:'POST',
                dataType:'json',
                data:{},
                success:function (data) {
                    _this.warehousePositions = [];
                    if(data.code === '100100'){
                        _this.warehousePositions = data.data.map((item)=>Object.assign({},{
                            value:item.id,label:item.code
                        }));
                    }
                }
            });
        },
        // 点击商品明细时的操作事件
        clickPurchaseDetail(name){
            let _this = this;
            let _selectedIdx = _this.selectedIndex;
            //校验明细页面的总件重
            let  isDivided = _this.goodList.every(item=>item.totalWeight);
            if(_this.currentTab === 'goodsDetail'){
                if(_this.purchaseStockDetails[_selectedIdx]){
                    _this.purchaseStockDetails[_selectedIdx].divisionStatus = isDivided ? '1':'0';
                    _this.purchaseStockDetails[_selectedIdx]['goodList'] = JSON.parse(JSON.stringify(_this.goodList));
                }
            }
            _this.currentTab = name;
            _this.$nextTick(()=>{
                _this.getSelect('table-responsive','goods');
            })
        },
        //打开商品明细页签
        openGoodsTab(item) {
            let _this = this;
            if (_this.selectedIndex === '') {
                return false;
            }
            if (_this.psiForm.businessType === '') {
                _this.$Modal.info({
                    title: "提示信息",
                    content: "请先填写单据类型!"
                });
                return false;
            }
            if (item.goodsMainType === 'attr_ranges_gold') {
                return false;
            }
            if (!item.goodsNo) {
                _this.$Modal.info({
                    title: "提示信息",
                    content: "请先填写商品编码!"
                });
                return false;
            }
            if (item.goodsMainType && item.goodsMainType !== 'attr_ranges_gold' && !item.actualRecNum) {
                _this.$Modal.info({
                    title: "提示信息",
                    content: "请先填写实收数量!"
                });
                return false;
            }
            if (!_this.showTemp) {
                _this.goodList = _this.purchaseStockDetails[_this.selectedIndex]['goodList']
            }
            _this.one = false;
            let newO = Object.assign({},{
                detailMark:item.detailMark,
                batchNum:item.batchNum,
                certificateFee:'',
                certificateNo:'',
                certificateType:'NGTC',
                //商品明细弹框石料进货价格
                totalStonePurchasePrice:0,
                //商品明细弹框石料销售价格
                totalStonePrice:0,
                commodityId:item.commodityId,
                countingUnitId:item.countingUnitId,
                countingUnitName:item.countingUnit,
                custId:_this.psiForm.custId || '',
                custStyleCode:item.custStyleCode,
                custStyleType:item.custStyleType,
                goldColor:'',
                goldPrice:'',
                goldPurchase:'',
                goldWeight:'',
                goodsBarcode:'',
                goodsName:item.goodsName,
                goodsNo:item.goodsNo,
                goodsNorm:item.goodsNorm,
                goodsType:'',
                goodsTypeId:'',
                groupPath:'',
                id:'',
                isDel:1,
                labCgeMode:'',
                mainStoneWeight:'',
                marketCost:'',
                nature:'',
                netGoldWeight:'',
                occupiedStatus:'',
                otherFee:'',
                otherFeeMode:'',
                otherFeeName:'',
                processingFee:'',
                purCertificateFee:'',
                purLabCgeMode:'',
                purOtherFee:'',
                purPriceCost:'',
                purchaseCost:'',
                purchaseGoldLose:'',
                purchaseGoldPrice:'',
                purchaseLaborCharge:'',
                remark:'',
                warehouseId:item.warehouseId,
                salePrice:'',
                saleRate:'',
                soldStatus:'',
                standardCertType:'',
                stockInNo:'',
                stockType:'',
                stoneClarity:'',
                stoneColor:'',
                stoneSection:'',
                supplierId:_this.psiForm.supplierId,
                totalWeight:'',
                viceStoneWeight:'',
                weight:'',
                weightUnitId:item.weightUnitId,
                weightUnitName:item.weightUnit,
                goodsMainType:item.goodsMainType,
                goldColors:this.goldColors.map(color=>Object.assign({},{
                    name:color.name,
                    value:color.value,
                })),
                certifiTypes:this.certifiTypes.map(cert=>Object.assign({},{
                    name:cert.name,
                    value:cert.value,
                })),

            });
            _this.$nextTick(()=>{
                if(_this.purchaseStockDetails[_this.selectedIndex]['goodList'].length === 0){
                    let _arr = [];
                    for (let i= 0;i < Number(item.actualRecNum);i++){
                        _arr.push($.extend(true,{},newO));
                    }
                    _this.goodList = _arr;
                }else {
                    //判断数量是否增加
                    let newArr = [];
                    let numLen = _this.purchaseStockDetails[_this.selectedIndex]['goodList'].length;
                    if(Number(item.actualRecNum) > numLen){
                        let num = Number(item.actualRecNum) - _this.goodList.length;
                        for (let i= 0;i < num;i++){
                            newArr.push($.extend(true,{},newO));
                        }
                        if( _this.psiForm.docStatus === 1){
                            _this.goodList = _this.purchaseStockDetails[_this.selectedIndex]['goodList'].concat(newArr);
                        }else {
                            _this.goodList = _this.purchaseStockDetails[_this.selectedIndex]['goodList'];
                        }

                    }else if(Number(item.actualRecNum)  ===  numLen){
                        _this.goodList = _this.purchaseStockDetails[_this.selectedIndex]['goodList']
                    }else{
                        _this.purchaseStockDetails[_this.selectedIndex]['delGoodList'] =
                            _this.purchaseStockDetails[_this.selectedIndex]['goodList']
                                .filter((p,index) => (index >= Number(item.actualRecNum)) && p.id);
                        _this.goodList = _this.purchaseStockDetails[_this.selectedIndex]['goodList']
                            .filter((p,index) => index < Number(item.actualRecNum));
                    }
                    _this.$forceUpdate();
                }
                _this.currentTab =  'goodsDetail';
                setTimeout(()=>{
                    _this.getSelect('table-responsive','goods-child');
                },3000);
            });

        },
        // 如果是成品的时候
        // 获取单位换算 数据 之后再进行 之前的一系列判断
        //废弃
        handleGoodsUnitConvertSetting(item){
            let _this = this;
            let weightUnitId = item.weightUnitId;
            let handleConvertUnit = (unitId) => {
                let dtd = $.Deferred();
                $.ajax({
                    url: contextPath + '/tbaseunit/findListByGroupIdAndUnitId',
                    method: 'POST',
                    dataType: 'json',
                    data: {unitId: unitId}
                }).then(
                    (res) => {
                        if (res.code === '100100') {
                            _this.unitConvertObj = res.data;
                            dtd.resolve(res);
                        } else {
                            dtd.reject('获取单位换算规则失败!');
                        }
                    },
                    () => {
                        dtd.reject('获取单位换算规则失败!');
                    }
                );
                return dtd.promise();
            };
            handleConvertUnit(weightUnitId).then(() => {
                    let newO = Object.assign({},{
                        batchNum:item.batchNum,
                        certificateFee:'',
                        certificateNo:'',
                        certificateType:'NGTC',
                        //商品明细弹框石料进货价格
                        totalStonePurchasePrice:0,
                        //商品明细弹框石料销售价格
                        totalStonePrice:0,
                        commodityId:item.commodityId,
                        countingUnitId:item.countingUnitId,
                        countingUnitName:item.countingUnit,
                        custId:_this.psiForm.custId || '',
                        custStyleCode:item.custStyleCode,
                        custStyleType:item.custStyleType,
                        goldColor:'',
                        goldPrice:'',
                        goldPurchase:'',
                        goldWeight:'',
                        goodsBarcode:'',
                        goodsName:item.goodsName,
                        goodsNo:item.goodsNo,
                        goodsNorm:item.goodsNorm,
                        goodsType:'',
                        goodsTypeId:'',
                        groupPath:'',
                        id:'',
                        isDel:1,
                        labCgeMode:'',
                        mainStoneWeight:'',
                        marketCost:'',
                        nature:'',
                        netGoldWeight:'',
                        occupiedStatus:'',
                        otherFee:'',
                        otherFeeMode:'',
                        otherFeeName:'',
                        processingFee:'',
                        purCertificateFee:'',
                        purLabCgeMode:'',
                        purOtherFee:'',
                        purPriceCost:'',
                        purchaseCost:'',
                        purchaseGoldLose:'',
                        purchaseGoldPrice:'',
                        purchaseLaborCharge:'',
                        remark:'',
                        warehouseId:item.warehouseId,
                        salePrice:'',
                        saleRate:'',
                        soldStatus:'',
                        standardCertType:'',
                        stockInNo:'',
                        stockType:'',
                        stoneClarity:'',
                        stoneColor:'',
                        stoneSection:'',
                        supplierId:_this.psiForm.supplierId,
                        totalWeight:'',
                        viceStoneWeight:'',
                        weight:'',
                        weightUnitId:item.weightUnitId,
                        weightUnitName:item.weightUnit,
                        goodsMainType:item.goodsMainType,
                        goldColors:this.goldColors.map(color=>Object.assign({},{
                            name:color.name,
                            value:color.value,
                        })),
                        certifiTypes:this.certifiTypes.map(cert=>Object.assign({},{
                            name:cert.name,
                            value:cert.value,
                        })),

                    });
                    _this.$nextTick(()=>{
                        if(_this.purchaseStockDetails[_this.selectedIndex]['goodList'].length === 0){
                            let _arr = [];
                            for (let i= 0;i < Number(item.actualRecNum);i++){
                                _arr.push($.extend(true,{},newO));
                            }
                            _this.goodList = _arr;
                        }else {
                            //判断数量是否增加
                            let newArr = [];
                            console.log(Number(item.actualRecNum));
                            let numLen = _this.purchaseStockDetails[_this.selectedIndex]['goodList'].length;
                            if(Number(item.actualRecNum) > numLen){
                                let num = Number(item.actualRecNum) - _this.goodList.length;
                                for (let i= 0;i < num;i++){
                                    newArr.push($.extend(true,{},newO));
                                }
                                if( _this.psiForm.docStatus === 1){
                                    _this.goodList = _this.purchaseStockDetails[_this.selectedIndex]['goodList'].concat(newArr);
                                }else {
                                    _this.goodList = _this.purchaseStockDetails[_this.selectedIndex]['goodList'];
                                }

                            }else if(Number(item.actualRecNum)  ===  numLen){
                                _this.goodList = _this.purchaseStockDetails[_this.selectedIndex]['goodList']
                            }else{
                                _this.purchaseStockDetails[_this.selectedIndex]['delGoodList'] =
                                    _this.purchaseStockDetails[_this.selectedIndex]['goodList']
                                        .filter((p,index) => (index >= Number(item.actualRecNum)) && p.id);
                                _this.goodList = _this.purchaseStockDetails[_this.selectedIndex]['goodList']
                                    .filter((p,index) => index < Number(item.actualRecNum));
                            }
                            _this.$forceUpdate();
                        }
                        _this.currentTab =  'goodsDetail';
                        setTimeout(()=>{
                            _this.getSelect('table-responsive','goods-child');
                        },3000);
                    });
                },
                (msg)=>{
                    _this.$Modal.warning({content:msg,title:"提示信息"});
                });
        },
        //删除明细信息
        delDetailRow(){
            let _this = this;
            //TODO 由源单生成的不能删除
            if(_this.purchaseStockDetails.length === 0){
                return false;
            }
            let idx = _this.selectedIndex;
            _this.$Modal.confirm({
                title: '提示',
                content: '确定删除选中的分录行吗?',
                onOk    : function () {
                    _this.purchaseStockDetails[idx]['isDel'] = 0;
                    let _delArr = _this.purchaseStockDetails.filter(i=>(i.isDel == 0 && i.id));
                    _this.delPurchaseStockDetails = _this.delPurchaseStockDetails.concat(_delArr);
                    _this.purchaseStockDetails.splice(idx,1);
                }
            });
            this.updateCodesUsed();
            _this.htTestChange()
        },
        //新增行
        addDetailRow(){
            let _this = this;
            if(!_this.psiForm.goodsTypePath){
                _this.$Modal.info({
                    content:'请先选择商品类型',
                    title:'提示信息'
                });
                return false;
            }
            let addRowData = Object.assign({},{
                sourceDocType:'',
                sourceDocNo:'',
                batchNum:'',
                pictureUrl:'',
                goodsNo:'',
                goodsName:'',
                divisionStatus:'0',
                goodsNorm:'',
                countingUnitId:'',
                certificateTypeId:'',
                receivableNum:'',
                actualRecNum:'',
                weightUnitId:'',
                receivableWeight:'',
                actualRecWeight:'',
                purchaseCost:'',
                marketCost:'',
                saleCost:'',
                totalSaleAmount:'',
                warehouseId:'',
                reservoirPositionId:'',
                remark:'',
                isDel:1,
                custId:'',
                supplierId:'',
                goodList:[],
                delGoodList:[],
                goldColors:getCodeList('base_Condition'),
                warehousePositions:_this.warehousePositions.map((item)=>$.extend(true,{},{
                    value:item.id,label:item.code
                })),
                options:_this.rawOptionData
            });
            _this.purchaseStockDetails.push($.extend(true,{},addRowData));
            _this.$nextTick(()=>{
                _this.getSelect('table-responsive','goods');
            })
            _this.htTestChange()
        },
        //复制行
        copyDetailRow(){
            let _this = this;
            if(_this.purchaseStockDetails.length === 0){
               return false;
            }
            if(!_this.psiForm.goodsTypePath){
                _this.$Modal.info({
                    content:'请先选择商品类型',
                    title:'提示信息'
                });
                return false;
            }
            let idx = _this.selectedIndex;
            _this.submitValid = true;
            let copyRowData = $.extend(true,{},_this.purchaseStockDetails[idx]);
            //这里是 为了 复制行的时候 把已有的条码明细 array 置空,避免 条码号 重复入库的情况
            copyRowData['goodList'] = [];
            _this.purchaseStockDetails.push(copyRowData);
            _this.$nextTick(()=>{
                _this.getSelect('table-responsive','goods');
            })
            _this.htTestChange()
        },
        selectProductDetail(index) {
            this.selectedIndex = index;
        },
        //部门 ztree 树 点击回调方法
        treeClickCallBack(event, treeId, treeNode){
            this.psiForm.recMaterialDepartmentName = treeNode.name;
            this.psiForm.recMaterialDepartmentId = treeNode.id;
            this.showDepartment = false;
        },
        //部门 ztree树 点击之前的回调方法
        treeBeforeClick(treeId, treeNode, clickFlag) {
            return !treeNode.isParent; //当单击父节点，返回false，不让选取
        },
        //点击 部门输入框时 显示部门ztree树方法
        showDepartmentTree(value){
            if(this.showDepartment){
                this.showDepartment = false;
                return;
            }
            //如果不是编辑状态就不展示 部门ztree树
            if(!this.canBeEdited){
                this.showDepartment = false;
                return;
            }
            this.showDepartment = value;
        },
        //单据类型 下拉框 change事件
        docTypeChange(val){
            let _this = this;
            //
            if(val && _this.purchaseStockDetails.length > 0 ){
                _this.purchaseStockDetails.forEach((item)=>{
                    item['isDel'] = 0;
                    if(item['goodList'] && item['goodList'].length > 0 ){
                        item['goodList'].forEach((i)=>{
                            i['isDel'] = 0;
                        });
                        item['delGoodList'] = item['goodList'].filter(i=>(i.isDel === 0 && i.id));
                    }
                });
                let _delArr = _this.purchaseStockDetails.filter(i=>(i.isDel === 0 && i.id));
                _this.delPurchaseStockDetails.concat(_delArr);
                _this.purchaseStockDetails = [];
                _this.goodList =[];
                _this.$forceUpdate();
            }
        },
        changeEmp(val) {
            let _this = this;
            this.htHaveChange = true;
            let _emps = _this.employees;
            let _r = _emps.find((item)=>item.id === val);
            _this.psiForm.stockKeeper = (_r === 'undefined') ? '' :_r.empName;
        },
        //商品类型 级联下拉框 change的时候 就给入库单 相关的部门字段赋值
        changeGoodsType(a,b){
            let _this = this;
            this.htHaveChange = true
            if(_this.psiForm.goodsTypeId
                && _this.psiForm.goodsTypeName
                && _this.psiForm.goodsTypePath){
                _this.$Modal.confirm({
                    content:'修改后原有的明细信息会清空,你确定要修改当前的商品类型吗？',
                    title:'提示',
                    onOk:function () {
                        _this.purchaseStockDetails = [];
                    }
                });
            }
            console.log(b,"woshi b")
            _this.psiForm.goodsTypeId = b[b.length - 1].value;
            _this.psiForm.goodsTypeName = b[b.length - 1].label;
            _this.psiForm.goodsTypePath = '0.'+a.join('.')+'.';
            _this.getRawOptionData(_this.psiForm.goodsTypePath);
        },

        validateProduct(){//校验是否存在商品明细
            let flag = true;
            let This = this;
            if(This.goodList.length > 0){
                $.each(This.goodList, function (i, item) {
                    console.log(item, i);
                    if(item.id){
                        return true;
                    }
                    if(item.goodsMainType === 'attr_ranges_goods'){
                        if(!item.tBaseBomEntity){
                            flag = false;
                            This.$Modal.info({
                                content: '第'+(i+1)+'行商品明细未选择，请先选择商品明细！',
                                title:"提示信息"
                            });
                            return false;
                        }
                    }else if(item.goodsMainType !== 'attr_ranges_gold'){
                        if(item.detailMark !==2 && !item.assistAttrs){
                            flag = false;
                            This.$Modal.info({
                                content: '第'+(i+1)+'行商品明细未选择，请先选择商品明细！',
                                title:"提示信息"
                            });
                            return false;
                        }
                    }
                });
            }
            return flag;

        },
        //供应商下拉框 change 事件
        supplierChange(val){
            let _this = this;
            let _suppliers=_this.suppliers;
            $.each(_suppliers,function (i,o) {
                if(o.value === val){
                    _this.psiForm.supplierCode = o.code;
                    _this.psiForm.supplierName = o.label;
                    return false;
                }
            });
        },
        //客户下拉框change 事件
        customerChange(val){
            let _this = this;
            this.htHaveChange = true;
            let _customers=_this.customers;
            $.each(_customers,function (i,o) {
                if(o.value === val){
                    _this.psiForm.custCode = o.code;
                    _this.psiForm.custName = o.label;
                    return false;
                }
            });
        },
        //加载供应商 下拉框数据
        loadSuppliers(){
            let _this=this;
            $.ajax({
                url:contextPath+ '/purchasestock/querySuppliers',
                method:'POST',
                dataType:'json',
                data:{},
                success:function (data) {
                    _this.suppliers = [];
                    if(data.code === '100100'&& data.data.length > 0 ){
                        _this.suppliers = data.data.map((item)=>{
                            return {label:item.siShortName,value:item.id,code:item.supplierCode,supplierName:item.supplierName};
                        });
                    }else{

                    }
                }
            });
        },
        //加载仓库下拉框数据
        loadWarehouses(){
            let _this = this;
            $.ajax({
                type: "post",
                url: contextPath+"/purchasestock/queryWarehouses",
                dataType: "json",
                success: function (r) {
                    _this.warehouses = [];
                    if (r.code === "100100" && r.data.length > 0) {
                        _this.warehouses = r.data.map((item)=>Object.assign({},{value:item.id,label:item.name}));
                    }
                },
                error: function (err) {
                },
            });
        },
        //当仓库下拉框 变动时 拉取对应的仓库的库位
        reloadWarehousePosition(id){
            let _this = this;
            let idx = _this.selectedIndex;
            $.ajax({
                type: "post",
                url: contextPath+"/purchasestock/queryWareHouseRepositionById",
                data:{id:id},
                dataType: "json",
                success: function (r) {
                    _this.purchaseStockDetails[idx].warehousePositions = [];
                    if (r.code === "100100" && r.data.length > 0) {
                        _this.purchaseStockDetails[idx].warehousePositions = r.data.map((item)=>$.extend(true,{},{value:item.id,label:item.name}));
                        _this.$forceUpdate();
                    }
                },
                error: function (err) {
                },
            });
        },
        //加载单位下拉框
        loadUnits(){
            let _this = this;
            $.ajax({
                type: "post",
                url: contextPath+"/tbaseunit/list",
                contentType: 'application/json',
                dataType: "json",
                success: function (r) {
                    if (r.code === "100100") {
                        _this.units = r.data;
                    }
                },
                error: function (err) {
                },
            });
        },
        //加载商品分类数据
        loadCategories(){
            let _this = this;
            $.ajax({
                type: "post",
                url: contextPath+'/purchasestock/queryCategories',
                data:{parentId:0},
                dataType: "json",
                success: function (data) {
                    if(data.code === '100100'){
                        _this.categoryType = _this.initGoodCategory(data.data.cateLists);
                    }
                },
                error: function () {

                }
            })
        },
        //加载客户下拉框信息
        loadCustomers(){
            let _this = this;
            $.ajax({
                type: "post",
                url: contextPath+'/purchasestock/queryCustomers',
                data:{},
                dataType: "json",
                success: function (data) {
                    _this.customers = [];
                    if(data.code === '100100'&& data.data.length > 0 ){
                        data.data.forEach((item)=>{
                            _this.customers.push(Object.assign({},{label:item.name,value:item.id,code:item.code}));
                        });
                    }else{

                    }
                },
                error: function () {

                }
            })
        },
        //递归 组装商品类型级联下拉框 数据
        initGoodCategory(type) {
            let _this = this;
            let result = [];
            type.forEach((item) => {
                let {
                    id: value,
                    name: label,
                    cateLists: children
                } = item;
                if (children) {
                    children = _this.initGoodCategory(children)
                }
                result.push({
                    value,
                    label,
                    children
                })
            });
            result.forEach((item) => {
                if (!item.children) {
                    delete item.children;
                }
            });
            return result

        },
        //入库日期datepicker change
        changeDate(val){
            this.htHaveChange = true;
            this.psiForm.stockTime=val.replace(/\//g, '-') + ' 00:00:00';
        },
        //仓库下拉框 change事件
        changeWarehouse(id){
            this.reloadWarehousePosition(id);
            this.htHaveChange = true;
        },
        // 保存时 前置判断方法
        save(val,name){
            let _this = this;
            // let isValid = $('form').valid();
            // let _this = this;
            // console.log( _this.$refs[name].validate," _this.$refs[name].validate")
            // let isCustomerRef = this.$refs.customerRef.submit();
            // let isSupplierPass = this.$refs.selectSupplier.submit();
            let isFormPass = '';
            // if(this.supplierDisabled){
            //     this.ruleValidate.supplierId[0].required = false
            // }else {
            //     this.ruleValidate.supplierId[0].required = true
            // }
            // let selectSupplier = this.$refs.selectSupplier.submit();
            _this.$refs[name] && _this.$refs[name].validate((valid) => {
                // if (valid) {
                //     isFormPass = true;
                // } else {
                //     isFormPass = false;
                // }
                isFormPass = valid;
            });
            if(val === 'submit' && (!isFormPass)){
                return;
            }
            // let obj = {
            //     "单据类型": this.psiForm.businessType,
            //     // "单据编号": this.psiForm.stockNo,
            //     "入库日期": this.psiForm.stockTime,
            //     "收料部门": this.psiForm.recMaterialDepartmentName,
            //     "供应商":   this.psiForm.supplierId,
            //     "商品类型": this.psiForm.goodsTypePath
            // };
            // if ($('form').valid() === false) {
            //     this.$Modal.warning({
            //         title: '提示信息',
            //         content: '<p>请填写必填项!</p >'
            //     });
            //     return;
            // } else {
            //     if (!this.checkForm(obj, true));
            // }
            // if(_this.currentTab === 'goodsDetail'){
            //    _this.clickPurchaseDetail('purchaseDetail');
            // }
            if(val === 'submit' && (_this.validatePurchaseStockDetail() || _this.tableValidate() || !isFormPass)){
                return false;
            }
            if(val === 'submit' && _this.purchaseStockDetails.length === 0){
                _this.$Modal.info({
                    content: '请先填写商品分录行信息!',
                    title:'提示信息'
                });
                return false;
            }
            if(_this.psiForm.stockNo && _this.psiForm.docStatus === 2 && val === 'submit'){
                _this.$Modal.warning({
                    content: '单据已提交!',
                    title:'提示信息'
                });
                return false;
            }
            if(val === 'tmp_save'){
                _this.psiForm.docStatus = 1;
            }else{
                _this.psiForm.docStatus = 2;
            }

            _this.ajaxSave(val);
        },
        // 校验表单必填项
        checkForm(obj, flag) {
            for (var key in obj) {
                if (!obj[key]) {
                    if (flag) {
                        this.$Modal.warning({
                            title: "提示",
                            okText: "确定",
                            content: key + "不能为空"
                        });
                    }
                    return false;
                }
            }
            return true;
        },
        ajaxSave(type) {
            let _this = this;
            let params = Object.assign({},{
                purchaseStock:_this.psiForm,
                purchaseStockDetails:_this.purchaseStockDetails.length > 0 ?_this.formatData2Sumbit():[],
                delPurchaseStockDetails:_this.delPurchaseStockDetails,
            });
            window.top.home.loading('show',{text:'保存中，请稍后!'});
            $.ajax({
                url:contextPath+`/purchasestock/saveStockIn`,
                method:'post',
                dataType:'json',
                async: false,
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify(params),
                success:function (res) {
                    _this.htHaveChange = false;
                    if(res.code === '100100'){
                        _this.initSupplier(_this.psiForm.supplierId);
                        _this.psiForm = $.extend(true,{},res.data.purchaseStock);
                        if(res.data.purchaseStockDetails && res.data.purchaseStockDetails.length>0){
                            _this.purchaseStockDetails = res.data.purchaseStockDetails.map((item)=>{
                                let other = {
                                    goldColors:getCodeList('base_Condition'),
                                    certifiTypes:getCodeList('base_certificate_type'),
                                };
                                return $.extend({},other,{
                                    id:item.id,
                                    purStockInNo:item.purStockInNo,
                                    commodityId:item.commodityId,
                                    sourceDocType:item.sourceDocType || '',
                                    sourceDocNo:item.sourceDocNo || '',
                                    batchNum:item.batchNum|| '',
                                    pictureUrl:item.pictureUrl ||'',
                                    goodsNo:item.goodsNo ||'',
                                    goodsName:item.goodsName||'',
                                    divisionStatus:item.divisionStatus.toString()||'0',
                                    goodsNorm:item.goodsNorm ||'',
                                    countingUnitId:item.countingUnitId ||'',
                                    certificateTypeId:item.certificateTypeId||'',
                                    receivableNum:item.receivableNum ||0,
                                    actualRecNum:item.actualRecNum ||0,
                                    weightUnitId:item.weightUnitId ||0,
                                    receivableWeight:item.receivableWeight ||0,
                                    actualRecWeight:item.actualRecWeight||0,
                                    purchaseCost:item.purchaseCost ||0,
                                    marketCost:item.marketCost||0,
                                    saleCost:item.saleCost||0,
                                    goodsMainType:item.goodsMainType,
                                    totalSaleAmount:item.totalSaleAmount||0,
                                    warehouseId:item.warehouseId,
                                    reservoirPositionId:item.reservoirPositionId,
                                    remark:item.remark||'',
                                    isDel:item.isDel,
                                    custId:item.custId,
                                    goldColor:item.goldColor,
                                    supplierId:item.supplierId,
                                    styleName:item.styleName,
                                    styleCategoryId:item.styleCategoryId,
                                    styleCustomCode:item.styleCustomCode,
                                    detailMark:item.detailMark,
                                    goodList:(function (goods) {
                                        if(!goods){
                                            return [];
                                        }
                                        return goods.map(item=>{
                                            let other = {
                                                goldColors:getCodeList('base_Condition'),
                                                certifiTypes:getCodeList('base_certificate_type'),
                                            };
                                            return $.extend({},other,item);
                                        });
                                    })(item.goodList),
                                });
                            });
                        }else {
                            _this.purchaseStockDetails = [];
                        }
                        _this.selectedIndex = '';
                        _this.$Modal.success({
                            content: (type === 'tmp_save')?'保存'+'成功!':'提交'+'成功!',
                            title:'提示信息'
                        });
                        window.top.home.loading('hide');
                        _this.saveAccess(res.data.purchaseStock.stockNo,_this.documentType);

                    }else if(res.code === '100811'){
                        _this.$Modal.info({
                            content:"<div style='height: 300px;overflow-y: scroll'>"+res.msg.replace(/;/g,"<br/>")+"</div>",
                            title:'提示信息',
                            scrollable:true,
                            height:"520px",
                        });
                        window.top.home.loading('hide');
                    } else {
                        _this.$Modal.info({
                            content: res.msg,
                            title:'提示信息'
                        });
                        window.top.home.loading('hide');
                    }
                },
                error(e){
                    window.top.home.loading('hide');
                }
            });
        },
        getSelectedItem(data, index) {//获取选中的那条数据
            let _this = this;
            let res = data.data;
            let initRowData = Object.assign({},{
                sourceDocType:'',
                sourceDocNo:'',
                batchNum:'',
                pictureUrl:'',
                goodsNo:'',
                goodsName:'',
                divisionStatus:'0',
                goodsNorm:'',
                countingUnitId:'',
                certificateTypeId:'',
                receivableNum:'',
                actualRecNum:'',
                weightUnitId:'',
                receivableWeight:'',
                actualRecWeight:'',
                purchaseCost:'',
                marketCost:'',
                saleCost:'',
                totalSaleAmount:'',
                warehouseId:'',
                reservoirPositionId:'',
                remark:'',
                isDel:1,
                custId:'',
                supplierId:'',
                goodList:[],
                delGoodList:[],
                goldColors:getCodeList('base_Condition'),
                warehousePositions:_this.warehousePositions.map((item)=>$.extend(true,{},{
                    value:item.id,label:item.code
                })),
                options:_this.rawOptionData
            });
            //如果原来的分录行已经有数据，就把原来的分录行 放进删除的数组内 到后台进行删除
            if(_this.purchaseStockDetails[index] && _this.purchaseStockDetails[index].id){
                _this.delPurchaseStockDetails.push(_this.purchaseStockDetails[index]);
            }
            _this.$set(_this.purchaseStockDetails,index,Object.assign(initRowData,{
                goodsNo: res.code,
                goodsName: res.name,
                commodityId: res.id,
                pictureUrl: res.frontPic && res.frontPic.fdUrl,
                goodsTypeName: res.categoryName,
                goodsNorm: res.specification,
                custStyleCode:res.styleCustomCode,
                custStyleType:res.styleName,
                countingUnitId:res.countUnitId,
                countingUnit:res.countUnitId ? _this.units[_this.units.map(e=>e.id).indexOf(res.countUnitId)].name : '',
                weightUnitId:res.weightUnitId,
                weightUnit:res.weightUnitId ?_this.units[_this.units.map(e=>e.id).indexOf(res.weightUnitId)].name: '',
                goodsMainType:res.mainType,
                goldColor:(res.mainType === 'attr_ranges_gold')? res.certificateType:'',
                warehouseId:res.warehouseInfoId || '',
                styleCategoryId:res.styleCategoryId,
                styleCustomCode:res.styleCustomCode,
                styleName:res.styleName,
                detailMark:res.detailMark || 1,
                goodList:[],
                delGoodList:[]
            }));
        },
        getInputValue(value, index) {//获取商品编码输入框输入的值
            let _this = this;
            let params = {
                categoryCustomCode:  _this.psiForm.goodsTypePath,
                field: value, //value, A11  AABc009
                limit: ''
            };
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecommodity/findByType',
                data: params,
                dataType: "json",
                success: function (data) {
                    if(data.code === '100100'){
                        let selectedRow =_this.purchaseStockDetails[index];
                        _this.$set(_this.purchaseStockDetails,index, Object.assign(selectedRow, {options: data.data}));
                    }
                },
                error: function () {
                }
            })
        },
        //导出 excel模板 方法
        exportExcel(){
            location.href=contextPath+"/purchasestock/exportExcelModel?modelName="+"采购入库单条码明细导入模板.xls";
        },
        //导入excel前置判断
        importGoodsDetail(){
            let _this = this;
            if(!_this.importExcelType){
                _this.$Modal.info({
                    content:'请选择导入类型!',
                    title:'提示信息'
                });
                return false;
            }
            let _arr = [];
            _this.purchaseStockDetails.map((item,idx)=>{
                if(idx === 0){
                    _arr.push(Object.assign({},{
                        lineNo:idx+1,
                        goodsNo:item.goodsNo,
                        goldColors:_this.goldColors,
                        actualRecNum:item.actualRecNum,
                        commodityId:item.commodityId,
                    }));
                }else {
                    _arr.push(Object.assign({},{
                        lineNo:idx+1,
                        goodsNo:item.goodsNo,
                        actualRecNum:item.actualRecNum,
                        commodityId:item.commodityId,
                    }));
                }
            });
            _this.excelParam = Object.assign({},{excelParam:JSON.stringify(_arr)});
            _this.$refs.upload.$refs.input.click();
        },
        //上传导入excel前置判断
        handleBeforeUpload(file) {
        },
        //excel导入数据
        loadExcelData(data) {
            let _this = this;
            if (data.length === 0) {
                return false;
            }
            //覆盖导入
            if(_this.importExcelType === '1'){
                //先把原来的goodList 里面的信息放到
                //要删除的 delGoodList
                _this.purchaseStockDetails.forEach((item,idx)=>{
                    item.goodList.forEach((i)=>{
                        i['isDel'] = 0;
                    });
                    let _arr = [];
                    var excelDataArr = data.filter((item,y)=>(item['lineNo'] === (idx+1).toString()));
                    for (let i= 0;i < Number(item.actualRecNum);i++){
                        var excelData = excelDataArr[i];
                        _arr.push($.extend(true,{},{
                            'goodsName':item.goodsName,
                            'goodsNo':item.goodsNo,
                            'goodsType':_this.psiForm.goodsTypeName,
                            'goodsTypeId':_this.psiForm.goodsTypeId,
                            'groupPath':_this.psiForm.goodsTypePath,
                            'id':'',
                            'isDel':1,
                            'labCgeMode':'',
                            'commodityId':item.commodityId,
                            'countingUnitId':item.countingUnitId,
                            'countingUnitName':item.countingUnit,
                            'custId':_this.psiForm.custId || '',
                            'custStyleCode':item.custStyleCode,
                            'custStyleType':item.custStyleType,
                            'goodsBarcode':'',
                            'certificateType':'NGTC',
                            'batchNum':item.batchNum,
                            'nature':'',
                            'occupiedStatus':'',
                            'otherFeeMode':'',
                            'purLabCgeMode':'',
                            'reservoirPositionId':item.reservoirPositionId,
                            'soldStatus':'',
                            'standardCertType':'',
                            'stockInNo':'',
                            'stockType':'',
                            'stoneClarity':'',
                            'stoneColor':'',
                            'stoneSection':'',
                            'supplierId':_this.psiForm.supplierId,
                            'viceStoneWeight':'',
                            'warehouseId':item.warehouseId,
                            'weight':'',
                            'weightUnitId':item.weightUnitId,
                            'weightUnitName':item.weightUnit,
                            'goodsMainType':item.goodsMainType,
                            'goldColor':excelData['goldColor'] ? excelData['goldColor'] :'',
                            'goldColors':getCodeList('base_Condition'),
                            'certifiTypes':getCodeList('base_certificate_type'),
                            'goldPrice':excelData['goldPrice'] ? Number(excelData['goldPrice']): 0 ,
                            'netGoldWeight':excelData['netGoldWeight'] ? Number(excelData['netGoldWeight']): 0 ,
                            'purchaseGoldLose':excelData['purchaseGoldLose'] ? Number(excelData['purchaseGoldLose']): 0 ,
                            'purchaseCost':excelData['purchaseCost'] ? Number(excelData['purchaseCost']): 0 ,
                            'otherFee':excelData['otherFee'] ? Number(excelData['otherFee']): 0 ,
                            'purchaseGoldPrice':excelData['purchaseGoldPrice'] ? Number(excelData['purchaseGoldPrice']): 0 ,
                            'certificateFee':excelData['certificateFee'] ? Number(excelData['certificateFee']).toFixed(2): 0 ,
                            'purPriceCost':excelData['certificateFee'] ? Number(excelData['purPriceCost']): 0 ,
                            'processingFee':excelData['processingFee'] ? Number(excelData['processingFee']): 0 ,
                            'goldPurchase':excelData['goldPurchase'] ? Number(excelData['goldPurchase']): 0 ,
                            'saleRate':excelData['saleRate'] ? Number(excelData['saleRate']): 0 ,
                            'purOtherFee':excelData['purOtherFee'] ? Number(excelData['purOtherFee']): 0 ,
                            'marketCost':excelData['marketCost'] ? Number(excelData['marketCost']): 0 ,
                            'purCertificateFee':excelData['purCertificateFee'] ? Number(excelData['purCertificateFee']): 0 ,
                            'salePrice':excelData['salePrice'] ? Number(excelData['salePrice']).toFixed(2): 0 ,
                            'purchaseLaborCharge':excelData['purchaseLaborCharge'] ? Number(excelData['purchaseLaborCharge']): 0 ,
                            'totalWeight':excelData['totalWeight'] ? Number(excelData['totalWeight']): 0 ,
                            'mainStoneWeight':excelData['mainStoneWeight'] ? Number(excelData['mainStoneWeight']): 0 ,
                            'certificateNo':excelData['certificateNo'] ? excelData['certificateNo']: '',
                            'otherFeeName':excelData['otherFeeName'] ? excelData['otherFeeName']: '',
                            'goodsNorm':excelData['goodsNorm'] ? excelData['goodsNorm']: '',
                            'remark':excelData['remark'] ? excelData['remark']: '',
                            'isImport':true,
                            'importData':Object.assign({},{
                                tBaseBomEntity: excelData['tBaseBomEntity']||{},
                                goldParts: excelData['goldParts']||[],
                                stonesParts: excelData['stoneParts']||[],
                                partParts: excelData['partParts']||[]
                            }),
                        }));
                    }
                    item.delGoodList = item.goodList;
                    item.goodList = _arr;
                });
                _this.goodList = _this.purchaseStockDetails[_this.selectedIndex]['goodList'];
                _this.$forceUpdate();
            }
            //追加导入
            if(_this.importExcelType === '2'){
                //追加导入时 往各分录行商品信息列表 追加导入的信息即可
                _this.purchaseStockDetails.forEach((item,idx)=>{
                    let _arr = [];
                    var excelDataArr = data.filter((item,y)=>(item['lineNo'] === (idx+1).toString()));
                    for (let i= 0;i < Number(item.actualRecNum);i++){
                        var excelData = excelDataArr[i];
                        _arr.push($.extend(true,{},{
                            'goodsName':item.goodsName,
                            'goodsNo':item.goodsNo,
                            'goodsType':_this.psiForm.goodsTypeName,
                            'goodsTypeId':_this.psiForm.goodsTypeId,
                            'groupPath':_this.psiForm.goodsTypePath,
                            'id': item.id ||'',
                            'isDel':1,
                            'labCgeMode':'',
                            'commodityId':item.commodityId,
                            'countingUnitId':item.countingUnitId,
                            'countingUnitName':item.countingUnit,
                            'custId':_this.psiForm.custId || '',
                            'custStyleCode':item.custStyleCode,
                            'custStyleType':item.custStyleType,
                            'goodsBarcode':'',
                            'certificateType':'NGTC',
                            'batchNum':item.batchNum,
                            'nature':'',
                            'occupiedStatus':'',
                            'otherFeeMode':'',
                            'purLabCgeMode':'',
                            'reservoirPositionId':'',
                            'soldStatus':'',
                            'standardCertType':'',
                            'stockInNo':'',
                            'stockType':'',
                            'stoneClarity':'',
                            'stoneColor':'',
                            'stoneSection':'',
                            'supplierId':_this.psiForm.supplierId,
                            'viceStoneWeight':'',
                            'warehouseId':item.warehouseId,
                            'weight':'',
                            'weightUnitId':item.weightUnitId,
                            'weightUnitName':item.weightUnit,
                            'goodsMainType':item.goodsMainType,
                            'goldColor':excelData['goldColor'] ? excelData['goldColor'] :'',
                            'goldColors':getCodeList('base_Condition'),
                            'certifiTypes':getCodeList('base_certificate_type'),
                            'goldPrice':item.goldPrice ? item.goldPrice :(excelData['goldPrice'] ? Number(excelData['goldPrice']): 0 ),
                            'netGoldWeight':item.netGoldWeight ? item.netGoldWeight:(excelData['netGoldWeight'] ? Number(excelData['netGoldWeight']): 0 ),
                            'purchaseGoldLose':item.purchaseGoldLose ? item.purchaseGoldLose :(excelData['purchaseGoldLose'] ? Number(excelData['purchaseGoldLose']): 0) ,
                            'purchaseCost':item.purchaseCost ? item.purchaseCost:(excelData['purchaseCost'] ? Number(excelData['purchaseCost']): 0 ),
                            'otherFee':item.otherFee ? item.otherFee :(excelData['otherFee'] ? Number(excelData['otherFee']): 0) ,
                            'purchaseGoldPrice':item.purchaseGoldPrice ? item.purchaseGoldPrice:(excelData['purchaseGoldPrice'] ? Number(excelData['purchaseGoldPrice']): 0 ),
                            'certificateFee': item.certificateFee ? item.certificateFee : (excelData['certificateFee'] ? Number(excelData['certificateFee']).toFixed(2): 0 ),
                            'purPriceCost':item.purPriceCost ? item.purPriceCost :(excelData['certificateFee'] ? Number(excelData['purPriceCost']): 0 ),
                            'processingFee':item.processingFee ? item.processingFee :(excelData['processingFee'] ? Number(excelData['processingFee']): 0 ),
                            'goldPurchase':item.goldPurchase ? item.goldPurchase:(excelData['goldPurchase'] ? Number(excelData['goldPurchase']): 0 ),
                            'saleRate':item.saleRate ? item.saleRate : (excelData['saleRate'] ? Number(excelData['saleRate']): 0 ),
                            'purOtherFee':item.purOtherFee ? item.purOtherFee : (excelData['purOtherFee'] ? Number(excelData['purOtherFee']): 0 ),
                            'marketCost':item.marketCost ? item.marketCost : (excelData['marketCost'] ? Number(excelData['marketCost']): 0 ),
                            'purCertificateFee':item.purCertificateFee ? item.purCertificateFee : (excelData['purCertificateFee'] ? Number(excelData['purCertificateFee']): 0 ),
                            'salePrice':item.salePrice ? item.salePrice : (excelData['salePrice'] ? Number(excelData['salePrice']).toFixed(2): 0 ),
                            'purchaseLaborCharge':item.purchaseLaborCharge ? item.purchaseLaborCharge : (excelData['purchaseLaborCharge'] ? Number(excelData['purchaseLaborCharge']): 0 ),
                            'totalWeight':item.totalWeight ? item.totalWeight :(excelData['totalWeight'] ? Number(excelData['totalWeight']): 0 ),
                            'mainStoneWeight':item.mainStoneWeight ? item.mainStoneWeight : (excelData['mainStoneWeight'] ? Number(excelData['mainStoneWeight']): 0 ),
                            'certificateNo':item.certificateNo ? item.certificateNo :  (excelData['certificateNo'] ? excelData['certificateNo']: ''),
                            'otherFeeName': item.otherFeeName ? item.otherFeeName :(excelData['otherFeeName'] ? excelData['otherFeeName']: ''),
                            'goodsNorm': item.goodsNorm ? item.goodsNorm : (excelData['goodsNorm'] ? excelData['goodsNorm']: ''),
                            'remark':item.remark ? item.remark : (excelData['remark'] ? excelData['remark']: ''),
                            'isImport':true,
                            'importData':Object.assign({},{
                                tBaseBomEntity: excelData['tBaseBomEntity']||{},
                                goldParts: excelData['goldParts']||[],
                                stonesParts: excelData['stoneParts']||[],
                                partParts: excelData['partParts']||[]
                            }),
                        }));
                    }
                    // item.goodList = item.goodList.concat(_arr);
                    item.goodList = _arr;
                });
                _this.goodList = _this.purchaseStockDetails[_this.selectedIndex]['goodList'];
                _this.$forceUpdate();
            }

            window.top.home.loading('hide');
        },
        //上传中方法
        handleProcessing(){
            window.top.home.loading('show',{text:'处理数据中，请稍等!'});
        },
        //上传excel成功时 数据处理
        handleSuccess(res, file) {
            let _this = this;
            if (res.code === '100100') {
                try{
                    _this.loadExcelData(res.data);
                }catch (e){
                    window.top.home.loading('hide');
                }
            } else {
                window.top.home.loading('hide');
                _this.$Modal.info({
                    content:"<div style='height: 300px;overflow-y: scroll'>"+res.msg.replace(/;/g,"<br/>")+"</div>",
                    title:'提示信息',
                    scrollable:true,
                    height:"520px",
                });
            }
        },
        //获取商品明细选中行
        getGoodsItem(params,index){
            let This = this;
            var data = {'id':params.id};
            $.ajax({
                type: "post",
                url: contextPath + '/goodsController/queryGoodsDetail',
                data: JSON.stringify(data),
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        Object.assign(data.data[0],{goodsId:data.data[0].id,id:''});
                        let obj = $.extend(true, {}, data.data[0], {options:This.goodList[index].options});
                        This.goodList.splice(index,1,obj);
                        This.updateCodesUsed();
                    }
                },
                error: function () {
                    This.$Modal.warning({content:"服务器出错啦",title:"提示信息"})
                }
            })
        },
        //获取商品条形码
        getGoodsBarcodeValue(value,index){
            let This = this;
            let params = {
                goodsBarcode: value,
                commodityId:This.goodList[index].commodityId,
                //是否在库 0、否 1、是
                isInStock:0,
                //0、客户料；1、公司料
                nature:0,
                stockInNo:'',
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
                        let selectedGoods = This.goodList[index];
                        selectedGoods['options'] = data.data.map(code=>$.extend(true, {},{code:code.goodsBarcode,name:code.goodsName,id:code.id}));
                        This.$set(This.goodList,index,selectedGoods);
                        This.updateCodesUsed(value,index);
                    }
                },
                error: function () {
                    // layer.alert('服务器出错啦');
                    This.$Modal.warning({content:"服务器出错啦！",title:"提示信息"})
                }
            })
        },
        //当 上传的文件不符合excel格式的时候 执行的方法
        handleFormatError(file) {
            let _this = this;
            _this.$Modal.info({
                content:'请选择excel格式的文件!',
                title:'提示信息'
            });
        },
        handleMaxSize(file) {
            this.$Notice.info({
                title: '文件大小超出限制!',
                desc: '【'+file.name + '】的大小超过2M'
            });
        },
        isEdit(isEdit, on) {
            eventHub.$emit('isEdit', isEdit);
        },
        // 保存附件 保存的时候调用
        saveAccess(id,type, on) {
            eventHub.$emit('saveFile', id,type);
        },
        // 查找附件 查看的时候调用
        getAccess(id,type, on) {
            eventHub.$emit('queryFile', id,type);
        },
        //计算列合计
        sum(list, key) {
            return list.reduce((sum, el) => {
                if (el[key] === '' || el[key] === null || el[key] === undefined) {
                    return math.add(0,sum);
                }
                return math.add(parseFloat(el[key]),sum);
            }, 0)
        },
        selectGoodsDetail(idx){
            this.detailSelectedIdx = idx;
        },
        getInputNumber(index){
            //获取进货金价的值
            var purchaseGoldPrice = Number(document.getElementById("purchaseGoldPrice"+index).value);
            //获取销售金价
            var goldPrice = Number(document.getElementById("goldPrice"+index).value);
            //获取进货工费得值
            var purchaseLaborCharge = Number(document.getElementById("purchaseLaborCharge"+index).value);
            //获取销售工费得值
            var processingFee = Number(document.getElementById("processingFee"+index).value);
            //获取进货其他费的值
            var purOtherFee = Number(document.getElementById("purOtherFee"+index).value);
            //获取销售其他费的值
            var otherFee = Number(document.getElementById("otherFee"+index).value);
            //获取进货证书费的值
            var purCertificateFee = Number(document.getElementById("purCertificateFee"+index).value);
            //获取销售证书费的值
            var certificateFee = Number(document.getElementById("certificateFee"+index).value);
            //获取销售金耗
            var goldPurchase = Number(document.getElementById("goldPurchase"+index).value);
            var calculatePurchaseGoldPrice  = 0;
            var calculateGoldPrice  = 0;
            if(!this.goodList[this.detailSelectedIdx].netGoldWeight || !this.goodList[this.detailSelectedIdx].purchaseGoldPrice){
                calculatePurchaseGoldPrice = 0;
            }else{
                var lio = Number(this.goodList[this.detailSelectedIdx].netGoldWeight * (1 + (this.goodList[this.detailSelectedIdx].purchaseGoldLose)/100)) * Number(this.goodList[this.detailSelectedIdx].purchaseGoldPrice);
                console.log(lio,"")
                calculatePurchaseGoldPrice = Number(lio.toFixed(2));
                console.log(lio,"")
            }

            if(!this.goodList[this.detailSelectedIdx].netGoldWeight  || !goldPrice){
                calculateGoldPrice = 0;
            }else {
                var a = Number(this.goodList[this.detailSelectedIdx].netGoldWeight * (1 + (goldPurchase/100))) * goldPrice;
                calculateGoldPrice =  Number(a.toFixed(2));
            }
            if(!purchaseLaborCharge){
                purchaseLaborCharge = 0;
            }
            if(!certificateFee){
                certificateFee = 0
            }
            if(!otherFee){
                otherFee = 0
            }
            if(!processingFee){
                processingFee = 0
            }
            if(!purCertificateFee){
                purCertificateFee = 0;
            }
            if(!purOtherFee){
                purOtherFee = 0;
            }
            index = this.detailSelectedIdx
            if(index === this.detailSelectedIdx) {
                console.log(this.detailSelectedIdx, index, "两个index！！！")
                this.goodList[this.detailSelectedIdx].purchaseCost = Number(this.goodList[this.detailSelectedIdx].totalStonePurchasePrice + calculatePurchaseGoldPrice + purCertificateFee + purOtherFee + purchaseLaborCharge).toFixed(2);
                this.goodList[this.detailSelectedIdx].purPriceCost = Number(this.goodList[this.detailSelectedIdx].totalStonePrice + calculateGoldPrice + certificateFee + otherFee + processingFee).toFixed(2);
                this.goodList[this.detailSelectedIdx].marketCost = Number(this.goodList[this.detailSelectedIdx].totalStonePrice + calculateGoldPrice + certificateFee + otherFee + processingFee).toFixed(2);
            }
        },
        productDetailModalClick(e){//商品详情点击确定跟取消的回调
            //this.purchase.goodList 分录行数组，
            //this.selectedIndex 选中行索引；
            //写法固定
            if (this.goodList[this.detailSelectedIdx].goodsMainType === 'attr_ranges_goods') {
                Object.assign(this.goodList[this.detailSelectedIdx], {
                    tBaseBomEntity: e,
                    assistAttrs: null,
                    overEdit: true
                });
                this.goodList.forEach((item,i)=>{
                    //主石进货价格
                    var  mainStonePurchasePrice = 0,
                        // 副石进货价格
                        accessoryStonePurchasePrice = 0,
                        //主石销售金价
                        mainStonePrice = 0,
                        //    副石销售价格
                        accessoryStonePrice = 0;
                    if(item.tBaseBomEntity){
                        item.tBaseBomEntity.goldBoms.forEach((val)=>{
                            if(val.checked){
                                if(!val.weight){
                                    this.goodList[this.detailSelectedIdx].netGoldWeight = 0;
                                }else {
                                    this.goodList[this.detailSelectedIdx].netGoldWeight = Number(val.weight);
                                }
                                this.goodList[this.detailSelectedIdx].purchaseGoldLose = Number(val.lose);
                            }
                        })
                        item.tBaseBomEntity.stonesBoms.forEach((value,array)=>{

                            // 1----主石     0-----副石
                            if(value.partName === "1"){
                                // 获取主石重量
                                if(!value.weight){
                                    this.goodList[this.detailSelectedIdx].mainStoneWeight = 0;
                                }else {
                                    this.goodList[this.detailSelectedIdx].mainStoneWeight = value.weight;
                                }
                                //主石的销售价格
                                if(!value.weight || !value.inPrice){
                                    mainStonePurchasePrice = 0;
                                }else {
                                    mainStonePurchasePrice = Number(value.weight * value.inPrice);
                                }
                                //主石的销售价格
                                if(!value.weight || !value.price){
                                    mainStonePrice = 0;
                                }else {
                                    mainStonePrice = Number(value.weight * value.price);
                                }
                            }else{
                                // console.log(array,"我是数组！！")
                                //副石的进货价格
                                if(!value.weight || !value.inPrice){
                                    accessoryStonePurchasePrice = 0;
                                }else{
                                    accessoryStonePurchasePrice += Number(value.weight * value.inPrice);
                                }
                                //副石的销售价格
                                if(!value.weight || !value.price){
                                    accessoryStonePrice = 0;
                                }else {
                                    accessoryStonePrice += Number(value.weight * value.price);
                                    // console.log(accessoryStonePrice,"accessoryStonePrice")
                                }
                            }
                        })
                    }
                    if(this.detailSelectedIdx === i){
                        // 计算主石加副石进货、销售价格
                        this.$nextTick(()=>{
                            this.goodList[this.detailSelectedIdx].totalStonePurchasePrice = Number(mainStonePurchasePrice + accessoryStonePurchasePrice);
                            // console.log(this.detailSelectedIdx,"我是选中的石价合计！")
                            this.goodList[this.detailSelectedIdx].totalStonePrice = Number(mainStonePrice + accessoryStonePrice);
                            return this.getInputNumber(this.selectedIndex);
                        })
                    }
                });
            } else {
                Object.assign(this.goodList[this.detailSelectedIdx],{
                    assistAttrs: e,
                    tBaseBomEntity: null,
                    overEdit: true
                })
            }
        },
        //商品明细弹窗
        modalSure(e) {
            this.productDetailModalClick(e);
            this.productDetailModal.showModal = false;
        },
        modalCancel(e) {
            this.productDetailModal.showModal = false;
        },
        goldDetailModalClick(e){//商品详情点击确定跟取消的回调
            //this.purchase.goodList 分录行数组，
            //this.selectedIndex 选中行索引；
            //写法固定
            if (this.purchaseStockDetails[this.selectedIndex].goodsMainType === 'attr_ranges_goods') {
                Object.assign(this.purchaseStockDetails[this.selectedIndex], {
                    tBaseBomEntity: e,
                    assistAttrs: null,
                    overEdit: true
                });
            } else {
                Object.assign(this.purchaseStockDetails[this.selectedIndex],{
                    assistAttrs: e,
                    tBaseBomEntity: null,
                    overEdit: true
                })
            }
        },
        //商品明细弹窗
        goldModalSure(e) {
            this.goldDetailModalClick(e);
            this.goldDetailModal.showModal = false;
        },
        goldModalCancel(e) {
            this.goldDetailModal.showModal = false;
        },
        formatData2Sumbit(){
            let _this = this;
            let obj = {//商品分录行,根据自己的业务增减字段
                //下面四个数组固定
                stonesParts: [],
                materialParts: [],
                partParts: [],
                goldParts: []
            };
            //可以固定，开始，
            let data =[];
            for(let i=0;i<_this.purchaseStockDetails.length;i++){
                _this.purchaseStockDetails[i]['lineNo'] = i+1;
                data[i] = JSON.parse(JSON.stringify(_this.purchaseStockDetails[i]));
                data[i].goodList = [JSON.parse(JSON.stringify(obj))];
                //商品明细数据处理
                handlerProductDetail(_this.purchaseStockDetails[i].goodList, data[i], obj);
                _this.purchaseStockDetails[i].goodList.map((item, index)=>{
                    //商品分录行赋值
                    if(!data[i].goodList[index]){
                        data[i].goodList[index] = {};
                    }
                    Object.assign(data[i].goodList[index], {
                        batchNum:item.batchNum,
                        certificateFee:item.certificateFee,
                        certificateNo:item.certificateNo,
                        certificateType:item.certificateType,
                        commodityId:item.commodityId,
                        countingUnitId:item.countingUnitId,
                        countingUnitName:item.countingUnitName,
                        custId:item.custId,
                        custStyleCode:item.custStyleCode,
                        custStyleType:item.custStyleType,
                        goldColor:item.goldColor,
                        goldPrice:item.goldPrice,
                        goldPurchase:item.goldPurchase,
                        goldWeight:item.goldWeight,
                        goodsBarcode:item.goodsBarcode,
                        goodsName:item.goodsName,
                        goodsNo:item.goodsNo,
                        goodsNorm:item.goodsNorm,
                        goodsType:item.goodsType,
                        goodsTypeId:item.goodsTypeId,
                        groupPath:item.groupPath,
                        id:item.id,
                        isDel:1,
                        labCgeMode:item.labCgeMode,
                        mainStoneWeight:item.mainStoneWeight,
                        marketCost:item.marketCost,
                        nature:item.nature,
                        netGoldWeight:item.netGoldWeight,
                        occupiedStatus:item.occupiedStatus,
                        otherFee:item.otherFee,
                        otherFeeMode:item.otherFeeMode,
                        otherFeeName:item.otherFeeName,
                        processingFee:item.processingFee,
                        purCertificateFee:item.purCertificateFee,
                        purLabCgeMode:item.purLabCgeMode,
                        purOtherFee:item.purOtherFee,
                        purPriceCost:item.purPriceCost,
                        purchaseCost:item.purchaseCost,
                        purchaseGoldLose:item.purchaseGoldLose,
                        purchaseGoldPrice:item.purchaseLaborCharge,
                        purchaseLaborCharge:item.purchaseLaborCharge,
                        remark:item.remark,
                        reservoirPositionId:item.reservoirPositionId,
                        salePrice:item.salePrice,
                        saleRate:item.saleRate,
                        soldStatus:item.soldStatus,
                        standardCertType:item.standardCertType,
                        stockInNo:item.stockInNo,
                        stockType:item.stockType,
                        // stoneClarity:item.stoneClarity,
                        // stoneColor:item.stoneColor,
                        // stoneSection:item.stoneSection,
                        supplierId:item.supplierId,
                        totalWeight:item.totalWeight,
                        viceStoneWeight:item.viceStoneWeight,
                        warehouseId:item.warehouseId,
                        weight:item.weight,
                        weightUnitId:item.weightUnitId,
                        weightUnitName:item.weightUnitName,
                        detailMark:item.detailMark
                    });
                });
            }
            let existGolds = data.some((item)=>item.goodsMainType ===  'attr_ranges_gold');
            if(existGolds){
                let paddingObj = {//商品分录行,根据自己的业务增减字段
                    //下面四个数组固定
                    stonesParts: [],
                    materialParts: [],
                    partParts: [],
                    goldParts: []
                };
                let myAttr = { //组成属性
                    applyOrganizationId: null,
                    bomType: '',
                    countingUnit: '',
                    documentType: '',
                    goldColor: null,
                    goldLoss: null,
                    commodityId: '',
                    goodsCode: '',
                    goodsId: '',
                    id: '',
                    inPrice: null,
                    limit: null,
                    name: '',
                    num: '',
                    partAttrs: [],
                    price: null,
                    pricingMethod: null,
                    stoneClarity: null,
                    stoneCoffeeColor: null,
                    stoneColor: null,
                    stoneCut: null,
                    stoneFluorescent: null,
                    stoneLoss: null,
                    stoneMilkColor: null,
                    stoneName: null,
                    stoneNo: null,
                    stoneSection: null,
                    stoneShape: null,
                    stoneWeight: null,
                    weight: null,
                    weightUnit: null
                };
                data.map((item,index)=>{
                    if(item.goodsMainType ===  'attr_ranges_gold'){
                        if(item.detailMark === 2 && !item.assistAttrs){
                            let specAttr = {
                                commodityId: item.commodityId,
                                goodsCode: item.goodsNo,
                                name: item.goodsName,
                                partAttrs: [],
                            };
                            Object.assign(item,paddingObj,{materialParts:[specAttr]} );
                        }else{
                            let attrTemp = JSON.parse(JSON.stringify(myAttr));
                            Object.assign(attrTemp, {
                                bomType: 'BOM-MATERIAL'
                            });
                            item.assistAttrs.assistAttrs.map(attr => {
                                if(typeof attr.attr === 'string'){
                                    attrTemp.partAttrs.push(attr);
                                }else{
                                    (attr.attr || []).map(list => {
                                        attrTemp.partAttrs.push({attr: list.name, attrValue: list.model});
                                    });
                                }
                            });
                            if(!data[index].materialParts){
                                data[index].materialParts =[];
                            }
                            data[index].materialParts.push(attrTemp);
                        }
                    }
                });
            }
            return data;
        },
        showGoldDetail(idx){
            let _this = this;
            _this.selectedIndex = idx;
            if(!_this.purchaseStockDetails[idx].commodityId){
                this.$Modal.info({
                    content: '还未选择商品，请先选择商品，再选择明细！',
                    title:"提示信息"
                });
                return false;
            }
            if(_this.purchaseStockDetails[idx].goodsMainType !== 'attr_ranges_gold'){
                return false;
            }
            //固定开始
            let ids = {
                goodsId: _this.purchaseStockDetails[idx].id,
                commodityId: _this.purchaseStockDetails[idx].commodityId,
                documentType: 'W_STOCK_IN_GOLD'
            };
            Object.assign(_this.goldDetailModal, {
                showModal: true,
                ids: ids
            });
            _this.$nextTick(() => {
                _this.$refs.goldRef.getProductDetail();
            });
        },
        showProductDetail(index) {//点击商品明细
            let _this = this;
            _this.detailSelectedIdx = index;
            if(!_this.goodList[index].commodityId){
                this.$Modal.info({
                    content: '还未选择商品，请先选择商品，再选择明细！',
                    title:"提示信息"
                });
                return false;
            }
            //固定开始
            let ids = {
                goodsId: _this.goodList[index].id,
                commodityId: _this.goodList[index].commodityId,
                documentType: 'W_STOCK_IN'
            };
            Object.assign(_this.productDetailModal, {
                showModal: true,
                ids: ids
            });
            _this.$nextTick(() => {
                _this.$refs.modalRef.getProductDetail();
            });
            //固定结束
        },
        validatePurchaseStockDetail(){
            let _this = this;
            let validate = {
                actualRecWeight:{
                    name: '实收重量',
                    type: 'number',
                    floor: 3
                },
                actualRecNum:{
                    name: '实收数量',
                    type: 'number',
                    floor: 3,
                    empty: true
                },
                warehouseId:{
                    name: '仓库',
                    type: 'string'
                },
            };
            return validateRow(_this.purchaseStockDetails, validate,true);
        },
        queryLoadData(stockNo){
            let _this = this;
            if(!stockNo){
                _this.$Modal.warning({
                    content:'数据异常',
                    title:"提示信息"
                });
                return false;
            }
            $.ajax({
                url:contextPath +'/purchasestock/getDetail',
                method:'POST',
                dataType:'json',
                data:{stockNo:stockNo},
                success:function (res){
                    if(res.code === '100100'){
                        _this.psiForm = $.extend(true,{},{
                            //业务类型
                            businessType: res.data.businessType,
                            //单据编号
                            stockNo: res.data.stockNo,
                            //采购部门id
                            purDepartmentId: res.data.purDepartmentId,
                            //采购部门名称
                            purDepartmentName:res.data.purDepartmentName,
                            //收料部门id
                            recMaterialDepartmentId:res.data.recMaterialDepartmentId,
                            //收料部门名称
                            recMaterialDepartmentName:res.data.recMaterialDepartmentName,
                            //采购人id
                            buyerId:'',
                            //采购员名称
                            buyerName:'',
                            //入库日期
                            stockTime:res.data.stockTime,
                            //仓管员id
                            stockKeeperId:res.data.stockKeeperId,
                            //仓管员名称
                            stockKeeper:res.data.stockKeeper,
                            //客户名称
                            custName:res.data.custName,
                            //客户编码
                            custCode:res.data.custCode,
                            //客户id
                            custId:res.data.custId,
                            //供应商名称
                            supplierName:res.data.supplierName,
                            //供应商编码
                            supplierCode:res.data.supplierCode,
                            //供应商id
                            supplierId:res.data.supplierId,
                            //源单类型
                            sourceDocType:'',
                            //id
                            id:res.data.id,
                            //商品类型id
                            goodsTypeId:res.data.goodsTypeId,
                            //商品类型名称
                            goodsTypeName:res.data.goodsTypeName,
                            // 0:代表上游生成 1:代表手动新增
                            docStatus:res.data.docStatus,
                            dataSource:res.data.dataSource,
                            createTime:res.data.createTime,
                            createName:res.data.createName,
                            updateTime:res.data.updateTime,
                            updateName:res.data.updateName,
                            auditorName:res.data.auditorName,
                            auditTime:res.data.auditTime,
                        });
                        _this.initSupplier(res.data.supplierId);
                        _this.goodsTypes = (function (path) {
                            if(!path){
                                return [];
                            }
                            if(path.indexOf('0.') !== -1){
                                path = path.substr(2).substr(0,path.length-1);
                                return path.split('.').map(function (i) {
                                    return Number(i);
                                });
                            }
                        })(res.data.goodsTypePath);
                        if(res.data.purchaseStockDetails && res.data.purchaseStockDetails.length > 0){
                            _this.purchaseStockDetails = res.data.purchaseStockDetails.map((item)=>{
                                let other = {
                                    goldColors:getCodeList('base_Condition'),
                                    certifiTypes:getCodeList('base_certificate_type'),
                                    warehousePositions:_this.warehousePositions.map((item)=>Object.assign({},{
                                        value:item.value,label:item.label
                                    })),
                                };
                                return $.extend({},other,{
                                    id:item.id,
                                    purStockInNo:item.purStockInNo,
                                    sourceDocType:item.sourceDocType,
                                    sourceDocNo:item.sourceDocNo || '',
                                    batchNum:item.batchNum|| '',
                                    pictureUrl:item.pictureUrl ||null,
                                    goodsNo:item.goodsNo ||'',
                                    goodsName:item.goodsName||'',
                                    divisionStatus:item.divisionStatus ? item.divisionStatus.toString():'0',
                                    goodsNorm:item.goodsNorm ||'',
                                    countingUnitId:item.countingUnitId ||null,
                                    countingUnit:item.countingUnit||'',
                                    commodityId:item.commodityId,
                                    weightUnit:item.weightUnit||'',
                                    certificateTypeId:item.certificateTypeId||'',
                                    receivableNum:item.receivableNum ||0,
                                    actualRecNum:item.actualRecNum ||0,
                                    weightUnitId:item.weightUnitId ||null,
                                    receivableWeight:item.receivableWeight ||0,
                                    actualRecWeight:item.actualRecWeight||0,
                                    purchaseCost:item.purchaseCost ||0,
                                    marketCost:item.marketCost||0,
                                    saleCost:item.saleCost||0,
                                    totalSaleAmount:item.totalSaleAmount||0,
                                    warehouseId:item.warehouseId,
                                    goodsMainType:item.goodsMainType,
                                    reservoirPositionId:item.reservoirPositionId,
                                    remark:item.remark||'',
                                    isDel:item.isDel,
                                    custId:item.custId,
                                    supplierId:item.supplierId,
                                    goldColor:item.goldColor,
                                    styleName:item.styleName,
                                    styleCategoryId:item.styleCategoryId,
                                    styleCustomCode:item.styleCustomCode,
                                    detailMark:item.detailMark,
                                    goldColors:getCodeList('base_Condition'),
                                    delGoodList:[],
                                    goodList:(function (goods) {
                                        if(!goods){
                                            return [];
                                        }
                                        return goods.map(item=>{
                                            let other = {
                                                goldColors:getCodeList('base_Condition'),
                                                certifiTypes:getCodeList('base_certificate_type'),
                                            };
                                            return $.extend({},other,item);
                                        });
                                    })(item.goodList),
                                });
                            });
                        }else {
                            _this.purchaseStockDetails = [];
                        }
                    }else{
                        _this.$Modal.info({
                            content:res.msg,
                            title:"提示信息"
                        });
                    }
                }
            });
        },
        loadCurrentOrg(){
            let _this = this;
            $.post(contextPath+'/purchasestock/getCurrentOrg',{},(res)=>{
                if(res.code === '100100'){
                    _this.currOrgName = res.data.orgName;
                }
            },'json');
        },
        queryLoadSourceData(ids) {
            let _this = this;
            if (!ids) {
                return false;
            }
            $.ajax({
                url: contextPath + '/purchasestock/queryStockInByIds',
                method: 'POST',
                dataType: 'json',
                contentType:'application/json;charset=utf-8',
                data: ids,
                success: function (res) {
                    if(res.code === '100100' && res.data.length >0 ){
                        _this.psiForm = Object.assign({},{
                            businessType: res.data[0].businessType,
                            stockNo: '',
                            purDepartmentId:'',
                            purDepartmentName:'',
                            recMaterialDepartmentId:'',
                            recMaterialDepartmentName:'',
                            buyerId:'',
                            buyerName:'',
                            stockTime:new Date(),
                            stockKeeperId:'',
                            stockKeeper:'',
                            custName:'',
                            custCode:'',
                            custId:res.data[0].customerId,
                            supplierName:_this.suppliers[_this.suppliers.map(item=>item.value).indexOf(res.data[0].supplierId)]['label'],
                            supplierCode:res.data[0].supplierCode,
                            supplierId:res.data[0].supplierId,
                            sourceDocType:res.data[0].sourceDocType,
                            id:'',
                            goodsTypeId:'',
                            goodsTypeName:res.data[0].goodsTypeName,
                            goodsTypePath:res.data[0].goodsTypePath,
                            dataSource:res.data[0].dataSource,
                            docStatus:1,
                        });
                        _this.initSupplier(res.data[0].supplierId);
                        _this.goodsTypes = (function (path) {
                            if(!path){
                                return [];
                            }
                            if(path.indexOf('0.') !== -1){
                                path = path.substr(2).substr(0,path.length-1);
                                return path.split('.').map(function (i) {
                                    return Number(i);
                                });
                            }
                        })(res.data[0].goodsTypePath);
                        let _purchaseDetails = [];

                        res.data.forEach((item)=>{
                            if(item.purchaseStockDetails && item.purchaseStockDetails.length > 0){
                                _purchaseDetails = _purchaseDetails.concat(item.purchaseStockDetails);
                            }
                        });
                        if(_purchaseDetails.length > 0){
                            _this.purchaseStockDetails = _purchaseDetails.
                            filter((item)=>(Number(item.qualifiedNumber)+Number(item.releaseNumber)>0) ).map((item)=>{
                                let other = {
                                    goldColors:getCodeList('base_Condition'),
                                    certifiTypes:getCodeList('base_certificate_type'),
                                    warehousePositions:_this.warehousePositions.map((item)=>Object.assign({},{
                                        value:item.value,label:item.label
                                    })),
                                };
                                return $.extend({},other,{
                                    sourceDocType:item.sourceDocType ? item.sourceDocType : res.data[0].sourceDocType
                                        ? res.data[0].sourceDocType : '',
                                    sourceDocNo:item.sourceDocNo || '',
                                    batchNum:item.batchNum|| '',
                                    pictureUrl:item.pictureUrl ||null,
                                    goodsMainType:item.goodsMainType,
                                    goodsNo:item.goodsNo ||'',
                                    goodsName:item.goodsName||'',
                                    divisionStatus:'0',
                                    goodsNorm:item.goodsNorm ||'',
                                    countingUnitId:item.countingUnitId ||null,
                                    countingUnit:item.countingUnit||'',
                                    commodityId:item.commodityId,
                                    weightUnit:item.weightUnit||'',
                                    certificateTypeId:item.certificateTypeId||'',
                                    receivableNum:item.receivableNum ||0,
                                    actualRecNum:Number(item.qualifiedNumber)+Number(item.releaseNumber),
                                    weightUnitId:item.weightUnitId ||null,
                                    receivableWeight:item.receivableWeight ||0,
                                    actualRecWeight:item.actualRecWeight||0,
                                    purchaseCost:item.purchaseCost ||0,
                                    marketCost:item.marketCost||0,
                                    saleCost:item.saleCost||0,
                                    totalSaleAmount:item.totalSaleAmount||0,
                                    warehouseId:'',
                                    reservoirPositionId:'',
                                    remark:'',
                                    isDel:1,
                                    custId:item.custId || '',
                                    supplierId:item.supplierId || '',
                                    resourceType:item.resourceType || '',
                                    documentType:item.documentType||'',
                                    streamId:item.streamId,
                                    goodsLineNo:item.goodsLineNo,
                                    custStyleType:item.custStyleType,
                                    custStyleCode:item.custStyleCode,
                                    styleCategoryId:item.styleCategoryId,
                                    styleCustomCode:item.styleCustomCode,
                                    styleName:item.styleName,
                                    detailMark:item.detailMark,
                                    goldColor:item.goldColor || null,
                                    goldColors:getCodeList('base_Condition'),
                                    productFlag:item.productFlag,
                                    delGoodList:[],
                                    goodList:(function (goods) {
                                        if(!goods){
                                            return [];
                                        }
                                        return goods.map(item=>{
                                            let other = {
                                                goldColors:getCodeList('base_Condition'),
                                                certifiTypes:getCodeList('base_certificate_type'),
                                            };
                                            return $.extend({},other,item);
                                        });
                                    })(item.goodList),

                                });
                            })
                        }else {
                            _this.purchaseStockDetails = [];
                        }

                        _this.$forceUpdate();
                    }
                },
            })
        },
        goToAddPage(){
            window.parent.activeEvent(
                {name: '新增采购入库单',
                    url: contextPath+'/warehouse/purchase-stock-in/purchase-stock-in-info.html',
                    params: {'type':'add'}
                });
        }
    },
    watch: {
        goodList: {
            handler(newQuestion) {
                //总件重
                let totalWeight = 0;
                //总进货成本
                let purchaseCost = 0;
                //总市场成本
                let marketCost = 0;
                let purPriceCost = 0;
                let _salePrice = 0;
                newQuestion.map(item => {
                    if (item.totalWeight && !isNaN(item.totalWeight)) {
                        totalWeight = math.eval(Number(totalWeight) + Number(item.totalWeight));
                    }
                    if(item.purchaseCost && !isNaN(item.purchaseCost)){
                        purchaseCost = math.eval(Number(purchaseCost) + Number(item.purchaseCost));
                    }
                    if(item.marketCost && !isNaN(item.marketCost)){
                        marketCost = math.eval(Number(marketCost) + Number(item.marketCost));
                    }
                    if(item.purPriceCost && !isNaN(item.purPriceCost)){
                        purPriceCost = math.eval(Number(purPriceCost) + Number(item.purPriceCost));
                    }
                    if(item.salePrice && !isNaN(item.salePrice)){
                        _salePrice = math.eval(Number(_salePrice) + Number(item.salePrice));
                    }
                    if(this.selectedIndex !== '' && this.purchaseStockDetails && this.purchaseStockDetails[this.selectedIndex]) {
                        if (this.purchaseStockDetails[this.selectedIndex]['goodsMainType'] !== 'attr_ranges_gold') {
                            this.purchaseStockDetails[this.selectedIndex]['actualRecWeight'] = totalWeight.toFixed(3);
                            this.purchaseStockDetails[this.selectedIndex]['purchaseCost'] = purchaseCost.toFixed(2);
                            this.purchaseStockDetails[this.selectedIndex]['marketCost'] = marketCost.toFixed(2);
                            this.purchaseStockDetails[this.selectedIndex]['saleCost'] = purPriceCost.toFixed(2);
                            this.purchaseStockDetails[this.selectedIndex]['totalSaleAmount'] = _salePrice.toFixed(2);
                        }else {
                            this.purchaseStockDetails[this.selectedIndex]['actualRecWeight'] = document.getElementById("actualRecWeight" + this.selectedIndex).value;
                        }
                    }
                    this.goodsListTotalWeight = totalWeight.toFixed(3);
                    this.totalDetailPurchaseCost = purchaseCost.toFixed(2);
                    this.totalDetailMarketCost = marketCost.toFixed(2);
                    this.totalPurPriceCost = purPriceCost.toFixed(2);
                    this.totalSalePrice = _salePrice.toFixed(2);
                });
            },
            deep: true
        }
    },
    filters:{
        sourceDocTypeFormatter(val){
            switch (val){
                case 'P_RECEIPT_01':return '收货单一客户送料';break;
                case 'P_RECEIPT_02':return '收货单一标准采购收货';break;
                case 'P_RECEIPT_03':return '收货单一受托加工收货';break;
                case 'P_RECEIPT_04':return '收货单一供应商退料';break;
                case 'P_RECEIPT_OLD_RECYCLE_DISCOUNT':return '旧料收回单一折现';break;
                case 'P_RECEIPT_OLD_RECYCLE_INNER':return '旧料收回单-内部处理';break;
                case 'P_RECEIPT_INNER_REPAIR':return '维修收回单-内部处理';break;
                default:return '';
            }
        },
    },
    computed:{
        //应收数量合计
        totalReceivableNum(){
            let _this = this;
            return _this.purchaseStockDetails.length === 0 ? 0 :_this.sum(_this.purchaseStockDetails,'receivableNum');
        },
        //实收数量合计
        totalActualRecNum(){
            let _this = this;
            return _this.purchaseStockDetails.length === 0 ? 0 :_this.sum(_this.purchaseStockDetails,'actualRecNum');
        },
        //应收重量合计
        totalReceivableWeight(){
            let _this = this;
            return _this.purchaseStockDetails.length === 0 ? 0 : _this.sum(_this.purchaseStockDetails,'receivableWeight').toFixed(3);
        },
        //实收重量合计
        totalActualRecWeight(){
            let _this = this;
            return _this.purchaseStockDetails.length === 0 ? 0 : _this.sum(_this.purchaseStockDetails,'actualRecWeight').toFixed(3);
        },
        //进货成本合计
        totalPurchaseCost(){
            let _this = this;
            return _this.purchaseStockDetails.length === 0 ? 0 : _this.sum(_this.purchaseStockDetails,'purchaseCost').toFixed(2);
        },
        //市场成本合计
        totalMarketCost(){
            let _this = this;
            return _this.purchaseStockDetails.length === 0 ? 0 :  _this.sum(_this.purchaseStockDetails,'marketCost').toFixed(2);
        },
        //售价成本合计
        totalSaleCost(){
            let _this = this;
            return _this.purchaseStockDetails.length === 0 ? 0 :  _this.sum(_this.purchaseStockDetails,'saleCost').toFixed(2);
        },
        //售价总额合计
        overAllSaleAmount(){
            let _this = this;
            return _this.purchaseStockDetails.length === 0 ? 0 : _this.sum(_this.purchaseStockDetails,'totalSaleAmount').toFixed(2);
        },
        //明细总净金重
        totalNetGoldWeight(){
            let _this = this;
            return _this.goodList.length === 0 ? 0 : _this.sum(_this.goodList,'netGoldWeight').toFixed(3);
        },
        //明细总主石重
        totalMainStoneWeight(){
            let _this = this;
            return _this.goodList.length === 0 ? 0 : _this.sum(_this.goodList,'mainStoneWeight').toFixed(3);
        },
        //明细总进货金价
        totalPurchaseGoldPrice(){
            let _this = this;
            return _this.goodList.length === 0 ? 0 : _this.sum(_this.goodList,'purchaseGoldPrice').toFixed(2);
        },
        //明细总金价
        totalGoldPrice(){
            let _this = this;
            return _this.goodList.length === 0 ? 0 : _this.sum(_this.goodList,'goldPrice').toFixed(2);
        },
        //明细总进货工费
        totalPurchaseLaborCharge(){
            let _this = this;
            return _this.goodList.length === 0 ? 0 : _this.sum(_this.goodList,'purchaseLaborCharge').toFixed(2);
        },
        //明细总加工费
        totalProcessingFee(){
            let _this = this;
            return _this.goodList.length === 0 ? 0 : _this.sum(_this.goodList,'processingFee').toFixed(2);
        },
        //明细总进货证书费
        totalPurCertificateFee(){
            let _this = this;
            return _this.goodList.length === 0 ? 0 : _this.sum(_this.goodList,'purCertificateFee').toFixed(2);
        },
        //明细总证书费
        totalCertificateFee(){
            let _this = this;
            return _this.goodList.length === 0 ? 0 : _this.sum(_this.goodList,'certificateFee').toFixed(2);
        },
        //明细总进货其他费
        totalPurOtherFee(){
            let _this = this;
            return _this.goodList.length === 0 ? 0 : _this.sum(_this.goodList,'purOtherFee').toFixed(2);
        },
        //明细总其他费
        totalOtherFee(){
            let _this = this;
            return _this.goodList.length === 0 ? 0 : _this.sum(_this.goodList,'otherFee').toFixed(2);
        },
        supplierDisabled(){
            let _this = this;
            if(_this.psiForm.dataSource === 1 && _this.psiForm.docStatus === 1){
                this.ruleValidate.supplierId[0].required = true;
                return _this.psiForm.businessType && _this.psiForm.businessType === 'W_PURCHASE_STOCK_IN_03';
            }else {
                this.ruleValidate.supplierId[0].required = true;
                return true;
            }
        },
        customerDisabled(){
            let _this = this;
            if(_this.psiForm.dataSource === 1 &&_this.psiForm.docStatus === 1){
                return _this.psiForm.businessType && (_this.psiForm.businessType === 'W_PURCHASE_STOCK_IN_02' || _this.psiForm.businessType === 'W_PURCHASE_STOCK_IN_01');
            }else {
                return true;
            }
        },
        showProduct(){
            if(!this.canBeEdited){
                return true;
            }
            if(this.psiForm.businessType === 'W_PURCHASE_STOCK_IN_02' ) {
                return false;
            }else {
                return true;
            }
        },
        canBeEdited(){
            if(this.openType === 'query'){
                return false;
            }else if(this.psiForm.docStatus === 1){
                return true;
            }else {
                return false;
            }
        },
        tableInputCls(){
            if(this.openType === 'query'){
                return 'ivu-input pstock-disabled';
            }else if(this.psiForm.docStatus === 1){
                return 'ivu-input';
            }else{
                return 'ivu-input pstock-disabled';
            }
        }

    },

    mounted(){
        this.getSelect('table-responsive','goods');
        let _this = this;
        //加载当前组织名
        _this.loadCurrentOrg();
        _this.isEdit('Y');
        // $('form').validate({onfocusout: true });
        query:{
            let params = window.parent.params.params;
            _this.openType = params.type;
            if(params.type === 'update'){
                _this.isEdit("Y");
                // console.log(params);
                // _this.canBeEdited = true;
                _this.isClearable = true;
                _this.showTemp = false;
                _this.queryLoadData(params.stockNo);
            }else if(params.type === 'query'){
                _this.isEdit("N");
                // console.log(params);
                // _this.canBeEdited = false;
                _this.isClearable = false;
                _this.showTemp = false;
                _this.queryLoadData(params.stockNo);
            }else if(params.type === 'add'){
                _this.isEdit("Y");
                //新增状态暂时给订单暂存状态(加载商品明细时需要)
                _this.psiForm.docStatus=1;
                //数据来源
                _this.psiForm.dataSource = 1;
                // _this.canBeEdited = true;
                _this.isClearable = false
            }else if(params.type === 'sAdd'){
                _this.isEdit("Y");
                // _this.canBeEdited = true;
                _this.queryLoadSourceData(params.ids);
            }
        }
    }
});
function handlerProductDetail(list, bill, obj, dataSourceType){
    let myAttr = { //组成属性
        applyOrganizationId: null,
        bomType: '',
        countingUnit: '',
        documentType: '',
        goldColor: null,
        goldLoss: null,
        goodsCode: '',
        goodsId: '',
        id: '',
        inPrice: null,
        limit: null,
        name: '',
        num: '',
        partAttrs: [],
        price: null,
        pricingMethod: null,
        stoneClarity: null,
        stoneCoffeeColor: null,
        stoneColor: null,
        stoneCut: null,
        stoneFluorescent: null,
        stoneLoss: null,
        stoneMilkColor: null,
        stoneName: null,
        stoneNo: null,
        stoneSection: null,
        stoneShape: null,
        stoneWeight: null,
        weight: null,
        weightUnit: null
    };
    list.map((item, index) => {

        //如果数据是导入的话
        if(item.isImport && item.goodsMainType === 'attr_ranges_goods' && !item.tBaseBomEntity){
            if (!bill.goodList[index]) {
                bill.goodList[index] = JSON.parse(JSON.stringify(obj));
            }
            bill.goodList[index].goldParts = (item.importData.goldParts);
            bill.goodList[index].partParts = (item.importData.partParts);
            bill.goodList[index].stonesParts = (item.importData.stonesParts);
            Object.assign(bill.goodList[index], {
                pictureUrl: item.pictureUrl,
                goodsName: item.goodsName,
                goodsMainType: item.goodsMainType,
                goodsSpecifications: item.goodsSpecifications,
                countingUnit: item.countingUnit,
                applyCount: item.applyCount,
                weightUnit: item.weightUnit,
                applyWeight: item.applyWeight,
                pricingMethod: item.pricingMethod,
                price: item.price,
                amount: item.amount
            })
        }
        if (!item.tBaseBomEntity && !item.assistAttrs && !dataSourceType) {
            //如果数据没变则提交空数组
            Object.assign(item, {
                stonesParts: [],
                goldParts: [],
                partParts: [],
                materialParts: [],
            });
            return;
        }

        if (!item.tBaseBomEntity && !item.assistAttrs && dataSourceType) {
            //如果数据没变则提交空数组
            Object.assign(item, {
                stonesParts: item.stonesParts,
                goldParts: item.goldParts,
                partParts: item.partParts,
                materialParts: item.materialParts,
            });
            return;
        }

        if (item.goodsMainType === 'attr_ranges_goods') {//成品
            //石料金料组成部分数据处理开始
            item.tBaseBomEntity.goldBoms.map((attr) => {
                let attrTemp = JSON.parse(JSON.stringify(myAttr));
                Object.assign(attrTemp, {
                    bomType: 'BOM-GOLD',
                    weightUnit: attr.weightUnitId,
                    weight: attr.weight,
                    goodsCode: attr.commodityCode,
                    name: attr.commodityName,
                    goldLoss: attr.lose,
                    goldColor: attr.condition
                    //不固定辅助属性
                });
                if($.type(attr.attr) === 'array' && attr.attr.length > 0){
                    attr.attr.map(list => {
                        if (list.name && list.model) {
                            attrTemp.partAttrs.push({attr: list.name, attrValue: list.model});
                        }
                    });
                }
                if (!bill.goodList[index]) {
                    bill.goodList[index] = JSON.parse(JSON.stringify(obj));
                }
                bill.goodList[index].goldParts.push(attrTemp);
                Object.assign(bill.goodList[index], {
                    pictureUrl: item.pictureUrl,
                    goodsName: item.goodsName,
                    goodsMainType: item.goodsMainType,
                    goodsSpecifications: item.goodsSpecifications,
                    countingUnit: item.countingUnit,
                    applyCount: item.applyCount,
                    weightUnit: item.weightUnit,
                    applyWeight: item.applyWeight,
                    pricingMethod: item.pricingMethod,
                    price: item.price,
                    amount: item.amount
                })
            });
            item.tBaseBomEntity.stonesBoms.map((attr) => {
                let attrTemp = JSON.parse(JSON.stringify(myAttr));
                Object.assign(attrTemp, {
                    bomType: 'BOM-STONE',
                    countingUnit: attr.countUnitId,
                    weightUnit: attr.weightUnitId,
                    num: attr.count,
                    weight: attr.weight,
                    goodsCode: attr.commodityCode,
                    name: attr.commodityName,
                    stoneName: attr.partName,
                    stoneLoss: attr.lose,
                    stoneNo:attr.stoneNo,
                    price:attr.price,
                    inPrice:attr.inPrice,

                });
                if($.type(attr.attr) === 'array' && attr.attr.length > 0){
                    attr.attr.map(list => {
                        if (list.name && list.model) {
                            attrTemp.partAttrs.push({attr: list.name, attrValue: list.model});
                        }
                    });
                }
                if (!bill.goodList[index]) {
                    bill.goodList[index] = JSON.parse(JSON.stringify(obj));
                }
                bill.goodList[index].stonesParts.push(attrTemp);
                Object.assign(bill.goodList[index], {
                    pictureUrl: item.pictureUrl,
                    goodsName: item.goodsName,
                    goodsMainType: item.goodsMainType,
                    goodsSpecifications: item.goodsSpecifications,
                    countingUnit: item.countingUnit,
                    applyCount: item.applyCount,
                    weightUnit: item.weightUnit,
                    applyWeight: item.applyWeight,
                    pricingMethod: item.pricingMethod,
                    price: item.price,
                    amount: item.amount
                })
            });
            item.tBaseBomEntity.partBoms.map((attr, i) => {
                let attrTemp = JSON.parse(JSON.stringify(myAttr));
                Object.assign(attrTemp, {
                    bomType: 'BOM-PART',
                    countingUnit: attr.countUnitId,
                    weightUnit: attr.weightUnitId,
                    num: attr.count,
                    weight: attr.weightReference,
                    goodsCode: attr.commodityCode,
                    name: attr.commodityName,
                    price:attr.price,
                    inPrice:attr.inPrice
                });
                if($.type(attr.attr) === 'array' && attr.attr.length > 0){
                    attr.attr.map(list => {
                        if (list.name && list.model) {
                            attrTemp.partAttrs.push({attr: list.name, attrValue: list.model});
                        }
                    });
                }
                if (!bill.goodList[index]) {
                    bill.goodList[index] = JSON.parse(JSON.stringify(obj));
                }
                bill.goodList[index].partParts.push(attrTemp);
            });
        } else { //原料
            let attrTemp = JSON.parse(JSON.stringify(myAttr));
            Object.assign(attrTemp, {
                bomType: 'BOM-MATERIAL'
            });

            //对辅助属性统一处理数据
            item.assistAttrs.assistAttrs.map(attr => {
                if($.type(attr.attr) === 'array' && attr.attr.length > 0){
                    attr.attr.map(list => {
                        if (list.name && list.model) {
                            attrTemp.partAttrs.push({attr: list.name, attrValue: list.model});
                        }
                    });
                }
            });
            if (!bill.goodList[index]) {
                bill.goodList[index] = JSON.parse(JSON.stringify(obj));
            }
            bill.goodList[index].materialParts.push(attrTemp);
        }
    });
    return list;
}
function validateRow(data, filed,show=true,tip='分录行') {

    return data.some((item,index) =>{
        for(let attr in filed){
            if(filed.hasOwnProperty(attr)){
                if( attr !== 'goldColor' && filed[attr].type === 'string' && (item[attr] === undefined || item[attr] === '' || item[attr] === null )){
                    if(show){
                        vm.$Modal.info({
                            content:`${tip}第${index +1}行${filed[attr].name}必填`,
                            title:"提示信息"
                        });
                    }
                    return true;
                }
                if(filed[attr].type === 'number'){
                    if(!(item['goodsMainType'] === 'attr_ranges_gold' && filed[attr].empty === true)){
                        let str = filed[attr].floor === 0 ? '^\\+?[1-9][0-9]*$' : '^[0-9]+(.[0-9]{0,' + filed[attr].floor + '})?$';
                        let reg = new RegExp(str);
                        if(!reg.test(item[attr])){
                            if(show){
                                vm.$Modal.info({
                                    content:`${tip}第${index +1}行${filed[attr].name}不符合要求`,
                                    title:"提示信息"
                                });
                            }
                            return true;
                        }
                        if(filed[attr]['floor'] && item[attr] && item[attr].toString() === '0.'+ new Array(filed[attr].floor + 1).join ('0') ){
                            if(show){
                                vm.$Modal.info({
                                    content:`${tip}第${index +1}行${filed[attr].name}不符合要求`,
                                    title:"提示信息"
                                });
                            }
                            return true;
                        }
                    }
                }
            }
        }
        if(item.goodsMainType && item.goodsMainType === 'attr_ranges_gold'){
            if(!item.id && item.detailMark !== 2 && !item.assistAttrs){
                if(show){
                    vm.$Modal.info({content:`请填写${tip}第${index +1}行的商品明细!`,title:"提示信息"});
                }
                return true;
            }
        }
        if(item.goodsMainType && item.goodsMainType !== 'attr_ranges_gold'){
            if(item.goodList.length === 0 ){
                if(show){
                    vm.$Modal.info({content:`请填写${tip}第${index +1}行的条码明细!`,title:"提示信息"});
                }
                return true;
            }
        }
    });
}

function goodsValidateRow(data, filed,show=true,tip='分录行'){
    if(!data ||(data && data.length === 0)){
        return;
    }
    const stonesValidArr =['purchaseGoldLose','goldPurchase','netGoldWeight','purchaseGoldPrice','goldPrice','mainStoneWeight'];

    return data.some(function (da,x) {
        if(da.goodsMainType !== 'attr_ranges_gold'){
            return da.goodList.some(function (item,index) {
                for(let attr in filed){
                    if(filed.hasOwnProperty(attr)){
                        if(da.goodsMainType !== 'attr_ranges_goods'){
                            if(stonesValidArr.includes(attr)){
                                continue;
                            }
                        }
                        if(filed[attr].type === 'string' && (item[attr] === undefined || item[attr] === '' || item[attr] === null )){
                            if(show){
                                vm.$Modal.info({content:`第${x +1}行${tip}的第${index +1}行${filed[attr].name}必填`,title:"提示信息"});
                            }
                            return true;
                        }
                        if(filed[attr].type === 'number'){
                            //这一段逻辑是用于
                            //成品-素金 有金无石 的时候 跳过主石重的校验
                            if(
                                attr === 'mainStoneWeight' &&
                                item.goodsMainType === 'attr_ranges_goods' &&
                                item.tBaseBomEntity &&
                                Array.isArray(item.tBaseBomEntity.stonesBoms) &&
                                item.tBaseBomEntity.stonesBoms.length === 0
                            ){
                                continue;
                            }

                            if(
                                item.isImport &&
                                attr === 'mainStoneWeight' &&
                                item.goodsMainType === 'attr_ranges_goods' &&
                                item.importData.stonesParts.length === 0

                            ){
                                continue;
                            }

                            if(!(item['goodsMainType'] === 'attr_ranges_gold' && filed[attr].empty === true)){
                                let str = filed[attr].floor === 0 ? '^\\+?[1-9][0-9]*$' : '^[0-9]+(.[0-9]{0,' + filed[attr].floor + '})?$';
                                let reg = new RegExp(str);
                                if(!reg.test(item[attr])){
                                    if(show){
                                        vm.$Modal.info({content:`第${x +1}行${tip}的第${index +1}行${filed[attr].name}不符合要求`,title:"提示信息"});

                                    }
                                    return true;
                                }
                                if(filed[attr]['floor'] && item[attr] && item[attr].toString() === '0.'+ new Array(filed[attr].floor + 1).join ('0') ){
                                    if(show){
                                        vm.$Modal.info({content:`第${x +1}行${tip}的第${index +1}行${filed[attr].name}不符合要求`,title:"提示信息"});
                                    }
                                    return true;
                                }
                            }
                        }
                    }
                }
                if(item.goodsMainType === 'attr_ranges_goods'){
                    if(item.isImport){
                        if($.isEmptyObject(item.importData) || $.isEmptyObject(item.importData.tBaseBomEntity)){
                            vm.$Modal.info({content:`第${x +1}行${tip}的第${index +1}行商品明细未选择!`,title:"提示信息"});
                            return true;
                        }else if(!item.tBaseBomEntity) {
                             let importData = item.importData;
                            return  (importData.goldParts).some((__item)=>{
                                if(!__item.weight){
                                    vm.$Modal.info({content:`第${x +1}行${tip}的第${index +1}行商品明细的金料的重量未填写!`,title:"提示信息"});
                                }
                                if(!__item.lose){
                                    vm.$Modal.info({content:`第${x +1}行${tip}的第${index +1}行商品明细的金料的金耗未选择!`,title:"提示信息"});
                                }
                                return __item.partAttrs.some((_item)=>{
                                    if(!_item.attrValue||_item.attrValue === ''){
                                        vm.$Modal.info({content:`第${x +1}行${tip}的第${index +1}行商品明细的金料的${_item.attr}未选择`,title:"提示信息"});
                                    return true;
                                }})

                            })
                            || (importData.stonesParts).some((__item,i)=>{
                                return __item.partAttrs.some((_item)=>{
                                    if(!_item.attrValue||_item.attrValue === ''){
                                        vm.$Modal.info({content:`第${x +1}行${tip}的第${index +1}行商品明细的第${i+1}行石料的${_item.attr}未选择!`,title:"提示信息"});
                                        return true;
                                    }
                                });
                            })
                            || (importData.partParts).some((__item,i)=>{
                               return __item.partAttrs.some((_item)=>{
                                   if(!_item.attrValue||_item.attrValue === ''){
                                       vm.$Modal.info({content:`第${x +1}行${tip}的第${index +1}行商品明细的第${i+1}行配件的${_item.attr}未选择!`,title:"提示信息"});
                                       return true;
                                   }
                               });
                            });
                        }
                    }else {
                        if(!item.id && !item.tBaseBomEntity){
                            vm.$Modal.info({content:`第${x +1}行${tip}的第${index +1}行商品明细未选择!`,title:"提示信息"});
                            return true;
                        }
                    }
                }else if(item.goodsMainType === 'attr_ranges_stone'){
                    if(!item.id && item.detailMark !== 2 &&  !item.assistAttrs){
                        vm.$Modal.info({content:`第${x +1}行${tip}的第${index +1}行商品明细未选择!`,title:"提示信息"});
                        return true;
                    }
                }
            });
        }
    });
}

