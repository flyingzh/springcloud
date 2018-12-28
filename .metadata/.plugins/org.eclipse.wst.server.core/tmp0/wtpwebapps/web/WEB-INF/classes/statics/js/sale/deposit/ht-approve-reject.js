Vue.component("ht-approve-reject",{
    props:{
        //触发审核弹窗流程
        trigger: Boolean,

        //modalType  approve:审核弹窗  reject:驳回弹窗
        modalType: String,


        //单据 id
        receiptId: String,

        //单据当前审核状态
        receiptStatus: String,

        //审核级别列表，给显示审核进度用的
        stepList: Array,

        //初始化审核弹窗内数据
        urlInitApprove: String,

        //检测权限
        urlCheck: String,

        //改变当前节点以及审核记录 更新单据
        urlApprove: String,
        //单据状态 对应的映射map,默认是按照进销存 常量标准定义
        //key值关系：tmp_save-暂存 await_check-待审核 checking审核中 auditing-已审核 reject-驳回
        //如若以后有改动 也可以传自定义的关系。但是key值要与上述对应
        statusMap:{
            require: false,
            type: Object,
            default(){
                return {
                    'tmp_save':'1',
                    'await_check':'2',
                    'checking':'3',
                    'auditing':'4',
                    'reject':'5',
                };
            }
        },
        urlTableData:{
            require: false,
            type: String,
            default(){
                return '';
            }
        },
        tableData:{
            require: false,
            type: Array,
            default(){
                return [];
            }
        },
    },
    data(){
        return {
            isVisible: false,
            dataInfo: {},
            currentStep: '',
            nextStep: '',
            stepsMap: {
                0: '开始',
                1: '一级审核',
                2: '二级审核',
                3: '三级审核',
                4: '四级审核',
                5: '五级审核',
                6: '六级审核',
                7: '结束'
            },
            showApprove:false,
            showReject:false,

        }
    },
    template:`<div v-clock>
    <modal
    title="审核"
    v-model="showApprove"
    :closable="false"
    @on-ok="getApproveInfo"
    @on-cancel="isVisible = false"
    >
        <div>
        <p class="mg-bm-md">
        <span>当前节点：{{currentStep}}</span>
        <span class="mg-lf-sbg">下级节点：{{nextStep}}</span>
        </p>
        <span>审核意见</span>
        <i-input type="textarea" :rows="4" v-model="dataInfo.approvalInfo" placeholder="请输入审核意见"></i-input>
        </div>
    </modal>
    <modal
    title="驳回"
    v-model="showReject"
    :closable="false"
    @on-ok="getRejectInfo"
    @on-cancel="isVisible = false">
        <div>
        <radio-group v-model="dataInfo.approvalResult" class="mg-bm-md" >
        <radio label="0">驳回上一级</radio>
        <radio label="-1" class="mg-lf-sbg">驳回到开始级次</radio>
        </radio-group>
        <p style="font-weight: 600" class="mg-bm-md">驳回意见</p>
        <i-input  type="textarea" :rows="4" v-model="dataInfo.approvalInfo" placeholder="请输入驳回意见"></i-input>
        </div>
    </modal>
    </div>`,
    methods:{
        //检测是否有权限
        checkRight() {
            let vm = this;

            console.log("receiptStatus:"+vm.receiptStatus)
            //首先检查单据状态
            let auditedStatus = vm.statusMap['auditing'];
            if(vm.receiptStatus == auditedStatus){
                vm.$Modal.warning({
                    title: '提示',
                    content: (vm.modalType == 'reject')?'已审核的单据不能驳回!':'单据已审核',
                });
                return false;
            }
            let tmpSaveStatus = vm.statusMap['tmp_save'];
            if( !vm.receiptId || vm.receiptStatus  == tmpSaveStatus){
                vm.$Modal.warning({
                    title: '提示',
                    content: '请先提交单据!',
                });
                return false;
            }
            $.ajax({
                type: "POST",
                url: vm.urlCheck,
                contentType: 'application/json',
                data: JSON.stringify({receiptsId: vm.receiptId}),
                dataType: "json",
                success: function(data) {
                    //根据modalType 做不同的处理
                    if(vm.modalType == 'approve')  vm.approvalHandler(data);
                    if(vm.modalType == 'reject')  vm.rejectHandler(data);
                },
                error: function(err){
                    vm.$Modal.error({
                        title: '提示',
                        content: '服务器出错'
                    });
                }
            })
        },
        rejectHandler(data){
            let vm = this;
            if (data.code === "100515") {
                //不走审核，直接通过
                vm.$Modal.error({
                    title: '提示',
                    content: '驳回成功'
                });
                vm.$emit('on-auto-approve', {
                    result: data,
                });
            }
            if (data.code === "100514") {
                vm.isVisible = false;
                vm.$Modal.error({
                    title: '提示',
                    content: data.data === 0 ? "该单据已被驳回到申请人，待申请人提交!":"您没有【"+ vm.stepsMap[data.data] +"】的驳回权限"
                });
            }
            if (data.code === "100100") {
                vm.initApproval();
                vm.isVisible = true;
            }

        },
        approvalHandler(data){
            let vm = this;
            if (data.code === "100515") {
                //不走审核，直接通过
                vm.$Modal.success({
                    title: '提示',
                    content: '审核成功'
                });
                vm.$emit('on-auto-approve', {
                    result: data,
                });
            }
            if (data.code === "100514") {
                vm.isVisible = false;
                vm.$Modal.error({
                    title: '提示',
                    content: data.data === 0 ? "该单据已被驳回到申请人，待申请人提交!":"您没有【"+ vm.stepsMap[data.data] +"】的审核权限"
                });
            }
            if (data.code === "100100") {
                vm.initApproval();
                vm.isVisible = true;
            }
        },
        initApproval(){
            let vm = this;
            $.ajax({
                type: "post",
                url: vm.urlInitApprove,
                data: JSON.stringify({receiptsId: vm.receiptId}),
                dataType: "json",
                contentType:'application/json',
                success: function (data) {
                    console.log("执行了")

                    if ($.isEmptyObject(data.data)) {
                        return false;
                    }
                    var process = data.data.list;
                    var stepsMap = vm.stepsMap;
                    for (let i = 0; i < process.length; i++) {
                        var idx = process[i].processLevel;
                        process[i].processLevel = stepsMap[idx];
                    }
                    process.unshift({
                        processLevel:"开始"
                    });
                    process.push({
                        processLevel:"结束"
                    });

                    vm.stepList = process;
                    vm.$emit("update:stepList", process);
                    var curr = process[1].currentLevel;
                    var isLastStep = curr === data.data.levelLength;
                    var levelLength = data.data.levelLength;
                    if (isLastStep) {
                        for (let i = 0; i < process.length; i++) {
                            process[i].currentLevel = process.length - 1;
                        }
                        vm.$emit('step-info',{
                            currentStep:vm.currentStep,
                            nextStep:vm.nextStep
                        })
                        vm.$emit("update:stepList", process);
                    } else {
                        vm.currentStep = vm.stepsMap[curr+1];
                        if(curr + 1 == levelLength){
                            vm.nextStep = vm.stepsMap[7];
                        }else {
                            vm.nextStep = vm.stepsMap[curr + 2];
                        }

                        vm.$emit('step-info',{
                            currentStep:vm.currentStep,
                            nextStep:vm.nextStep
                        })
                    }
                },
                error: function () {
                    alert('服务器出错啦');
                }
            })
        },
        //审核点击确定
        getApproveInfo() {
            let vm = this;
            vm.dataInfo.receiptsId = vm.receiptId;
            vm.dataInfo.approvalResult = '1';
            $.ajax({
                type: "POST",
                //改变当前节点 以及审核记录 更新单据
                url: this.urlApprove,
                contentType: 'application/json',
                data: JSON.stringify(vm.dataInfo),
                dataType: "json",
                success: function (data) {

                    if (data.code === "100100") {
                        vm.$Modal.success({
                            title: "提示",
                            content: "审核成功!"
                        });
                        vm.loadTableData();
                    } else {
                        vm.$Modal.warning({
                            title: "提示",
                            content: "审核失败!"
                        });
                    }
                    vm.isVisible = false;
                    vm.$emit('on-approve', {
                        action: 'approve',
                        result: data
                    });
                },
                error: function (err) {
                    vm.$Modal.warning({
                        title: "提示",
                        content: "服务器出错!"
                    });
                }
            });
        },
        //驳回点击确定
        getRejectInfo() {
            let vm = this;
            vm.dataInfo.receiptsId = vm.receiptId;
            $.ajax({
                type: "POST",
                //改变当前节点 以及审核记录 更新单据
                url: this.urlApprove,
                contentType: 'application/json',
                data: JSON.stringify(vm.dataInfo),
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        vm.$Modal.success({
                            title: "提示",
                            content: "驳回成功!"
                        });
                        vm.loadTableData();
                    } else {
                        vm.$Modal.warning({
                            title: "提示",
                            content: "驳回失败!"
                        });
                    }
                    vm.isVisible = false;
                    vm.$emit('on-reject', {
                        action: 'reject',
                        result: data
                    });
                },
                error: function (err) {
                    vm.$Modal.warning({
                        title: "提示",
                        content: "服务器出错!"
                    });
                }
            })
        },
        loadTableData() {
            let vm = this;
            let stepsMap = vm.stepsMap;
            if(!vm.urlTableData){
                return false;
            }
            $.ajax({
                type: "POST",
                url: this.urlTableData,
                data: {receiptsId:vm.receiptId},
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100" && data.data.length > 0) {
                        let _arr= data.data.map(item=>
                            Object.assign({},{
                                approvalResult:item.approvalResult === 1 ? "审核": "驳回",
                                currentLevel: stepsMap[item.currentLevel],
                                nextLevel:stepsMap[item.nextLevel],
                                createName:item.createName,
                                approvalInfo:item.approvalInfo,
                                createTime:item.createTime
                            })
                        );
                        vm.$emit("update:tableData", _arr);
                    }
                },
                error: function (err) {
                }
            })
        },

    },
    computed:{
    },
    watch:{
        trigger(){
            this.checkRight();
            if(this.modalType == 'approve'){
                this.dataInfo.approvalInfo = '';
            }
            if(this.modalType == 'reject'){
                this.dataInfo.approvalInfo = '';
                this.dataInfo.approvalResult ='0';
            }


        },
        isVisible(){
            if(this.modalType == 'approve'){
                this.showApprove = this.modalType == 'approve' && this.isVisible == true;
            }else {
                this.showApprove = false;
            }
            if(this.modalType == 'reject'){
                this.showReject = this.modalType == 'reject' && this.isVisible == true;
            }else {
                this.showReject = false;
            }
        },
        receiptStatus(){
            let _this = this;
            console.log(_this.receiptId , _this.receiptStatus)
            let awaitCheckStatus = _this.statusMap['await_check'];
            let checkingStatus = _this.statusMap['checking'];
            let awaitingStatus = _this.statusMap['auditing'];
            let rejectStatus = _this.statusMap['reject'];
            if(_this.receiptId && _this.receiptStatus == awaitCheckStatus){
                setTimeout(()=>{_this.initApproval();},1000);
                _this.loadTableData();
            }

            if(_this.receiptId &&
                (_this.receiptStatus == checkingStatus
                    || _this.receiptStatus == awaitingStatus
                    || _this.receiptStatus == rejectStatus)){
                _this.initApproval();
                _this.loadTableData();
            }

        }

    },
    mounted(){
    }
})


//用法
/*
<ht-approve-reject
    :trigger="trigger"
	:modal-type="modalType"
	:receipt-id="somereceiptid"
	:receipt-status="receiptStatus"
	:approved-dict="approvedDict"
    :step-list.sync="stepList"
    :url-check="contextPath+'/testItemController/findUserOperation'"
	:url-init-approve="contextPath+'/testItemController/queryProcessByReceiptsId'"
	:url-approve="contextPath + '/saleBillController/submitApproval'"
	@on-auto-approve="onAutoApprove"
	@on-approve="onApprove"
    @on-reject="onReject">
</ht-approve-reject>
*/

//modalType  approve:审核弹窗  reject:驳回弹窗