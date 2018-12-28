var vm = new Vue({
    el: "#app",
    data(){
	  return {
          htHaveChange: false,
          inputBarCode:"",
          isShowBarCodeModal:false,
          barCodeList:[],
          ruleValidate: {
              goodsTypeName: [
                  { required: true}
              ],
              businessType: [
                  { required: true}
              ]
          },
          codesUsed:{},
	    warehouseInfoList:[],
		productDetailModal: {
			showModal: false,
			ids: {
				goodsId: '',
				commodityId: '',
				documentType: 'W_REQUISITION'
			}
		},  
		productTypeList: [],
        requisitionOrder:{
            "documentNo": '',
			"documentStatus":1,
			"businessType": '',
			"salesmanId": '',
			"salesmanName": '',
			"goodsTypeId": '',
			"goodsTypePath": '',
			"goodsTypeName": '',
			"remark": '',
			
			"totalTransferNum": '',
			"totalTransferWeigh": '',
			"organizationId":'',
            "organizationName":'',
			"transferTime": '',
			"createId": '',
			"createName": '',
			"createTime": '',
			"updateId": '',
			"updateName": '',
			"updateTime": '',
			"isDel": '',
			"custId": '',
			"custCode": '',
			"supplierId": '',
			"supplierCode": '',
			"goodsMainType":'',
			"goodList":[],
			"examineVerifyName":'',
            "examineVerifyTime":'',
        },
        isShow: false,
        reload : false,
        isSearchHide: true,
		unitMap: {},//单位
        isTabulationHide: true,
		isGoodsBarcode:false,
        //调出创库是否显示
        showMainType:true,
		//是否显示/隐藏
		showAdd:false,
		showBody:false,
		showProductType:false,
		showProduct:false,
		showAll:false,
		showWeight:false,
		//显示隐藏商品明细
        showProductProperty:false,
		selectTab:true,
		tabValid:false,
        ctrlMark: true,
		modalTrigger:false,
		isClick:false,
		isStampShow:false,
		isGoodsBarcodeShow:false,
		isHideOutWarehouse:true,
		showWarehouse:false,
        isReadonly:false,
		isDelClick:true,
        isBusinessType:true,
		
		tabVal:"name1",
        businessType:"",
		//商品明细状态
        orderStatus:'',
		//商品主类型
        goodsMainType:'',
		goodsValue:[],
		//审核进度条
        stepList: [],
		
        modalType:'',
		approvalTableData:[],
        //商品描述
        goodsDescription:[],
        rawInfo:[{}],
		//明细信息选中行高亮
        selectedIndex: 0,
		//条码明细选中行
        selectedIndex1: 0,
		//接收数组数据
        categoryType:[],
		salesmanList:[],
		warehouseList:[],
        warehouseArr:[],
        businessTypeTemp:'',
		sourceType:'',
		qualifiedNum:'',
		openTime: '',
		allTransferNum:'',
        nature:'',
        selectBusinessType:[
            {
                value: "W_REQUISITION_01",
                label: "销售出仓"
            },
            {
                value: "W_REQUISITION_02",
                label: "采购送料"
            },
            {
                value: "W_REQUISITION_03",
                label: "采购退库"
            },
            {
                value: "W_REQUISITION_04",
                label: "受托加工送料"
            },
            {
                value: "W_REQUISITION_05",
                label: "受托加工退料"
            },
			{
                value: "W_REQUISITION_06",
                label: "采购料结"
            }
        ],
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
		options:[],
        // productDetailList:[{
        //     goodsEntities: [],
        //     options: []
        // }],
        //
        // productDetailListTemp:{
        //     goodsEntities:[{
        //         options: []
        //     }]
        // }
        productDetailList:[],
		//productDetailList: [{goodsEntities: []}],
        productDetailListTemp:{}
	  }
	},
    methods: {
        htTestChange(){
            this.htHaveChange = true;
            console.log(333)
        },
        //点击扫码录入按钮
        scavengingEntry(){
            let _this = this;
            _this.$refs['formValidate'].validate((valid) => {
                 if(!valid){
                     _this.$Modal.info({content:'请先填写表头信息!',title:"提示信息"});
                 }else {
                     _this.resetInputBarCode();
                     _this.isShowBarCodeModal = true;
                 }
            });

        },
        //点击回车添加条码
        barCodeEnter(){
            let _this = this;
            const  reg =/^\d{8}$/;
            if(!reg.test(this.inputBarCode)){
                _this.$Modal.info({content:'条码格式不正确!',title:"提示信息"});
                _this.resetInputBarCode();
                return false;
            }
            let codeList = _this.barCodeList.length === 0 ? [] : _this.barCodeList.map(item=>item.goodsBarcode);
            let usedCodeList = codeList.concat(Object.keys(_this.codesUsed));
            let _res = usedCodeList.find((item)=>item === _this.inputBarCode);
            if(_res === _this.inputBarCode){
                _this.$Modal.info({
                    content:'扫描的条码重复!',
                    title:"提示信息"
                });
                _this.resetInputBarCode();
                return false;
            }
            _this.checkScannedBarcode(_this.inputBarCode);
        },
        checkScannedBarcode(code) {
            let _this = this;
            let params = {
                groupPath: _this.requisitionOrder.goodsTypePath,
                scannedBarcode: code
            };
            $.ajax({
                type: "post",
                url: contextPath+'/requisition/scanBarCode',
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                data:JSON.stringify(params),
                success: function (res) {
                    if (res.code === "100100") {
                       let _arr = res.data;
                        if(_arr.length === 0){
                            _this.$Modal.warning({
                                content:'扫描的商品条形码不存在!',
                                onOk:_this.resetInputBarCode(),
                            });
                            return false;
                        }
                        let _r = _arr[0];
                        if(_r.isInStock !== 1){
                            _this.$Modal.warning({
                                content:'扫描的条码号不在库!',
                                onOk:_this.resetInputBarCode(),
                            });
                            return false;
                        }else if(_r.isInStock === 1 && !_this.warehouseArr.includes(_r.warehouseId)){
                                _this.$Modal.warning({
                                content:'扫描的条码号不在业务类型规定的仓库范围内!',
                                onOk:_this.resetInputBarCode(),
                            });
                            return false;
                        }else if(_r.isInStock === 1){
                            _this.barCodeList.push(_r);
                            _this.resetInputBarCode();
                        }
                    }

                },
                error: function () {
                    _this.$Modal.warning({content:"服务器出错啦",title:"提示信息"})
                }
            })
        },
        //重置条码输入框
        resetInputBarCode(){
            this.inputBarCode = '';
            this.$refs.inputBarCode.focus();
        },
        //删除条码
        deleteBarCode(index){
            let _this = this;
            _this.$Modal.confirm({
                title: '提示信息',
                content: '确定删除选中数据吗?',
                onOk    : function () {
                    _this.barCodeList.splice(index,1);
                }
            });
        },
        //扫码录入弹窗点击确定
        scanOk(){
          let _this = this;
          if(_this.barCodeList.length === 0){
              return false;
          }
          _this.resetInputBarCode();
          window.top.home.loading('show',{text:'处理中，请稍后!'});
            $.ajax({
                    type: "post",
                    url: contextPath+'/requisition/handleScannedCodes',
                    contentType: 'application/json;charset=utf-8',
                    dataType: "json",
                    data:JSON.stringify(_this.barCodeList),
                    success: function (res) {
                        if(res.code === '100100'){
                            // _this.updateScannedCodeUsed();
                            (res.data||[]).forEach((item)=>{

                                item.countUnit = _this.unitMap[item.countingUnitId];
                                item.weightUnit = _this.unitMap[item.weightUnitId];
                                _this.productDetailList.push(item);
                            });
                          _this.updateCodesUsed();
                        }
                        _this.barCodeList = [];
                        window.top.home.loading('hide');
                    },
                    error:function () {
                        window.top.home.loading('hide');
                    }
            })
        },
        //表格模糊搜索下拉错位的问题
        getSelect(parent, child){
            return repositionDropdownOnSroll(parent,child);
        },
        clear() {
            this.requisitionOrder = {
                // documentType:'',
                documentCode: '',
                startTime: '',
                endTime: '',
                productTypeName: '',
                alreadyTest: 2,
                hasCreateTestDocument: 0,//未生成检验单
            }
            this.dataValue = [];
        },
		//打印
        htPrint(){
            htPrint()
        },
		//获取商品类型
        loadProductType(){
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/requisition/queryStyleCategory?parentId=0',
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        This.categoryType = This.initGoodCategory(data.data.cateLists)
                    }
                },
                error: function () {
                    This.$Modal.warning({content:"服务器出错啦",title:"提示信息"})
                }
            })
        },
		initGoodCategory(type) {
            let result = [];
            type.forEach((item) => {
                let {
                    customCode: value,
                    name: label,
                    cateLists: children,
                    code: code
                } = item

                if (children) {
                    children = this.initGoodCategory(children)
                }
                result.push({
                    value,
                    label,
                    children,
                    code
                })
            })
            result.forEach((item) => {
                if (!item.children) {
                    delete item.children;
                }
            })
            return result
        },
		//监听商品类型内容改变,根据商品分类id
        changeProductType(selectedData,arr){
            let This = this;
            this.htHaveChange = true;
            console.log(333)
            if (!This.requisitionOrder.goodsTypePath){
                This.requisitionOrder.goodsTypePath = arr[arr.length - 1]['value'];
                This.requisitionOrder.goodsTypeName = arr[arr.length - 1]['label'];
				// console.log("changeProductType--",This.requisitionOrder.goodsTypeName);
                This.selectedProductType = selectedData;
                return;
            }
			This.$Modal.confirm({
                title: '提示信息',
                content: '修改商品类型会清空商品简述和商品明细列表的所有数据，是否确定修改？',
                onOk: () => {
                    // console.log(This)
                    //获取商品分类code和名称
                    This.requisitionOrder.goodsTypePath = arr[arr.length - 1]['value'];
                    This.requisitionOrder.goodsTypeName = arr[arr.length - 1]['label'];
                    This.selectedProductType = selectedData;
                    This.$nextTick(()=>{
                        //清空简述和明细列表
                        This.productDetailList = [];
						This.productDetailListTemp.goodsEntities = [];
                        //清空仓库和库位集合
                        This.warehouseList = [];
                        //切换到商品简述页签
                        this.tabVal = 'name1';
                    })
                    This.$forceUpdate();
                },
                onCancel: () => {
					//清空简述和明细列表
					This.productDetailList = [];
					//清空仓库和库位集合
					This.warehouseList = [];
					//新增一行
					This.productDetailList.push({});
                    This.goodsValue = This.selectedProductType;
                    This.$forceUpdate();
                }
            })
        },
        //新增行 复制行
        rowClick(type) {
            if (this.goodsValue.length === 0){
                this.$Modal.info({
                    content:'请先选择商品类型',
                    title:"提示信息"
                });
                return;
            }
            if (type === 'add') {
                if(!this.requisitionOrder.businessType){
                    this.$Modal.info({
                        content:'请先选择业务类型',
                        title:"提示信息"
                    });
                    return;
                }
                let len = this.productDetailList.length;
                this.productDetailList.push({});
                vm.getInputValue('',len);
                this.$nextTick(()=>{
                    this.getSelect('table-responsive','goods');
					
                })
            } else if(type === 'copy'){
                if(this.selectedIndex === null){
                    this.$Modal.info({content:"请选择一条数据!",title:"提示信息"})
                }else {
                    var copyRawList = Object.assign({}, this.productDetailList[this.selectedIndex],{goodsEntities:[]});
                    this.productDetailList.push(copyRawList);
                    this.selectedIndex = null;
                }
            }
            this.$nextTick(()=>{
                this.getSelect('table-responsive','goods');
				this.getWareHouseGroup();
            })
        },
        //删除行
        action2(){
            if(this.selectedIndex === null){
                this.$Modal.info({content:"请选择一条数据!",title:"提示信息"})
            }else{
                this.productDetailList.splice(this.selectedIndex,1);
                this.$forceUpdate();
                this.updateCodesUsed();
            }
            this.selectedIndex = null;
        },
		
		//删除条码行
        action3(){
            if(this.selectedIndex1 === null){
                this.$Modal.info({content:"请选择一条数据!",title:"提示信息"})
            }else{
				if(this.productDetailListTemp.goodsEntities.length >this.allTransferNum){
					this.productDetailListTemp.goodsEntities.splice(this.selectedIndex1,1);
					this.productDetailList[this.selectedIndex].goodsEntities.splice(this.selectedIndex1,1);				
				}else{
					this.isDelClick=true;
				}

                this.$forceUpdate();
            }
            this.selectedIndex1 = null;
        },
		//获取商品编码
        getInputValue(value, index) {//获取输入框输入的值/触发
            let This = this;
			if (!This.requisitionOrder.goodsTypePath){
                This.$Modal.info({content:"请先选择商品类型！",title:"提示信息"});
                return;
            }
			// console.log('getInputValue1111111--goodsTypePath:',This.requisitionOrder.goodsTypePath);
            let params = {
                categoryCustomCode: This.requisitionOrder.goodsTypePath,
                field: value,
                limit: ''
            };
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecommodity/findByType',
                data: params,
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        Object.assign(This.productDetailList[index], {options: data.data});
                        This.$forceUpdate();
                    }
                },
                error: function () {
                    This.$Modal.warning({content:"服务器出错啦",title:"提示信息"})
                }
            })
        },
		//获取商品简述选中行
        getSelectedItem(params, index) {
		 console.log("getSelectedItem----params:",params);
            let This = this;
                if (params.code === "100100") {
                This.productDetailList[index]=[];
                let res = params.data;
                console.log("getSelectedItem----res:",res);
                //转换重量 数量单位
                res.countUnit = This.unitMap[res.countUnitId];
                res.weightUnit = This.unitMap[res.weightUnitId];
                // console.log(res);
                Object.assign(This.productDetailList[index], {
                    goodsCode: res.code,
                    goodsName: res.name,
                    commodityId: res.id,
                    goodsMainType: res.mainType,
                    pictureUrl: res.frontPic && res.frontPic.fdUrl,
                    goodsNorm: res.specification,
                    weightUnitId: res.weightUnitId,
                    countingUnitId: res.countUnitId,
                    weightUnit: res.weightUnit,
                    countingUnit: res.countUnit,
                    pricingUnitId: res.pricingType,
                    styleCategoryId:res.styleCategoryId,
                    certificateType:res.certificateType,
                    styleName:res.styleName,
                    styleCustomCode: res.styleCustomCode,
                    detailMark:res.detailMark
                });

                if(This.productDetailList[index].detailMark == 2){
                    //不存在辅助属性
                    let myAttr = { //组成属性
                        commodityId: This.productDetailList[index].commodityId,
                        goodsCode: This.productDetailList[index].goodsNo,
                        name: This.productDetailList[index].goodsName,
                        partAttrs: [],
                    };
                    Object.assign(This.productDetailList[index], {
                        stonesParts: [],
                        goldParts: [],
                        partParts: [],
                        materialParts: [myAttr],
                    });
                }
                // console.log('getSelectedItem---productDetailList',This.productDetailList[index]);
                This.isHideOutWarehouse=true;
                if (res.mainType === 'attr_ranges_gold') {
                    This.productDetailList[index].certificateType = res.certificateType;
                    This.isHideOutWarehouse=false;
                    This.showWeight=false;
                }
                This.productDetailList[index].transferOutWarehouse="";
                This.productDetailList[index].transferInWarehouse="";
                This.productDetailList[index].totalWeight = 0;

                Vue.set(This.productDetailList, index, This.productDetailList[index]);
                This.$forceUpdate();
            }

        },
		//获取业务员
        getSalesman(){
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/requisition/queryallempbyorganid',
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        This.salesmanList = data.data;
                    }
                },
                error: function () {
                    This.$Modal.warning({content:"服务器出错啦",title:"提示信息"})
                }
            })
        },
        showProductDetail(index) {//点击商品明细
            let This = this;

            This.detailType = 'CODING';
            if (This.productDetailList[0].sourceType){
                This.orderStatus = 2;
            }else if(This.requisitionOrder.documentStatus != 1){
                This.orderStatus = 2;
            }else {
                This.orderStatus = 1;
            }
            This.goodsMainType = This.productDetailList[index].goodsMainType;
			
            This.selectedIndex = index;

            if(!This.productDetailList[index].commodityId){
                This.$Modal.info({
                    title: '提示信息',
                    content: '请先选择商品'
                });
                return;
            }
            //输入数量，商品明细则不可点击
            if(This.productDetailList[index].transferGoodsNum){
                return;
            }
            if (!This.productDetailList[index].sourceNo) {
                var ids = {
                    goodsId: This.productDetailList[index].id,
                    commodityId: This.productDetailList[index].commodityId,
                    documentType: 'W_REQUISITION'
                };
            }else {
                var ids = {
                    goodsId: This.productDetailList[index].goodsLineNo,
					//goodsId: This.productDetailList[index].id,
                    commodityId: This.productDetailList[index].commodityId,
                    documentType: This.productDetailList[index].sourceType
                };
            }
            Object.assign(This.productDetailModal, {
                showModal: true,
                ids: ids
            });
            This.$nextTick(() => {
                This.$refs.modalRef.getProductDetail();
            });
            //固定结束
        },
		//显示商品条码的商品明细
        showBarcodeDetail(index){
            let This = this;
			// console.log('showBarcodeDetail---productDetailListTemp',This.productDetailListTemp.goodsEntities[index]);
			if(!This.productDetailListTemp.goodsEntities[index].id){
                This.$Modal.info({
                    content: '请先选择商品条码！',
                    title:"提示信息"
                });
                return false;
            }
            This.detailType = 'BARCODE';
            This.orderStatus = 2;
            This.goodsMainType = This.productDetailListTemp.goodsEntities[index].goodsMainType;

            var ids = {
                goodsId: This.productDetailListTemp.goodsEntities[index].id,
                //goodsId: 560,
                commodityId: '',
                documentType: 'W_STOCK_IN'
            };

            Object.assign(This.productDetailModal, {
                showModal: true,
                ids: ids
            });

            This.$nextTick(() => {
                This.$refs.modalRef.getProductDetail();
            });
            //固定结束
        },

        modalSure(e) {
            if (this.detailType === 'CODING') {
                this.productDetailModalClick(e);
            }else if (this.detailType === 'BARCODE') {
                this.productDetailList[selectedIndex].overEdit = false;
            }
        },
        validateProduct(){//校验是否存在商品明细
            let flag = true;
            let This = this;
            $.each(This.productDetailList, function (i, item) {
                if (item.goodsId || item.detailMark == 2) {
                    return true;
                }
                if (item.sourceNo){
                    return true;
                }
                if(item.goodsMainType == 'attr_ranges_goods'){
                    if(!item.tBaseBomEntity){
                        flag = false;
                        This.$Modal.info({
                            content: '第'+(i+1)+'行商品明细未选择，请先选择商品明细！',
                            title:"提示信息"
                        });
                        return false;
                    }
                }else{
                    if(!item.assistAttrs){
                        flag = false;
                        This.$Modal.info({
                            content: '第'+(i+1)+'行商品明细未选择，请先选择商品明细！',
                            title:"提示信息"
                        });
                        return false;
                    }
                }
            });
            return flag;

        },
        modalOk() {//商品明细弹窗点击确认
            // Object.assign(this.rawInfo[this.selectedIndex].tBaseBomEntity,{...JSON.parse(JSON.stringify(this.productDetailAttr))});
        },
        modalCancel() {//商品明细弹窗点击取消
            // Object.assign(this.rawInfo[this.selectedIndex].tBaseBomEntity,{...JSON.parse(JSON.stringify(this.productDetailAttrTemp))});
        },
		
		modalSure(e) {
            this.productDetailModalClick(e);
        },

        modalCancel(e) {
            // this.productDetailModalClick(e);
        },
		//将明细组件的返回值根据商品主类型放入对象的商品分录行
		productDetailModalClick(e){
            //商品详情点击确定跟取消的回调
            //写法固定
            if (this.productDetailList[this.selectedIndex].goodsMainType === 'attr_ranges_goods') {
                Object.assign(this.productDetailList[this.selectedIndex], {
                    tBaseBomEntity: e,
                    assistAttrs: null,
                    overEdit: true
                });
            } else {
                Object.assign(this.productDetailList[this.selectedIndex],{
                    assistAttrs: e,
                    tBaseBomEntity: null,
                    overEdit: true
                })
            }
        },
        //获取商品条形码
        getGoodsBarcodeValue(value,index){
            console.log(index,"另一个index！！！")

            let This = this;
            //当业务类型为受托加工时，条码为客户料，反之为公司料
            if(this.requisitionOrder.businessType == 'W_REQUISITION_04' || this.requisitionOrder.businessType == 'W_REQUISITION_05'){
                This.nature = 0;
            }else{
                This.nature = 1;
            }

            let params = {
                goodsBarcode: value,
				commodityId:This.productDetailListTemp.commodityId,
                goodsNo:This.productDetailListTemp.goodsCode,
                //是否在库 0、否 1、是
                isInStock: 1,
                //0、客户料；1、公司料
                nature: This.nature,
                warehouseArr: This.warehouseArr,
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
                        This.options = data.data.map(code=>$.extend(true, {},{code:code.goodsBarcode,name:code.goodsName,id:code.id}));
						// console.log('getGoodsBarcodeValue---productDetailListTemp.goodsEntities',This.productDetailListTemp.goodsEntities[index]);
                        This.$forceUpdate();
                        This.updateCodesUsed(value,index);
                    }
                },
                error: function () {
                    This.$Modal.warning({content:"服务器出错啦",title:"提示信息"})
                }
            })
        },
		getGoodsItem(params,index){
            let This = this;
            var data = {'id':params.id}
            $.ajax({
                type: "post",
                url: contextPath + '/goodsController/queryGoodsDetail',
                data: JSON.stringify(data),
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {

                    // console.log("明细",data.data)
                    if (data.code === "100100") {

                        let obj = $.extend(true, {}, data.data[0], {options:This.productDetailListTemp.goodsEntities[index].options});
                        This.productDetailListTemp.goodsEntities.splice(index,1,obj);
						// console.log('getGoodsItem---productDetailListTemp.goodsEntities',This.productDetailListTemp.goodsEntities[index]);
                        This.$forceUpdate();
                        This.updateCodesUsed();
                    }
                },
                error: function () {
                    This.$Modal.warning({content:"服务器出错啦",title:"提示信息"})
                }
            })
        },
		//获取计数单位组和计重单位组
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
                        let data =r.data;
                        data.map(item=>{
                            let keyStr = item.id;
                            let value = item.name;
                            This.unitMap[keyStr] =value;
                        })
                    } else {
                        This.$Modal.warning({content:"服务器异常,请联系技术人员！",title:"提示信息"})
                    }
                },
                error: function (err) {
                    This.$Modal.warning({content:"服务器异常,请联系技术人员！",title:"提示信息"})
                },
            });
        },

        //业务类型onchange事件，修改业务类型的同时也修改仓库
        businessTypeChange(value){
            let This = this;
            this.htHaveChange = true;
            console.log(333)
            if (This.isBusinessType){
                This.isBusinessType = false;
                This.businessTypeTemp = This.requisitionOrder.businessType;
                This.getWareHouseGroup();
                // console.log(13289111,value)
                return true;
            }
            This.$Modal.confirm({
                title: '提示信息',
                content: '修改业务类型会清空商品简述和商品明细列表的所有数据，是否确定修改？',
                onOk: () => {
                    This.businessTypeTemp = This.requisitionOrder.businessType;
                    This.getWareHouseGroup();
                    This.productDetailList = [];
                    This.productDetailListTemp.goodsEntities = [];
                    //切换到商品简述页签
                    This.tabVal = 'name1'
                },
                onCancel: () => {
                    This.requisitionOrder.businessType = This.businessTypeTemp;
                },
            })
        },

        //获取仓库组
        getWareHouseGroup(){
			if(!this.requisitionOrder.businessType){
				this.$Modal.info({content:"请选择业务类型",title:"提示信息"});
				return false;
			}

			if(this.requisitionOrder.businessType == 'W_REQUISITION_04' || this.requisitionOrder.businessType == 'W_REQUISITION_05'){
				data = {'type':4};
			}else{
				data = {'type':1};
			}
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/wareHouse/listByTypeAndOrganizationId',
                data:data,
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        // console.log("仓库组",data.data)
                        This.warehouseList = data.data;
                        This.warehouseArr = [];
                        for (let item of This.warehouseList){
                            This.warehouseArr.push(item.id)
                        }
                        //This.getRepertoryPositionGroup(1)
                    }
                },
                error: function () {
                    This.$Modal.warning({content:"服务器异常,请联系技术人员！",title:"提示信息"})
                }
            })
        },

        //获取库位组
        getRepertoryPositionGroup(groupId){
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/tbaserepertoryposition/listbygroup/' + groupId,
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        // console.log("库位组",data.data)
                        // console.log(This.reservoirPositionList,33443)
                        This.reservoirPositionList = [];
                        //This.$forceUpdate();
                        This.reservoirPositionList = data.data;
                    }
                },
                error: function () {
                    This.$Modal.warning({content:"服务器出错啦!",title:"提示信息"})
                }
            })
        },
        tabsClose(){

        },
		selectProductDetail(index) {
            this.selectedIndex = index;
        },
        selectBarCodeDetail(index) {
            this.selectedIndex1 = index;
        },
		//点击明细
        detailAction(index){
			this.selectedIndex = index;
			// console.log("detailAction(index)--selectedIndex",index);
            if (this.productDetailList[index].goodsMainType === 'attr_ranges_gold'){
                this.$Modal.info({content:"商品主类型为金料，不存在条码明细！",title:"提示信息"});
                return false;
            }
            //如果是关联源单则不需要判断
            if (!this.productDetailList[index].sourceNo) {
                if (!this.productDetailList[index].goodsCode) {
                    this.$Modal.info({content:"请先选择商品编码！",title:"提示信息"});
                    return;
                }
                if (!this.productDetailList[index].transferGoodsNum) {
                    this.$Modal.info({content:"请先输入数量！",title:"提示信息"});
                    return;
                }

            }
            if (!this.productDetailList[index].transferInWarehouse) {
                this.$Modal.info({content:"请先选择调入仓库！",title:"提示信息"});
                return;

            }
            this.tabVal = "name2";
            //清空

            var num = Number( this.productDetailList[index].transferGoodsNum);
			if (!num){
                return;
            }

            if (this.productDetailList[index].businessType){
			    if (this.productDetailList[index].goodsEntities){
                    num = this.productDetailList[index].goodsEntities.length;
                }
            }
			// console.log("detailAction11111---num",num);
            this.productDetailListTemp.goodsEntities = new Array(num).fill({
                options:[]
            });
			// console.log("detailAction---productDetailList",this.productDetailList[index]);
			/*var rowData = $.extend(true, {}, this.productDetailList[index]);*/
            var rowData = this.productDetailList[index]

            if(rowData &&rowData.goodsEntities){
                rowData.goodsEntities.forEach(p =>{
                    this.warehouseInfoList.forEach(item =>{
                        if(item.id === p.warehouseId){

                            p.warehouse = item.name;
                        }
                    })
                })
            }
			// console.log("detailAction---rowData",rowData);
            if(this.productDetailList[index].sourceType =='W_MATERIAL_USED' && !this.productDetailList[index].goodsEntities){
            	// console.log("detailAction 进入原料领用删空数组");
            	//delete this.productDetailList[index].goodsEntities;
				delete rowData.goodsEntities;
            }

			//判断增加减少
            let count;
            if(rowData.goodsEntities){
                count = num - rowData.goodsEntities.length
            }
            if(count>0){
                rowData.goodsEntities.concat(this.productDetailListTemp.goodsEntities);
            }else{
                let info = Math.abs(count)
                if(info>0){
                    for(var i = 0;i<info;i++){
                        rowData.goodsEntities.pop();
                    }
                }
            }
            // console.log(rowData,this.productDetailListTemp,333333)
			this.productDetailListTemp = $.extend(true, {}, this.productDetailListTemp, rowData);
			
			//获取商品条形码
            this.getGoodsBarcodeValue('');

            //this.productDetailListTemp = $.extend(true, {}, this.productDetailListTemp, this.productDetailList[index]);
            this.$nextTick(()=>{
                this.getSelect('table-responsive','goods-child');
            })
            // console.log(rowData,this.productDetailListTemp,4444)
        },

		//商品简述页签点击事件
        crolMark(tab){
			//this.productDetailListTemp=null;
            let This = this;
            this.tabVal = tab;
			// console.log("crolMark----this.productDetailListTemp.goodsEntities:",this.productDetailListTemp.goodsEntities);
            this.productDetailList[this.selectedIndex] = $.extend(true, {}, this.productDetailList[this.selectedIndex], {goodsEntities:this.productDetailListTemp.goodsEntities});
			// console.log("crolMark----productDetailList[this.selectedIndex]",this.productDetailList[this.selectedIndex]);
			
            //this.productDetailListTemp.goodsEntities.splice(0,this.productDetailListTemp.goodsEntities.length);
            // console.log("this.productDetailListTemp.goodsEntities",this.productDetailListTemp.goodsEntities);

            let $totalCost = 0;
            let $totalGoldWeight = 0;
            let $totalWeight = 0;

            this.productDetailList[this.selectedIndex].goodsEntities.forEach((item) =>{
				if (!isNaN(Number(item.purchaseCost))) {
					$totalCost += Number(item.purchaseCost);
				}

				if (!isNaN(Number(item.netGoldWeight))) {
					$totalGoldWeight += Number(item.netGoldWeight);
				}
				if(!isNaN(Number(item.totalWeight))) {
					$totalWeight+= Number(item.totalWeight);
				}
            })
            this.productDetailList[this.selectedIndex].totalCost = $totalCost;
            this.productDetailList[this.selectedIndex].goldWeight = $totalGoldWeight;
            this.productDetailList[this.selectedIndex].totalWeight = $totalWeight;
            this.productDetailListTemp.goodsEntities = [];
			
            // console.log("crolMark----productDetailList[selectedIndex]",this.productDetailList[this.selectedIndex]);
			this.productDetailListTemp.goodsEntities = [];
            this.$nextTick(()=>{
                this.getSelect('table-responsive','goods');
            })
        },
		//公共的传输数据
        commonTransferData(){
            for (let data of this.salesmanList){
                if (data.id === this.requisitionOrder.salesmanId) {
                    this.requisitionOrder.salesmanName = data.empName;
                    break;
                }
            }
            //当单据时间没有选择是，设置默认值
            if (!this.requisitionOrder.transferTime){
                this.requisitionOrder.transferTime = (new Date()).format("yyyy-MM-dd") || '';
            }

        },
        //商品简述的数量失去焦点监听事件
        getNumAction(index){
            //如果输入数量，则禁止输入重量，统计条码明细列表中的重量
            var num = Number(this.productDetailList[index].transferGoodsNum);
            // console.log(num,"数量改变",99009)
            if (num){
                this.showWeight = true;
            }else {
                this.showWeight = false;
            }
        },
        //新增
        add() {
            window.parent.activeEvent({
                name: "调拨单-新增",
                url: contextPath+'/warehouse/requisition/requisition-info.html',
                params: {data: 'Y',activeType: "handworkAdd"}
            });
        },
        //审核
        approval() {
			let This = this;
            // console.log("approval---documentStatus ",This.requisitionOrder.documentStatus)
            // console.log("approval---documentNo ",This.requisitionOrder.documentNo)

            if(This.requisitionOrder.documentStatus === 1 || !This.requisitionOrder.documentNo){
                This.$Modal.info({
                    title:"提示信息",
                    content: "请先提交单据!"
                });
                // console.log("approval---documentStatus ",This.requisitionOrder.documentStatus)
                return false;
            }
            This.modalType = 'approve';
            This.modalTrigger = !This.modalTrigger;
            // console.log(322277,This.requisitionOrder.documentStatus)
        },
        //驳回
        reject() {
			let This = this;
            if(This.requisitionOrder.documentStatus === 1 || !This.requisitionOrder.documentNo){
                This.$Modal.info({
                    title:"提示信息",
                    content: "请先提交单据!"
                });
                return false;
            }
            This.modalType = 'reject';
            This.modalTrigger = !This.modalTrigger;
        },
		approvalOrRejectCallBack(res){
            let This = this;

            if(res.result.code == '100100'){
                This.requisitionOrder.documentStatus = res.result.data;

                if(This.requisitionOrder.documentStatus == 1){
                    //驳回到原点，暂存
                    This.isStampShow = false;
                    This.requisitionOrder.examineVerifyName = '',
                    This.requisitionOrder.examineVerifyTime = '';
                    $(".is-submit-disabled").css({"pointer-events":"auto "}).css({"color": '#495060'})
                    //将打印置灰，只有审核完成后才能打印
                    $(".is-htPrint").css("pointer-events", "none").css({"color": "#bbbec4"})
                    $(".is-submit-disabled").css({"pointer-events":"auto "}).css({"color": "#666"})
                    if (This.productDetailList && This.productDetailList.length > 0 && This.productDetailList[0].sourceNo){
                        This.showBody = true;
                        This.isClick = true;
                        This.showProduct = true;
                    }else{
                        This.showAll = false;
                        This.showBody = false;
                        This.isClick = false;
                        This.showProduct = false;
                    }
                    This.showWarehouse=false;
                    This.isEdit('Y');
                    This.showAll = false;
                    This.showProductType = false;
                }else if(This.requisitionOrder.documentStatus == 2){
                    //待审核

                }else if(This.requisitionOrder.documentStatus == 3){
                    //审核中

                }else if(This.requisitionOrder.documentStatus == 4){
                    //审核完成
                    This.isStampShow = true;
                    This.isGoodsBarcodeShow = true;
                    This.requisitionOrder.examineVerifyName = layui.data('user').username,
                    This.requisitionOrder.examineVerifyTime = (new Date()).format("yyyy-MM-dd HH:mm:ss") || '';
                    $(".is-htPrint").css({"pointer-events":"auto "}).css({"color": '#495060'})
                }else if(This.requisitionOrder.documentStatus == 5){
                    //审核驳回
                    This.isStampShow = false;
                    This.requisitionOrder.examineVerifyName = '',
                    This.requisitionOrder.examineVerifyTime = '';
                }else {
                    This.$Modal.warning({
                        content: '审核异常!',
                        title:"提示信息"
                    });
                    return false;
                }
                //This.ajaxUpdateDocStatusById(This.requisitionOrder.id,docStatus);
            }
        },
		/*autoApproveOrReject(){
            let _this = this;
            $.ajax({
                url:contextPath + '/requisition/submitapproval?submitType=1',
                method:'post',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify({
                    receiptsId:_this.requisitionOrder.documentNo,
                    approvalResult:(_this.modalType == 'reject'? 1 : 0),
                }),
                success:function (res) {
                    if(res.code === '100100'){
                        _this.requisitionOrder.documentStatus = parseInt(res.data);
                        _this.getApprovalHistory(_this.requisitionOrder.documentNo);
                    }else {
                        _this.$Modal.warning({content:res.msg,title:"提示信息"});
                    }
                }
            });
        },*/

        autoSubmitOrReject(result) {
            let This = this;
            $.ajax({
                url: contextPath + '/requisition/submitapproval?submitType=1',
                method: 'post',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify({
                    receiptsId: This.requisitionOrder.documentNo,
                    approvalResult: (This.modalType == 'reject' ? 1 : 0),
                }),
                success: function (res) {
                    if (res.code === '100100') {
                        if (This.requisitionOrder.documentStatus == 1) {
                            //驳回到原点，暂存
                            This.isStampShow = false;
                            This.requisitionOrder.examineVerifyName = '',
                                This.requisitionOrder.examineVerifyTime = '';
                            $(".is-submit-disabled").css({"pointer-events":"auto "}).css({"color": '#495060'})
                            //将打印置灰，只有审核完成后才能打印
                            $(".is-htPrint").css("pointer-events", "none").css({"color": "#bbbec4"})
                            $(".is-submit-disabled").css({"pointer-events":"auto "}).css({"color": "#666"})
                            if (This.productDetailList && This.productDetailList.length > 0 && This.productDetailList[0].sourceNo){
                                This.showBody = true;
                                This.isClick = true;
                                This.showProduct = true;
                            }else{
                                This.showAll = false;
                                This.showBody = false;
                                This.isClick = false;
                                This.showProduct = false;
                            }
                            This.showWarehouse=false;
                            This.isEdit('Y');
                            This.showAll = false;
                            This.showProductType = false;

                        } else if (This.requisitionOrder.documentStatus == 4) {
                            //审核完成
                           
                        }
                    } else {
                        This.$Modal.warning({content: res.msg, title: "提示信息"});
                    }
                }
            });
        },


        ajaxUpdateDocStatusById(id,docStatus){
            let This = this;

            $.ajax({
                url:contextPath+ '/requisition/updateDocumentStatusByid',
                method:'POST',
                dataType:'json',
                contentType: "application/json;charset=utf-8",
                data:JSON.stringify({id:id,documentStatus:docStatus}),
                success:function (data) {
                    if(data.code == '100100'){
                        This.requisitionOrder.documentStatus = docStatus;
                    }
                }
            });
        },
		// 附件是编辑还是查看 传入Y表示编辑，传入N表示查看,页面初始化的时候就需要调用这个方法
        isEdit:function (isEdit) {
            eventHub.$emit('isEdit', isEdit);
        },
        // 保存附件 保存的时候调用
        saveAccess: function (id,type) {
            eventHub.$emit('saveFile', id,type);
        },
        // 查找附件 查看的时候调用
        getAccess: function (id,type) {
            eventHub.$emit('queryFile', id,type);
        },
        //退出
        cancel() {

        },
        //审批意见点击确定
        getApproveInfo() {

        },
        //驳回点击确定
        getRejectInfo() {

        },
		 //处理明细数据传给后台
        handlerDataToPost: function () {
            let This = this;
            let obj = {
                id:"",
				commodityId:"",
				pictureUrl:"",
				goodsCode:"",
                goodsName:"",
				goodsNorm:"",//规格
				countingUnit:"",//计数单位
				countingUnitId: "",
				transferGoodsNum:"",
				weightUnit:"",//计重单位
				weightUnitId: "",
				totalCost:"",
				totalWeight:"",
                goldWeight:'',
                transferOutWarehouse:'',
                transferOutPositionId:'',
                transferInWarehouse:'',
                transferInPositionId:'', 
                pricingUnit:'',
				pricingUnitId:'',
				goodsMainType:'',
				goodsLineNo:'',
				styleCategoryId:'',
				sourceNo:'',
				sourceType:'',
				certificateType:'',
                styleName:'',
                styleCustomCode: '',
                detailMark:'',

                stonesParts: [],
                materialParts: [],
                partParts: [],
                goldParts: [],
            }
            let data = This.requisitionOrder;
            // console.log("处理前的数据结构:",data);
            data.goodList = [JSON.parse(JSON.stringify(obj))];
            // console.log('handlerDataToPost--productDetailList',This.productDetailList)
            //商品明细数据处理
            let list= htHandlerProductDetail(This.productDetailList, data, obj);
            // console.log("经过处理后的数据结构为：",list);
            This.productDetailList.map((item, index)=>{
                //商品分录行赋值
                if(!data.goodList[index]){
                    data.goodList[index] = {};
                }
                Object.assign(data.goodList[index], {				
				id:item.id,
				pictureUrl:item.pictureUrl,
				goodsCode:item.goodsCode,
                commodityId:item.commodityId, 
                goodsName:item.goodsName,
				goodsNorm:item.goodsNorm,//规格
				countingUnit:item.countingUnit,//计数单位
				countingUnitId:item.countingUnitId,//计数单位
				transferGoodsNum:item.transferGoodsNum,
				weightUnit:item.weightUnit,//计重单位
				weightUnitId: item.weightUnitId,
				totalWeight:item.totalWeight,
				totalCost:item.totalCost,
                goldWeight:item.goldWeight,
                transferOutWarehouse:item.transferOutWarehouse,
                transferOutPositionId:item.transferOutPositionId,
                transferInWarehouse:item.transferInWarehouse,
                transferInPositionId:item.transferInPositionId, 
				pricingUnitId:item.pricingUnitId,
				pricingUnit:item.priceMethod,
				goodsMainType:item.goodsMainType,
				goodsEntities: item.goodsEntities,
				goodsLineNo:item.goodsLineNo,
				styleCategoryId:item.styleCategoryId,
                styleName:item.styleName,
                styleCustomCode: item.styleCustomCode,
                detailMark:item.detailMark,
				sourceNo:item.sourceNo,
				sourceType:item.sourceType,
				certificateType:item.certificateType,
				organizationId:This.requisitionOrder.organizationId
                })
            });
            return data;
        },
        //验证表格内容是否为空
        tableValidate(){
            let This = this;
            let validate = {
				commodityId:{
					name: '商品编码',
					type: 'string',
				},
                transferGoodsNum:{
                    name: '数量',
                    type: 'number',
					empty:true
                },
                totalWeight:{
                    name: '总重',
                    type: 'number',
                    floor:3
                },
                transferInWarehouse:{
                    name: '调入仓库',
                    type: 'string'
                }
            };
            return htValidateRow(this.productDetailList, validate);
        },
        //表格内输入小数
        clearNoNumber(item,type,floor){
            return htInputNumber(item,type,floor)
        },
		save(params,name){
            this.tabValid = false;
            let This = this;
            let isFormPass = '';
            if (params === 'submit'){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        isFormPass = true
                    } else {
                        isFormPass = false
                    }
                })
            }

            if (This.requisitionOrder.documentStatus !== 1){
                This.$Modal.info({content:"单据状态不为暂存不能进行此操作！",title:"提示信息"});
                return false;
            }

            //切换页签将商品明细数据添加到商品简述中
            if (This.tabVal === 'name2') {
                This.crolMark('name1');
            }


            if (params === 'submit' && !isFormPass ||  This.tableValidate()) {
                return false;
            }

			//校验简述分录行的数量和条码的长度是否一致
            if (This.productDetailList && This.productDetailList.length > 0) {
				for (let i = 0; i < This.productDetailList.length; i++) {
					//判断调拨数量是否大于合格数量
					if(This.productDetailList[i].sourceType == 'S_CUST_ORDER' && This.productDetailList[i].goodsEntities.length > This.productDetailList[i].transferPassNum){
							This.$Modal.info({
                                title:"提示信息",
							content: "请删除" + (Number(This.productDetailList[i].goodsEntities.length) - Number(This.allTransferNum)) + '条检验不合格条码行',
							})
								return false;
                    }else if(This.productDetailList[i].sourceType == 'S_CUST_ORDER' && This.productDetailList[i].goodsEntities.length == This.productDetailList[i].transferPassNum){
                            This.productDetailList[i].transferGoodsNum = This.productDetailList[i].transferPassNum;
                            This.isDelClick = true;
                    }
					if (This.productDetailList[i].goodsMainType !== 'attr_ranges_gold') {
						if (!This.productDetailList[i].transferGoodsNum || !This.productDetailList[i].goodsEntities){
							This.$Modal.info({
                                title:"提示信息",
								content: "第" + (i + 1) + "行商品简述列表里的数量与商品明细列表的长度不一致，请补全数据!",
							})
							return false;
						}
						if (This.productDetailList[i].transferGoodsNum && This.productDetailList[i].goodsEntities && This.productDetailList[i].transferGoodsNum != This.productDetailList[i].goodsEntities.length) {
							This.$Modal.info({
                                title:"提示信息",
								content: "第" + (i + 1) + "行商品简述列表里的数量与商品明细列表的长度不一致，请补全数据!",
							})
							return false;
						}
					}else{
						 if (!this.productDetailList[i].transferOutWarehouse) {
							This.$Modal.info({
                                title:"提示信息",
								content: "第" + (i + 1) + "行商品简述列表里请先选择调出仓库！",
							})
							return false;
						}
					}
				}
				
            }else if (params === 'submit'){
                This.$Modal.info({
                    title:"提示信息",
                    content: "请添加商品简述列表数据!",
                })
                return false;
            }

            for (let x = 0; x < This.productDetailList.length; x++){
                if (This.productDetailList[x].goodsMainType !== 'attr_ranges_gold') {
                    for (let y = 0; y < This.productDetailList[x].goodsEntities.length; y++) {
                        if (!This.productDetailList[x].goodsEntities[y]['goodsBarcode']) {
                            This.$Modal.info({
                                title:"提示信息",
                                content: "第" + (x + 1) + "行商品简述列表里的商品明细列表的第" + (y + 1) + "行内容为空!",
                            })
                            return false;
                        }
                    }
                }else {
                    if(!This.productDetailList[x].sourceNo){
                        if(This.productDetailList[x].detailMark !==2 && !This.productDetailList[x].assistAttrs){
                            This.$Modal.info({
                                content: '第'+(x+1)+'行商品明细未选择，请先选择商品明细！',
                                title:"提示信息"
                            });
                            return false;
                        }
                    }
                }
            }

            let data = This.handlerDataToPost();

            if(params == "save"){
                This.requisitionOrder.documentStatus = 1;
            }else if(params == "submit"){
                This.requisitionOrder.documentStatus = 2;
                This.isGoodsBarcodeShow = true;
                This.showMainType = true;
            }

            This.commonTransferData();


            if(!data.goodList[0].commodityId){
                data.goodList = [];
                This.productDetailList = [];
            }

			window.top.home.loading('show');
            $.ajax({
                type: "post",
                async:false,
                url: contextPath+'/requisition/save',
                contentType: "application/json;charset=utf-8",
                data:JSON.stringify(data),
                dataType: "json",
                success: function (data) {
                    This.htHaveChange = false;
					let content = params === "save" ? "保存" : "提交"
                    if (data.code === "100100") {
                        This.$Modal.success({
                            title:"提示信息",
                            content: content + "成功",
                        })

                        This.requisitionOrder = data.data;
                        This.productDetailList = data.data.goodList;

                        //设置组织name
                        This.getOrganName(This.requisitionOrder.organizationId);
                        if (params === 'save'){

                        }else if (params === 'submit'){
                            $(".is-submit-disabled").css("pointer-events", "none").css({"color": "#bbbec4"})
                            This.BannedClick();
							This.showWarehouse=true;
                            This.isEdit('N');
                        }
                        This.saveAccess(This.requisitionOrder.documentNo,'W_REQUISITION');
						window.top.home.loading('hide');
                        return false;
                    }
					This.requisitionOrder.documentStatus = 1;
                    window.top.home.loading('hide');
                    This.$Modal.warning({
                        title:"提示信息",
                        content: content + "失败",
                    })
                },
				error: function () {
                    window.top.home.loading('hide');
                    This.requisitionOrder.documentStatus = 1;
                    This.$Modal.warning({content:"服务器出错啦",title:"提示信息"})
                }
            })
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
		//禁止点击
        BannedClick(){
            let This = this;
            This.showBody = true;
            This.showProduct = true;
            This.showWeight = true;
            This.isClick = true;
            This.showAll = true;
            This.isReadonly = true;
        },
		//允许点击
        allowClick(){
            let This = this;
            This.showBody = false;
            This.showProduct = false;
            This.showWeight = false;
            This.showAll = false;
        },
		// 点击退出(退出页面)
        exit(close){
            if(close === true){
                window.parent.closeCurrentTab({openTime:this.openTime,exit: true,});
                return;
            }

            if(this.handlerClose()){
                window.parent.closeCurrentTab({openTime:this.openTime,exit: true,});
            }
        },
		//源单回显
        sourcrEcho(params){
            // console.log("sourcrEcho--params",params);
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/requisition/querySourceInfo',
                data:JSON.stringify(params),
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        data.data[0].id=null;
                        // console.log("sourcrEcho---success--data",data.data)
                        This.requisitionOrder = data.data[0];
						if (This.requisitionOrder.businessType === "S_CUST_ORDER_01"){
                            This.requisitionOrder.businessType = 'W_REQUISITION_01';
                        }
                        else if (This.requisitionOrder.businessType === "S_CUST_ORDER_02"){
                            This.requisitionOrder.businessType = 'W_CMATERIAL_OUT_01';
                        }
						else if (This.requisitionOrder.businessType === "W_MATERIAL_USED_01"){
                            This.requisitionOrder.businessType = 'W_REQUISITION_02';
                        }
                        else if (This.requisitionOrder.businessType === "W_MATERIAL_USED_02"){
                            This.requisitionOrder.businessType = 'W_REQUISITION_06';
                        }
						else if (This.requisitionOrder.businessType === "W_MATERIAL_USED_03"){
                            This.requisitionOrder.businessType = 'W_REQUISITION_04';
                        }
                        else if (This.requisitionOrder.businessType === "W_MATERIAL_USED_04"){
                            This.requisitionOrder.businessType = 'W_REQUISITION_05';
                        }

                        //商品类型
                        This.goodsValue = This.splitCustemCode(This.requisitionOrder.goodsTypePath,0);
                        This.productDetailList = data.data;
                        This.showBody = true;
                        This.showProductType = true;
						This.showProduct = true;
						if(This.requisitionOrder.goodsMainType == 'attr_ranges_gold'){
                            This.showMainType = false;
                        }

                        This.isClick = true;
						This.showWeight = true;
						This.isGoodsBarcodeShow = true;
                        This.getOrgan();
                        This.requisitionOrder.documentStatus = 1;
                        This.requisitionOrder.documentNo = '';
						if(This.requisitionOrder.sourceType == "W_MATERIAL_USED"){
							This.isGoodsBarcodeShow=false;
						}
						// console.log("sourcrEcho--params[0].allTransferNum",params[0].allTransferNum);
						This.allTransferNum = params[0].allTransferNum;
						// console.log("sourcrEcho--allTransferNum",This.allTransferNum);
						This.getWareHouseGroup();
				

						if(This.requisitionOrder.sourceType =='S_CUST_ORDER'){
                            This.isDelClick=false;
							let $totalCost = 0;
							let $totalGoldWeight = 0;
							let $totalWeight = 0;
							for ( var i = 0; i <This.productDetailList.length; i++) {
                                // console.log("sourcrEcho--params--遍历", This.productDetailList[i]);
                                if (This.productDetailList[i].goodsEntities && This.productDetailList[i].goodsEntities.length > 0) {
                                    This.productDetailList[i].goodsEntities.forEach((item) => {
                                        $totalCost += Number(item.purchaseCost);
                                        $totalGoldWeight += Number(item.goldWeight);
                                        $totalWeight += Number(item.totalWeight);
                                    })
                                    This.productDetailList[i].totalCost = $totalCost;
                                    This.productDetailList[i].goldWeight = $totalGoldWeight;
                                    This.productDetailList[i].totalWeight = $totalWeight;
                                }
                            }
						}
						This.requisitionOrder.transferTime = new Date();
                    }
                    This.isEdit('Y');
                },
                error: function () {
                    This.$Modal.warning({content:"服务器出错啦",title:"提示信息"})
                }
            })
        },
		  //列表回显
        listEcho(params){
            // console.log("listEcho--params",params);
            let This = this;
            let data = {documentNo:params}
			// console.log("listEcho--data",data);
            $.ajax({
                type: "post",
                url: contextPath+'/requisition/queryDetail',
                data:JSON.stringify(data),
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        console.log("listEcho--success----data",data.data)
                        This.requisitionOrder = data.data.requisitionEntity;
                        //商品类型
                        This.goodsValue = This.splitCustemCode(This.requisitionOrder.goodsTypePath,0);							
                        This.productDetailList = data.data.requisitionGoodsList;
                        if(This.productDetailList){
                            This.productDetailList
                                .filter(p => p.goodsMainType === 'attr_ranges_gold')
                                .forEach(i => i.transferGoodsNum = '');
                        }

                        if (This.requisitionOrder.documentStatus !== 1){
                            This.BannedClick();
                            This.showWarehouse = true;
                            This.isGoodsBarcodeShow = true;
                        }else{
                            This.isGoodsBarcodeShow = false;
                            This.showWarehouse = false;
                        }
                        if (This.productDetailList && This.productDetailList.length > 0 && This.productDetailList[0].sourceNo){
                            This.showBody = true;
                            This.isClick = true;
                            This.showProduct = true;
							This.showWeight = true;
                        }
                        if(This.requisitionOrder.documentStatus === 4){
                            This.isStampShow = true;
                            $(".is-htPrint").css({"pointer-events":"auto "}).css({"color": '#495060'})
                        }else{
                            This.isStampShow = false;
                            //将打印置灰，只有审核完成后才能打印
                            $(".is-htPrint").css("pointer-events", "none").css({"color": "#bbbec4"})
                        }
                        This.isEdit('Y');
                        if (This.params.activeType === 'listQuery') {
                            $(".is-disabled").css("pointer-events", "none").css({"color": "#bbbec4"})
                            $(".is-submit-disabled").css("pointer-events", "none").css({"color": "#bbbec4"})
							This.BannedClick();
                            This.isEdit('N');
                        }
						if (This.requisitionOrder.documentStatus !== 1) {
                            $(".is-submit-disabled").css("pointer-events", "none").css({"color": "#bbbec4"})
                            This.BannedClick();
                            This.isEdit('N');
                        }
                        This.getAccess(This.requisitionOrder.documentNo,'W_REQUISITION')
						This.getWareHouseGroup();
                        This.isBusinessType = false;
                        This.businessTypeTemp = This.requisitionOrder.businessType;
                    }
                    This.$forceUpdate();
                },
                error: function () {
                    This.$Modal.warning({content:"服务器出错啦",title:"提示信息"})
                }
            })
        },
	    //获取商品类型路径
        splitCustemCode(value,pop){
            let This = this;
            let pos = [];
            for(let i = 0 ;i < value.length; i++){
                let index = value.indexOf(".",pop);
                if(index === -1){
                    break;
                }
                pos.push(index);
                pop = index +1;
            }
            for(let j = 1 ; j < pos.length; j++){
                This.goodsValue.push(value.substring(0,pos[j])+ ".");
            }
            return This.goodsValue;
        },
        //根据组织id获取组织name
        getOrganName(id) {
            window.top.home.loading('show');
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath + '/logisticsdispatching/queryOrgByOrganId',
                dataType: "json",
                data:{orgId:id},
                success: function (data) {
                    window.top.home.loading('hide');
                    if (data.code === "100100") {
                        This.$set(This.requisitionOrder,'organizationName',data.data.orgName);
                    }
                    if ('-1' === data.code){
                        vm.$Modal.warning({
                            title: '提示信息',
                            content: '服务器出错啦!',
                        });
                        return;
                    }
                    if (data.code === '100101') {
                        vm.$Modal.warning({
                            title: '提示信息',
                            content: data.msg,
                        });
                        return
                    }
                },
                error: function () {
                    window.top.home.loading('hide');
                    This.$Modal.warning({content:"服务器出错啦",title:"提示信息"})
                }
            })
        },
        //获取组织id和组织name
        getOrgan(){
            /*this.requisitionOrder.organizationId = window.parent.userInfo.organId;
            this.requisitionOrder.organizationName = window.parent.userInfo.orgName;*/
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/entrustOut/getOrgName',
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        This.requisitionOrder.organizationName = data.data.name;
                        This.requisitionOrder.organizationId = data.data.id;
                    }
                },
                error: function () {
                    This.$Modal.warning({content:"服务器出错啦",title:"提示信息"})
                }
            })
        },
        list(){
            window.parent.activeEvent({
                name: "调拨单-列表",
                url: contextPath+'/warehouse/requisition/requisition-list.html',
                params: {data: 'Y',activeType: "listQuery"}
            });
        },
        getWareHouse(){
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/wareHouse/queryAll',
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        This.warehouseInfoList = data.data.map(p=>$.extend(true,{},{
                            id:p.id,
                            name:p.name
                        }))
                    }
                },
                error: function () {
                    This.$Modal.warning({content:"服务器出错啦",title:"提示信息"})
                }
            })
        },
        //仓库选择事件触发
        onSelectedDrug(index,transferOutWarehouse,transferInWarehouse){
            let This = this;
            this.htHaveChange = true;
            console.log(333)
            if (transferOutWarehouse == transferInWarehouse && transferOutWarehouse != undefined){
                This.$Modal.info({
                    title: '提示信息',
                    content: '调出仓库和调入仓库不能一样！'
                });
                This.$nextTick(() => {
                    This.productDetailList[index].transferOutWarehouse = '';
                    This.productDetailList[index].transferInWarehouse = '';
                    This.$refs['transferOutWarehouse'+index][0].reset();
                    This.$refs['transferInWarehouse'+index][0].reset();
                })

            }

        },
        //弃用
        updateScannedCodeUsed(){
            let _this = this;
            let scannedCode = {};
            let codesUsed = _this.codesUsed;
            let scannedCodeList = _this.barCodeList;
            //获取 扫描过的条码
            if($.isArray(scannedCodeList) && scannedCodeList.length > 0){
                $.each(scannedCodeList, function(idx, ele){
                    scannedCode[Number(ele.goodsBarcode)] = ''; // 空串即可，只使用 key 占位
                });
            }
            // 汇总当前页内已被选中的条形码（在原来的基础上追加 扫描过的条码）
            codesUsed = $.extend(true, {},scannedCode);
            _this.codesUsed = codesUsed;
        },
        updateCodesUsed(value, index){
            console.log(index,"我是index！！！！")
            let vm = this;
            let codesUsed = {};
            let codesUsedMain = {};
            let codesUsedDetail = {};
            let goodsEntities = vm.productDetailListTemp.goodsEntities || [];

            // 如果 ht-select 内的条形码有改动（即：原来输入的条码长度有改变），清空对应下标的原条形码
            if (typeof value != 'undefined' && typeof index != 'undefined') {
                console.log(String(value).length,"我是length！")
                if (String(value).length != 8) {
                    goodsEntities[index].goodsBarcode = '';
                }
            }

            // 获取主列表内占用的条形码
            $.each(vm.productDetailList, function(idx, ele){
                console.log(idx, ele,"这是idx和ele！！！")
                if($.isArray(ele.goodsEntities) && ele.goodsEntities.length > 0){
                    $.each(ele.goodsEntities, function(i, e){
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



            // 汇总当前页内已被选中的条形码（在所有选条形码的 ht-select 的下拉选项中排除）
            codesUsed = $.extend(true, {}, codesUsedMain, codesUsedDetail);

            vm.codesUsed = codesUsed;
            console.log(vm.productDetailList,"我是列表！！！！")
        },

        closeModal(type){
            if(type === 'yes'){//提交数据
                this.save('save','formValidate');
                this.exit(true);
            }else if(type === 'no'){//关闭页面
                this.exit(true);
            }
        },
        handlerClose(){
            if((!this.requisitionOrder.documentStatus || this.requisitionOrder.documentStatus == 1) && (this.htHaveChange || accessVm.htHaveChange)){
                this.$nextTick(()=>{
                    this.$refs.closeModalRef.showCloseModal();
                });
                return false;
            }

            return true;
        },
    },
	created() {
		this.loadProductType();
		this.initUnit();
		this.getSalesman();
		this.getWareHouse();
        this.params = window.parent.params.params;
		this.openTime = window.parent.params.openTime;
        this.requisitionOrder.transferTime = new Date();
        // console.log("params",this.params)
        if(this.params.activeType === 'handworkAdd'){
            //手工新增
            this.isEdit('Y');
        }else if (this.params.activeType === 'sourceAdd'){
            //关联源单新增
			this.sourceType = this.params.documentNoArr.sourceType
            this.sourcrEcho(this.params.documentNoArr);
        }else if (this.params.activeType === 'listUpdate'){
            //修改
            this.listEcho(this.params.documentNo);
        }else if (this.params.activeType === 'listQuery'){
            this.listEcho(this.params.documentNo);
			this.showWarehouse=true;
        }
        window.handlerClose = this.handlerClose;
	},
	mounted() {
		this.getOrgan();
        this.getSelect('table-responsive','goods');
        $(".is-htPrint").css("pointer-events", "none").css({"color": "#bbbec4"})
    }
})