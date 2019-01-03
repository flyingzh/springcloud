var vm = new Vue({
    el: '#handle',
    data() {
        let This = this;
        return {
            openTime: '',
            boeType: 'O_MATERIALS_REVERT',
            isSearchHide: true, //搜索栏
            isTabulationHide: true, // 列表
            reload: false,
            dateArr:'',
            employees:[],
            shipTypeList:[],//物流
            selectedIndex: 0,
            //    审批相关
            modalTrigger: false,
            modalType: '',
            //审批进度条
            steplist: [],
            approvalTableData: [],
            isSaveDisable:false,
            revert:{
                id:'',
                dataSources:2,//数据来源
                orderStatus:'',//单据状态
                //基本信息-----------
                orderNo:'',
                revertDate:'',
                // goodsTypeName:'',//商品类型
                // goodsGroupPath:'',//商品类型路径
                organizationId:'',
                organizationName:layui.data('user').currentOrganization.orgName,
                salesmanName:'',//业务员
                salesmanId:'',
                customerId:'',//客户ID
                customerName:'',//客户name
                remark:'',
                logisticsMode:'',//物流方式
                // commodityId:'',//商品ID
                //其他----------
                createName:'',
                createTime:'',
                updateName:'',
                updateTime:'',
                auditorId: '',
                auditor:'',
                auditTime:'',
                // 数量，采购重量合计
                count:'',
                weight:'',
                //明细信息----------
                goodsList:[],
            },
            //上层表单校验
            revertValidate:{
                revertDate:[{required: true}],//日期
                logisticsMode:[{required: true}],//物流方式
            },
            productDetailList: [],
            productDetailModal: {
                dataSourceType: true, //是否来自上游；
                dataSource: null,
                showModal: false,
                ids: {
                    goodsId: '',
                    commodityId: '',
                    documentType: 'O_MATERIALS_REVERT'
                }
            }

        }
    },
    methods: {
        verifyRequire(){
            let isCustomerPass;
            this.$refs['revert'].validate((valid)=>{
                if(valid){
                    isFormPass = true;
                } else {
                    isFormPass = false;
                }
            })
            if(!isFormPass){
                return false;
            } else {
                return true;
            }
            // let res = true;
            // let basicInfo = {
            //    '日期':this.revert.revertDate,
            //    '物流方式':this.revert.logisticsMode
            // };
            // for(let key in basicInfo) {
            //     if(!basicInfo[key]) {
            //         this.$Modal.warning({
            //             title:'提示信息',
            //             content:`您还没有填写${key}`
            //         });
            //         res = false;
            //         break;
            //     }
            // }
            // return res;
        },
        handlerClose(){
            if((!this.revert.orderStatus || this.revert.orderStatus == 1) && (this.htHaveChange || accessVm.htHaveChange)){
                this.$nextTick(()=>{
                    this.$refs.closeModalRef.showCloseModal();
                });

                return false;
            }

            return true;
        },
        closeModal(type){
            if(type === 'yes'){//提交数据
                this.save('save');
                this.cancel(true);
            }else if(type === 'no'){//关闭页面
                this.cancel(true);
            }
        },
        cancel(close) {
            if(close === true){
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
                return;
            }
            if(this.handlerClose()){
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
            }
        },
        htTestChange(){
            this.htHaveChange = true;
        },
        save(type){
            console.log(type,this.revert.orderStatus);
            console.log(this.revert);
            this.isSaveDisable = true;
            //判断单据状态,1为暂存
            if(this.revert.orderStatus>1){
                this.isSubmitDisable = true;
                return;
            }
            if(this.revert.orderNo==='' || this.revert.orderNo===null){//判断是否返回单据编号，有则是新增，无则修改
                if(type === 'save'){//暂存
                    this.revert.orderStatus = 1
                    this.addDocument('save');
                }else if(type === 'submit'){//提交
                    //校验,制灰按钮（保存，提交）
                    if(this.verifyRequire()){
                        this.revert.orderStatus = 2;
                        this.addDocument('submit');
                    }else{
                        this.isSaveDisable = false;
                    }
                }
            }else {//修改
                if(type === 'save'){
                    this.updateDocument('save');
                }else if(type === 'submit'){
                   if(this.verifyRequire()){
                       this.revert.orderStatus = 2;
                       this.updateDocument('submit')
                   }else{
                       this.isSaveDisable = false;
                   }
                }
            }
        },
        updateDocument(type){
            let This = this;
            let postData = This.handlerDataToPost();
            if(This.revert.goodsList.length === 0){
                postData.goodsList = [];
            }
            window.top.home.loading('show');
            $.ajax({
                type: 'post',
                async: true,
                contentType: 'application/json;charset=UTF-8',
                data: JSON.stringify(postData),
                url: contextPath + '/toldmaterialrevert/update',
                dataType: 'json',
                success: function (data) {
                    window.top.home.loading('hide');
                    This.htHaveChange = false;
                    if(data.code === '100100') {
                        // 调用方法保存附件
                        This.saveAccess(data.data.id,This.boeType);
                        This.$Modal.success({
                            title:'提示信息',
                            content:'更新成功！'
                        })
                        //查询附件
                        This.getAccess(This.revert.id,This.boeType);
                        This.revert.updateName = data.data.updateName;
                        This.revert.updateTime = data.data.updateTime;
                        Object.assign(This.revert, {...data.data});
                        This.revert.goodsList = data.data.goodsList;
                        This.productDetailList = This.revert.goodsList;
                        console.log(data.data.orderStatus);
                        //附件禁用
                        This.isEdit(This.revert.orderStatus == 1?'Y':'N');
                        if (data.data.orderStatus > 1){
                            This.isSaveDisable = true;
                        } else {
                            This.isSaveDisable = false;
                        }
                    } else {
                        This.$Modal.warning({
                            title:'提示信息',
                            content:data.msg
                        })
                        This.isSaveDisable = false;
                    }
                },
                error: function (e) {
                    console.log(e);
                }
            });
        },
        addDocument(type){
            let This = this;
            let postData = This.handlerDataToPost();
            if(This.revert.goodsList.length === 0){
                postData.goodsList = [];
            }
            window.top.home.loading('show');
            $.ajax({
                type: "POST",
                contentType: 'application/json;charset=UTF-8',
                url: contextPath + "/toldmaterialrevert/save",
                data: JSON.stringify(postData),
                dataType: "json",
                success: function (data) {
                    window.top.home.loading('hide');
                    if (data.code === '100100') {
                        This.$Modal.success({
                            title:'提示信息',
                            content: '提交成功',
                        });
                        Object.assign(This.revert, {...data.data});
                        This.productDetailList = data.data.goodsList;
                        This.revert.createTime = data.data.createTime;
                        This.revert.createName = data.data.createName;
                        // 调用方法保存附件
                        This.saveAccess(data.data.id,This.boeType);
                        console.log(This.revert.orderStatus)
                        This.isEdit(This.revert.orderStatus == 1?'Y':'N');
                        if (data.data.orderStatus > 1){
                            This.isSaveDisable = true;
                        } else {
                            This.isSaveDisable = false;
                        }
                    } else {
                        This.$Modal.warning({
                            title:'提示信息',
                            content: '提交失败',
                        });
                        This.isSaveDisable = false;
                    }
                },
                error: function () {
                    window.top.home.loading('hide');
                    This.$Modal.warning({
                        title:'提示信息',
                        content: '服务器出错啦!',
                    });
                }
            })
        },
        querySingle(value){
            let This = this;
            if (!value) {
                return;
            }
            $.ajax({
                type: "POST",
                url: contextPath + '/toldmaterialrevert/info/' + value,
                dataType: "json",
                success: function (data) {
                    if (data.code !== '100100') {
                        this.$Modal.warning({
                            title:'提示信息',
                            content: '服务器出错',
                        });
                        return
                    }
                    Object.assign(This.revert, {...data.data});
                    This.revert.goodsList = data.data.goodsList;
                    This.productDetailList = This.revert.goodsList;
                    if(This.revert.orderStatus>1){
                        This.isSaveDisable = true;
                    }
                    This.isEdit(This.revert.orderStatus == 1?'Y':'N');
                    This.getAccess(This.revert.id,This.boeType);
                },
                error: function () {
                    this.$Modal.warning({
                        title:'提示信息',
                        content:"网络异常,请联系技术人员！",
                    })
                }
            })
        },
        //顶部菜单栏
        saveClick(type) {
            console.log(type,this.revert);
        },
        modalSure(e) {
        },
        modalCancel(e) {

        },
        approval() {
            let _this = this;
            _this.modalType = 'approve';
            _this.modalTrigger = !_this.modalTrigger;
        },
        reject() {
            let _this = this;
            _this.modalType = 'reject';
            _this.modalTrigger = !_this.modalTrigger;
        },
        showList() {
            window.parent.activeEvent({name: '旧料返料列表',url: contextPath + '/oldmaterial/revert/revert-list.html'})
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
        approvalOrRejectCallBack(res){
            let This = this;
            if (res.result.code == '100100') {
                let data = res.result.data;
                This.revert.orderStatus = data.orderStatus;
                if (This.revert.orderStatus === 4) {
                    This.revert.auditor = data.auditor;
                    This.revert.auditorId = data.auditorId;
                    This.revert.auditTime = data.auditTime;
                }
                if(This.revert.orderStatus === 1){//驳回到暂存
                    This.isSaveDisable = false;
                }
                This.isEdit(This.revert.orderStatus == 1 ? 'Y' : 'N');
            } else {
                this.$Modal.info({
                    content: res.result.msg,
                    title: '警告'
                })
            }
        },

        //计算列合计
        sum(list, key) {
            return list.reduce((sum, el) => {
                if (!el[key]) {
                return 0 + sum;
            };
            if (isNaN(el[key])) {
                el[key] = ''
            }
            return parseFloat(el[key]) + sum;
        }, 0)
        },
        queryEmp() {
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
            console.log(e);
            this.revert.salesmanId = e.value;
            var le = e.label;
            this.revert.salesmanName = le.substring(le.lastIndexOf("-")+1,le.length);
            this.htTestChange();
        },
        generateReportByIds(params){
            let This = this;
            $.ajax({
                url: contextPath + '/toldmaterialrevert/produceDocument',
                method: 'post',
                dataType: "json",
                data: params,
                success: function (data) {
                    if (data.code === '100100') {
                       console.log(data.data);
                       This.revert.goodsList = data.data.goodsList;//分录行
                        This.productDetailList = This.revert.goodsList;
                       This.showBasicInfo(data.data);//基本信息
                        This.isEdit('Y');
                    } else {
                        // layer.alert(data.msg, {icon: 0});
                        This.$Modal.warning({
                            title:'提示信息',
                            content:data.msg
                        })
                    }
                },
                error: function (e) {
                    // layer.alert('单据生成失败！', {icon: 0});
                    This.$Modal.warning({
                        title:'提示信息',
                        content:'单据生成失败！'
                    })
                }
            });
        },
        //上层基本信息渲染
        showBasicInfo(params) {
            this.revert.orderNo = params.orderNo;
            this.revert.revertDate = params.revertDate;//日期
            this.revert.organizationId = params.organizationId;
            // this.revert.salesmanName = params.salesmanName;//业务员
            // this.revert.salesmanId = params.salesmanId;
            this.revert.customerId = params.customerId;
            this.revert.customerName = params.customerName;//客户
            this.revert.createName = params.createName;//创建人
            this.revert.createTime = params.createTime;//创建时间
            this.revert.updateName = params.updateName;//修改人
            this.revert.updateTime = params.updateTime;//修改时间
            this.revert.auditor = params.auditor;//审核人
            this.revert.auditTime = params.auditTime;//审核时间
            this.revert.id = params.id; //修改时需要
            this.revert.dataSources = params.dataSources;
            this.revert.orderStatus = params.orderStatus;

        },
        //************************************************************************************
        // showProductDetail(index) {//点击商品明细
        //
        //     // console.log('sourceOrderType',this.productDetailList[index].documentType)
        //     // console.log('sourceGoodsId',this.productDetailList[index].sourceGoodsId)
        //     let ducumentType1 = this.productDetailList[index].documentType
        //     this.selectedIndex = index;
        //     if(!this.productDetailList[index].commodityId){
        //         this.$Modal.error({
        //             content: '还未选择商品，请先选择商品，再选择明细！',
        //         });
        //         return false;
        //     }
        //     let ids;
        //     if(ducumentType1 === 'O_MATERIALS_REVERT'){
        //          ids = {
        //             goodsId: this.productDetailList[index].goodsId,
        //             commodityId: this.productDetailList[index].commodityId,
        //             documentType: 'O_MATERIAL_REVERT'
        //         };
        //     }else if(ducumentType1 === 'O_MATERIALS_RECYCLE'){
        //          ids = {
        //             goodsId: this.productDetailList[index].sourceGoodsId,
        //             commodityId: this.productDetailList[index].commodityId,
        //             documentType: 'O_MATERIALS_RECYCLE'
        //         };
        //     }
        //
        //
        //     Object.assign(this.productDetailModal, {
        //         showModal: true,
        //         ids: ids
        //     });
        //      // if(this.productDetailModal.dataSourceType){//来自上游demo
        //      //     this.productDetailModal.dataSource = {
        //      //         goldParts:  this.productDetailList[this.selectedIndex].goldParts,
        //      //         stonesParts:  this.productDetailList[this.selectedIndex].stonesParts,
        //      //         partParts: this.productDetailList[this.selectedIndex].partParts,
        //      //         materialParts: this.productDetailList[this.selectedIndex].materialParts
        //      //     };
        //      // }
        //     this.$nextTick(() => {
        //         this.$refs.modalRef.getProductDetail();
        //     });
        //     //固定结束
        // },
        //*********************************************************************************************
        showProductDetail(index) {//点击商品明细
            this.selectedIndex = index;//选中行下标
            console.log(this.revert.goodsList[index].commodityId,this.productDetailList[index].documentType);



            let ducumentType1 = this.productDetailList[index].documentType;
            let ids;
            if(ducumentType1 === 'O_MATERIALS_REVERT'){
                ids = {
                    goodsId: this.productDetailList[index].goodsId,
                    commodityId: this.productDetailList[index].commodityId,
                    documentType: 'O_MATERIALS_REVERT'
                };
            }else if(ducumentType1 === 'O_MATERIALS_RECYCLE'){
                ids = {
                    goodsId: this.productDetailList[index].sourceGoodsId,
                    commodityId: this.productDetailList[index].commodityId,
                    documentType: 'O_MATERIALS_RECYCLE'
                };
            }
            let tempData = null;
            if(this.productDetailModal.dataSourceType && !this.revert.id){
                if(this.revert.goodsList[index].goldParts && this.revert.goodsList[index].goldParts.length ==1 ){
                    Object.assign(this.revert.goodsList[index].goldParts[0],{
                        checked:true
                    })
                }
                tempData={};
                Object.assign(tempData, {
                    goldParts:this.revert.goodsList[index].goldParts,
                    stonesParts:this.revert.goodsList[index].stonesParts,
                    partParts:this.revert.goodsList[index].partParts,
                    materialParts:this.revert.goodsList[index].materialParts,
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
            let data = JSON.parse(JSON.stringify(this.revert));
            data.goodsList = [JSON.parse(JSON.stringify(obj))];
            //商品明细数据处理
            htHandlerProductDetail(this.revert.goodsList, data, obj,this.productDetailModal.dataSourceType,'goodsList');
            //可以固定，结束
            this.revert.goodsList.map((item, index)=>{
                //商品分录行赋值
                if(!data.goodsList[index]){
                data.goodsList[index] = {};
            }
            Object.assign(data.goodsList[index], {
                // mrpId:item.mrpId,
                commodityId: item.commodityId,
                // pictureUrl: item.pictureUrl,
                goodsId: item.goodsId, //修改时需要
                orderNo:item.orderNo,
                // purchaseType:item.purchaseType,
                goodsType:item.goodsType,//商品类型
                goodsNo:item.goodsNo,//商品编码
                goodsName: item.goodsName,//商品名称
                weightUnit: item.weightUnit,//计重单位
                weight:item.weight,//重量
                weightUnitId: item.weightUnitId,
                // purchaseWeight:item.purchaseWeight,
                countingUnit:item.countingUnit,//计数单位
                count:item.count,//数量
                countingUnitId:item.countingUnitId,
                // chargeUnit:item.chargeUnit,
                // price: item.price,
                // amount: item.amount,
                styleCategoryId:item.styleCategoryId,
                styleName:item.styleName,
                remark: item.remark,
                goodsMainType:item.goodsMainType, //商品主类型必传
                custStyleCode: item.custStyleCode,
                //隐藏属性
                stoneSection: item.stoneSection,
                stoneClarity: item.stoneClarity,
                stoneColor: item.stoneColor,
                viceStoneWeight: item.viceStoneWeight,
                mainStoneWeight: item.mainStoneWeight,
                goldColor: item.goldColor,
                goldWeight: item.goldWeight,
                detailMark:item.detailMark,
                //----------------------------------------
                sourceOrderId:item.sourceOrderId,
                sourceOrderNo:item.sourceOrderNo,
                sourceOrderType:item.sourceOrderType,
                sourceGoodsId:item.sourceGoodsId,
                goodsTypePath:item.goodsTypePath,
                specification:item.specification,
                pictureUrl:item.pictureUrl

            })


            //数据来源于上游 并且未编辑
            if(this.productDetailModal.dataSourceType && !item.overEdit){
                Object.assign(data.goodsList[index], {
                    //4数组
                    materialParts:item.materialParts,
                    goldParts:item.goldParts,
                    stonesParts:item.stonesParts,
                    partParts:item.partParts
                });
            }
        });
            console.log(data)
            return data;
        },
    },
    created(){
        this.queryEmp();
        window.handlerClose = this.handlerClose;

    },
    watch: {


    },
    computed:{
        totalCount: function() {
            return this.revert.count=this.sum(this.revert.goodsList, "count").toFixed(0);
        },
        totalWeight: function() {
            return this.revert.weight=this.sum(this.revert.goodsList, "weight").toFixed(2);
        },
    },
    mounted(){
        //取数据字典
        this.shipTypeList = getCodeList("jxc_jxc_wlfs");
        let params = window.parent.params.params;
        this.openTime = window.parent.params.openTime;
        console.log(params)
        if(params.type === 'produceDocument'){//上游带过来
            this.generateReportByIds(params.basicInfo);
        }else if(params.type === 'query'){
            this.querySingle(params.id);
            // this.showBasicInfo(params.basicInfo)
        }

    },
})
