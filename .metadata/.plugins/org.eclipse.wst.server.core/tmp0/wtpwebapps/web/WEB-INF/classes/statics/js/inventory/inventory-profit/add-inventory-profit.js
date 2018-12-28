var vm = new Vue({
    el: "#app",
    data: {
        htHaveChange: false,
        openTime:'',
        params:{},
        isStampShow:false,
        isSearchHide: true,
        frameTab: false,
        frameTab1:false,
        isTabulationHide: true,
        isDisabled: false,
        canBeEdited: true,
        selectedIndex:'',
        differenceRecordingList:[],
        boeType: 'INVENTORY_PROFIT',
        //控制弹窗显示
        modalTrigger:false,
        modalType:'',
        //审批进度条
        stepList: [],
        approvalTableData:[],
        inventoryProfit: {
            id:'',
            type:'INVENTORY_PROFIT',
            organizationId:'',
            orgName:'',
            profitLossNo:'',
            planNo:'',
            invertoryUserName:'',
            invertoryTime:'',
            inventoryType:'',
            custStyleTypeName:'',
            profitLossMark:'',
            submitName:'',
            submiTime:'',
            examineVerifyName:'',
            examineVerifyTime:'',
            inventoryDataVoList:[]
            //This.warehouseId = responseData.warehouseId.split(',').map(item=>Number(item));
        },
        inventoryProfitInfo:{
            goodsBarCode:'',
            profitLossReason:'',
            profitLossMeasure:''
        },
        documentStatus:'',
        productDetailList: [],
        productDetailModal: {
            showModal: false,
            ids: {
                goodsId: '',
                commodityId: '',
                documentType: 'W_STOCK_IN'
            }
        },
        selectDocumentType:[
            {
                value: 1,
                label: "一般性盘盈"
            },
            {
                value: 2,
                label: "称差范围内盘盈"
            },
            {
                value: 3,
                label: "称差范围外盘盈"
            }
        ]
    },
    methods:{
        htTestChange(){
            this.htHaveChange = true;
            console.log(333)
        },
        tabsSwitch(){
        },
        modalReasonDone(){
            this.htHaveChange = true;
            console.log(333)
            this.productDetailList[this.selectedIndex].goodsBarCode = this.inventoryProfitInfo.goodsBarCode;
            this.productDetailList[this.selectedIndex].profitLossReason = this.inventoryProfitInfo.profitLossReason;
            this.productDetailList[this.selectedIndex].profitLossMeasure = this.inventoryProfitInfo.profitLossMeasure;
            this.selectedIndex = '';
        },
        modalReasonCancel(){
            this.selectedIndex = '';
        },
        showTheReason(index){

            console.log(index);
            this.selectedIndex = index;

            this.inventoryProfitInfo.goodsBarCode = this.productDetailList[index].goodsBarCode;
            this.inventoryProfitInfo.profitLossReason = this.productDetailList[index].profitLossReason;
            this.inventoryProfitInfo.profitLossMeasure = this.productDetailList[index].profitLossMeasure;
            this.frameTab = true;
        },
        action1(index){
            console.log(index);
            this.selectedIndex = index;
        },
        modalSure(e) {
            this.productDetailModalClick(e);
            this.productDetailModal.showModal = false;
        },
        modalCancel(e) {
            this.productDetailModal.showModal = false;
        },
        showProductDetail(index) {//点击商品明细
            console.log("当前下标：",index);
            let This = this;
            this.selectedIndex = index;
            this.documentStatus = 2;
            //固定开始
            let ids = {
                goodsId: this.productDetailList[index].goodsId,
                commodityId: this.productDetailList[index].commodityId,
                documentType: 'W_STOCK_IN'
            };
            Object.assign(this.productDetailModal, {
                showModal: true,
                ids: ids
            });
            this.$nextTick(() => {
                This.$refs.modalRef.getProductDetail();
            });
            //固定结束
        },
        getInventoryProfitInfo(){
            let This = this;

            let $param = This.params;
            let obj = {};
            if(!$.isEmptyObject($param)){
                obj = {"profitLossNo":$param.params.data};
            }

            $.ajax({
                type: "POST",
                url: contextPath + "/profitLossController/queryProfitLossByDocumentNo",
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(obj),
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        console.log(data.data);

                        This.inventoryProfit = data.data;
                        This.productDetailList = data.data.inventoryDataVoList;

                        if(data.data.profitLossMark === 2){
                            This.inventoryProfit.examineVerifyName = data.data.submitName;
                            This.inventoryProfit.examineVerifyTime = data.data.submitTime;
                        }

                        This.getAccess(data.data.profitLossNo,This.boeType);

                        if(data.data.documentStatus !== 1){
                            This.isDisabled = true;
                            This.isEdit('N');
                        }else{
                            This.isDisabled = false;
                            This.isEdit('Y');
                        }

                        if(data.data.documentStatus === 4){
                            This.isStampShow = true;
                        }else{
                            This.isStampShow = false;
                        }
                    }
                }
            })
        },
        save(){
            let This = this;

            if(This.inventoryProfit.documentStatus !== 1){
                This.$Modal.info({
                    content: '盘盈单已提交!',
                    title:'提示'
                });
                return false;
            }

            window.top.home.loading('show');
            $.ajax({
                type: "POST",
                url: contextPath + "/profitLossController/saveProfitInfo",
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(This.inventoryProfit),
                dataType: "json",
                success: function (data) {
                    This.htHaveChange = false;
                    if (data.code === "100100") {
                        This.saveAccess(data.data.profitLossNo,This.boeType);
                        This.getInventoryProfitInfo();
                        This.$Modal.success({
                            content: '保存成功!',
                            title:'提示信息'
                        });
                        window.top.home.loading('hide');
                        return false;
                    }
                    This.$Modal.warning({
                        content: '保存失败!',
                        title:'提示信息'
                    });
                    window.top.home.loading('hide');
                }
            })
        },
        submit(){
            let This = this;

            if(This.inventoryProfit.documentStatus !== 1){
                This.$Modal.info({
                    content: '盘盈单已提交!',
                    title:'提示信息'
                });
                return false;
            }

            if(This.tableValidate()){
                return false;
            }

            window.top.home.loading('show');
            if(This.inventoryProfit.profitLossMark === 2){
                This.inventoryProfit.documentStatus = 4;
            }else{
                This.inventoryProfit.documentStatus = 2;
            }

            $.ajax({
                type: "POST",
                url: contextPath + "/profitLossController/saveProfitInfo",
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(This.inventoryProfit),
                dataType: "json",
                success: function (data) {
                    This.htHaveChange = false;
                    if (data.code === "100100") {
                        This.saveAccess(data.data.profitLossNo,This.boeType);
                        This.getInventoryProfitInfo();
                        if(This.inventoryProfit.profitLossMark === 2){
                            This.$Modal.success({
                                content: '审核成功!',
                                title:'提示信息'
                            });
                        } else{
                            This.$Modal.success({
                                content: '提交成功!',
                                title:'提示信息'
                            });
                        }
                        window.top.home.loading('hide');
                        return false;
                    }
                    This.$Modal.warning({
                        content: '提交失败!',
                        title:'提示信息'
                    });
                    window.top.home.loading('hide');
                }
            })
        },
        approval(){
            let This = this;
            This.modalType = 'approve';
            This.modalTrigger = !This.modalTrigger;
        },
        reject(){
            let This = this;
            This.modalType = 'reject';
            This.modalTrigger = !This.modalTrigger;
        },
        //审核或者驳回回调
        approvalOrRejectCallBack(res){
            let _this = this;
            if(res.result.code == '100100'){
                _this.inventoryProfit.documentStatus = parseInt(res.result.data);
                _this.getInventoryProfitInfo();
            }
        },
        autoSubmitOrReject(){
            let _this = this;
            $.ajax({
                url: contextPath + '/profitLossController/submitApproval?submitType=1',
                method:'post',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify({
                    receiptsId:_this.inventoryProfit.profitLossNo,
                    approvalResult:(_this.modalType === 'reject'? 1 : 0),
                }),
                success:function (res) {
                    if(res.code === '100100'){
                        _this.inventoryProfit.documentStatus = parseInt(res.data);
                    }else {
                        _this.$Modal.warning({content:res.msg});
                    }
                    _this.getInventoryProfitInfo();
                }
            });
        },
        // 附件是编辑还是查看 传入Y表示编辑，传入N表示查看,页面初始化的时候就需要调用这个方法
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
        htPrint(){
            htPrint();
        },
        handlerClose(){
            if((!this.inventoryProfit.documentStatus ||
                this.inventoryProfit.documentStatus === 1) && (this.htHaveChange || accessVm.htHaveChange)){
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
        exit(close){

            if(close === true){
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
                return false;
            }
            if(this.handlerClose()){
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
            }
        },
        tableValidate(){
            let This = this;
            let validate = {
                profitLossReason:{
                    name: '原因',
                    type: 'string'
                },
                profitLossMeasure:{
                    name: '措施',
                    type: 'string'
                }
            };
            return htValidateRow(this.productDetailList, validate);
        }
    },
    mounted(){
        this.openTime = window.parent.params.openTime;
        this.getInventoryProfitInfo();
    },
    created(){
        let This = this;
        This.params = window.parent.params;
    }
})