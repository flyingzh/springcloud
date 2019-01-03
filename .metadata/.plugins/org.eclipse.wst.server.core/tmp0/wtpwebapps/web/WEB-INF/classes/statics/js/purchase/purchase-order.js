var purchaseVm = new Vue({
    el: '#purchaseOrder',
    data() {
        return {
            //保存，提交，审核，驳回，新增行，删除行按钮禁用启用
            isSearchHide: true, //搜索栏
            isTabulationHide: true, // 列表
            isSaveDisable:false,
            isSubmitDisable:false,
            isApproveDisable:false,
            isRejectDisable:false,
            isAddRowDisable:false,
            isDelRowDisable:false,
            productDetailModal: {
                dataSourceType: false, //是否来自上游；
                dataSource: null,
                showModal: false,
                ids: {
                    goodsId: '',
                    commodityId: '',
                    documentType: 'P_ORDER'
                }
            },
            selectedIndex: 0,//明细信息选中行高亮
            productDetailList: [],
            //附件
            boeType:'P_ORDER',
            //保存选中行的下标
            selectedRowIndex:'',
            needReload :false,
            //业务类型
            businessTypeList:[
                {name:'标准采购',value:'P_ORDER_01'},
                {name:'受托加工采购',value:'P_ORDER_02'}
            ],
            param:{},
            //商品类型
            // typeValue:'',
            isHint:true,
            //控制供应商弹窗显示隐藏
            showSupplierModal:false,
            //判断数据来自列表还是新增
            isFromList: false,
            //原数据
            OriginData:[],
            unitMap: {},//单位
            categoryType:[],
            //控制商品属性弹窗
            showProductProperty:false,
            commodityList:[],
            //页面数据绑定
            purchase:{
                id:'',
                dataSources:1,//数据来源(手动新增为1)
                orderStatus:'',//单据状态
                //基本信息-----------
                businessTypeId:'',//业务类型
                orderNo:'',
                purchaseDate:'',
                goodsTypeName:'',//商品类型
                goodsGroupPath:'',//商品类型路径
                organizationId:'',
                salesmanName:'',
                salesmanId:'',
                supplierId:'',//供应商ID
                // supplierCode:'',//供应商编码
                supplierName:'',//供货方名称
                defaultContact:'',//供货方联系人
                phone:'',//手机
                concreteAddress:'',//地址
                commodityId:'',//商品ID
                //其他----------
                createName:'',
                createTime:'',
                updateName:'',
                updateTime:'',
                auditorId: '',
                auditor:'',
                auditTime:'',
                // 采购数量，采购重量合计
                purchaseCount:'',
                purchaseWeight:'',
                //明细信息----------
                goodList:[],
                delGoodIds:[]
            },
            //上层表单校验
            purchaseValidate:{
                businessTypeId:[{required: true}],//业务类型
                goodsTypePath:[{required: true}],//商品类型
            },
            // addBody:{
            //     orderNo:''
            // },
            //    审批相关
            modalTrigger: false,
            modalType: '',
            //审批进度条
            steplist: [],
            approvalTableData:[],
            //当前组织下所有的员工
            employees:[],
            options:{
                disabledDate(date){
                    return date && date.valueOf() < purchaseVm.purchase.purchaseDate - 57600000;
                }
            }
        }
    },
    methods: {
        //点击退出
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
			if((!this.purchase.orderStatus || this.purchase.orderStatus == 1) && (this.htHaveChange || accessVm.htHaveChange)){
				this.$nextTick(()=>{
					this.$refs.closeModalRef.showCloseModal();
				});
				return false;
			}
			return true;
		},
		closeModal(type){
			if(type === 'yes'){//保存数据
				this.save('save');
				this.exit(true)//保存后直接退出
			}else if(type === 'no'){//关闭页面
				this.exit(true);
			}
		},
        htTestChange(){
            this.htHaveChange = true;
        },

        isHintShow(status){
            if( status && this.typeValue && this.isHint && this.purchase.goodList && this.purchase.goodList.length >0) {
                this.$Modal.info({
                    title:'提示信息',
                    content:'温馨提示：改变商品类型将删除所有商品信息!',
                    onOk:()=>{
                         this.isHint = false;
                    }
                 })
            }
        },
        changeProductType(value, selectedData) {
            // console.log(value,selectedData);
            if(value == this.typeValue){
                return false;
            }
            //清空商品分录行
            if(this.purchase.id){
                if(!this.purchase.delGoodIds){
                    this.purchase.delGoodIds =[];
                }
                this.purchase.goodList.map(item=>{
                    if(item.goodsId){
                    this.purchase.delGoodIds.push(item.goodsId);
                }
            })
            }
            this.purchase.goodList=[];
            this.productDetailList=this.purchase.goodList;
            this.purchase.goodsTypeName = selectedData[selectedData.length-1].label;
            this.purchase.goodsGroupPath = selectedData[selectedData.length-1].value;
            //更改分录行默认下拉列表
            // this.getCommodityList();

            this.htTestChange();
        },
        // getCommodityList(){
        //     console.log('默认商品明细数据');
        //     let This = this;
        //     let params = {
        //         categoryCustomCode: This.purchase.goodsGroupPath,
        //         field: '',
        //         limit: ''
        //     };
        //     $.ajax({
        //         type: "post",
        //         async:false,
        //         url: contextPath + '/tbasecommodity/findByType',
        //         data: params,
        //         dataType: "json",
        //         success: function (data) {
        //             if(data.code != "100100"){
        //                 this.$Modal.info({
        //                     content:data.msg,
        //                 })
        //                 This.commodityList =[];
        //                 return ;
        //             }
        //             This.commodityList = data.data;
        //         },
        //         error: function () {
        //             this.$Modal.info({
        //                 content:"网络异常,请联系技术人员！",
        //             })
        //         }
        //     })
        // },
        isEdit:function (isEdit, on) {
            eventHub.$emit('isEdit', isEdit);
        },
        // 保存附件 保存的时候调用
        saveAccess: function (id,type, on) {
            eventHub.$emit('saveFile', id,type);
        },
        // 查找附件 查看的时候调用
        getAccess: function (id,type, on) {
            eventHub.$emit('queryFile', id,type);
        },
        //审核或驳回组件返回数据回调函数
        approvalOrRejectCallBack(res) {
            if (res.result.code == '100100') {
                let data = res.result.data;
                this.purchase.orderStatus = data.orderStatus;
                if(this.purchase.orderStatus === 4){
                    this.purchase.auditor = data.auditor;
                    this.purchase.auditorId = data.auditorId;
                    this.purchase.auditTime = data.auditTime;
                }
                if(this.purchase.orderStatus === 1){//驳回到暂存
                    this.isAddRowDisable = false;
                    this.isDelRowDisable = false;
                    this.isSaveDisable = false;
                    this.isSubmitDisable = false;
                    if(this.purchase.dataSources === 2){
                        this.isFromList = true;
                    }else{
                        this.isFromList = false;
                    }
                }
            }
        },
        // 初始化商品单位
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
                        let data =r.data;
                        data.map(item=>{
                            let keyStr = item.id;
                            let value = item.name;
                            _this.unitMap[keyStr] =value;
                        })
                        // console.log(_this.unitMap);

                    } else {
                        _this.$Modal.info({
                            title:'提示信息',
                            content:'服务器异常,请联系技术人员！'
                        })
                    }
                },
                error: function (err) {
                    _this.$Modal.info({
                        title:'提示信息',
                        content:'网络异常,请联系技术人员！'
                    })
                },
            });
        },
        //根据商品编码
        getSelectedItem(data, index) {//获取选中的那条数据
            let This = this;
            let res = data.data;
            //转换重量, 数量单位,计价单位
            // res.countUnitId = This.unitMap[res.countUnitId];
            // res.weightUnitId = This.unitMap[res.weightUnitId];
            //res.pricingType = This.unitMap[res.pricingType];
            // console.log(res);
            let newValue = {};
            Object.assign(newValue, {
                purchaseType:This.purchase.goodList[index].purchaseType,
                goodsCode: res.code,
                goodsName: res.name,
                commodityId: res.id,
                pictureUrl: res.frontPic && res.frontPic.fdUrl,
                goodsType: res.categoryName,
                goodsTypePath: res.categoryCustomCode,
                custStyleCode: res.styleCustomCode,
                styleName: res.styleName,
                styleCategoryId: res.styleCategoryId,
                goodsMainType: res.mainType,
                goodsSpecifications: res.specification,//规格
                countingUnitId:res.countUnitId,//计数单位id
                weightUnitId:res.weightUnitId,//计重单位id
                detailMark:res.detailMark,
                digitUnit: This.unitMap[res.countUnitId],//计数单位
                weightUnit: This.unitMap[res.weightUnitId],//计重单位
                chargeUnit: res.pricingType, //计价单位
                //pricingMethod: res.pricingType
            });
            if(newValue.detailMark ==2){//不存在辅助属性
                let myAttr = {
                    commodityId: newValue.commodityId,
                    goodsCode: newValue.goodsNo,
                    name: newValue.name,
                    partAttrs: []
                };
                Object.assign(newValue, {
                    stonesParts: [],
                    goldParts: [],
                    partParts: [],
                    materialParts: [myAttr]
                })

            }
            if(This.productDetailList[This.selectedRowIndex].goodsId){
                if(!This.purchase.delGoodIds){
                    This.purchase.delGoodIds = [];
                }
                This.purchase.delGoodIds.push(This.productDetailList[This.selectedRowIndex].goodsId);
            }
            This.$set(This.purchase.goodList,index,newValue);

            if (res.mainType === 'attr_ranges_gold') {
                This.purchase.goodList[index].goldColor = res.certificateType;
            }
            This.$forceUpdate();
        },
        // getInputValue(value, index) {//获取商品编码输入框输入的值
        //     let This = this;
        //     console.log(value,index,This.purchase.goodsGroupPath);
        //     let params = {
        //         categoryCustomCode: This.purchase.goodsGroupPath,
        //         field: value, //value, A11  AABc009
        //         limit: ''
        //     };
        //     $.ajax({
        //         type: "post",
        //         url: contextPath + '/tbasecommodity/findByType',
        //         data: params,
        //         dataType: "json",
        //         success: function (data) {
        //             Object.assign(This.purchase.goodList[index], {options: data.data});
        //             This.$forceUpdate();
        //         },
        //         error: function () {
        //             This.$Modal.info({
        //                 content:'服务器出错啦'
        //             })
        //         }
        //     })
        // },
        getProductType() {
            let that = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecommoditycategory/listByAll?parentId=0',
                dataType: "json",
                success: function (data) {
                    that.productTypeList = that.initGoodCategory(data.data.cateLists)
                },
                error: function () {
                    that.$Modal.info({
                        title:'提示信息',
                        content:'服务器出错啦'
                    })
                }
            })
        },
        closeSupplier(id,scode,fname){
            // console.log(id,scode,fname);
            this.purchase.supplierId = id;
            // this.purchase.supplierName = fname;
            this.getSupplierInfo(id);
        },
        //查看、修改状态获取明细信息列表数据
        queryByCode(orderNo){
            let This = this;
            $.ajax({
                type: 'post',
                url:contextPath + '/tpurchaseorder/findByIdOrOrderNo',
                data:{"orderNo":orderNo},
                dataType:"json",
                // async: true,
                // data:JSON.stringify(This.addBody),
                // url: contextPath + '/tpurchaseorder/purchaseOrderGoodslist',
                // contentType: 'application/json',
                success: function (res) {
                    // This.originData = JSON.parse(JSON.stringify(res.data));
                    // This.purchase.goodList = res.data;
                    // This.productDetailList = This.purchase.goodList;
                    This.originData = JSON.parse(JSON.stringify(res.data.goodList));
                    This.purchase = res.data;
                    This.purchase.organizationName = layui.data('user').currentOrganization.orgName;
                    This.getSupplierInfo(res.data.supplierId);
                    This.productDetailList = This.purchase.goodList;
                    This.isEdit(This.purchase.orderStatus == 1?'Y':'N'); //禁用附件
                    This.getAccess(This.purchase.id,This.boeType); //查询附件(查看和修改情况)
                },
                error: function (code) {
                    console.log(code);
                }
            });
        },
        //加载商品类型
        loadProductType() {
            let that = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecommoditycategory/listByAll?parentId=0',
                dataType: "json",
                success: function (data) {
                    that.categoryType = that.initGoodCategory(data.data.cateLists)
                },
                error: function () {
                    that.$Modal.info({
                        title:'提示信息',
                        content:'服务器出错啦'
                    })

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
        add() {
            window.parent.activeEvent({name: '新增采购订单', url: contextPath +'/purchase/purchase-order/purchase-order.html',params:{type:'add'}});
        },
        //必填项校验
        verifyInfo(){
            let isSupplierPass = this.$refs.supplier.submit();
            let isFormPass;
            this.$refs['purchase'].validate((valid)=>{
                if(valid){
                    isFormPass = true;
                } else {
                    isFormPass = false;
                }
            })
            if(!isSupplierPass  || !isFormPass){
                return false;
            } else {
                return true;
            }
            // let verifyRes = true;
            // let basicInfo = {
            //     '业务类型':this.purchase.businessTypeId,
            //     '供应商':this.purchase.supplierId
            // }
            // for(let key in basicInfo) {
            //     if(!basicInfo[key]) {
            //         this.$Modal.warning({
            //             title: '提示信息',
            //             content: `您还没有填写${key}！`
            //         });
            //         verifyRes = false;
            //         break;
            //     }
            // }
            // return verifyRes;
        },
        verifyGoodLine(){
            let validateResult = true;
            if(this.purchase.goodList.length<1){
                this.$Modal.info({
                    title: '提示信息',
                    content: '您还没有填写商品分录行明细，请点击 新增行 添加！'
                });
                validateResult = false;

            }else{
                for(let i=0;i<this.purchase.goodList.length;i++){
                    if(!this.purchase.goodList[i].goodsCode) {
                        this.$Modal.info({
                            title: '提示信息',
                            content: '您还没有填写第'+(i+1)+'行的商品编码！'
                        });
                        validateResult = false;
                        break;
                    }
                    if(!this.purchase.goodList[i].deliveryDate) {
                        this.$Modal.info({
                            title: '提示信息',
                            content: '您还没有填写第'+(i+1)+'行的交货日期！'
                        });
                        validateResult = false;
                        break;
                    } else {
                        if(new Date(this.purchase.goodList[i].deliveryDate).getTime() < new Date(this.purchase.purchaseDate).getTime()) {
                            this.$Modal.info({
                                title: '提示信息',
                                content: `第${i+1}行的交货日期不能小于采购日期，请重新选择！`
                            });
                            validateResult = false;
                            break;
                        }
                    }
                    //非金料 数量必填，且不为0
                    if(this.purchase.goodList[i].goodsMainType != 'attr_ranges_gold') {
                        if (!this.purchase.goodList[i].purchaseCount) {
                            this.$Modal.info({
                                title: '提示信息',
                                content: '第' + (i+1) + '行的采购数量为必填项，且采购数量大于0！'
                            });
                            validateResult =  false;
                            break;
                        }
                        if(this.purchase.goodList[i].purchaseCount === '0' || this.purchase.goodList[i].purchaseCount === 0) {
                            this.$Modal.info({
                                title: '提示信息',
                                content: '第' + (i+1) + '行的采购数量为必填项，且采购数量大于0！'
                            });
                            validateResult = false;
                            break;
                        }
                    }
                    //采购重量，金料非金料都要填
                    if(!this.purchase.goodList[i].purchaseWeight) {
                        this.$Modal.info({
                            title: '提示信息',
                            content: '第'+(i+1)+'行的采购重量为必填项，且采购重量大于0！'
                        });
                        validateResult = false;
                        break;
                    }else {
                        //采购重量，金料非金料都要填，且不能为0
                        if(this.purchase.goodList[i].purchaseWeight === '0' || this.purchase.goodList[i].purchaseWeight === 0) {
                            this.$Modal.info({
                                title: '提示信息',
                                content: '第'+(i+1)+'行的采购重量为必填项，且采购重量大于0！'
                            });
                            validateResult = false;
                            break;
                        }
                    }
                }
            }
            return validateResult;
        },
        validateProduct(){//校验是否存在商品明细
            let flag = true;
            let This = this;
            $.each(This.productDetailList, function (i, item) {
                if(item.goodsId || item.detailMark == 2){
                    return true;
                }
                if(item.goodsMainType == 'attr_ranges_goods'){
                    if(!item.tBaseBomEntity){
                        flag = false;
                        This.$Modal.info({
                            title:'提示信息',
                            content: '第'+(i+1)+'行商品明细未选择，请先选择商品明细！',
                        });
                        return false;
                    }
                }else{
                    if(!item.assistAttrs){
                        flag = false;
                        This.$Modal.info({
                            title:'提示信息',
                            content: '第'+(i+1)+'行商品明细未选择，请先选择商品明细！',
                        });
                        return false;
                    }
                }
            });
            return flag;
        },

        //新增时保存、提交
        addSubmit(type){
            let This = this;
            let postData = This.handlerDataToPost();
            if(This.purchase.goodList.length === 0){
                postData.goodList = [];
            }
            $.ajax({
                type: 'post',
                async: true,
                contentType: 'application/text;charset=utf-8',
                data: JSON.stringify(postData),
                url: contextPath + '/tpurchaseorder/addpurchaseOrder',
                dataType: 'json',
				async: false,
				success: function (data) {
                    This.htHaveChange = false;
                    if(data.code === '100100') {
                        // 调用方法保存附件
                        This.saveAccess(data.data.id,This.boeType);
                        This.$Modal.success({
                            title:'提示信息',
                            content:type =='save'?'保存成功！':'提交成功！'
                        })
                        //查询附件
                        This.getAccess(This.purchase.id,This.boeType);
                        //兼容新增页面点保存后直接提交的情况
                        This.purchase.id = data.data.id;
                        This.purchase.orderNo = data.data.orderNo;
                        This.purchase.createName = data.data.createName;
                        This.purchase.createTime = data.data.createTime;
                        Object.assign(This.purchase, {...data.data});
                        This.purchase.delGoodIds = [];
                        // console.log('data.data.goodList',data.data.goodList);
                        This.purchase.goodList = data.data.goodList;
                        This.productDetailList=This.purchase.goodList;
                        // console.log(data.data.orderStatus);
                        //附件禁用
                        This.isEdit(This.purchase.orderStatus == 1?'Y':'N');
                        if (data.data.orderStatus > 1){
                            This.isSaveDisable = true;
                            This.isSubmitDisable = true;
                        } else {
                            This.isSaveDisable = false;
                            This.isSubmitDisable = false;
                        }
                        //提交之后新增行，删除行禁用
                        if(data.data.orderStatus === 1){//暂存
                            if(This.purchase.datasources == 2){
                                This.isAddRowDisable = true;
                                This.isDelRowDisable = false;
                            } else {
                                This.isAddRowDisable = false;

                            }
                        } else {//非暂存
                            if(type === 'submit') {
                                This.isAddRowDisable = true;
                                This.isDelRowDisable = true;
                                This.isFromList = true;
                            }
                        }
                    } else {
                        This.$Modal.info({
                            title:'提示信息',
                            content:data.msg
                        })
                        This.isSaveDisable = false;
                        This.isSubmitDisable = false;
                    }
                },
                error: function (e) {
                    console.log(e);
                }
            });
        },
        //修改时保存提交
        updateSubmit(type){
            let This = this;
            let postData = This.handlerDataToPost();
            if(This.purchase.goodList.length === 0){
                postData.goodList = [];
            }
            $.ajax({
                type: 'post',
                async: true,
                contentType: 'application/text',
                data: JSON.stringify(postData),
                url: contextPath + '/tpurchaseorder/updatepurchaseOrder',
                dataType: 'json',
                success: function (data) {
                    if(data.code === '100100') {
                        // 调用方法保存附件
                        This.saveAccess(data.data.id,This.boeType);
                        This.$Modal.success({
                            title:'提示信息',
                            content:type =='save'?'保存成功！':'提交成功！'
                        })
                        //查询附件
                        This.getAccess(This.purchase.id,This.boeType);
                        This.purchase.updateName = data.data.updateName;
                        This.purchase.updateTime = data.data.updateTime;
                        Object.assign(This.purchase, {...data.data});
                        This.purchase.delGoodIds = [];
                        This.purchase.goodList = data.data.goodList;
                        This.productDetailList = This.purchase.goodList;
                        // console.log(data.data.orderStatus);
                        //附件禁用
                        This.isEdit(This.purchase.orderStatus == 1?'Y':'N');
                        if (data.data.orderStatus > 1){
                            This.isSaveDisable = true;
                            This.isSubmitDisable = true;
                        } else {
                            This.isSaveDisable = false;
                            This.isSubmitDisable = false;
                        }
                        //提交之后新增行，删除行禁用,
                        if(data.data.orderStatus === 1){
                            This.isAddRowDisable = false;
                            This.isDelRowDisable = false;
                        } else {
                            if(type === 'submit') {
                                This.isAddRowDisable = true;
                                This.isDelRowDisable = true;
                                This.isFromList = true;
                            }
                        }
                    } else {
                        This.$Modal.info({
                            title:'提示信息',
                            content:data.msg
                        })
                        This.isSaveDisable = false;
                        This.isSubmitDisable = false;
                    }
                },
                error: function (e) {
                    console.log(e);
                }
            });
        },
        //点击保存，提交按钮
        save(type){
            if(this.purchase.orderStatus>1){
                this.isSubmitDisable = true;
                return;
            }
            //禁用保存，提交按钮，防止重复保存、提交
            this.isSaveDisable = true;
            this.isSubmitDisable = true;

            //新增
            if(this.purchase.orderNo==='' || this.purchase.orderNo===null){
                if(type==='save'){ //保存=暂存
                    this.purchase.orderStatus = 1;
                    if(this.purchase.dataSources == 2){//清单
                        this.addSubmit('save');
                    }
                    if(this.purchase.dataSources == 1){//手动新增
                        if(this.validateProduct()){
                            this.addSubmit('save');
                        }else {
                            this.isSaveDisable = false;
                            this.isSubmitDisable = false;
                        }
                    }
                }else if(type==='submit') { //提交=待审核
                    // console.log('新增校验：'+this.verifyInfo(),this.verifyGoodLine());
                    if(this.purchase.dataSources == 2){//清单过来
                        if(this.verifyInfo() && this.verifyGoodLine()){
                            this.purchase.orderStatus = 2;
                            this.addSubmit('submit');
                        } else {
                            this.isSaveDisable = false;
                            this.isSubmitDisable = false;
                        }
                    }
                    if(this.purchase.dataSources == 1){
                        // console.log(this.verifyInfo());
                        if(this.verifyInfo()){
                            if( this.validateProduct() &&  this.verifyGoodLine()){
                                this.purchase.orderStatus = 2;
                                this.addSubmit('submit');
                            } else {
                                this.isSaveDisable = false;
                                this.isSubmitDisable = false;
                            }
                        } else {
                            this.isSaveDisable = false;
                            this.isSubmitDisable = false;
                        }
                    }

                }

            }else{ //修改(传单据状态后台判断)
                if(type==='save'){ //保存=修改(采购数量,重量,单价,金额);暂存状态下可新增删除行
                    // this.updateSubmit('save');
                    if(this.purchase.dataSources == 2){//清单
                        this.updateSubmit('save');
                    }
                    if(this.purchase.dataSources == 1){//手动新增
                        if(this.validateProduct()){
                            this.updateSubmit('save');
                        }else {
                            this.isSaveDisable = false;
                            this.isSubmitDisable = false;
                        }
                    }
                }else if(type==='submit') { //提交=修改单据状态为待审核
                    // console.log('修改校验：'+this.verifyInfo(),this.verifyGoodLine());
                    if(this.purchase.dataSources == 2){//清单过来
                        if(this.verifyInfo() && this.verifyGoodLine()){
                            this.purchase.orderStatus = 2;
                            this.updateSubmit('submit');
                        } else {
                            this.isSaveDisable = false;
                            this.isSubmitDisable = false;
                        }
                    }
                    if(this.purchase.dataSources == 1){
                        // console.log(this.verifyInfo());
                        if(this.verifyInfo()){
                            if(this.validateProduct() &&  this.verifyGoodLine()){
                                this.purchase.orderStatus = 2;
                                this.updateSubmit('submit');
                            } else {
                                this.isSaveDisable = false;
                                this.isSubmitDisable = false;
                            }
                        } else {
                            this.isSaveDisable = false;
                            this.isSubmitDisable = false;
                        }
                    }
                }
            }
        },
        approval(){
            let _this = this;
            _this.modalType = 'approve';
            _this.modalTrigger = !_this.modalTrigger;
        },
        reject(){
            let _this = this;
            _this.modalType = 'reject';
            _this.modalTrigger = !_this.modalTrigger;
        },
        loadData() {
            var That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tpurchasecollectgoods/data',
                dataType: "json",
                success: function (r) {
                    That.employees =r.data.employees; //加载当前公司下面所有的员工
                },
                error: function () {
                    console.log('服务器出错啦');
                }
            })
        },
        //业务员选择
        changeEmp(e){
            this.purchase.salesmanId = e.value;
            var le = e.label;
            this.purchase.salesmanName = le.substring(le.lastIndexOf("-")+1,le.length);
            this.htTestChange();
        },
        showlist(){
            window.parent.activeEvent({name: '采购订单列表', url: contextPath+'/purchase/purchase-order-list/purchase-order-list.html'})
        },
        preview(){

        },
        print(){

        },

        //商品明细弹窗
        modalSure(e) {
            this.productDetailModalClick(e);
        },
        modalCancel(e) {
            // this.productDetailModalClick(e);
        },

        productDetailModalClick(e){//商品详情点击确定跟取消的回调
            //写法固定
            if (this.purchase.goodList[this.selectedIndex].goodsMainType === 'attr_ranges_goods') {
                Object.assign(this.purchase.goodList[this.selectedIndex], {
                    tBaseBomEntity: e,
                    assistAttrs: null,
                    overEdit: true
                });
            } else {
                Object.assign(this.purchase.goodList[this.selectedIndex],{
                    assistAttrs: e,
                    tBaseBomEntity: null,
                    overEdit: true
                })
            }
        },

        showProductDetail(index) {//点击商品明细
            this.selectedIndex = index;//选中行下标
            // console.log(this.purchase.goodList);
            if(!this.purchase.goodList[index].commodityId){//商品编码id，
                this.$Modal.info({
                    title:'提示信息',
                    content: '还未选择商品，请先选择商品，再选择明细！',
                });
                return false;
            }
            //固定开始
            let ids = {
                goodsId: this.purchase.goodList[index].goodsId,//商品Id
                commodityId: this.purchase.goodList[index].commodityId,
                documentType: 'P_ORDER'//采购订单的字段
            };
            let tempData = null;
            if(this.productDetailModal.dataSourceType && !this.purchase.id){
                if(this.purchase.goodList[index].goldParts && this.purchase.goodList[index].goldParts.length ==1 ){
                    Object.assign(this.purchase.goodList[index].goldParts[0],{
                        checked:true
                    })
                }
                tempData={};
                Object.assign(tempData, {
                    goldParts:this.purchase.goodList[index].goldParts,
                    stonesParts:this.purchase.goodList[index].stonesParts,
                    partParts:this.purchase.goodList[index].partParts,
                    materialParts:this.purchase.goodList[index].materialParts,
                });
            }
            Object.assign(this.productDetailModal, {
                showModal: true,
                ids: ids,
                dataSource:tempData
            });
            this.$nextTick(() => {
                this.$refs.modalRef.getProductDetail();
        });
            //固定结束
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
            let data = JSON.parse(JSON.stringify(this.purchase));
            // data.goodList = [JSON.parse(JSON.stringify(obj))];
            data.goodList.map( (item,index) =>{
                item = [JSON.parse(JSON.stringify(obj))];
            })
            //商品明细数据处理
            htHandlerProductDetail(this.purchase.goodList, data, obj,this.productDetailModal.dataSourceType);
            //可以固定，结束
            this.purchase.goodList.map((item, index)=>{
                //商品分录行赋值
                if(!data.goodList[index]){
                data.goodList[index] = {};
            }
            Object.assign(data.goodList[index], {
                mrpId:item.mrpId,
                commodityId: item.commodityId,
                pictureUrl: item.pictureUrl,
                goodsId: item.goodsId, //修改时需要
                orderNo:item.orderNo,
                purchaseType:item.purchaseType,
                goodsCode:item.goodsCode,
                goodsName: item.goodsName,
                deliveryDate:item.deliveryDate,
                purchaseCount:item.purchaseCount,
                goodsSpecifications: item.goodsSpecifications,
                weightUnit: item.weightUnit,
                weightUnitId:item.weightUnitId,
                purchaseWeight:item.purchaseWeight,
                digitUnit:item.digitUnit,
                countingUnitId:item.countingUnitId,
                chargeUnit:item.chargeUnit,
                price: item.price,
                amount: item.amount,
                remark: item.remark,
                goodsLineNo:item.goodsLineNo,
                goodsMainType:item.goodsMainType, //商品主类型必传
                //收货单初始化字段
                alreadyCollectCount: '0.0',
                alreadyCollectWeight: '0.0',
                goodsTypeName: this.purchase.goodsTypeName,
                goodsTypePath: this.purchase.goodsGroupPath,
                custStyleCode: item.custStyleCode,
                styleName: item.styleName,
                styleCategoryId: item.styleCategoryId,
                //采购清单下单带出字段
                documentType: item.documentType,
                productFlag: item.productFlag,
                //隐藏属性
                stoneSection: item.stoneSection,
                stoneClarity: item.stoneClarity,
                stoneColor: item.stoneColor,
                viceStoneWeight: item.viceStoneWeight,
                mainStoneWeight: item.mainStoneWeight,
                goldColor: item.goldColor,
                goldWeight: item.goldWeight,

            })
            //数据来源于上游 并且未编辑
            if(this.productDetailModal.dataSourceType && !item.overEdit){
                Object.assign(data.goodList[index], {
                    //4数组
                    materialParts:item.materialParts,
                    goldParts:item.goldParts,
                    stonesParts:item.stonesParts,
                    partParts:item.partParts
                });
            }
        });
            // console.log(data)
            return data;
        },
        modalOk(){

        },
        //计算列合计
        sum(list, key) {
            return list.reduce((sum, el) => {
                if (el[key] === '' || el[key] === null || el[key] === undefined) {
                return 0 + sum;
            };
            if (isNaN(el[key])) {
                // alert('请输入数字')
                el[key] = ''
            }
            return parseFloat(el[key]) + sum;
        }, 0)
        },
        //新增行
        addOneRow(val) {
            //判断有没有选商品类型，没有选商品类型不能新增行
            // console.log(this.purchase.goodsTypeName);
            if(!this.purchase.goodsTypeName){
                this.$Modal.info({
                    title:'提示信息',
                    content:'请先选择商品类型'
                })
                return false;
            }
            if(this.validateProduct()){
                // if(this.commodityList.length==0){
                //     this.getCommodityList();
                // }
                this.purchase.goodList.push(
                    {
                        orderNo:val,
                        commodityId:'',
                        pictureUrl:'',
                        goodsId: '', //修改时需要
                        orderNo:'',
                        purchaseType:'',
                        goodsCode:'',
                        goodsName:'',
                        deliveryDate:'',
                        purchaseCount:'',
                        goodsSpecifications:'',
                        weightUnit:'',
                        purchaseWeight:'',
                        digitUnit:'',
                        chargeUnit:'',
                        price:'',
                        amount:'',
                        remark:'',
                        goodsLineNo:'',
                        goodsMainType:'', //商品主类型必传
                        //收货单初始化字段
                        alreadyCollectCount: '0.0',
                        alreadyCollectWeight: '0.0',
                        goodsTypeName: '',
                        goodsTypePath: '',
                        custStyleCode: '',
                        styleName: '',
                        styleCategoryId: '',
                        //隐藏属性
                        stoneSection: '',
                        stoneClarity: '',
                        stoneColor: '',
                        viceStoneWeight: '',
                        mainStoneWeight: '',
                        goldColor: '',
                        goldWeight: '',
                        options: this.commodityList
                    }
                );
                this.htTestChange();
            }
        },
        //删除行
        deleteOneRow(selectedRowIndex) {
            if(this.purchase.goodList[this.selectedRowIndex].goodsId){
                this.purchase.delGoodIds.push(this.purchase.goodList[this.selectedRowIndex].goodsId);
            }
            if(this.purchase.dataSources == 2 && this.purchase.goodList.length == 1){
                this.$Message.warning({
                    title:'提示信息',
                    content:'当前数据来源采购清单，不能全部删除！'
                })
                return;
            }
            this.purchase.goodList.splice(selectedRowIndex,1);
            this.htTestChange();
        },
        //选中行
        selectOneRow(index,gid) {
            this.selectedRowIndex = index;
        },
        //根据带出id查询供应商信息
        getSupplierInfo(id) {
            let sid = id;
            let This = this;
            if(sid){
                $.ajax({
                    type: "POST",
                    url: contextPath+'/tpurchaseorder/getSupplierDetail?supplierId='+sid,
                    contentType: 'application/json',
                    dataType: "json",
                    success: function(data) {
                        // This.purchase.supplierCode = data.data.siShortName;
                        // This.purchase.supplierCode = data.data.supplierName;
                        This.purchase.supplierName = data.data.supplierName;
                        This.purchase.phone = data.data.phone;
                        This.purchase.defaultContact = data.data.defaultContact;
                        This.purchase.concreteAddress = data.data.concreteAddress;
                        This.$refs.supplier.haveInitValue(This.purchase.supplierName, This.purchase.supplierName);
                    },
                    error: function(err){
                        This.$Modal.info({
                            title:'提示信息',
                            content:'服务器出错啦'
                        })
                    }
                })
            }
        },
        //上层基本信息渲染
        showBasicInfo(params) {
            this.purchase.businessTypeId = params.basicInfo.businessTypeId;
            this.purchase.orderNo = params.basicInfo.orderNo;
            this.purchase.goodList.orderNo = params.basicInfo.orderNo;
            this.purchase.purchaseDate = params.basicInfo.purchaseDate;
            this.purchase.goodsTypeName = params.basicInfo.goodsTypeName;
            this.purchase.organizationId = params.basicInfo.organizationId;
            this.purchase.salesmanName = params.basicInfo.salesmanName;
            this.purchase.salesmanId = params.basicInfo.salesmanId;
            this.purchase.supplierId = params.basicInfo.supplierId;
            this.purchase.createName = params.basicInfo.createName;//创建人
            this.purchase.createTime = params.basicInfo.createTime;//创建时间
            this.purchase.updateName = params.basicInfo.updateName;//修改人
            this.purchase.updateTime = params.basicInfo.updateTime;//修改时间
            this.purchase.auditor = params.basicInfo.auditor;//审核人
            this.purchase.auditTime = params.basicInfo.auditTime;//审核时间
            this.purchase.goodsGroupPath = params.basicInfo.goodsGroupPath;
            this.purchase.id = params.basicInfo.id; //修改时需要
            this.purchase.dataSources = params.basicInfo.dataSources;
            this.purchase.orderStatus = params.basicInfo.orderStatus;
            //修改状态，查看状态 根据id查询供应商信息
            this.getSupplierInfo(params.basicInfo.supplierId);
        },
        //修改状态下，采购数量、采购重量只能改小验证
        //如果大于原值，则改回原来的值,提示用户重新修改
        valueVerify(type,item,val,index) {
            // console.log(type,item,val,index);
            // console.log(this.originData);
            let This = this;
            if(!((This.param.type === 'add') ||(This.param.basicInfo.orderStatus > 1))) {
                if(item.goodsId){//存在分录行ID才校验
                    //获取列表带过来的原值(采购数量，采购重量)
                    var originCount = This.originData[index].purchaseCount;
                    var originWeight = This.originData[index].purchaseWeight;
                    // console.log(originCount,originWeight,This.purchase.dataSources);
                    if(type === 'purchaseCount') {
                        if(This.purchase.dataSources == 2) {//清单
                            if(val > originCount){
                                This.$Message.warning('修改值不能大于原值，请重新修改！');
                                This.purchase.goodList[index].purchaseCount = originCount;
                                return;
                            }
                        } else if (This.purchase.dataSources == 1) {//手动新增
                            if((originCount!==null && originCount!==0 ) && (val > originCount) ){
                                This.$Message.warning('修改值不能大于原值，请重新修改！');
                                This.purchase.goodList[index].purchaseCount = originCount;
                                return;
                            }
                        }
                    }
                    if(type === 'purchaseWeight') {
                        if (This.purchase.dataSources == 2) {//清单
                            if(val > originWeight){
                                This.$Message.warning('修改值不能大于原值，请重新修改！');
                                This.purchase.goodList[index].purchaseWeight = originWeight;
                                return;
                            }
                        } else if (This.purchase.dataSources == 1) {//手动新增
                            if((originWeight!==null && originWeight!==0) && (val > originWeight) ){
                                This.$Message.warning('修改值不能大于原值，请重新修改！');
                                This.purchase.goodList[index].purchaseWeight = originWeight;
                                return;
                            }
                        }
                    }
                }
            }
        },
        clearNoNum(item, type, floor) {
            return htInputNumber(item, type, floor);
        },
        typeInit(arr,res,val){
            for(let i=0;i<arr.length;i++){
                if(arr[i].value == val){
                    res.push(arr[i].value);
                    return true;
                }
                if(arr[i].children && arr[i].children.length >0){
                    if(this.typeInit(arr[i].children,res,val)){
                        res.push(arr[i].value);
                        return true;
                    }
                }
            }
        },
        repositionDropdown(){
            return repositionDropdownOnSroll('testTableWrap', 'goods');
        }
    },
    //金额计算
    watch: {
        purchase:{
            handler (newQuestion, oldQuestion) {
                if(newQuestion.dataSources ==2 ){
                    this.productDetailModal.dataSourceType =true;
                }else{
                    this.productDetailModal.dataSourceType =false;
                }
            },
            deep:true
        },
        productDetailList:{
            handler (newQuestion, oldQuestion) {
                // console.log(newQuestion, oldQuestion);
                let count = 0;
                let weight = 0;
                let allMoney = 0;
                if(!newQuestion){
                    return;
                }
                newQuestion.map(item => {
                    if (item.purchaseCount && !isNaN(item.purchaseCount)) {
                    // count += item.purchaseCount*1;
                    // count = math.eval(count+item.purchaseCount);
                    count = (Number(count) || 0) + (Number(item.purchaseCount) || 0);
                }
                if (item.purchaseWeight && !isNaN(item.purchaseWeight) ) {
                    // weight += item.purchaseWeight*1;
                    // count = math.eval(weight+item.purchaseWeight);
                    weight = (Number(weight) || 0) + (Number(item.purchaseWeight) ||0);
                }
                if (item.price) {
                    if (item.chargeUnit == 1 && item.purchaseWeight) {
                        //按重量计价
                        // item.amount = item.price * item.purchaseWeight;
                        // item.amount = math.eval(item.price * item.purchaseWeight);
                        item.amount = parseFloat((Number(item.price) || 0) * (Number(item.purchaseWeight) || 0).toFixed(3));
                    } else if (item.chargeUnit == 2 && item.purchaseCount) {
                        //按数量计价
                        // item.amount = item.price * item.purchaseCount;
                        // item.amount = math.eval(item.price * item.purchaseCount);
                        item.amount = parseFloat((Number(item.price) || 0) * (Number(item.purchaseCount) || 0).toFixed(3));
                    } else {
                        item.amount = 0;
                    }
                    allMoney = parseFloat((Number(allMoney) || 0) + (Number(item.amount) || 0).toFixed(2));
                }
                this.purchase.goodList.purchaseCount = count;
                this.purchase.goodList.purchaseWeight = weight;
                this.purchase.goodList.amount = allMoney;
            });
            },
            immediate: true,
            deep: true
        }
    },
    computed: {
        //数量，重量，金额合计
        totalCount: function() {
            return this.purchase.purchaseCount=this.sum(this.purchase.goodList, "purchaseCount").toFixed(0);
        },
        totalWeight: function() {
            return this.purchase.purchaseWeight=this.sum(this.purchase.goodList, "purchaseWeight").toFixed(2);
        },
        totalAmount: function() {
            return this.sum(this.purchase.goodList, "amount").toFixed(2);
        },
        typeValue:function () {
            let temp = this.purchase.goodsGroupPath;
            let arr =[];
            this.typeInit(this.categoryType,arr,temp);
            return arr.reverse();
        }
    },
    created(){
        this.loadProductType();
        this.initUnit();
        this.loadData();//业务员
		window.handlerClose = this.handlerClose;//将事件注册到window下，页面x关闭页面时要使用
    },
    mounted() {
        //接收列表页过来的参数
        this.repositionDropdown();
        this.param = window.parent.params.params;
        console.log(this.param);
        this.openTime = window.parent.params.openTime;
        //获取组织
        this.purchase.organizationName = layui.data('user').currentOrganization.orgName;
            let params = window.parent.params.params;
            if(params.type === 'update'){
                this.isEdit("Y");
                // this.addBody.orderNo = params.basicInfo.orderNo;
                this.queryByCode(params.basicInfo.orderNo);
                // this.showBasicInfo(params);
                if(this.purchase.dataSources == 2){
                    this.isFromList = true;
                    this.isAddRowDisable = true;
                }
            }else if(params.type === 'query'){
                this.isEdit("N");
                //从列表带过来的数据
                // this.addBody.orderNo = params.docCode;
                // this.showBasicInfo(params);
                this.queryByCode(params.docCode);
                if(params.basicInfo.orderStatus !== 1){
                    this.isSaveDisable = true;
                    this.isSubmitDisable = true;
                    this.isAddRowDisable = true;
                    this.isDelRowDisable = true;
                    this.isFromList = true;
                } else {//暂存状态
                    //源单带过来的不能新增行，上层表单不能修改
                    if(params.basicInfo.dataSources === 2) {
                        this.isAddRowDisable = true;
                        this.isFromList = true;
                    }
                }
            }else if(params.type === 'add'){
                this.isFromList = false;
                this.isEdit("Y");
                //采购日期设置
                this.purchase.purchaseDate=new Date().format("yyyy-MM-dd");
                //新增状态暂时给订单暂存状态(加载商品明细时需要)
                this.purchase.orderStatus=1;
                this.purchase.dataSources = 1;
                this.isEdit(this.purchase.orderStatus == 1?'Y':'N');
                this.$refs.supplier.noInitValue();
            }else if(params.type === 'sAdd'){
                this.isFromList = true;
                this.showBasicInfo(params);
                //设置默认采购日期
                for(let i = 0 ;i<params.basicInfo.goodList.length; i++) {
                    if(!params.basicInfo.goodList[i].deliveryDate){
                        params.basicInfo.goodList[i].deliveryDate = new Date().format("yyyy-MM-dd");
                    }
                }
                this.purchase.goodList = params.basicInfo.goodList;
                this.productDetailList = this.purchase.goodList;
                this.purchase.dataSources = 2;
                this.productDetailModal.dataSourceType = true;
                this.isAddRowDisable = true;
                this.originData = JSON.parse(JSON.stringify(params.basicInfo.goodList));
                this.isEdit(this.purchase.orderStatus == 1?'Y':'N');
            }

        //合计watch方法用到
        this.productDetailList=this.purchase.goodList;
    }
})