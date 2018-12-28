new Vue({
    el: '#sale-settlement',
    data() {
        return {
            htHaveChange: false,
            ruleValidate:{
                billTime:[
                    { required: true}
                ]
            },
            openName:'',
            openTime:'',
            //组织
            organ:{
                currentOrganization:{
                    orgName:''
                },
                userCurrentOrganId:''
            },
            //审核
            modalTrigger: false,
            modalType: '',
            //审批进度条
            stepList: [],
            approvalTableData: [],
            //跳转页面携带的参数
            inParams:{},
            //附件
            boeType: 'S_STATEMENT',
            //默认不可修改
            isDisable: true,
            //商品明细显示
            isDetailTabShow:false,
            //页签不可查看
            isTabShow:false,
            //保价费,邮寄费,检测费默认可修改
            isUpdateDisable:false,
            otherDisable: true,
            //出库汇总销售金额(折扣后)合计
            outStockTotalAmount:0,
            //商品简述数量合计
            goodsInfoTotalNum:0,
            //商品简述重量合计
            goodsInfoTotalWeight:0,
            //商品简述销售金额合计
            goodsInfoTotalAmount:0,
            //用料明细重量合计
            goldInfoTotalWeight:0,
            //商品明细组件处理
            updateFlag: 2, //商品明细 1 可修改， 其他不可修改
            goodList: [],
            productDetailModal: {
                showModal: false,
                dataSourceType: false, //是否来自上游；
                dataSource: null,
                ids: {
                    goodsId: '',//商品信息id(仓库)
                    commodityId: '',
                    documentType: 'W_STOCK_IN'
                },
                overEdit: false,
                specialAttr:{
                    stone: {},
                    gold: {},
                    part: {}
                }
            },
            showProductDetails: false,//控制商品明细弹窗
            selectedIndex: 0,//明细信息选中行高亮
            //结算单Vo
            saleBillVo: {
                id: '',//主键id
                documentNo: "",//单号
                organizationId: "",//所属组织ID
                organizationName: "",//所属组织名
                customerId:'',//客户id
                custNo: "",//客户编号
                custName: "",//客户名字
                documentStatus: 1,//单据状态
                billTime: "",//结算时间
                remark: "",//备注
                //计价方式
                pricingMethod: {},
                totalLaborCost: 0,//本单工费
                totalGoldAmount: 0,//本单金料金额
                totalStoneAmount: 0,//本单石料金额
                totalAccessoryAmount: 0,//本单配件金额
                inspectionCost: '',//本单检测费
                postalCost: '',//本单邮寄费
                totalInsurancePrice: '',//本单保价费
                totalOtherAmount: 0,//本单其他费
                currentReceiptAmount: 0,//本单应收款
                lastReceiptAmount: 0,//上期累计应收款
                currentOtherAmount: 0,//本期其他收款
                totalReceiptAmount: 0,//本期累计应收款(余额)
                createId: "",//创建人ID
                createName: "",//创建人姓名
                createTime: "",//创建时间
                updateId: "",//修改人ID
                updateName: "",//修改人姓名
                updateTime: "", //修改时间
                auditId: "",//审核人ID
                auditName: "",//审核人姓名
                auditTime: "",//审核时间
                isDel: 1,//是否删除
                //出库汇总
                saleBillOutStockCollectList: [
                    /*{
                        sourceDocumentType:'',//源单类型
                        sourceDocumentNo:'',//出库单单据编号
                        outStockTime:'',//出库单创建日期
                        totalNum:'',//商品总数量
                        totalWeight:'',//总重
                        totalAmount:'',//销售金额
                    }*/
                ],
                //商品简述
                saleBillGoodsInfoList:[
                    /*{
                        id:'',
                        pictureUrl:'',//商品图片
                        goodsTypeName:'',//商品类型
                        goodsCode:'',//商品编码
                        goodsName:'',//商品名称
                        weightUnit:'',//计重单位
                        countingUnit:'',//计数单位
                        num:'',//数量
                        totalWeight:'',//总重
                        discountRate:'',//折扣率(%)
                        totalAmount:'',//总金额
                        totalActualAmount:'',//实际销售总金额
                    }*/
                ],
                //商品明细
                saleBillGoodsDetailList:[
                    /*{
                        goodsBarcode:'',		//商品条码
                        goodsCode:'',//商品编码
                        goodsName:'',//商品名称
                        stoneNo:'',//主石条码号
                        batchNum:'',//批号
                        weightUnit:'',//计重单位
                        countingUnit:'',//计数单位
                        num:'',//数量
                        totalWeight:'',//总重
                        goldWeight:'',//金重
                        stoneWeight:'',//主石重(ct)
                        standardCateType:'',//标配证书类型
                        certificateNo:'',//证书编号
                        goldPrice:'',//今日金价
                        goldLoss:'',//金耗(%)
                        goldAmount:'',//金额(金)
                        stonePrice:'',//主石价
                        accessoryAmount:'',//金额(配件)
                        stoneAmount:'',//金额(石)
                        processingFee:'',//工费
                        certificateAmount:'',//证书费
                        otherAmount:'',//其他费用
                        saleAmount:'',//销售金额
                        goodsMainType:'',//商品主类型
                    }*/
                ],
                //用料明细
                saleBillGoldInfoList: [
                    /*{
                        goodsCode:'',//商品编码
                        goodsName:'',//商品名称
                        goldColor:'',//金料成色
                        weightUnit:'',//重量单位
                        consumptionWeight:'',//重量(含耗)
                        goldPrice:'',//金价
                        totalAmount:'',//金额 
                    }*/
                ],
                //用石明细
                saleBillStoneInfoList: [
                    /*{
                        materialType:'',//原料性质
                        goodsCode:'',//商品编码
                        goodsName:'',//商品名称
                        batchNum:'',//批号
                        goodsBarcode:'',//条码号
                        num:'',//粒数
                        weight:'',//重量(ct)
                        price:'',//单价
                        totalAmount:'',//金额
                    }*/
                ],
                //配件明细
                saleBillAccessoryInfoList:null
                    /*{
                        goodsCode:'',//商品编码
                        goodsName:'',//商品名称
                        countingUnit:'',//计数单位
                        num:'',//数量
                        weightUnit:'',//计重单位
                        weight:'',//总重
                        price:'',//单价
                        totalAmount:'',//金额
                    }*/
                ,
                //客存料结价
                saleBillInventoryList: [
                    /*{
                        materialName:'',//来料名称
                        lastStockMaterialWeight:'',//上期客存料(g)
                        materialWeight:'',//本期来料(g)
                        isBill:'',//是否结价
                        billWeight:'',//结价重量
                        billPrice:'',//结价金额
                        overageMaterialWeight:'',//本期结存(g)
                    }*/
                ],
            },
        }
    },
    methods: {
        //附件上传按钮打开
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
        //修改时保存
        saveOfUpdate(){
            let This = this;
            $.ajax({
                type: "POST",
                async: false,
                url: contextPath + "/saleBillController/editSaleBill",
                data: JSON.stringify(This.saleBillVo),
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        This.$Modal.success({
                            title: "提示",
                            content: "保存成功!"
                        });
                        // 调用方法保存附件
                        This.saveAccess(data.data.id, This.boeType);
                        //修改人和日期
                        This.saleBillVo.updateId = data.data.updateId;
                        This.saleBillVo.updateName = data.data.updateName;
                        This.saleBillVo.updateTime = data.data.updateTime;
                        This.htHaveChange = false;
                    }else {
                        This.$Modal.error({
                            title: "提示",
                            content: "保存失败!"
                        });
                    }
                },
                error: function (err) {
                    This.$Modal.error({
                        title: "提示",
                        content: "服务器出错!"
                    });
                    This.saleBillVo.documentStatus=1;
                }
            })
        },
        //新增时保存
        saveOfAdd(){
            let This = this;
            This.saleBillVo.documentStatus=1;
            $.ajax({
                type: "POST",
                async: false,
                url: contextPath + "/saleBillController/saveAll",
                data: JSON.stringify(This.saleBillVo),
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        This.$Modal.success({
                            title: "提示",
                            content: "保存成功!"
                        });
                        // 调用方法保存附件
                        This.saveAccess(data.data.id, This.boeType);
                        //设置单据id
                        This.saleBillVo.id = data.data.id;
                        //设置创建人和日期
                        This.saleBillVo.createId = data.data.createId;
                        This.saleBillVo.createName = data.data.createName;
                        This.saleBillVo.createTime = data.data.createTime;
                        This.htHaveChange = false;
                    }else {
                        This.$Modal.error({
                            title: "提示",
                            content: "保存失败!"
                        });
                        This.saleBillVo.documentStatus=1;
                    }
                },
                error: function (err) {
                    This.$Modal.error({
                        title: "提示",
                        content: "服务器出错!"
                    });
                }
            })
        },
        //保存
        save(){
            if(this.saleBillVo.id){
                //修改时保存
                this.saveOfUpdate();
            }else{
                //新增时保存
                this.saveOfAdd();
            }
        },
        //提交
        submit() {
            let temp = true;
            this.$refs.formValidate.validate((valid) => {
                if (valid == false) {
                    temp = false;
                }
            })

            if(!temp){
                return;
            }

            if(this.saleBillVo.id){
                //修改时提交
                this.submitOfUpdate();
            }else{
                //新增时提交
                this.submitOfAdd();
            }
        },
        //修改时提交
        submitOfUpdate(){
            let This = this;
            This.saleBillVo.documentStatus=2;
            $.ajax({
                type: "POST",
                url: contextPath + "/saleBillController/editSaleBill",
                data: JSON.stringify(This.saleBillVo),
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        This.$Modal.success({
                            title: "提示",
                            content: "提交成功!"
                        });
                        // 调用方法保存附件
                        This.saveAccess(data.data.id, This.boeType);
                        This.isEdit('N');
                        //设置保价费,邮寄费,检测费不可修改
                        This.isUpdateDisable=true;
                        //不可修改时判空保价费,邮寄费,检测费
                        This.setValueZero();
                        //创建人和日期
                        This.saleBillVo.updateId = data.data.updateId;
                        This.saleBillVo.updateName = data.data.updateName;
                        This.saleBillVo.updateTime = data.data.updateTime;
                        This.htHaveChange = false;
                    }else {
                        This.$Modal.error({
                            title: "提示",
                            content: "提交失败!"
                        });
                        This.saleBillVo.documentStatus=1;
                    }
                },
                error: function (err) {
                    This.$Modal.error({
                        title: "提示",
                        content: "服务器出错!"
                    });
                }
            })
        },
        //新增时提交
        submitOfAdd(){
            let This = this;
            This.saleBillVo.documentStatus=2;

            $.ajax({
                type: "POST",
                url: contextPath + "/saleBillController/saveAll",
                data: JSON.stringify(This.saleBillVo),
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        This.$Modal.success({
                            title: "提示",
                            content: "提交成功!"
                        });
                        // 调用方法保存附件
                        This.saveAccess(data.data.id, This.boeType);
                        This.isEdit(This.saleBillVo.documentStatus === 1 ? 'Y' : 'N');
                        //设置单据id
                        This.saleBillVo.id = data.data.id;
                        //设置保价费,邮寄费,检测费不可修改
                        This.isUpdateDisable=true;
                        //不可修改时判空保价费,邮寄费,检测费
                        This.setValueZero();
                        //创建人和日期
                        This.saleBillVo.createId = data.data.createId;
                        This.saleBillVo.createName = data.data.createName;
                        This.saleBillVo.createTime = data.data.createTime;
                        This.htHaveChange = false;
                    }else {
                        This.$Modal.error({
                            title: "提示",
                            content: "提交失败!"
                        });
                        This.saleBillVo.documentStatus=1;
                    }
                },
                error: function (err) {
                    This.$Modal.error({
                        title: "提示",
                        content: "服务器出错!"
                    });
                }
            })
        },
        //不可修改时判空保价费,邮寄费,检测费
        setValueZero(){
            if(this.saleBillVo.inspectionCost===null||this.saleBillVo.inspectionCost===""){
                this.saleBillVo.inspectionCost=0;
            }
            if(this.saleBillVo.postalCost===null||this.saleBillVo.postalCost===""){
                this.saleBillVo.postalCost=0;
            }
            if(this.saleBillVo.totalInsurancePrice===null||this.saleBillVo.totalInsurancePrice===""){
                this.saleBillVo.totalInsurancePrice=0;
            }
        },
        //不可修改时判空保价费,邮寄费,检测费
        setValueNull(){
            if(this.saleBillVo.inspectionCost===null){
                this.saleBillVo.inspectionCost='';
            }
            if(this.saleBillVo.postalCost===null){
                this.saleBillVo.postalCost='';
            }
            if(this.saleBillVo.totalInsurancePrice===null){
                this.saleBillVo.totalInsurancePrice='';
            }
        },
        //审核
        approve(){
            let This = this;
            This.modalType = 'approve';
            This.modalTrigger = !This.modalTrigger;
        },
        //驳回
        reject(){
            let This = this;
            This.modalType = 'reject';
            This.modalTrigger = !This.modalTrigger;
        },
        //审核或者驳回回调
        approvalOrRejectCallBack(res) {
            //不走审批流，直接审核或驳回
            if (res.result.code === '100515') {
                if (this.modalType === 'approve') this.updateData(this.saleBillVo.documentNo,4);
                if (this.modalType === 'reject') this.updateData(this.saleBillVo.documentNo,1);
            }
            //走审批流,刷新单据状态
            if (res.result.code === '100100') {
                this.saleBillVo.documentStatus = res.result.data.documentStatus;
                this.saleBillVo.updateName = res.result.data.updateName;
                this.saleBillVo.updateTime = res.result.data.updateTime;
                //单据已审核
                if (this.saleBillVo.documentStatus === 4) {
                    this.saleBillVo.auditName = res.result.data.auditName;
                    this.saleBillVo.auditTime = res.result.data.auditTime;
                }
                //单据驳回到暂存
                if (this.saleBillVo.documentStatus === 1) {
                    //设置保价费,邮寄费,检测费不可修改
                    this.isUpdateDisable=false;
                    //可修改时判空保价费,邮寄费,检测费
                    this.setValueNull();
                }
            }
            //查找附件
            this.isEdit(this.saleBillVo.documentStatus === 1 ? 'Y' : 'N');
        },
        //退出
        exit(close){
            if(close === true){
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
                return;
            }
            if(this.handlerClose()){
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
            }
        },
        //更新数据
        updateData(code,status){
            let This = this;
            $.ajax({
                type: "POST",
                contentType: 'application/json',
                url: contextPath + "/saleBillController/update",
                data: JSON.stringify({documentNo: code, documentStatus: status}),
                dataType: "json",
                success: function (data) {
                    var msg = "审核"
                    if (status === 1) {
                        msg = "驳回";
                    }
                    if (data.code === "100100") {
                        This.$Modal.success({
                            title: "提示",
                            content: msg + "成功!"
                        });
                        This.saleBillVo.documentStatus = data.data.documentStatus;
                        This.saleBillVo.updateName = data.data.updateName;
                        This.saleBillVo.updateTime = data.data.updateTime;
                        This.saleBillVo.auditName = data.data.auditName;
                        This.saleBillVo.auditTime = data.data.auditTime;
                        //驳回到暂存
                        if (This.saleBillVo.documentStatus === 1) {
                            //附件
                            This.isEdit('Y');
                            //设置保价费,邮寄费,检测费不可修改
                            This.isUpdateDisable=false;
                            //可修改时判空保价费,邮寄费,检测费
                            This.setValueNull();
                        }
                    } else {
                        This.$Modal.error({
                            title: "提示",
                            content: msg + "失败!"
                        });
                    }
                },
                error: function (err) {
                    This.$Modal.error({
                        title: "提示",
                        content: "服务器出错"
                    });
                }
            })
        },
        //生成单据编号
        getFieldCode(){
            let This = this;
            $.ajax({
                type: "POST",
                url: contextPath + "/saleBillController/getFieldCode",
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        This.saleBillVo.documentNo = data.data;
                    }else {
                        This.$Modal.error({
                            title: "提示",
                            content: "自动生成单据编号异常,请联系管理员!"
                        });
                    }
                },
                error: function (err) {
                    This.$Modal.error({
                        title: "提示",
                        content: "服务器出错!"
                    });
                }
            });
        },
        //商品明细组件初始化处理
        initOrder(data){
            this.goodList = data.saleBillGoodsDetailList;
        },
        //显示商品明细
        showProductDetail(index) {
            this.selectedIndex = index;
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
        //商品明细确认回调
        modalSure(e) {
            console.log(e)
        },
        //商品明细取消回调
        modalCancel(e) {
        },
        //商品详情点击确定跟取消的回调
        productDetailModalClick(e) {
            //this.productDetailList 分录行数组，
            //this.selectedIndex 选中行索引；
            console.log(e)
            //写法固定
            if (this.goodList[this.selectedIndex].goodsMainType === 'attr_ranges_goods') {
                Object.assign(this.goodList[this.selectedIndex], {
                    tBaseBomEntity: e,
                    assistAttrs: null,
                    overEdit: true
                });
            } else {
                Object.assign(this.goodList[this.selectedIndex], {
                    assistAttrs: e,
                    tBaseBomEntity: null,
                    overEdit: true
                })
            }
        },
        isHintShow() {

        },
        //获取并设置当前组织
        getOrganization(){
            let This = this;
            $.ajax({
                type: "POST",
                async: false,
                url: contextPath + "/saleBillController/getOrganization",
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        This.organ = data.data;
                    }else {
                        This.$Modal.error({
                            title: "提示",
                            content: "获取组织信息异常,请联系管理员!"
                        });
                    }
                },
                error: function (err) {
                    This.$Modal.error({
                        title: "提示",
                        content: "服务器出错!"
                    });
                }
            });
        },
        //跳转出库单
        jumpOutStock(outStockNo){
            window.parent.activeEvent({
                name: '销售出库单-查看',
                url: contextPath + '/sale/saleoutstock/saleoutstock-add.html',
                params: {
                    type: 'other',
                    data: outStockNo
                }
            });
        },
        //获取结算单数据
        getSaleBillInfo(documentNo){
            let This = this;
            let tableInfo={};
            $.ajax({
                type: "POST",
                async: false,
                url: contextPath + "/saleBillController/getSaleBillVoInfo",
                data:JSON.stringify({documentNo: documentNo}),
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    console.log(data.data);
                    if (data.code === "100100") {
                        tableInfo = data.data;
                        if(tableInfo.documentStatus!==1){
                            if(tableInfo.inspectionCost===null){
                                tableInfo.inspectionCost=0;
                            }
                            if(tableInfo.postalCost===null){
                                tableInfo.postalCost=0;
                            }
                            if(tableInfo.totalInsurancePrice===null){
                                tableInfo.totalInsurancePrice=0;
                            }
                        }
                        if(tableInfo.totalOtherAmount===null){
                            tableInfo.totalOtherAmount=0;
                        }
                        if(tableInfo.currentReceiptAmount===null){
                            tableInfo.currentReceiptAmount=0;
                        }
                        if(tableInfo.lastReceiptAmount===null){
                            tableInfo.lastReceiptAmount=0;
                        }
                        if(tableInfo.currentOtherAmount===null){
                            tableInfo.currentOtherAmount=0;
                        }
                        if(tableInfo.totalReceiptAmount===null){
                            tableInfo.totalReceiptAmount=0;
                        }
                        if(tableInfo.saleBillGoodsInfoList===null) {
                            tableInfo.saleBillGoodsInfoList=[];
                        }
                        if(tableInfo.saleBillGoodsDetailList===null) {
                            tableInfo.saleBillGoodsDetailList=[];
                        }
                        if(tableInfo.saleBillGoldInfoList===null) {
                            tableInfo.saleBillGoldInfoList=[];
                        }
                        if(tableInfo.saleBillStoneInfoList===null) {
                            tableInfo.saleBillStoneInfoList=[];
                        }
                        if(tableInfo.saleBillAccessoryInfoList===null) {
                            tableInfo.saleBillAccessoryInfoList=[];
                        }
                        if(tableInfo.saleBillInventoryList===null) {
                            tableInfo.saleBillInventoryList=[];
                        }
                        if(tableInfo.saleBillInventoryList!==null&&tableInfo.saleBillInventoryList.length>0){
                            tableInfo.saleBillInventoryList.forEach((item)=>{
                                if(item.isBill===1){
                                    item.isBill='否';
                                }else if(item.isBill===2){
                                    item.isBill='是';
                                }
                            })
                        }
                    }else {
                        This.$Modal.error({
                            title: "提示",
                            content: "系统繁忙，请稍后再试!"
                        });
                    }
                },
                error: function (err) {
                    This.$Modal.error({
                        title: "提示",
                        content: "服务器出错!"
                    });
                }
            });
            return tableInfo;
        },
        //设置分录行合计
        setLineInfoAmount(){
            //1.设置出库汇总销售金额合计
            this.saleBillVo.saleBillOutStockCollectList.forEach((item)=>{
                this.outStockTotalAmount+=item.totalAmount;
            });
            //2.设置商品简述数量,重量,销售金额合计
            this.saleBillVo.saleBillGoodsInfoList.forEach((item)=>{
                this.goodsInfoTotalNum+=item.num;
                this.goodsInfoTotalWeight+=item.totalWeight;
                this.goodsInfoTotalAmount+=item.totalAmount;
            });
            //3.设置合计用料明细重量合计
            if(this.saleBillVo.saleBillGoldInfoList!==null){
                this.saleBillVo.saleBillGoldInfoList.forEach((item)=>{
                    this.goldInfoTotalWeight+=item.consumptionWeight;
                });
            }

        },
        //获取和设置结算单数据,并且设置分录行合计
        setLineInfo(){
            //1.获取结算单数据
            let tableInfo = this.getSaleBillInfo(this.inParams.documentNo);
            this.saleBillVo=tableInfo;
            //2.设置分录行合计
            this.setLineInfoAmount();
        },
        //根据出库汇总信息，获取商品简述,明细,用料,用石,配件明细
        getSaleBillOtherInfo(){
            let This = this;
            $.ajax({
                type: "POST",
                async: false,
                url: contextPath + "/saleBillController/getSaleBillOtherInfo",
                data:JSON.stringify(This.saleBillVo.saleBillOutStockCollectList),
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    console.log(data.data);
                    if (data.code === "100100") {
                        if(data.data.saleBillGoodsInfoList!==null){
                            This.saleBillVo.saleBillGoodsInfoList=data.data.saleBillGoodsInfoList;
                        }
                        if(data.data.saleBillGoodsDetailList!==null){
                            This.saleBillVo.saleBillGoodsDetailList=data.data.saleBillGoodsDetailList;
                        }
                        if(data.data.saleBillGoldInfoList!==null){
                            This.saleBillVo.saleBillGoldInfoList=data.data.saleBillGoldInfoList;
                        }
                        if(data.data.saleBillStoneInfoList!==null) {
                            This.saleBillVo.saleBillStoneInfoList=data.data.saleBillStoneInfoList;
                        }
                        if(data.data.saleBillAccessoryInfoList!==null) {
                            This.saleBillVo.saleBillAccessoryInfoList=data.data.saleBillAccessoryInfoList;
                        }
                        if(data.data.saleBillInventoryList!==null&&data.data.saleBillInventoryList.length>0){
                            This.saleBillVo.saleBillInventoryList=data.data.saleBillInventoryList;
                            This.saleBillVo.saleBillInventoryList.forEach((item)=>{
                                if(item.isBill===1){
                                    item.isBill='否';
                                }else if(item.isBill===0){
                                    item.isBill='是';
                                }
                            })
                        }
                    }else {
                        This.$Modal.error({
                            title: "提示",
                            content: "系统繁忙，请稍后再试!"
                        });
                    }
                },
                error: function (err) {
                    This.$Modal.error({
                        title: "提示",
                        content: "服务器出错!"
                    });
                }
            });
        },
        //设置本单金料,石料,配件金额
        setAmount(){
            this.inParams.data.forEach((item) => {
                this.saleBillVo.totalLaborCost += item.totalLaborCost;
                this.saleBillVo.totalGoldAmount += item.goldAmount;
                this.saleBillVo.totalStoneAmount += item.stoneAmount;
                this.saleBillVo.totalAccessoryAmount += item.accessoryAmount;
                this.saleBillVo.totalOtherAmount += item.totalOtherAmount;
            });
        },
        //校验【本单保价费】+【本单检测费】+【本单邮寄费】
        checkNum(item, type, floor) {
            htInputNumber(item, type, floor);
            this.setCurrentReceiptAmount();
        },
        setCurrentReceiptAmount(){
            let outStockReceiptAmount = this.getCurrentReceiptAmount();
            //设置本单应收款=取出库单实际销售金额合计+【本单保价费】+【本单检测费】+【本单邮寄费】
            this.saleBillVo.currentReceiptAmount=(parseFloat(outStockReceiptAmount)+
                parseFloat(this.saleBillVo.inspectionCost===null ? 0 :this.saleBillVo.inspectionCost===""?0:this.saleBillVo.inspectionCost)+
                parseFloat(this.saleBillVo.postalCost===null ? 0 :this.saleBillVo.postalCost===""?0:this.saleBillVo.postalCost)+
                parseFloat(this.saleBillVo.totalInsurancePrice===null ? 0 :this.saleBillVo.totalInsurancePrice===""?0:this.saleBillVo.totalInsurancePrice)).toFixed(2);
            //设置本期累计应收款(余额)
            this.setTotalReceiptAmount();
        },
        //设置本期累计应收款(余额)=【上期累计应收款】+【本单应收款】-【本期其他收款】
        setTotalReceiptAmount(){
            this.saleBillVo.totalReceiptAmount=parseFloat(this.saleBillVo.lastReceiptAmount===null ? 0 :this.saleBillVo.lastReceiptAmount===""?0:this.saleBillVo.lastReceiptAmount)+
                parseFloat(this.saleBillVo.currentReceiptAmount===null ? 0 :this.saleBillVo.currentReceiptAmount===""?0:this.saleBillVo.currentReceiptAmount)-
                    parseFloat(this.saleBillVo.currentOtherAmount===null ? 0 :this.saleBillVo.currentOtherAmount===""?0:this.saleBillVo.currentOtherAmount);
        },
        //初始设置本单应收款=取出库单实际销售金额合计
        getCurrentReceiptAmount(){
            let outStockReceiptAmount = 0;
            if(this.inParams.data!=undefined){
                //新增时
                this.inParams.data.forEach((item) => {
                    outStockReceiptAmount += item.totalActualAmount;
                });
            }else {
                //从列表跳转修改时
                outStockReceiptAmount = this.outStockTotalAmount;
            }
            this.saleBillVo.currentReceiptAmount=outStockReceiptAmount;
            return outStockReceiptAmount;
        },
        //新增时获取并设置上期累计应收款
        getLastReceiptAmount(){
            let This = this;
            $.ajax({
                type: "POST",
                async: false,
                url: contextPath + "/saleBillController/getLastReceiptAmount",
                data:{custName:This.saleBillVo.custName},
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        if(data.data!==null) {
                            This.saleBillVo.lastReceiptAmount=data.data;
                        }else {
                            This.saleBillVo.lastReceiptAmount=0;
                        }
                    }
                },
                error: function (err) {
                    This.$Modal.error({
                        title: "提示",
                        content: "服务器出错!"
                    });
                }
            });
        },
        //新增时获取并设置本期其他收款
        getCurrentOtherAmount(){
            let This = this;
            $.ajax({
                type: "POST",
                async: false,
                url: contextPath + "/saleBillController/getCurrentOtherAmount",
                data:{customerId:This.saleBillVo.customerId},
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        if(data.data!==null) {
                            This.saleBillVo.currentOtherAmount=data.data;
                        }else {
                            This.saleBillVo.currentOtherAmount=0;
                        }
                    }
                },
                error: function (err) {
                    This.$Modal.error({
                        title: "提示",
                        content: "服务器出错!"
                    });
                }
            });
        },
        //新增时计价方式特殊处理-标签价折扣(1)---设置本单工费,其他费,金料,石料,配件金额
        pricingMethodDeal(){
            if(this.saleBillVo.pricingMethod==='1') {
                //设置用料,用石,配件明细页签不可用
                this.isTabShow=true;
                //设置本单工费,本单金料金额,本单石料金额,本单配件金额为0
                this.saleBillVo.totalLaborCost=0;
                this.saleBillVo.totalGoldAmount=0;
                this.saleBillVo.totalStoneAmount=0;
                this.saleBillVo.totalAccessoryAmount=0;
                this.inParams.data.forEach((item) => {
                    this.saleBillVo.totalOtherAmount += item.totalOtherAmount;
                });
            }else{
                //设置本单工费,其他费,金料,石料,配件金额
                this.setAmount();
            }
        },
        //接收传入的参数
        getInputParams(){
            this.inParams = window.parent.params.params;
            this.openName = window.parent.params.name;
            this.openTime = window.parent.params.openTime;
        },
        //转换并设置页面出库汇总
        setOutStockList(){
            let outStockList = [];
            this.inParams.data.forEach((item) => {
                let outStock = {};
                outStock.sourceDocumentNo = item.outStockNo;
                outStock.outStockTime = item.createTime;
                outStock.totalNum = item.totalNum;
                outStock.totalWeight = item.totalWeight;
                outStock.totalAmount = item.totalActualAmount;
                outStock.pricingMethod = item.pricingMethod;
                outStockList.push(outStock);
            });
            //设置出库汇总
            this.saleBillVo.saleBillOutStockCollectList = outStockList;
        },
        //设置客户信息
        setCustomerInfo(){
            this.saleBillVo.custNo = this.inParams.data[0].custNo;
            this.saleBillVo.customerId = this.inParams.data[0].customerId;
            this.saleBillVo.custName = this.inParams.data[0].custName;
        },
        handlerClose(){
            if((!this.saleBillVo.documentStatus || this.saleBillVo.documentStatus == 1) && (this.htHaveChange || accessVm.htHaveChange)){
                this.$nextTick(()=>{
                    this.$refs.closeModalRef.showCloseModal();
                });
                return false;
            }
            return true;
        },
        closeModal(type){
            if(type === 'yes'){//提交数据
                this.save();
                this.exit(true);
            }else if(type === 'no'){//关闭页面
                this.exit(true);
            }
        },
        htTestChange(){
            this.htHaveChange = true;
        }
    },
    created() {
        window.handlerClose = this.handlerClose;
    },
    mounted() {
        //接收传入的参数
        this.getInputParams();
        //获取当前组织
        this.getOrganization();
        //查看或修改
        if (this.inParams.type === "update") {
            //获取和设置结算单数据,并且设置分录行合计
            this.setLineInfo();
            //设置保价费,邮寄费,检测费是否可修改
            if (this.saleBillVo.documentStatus !== 1) this.isUpdateDisable = true;
            //是否显示附件上传按钮
            this.isEdit(this.saleBillVo.documentStatus === 1 ? 'Y' : 'N');
            this.getAccess(this.saleBillVo.id, this.boeType);
            //计价方式(标签价折扣)特殊处理-设置用料,用石,配件明细页签不可用
            if (this.saleBillVo.pricingMethod === '1') this.isTabShow = true;
        }
        //新增
        if (this.inParams.type === "add") {
            //生成单据编号
            this.getFieldCode();
            //显示附件上传按钮
            this.isEdit('Y');
            //转换并设置页面出库汇总
            this.setOutStockList();
            //根据出库汇总信息，获取商品简述,明细,用料,用石,配件明细
            this.getSaleBillOtherInfo();
            //设置分录行合计
            this.setLineInfoAmount();
            //结算日期设置默认当前日期
            this.saleBillVo.billTime = new Date().format("yyyy-MM-dd HH:mm:ss");
            //设置客户信息
            this.setCustomerInfo();
            //计价方式
            this.saleBillVo.pricingMethod = this.inParams.data[0].pricingMethod;
            //计价方式特殊处理-标签价折扣(1)---以及设置本单工费,其他费,金料,石料,配件金额
            this.pricingMethodDeal();
            //初始设置本单应收款=取出库单实际销售金额合计
            this.getCurrentReceiptAmount();
            //获取并设置上期累计应收款
            this.getLastReceiptAmount();
            //设置本期其他收款
            this.getCurrentOtherAmount();
            //设置本期累计应收款(余额)=【上期累计应收款】+【本单应收款】-【本期其他收款】
            this.setTotalReceiptAmount();
        }
        //商品明细是否显示
        if(this.saleBillVo.saleBillGoodsDetailList!==null&&this.saleBillVo.saleBillGoodsDetailList.length===0){
            this.isDetailTabShow=true;
        }
        //商品明细组件初始化处理
        this.initOrder(this.saleBillVo);
        //设置当前组织
        this.saleBillVo.organizationName = this.organ.currentOrganization.orgName;
        this.saleBillVo.organizationId = this.organ.userCurrentOrganId;
    }
});