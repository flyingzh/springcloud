var vm = new Vue({
    el: "#app",
    data: {
        htHaveChange: false,
        openTime: '',
        isSearchHide: true,
        frameTab: false,
        isTabulationHide: true,
        generalList:[],
        indifferenceRecordingList:[],
        differenceRecordingList:[],
        inputNumber:"",
        goodsMainType:'',
        isShow:false,
        approvalTableData:[],
        //审批类型
        modalType: '',
        //审批进度条
        stepList: [],
        //控制弹窗显示
        modalTrigger: false,
        //审核标记
        isStampShow:false,
        type:"INVENTORY_LOSS",
        body:{
            profitLossNo:null,
            planNo:null,
            invertoryUserName:null,
            inventoryType:null,
            warehouseId:null,
            custStyleType:null,
            custStyleTypeName:null,
            organizationId:null,
            invertoryTime:null,
            orgName:null,
            warehouseName:null,
            goodsTypeName:null,
            profitLossMark:null,
            //区分盘盈盘亏单
            documentStatus:null,
            examineVerifyName:null,
            examineVerifyTime:null,
            submitName:null,
            submitTime:null,
        },
        invertoryTime:[],
        detailIndex:null,
        profitLossReason:null,
        profitLossMeasure:null,
        goodsBarCode:null,
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
                value: 4,
                name: '一般性盘亏单'
            },{
                value: 5,
                name: '称差范围内的盘亏单'
            },
            {
                value: 6,
                name: '称差范围外的盘亏单',
            },
        ],
    },
    methods:{
        htTestChange(){
            this.htHaveChange = true;
            console.log(333)
        },
        reload(){
            let _this = this;
            _this.reload_inventory_list = !_this.reload_inventory_list;
        },
        // 此处三个方法是附件组件 只需要直接copy即可
        // 附件是编辑还是查看 传入Y表示编辑，传入N表示查看,页面初始化的时候就需要调用这个方法
        isEdit: function (isEdit) {
            eventHub.$emit('isEdit', isEdit);
        },
        // 保存附件 保存的时候调用
        saveAccess: function (id, type) {
            eventHub.$emit('saveFile', id, type);
        },
        // 查找附件 查看的时候调用
        getAccess: function (id, type) {
            eventHub.$emit('queryFile', id, type);
        },

        clickTr(index){
        this.detailIndex = index
        },
        tabsSwitch(){
        },
        //商品明细
        detailAction(item,index){
            let This = this;
            let goodsId

            this.goodsMainType = this.body.inventoryDataVoList[index].goodsMainType;
            goodsId = this.body.inventoryDataVoList[index].goodsId;


            var ids = {
                goodsId: goodsId,
                //goodsId: This.productDetailList[index].id,
                commodityId:  this.body.inventoryDataVoList[index].commodityId,
                documentType: "W_STOCK_IN"
            };

            Object.assign(This.productDetailModal, {
                showModal: true,
                ids: ids
            });
            This.$nextTick(() => {
                This.$refs.modalRef.getProductDetail();
            });
        },
        modalSure(e) {
            this.productDetailModalClick(e);
        },

        modalCancel(e) {
            // this.productDetailModalClick(e);
        },
        //盈亏原因弹框"保存"
        modalReasonDone(){
            this.htHaveChange = true;
            console.log(333)
            this.body.inventoryDataVoList[this.detailIndex].profitLossReason = this.profitLossReason;
            this.body.inventoryDataVoList[this.detailIndex].profitLossMeasure = this.profitLossMeasure;
        },
        //盈亏原因弹框"取消"
        modalReasonCancel(){
        },
        //盈亏原因显示
        showTheReason(index){
            this.detailIndex = index;
            this.frameTab = true
            this.profitLossReason = this.body.inventoryDataVoList[index].profitLossReason;
            this.goodsBarCode = this.body.inventoryDataVoList[index].goodsBarCode;
            this.profitLossMeasure = this.body.inventoryDataVoList[index].profitLossMeasure;
        },
        save(){
            let This = this;
            window.top.home.loading('show');
            $.ajax({
                url: contextPath + '/profitLossController/save',
                method: 'post',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(This.body),
                success: function (data) {
                    This.htHaveChange = false;
                    if (data.code === '100100') {
                        This.$Modal.success({
                            title: '提示信息',
                            content: data.msg,
                        });
                        This.saveAccess(This.body.profitLossNo, This.type);

                        This.getAccess(This.body.profitLossNo, This.type);
                        This.isEdit('Y');
                        window.top.home.loading('hide');
                    } else {
                        This.$Modal.warning({content: res.msg,title: '提示信息'});
                        window.top.home.loading('hide');
                    }
                }
            });
        },
        //提交
        submit(){
            let This = this;
            This.body.documentStatus = 2;
            window.top.home.loading('show');
            //保存
           let ajax = $.ajax({
                url: contextPath + '/profitLossController/save',
                method: 'post',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(This.body),
               success:function () {
                   This.htHaveChange = false;
               }
            });

           let ajax1 = ajax.then(function (data){
               if (data.code === '100100') {
                   return $.ajax({
                       url: contextPath + '/profitLossController/submit',
                       method: 'post',
                       contentType: 'application/json;charset=utf-8',
                       data: JSON.stringify({"documentNo":This.body.profitLossNo,"type":This.type}),
                   });
               } else {
                   This.$Modal.warning({content: res.msg,title: '提示信息'});
                   window.top.home.loading('hide');
               }
            });

           ajax1.done(function (res) {
               if (res.code === '100100') {
                   This.isShow = true;
                   This.body.submitName = res.data.submitName;
                   This.body.submitTime = res.data.submitTime;

                   This.$Modal.success({
                       title: '提示信息',
                       content: res.msg,
                   });
                   if(res.data.documentStatus === 4){
                       This.isStampShow = true;
                   }

                   $(".is-disabled-add").css("pointer-events", "none").css({"color": "#bbbec4"})
                   $(".is-disabled-submit").css("pointer-events", "none").css({"color": "#bbbec4"})
                   This.saveAccess(This.body.profitLossNo, This.type);
                   This.isEdit('N');
                   window.top.home.loading('hide');
               } else {
                   This.$Modal.info({content: res.msg,title: '提示信息'});
                   window.top.home.loading('hide');
               }
           }).fail(function (error) {
               This.$Modal.warning({
                   title: '提示信息',
                   content: '服务器出错了！'
               });
               window.top.home.loading('hide');
           })
            //提交


        },
        toProductDetail(value){
            window.parent.activeEvent({
                name: '商品',
                url: contextPath +'/base-data/commodity/commodity-info.html',
                params:{id: value.rows.productId, type: 'skip'}
            });
        },
        //审核
        approval(){
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
        autoApproveOrReject(result) {
            let This = this;
            window.top.home.loading('show');
            $.ajax({
                url: contextPath + '/profitLossController/submitApproval?submitType=1',
                method: 'post',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify({
                    receiptsId: This.body.profitLossNo,
                    approvalResult: (This.modalType == 'reject' ? 1 : 0),
                }),
                success: function (res) {
                    if (res.code === '100100') {
                        This.returnShow(This.body.profitLossNo)
                    } else {
                        This.$Modal.info({content: res.msg,title: '提示信息'});
                    }
                }
            });
            window.top.home.loading('hide');


        },
        approvalOrRejectCallBack(res){
            let This = this;

            if(res.result.code == '100100'){
                This.body.documentStatus = res.result.data;

                if(This.body.documentStatus == 1){
                    //驳回到原点，暂存
                    This.isShow = false;
                    This.isEdit('Y');
                    $(".is-disabled-submit").css({"pointer-events":"auto "}).css({"color": "#495060"})
                    $(".is-disabled-add").css({"pointer-events":"auto "}).css({"color": "#495060"})
                }else if(This.body.documentStatus == 2){
                    //待审核

                }else if(This.body.documentStatus == 4){
                    //审核完成
                    This.returnShow(This.body.profitLossNo)
                }else if(This.body.documentStatus == 5){
                    //审核驳回

                }
                //This.ajaxUpdateDocStatusById(This.body.id,docStatus);
            }

        },
        //退出
        exit(close) {
            if(close === true){
                window.parent.closeCurrentTab({name: '新增盘亏单', openTime: this.openTime, exit: true});
                return;
            }

            if(this.handlerClose()){
                window.parent.closeCurrentTab({name: '新增盘亏单', openTime: this.openTime, exit: true});
            }
        },
        htprint(){
            htPrint()
        },
        returnShow(profitLossNo){
            let This = this
            window.top.home.loading('show');
            $.ajax({
                url: contextPath + '/profitLossController/queryProfitLossByDocumentNo',
                method: 'post',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify({
                    profitLossNo:profitLossNo,
                }),
                success: function (res) {
                    if (res.code === '100100') {
                        This.body = res.data;
                        This.getAccess(This.body.profitLossNo, this.type);
                        if (This.body.documentStatus !== 1){
                            $(".is-disabled-add").css("pointer-events", "none").css({"color": "#bbbec4"})
                            $(".is-disabled-submit").css("pointer-events", "none").css({"color": "#bbbec4"})

                            This.isEdit('N');
                            This.isShow = true;
                        }else{
                            This.isEdit('Y');
                        }
                        if (This.body.documentStatus === 4){
                            $(".is-disabled").css("pointer-events", "none").css({"color": "#bbbec4"})
                            This.isStampShow = true;
                        }
                        This.getAccess(This.body.profitLossNo, This.type);

                    } else {
                        This.$Modal.info({content: res.msg,title: '提示信息'});
                    }
                }
            });
            window.top.home.loading('hide');
        },
        closeModal(type){
            if(type === 'yes'){//提交数据
                this.save();
                this.exit(true);
            }else if(type === 'no'){//关闭页面
                this.exit(true);
            }
        },
        handlerClose(){
            if((!this.body.documentStatus || this.body.documentStatus == 1) && (this.htHaveChange || accessVm.htHaveChange)){
                this.$nextTick(()=>{
                    this.$refs.closeModalRef.showCloseModal();
                });

                return false;
            }

            return true;
        },
    },

    created(){
        window.handlerClose = this.handlerClose;
    },
    mounted() {
        this.param = window.parent.params.params;
        this.openTime = window.parent.params.openTime;
        let params = window.parent.params.params;
        this.returnShow(params.profitLossNo)
        console.log("ok")
    }
});