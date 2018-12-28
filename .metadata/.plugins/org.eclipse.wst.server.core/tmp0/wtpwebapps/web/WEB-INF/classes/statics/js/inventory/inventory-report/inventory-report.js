var vm = new Vue({
    el: "#app",
    data: {
        htHaveChange: false,
        inventoryType:"",
        isSearchHide: true,
        frameTab: false,
        frameTab1:false,
        isTabulationHide: true,
        tabVal:'name1',
        generalList:[],
        inputNumber:"",
        selectInventoryType: [],
        //审核
        //审核进度条
        stepList: [],
        modalTrigger: false,
        modalType: '',
        isStampShow: false,
        isReasonAndOpinionShow:false,
        approvalTableData: [],
        goodsMainType:'',
        params:'',
        openTime:'',
        goodsBarCode:'',
        //报告盈亏原因
        reportProfitLossReason:'',
        //拟处理意见
        processingAdvice:'',
        selectIndex:'',
        //商品明细弹出窗
        productDetailModal: {
            showModal: false,
            ids: {
                goodsId: '',
                commodityId: '',
                documentType: 'W_EMATERIAL_OUT'
            }
        },
        //表头
        body:{
            docStatus:'',
            reportNo:'',
            goodsTypeName:'',
            generateStatus:0,
            examineVerifyName:'',
            examineVerifyTime:'',
        },
        //差异列表
        differenceRecordingList:[],
        //无差异列表
        unDifferenceRecordingList:[],
    },
    methods:{
        htTestChange(){
            this.htHaveChange = true;
            console.log(333)
        },
        approval() {
            let This = this;

            if (This.body.docStatus === 1 || !This.body.reportNo) {
                This.$Modal.info({
                    title: "提示信息",
                    content: "请先提交单据!"
                });
                console.log(2334, This.body.docStatus)
                return false;
            }
            This.modalType = 'approve';
            This.modalTrigger = !This.modalTrigger;
            console.log(322277, This.body.docStatus)

        },

        reject() {
            let This = this;
            if (This.body.docStatus === 1 || !This.body.reportNo) {
                This.$Modal.info({
                    title: "提示信息",
                    content: "请先提交单据!"
                });
                return false;
            }
            This.modalType = 'reject';
            This.modalTrigger = !This.modalTrigger;

        },

        approvalOrRejectCallBack(res) {
            let This = this;

            if (res.result.code == '100100') {
                This.body.docStatus = res.result.data;

                if (This.body.docStatus == 1) {
                    //驳回到原点，暂存
                    This.isStampShow = false;
                    This.isReasonAndOpinionShow = true;
                    This.body.examineVerifyName = '';
                    This.body.examineVerifyTime = '';
                    This.isEdit('Y');
                    $(".is-submit-disabled").css({"pointer-events": "auto "}).css({"color": '#495060'})
                } else if (This.body.docStatus == 2) {
                    //待审核

                } else if (This.body.docStatus == 3) {
                    //审核中

                } else if (This.body.docStatus == 4) {
                    //审核完成
                    This.isStampShow = true;
                    This.body.examineVerifyName = layui.data('user').username
                    This.body.examineVerifyTime = (new Date()).format("yyyy-MM-dd HH:mm:ss") || '';
                    //$(".is-htPrint").css({"pointer-events": "auto "}).css({"color": '#495060'})
                    $(".is-disabled").css({"pointer-events": "auto "}).css({"color": '#495060'})
                } else if (This.body.docStatus == 5) {
                    //审核驳回

                } else {
                    This.$Modal.warning({
                        content: '审核异常!',
                        title: '提示信息'
                    });
                    return false;
                }
            }
        },

        autoSubmitOrReject(result) {
            let This = this;
            $.ajax({
                url: contextPath + '/entrustOut/submitapproval?submitType=1',
                method: 'post',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify({
                    receiptsId: This.body.reportNo,
                    approvalResult: (This.modalType == 'reject' ? 1 : 0),
                }),
                success: function (res) {
                    if (res.code === '100100') {
                        if (This.body.docStatus == 1) {
                            //驳回到原点，暂存
                            This.isStampShow = false;
                            This.body.examineVerifyName = '';
                            This.body.examineVerifyTime = '';
                            $(".is-submit-disabled").css({"pointer-events": "auto "}).css({"color": '#495060'})
                        } else if (This.body.docStatus == 4) {
                            //审核完成
                            This.isStampShow = true;
                            This.body.examineVerifyName = layui.data('user').username;
                            This.body.examineVerifyTime = (new Date()).format("yyyy-MM-dd HH:mm:ss") || '';
                            $(".is-disabled").css({"pointer-events": "auto "}).css({"color": '#495060'})
                            //$(".is-htPrint").css({"pointer-events": "auto "}).css({"color": '#495060'});
                        }
                    } else {
                        This.$Modal.warning({content: res.msg,title:"提示信息"});
                    }
                }
            });
        },

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

        //显示商品条码的商品明细
        detailAction(item,index) {
            let goodsId = '';
            if (this.tabVal === 'name1'){
                this.goodsMainType = this.differenceRecordingList[index].goodsMainType;
                goodsId = this.differenceRecordingList[index].goodsId;
            }else if (this.tabVal === 'name2'){
                this.goodsMainType = this.unDifferenceRecordingList[index].goodsMainType;
                goodsId = this.unDifferenceRecordingList[index].goodsId;
            }else {
                return false;
            }
            var ids = {
                goodsId: goodsId,
                commodityId: '',
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
            this.productDetailModalClick(e);
        },

        modalCancel(e) {
            // this.productDetailModalClick(e);
        },

        save(params){
            let This = this;

            if (This.differenceRecordingList && This.differenceRecordingList.length > 0){
                This.differenceRecordingList[0].type = params;
                if (params === '1'){
                    for (let i = 0; i < This.differenceRecordingList.length; i++){
                        if (!This.differenceRecordingList[i].reportProfitLossReason || !This.differenceRecordingList[i].processingAdvice){
                            console.log(This.differenceRecordingList[i].reportProfitLossReason,This.differenceRecordingList[i].processingAdvice)
                            This.$Modal.info({
                                title: "提示信息",
                                content: "在第"+ (i+1) +"行中报告盈亏原因或拟处理意见为空",
                            })
                            return false;
                        }
                    }
                }
            }

            let data = Object.assign({},This.body,{differenceRecordingList:This.differenceRecordingList})

            $.ajax({
                type: "post",
                url: contextPath + '/inventoryReport/update',
                contentType: 'application/json',
                data: JSON.stringify(data),
                dataType: "json",
                success: function (data) {
                    This.htHaveChange = false;
                    if (data.code === "100100") {
                        if (params == 1) {
                            $(".is-submit-disabled").css("pointer-events", "none").css({"color": "#bbbec4"})
                            This.isReasonAndOpinionShow = true;
                            This.isEdit('N');
                            This.body = data.data;
                            This.body.docStatus = 2;
                        }
                        This.$Modal.success({
                            title: "提示！",
                            content: "操作成功",
                        })
                    }else {
                        This.$Modal.warning({
                            title: "提示信息",
                            content: "操作失败",
                        })
                    }
                },
                error: function () {
                    This.$Modal.warning({
                        title: "提示信息",
                        content: "系统异常",
                    })
                }
            })
        },

        //生成调整单据
        createAdjust(){
            let This = this;
            if (This.body.docStatus != 4){
                this.$Modal.info({
                    title: '提示信息',
                    content: '该单据未审核完成，不可生成调整单！'
                });
                return;
            }
            if (This.body.generateStatus == 1){
                this.$Modal.info({
                    title: '提示信息',
                    content: '该单据已生成调整单，不可再次生成！'
                });
                return;
            }
            $.ajax({
                type: "post",
                url: contextPath + '/inventoryReport/createAdjust',
                contentType: 'application/json',
                data: JSON.stringify(This.body),
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        This.body.generateStatus = 1
                        This.$Modal.success({
                            title: "提示信息",
                            content: "操作成功",
                        })
                    }else {
                        This.$Modal.warning({
                            title: "提示信息",
                            content: "操作失败",
                        })
                    }
                },
                error: function () {
                    This.$Modal.warning({
                        title: "提示信息",
                        content: "操作失败",
                    })
                }
            })
        },

        tabsSwitch(tab){
            this.tabVal = tab;
        },

        //盈亏原因、拟处理意见弹出框点击确认事件
        modalReasonDone(){
            this.htHaveChange = true;
            console.log(333)
            this.differenceRecordingList[this.selectIndex].reportProfitLossReason = this.reportProfitLossReason;
            this.differenceRecordingList[this.selectIndex].processingAdvice = this.processingAdvice;
        },
        modalReasonCancel(){},
        showTheReason(item,index){
            this.selectIndex = index;
            this.goodsBarCode = item.goodsBarCode;
            this.reportProfitLossReason = item.reportProfitLossReason;
            this.processingAdvice = item.processingAdvice;
            this.frameTab = true
        },
        showProposedAdoption(){
            this.frameTab = true
        },

        //获取盘点类型
        getInventroyType(params){
            this.selectInventoryType = getCodeList('inventory_inventoryType')
            this.body.inventoryType = params;
        },

        queryReportDetail(params){
            let This = this;

            if (!params.reportNo){
                This.$Modal.info({
                    title: "提示信息",
                    content: "此盘点报告单编号数据存在异常！",
                })
                return false;
            }

            $.ajax({
                type: "post",
                url: contextPath + '/inventoryReport/info',
                contentType: 'application/json',
                data: JSON.stringify({reportNo:params.reportNo}),
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        This.body = data.data
                        This.getInventroyType(This.body.inventoryType)
                        This.differenceRecordingList = data.data.differenceRecordingList;
                        This.unDifferenceRecordingList = data.data.unDifferenceRecordingList;

                        if (This.params.type === 'query' || This.body.docStatus != 1) {
                            //$(".is-disabled").css("pointer-events", "none").css({"color": "#bbbec4"})
                            $(".is-submit-disabled").css("pointer-events", "none").css({"color": "#bbbec4"})
                            This.isEdit('N');
                            This.isReasonAndOpinionShow = true;
                        }

                        if (This.body.docStatus == 1){
                            $(".is-submit-disabled").css({"pointer-events": "auto "}).css({"color": '#495060'})
                            This.isReasonAndOpinionShow = false;
                            This.isEdit('Y');
                        }

                        if (This.body.docStatus == 4){
                            This.isStampShow = true;
                            $(".is-disabled").css({"pointer-events": "auto "}).css({"color": '#495060'})
                        }
                    }
                },
                error: function () {
                    This.$Modal.warning({
                        title: '提示信息',
                        content: '服务器出错了！'
                    });
                }
            })
        },

        //关闭
        exit(close) {
            if(close === true){
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
                return;
            }
            if(this.handlerClose()){
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
            }
        },
        //关闭新增页面
        handlerClose(){
            if((!this.body.docStatus || this.body.docStatus == 1) && (this.htHaveChange || accessVm.htHaveChange) && this.params.type != 'query'){
                this.$nextTick(()=>{
                    this.$refs.closeModalRef.showCloseModal();
                });
                return false;
            }
            return true;
        },
        closeModal(type){
            if(type === 'yes'){//提交数据
                this.save('0');
            }else if(type === 'no'){//关闭页面
                this.exit(true);
            }
        }
    },

    created(){
        this.params = window.parent.params.params;
        this.openTime = window.parent.params.openTime;
        window.handlerClose = this.handlerClose;
        $(".is-disabled").css("pointer-events", "none").css({"color": "#bbbec4"})

        this.queryReportDetail(this.params);
    }
})